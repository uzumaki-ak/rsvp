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
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function createEvent(formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const eventDate = formData.get("eventDate") as string;
  const location = formData.get("location") as string;
  const creatorName = formData.get("creatorName") as string;
  const creatorEmail = formData.get("creatorEmail") as string;

  // Generate unique slug
  const { data: slugData, error: slugError } = await supabase
    .rpc('generate_unique_slug', { title_text: title });

  if (slugError) {
    console.error("Error generating slug:", slugError);
    return { success: false, message: "Failed to generate event URL" };
  }

  const slug = slugData;

  const { data, error } = await supabase
    .from("events")
    .insert([{ 
      title, 
      description, 
      event_date: eventDate, 
      event_location: location, 
      creator_name: creatorName, 
      creator_email: creatorEmail,
      slug 
    }])
    .select()
    .single();

  if (error) {
    console.error("Error creating event:", error);
    return { success: false, message: "Failed to create event" };
  }

  // Generate admin token
  const adminToken = Buffer.from(`${data.id}:${creatorEmail}:${process.env.ADMIN_SECRET || 'fallback'}`).toString('base64');
  const adminUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/events/${slug}/admin?token=${adminToken}`;
  const rsvpUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/rsvp/${slug}`;

  // Send email with both links to creator
  try {
    await resend.emails.send({
      from: "RSVP <onboarding@resend.dev>",
      to: creatorEmail,
      subject: `Your RSVP Event "${title}" is Ready!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your Event is Live! 🎉</h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">${title}</h3>
            <p><strong>Date:</strong> ${new Date(eventDate).toLocaleDateString()}</p>
            <p><strong>Location:</strong> ${location}</p>
          </div>

          <div style="margin: 30px 0;">
            <h3>Share this link with your guests:</h3>
            <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 10px 0;">
              <a href="${rsvpUrl}" style="color: #1976d2; text-decoration: none; font-weight: bold;">
                ${rsvpUrl}
              </a>
            </div>
          </div>

          <div style="margin: 30px 0;">
            <h3>Manage your event (KEEP THIS PRIVATE):</h3>
            <div style="background-color: #fff3e0; padding: 15px; border-radius: 5px; margin: 10px 0;">
              <a href="${adminUrl}" style="color: #f57c00; text-decoration: none; font-weight: bold;">
                View Responses & Manage Event
              </a>
            </div>
            <p style="font-size: 12px; color: #666;">
              ⚠️ Keep this admin link private - anyone with this link can view all responses
            </p>
          </div>

          <p style="color: #666; font-size: 14px;">
            You'll receive email notifications whenever someone RSVPs to your event.
          </p>
        </div>
      `,
    });
  } catch (emailError) {
    console.error("Error sending email:", emailError);
  }

  return { 
    success: true, 
    message: "Event created successfully",
    slug: data.slug,
    title: data.title,
    id: data.id,
    adminUrl
  };
}