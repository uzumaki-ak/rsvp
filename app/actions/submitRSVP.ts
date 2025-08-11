// 'use server'

// import { createClient } from "../utils/supabase/server"

// const async function submitRSVP(formdData: FormData) {
//   const supabase = createClient();

//   const name  = formdData.get('name');
//   const email = formdData.get('email');
//   const accompany = formdData.get('accompany');
//   const attendence = formdData.get('attendence');

// const {data, error} = await supabase.from("rsvps").insert([{
//   name,
//   email,
//   attendence
// }])
// console.log(data, 'data_supabase');

// if(error) {
//   console.log('error inserting rsvp', error);
//   return {success: false, message: 'Error inserting rsvp', error}
  
// }
// return {success:true, message: 'Success'}
// }

// 'use server';

// import { createClient } from "../utils/supabase/server";
// import { strings } from "../utils/strings";
// import { Resend } from "resend";
// async function submitRSVP(formData: FormData) {
//   const supabase = createClient();

//   const name = formData.get('name');
//   const email = formData.get('email');
//   const accompany = formData.get('accompany');
//   const attendence = formData.get('attendence');

//   // console.log(formData, 'formData');
  

//   const { data, error } = await (await supabase).from("rsvps").insert([
//     {
//       name,
//       email,
//       accompany,
//       attendence,
//     },
//   ]);

//   console.log(data, 'data_supabase');

//   if (error) {
//     console.log('error inserting rsvp', error);
//     return { success: false, message: 'Error inserting rsvp', error };
//   }

//   return { success: true, message: 'Success' };
// }

// export default submitRSVP;



// "use server";

// import { strings } from "../utils/strings";
// import { createClient } from "../utils/supabase/server";
// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function submitRSVP(formData: FormData) {
//   const supabase = await createClient();

//   const name = formData.get("name");
//   const email = formData.get("email");
//   const accompany = formData.get("accompany");
//   const attendance = formData.get("attendance");

//   const { data, error } = await supabase
//     .from("rsvps")
//     .insert([{ name, email, accompany, attendance }]);
//   console.log(data, "data_submitRSVP");

//   if (error) {
//     console.error("Error inserting RSVP:", error);
//     return { success: false, message: "Failed to submit RSVP", error };
//   }

//   // Send email notification
//   if (!strings.sendToEmail) {
//     console.error("No email to send to");
//     return { success: false, message: "No email to send to" };
//   }
//   if (!error) {
//     try {
//       await resend.emails.send({
//         from: "RSVP <onboarding@resend.dev>",
//         to: strings.sendToEmail,
//         subject: "New RSVP Submission",
//         html: `
//         <h1>New RSVP Submission</h1>
//         <p><strong>Name:</strong> ${name}</p>
//         <p><strong>Email:</strong> ${email}</p>
//         <p><strong>Number of Guests:</strong> ${accompany}</p>
//         <p><strong>Attendance:</strong> ${attendance}</p>
//       `,
//       });
//     } catch (error) {
//       console.error("Error sending email:", error);
//     }
//   }

//   return { success: true, message: "RSVP submitted successfully" };
// }



// "use server";

// import { createClient } from "../utils/supabase/server";
// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function submitRSVP(formData: FormData) {
//   const supabase = await createClient();

//   const name = formData.get("name") as string;
//   const email = formData.get("email") as string;
//   const accompany = formData.get("accompany") as string;
//   const attendance = formData.get("attendance") as string;
//   const eventId = formData.get("eventId") as string;

//   // First, get event details to send email to event creator
//   const { data: eventData, error: eventError } = await supabase
//     .from("events")
//     .select("*")
//     .eq("id", eventId)
//     .single();

//   if (eventError) {
//     console.error("Error fetching event:", eventError);
//     return { success: false, message: "Event not found" };
//   }

//   // Insert RSVP
//   const { data, error } = await supabase
//     .from("rsvps")
//     .insert([{ 
//       name, 
//       email, 
//       accompany: parseInt(accompany) || 0, 
//       attendance, 
//       event_id: eventId 
//     }]);

//   console.log(data, "data_submitRSVP");

//   if (error) {
//     console.error("Error inserting RSVP:", error);
//     return { success: false, message: "Failed to submit RSVP", error };
//   }

//   // Send email notification to event creator
//   if (eventData?.creator_email) {
//     try {
//       const totalGuests = (parseInt(accompany) || 0) + (attendance === 'yes' ? 1 : 0);
//       const attendanceText = attendance === 'yes' ? 'Will Attend' : 'Will Not Attend';
      
//       await resend.emails.send({
//         from: "RSVP <onboarding@resend.dev>",
//         to: eventData.creator_email,
//         subject: `New RSVP for ${eventData.title}`,
//         html: `
//           <h2>New RSVP Submission</h2>
//           <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
//             <h3 style="margin-top: 0; color: #333;">${eventData.title}</h3>
//             <p style="margin: 5px 0;"><strong>Guest Name:</strong> ${name}</p>
//             <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
//             <p style="margin: 5px 0;"><strong>Additional Guests:</strong> ${accompany || 0}</p>
//             <p style="margin: 5px 0;"><strong>Total Guests:</strong> ${totalGuests}</p>
//             <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: ${attendance === 'yes' ? '#22c55e' : '#ef4444'};">${attendanceText}</span></p>
//           </div>
//           <p style="color: #666; font-size: 14px;">
//             Event Date: ${new Date(eventData.event_date).toLocaleDateString('en-US', { 
//               weekday: 'long', 
//               year: 'numeric', 
//               month: 'long', 
//               day: 'numeric' 
//             })}<br>
//             Location: ${eventData.event_location}
//           </p>
//         `,
//       });
//     } catch (error) {
//       console.error("Error sending email:", error);
//       // Don't fail the RSVP submission if email fails
//     }
//   }

//   return { success: true, message: "RSVP submitted successfully" };
// }

//
"use server";

import { createClient } from "../utils/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitRSVP(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const accompany = formData.get("accompany") as string;
  const attendance = formData.get("attendance") as string;
  const eventId = formData.get("eventId") as string;

  // First, get event details to send email to event creator
  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single();

  if (eventError) {
    console.error("Error fetching event:", eventError);
    return { success: false, message: "Event not found" };
  }

  // Insert RSVP
  const { data, error } = await supabase
    .from("rsvps")
    .insert([{ 
      name, 
      email, 
      accompany: parseInt(accompany) || 0, 
      attendance, 
      event_id: eventId 
    }]);

  console.log(data, "data_submitRSVP");

  if (error) {
    console.error("Error inserting RSVP:", error);
    return { success: false, message: "Failed to submit RSVP", error };
  }

  // Send email notification to event creator
  if (eventData?.creator_email) {
    try {
      const totalGuests = (parseInt(accompany) || 0) + (attendance === 'yes' ? 1 : 0);
      const attendanceText = attendance === 'yes' ? 'Will Attend' : 'Will Not Attend';
      
      await resend.emails.send({
        from: "RSVP <onboarding@resend.dev>",
        to: eventData.creator_email,
        subject: `New RSVP for ${eventData.title}`,
        html: `
          <h2>New RSVP Submission</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">${eventData.title}</h3>
            <p style="margin: 5px 0;"><strong>Guest Name:</strong> ${name}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 5px 0;"><strong>Additional Guests:</strong> ${accompany || 0}</p>
            <p style="margin: 5px 0;"><strong>Total Guests:</strong> ${totalGuests}</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: ${attendance === 'yes' ? '#22c55e' : '#ef4444'};">${attendanceText}</span></p>
          </div>
          <p style="color: #666; font-size: 14px;">
            Event Date: ${new Date(eventData.event_date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}<br>
            Location: ${eventData.event_location}
          </p>
        `,
      });
    } catch (error) {
      console.error("Error sending email:", error);
      // Don't fail the RSVP submission if email fails
    }
  }

  return { success: true, message: "RSVP submitted successfully" };
}