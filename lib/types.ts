// types/rsvp.ts
export interface RSVP {
  id: string;
  name: string;
  email: string;
  accompany: number;
  attendance: "yes" | "no" | "maybe";
  created_at: string; 
  event_id: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string | Date;
  event_location: string;
  creator_name: string;
  creator_email: string;
  slug: string;
  created_at: string;
}