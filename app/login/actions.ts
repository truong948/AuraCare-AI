"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { authSchema, signUpSchema } from "@/lib/validation";

export async function login(formData: FormData) {
  const values = Object.fromEntries(formData) as {
    email?: string;
    password?: string;
  };

  // Validate with Zod schema
  const parsed = authSchema.safeParse(values);
  if (!parsed.success) {
    return {
      error: parsed.error.errors[0]?.message ?? "Dữ liệu không hợp lệ.",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return {
      error:
        error.message === "Invalid login credentials"
          ? "Email hoặc mật khẩu không đúng. Vui lòng thử lại."
          : error.message,
    };
  }

  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const values = Object.fromEntries(formData) as {
    email?: string;
    password?: string;
    confirmPassword?: string;
  };

  // Validate with Zod schema
  const parsed = signUpSchema.safeParse(values);
  if (!parsed.success) {
    return {
      error: parsed.error.errors[0]?.message ?? "Dữ liệu không hợp lệ.",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(
        ".supabase.co",
        ""
      )}/auth/confirm`,
    },
  });

  if (error) {
    return {
      error:
        error.message === "User already registered"
          ? "Email này đã được đăng ký. Vui lòng đăng nhập."
          : error.message,
    };
  }

  // Sign-up successful; Supabase sends a confirmation email.
  // Redirect to dashboard — the session may not be active until confirmed.
  redirect("/dashboard");
}
