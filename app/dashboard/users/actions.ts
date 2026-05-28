"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/roles";

const updateUserAccessSchema = z.object({
  profileId: z.string().uuid(),
  role: z.enum(["user", "admin"]),
  status: z.enum(["active", "suspended"]),
});

export async function updateUserAccess(formData: FormData) {
  const parsed = updateUserAccessSchema.parse({
    profileId: formData.get("profileId"),
    role: formData.get("role"),
    status: formData.get("status"),
  });

  const { supabase, user } = await requireAdmin();

  if (parsed.profileId === user.id && parsed.role !== "admin") {
    throw new Error("Không thể tự hạ quyền admin của chính bạn.");
  }

  const { error } = await (supabase as any)
    .from("profiles")
    .update({
      role: parsed.role,
      status: parsed.status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.profileId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/users");
}
