"use client";

import { useState, useEffect } from "react";
import { signUp } from "@/app/actions/auth";
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
import {
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CalendarDays,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/utils/supabase/client";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Check if user is already logged in (client-side)
  useEffect(() => {
    const checkUser = async () => {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

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
      const result = await signUp(formDataObj);

      if (result?.success) {
        setSuccess(true);
        toast({
          title: "Account created!",
          description: result.message,
        });
      } else if (result?.error) {
        setError(result.error);
        toast({
          title: "Sign up failed",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Sign up error:", error);
      setError("An unexpected error occurred");
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
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

  // Show success message if signup was successful
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-stone-50 dark:from-gray-900 dark:via-gray-900 dark:to-stone-900 flex items-center justify-center p-4 transition-colors duration-300">
        <Card className="w-full max-w-md border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 shadow-xl">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-400 to-green-600" />

          <CardHeader className="text-center pt-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>

            <CardTitle className="text-2xl font-bold text-stone-900 dark:text-white">
              Check Your Email
            </CardTitle>
            <CardDescription className="text-stone-600 dark:text-stone-400">
              We've sent a confirmation link to your email
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-800 dark:text-green-300 text-center">
                Please check your inbox and click the confirmation link to
                activate your account.
              </p>
            </div>

            <div className="text-sm text-stone-600 dark:text-stone-400 space-y-2">
              <p>Didn't receive the email?</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Check your spam folder</li>
                <li>Make sure you entered the correct email</li>
                <li>Wait a few minutes and try again</li>
              </ul>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Link href="/login" className="w-full">
              <Button className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800">
                Return to Login
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
            Create Account
          </CardTitle>
          <CardDescription className="text-stone-600 dark:text-stone-400">
            Join RSVP Manager to create amazing events
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-stone-700 dark:text-stone-300"
              >
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
              <Label
                htmlFor="password"
                className="text-stone-700 dark:text-stone-300"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="pl-10 pr-10 border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 focus:border-amber-500"
                  required
                  minLength={6}
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
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Must be at least 6 characters long
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-stone-700 dark:text-stone-300"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="pl-10 pr-10 border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 focus:border-amber-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showConfirmPassword ? (
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

            <div className="bg-amber-50 dark:bg-stone-900/50 p-4 rounded-lg border border-amber-100 dark:border-stone-700">
              <h4 className="font-medium text-stone-900 dark:text-white mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-amber-600" />
                Why sign up?
              </h4>
              <ul className="text-sm text-stone-600 dark:text-stone-400 space-y-1">
                <li>• Create unlimited events</li>
                <li>• Track all your RSVPs in one place</li>
                <li>• Access event analytics</li>
                <li>• Manage multiple events</li>
              </ul>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
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
                Already have an account?
              </span>
            </div>
          </div>

          <Link href="/login" className="w-full">
            <Button
              variant="outline"
              className="w-full border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"
            >
              Sign In Instead
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
