import { getEventBySlug } from "@/app/actions/getEvent";
import DynamicRSVPForm from "@/app/components/DynamicRSVPForm";
import { notFound } from "next/navigation";

interface RSVPPageProps {
  params: Promise<{ slug: string }>; // Changed: params is now a Promise
}

export default async function RSVPPage({ params }: RSVPPageProps) {
  const { slug } = await params; // Added: await the params Promise
  
  const { success, data: event } = await getEventBySlug(slug); // Changed: use extracted slug

  if (!success || !event) {
    notFound();
  }

  return <DynamicRSVPForm event={event} />;
}