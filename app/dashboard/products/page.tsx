import { DashboardProductManager } from "@/components/dashboard/product-manager";
import { requireAdmin } from "@/lib/auth/roles";

export default async function DashboardProductsPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <DashboardProductManager />
    </div>
  );
}
