"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarPlus, Share2, BarChart3 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-5xl font-bold mb-6 text-gray-900">
            Simplify Your Event RSVPs
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Create events, share invites, and track guest responses — all in one
            place.
          </p>
          <Link href="/create">
            <Button size="lg" className="px-8 py-6 text-lg">
              Create Your First Event
            </Button>
          </Link>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="shadow-md hover:shadow-lg transition">
              <CardContent className="pt-8">
                <CalendarPlus className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <h3 className="font-semibold text-lg">1. Create</h3>
                <p className="text-gray-600 text-sm mt-2">
                  Fill in your event details and generate an RSVP form.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-md hover:shadow-lg transition">
              <CardContent className="pt-8">
                <Share2 className="h-12 w-12 mx-auto text-green-600 mb-4" />
                <h3 className="font-semibold text-lg">2. Share</h3>
                <p className="text-gray-600 text-sm mt-2">
                  Send your unique RSVP link to your guests.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-md hover:shadow-lg transition">
              <CardContent className="pt-8">
                <BarChart3 className="h-12 w-12 mx-auto text-purple-600 mb-4" />
                <h3 className="font-semibold text-lg">3. Track</h3>
                <p className="text-gray-600 text-sm mt-2">
                  View guest responses and attendance stats in real time.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-6">About Us</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            We built this RSVP platform to make event management effortless.
            Whether it’s a small gathering, an online class, or a big
            celebration, our tool helps you organize, invite, and track
            attendees without hassle.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-6 mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p>
            &copy; {new Date().getFullYear()} RSVP Manager. All rights reserved.
          </p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <Link href="/create" className="hover:underline">
              Create Event
            </Link>
            <a href="mailto:anikeshuzumaki@.com" className="hover:underline">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
