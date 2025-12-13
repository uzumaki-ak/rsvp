import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarDays, User, LogOut, LayoutDashboard, PlusCircle } from "lucide-react";
import { createClient } from "@/app/utils/supabase/server";
import ThemeToggle from "./ThemeToggle";
import { signOut } from "@/app/actions/auth";

interface HeaderProps {
  user?: any;
}

export default async function Header({ user }: HeaderProps) {
  const isLoggedIn = !!user;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-stone-900/70 border-b border-stone-200 dark:border-stone-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg">
                <CalendarDays className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent hidden sm:inline-block">
                RSVP Manager
              </span>
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <nav className="hidden md:flex items-center gap-4">
              <Link href="/" className="text-stone-700 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-colors">
                Home
              </Link>
              <Link href="/create" className="text-stone-700 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-colors">
                Create Event
              </Link>
              
              {isLoggedIn ? (
                <>
                  <Link href="/admin/rsvps" className="text-stone-700 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-colors">
                    Dashboard
                  </Link>
                  <form action={signOut}>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-stone-700 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400"
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Sign Out
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-stone-700 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-colors">
                    Sign In
                  </Link>
                  <Link href="/signup">
                    <Button size="sm" className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </nav>
            
            <div className="flex items-center gap-2">
              {isLoggedIn && (
                <Link href="/create" className="md:hidden">
                  <Button size="sm" className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800">
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </Link>
              )}
              
              <ThemeToggle />
              
              {isLoggedIn ? (
                <Link href="/admin/rsvps" className="md:hidden">
                  <Button variant="ghost" size="sm">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Link href="/login" className="md:hidden">
                  <Button variant="ghost" size="sm">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}