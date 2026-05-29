import { requireAdmin } from "@/lib/auth/roles";
import { Truck } from "lucide-react";

export default async function ShippingPage() {
  await requireAdmin();

  return (
    <div className="rounded-[36px] bg-white p-8 shadow-sm border border-[#dce6df] text-center mt-12">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-teal-50 text-[#0d9488] mb-6">
        <Truck className="h-10 w-10" />
      </div>
      <h2 className="text-2xl font-bold text-[#0f172a] mb-2">Quản lý giao hàng</h2>
      <p className="text-[#475569] max-w-md mx-auto">Tính năng theo dõi vận đơn và đối tác vận chuyển đang được phát triển.</p>
    </div>
  );
}
