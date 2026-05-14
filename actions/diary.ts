"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const diarySchema = z.object({
  imageUrl: z.string().url({ message: "Invalid image URL." }),
  notes: z.string().min(3, { message: "Please add a short note." })
});

export async function saveDiaryEntry(formData: FormData) {
  const values = Object.fromEntries(formData) as { imageUrl?: string; notes?: string };
  const parsed = diarySchema.parse(values);
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Authentication required.");
  }

  const { error } = await supabase.from("skin_diaries").insert({
    user_id: user.id,
    image_url: parsed.imageUrl,
    notes: parsed.notes
  } as any);

  if (error) {
    throw error;
  }

  revalidatePath("/diary");
  return { success: true };
}
