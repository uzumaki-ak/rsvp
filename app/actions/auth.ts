"use server";

import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/admin/rsvps");
}

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Validation
  if (password !== confirmPassword) {
    return { success: false, error: "Passwords do not match" };
  }

  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters" };
  }

  const supabase = await createClient();

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/rsvps`,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // Check if email confirmation is required
  if (data.user?.identities?.length === 0) {
    return { success: false, error: "User already exists" };
  }

  if (data.session) {
    // User is immediately signed in
    redirect("/admin/rsvps");
  } else {
    // Email confirmation required
    return { 
      success: true, 
      message: "Check your email for confirmation link" 
    };
  }
}

export async function resetPassword(formData: FormData) {
  const email = formData.get("email") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password`,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { 
    success: true, 
    message: "If an account exists with this email, you will receive a password reset link shortly." 
  };
}

export async function signOut() {
  "use server";

  const supabase = await createClient();

  await supabase.auth.signOut();
  redirect("/login");
}