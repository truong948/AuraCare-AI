import { requireAdmin, type AppUserProfile } from "@/lib/auth/roles";
import { UsersManager } from "@/components/dashboard/users-manager";

export default async function DashboardUsersPage() {
  const { supabase } = await requireAdmin();

  const { data: users, error } = (await (supabase as any)
    .from("profiles")
    .select("id,email,full_name,avatar_url,role,status,created_at,updated_at")
    .order("created_at", { ascending: false })) as {
    data: AppUserProfile[] | null;
    error: Error | null;
  };

  if (error) {
    console.warn("Error fetching profiles from Supabase:", error.message);
  }

  const userList = error || !users ? [] : users;

  return <UsersManager initialUsers={userList} />;
}
