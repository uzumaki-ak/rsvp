// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Calendar } from "@/components/ui/calendar";
// import { useToast } from "@/hooks/use-toast";
// import { createEvent } from "@/app/actions/createEvent";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { CalendarDays, MapPin, Mail, User, FileText } from "lucide-react";

// export default function CreateEventForm() {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [eventDate, setEventDate] = useState<Date | undefined>(undefined);
//   const [location, setLocation] = useState("");
//   const [creatorName, setCreatorName] = useState("");
//   const [creatorEmail, setCreatorEmail] = useState("");
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [createdEvent, setCreatedEvent] = useState<{slug: string, title: string} | null>(null);
//   const { toast } = useToast();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Validation
//     const newErrors: Record<string, string> = {};
//     if (!title.trim()) newErrors.title = "Event title is required";
//     if (!description.trim()) newErrors.description = "Description is required";
//     if (!eventDate) newErrors.eventDate = "Event date is required";
//     if (!location.trim()) newErrors.location = "Location is required";
//     if (!creatorName.trim()) newErrors.creatorName = "Your name is required";
//     if (!creatorEmail.trim()) newErrors.creatorEmail = "Your email is required";

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("description", description);
//     formData.append("eventDate", eventDate!.toISOString().split('T')[0]);
//     formData.append("location", location);
//     formData.append("creatorName", creatorName);
//     formData.append("creatorEmail", creatorEmail);

//     setIsLoading(true);
//     const result = await createEvent(formData);

//     if (result.success) {
//       toast({
//         title: "Event Created Successfully!",
//         description: "Your RSVP event has been created. Share the link with your guests!",
//       });

//       setCreatedEvent({ slug: result.slug, title: result.title });

//       // Reset form
//       setTitle("");
//       setDescription("");
//       setEventDate(undefined);
//       setLocation("");
//       setCreatorName("");
//       setCreatorEmail("");
//       setErrors({});
//     } else {
//       toast({
//         title: "Error",
//         description: result.message,
//         variant: "destructive",
//       });
//     }
//     setIsLoading(false);
//   };

//   const copyToClipboard = async (text: string) => {
//     try {
//       await navigator.clipboard.writeText(text);
//       toast({
//         title: "Copied!",
//         description: "Link copied to clipboard",
//       });
//     } catch (err) {
//       // Fallback for older browsers
//       const textArea = document.createElement("textarea");
//       textArea.value = text;
//       document.body.appendChild(textArea);
//       textArea.focus();
//       textArea.select();
//       document.execCommand('copy');
//       document.body.removeChild(textArea);
//       toast({
//         title: "Copied!",
//         description: "Link copied to clipboard",
//       });
//     }
//   };

//   if (createdEvent) {
//     const shareableUrl = `${window.location.origin}/rsvp/${createdEvent.slug}`;

//     return (
//       <div className="max-w-2xl mx-auto my-10 p-6">
//         <Card className="bg-green-50 border-green-200">
//           <CardHeader className="text-center">
//             <CardTitle className="text-green-800">🎉 Event Created Successfully!</CardTitle>
//             <CardDescription className="text-green-600">
//               Your RSVP event "{createdEvent.title}" is ready to share
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="bg-white p-4 rounded-lg border">
//               <Label className="text-sm font-medium text-gray-700">Shareable Link:</Label>
//               <div className="flex items-center gap-2 mt-2">
//                 <Input
//                   value={shareableUrl}
//                   readOnly
//                   className="font-mono text-sm"
//                 />
//                 <Button
//                   onClick={() => copyToClipboard(shareableUrl)}
//                   variant="outline"
//                 >
//                   Copy
//                 </Button>
//               </div>
//             </div>
//             <div className="flex gap-2">
//               <Button
//                 onClick={() => window.open(shareableUrl, '_blank')}
//                 className="flex-1"
//               >
//                 Preview Event
//               </Button>
//               <Button
//                 onClick={() => setCreatedEvent(null)}
//                 variant="outline"
//                 className="flex-1"
//               >
//                 Create Another Event
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-2xl mx-auto my-10 p-6">
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <CalendarDays className="h-6 w-6" />
//             Create New RSVP Event
//           </CardTitle>
//           <CardDescription>
//             Create a custom RSVP event and get a shareable link for your guests
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <Label htmlFor="title" className="flex items-center gap-2">
//                 <FileText className="h-4 w-4" />
//                 Event Title
//               </Label>
//               <Input
//                 id="title"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 placeholder="e.g., John's Birthday Party"
//                 className="mt-1"
//               />
//               {errors.title && (
//                 <p className="text-red-500 text-sm mt-1">{errors.title}</p>
//               )}
//             </div>

//             <div>
//               <Label htmlFor="description">Event Description</Label>
//               <Textarea
//                 id="description"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 placeholder="Tell your guests about the event..."
//                 className="mt-1"
//                 rows={3}
//               />
//               {errors.description && (
//                 <p className="text-red-500 text-sm mt-1">{errors.description}</p>
//               )}
//             </div>

//             <div>
//               <Label className="flex items-center gap-2">
//                 <CalendarDays className="h-4 w-4" />
//                 Event Date
//               </Label>
//               <Calendar
//                 mode="single"
//                 selected={eventDate}
//                 onSelect={setEventDate}
//                 className="rounded-md border mt-1"
//                 disabled={(date) => date < new Date()}
//               />
//               {errors.eventDate && (
//                 <p className="text-red-500 text-sm mt-1">{errors.eventDate}</p>
//               )}
//             </div>

//             <div>
//               <Label htmlFor="location" className="flex items-center gap-2">
//                 <MapPin className="h-4 w-4" />
//                 Event Location
//               </Label>
//               <Input
//                 id="location"
//                 value={location}
//                 onChange={(e) => setLocation(e.target.value)}
//                 placeholder="e.g., Central Park, New York"
//                 className="mt-1"
//               />
//               {errors.location && (
//                 <p className="text-red-500 text-sm mt-1">{errors.location}</p>
//               )}
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="creatorName" className="flex items-center gap-2">
//                   <User className="h-4 w-4" />
//                   Your Name
//                 </Label>
//                 <Input
//                   id="creatorName"
//                   value={creatorName}
//                   onChange={(e) => setCreatorName(e.target.value)}
//                   placeholder="Your full name"
//                   className="mt-1"
//                 />
//                 {errors.creatorName && (
//                   <p className="text-red-500 text-sm mt-1">{errors.creatorName}</p>
//                 )}
//               </div>

//               <div>
//                 <Label htmlFor="creatorEmail" className="flex items-center gap-2">
//                   <Mail className="h-4 w-4" />
//                   Your Email
//                 </Label>
//                 <Input
//                   id="creatorEmail"
//                   type="email"
//                   value={creatorEmail}
//                   onChange={(e) => setCreatorEmail(e.target.value)}
//                   placeholder="you@example.com"
//                   className="mt-1"
//                 />
//                 <p className="text-sm text-gray-500 mt-1">You'll receive RSVP notifications here</p>
//                 {errors.creatorEmail && (
//                   <p className="text-red-500 text-sm mt-1">{errors.creatorEmail}</p>
//                 )}
//               </div>
//             </div>

//             <Button disabled={isLoading} type="submit" className="w-full">
//               {isLoading ? "Creating Event..." : "Create RSVP Event"}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

///

"use client";

import { useState } from "react";
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
import { CalendarDays, MapPin, Mail, User, FileText } from "lucide-react";

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
  const { toast } = useToast();

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

    return (
      <div className="max-w-2xl mx-auto my-10 p-6">
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="text-center">
            <CardTitle className="text-green-800">
              🎉 Event Created Successfully!
            </CardTitle>
            <CardDescription className="text-green-600">
              Your RSVP event &quot;{createdEvent.title}&quot; is ready to share
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white p-4 rounded-lg border">
              <Label className="text-sm font-medium text-gray-700">
                Share this link with guests:
              </Label>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  value={shareableUrl}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  onClick={() => copyToClipboard(shareableUrl)}
                  variant="outline"
                >
                  Copy
                </Button>
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <Label className="text-sm font-medium text-orange-700">
                Admin link (keep private):
              </Label>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  value={createdEvent.adminUrl}
                  readOnly
                  className="font-mono text-xs text-orange-800"
                />
                <Button
                  onClick={() => copyToClipboard(createdEvent.adminUrl)}
                  variant="outline"
                  size="sm"
                >
                  Copy
                </Button>
              </div>
              <p className="text-xs text-orange-600 mt-2">
                Both links have been sent to your email
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => window.open(shareableUrl, "_blank")}
                className="flex-1"
              >
                Preview Event
              </Button>
              <Button
                onClick={() => setCreatedEvent(null)}
                variant="outline"
                className="flex-1"
              >
                Create Another Event
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-10 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-6 w-6" />
            Create New RSVP Event
          </CardTitle>
          <CardDescription>
            Create a custom RSVP event and get a shareable link for your guests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Event Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., John's Birthday Party"
                className="mt-1"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Event Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell your guests about the event..."
                className="mt-1"
                rows={3}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <Label className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Event Date
              </Label>
              <Calendar
                mode="single"
                selected={eventDate}
                onSelect={(date) => setEventDate(date ?? undefined)}
                className="rounded-md border mt-1"
                disabled={(date) => date < new Date()}
              />
              {errors.eventDate && (
                <p className="text-red-500 text-sm mt-1">{errors.eventDate}</p>
              )}
            </div>

            <div>
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Event Location
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Central Park, New York"
                className="mt-1"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="creatorName"
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Your Name
                </Label>
                <Input
                  id="creatorName"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  placeholder="Your full name"
                  className="mt-1"
                />
                {errors.creatorName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.creatorName}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="creatorEmail"
                  className="flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Your Email
                </Label>
                <Input
                  id="creatorEmail"
                  type="email"
                  value={creatorEmail}
                  onChange={(e) => setCreatorEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  <p>You&apos;ll receive RSVP notifications here</p>
                </p>
                {errors.creatorEmail && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.creatorEmail}
                  </p>
                )}
              </div>
            </div>

            <Button disabled={isLoading} type="submit" className="w-full">
              {isLoading ? "Creating Event..." : "Create RSVP Event"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
