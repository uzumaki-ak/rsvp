"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { createEvent } from "@/app/actions/createEvent";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CalendarDays,
  MapPin,
  Mail,
  User,
  FileText,
  Clock,
  Users,
  Link as LinkIcon,
  Copy,
  Eye,
  PlusCircle,
  Moon,
  Sun,
  Globe,
  Home,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface CreateEventResult {
  success: boolean;
  slug?: string;
  title?: string;
  adminUrl?: string;
  message?: string;
}

export default function CreateEventForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);
  const [location, setLocation] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [creatorEmail, setCreatorEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [createdEvent, setCreatedEvent] = useState<{
    slug: string;
    title: string;
    adminUrl: string;
  } | null>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Event title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!eventDate) newErrors.eventDate = "Event date is required";
    if (!location.trim()) newErrors.location = "Location is required";
    if (!creatorName.trim()) newErrors.creatorName = "Your name is required";
    if (!creatorEmail.trim()) newErrors.creatorEmail = "Your email is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("eventDate", eventDate!.toISOString().split("T")[0]);
    formData.append("location", location);
    formData.append("creatorName", creatorName);
    formData.append("creatorEmail", creatorEmail);

    setIsLoading(true);
    const result = (await createEvent(formData)) as CreateEventResult;

    if (result.success && result.slug && result.title && result.adminUrl) {
      toast({
        title: "Event Created Successfully!",
        description: "Check your email for the admin and share links!",
      });

      setCreatedEvent({
        slug: result.slug,
        title: result.title,
        adminUrl: result.adminUrl,
      });

      setTitle("");
      setDescription("");
      setEventDate(undefined);
      setLocation("");
      setCreatorName("");
      setCreatorEmail("");
      setErrors({});
    } else {
      toast({
        title: "Error",
        description: result.message || "Something went wrong",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard",
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
        description: "Link copied to clipboard",
      });
    }
  };

  if (createdEvent) {
    const shareableUrl = `${window.location.origin}/rsvp/${createdEvent.slug}`;
    const deployedShareableUrl = `https://rsvpify.vercel.app/rsvp/${createdEvent.slug}`;

    // Extract token from admin URL
    const adminUrl = new URL(createdEvent.adminUrl);
    const token = adminUrl.searchParams.get("token") || "";
    const deployedAdminUrl = `https://rsvpify.vercel.app/events/${createdEvent.slug}/admin?token=${token}`;

    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-stone-50 dark:from-gray-900 dark:via-gray-900 dark:to-stone-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <CalendarDays className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-200">
                RSVP Manager
              </h1>
            </div>

            <div className="flex items-center gap-4">
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

              <Button
                onClick={() => setCreatedEvent(null)}
                variant="outline"
                className="border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Another
              </Button>
            </div>
          </div>

          <Card className="border-stone-200 dark:border-stone-700 shadow-lg bg-white dark:bg-stone-800 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 to-amber-600" />

            <CardHeader className="text-center pt-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-4">
                <CalendarDays className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
              <CardTitle className="text-2xl text-stone-900 dark:text-white">
                Event Created Successfully!
              </CardTitle>
              <CardDescription className="text-stone-600 dark:text-stone-400 text-lg">
                Your event{" "}
                <span className="font-semibold text-stone-900 dark:text-stone-200">
                  "{createdEvent.title}"
                </span>{" "}
                is ready to share
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pb-8">
              {/* Local Development Links */}
              <div className="bg-amber-50 dark:bg-stone-900/50 p-6 rounded-xl border border-amber-100 dark:border-stone-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white dark:bg-stone-800 rounded-lg">
                    <Users className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900 dark:text-white">
                      Local Development Links
                    </h3>
                    <p className="text-sm text-stone-600 dark:text-stone-400">
                      Use these for testing on localhost
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                      Share with Guests:
                    </Label>
                    <div className="flex flex-col sm:flex-row gap-3 mt-2">
                      <div className="flex-1">
                        <Input
                          value={shareableUrl}
                          readOnly
                          className="font-mono text-sm bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-600"
                        />
                      </div>
                      <Button
                        onClick={() => copyToClipboard(shareableUrl)}
                        className="bg-amber-600 hover:bg-amber-700 text-white border-amber-700"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    <div className="mt-2 flex justify-end">
                      <Button
                        onClick={() => window.open(shareableUrl, "_blank")}
                        variant="ghost"
                        size="sm"
                        className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Open
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                      Admin Dashboard:
                    </Label>
                    <div className="flex flex-col sm:flex-row gap-3 mt-2">
                      <div className="flex-1">
                        <Input
                          value={createdEvent.adminUrl}
                          readOnly
                          className="font-mono text-xs bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300"
                        />
                      </div>
                      <Button
                        onClick={() => copyToClipboard(createdEvent.adminUrl)}
                        variant="outline"
                        className="border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    <div className="mt-2 flex justify-end">
                      <Button
                        onClick={() =>
                          window.open(createdEvent.adminUrl, "_blank")
                        }
                        variant="ghost"
                        size="sm"
                        className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Open
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Production Links (Deployed) */}
              <div className="bg-green-50 dark:bg-green-900/50 p-6 rounded-xl border border-green-100 dark:border-green-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white dark:bg-stone-800 rounded-lg">
                    <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900 dark:text-white">
                      Production Links (Deployed)
                    </h3>
                    <p className="text-sm text-stone-600 dark:text-stone-400">
                      Use these for your live event
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                      Share with Guests:
                    </Label>
                    <div className="flex flex-col sm:flex-row gap-3 mt-2">
                      <div className="flex-1">
                        <Input
                          value={deployedShareableUrl}
                          readOnly
                          className="font-mono text-sm bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-600"
                        />
                      </div>
                      <Button
                        onClick={() => copyToClipboard(deployedShareableUrl)}
                        className="bg-green-600 hover:bg-green-700 text-white border-green-700"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    <div className="mt-2 flex justify-end">
                      <Button
                        onClick={() =>
                          window.open(deployedShareableUrl, "_blank")
                        }
                        variant="ghost"
                        size="sm"
                        className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Open
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                      Admin Dashboard:
                    </Label>
                    <div className="flex flex-col sm:flex-row gap-3 mt-2">
                      <div className="flex-1">
                        <Input
                          value={deployedAdminUrl}
                          readOnly
                          className="font-mono text-xs bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300"
                        />
                      </div>
                      <Button
                        onClick={() => copyToClipboard(deployedAdminUrl)}
                        variant="outline"
                        className="border-green-300 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/30"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    <div className="mt-2 flex justify-end">
                      <Button
                        onClick={() => window.open(deployedAdminUrl, "_blank")}
                        variant="ghost"
                        size="sm"
                        className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Open
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-stone-50 dark:from-stone-900 dark:to-stone-800 p-6 rounded-xl border border-stone-200 dark:border-stone-700">
                <h3 className="font-semibold text-stone-900 dark:text-white mb-3">
                  Next Steps
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white dark:bg-stone-800 rounded-lg">
                    <div className="text-amber-600 dark:text-amber-400 font-bold mb-2">
                      1
                    </div>
                    <h4 className="font-medium text-stone-900 dark:text-white mb-1">
                      Share Link
                    </h4>
                    <p className="text-sm text-stone-600 dark:text-stone-400">
                      Send the guest link via email or message
                    </p>
                  </div>

                  <div className="p-4 bg-white dark:bg-stone-800 rounded-lg">
                    <div className="text-amber-600 dark:text-amber-400 font-bold mb-2">
                      2
                    </div>
                    <h4 className="font-medium text-stone-900 dark:text-white mb-1">
                      Track RSVPs
                    </h4>
                    <p className="text-sm text-stone-600 dark:text-stone-400">
                      Monitor responses in your admin dashboard
                    </p>
                  </div>

                  <div className="p-4 bg-white dark:bg-stone-800 rounded-lg">
                    <div className="text-amber-600 dark:text-amber-400 font-bold mb-2">
                      3
                    </div>
                    <h4 className="font-medium text-stone-900 dark:text-white mb-1">
                      Send Updates
                    </h4>
                    <p className="text-sm text-stone-600 dark:text-stone-400">
                      Keep guests informed about event details
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/admin/rsvps" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800">
                    <Eye className="h-4 w-4 mr-2" />
                    View All RSVPs
                  </Button>
                </Link>

                <Button
                  onClick={() => window.open(deployedShareableUrl, "_blank")}
                  variant="outline"
                  className="flex-1 border-stone-300 dark:border-stone-700"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  View Live Event
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-stone-50 dark:from-gray-900 dark:via-gray-900 dark:to-stone-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <CalendarDays className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-200">
              Create RSVP Event
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/">
              <Button
                variant="outline"
                className="border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>

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
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <Card className="border-stone-200 dark:border-stone-700 shadow-lg bg-white dark:bg-stone-800 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 to-amber-600" />

              <CardHeader className="pb-6">
                <CardTitle className="text-xl text-stone-900 dark:text-white flex items-center gap-2">
                  <PlusCircle className="h-5 w-5 text-amber-600" />
                  Event Details
                </CardTitle>
                <CardDescription className="text-stone-600 dark:text-stone-400">
                  Fill in your event information to create a beautiful RSVP page
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="title"
                        className="text-stone-700 dark:text-stone-300 flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4 text-amber-600" />
                        Event Title *
                      </Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Birthday Celebration"
                        className="border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 focus:border-amber-500"
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.title}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-stone-700 dark:text-stone-300 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-amber-600" />
                        Location *
                      </Label>
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g., Central Park, NYC"
                        className="border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 focus:border-amber-500"
                      />
                      {errors.location && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.location}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="text-stone-700 dark:text-stone-300"
                    >
                      Event Description *
                    </Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Tell your guests what to expect..."
                      className="min-h-[120px] border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 focus:border-amber-500"
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-stone-700 dark:text-stone-300 flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-amber-600" />
                      Event Date *
                    </Label>
                    <div className="border border-stone-300 dark:border-stone-600 rounded-lg p-2 bg-white dark:bg-stone-900">
                      <Calendar
                        mode="single"
                        selected={eventDate}
                        onSelect={(date) => setEventDate(date ?? undefined)}
                        className="w-full"
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today;
                        }}
                      />
                    </div>
                    {errors.eventDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.eventDate}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="creatorName"
                        className="text-stone-700 dark:text-stone-300 flex items-center gap-2"
                      >
                        <User className="h-4 w-4 text-amber-600" />
                        Your Name *
                      </Label>
                      <Input
                        id="creatorName"
                        value={creatorName}
                        onChange={(e) => setCreatorName(e.target.value)}
                        placeholder="Enter your full name"
                        className="border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 focus:border-amber-500"
                      />
                      {errors.creatorName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.creatorName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="creatorEmail"
                        className="text-stone-700 dark:text-stone-300 flex items-center gap-2"
                      >
                        <Mail className="h-4 w-4 text-amber-600" />
                        Your Email *
                      </Label>
                      <Input
                        id="creatorEmail"
                        type="email"
                        value={creatorEmail}
                        onChange={(e) => setCreatorEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 focus:border-amber-500"
                      />
                      <p className="text-sm text-stone-500 dark:text-stone-400">
                        You'll receive RSVP notifications here
                      </p>
                      {errors.creatorEmail && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.creatorEmail}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    disabled={isLoading}
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-6 text-lg font-medium"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating Event...
                      </div>
                    ) : (
                      "Create Event"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Tips */}
          <div className="space-y-6">
            <Card className="border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800">
              <CardHeader>
                <CardTitle className="text-lg text-stone-900 dark:text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-600" />
                  Quick Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg mt-1">
                    <div className="h-2 w-2 rounded-full bg-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-stone-900 dark:text-white">
                      Clear Titles
                    </h4>
                    <p className="text-sm text-stone-600 dark:text-stone-400">
                      Make your event title descriptive and engaging
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg mt-1">
                    <div className="h-2 w-2 rounded-full bg-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-stone-900 dark:text-white">
                      Complete Details
                    </h4>
                    <p className="text-sm text-stone-600 dark:text-stone-400">
                      Include all necessary information for your guests
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg mt-1">
                    <div className="h-2 w-2 rounded-full bg-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-stone-900 dark:text-white">
                      Share Widely
                    </h4>
                    <p className="text-sm text-stone-600 dark:text-stone-400">
                      Share your RSVP link via email and messaging apps
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800">
              <CardHeader>
                <CardTitle className="text-lg text-stone-900 dark:text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-amber-600" />
                  What You Get
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                  </div>
                  <span className="text-sm text-stone-700 dark:text-stone-300">
                    Customizable RSVP page
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                  </div>
                  <span className="text-sm text-stone-700 dark:text-stone-300">
                    Real-time response tracking
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                  </div>
                  <span className="text-sm text-stone-700 dark:text-stone-300">
                    Guest list management
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                  </div>
                  <span className="text-sm text-stone-700 dark:text-stone-300">
                    Email notifications
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="p-6 bg-gradient-to-r from-amber-50 to-stone-50 dark:from-stone-900 dark:to-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
              <h3 className="font-semibold text-stone-900 dark:text-white mb-2">
                Need Help?
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">
                Contact us for assistance with your event setup
              </p>
              <a
                href="mailto:anikeshuzumaki@gmail.com"
                className="inline-flex items-center text-amber-600 dark:text-amber-400 hover:underline text-sm font-medium"
              >
                anikeshuzumaki@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
