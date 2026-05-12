"use server";

import { consultationSchema } from "@/lib/validation";
import { createServerActionSupabaseClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function createConsultation(formData: FormData, userId: string) {
  const values = Object.fromEntries(formData) as { skin_concern?: string; description?: string };
  const parsed = consultationSchema.parse(values);
  const supabase = createServerActionSupabaseClient();

  const { error } = await supabase.from("consultations").insert([
    {
      user_id: userId,
      skin_concern: parsed.skin_concern,
      description: parsed.description
    }
  ] as any);

  if (error) {
    throw error;
  }

  revalidatePath("/");
  return { success: true };
}
