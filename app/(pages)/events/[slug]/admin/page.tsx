import { getEventBySlug, getEventRSVPs } from "@/app/actions/getEvent";
import { RSVPTable } from "@/app/components/RSVPTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Users, Share2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface EventAdminPageProps {
  params: Promise<{ slug: string }>; // Changed: params is now a Promise
}

export default async function EventAdminPage({ params }: EventAdminPageProps) {
  const { slug } = await params; // Added: await the params Promise
  
  const { success: eventSuccess, data: event } = await getEventBySlug(slug);
  
  if (!eventSuccess || !event) {
    notFound();
  }

  const { success: rsvpSuccess, data: rsvps } = await getEventRSVPs(event.id);
  
  const rsvpData = rsvpSuccess ? rsvps : [];
  const attendingCount = rsvpData?.filter(rsvp => rsvp.attendance === 'yes').length || 0;
  const totalGuests = rsvpData?.reduce((sum, rsvp) => 
    sum + (rsvp.attendance === 'yes' ? (rsvp.accompany || 0) + 1 : 0), 0) || 0;

  const shareableUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/rsvp/${event.slug}`;

  return (
    <div className="container mx-auto mt-8 p-4 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              {event.title}
            </CardTitle>
            <CardDescription>{event.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="h-4 w-4 text-gray-500" />
              {new Date(event.event_date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-500" />
              {event.event_location}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-gray-500" />
              Organized by {event.creator_name}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Event Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{attendingCount}</div>
              <div className="text-sm text-gray-500">People Attending</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{totalGuests}</div>
              <div className="text-sm text-gray-500">Total Guests</div>
            </div>
            <div className="pt-4 space-y-2">
              <Button 
                onClick={() => navigator.clipboard.writeText(shareableUrl)}
                className="w-full"
                variant="outline"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Copy Share Link
              </Button>
              <Link href={`/rsvp/${event.slug}`}>
                <Button className="w-full">
                  View RSVP Page
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>RSVP Responses</CardTitle>
          <CardDescription>
            All responses for {event.title}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RSVPTable data={rsvpData || []} />
        </CardContent>
      </Card>
    </div>
  );
}