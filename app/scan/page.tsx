import ScanShell from "@/components/scan/scan-shell";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { StorefrontHeader } from "@/components/storefront/storefront-header";

export default function ScanPage() {
  return (
    <div className="min-h-screen bg-[#f6f4ee] text-[#0f172a]">
      <StorefrontHeader />
      <main className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="rounded-[36px] border border-[#dce6df] bg-[linear-gradient(160deg,#eff6f2_0%,#ffffff_100%)] p-8 shadow-[0_16px_34px_rgba(15,23,42,0.06)] sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#5b8c7a]">AuraCare AI Scan</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight text-[#0f172a] sm:text-5xl">
              Chụp ảnh da, nhận đánh giá AI và sản phẩm gợi ý
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-8 text-[#475569] sm:text-base">
              Tính năng này dùng Gemini Vision khi có API key thật để quan sát ảnh da, nhận diện dấu hiệu bề mặt như mẩn đỏ, thiếu ẩm, da nhạy cảm hoặc mụn, sau đó ghép với catalog AuraCare để đề xuất sản phẩm phù hợp.
            </p>
          </section>
          <ScanShell />
        </div>
      </main>
      <StorefrontFooter />
    </div>
  );
}
