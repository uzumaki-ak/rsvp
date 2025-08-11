import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarPlus, Users } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container mx-auto mt-8 p-4 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">RSVP Manager</h1>
        <p className="text-xl text-gray-600">Create and manage event RSVPs with ease</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <CalendarPlus className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <CardTitle>Create Event</CardTitle>
            <CardDescription>
              Create a new RSVP event and get a shareable link for your guests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/create">
              <Button className="w-full" size="lg">
                Create New Event
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <CardTitle>Manage Events</CardTitle>
            <CardDescription>
              View and manage your existing events and RSVPs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin">
              <Button variant="outline" className="w-full" size="lg">
                View All Events
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <Card className="bg-gray-50">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">How it works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium">1. Create</div>
                <div className="text-gray-600">Set up your event details</div>
              </div>
              <div>
                <div className="font-medium">2. Share</div>
                <div className="text-gray-600">Send the link to your guests</div>
              </div>
              <div>
                <div className="font-medium">3. Track</div>
                <div className="text-gray-600">Monitor responses in real-time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}