// "use client";

// import { RSVPTable } from "@/app/components/RSVPTable";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   CalendarDays,
//   MapPin,
//   Users,
//   Share2,
//   CalendarHeart,
// } from "lucide-react";
// import Link from "next/link";

// interface EventAdminClientProps {
//   event: {
//     title: string;
//     description: string;
//     event_date: string | Date;
//     event_location: string;
//     creator_name: string;
//     slug: string;
//   };
//   rsvpData: any[]; // Replace 'any' with a more specific type if available
//   attendingCount: number;
//   totalGuests: number;
//   shareableUrl: string;
// }

// export default function EventAdminClient({
//   event,
//   rsvpData,
//   attendingCount,
//   totalGuests,
//   shareableUrl,
// }: EventAdminClientProps) {
//   return (
//     <div className="container mx-auto mt-8 p-4 max-w-6xl">
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//         <Card className="lg:col-span-2">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <CalendarDays className="h-5 w-5" />
//               {event.title}
//             </CardTitle>
//             <CardDescription>{event.description}</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center gap-2 text-sm">
//               <CalendarHeart className="h-4 w-4 text-gray-500" />
//               {new Date(event.event_date).toLocaleDateString("en-US", {
//                 weekday: "long",
//                 year: "numeric",
//                 month: "long",
//                 day: "numeric",
//               })}
//             </div>
//             <div className="flex items-center gap-2 text-sm">
//               <MapPin className="h-4 w-4 text-gray-500" />
//               {event.event_location}
//             </div>
//             <div className="flex items-center gap-2 text-sm">
//               <Users className="h-4 w-4 text-gray-500" />
//               Organized by {event.creator_name}
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="text-lg">Event Stats</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="text-center">
//               <div className="text-3xl font-bold text-green-600">
//                 {attendingCount}
//               </div>
//               <div className="text-sm text-gray-500">People Attending</div>
//             </div>
//             <div className="text-center">
//               <div className="text-3xl font-bold text-blue-600">
//                 {totalGuests}
//               </div>
//               <div className="text-sm text-gray-500">Total Guests</div>
//             </div>
//             <div className="pt-4 space-y-2">
//               <Button
//                 onClick={() => navigator.clipboard.writeText(shareableUrl)}
//                 className="w-full mb-2"
//                 variant="outline"
//               >
//                 <Share2 className="h-4 w-4 mr-2" />
//                 Copy Share Link
//               </Button>
//               <Link href={`/rsvp/${event.slug}`}>
//                 <Button className="w-full">View RSVP Page</Button>
//               </Link>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>RSVP Responses</CardTitle>
//           <CardDescription>All responses for {event.title}</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <RSVPTable data={rsvpData || []} />
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

//
"use client";

import { RSVPTable } from "@/app/components/RSVPTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  MapPin,
  Users,
  Share2,
  CalendarHeart,
  Copy,
  Eye,
  Home,
  Moon,
  Sun,
  Download,
  Mail,
  CheckCircle,
  XCircle,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// Updated interface to match your actual data
interface RSVP {
  id: string;
  name: string;
  email: string;
  accompany: number;
  attendance: "yes" | "no" | "maybe";
  created_at: string;
  event_id: string;
}

interface EventAdminClientProps {
  event: {
    id?: string;
    title: string;
    description: string;
    event_date: string | Date;
    event_location: string;
    creator_name: string;
    creator_email?: string;
    slug: string;
    created_at?: string;
  };
  rsvpData: RSVP[];
  attendingCount: number;
  totalGuests: number;
  shareableUrl: string;
}

export default function EventAdminClient({
  event,
  rsvpData,
  attendingCount,
  totalGuests,
  shareableUrl,
}: EventAdminClientProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { toast } = useToast();

  useEffect(() => {
    const savedTheme =
      (localStorage.getItem("theme") as "light" | "dark") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    setTheme(savedTheme);

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const copyToClipboard = async (text: string, message: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: message,
      });
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      toast({
        title: "Copied!",
        description: message,
      });
    }
  };

  // Calculate additional stats
  const maybeCount =
    rsvpData?.filter((r) => r.attendance === "maybe").length || 0;
  const noCount = rsvpData?.filter((r) => r.attendance === "no").length || 0;
  const totalResponses = rsvpData?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-stone-50 dark:from-gray-900 dark:via-gray-900 dark:to-stone-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <CalendarDays className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-200">
                {event.title}
              </h1>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Event Dashboard
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5 text-stone-600" />
              ) : (
                <Sun className="h-5 w-5 text-amber-400" />
              )}
            </button>

            <Link href="/">
              <Button
                variant="outline"
                className="border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Event Details Card */}
          <Card className="lg:col-span-2 border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800">
            <CardHeader>
              <CardTitle className="text-xl text-stone-900 dark:text-white flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-amber-600" />
                Event Details
              </CardTitle>
              <CardDescription className="text-stone-600 dark:text-stone-400">
                {event.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 dark:bg-stone-900/50 rounded-lg">
                  <CalendarHeart className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <div className="text-sm text-stone-500 dark:text-stone-400">
                    Date
                  </div>
                  <div className="text-stone-900 dark:text-white font-medium">
                    {new Date(event.event_date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 dark:bg-stone-900/50 rounded-lg">
                  <MapPin className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <div className="text-sm text-stone-500 dark:text-stone-400">
                    Location
                  </div>
                  <div className="text-stone-900 dark:text-white font-medium">
                    {event.event_location}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 dark:bg-stone-900/50 rounded-lg">
                  <Users className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <div className="text-sm text-stone-500 dark:text-stone-400">
                    Organizer
                  </div>
                  <div className="text-stone-900 dark:text-white font-medium">
                    {event.creator_name}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800">
            <CardHeader>
              <CardTitle className="text-lg text-stone-900 dark:text-white">
                Event Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-amber-50 dark:bg-stone-900/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {attendingCount}
                  </div>
                  <div className="text-sm text-stone-600 dark:text-stone-400">
                    <CheckCircle className="h-3 w-3 inline mr-1" />
                    Attending
                  </div>
                </div>
                <div className="text-center p-4 bg-amber-50 dark:bg-stone-900/50 rounded-lg">
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {maybeCount}
                  </div>
                  <div className="text-sm text-stone-600 dark:text-stone-400">
                    <HelpCircle className="h-3 w-3 inline mr-1" />
                    Maybe
                  </div>
                </div>
                <div className="text-center p-4 bg-amber-50 dark:bg-stone-900/50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {noCount}
                  </div>
                  <div className="text-sm text-stone-600 dark:text-stone-400">
                    <XCircle className="h-3 w-3 inline mr-1" />
                    Not Attending
                  </div>
                </div>
                <div className="text-center p-4 bg-amber-50 dark:bg-stone-900/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {totalResponses}
                  </div>
                  <div className="text-sm text-stone-600 dark:text-stone-400">
                    Total Responses
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 dark:border-stone-700">
                <Button
                  onClick={() =>
                    copyToClipboard(
                      shareableUrl,
                      "Event link copied to clipboard"
                    )
                  }
                  className="w-full mb-3 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"
                  variant="outline"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Copy Event Link
                </Button>
                <Link href={`/rsvp/${event.slug}`}>
                  <Button className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white">
                    <Eye className="h-4 w-4 mr-2" />
                    View RSVP Page
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RSVP Responses Card */}
        <Card className="border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 mb-8">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-xl text-stone-900 dark:text-white">
                  RSVP Responses
                </CardTitle>
                <CardDescription className="text-stone-600 dark:text-stone-400">
                  All responses for {event.title}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Now RSVPTable expects created_at field */}
            <RSVPTable data={rsvpData || []} />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
            <h3 className="font-medium text-stone-900 dark:text-white mb-2">
              Share Event
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 mb-3">
              Share your event link with guests
            </p>
            <Button
              onClick={() => copyToClipboard(shareableUrl, "Event link copied")}
              variant="outline"
              size="sm"
              className="w-full border-stone-300 dark:border-stone-700"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
          </div>

          <div className="p-4 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
            <h3 className="font-medium text-stone-900 dark:text-white mb-2">
              Guest List
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 mb-3">
              {totalGuests} guests confirmed
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-stone-300 dark:border-stone-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export List
            </Button>
          </div>

          <div className="p-4 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
            <h3 className="font-medium text-stone-900 dark:text-white mb-2">
              Need Help?
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 mb-3">
              Contact support for assistance
            </p>
            <a
              href="mailto:support@rsvpmanager.com"
              className="inline-flex items-center text-sm text-amber-600 dark:text-amber-400 hover:underline"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
