import { ShippingManager } from "@/components/dashboard/shipping-manager";
import { requireAdmin } from "@/lib/auth/roles";

export default async function ShippingPage() {
  await requireAdmin();

  return <ShippingManager />;
}
