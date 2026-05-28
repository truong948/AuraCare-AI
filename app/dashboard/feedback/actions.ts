"use server";

import { adminDeleteProductFeedback } from "@/lib/database-service.server";
import { requireAdmin } from "@/lib/auth/roles";
import { revalidatePath } from "next/cache";

export async function deleteFeedbackAction(formData: FormData): Promise<void> {
  // Ensure the caller is an authorized admin
  await requireAdmin();

  const feedbackId = formData.get("feedbackId") as string;
  if (!feedbackId) {
    return;
  }

  await adminDeleteProductFeedback(feedbackId);

  // Revalidate routes to reflect changes immediately
  revalidatePath("/dashboard/feedback");
  revalidatePath("/dashboard");
}
