
import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { RSVPTable } from "@/app/components/RSVPTable";
import {
  House,
  Users,
  
  PlusCircle,
  LayoutDashboard,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
import { getRSVPs } from "@/app/actions/getRSVPs";
import ThemeToggle from "@/app/components/ThemeToggle";
import { createClient } from "@/app/utils/supabase/server";

interface RSVP {
  id: string;
  name: string;
  email: string;
  accompany: number;
  attendance: string;
  created_at: string;
  event_id: string;
}

export default async function RSVPsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-stone-50 dark:from-gray-900 dark:via-gray-900 dark:to-stone-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
            Access Denied
          </div>
          <p className="text-stone-600 dark:text-stone-400">
            Please sign in to access this page
          </p>
          <Link href="/login" className="inline-block mt-4">
            <Button className="bg-amber-600 hover:bg-amber-700">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { success, data, message } = (await getRSVPs()) as {
    success: boolean;
    data: RSVP[];
    message?: string;
  };

  if (!success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-stone-50 dark:from-gray-900 dark:via-gray-900 dark:to-stone-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
            Error
          </div>
          <p className="text-stone-600 dark:text-stone-400">{message}</p>
          <Link href="/" className="inline-block mt-4">
            <Button className="bg-amber-600 hover:bg-amber-700">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalRSVPs = data?.length || 0;
  const attendingCount =
    data?.filter((rsvp) => rsvp.attendance === "yes").length || 0;
  const maybeCount =
    data?.filter((rsvp) => rsvp.attendance === "maybe").length || 0;
  // const noCount = data?.filter((rsvp) => rsvp.attendance === "no").length || 0;
  const totalGuests =
    data?.reduce((sum, rsvp) => sum + (rsvp.accompany || 0) + 1, 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-stone-50 dark:from-gray-900 dark:via-gray-900 dark:to-stone-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <Users className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-200">
                Admin Dashboard
              </h1>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Manage all your event responses
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm text-stone-700 dark:text-stone-300">
                {totalRSVPs} Total Responses
              </span>
            </div>

            <Link href="/create">
              <Button className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </Link>

            <Link href="/">
              <Button
                variant="outline"
                className="border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"
              >
                <House className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>

            <form action={signOut}>
              <Button
                variant="outline"
                type="submit"
                className="border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"
              >
                Sign Out
              </Button>
            </form>

            <ThemeToggle />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 dark:border-stone-700 mb-8">
          <Link
            href="/admin/rsvps"
            className="px-4 py-3 font-medium text-amber-600 dark:text-amber-400 border-b-2 border-amber-600 dark:border-amber-400"
          >
            <LayoutDashboard className="h-4 w-4 inline mr-2" />
            All RSVPs
          </Link>
          <Link
            href="/create"
            className="px-4 py-3 font-medium text-stone-600 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400"
          >
            <CalendarDays className="h-4 w-4 inline mr-2" />
            Create Event
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-4">
            <div className="text-2xl font-bold text-stone-900 dark:text-white mb-1">
              {totalRSVPs}
            </div>
            <div className="text-sm text-stone-600 dark:text-stone-400">
              Total Responses
            </div>
          </div>

          <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-4">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
              {attendingCount}
            </div>
            <div className="text-sm text-stone-600 dark:text-stone-400">
              Attending
            </div>
          </div>

          <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-4">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-1">
              {maybeCount}
            </div>
            <div className="text-sm text-stone-600 dark:text-stone-400">
              Maybe
            </div>
          </div>

          <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-4">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {totalGuests}
            </div>
            <div className="text-sm text-stone-600 dark:text-stone-400">
              Total Guests
            </div>
          </div>
        </div>

        {/* RSVP Table */}
        <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 shadow-sm overflow-hidden">
          <div className="p-6">
            <RSVPTable data={data || []} />
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-stone-500 dark:text-stone-400">
          <p>
            All RSVP data is stored securely and can be exported at any time.
          </p>
        </div>
      </div>
    </div>
  );
}
