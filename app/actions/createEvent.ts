// "use server";

// import { createClient } from "../utils/supabase/server";

// export async function createEvent(formData: FormData) {
//   const supabase = await createClient();

//   const title = formData.get("title") as string;
//   const description = formData.get("description") as string;
//   const eventDate = formData.get("eventDate") as string;
//   const location = formData.get("location") as string;
//   const creatorName = formData.get("creatorName") as string;
//   const creatorEmail = formData.get("creatorEmail") as string;

//   // Generate unique slug
//   const { data: slugData, error: slugError } = await supabase
//     .rpc('generate_unique_slug', { title_text: title });

//   if (slugError) {
//     console.error("Error generating slug:", slugError);
//     return { success: false, message: "Failed to generate event URL" };
//   }

//   const slug = slugData;

//   const { data, error } = await supabase
//     .from("events")
//     .insert([{ 
//       title, 
//       description, 
//       event_date: eventDate, 
//       event_location: location, 
//       creator_name: creatorName, 
//       creator_email: creatorEmail,
//       slug 
//     }])
//     .select()
//     .single();

//   if (error) {
//     console.error("Error creating event:", error);
//     return { success: false, message: "Failed to create event" };
//   }

//   return { 
//     success: true, 
//     message: "Event created successfully",
//     slug: data.slug,
//     title: data.title,
//     id: data.id
//   };
// }\


//
"use server";

import { createClient } from "../utils/supabase/server";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
import { Resend } from "resend";

export async function createEvent(formData: FormData) {
  const supabase = await createClient();
  
  // Get form data
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const eventDate = formData.get("eventDate") as string;
  const location = formData.get("location") as string;
  const creatorName = formData.get("creatorName") as string;
  const creatorEmail = formData.get("creatorEmail") as string;

  // Generate a unique slug (using your existing RPC function)
  const { data: slugData, error: slugError } = await supabase
    .rpc('generate_unique_slug', { title_text: title });

  if (slugError) {
    console.error("Error generating slug:", slugError);
    // Fallback to manual slug generation
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const randomString = randomBytes(4).toString("hex");
    const slug = `${baseSlug}-${randomString}`;
    
    // Use fallback slug
    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .insert([
        {
          title,
          description,
          event_date: eventDate,
          event_location: location,
          creator_name: creatorName,
          creator_email: creatorEmail,
          slug,
        },
      ])
      .select()
      .single();

    if (eventError) {
      console.error("Event creation error:", eventError);
      return {
        success: false,
        message: "Failed to create event. Please try again.",
      };
    }

    return await finalizeEvent(eventData, creatorEmail, creatorName);
  }

  const slug = slugData;

  // Create event in database
  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .insert([
      {
        title,
        description,
        event_date: eventDate,
        event_location: location,
        creator_name: creatorName,
        creator_email: creatorEmail,
        slug,
      },
    ])
    .select()
    .single();

  if (eventError) {
    console.error("Event creation error:", eventError);
    return {
      success: false,
      message: "Failed to create event. Please try again.",
    };
  }

  return await finalizeEvent(eventData, creatorEmail, creatorName);
}

async function finalizeEvent(eventData: any, creatorEmail: string, creatorName: string) {
  // Generate admin token
  const adminToken = Buffer.from(
    `${eventData.id}:${creatorEmail}:${process.env.ADMIN_SECRET || "fallback"}`
  ).toString("base64");

  // Get base URLs
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const deployedUrl = "https://rsvpify.vercel.app";
  
  // Create URLs for both environments
  const localShareableUrl = `http://localhost:3000/rsvp/${eventData.slug}`;
  const deployedShareableUrl = `${deployedUrl}/rsvp/${eventData.slug}`;
  
  const localAdminUrl = `http://localhost:3000/events/${eventData.slug}/admin?token=${adminToken}`;
  const deployedAdminUrl = `${deployedUrl}/events/${eventData.slug}/admin?token=${adminToken}`;

  // Send email with Resend
  try {
    await sendEventEmail(
      creatorEmail,
      creatorName,
      eventData.title,
      eventData.event_date,
      eventData.event_location,
      localShareableUrl,
      localAdminUrl,
      deployedShareableUrl,
      deployedAdminUrl
    );
  } catch (emailError) {
    console.error("Email sending error:", emailError);
    // Continue even if email fails - user still sees the links on the page
  }

  revalidatePath("/admin/rsvps");

  return {
    success: true,
    slug: eventData.slug,
    title: eventData.title,
    adminUrl: localAdminUrl, // Return local admin URL for the form
    message: "Event created successfully! Check your email for the links.",
  };
}

async function sendEventEmail(
  email: string,
  name: string,
  eventTitle: string,
  eventDate: string,
  eventLocation: string,
  localShareableUrl: string,
  localAdminUrl: string,
  deployedShareableUrl: string,
  deployedAdminUrl: string
) {
  // Initialize Resend
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  const formattedDate = new Date(eventDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  await resend.emails.send({
    from: "RSVP Manager <onboarding@resend.dev>",
    to: email,
    subject: `Your RSVP Event "${eventTitle}" is Ready!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
          .container { padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px; }
          .event-card { background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
          .link-card { background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 15px 0; border: 1px solid #bae6fd; }
          .admin-card { background: #fffbeb; padding: 20px; border-radius: 8px; margin: 15px 0; border: 1px solid #fde68a; }
          .warning { background: #fef2f2; padding: 10px; border-radius: 6px; border: 1px solid #fecaca; color: #dc2626; font-size: 14px; }
          .url-box { background: white; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb; margin: 10px 0; font-family: monospace; font-size: 14px; word-break: break-all; }
          .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px 5px; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Your Event is Ready!</h1>
            <p>Share it with your guests and start tracking RSVPs</p>
          </div>
          
          <div class="content">
            <div class="event-card">
              <h2 style="margin-top: 0; color: #92400e;">${eventTitle}</h2>
              <p><strong>📅 Date:</strong> ${formattedDate}</p>
              <p><strong>📍 Location:</strong> ${eventLocation}</p>
            </div>

            <h3>🔗 Share with Guests</h3>
            <div class="link-card">
              <p><strong>For Local Testing:</strong></p>
              <div class="url-box">${localShareableUrl}</div>
              <p><strong>For Live Event (Deployed):</strong></p>
              <div class="url-box">${deployedShareableUrl}</div>
              <p style="margin-top: 10px;">
                <a href="${deployedShareableUrl}" class="button">Open Live Event</a>
                <a href="${localShareableUrl}" class="button" style="background: #6b7280;">Open Local</a>
              </p>
            </div>

            <h3>🔒 Admin Dashboard (Keep Private)</h3>
            <div class="admin-card">
              <div class="warning">
                ⚠️ <strong>IMPORTANT:</strong> Keep this admin link private. Anyone with this link can view all RSVP responses.
              </div>
              <p><strong>Local Admin:</strong></p>
              <div class="url-box">${localAdminUrl}</div>
              <p><strong>Live Admin (Deployed):</strong></p>
              <div class="url-box">${deployedAdminUrl}</div>
              <p style="margin-top: 10px;">
                <a href="${deployedAdminUrl}" class="button" style="background: #dc2626;">Open Live Admin</a>
                <a href="${localAdminUrl}" class="button" style="background: #6b7280;">Open Local Admin</a>
              </p>
            </div>

            <h3>📝 Next Steps</h3>
            <ol>
              <li>Share the <strong>"Share with Guests"</strong> link with your invitees</li>
              <li>Use the <strong>Admin Dashboard</strong> to track responses in real-time</li>
              <li>You'll receive email notifications for each RSVP</li>
              <li>Export your guest list when ready</li>
            </ol>

            <div class="footer">
              <p>This email was sent from RSVP Manager. If you didn't create this event, please ignore this email.</p>
              <p>Need help? Contact us at <a href="mailto:anikeshuzumaki@gmail.com">anikeshuzumaki@gmail.com</a></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}