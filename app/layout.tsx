import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RSVP Event Manager | Plan & Manage Guests",
  description:
    "Easily create events, share RSVP links, and track guest attendance in real-time with RSVP Event Manager.",
  keywords: [
    "RSVP",
    "event management",
    "guest list",
    "event planner",
    "attendance tracking",
    "event invites",
    "online RSVP system",
  ],
  authors: [{ name: "Your Name or Brand" }],
  creator: "Your Name or Brand",
  publisher: "Your Company",
  openGraph: {
    title: "RSVP Event Manager | Plan & Manage Guests",
    description:
      "Easily create events, share RSVP links, and track guest attendance in real-time.",
    url: "https://rsvpify.vercel.app/",
    siteName: "RSVP Event Manager",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RSVP Event Manager | Plan & Manage Guests",
    description:
      "Create events, share RSVP links, and manage guest attendance seamlessly.",
   
    creator: "@anikeshiro",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
  category: "Event Management",
  applicationName: "RSVP Event Manager",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
