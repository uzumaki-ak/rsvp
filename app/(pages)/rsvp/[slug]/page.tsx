import { getEventBySlug } from "@/app/actions/getEvent";
import DynamicRSVPForm from "@/app/components/DynamicRSVPForm";
import { notFound } from "next/navigation";

interface RSVPPageProps {
  params: { slug: string };
}

export default async function RSVPPage({ params }: RSVPPageProps) {
  const { success, data: event } = await getEventBySlug(params.slug);

  if (!success || !event) {
    notFound();
  }

  return <DynamicRSVPForm event={event} />;
}