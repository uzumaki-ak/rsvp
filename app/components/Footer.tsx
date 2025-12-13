import Link from "next/link";
import { CalendarDays } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-900 text-stone-400">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg">
                <CalendarDays className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">
                RSVP Manager
              </span>
            </div>
            <p className="mb-6 max-w-md">
              Beautiful, powerful event management for organizers of all sizes. 
              Create, share, and track RSVPs with ease.
            </p>
            <div className="flex gap-4">
              {["Twitter", "LinkedIn", "Instagram", "GitHub"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="p-2 bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors text-sm"
                  aria-label={social}
                >
                  {social.charAt(0)}
                </a>
              ))}
            </div>
          </div>
          
          {[
            {
              title: "Product",
              links: ["Features", "How It Works", "Pricing", "API", "Changelog"]
            },
            {
              title: "Company",
              links: ["About Us", "Careers", "Blog", "Press", "Partners"]
            },
            {
              title: "Support",
              links: ["Help Center", "Community", "Contact", "Status", "Security"]
            },
            {
              title: "Legal",
              links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR", "CCPA"]
            }
          ].map((column, index) => (
            <div key={index}>
              <h3 className="text-white font-semibold mb-4">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <Link 
                      href="#" 
                      className="hover:text-white transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-stone-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="mb-4 md:mb-0">
            &copy; {currentYear} RSVP Manager. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <Link href="/create" className="text-amber-400 hover:text-amber-300 font-medium">
              Create Event
            </Link>
            
            <a 
              href="mailto:support@rsvpmanager.com" 
              className="text-amber-400 hover:text-amber-300 font-medium"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}