"use server";

import { createClient } from "@/utils/supabase/server";
import { profileSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

const normalizeProfileForm = (formData: FormData) => {
  return {
    skinType: formData.get("skinType")?.toString() ?? "",
    concerns: formData.getAll("concerns").map((value) => value.toString()),
    allergies: formData.getAll("allergies").map((value) => value.toString())
  };
};

export async function createSkinProfile(formData: FormData) {
  const values = normalizeProfileForm(formData);
  const parsed = profileSchema.parse(values);
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Authentication required.");
  }

  const { error } = await (supabase as any).from("skin_profiles").insert({
    user_id: user.id,
    skin_type: parsed.skinType,
    concerns: parsed.concerns,
    allergies: parsed.allergies
  });

  if (error) {
    throw error;
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateSkinProfile(formData: FormData) {
  const values = normalizeProfileForm(formData);
  const parsed = profileSchema.parse(values);
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Authentication required.");
  }

  const { error } = await (supabase as any)
    .from("skin_profiles")
    .update({
      skin_type: parsed.skinType,
      concerns: parsed.concerns,
      allergies: parsed.allergies
    })
    .eq("user_id", user.id);

  if (error) {
    throw error;
  }

  revalidatePath("/dashboard");
  return { success: true };
}
