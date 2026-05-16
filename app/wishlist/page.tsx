import { Heart } from "lucide-react";
import { WishlistPageContent } from "@/components/storefront/wishlist-page-content";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { StorefrontHeader } from "@/components/storefront/storefront-header";

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-[#f6f4ee] text-[#0f172a]">
      <StorefrontHeader />

      <main>
        <section className="border-b border-[#dce6df] bg-[#ffffff]">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="rounded-[36px] border border-[#dce6df] bg-[linear-gradient(160deg,#eff6f2_0%,#f9fbfa_100%)] p-8 shadow-[0_16px_34px_rgba(15,23,42,0.05)] sm:p-10">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-[#5b8c7a] text-white">
                  <Heart className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5b8c7a]">Trang yêu thích</p>
                  <h1 className="mt-3 text-4xl font-bold leading-tight text-[#0f172a] sm:text-5xl">
                    Lưu lại các sản phẩm bạn muốn quay lại quyết định sau
                  </h1>
                  <p className="mt-4 max-w-3xl text-sm leading-8 text-[#475569] sm:text-base">
                    Wishlist rất nên có ở giai đoạn này vì nó giúp storefront có cảm giác mua sắm thật hơn, đồng thời tạo bệ cho các bước so sánh và tư vấn tiếp theo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <WishlistPageContent />
        </section>
      </main>

      <StorefrontFooter />
    </div>
  );
}
