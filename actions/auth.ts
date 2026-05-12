"use server";

import { createServerActionSupabaseClient } from "@/lib/supabase-server";
import { authSchema, signUpSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function signIn(formData: FormData) {
  const values = Object.fromEntries(formData) as { email?: string; password?: string };
  const parsed = authSchema.parse(values);
  const supabase = createServerActionSupabaseClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.email,
    password: parsed.password
  });

  if (error) {
    throw error;
  }

  revalidatePath("/");
  return { success: true };
}

export async function signUp(formData: FormData) {
  const values = Object.fromEntries(formData) as { email?: string; password?: string; confirmPassword?: string };
  const parsed = signUpSchema.parse(values);
  const supabase = createServerActionSupabaseClient();

  const { error } = await supabase.auth.signUp({
    email: parsed.email,
    password: parsed.password
  });

  if (error) {
    throw error;
  }

  revalidatePath("/");
  return { success: true };
}
