import Link from "next/link";
import { ArrowRight, Boxes, SearchCheck, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/storefront/product-card";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { StorefrontHeader } from "@/components/storefront/storefront-header";
import { HomeAiChatWidget } from "@/components/storefront/home-ai-chat-widget";
import { Pagination } from "@/components/storefront/pagination";
import { storefrontCategories } from "@/lib/mock-data/catalog";
import { getProducts } from "@/lib/database-service.server";

export const dynamic = "force-dynamic";

const ITEMS_PER_PAGE = 24;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page = "1" } = await searchParams;
  const currentPage = parseInt(page, 10) || 1;
  const products = await getProducts();
  
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-[#f6f4ee] text-[#0f172a]">
      <StorefrontHeader />

      <main>
        <section className="border-b border-[#dce6df] bg-[#ffffff]">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="rounded-[36px] border border-[#dce6df] bg-[linear-gradient(160deg,#eff6f2_0%,#f9fbfa_100%)] p-8 shadow-[0_16px_34px_rgba(15,23,42,0.05)] sm:p-10">
              <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0d9488]">Tất cả sản phẩm</p>
                  <h1 className="mt-3 text-4xl font-bold leading-tight text-[#0f172a] sm:text-5xl">
                    Sản phẩm đa dạng cho mọi nhu cầu
                  </h1>
                  <p className="mt-4 max-w-3xl text-sm leading-8 text-[#475569] sm:text-base">
                    Khám phá toàn bộ danh mục sản phẩm của AuraCare từ dược mỹ phẩm, thực phẩm chức năng đến thiết bị y tế và thuốc không kê đơn.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[26px] bg-[#ffffff] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">Tổng sản phẩm</p>
                    <p className="mt-2 text-3xl font-bold text-[#0f172a]">{products.length}</p>
                  </div>
                  <div className="rounded-[26px] bg-[#ffffff] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">Danh mục</p>
                    <p className="mt-2 text-base font-semibold text-[#0f172a]">{storefrontCategories.length} nhóm</p>
                  </div>
                  <div className="rounded-[26px] bg-[#ffffff] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">Giao hàng</p>
                    <p className="mt-2 text-base font-semibold text-[#0f172a]">Toàn quốc</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#0f172a]">
              Trang {currentPage} / {totalPages}
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <Pagination totalPages={totalPages} currentPage={currentPage} />
        </section>
      </main>

      <StorefrontFooter />
      <HomeAiChatWidget />
    </div>
  );
}
