import { DashboardOrderManager } from "@/components/dashboard/order-manager";
import { requireAdmin } from "@/lib/auth/roles";

export default async function DashboardOrdersPage() {
  await requireAdmin();

  return <DashboardOrderManager />;
}
