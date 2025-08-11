// "use server";

// import { createClient } from "../utils/supabase/server";

// export async function getEventBySlug(slug: string) {
//   const supabase = await createClient();

//   const { data, error } = await supabase
//     .from("events")
//     .select("*")
//     .eq("slug", slug)
//     .single();

//   if (error) {
//     console.error("Error fetching event:", error);
//     return { success: false, message: "Event not found" };
//   }

//   return { success: true, data };
// }

// export async function getEventRSVPs(eventId: string) {
//   const supabase = await createClient();

//   const { data, error } = await supabase
//     .from("rsvps")
//     .select("*")
//     .eq("event_id", eventId);

//   if (error) {
//     console.error("Error fetching RSVPs:", error);
//     return { success: false, message: "Failed to fetch RSVPs" };
//   }

//   return { success: true, data };
// }


//
"use server";

import { createClient } from "../utils/supabase/server";

export async function getEventBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching event:", error);
    return { success: false, message: "Event not found" };
  }

  return { success: true, data };
}

export async function getEventRSVPs(eventId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("rsvps")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching RSVPs:", error);
    return { success: false, message: "Failed to fetch RSVPs" };
  }

  return { success: true, data };
}

export async function verifyAdminToken(token: string, eventId: string, creatorEmail: string): Promise<boolean> {
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const [tokenEventId, email, secret] = decoded.split(':');
    
    return secret === (process.env.ADMIN_SECRET || 'fallback') 
      && tokenEventId === eventId 
      && email === creatorEmail;
  } catch {
    return false;
  }
}
