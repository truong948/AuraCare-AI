import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export type UserRole = "user" | "admin";
export type UserStatus = "active" | "suspended";

export interface AppUserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  status: UserStatus;
  created_at: string | null;
  updated_at: string | null;
}

export async function getCurrentUserContext() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, user: null, profile: null, role: "guest" as const };
  }

  const { data: profile } = (await (supabase as any)
    .from("profiles")
    .select("id,email,full_name,role,status,created_at,updated_at")
    .eq("id", user.id)
    .maybeSingle()) as { data: AppUserProfile | null };

  const fallbackProfile: AppUserProfile = {
    id: user.id,
    email: user.email ?? "",
    full_name: null,
    role: "user",
    status: "active",
    created_at: null,
    updated_at: null,
  };

  return {
    supabase,
    user,
    profile: profile ?? fallbackProfile,
    role: (profile?.role ?? "user") as UserRole,
  };
}

export async function requireSignedIn() {
  const context = await getCurrentUserContext();

  if (!context.user) {
    redirect("/login");
  }

  return context as Awaited<ReturnType<typeof getCurrentUserContext>> & {
    user: NonNullable<Awaited<ReturnType<typeof getCurrentUserContext>>["user"]>;
    profile: AppUserProfile;
    role: UserRole;
  };
}

export async function requireAdmin() {
  const context = await requireSignedIn();

  if (context.role !== "admin") {
    redirect("/dashboard");
  }

  return context;
}
