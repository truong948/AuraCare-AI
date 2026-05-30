import { RevenuePanel } from "@/components/dashboard/revenue-panel";
import { requireAdmin } from "@/lib/auth/roles";

export default async function RevenuePage() {
  await requireAdmin();

  return <RevenuePanel />;
}
