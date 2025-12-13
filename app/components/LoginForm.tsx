"use client";

import { useState, useEffect } from "react";
import { signIn } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Loader2, Mail, Lock, Eye, EyeOff, CalendarDays } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/utils/supabase/client";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Check if user is already logged in (client-side)
  useEffect(() => {
    const checkUser = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          router.push("/admin/rsvps");
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };
    
    checkUser();
  }, [router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    
    const formDataObj = new FormData(event.currentTarget);
    
    try {
      const result = await signIn(formDataObj);
      
      // If we get here, it means signIn didn't redirect (error case)
      if (result?.error) {
        setError(result.error);
        toast({
          title: "Sign in failed",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setError("An unexpected error occurred");
      toast({
        title: "Error",
        description: "Failed to sign in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error when user starts typing
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-stone-50 dark:from-gray-900 dark:via-gray-900 dark:to-stone-900 flex items-center justify-center p-4 transition-colors duration-300">
      <Card className="w-full max-w-md border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 shadow-xl">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 to-amber-600" />
        
        <CardHeader className="text-center pt-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
              <CalendarDays className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          
          <CardTitle className="text-2xl font-bold text-stone-900 dark:text-white">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-stone-600 dark:text-stone-400">
            Sign in to your RSVP Manager account
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-stone-700 dark:text-stone-300">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="pl-10 border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-stone-700 dark:text-stone-300">
                  Password
                </Label>
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-amber-600 dark:text-amber-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 focus:border-amber-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-stone-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-stone-400" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400 text-center">
                  {error}
                </p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-300 dark:border-stone-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-stone-800 text-stone-500 dark:text-stone-400">
                Don't have an account?
              </span>
            </div>
          </div>
          
          <Link href="/signup" className="w-full">
            <Button 
              variant="outline" 
              className="w-full border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"
            >
              Create New Account
            </Button>
          </Link>
          
          <div className="text-center">
            <Link 
              href="/" 
              className="text-sm text-stone-600 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400"
            >
              ← Back to home
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}