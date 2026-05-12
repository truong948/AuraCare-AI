import { cookies } from "next/headers";
import { createServerActionClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase server environment variables.");
}

export const createServerComponentSupabaseClient = () =>
  createServerComponentClient<Database>({
    cookies
  });

export const createServerActionSupabaseClient = () =>
  createServerActionClient<Database>({
    cookies
  });
