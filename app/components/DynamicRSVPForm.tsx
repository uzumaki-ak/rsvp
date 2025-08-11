// "use client";

// import { useState } from "react";
// import { MapPin } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Calendar } from "@/components/ui/calendar";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { submitRSVP } from "../actions/submitRSVP";
// import { useToast } from "@/hooks/use-toast";

// interface Event {
//   id: string;
//   title: string;
//   description: string;
//   event_date: string;
//   event_location: string;
//   creator_name: string;
//   creator_email: string;
//   slug: string;
// }

// interface DynamicRSVPFormProps {
//   event: Event;
// }

// export default function DynamicRSVPForm({ event }: DynamicRSVPFormProps) {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [accompany, setAccompany] = useState<string | null>(null);
//   const [attendance, setAttendance] = useState("yes");
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const { toast } = useToast();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!name) {
//       setErrors({ name: "Name is required" });
//       return;
//     }
//     if (!email) {
//       setErrors({ email: "Email is required" });
//       return;
//     }

//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("email", email);
//     formData.append("accompany", accompany || "0");
//     formData.append("attendance", attendance);
//     formData.append("eventId", event.id);

//     setIsLoading(true);
//     const result = await submitRSVP(formData);

//     if (result.success) {
//       toast({
//         title: "Success",
//         description: "Thank you for your RSVP!",
//       });
//       setIsSubmitted(true);
//       // Reset form
//       setName("");
//       setEmail("");
//       setAccompany(null);
//       setAttendance("yes");
//       setErrors({});
//     } else {
//       toast({
//         title: "Error",
//         description: result.message,
//         variant: "destructive",
//       });
//       if (result.error) {
//         if (result.error.code === "23505") {
//           setErrors({ email: "You have already RSVP'd for this event" });
//         }
//       }
//     }
//     setIsLoading(false);
//   };

//   const openGoogleMaps = () => {
//     const encodedLocation = encodeURIComponent(event.event_location);
//     window.open(
//       `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`,
//       "_blank"
//     );
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   if (isSubmitted) {
//     return (
//       <div className="max-w-md mx-auto my-10 p-6">
//         <Card className="bg-green-50 border-green-200 text-center">
//           <CardHeader>
//             <CardTitle className="text-green-800">🎉 RSVP Submitted!</CardTitle>
//             <CardDescription className="text-green-600">
//               Thank you for responding to {event.title}
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <p className="text-sm text-gray-600">
//               The event organizer has been notified of your response.
//             </p>
//             <Button
//               onClick={() => setIsSubmitted(false)}
//               variant="outline"
//               className="mt-4"
//             >
//               Submit Another Response
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-md mx-auto my-10 p-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>{event.title}</CardTitle>
//           <CardDescription>{event.description}</CardDescription>
//           <div className="text-sm text-gray-600">
//             Organized by {event.creator_name}
//           </div>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div>
//             <Label className="text-base font-medium">Event Date</Label>
//             <div className="mt-2 p-3 bg-gray-50 rounded-lg">
//               <p className="text-sm font-medium">
//                 {formatDate(event.event_date)}
//               </p>
//             </div>
//           </div>

//           <div>
//             <Label className="text-base font-medium">Location</Label>
//             <div className="mt-2">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={openGoogleMaps}
//                 className="w-full justify-start"
//               >
//                 <MapPin className="mr-2 h-4 w-4" />
//                 {event.event_location}
//               </Button>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <Label htmlFor="name">Full Name</Label>
//               <Input
//                 id="name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//                 className="mt-1"
//               />
//               {errors.name && (
//                 <p className="text-red-500 text-sm mt-1">{errors.name}</p>
//               )}
//             </div>

//             <div>
//               <Label htmlFor="email">Email Address</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="mt-1"
//               />
//               {errors.email && (
//                 <p className="text-red-500 text-sm mt-1">{errors.email}</p>
//               )}
//             </div>

//             <div>
//               <Label htmlFor="accompany">Number of Additional Guests</Label>
//               <Input
//                 id="accompany"
//                 type="number"
//                 min="0"
//                 value={accompany || ""}
//                 onChange={(e) => setAccompany(e.target.value)}
//                 placeholder="0"
//                 className="mt-1"
//               />
//             </div>

//             <div>
//               <Label className="text-base font-medium">Will you attend?</Label>
//               <RadioGroup
//                 value={attendance}
//                 onValueChange={setAttendance}
//                 className="mt-2"
//               >
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value="yes" id="yes" />
//                   <Label htmlFor="yes">Yes, I'll be there</Label>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value="no" id="no" />
//                   <Label htmlFor="no">Sorry, can't make it</Label>
//                 </div>
//               </RadioGroup>
//             </div>

//             <Button disabled={isLoading} type="submit" className="w-full">
//               {isLoading ? "Submitting..." : "Submit RSVP"}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }




//

"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { submitRSVP } from "../actions/submitRSVP";
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_location: string;
  creator_name: string;
  creator_email: string;
  slug: string;
}

interface DynamicRSVPFormProps {
  event: Event;
}

export default function DynamicRSVPForm({ event }: DynamicRSVPFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [accompany, setAccompany] = useState<string | null>(null);
  const [attendance, setAttendance] = useState("yes");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      setErrors({ name: "Name is required" });
      return;
    }
    if (!email) {
      setErrors({ email: "Email is required" });
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("accompany", accompany || "0");
    formData.append("attendance", attendance);
    formData.append("eventId", event.id);

    setIsLoading(true);
    const result = await submitRSVP(formData);

    if (result.success) {
      toast({
        title: "Success",
        description: "Thank you for your RSVP!",
      });
      setIsSubmitted(true);
      setName("");
      setEmail("");
      setAccompany(null);
      setAttendance("yes");
      setErrors({});
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
      if (result.error?.code === "23505") {
        setErrors({ email: "You have already RSVP'd for this event" });
      }
    }
    setIsLoading(false);
  };

  const openGoogleMaps = () => {
    const encodedLocation = encodeURIComponent(event.event_location);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`,
      "_blank"
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isSubmitted) {
    return (
      <div className="max-w-md mx-auto my-10 p-6">
        <Card className="bg-green-50 border-green-200 text-center">
          <CardHeader>
            <CardTitle className="text-green-800">🎉 RSVP Submitted!</CardTitle>
            <CardDescription className="text-green-600">
              Thank you for responding to {event.title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              The event organizer has been notified of your response.
            </p>
            <Button
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              className="mt-4"
            >
              Submit Another Response
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-10 p-6">
      <Card>
        <CardHeader>
          <CardTitle>{event.title}</CardTitle>
          <CardDescription>{event.description}</CardDescription>
          <div className="mt-2 text-sm text-gray-500">
            <p>{formatDate(event.event_date)}</p>
            <button
              type="button"
              onClick={openGoogleMaps}
              className="flex items-center gap-1 text-blue-600 hover:underline"
            >
              <MapPin className="w-4 h-4" />
              {event.event_location}
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <Label>Will you attend?</Label>
              <RadioGroup
                value={attendance}
                onValueChange={(value) => setAttendance(value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="accompany">Number of people accompanying</Label>
              <Input
                id="accompany"
                type="number"
                min="0"
                value={accompany || ""}
                onChange={(e) => setAccompany(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Submitting..." : "Submit RSVP"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

