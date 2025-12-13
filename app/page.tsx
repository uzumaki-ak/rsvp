import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarPlus,
  Share2,
  BarChart3,
  Sparkles,
  Users,
  Calendar,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  User,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { createClient } from "@/app/utils/supabase/server";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
      {/* Header */}
      <Header user={user} />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-50/50 to-stone-50/50 dark:from-amber-900/10 dark:to-stone-900/10" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-amber-300 dark:bg-amber-700 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-stone-300 dark:bg-stone-700 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-pulse delay-1000" />

        <div className="container relative mx-auto px-4 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 mb-6">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">No Signup Required</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-stone-900 dark:text-white leading-tight">
            Beautiful RSVPs for{" "}
            <span className="bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
              Every Event
            </span>
          </h1>

          <p className="text-lg md:text-xl text-stone-600 dark:text-stone-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Create stunning event invites, track responses in real-time, and
            manage guest lists effortlessly. Perfect for weddings, parties,
            classes, and corporate events.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/create" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto px-8 py-6 text-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Create Free Event
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            {isLoggedIn ? (
              <Link href="/admin/rsvps" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto px-8 py-6 text-lg border-2 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-amber-500"
                >
                  <LayoutDashboard className="mr-2 h-5 w-5" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/login" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto px-8 py-6 text-lg border-2 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-amber-500"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-stone-500 dark:text-stone-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Unlimited guests</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Real-time tracking</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-stone-50 dark:bg-stone-900/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                number: "50K+",
                label: "Events Created",
                icon: <Calendar className="h-6 w-6 text-amber-600" />,
              },
              {
                number: "2M+",
                label: "Guests Invited",
                icon: <Users className="h-6 w-6 text-amber-500" />,
              },
              {
                number: "98%",
                label: "Satisfaction",
                icon: <Star className="h-6 w-6 text-amber-400" />,
              },
              {
                number: "24/7",
                label: "Support",
                icon: <Zap className="h-6 w-6 text-amber-300" />,
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white dark:bg-stone-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex justify-center mb-3">{stat.icon}</div>
                <div className="text-3xl font-bold text-stone-900 dark:text-white mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-stone-600 dark:text-stone-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-white dark:bg-stone-900">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-stone-900 dark:text-white">
              How It Works
            </h2>
            <p className="text-lg text-stone-600 dark:text-stone-300">
              Three simple steps to manage your event like a pro
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                icon: CalendarPlus,
                title: "Create Your Event",
                description:
                  "Fill in your event details and generate a beautiful RSVP form in seconds.",
                color: "from-amber-500 to-amber-600",
              },
              {
                step: "02",
                icon: Share2,
                title: "Share with Guests",
                description:
                  "Send your unique RSVP link via email, text, or social media.",
                color: "from-amber-600 to-amber-700",
              },
              {
                step: "03",
                icon: BarChart3,
                title: "Track & Manage",
                description:
                  "View real-time responses, send reminders, and export guest lists.",
                color: "from-amber-700 to-amber-800",
              },
            ].map((item, index) => (
              <div key={index} className="relative group">
                <Card className="h-full shadow-lg hover:shadow-2xl transition-all duration-500 border border-stone-200 dark:border-stone-800 bg-gradient-to-br from-white to-stone-50 dark:from-stone-800 dark:to-stone-900 overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24">
                    <div
                      className={`absolute w-32 h-32 bg-gradient-to-br ${item.color} opacity-5 rounded-full -top-8 -right-8`}
                    />
                  </div>

                  <CardContent className="pt-10 pb-8 px-6 relative">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${item.color} text-white mb-6`}
                    >
                      <item.icon className="h-6 w-6" />
                    </div>

                    <div className="text-sm font-semibold text-stone-500 dark:text-stone-400 mb-2">
                      STEP {item.step}
                    </div>

                    <h3 className="text-xl font-bold mb-4 text-stone-900 dark:text-white">
                      {item.title}
                    </h3>

                    <p className="text-stone-600 dark:text-stone-400 mb-6">
                      {item.description}
                    </p>

                    <div className="flex items-center text-amber-600 dark:text-amber-400 font-medium">
                      Learn more
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>

                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 right-0 w-16 h-0.5 bg-gradient-to-r from-stone-200 to-stone-300 dark:from-stone-700 dark:to-stone-800 -translate-y-1/2 translate-x-8" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-600 to-amber-700">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Ready to Simplify Your Event Planning?
            </h2>

            <p className="text-xl text-amber-100 mb-10">
              Join thousands of organizers who trust RSVP Manager for their most
              important events.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/create" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto px-8 py-6 text-lg bg-white text-amber-600 hover:bg-stone-100"
                >
                  Start Free Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              {!isLoggedIn && (
                <Link href="/signup" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto px-8 py-6 text-lg border-white text-white hover:bg-white/10"
                  >
                    Create Account
                  </Button>
                </Link>
              )}
            </div>

            <p className="mt-6 text-amber-200 text-sm">
              No credit card required • Free forever plan • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
