import { Scale } from "lucide-react";
import { ComparePageContent } from "@/components/storefront/compare-page-content";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { StorefrontHeader } from "@/components/storefront/storefront-header";

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-[#f6f4ee] text-[#0f172a]">
      <StorefrontHeader />

      <main>
        <section className="border-b border-[#dce6df] bg-[#ffffff]">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="rounded-[36px] border border-[#dce6df] bg-[linear-gradient(160deg,#eff6f2_0%,#f9fbfa_100%)] p-8 shadow-[0_16px_34px_rgba(15,23,42,0.05)] sm:p-10">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-[#0f172a] text-white">
                  <Scale className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5b8c7a]">Trang so sánh</p>
                  <h1 className="mt-3 text-4xl font-bold leading-tight text-[#0f172a] sm:text-5xl">
                    Đặt nhiều lựa chọn cạnh nhau để quyết định dễ hơn
                  </h1>
                  <p className="mt-4 max-w-3xl text-sm leading-8 text-[#475569] sm:text-base">
                    Đây là một bước hợp lý sau category và PDP: người dùng gom vài lựa chọn rồi mới quyết định. Nó làm trải nghiệm AuraCare gần hơn với một storefront thương mại điện tử thật sự.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <ComparePageContent />
        </section>
      </main>

      <StorefrontFooter />
    </div>
  );
}
