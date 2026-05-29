import { requireAdmin } from "@/lib/auth/roles";
import { Banknote } from "lucide-react";

export default async function RevenuePage() {
  await requireAdmin();

  return (
    <div className="rounded-[36px] bg-white p-8 shadow-sm border border-[#dce6df] text-center mt-12">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-teal-50 text-[#0d9488] mb-6">
        <Banknote className="h-10 w-10" />
      </div>
      <h2 className="text-2xl font-bold text-[#0f172a] mb-2">Báo cáo doanh thu</h2>
      <p className="text-[#475569] max-w-md mx-auto">Tính năng này đang được phát triển. Vui lòng quay lại sau để xem biểu đồ và thống kê tài chính.</p>
    </div>
  );
}
