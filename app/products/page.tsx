import Link from "next/link";
import { ArrowRight, Boxes, SearchCheck, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/storefront/product-card";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { StorefrontHeader } from "@/components/storefront/storefront-header";
import { featuredProducts, skincareProducts, storefrontCategories, supplementProducts } from "@/lib/mock-data/catalog";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#f6f4ee] text-[#0f172a]">
      <StorefrontHeader />

      <main>
        <section className="border-b border-[#dce6df] bg-[#ffffff]">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="rounded-[36px] border border-[#dce6df] bg-[linear-gradient(160deg,#eff6f2_0%,#f9fbfa_100%)] p-8 shadow-[0_16px_34px_rgba(15,23,42,0.05)] sm:p-10">
              <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5b8c7a]">Catalog AuraCare</p>
                  <h1 className="mt-3 text-4xl font-bold leading-tight text-[#0f172a] sm:text-5xl">
                    Tất cả sản phẩm được gom thành một điểm vào rõ ràng
                  </h1>
                  <p className="mt-4 max-w-3xl text-sm leading-8 text-[#475569] sm:text-base">
                    Đây là trang catalog tổng hợp để người dùng bắt đầu từ overview trước khi đi vào danh mục hoặc trang
                    tư vấn. Nó giúp website có cấu trúc nhiều trang rõ ràng hơn thay vì chỉ phụ thuộc vào homepage.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[26px] bg-[#ffffff] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">Tổng sản phẩm</p>
                    <p className="mt-2 text-3xl font-bold text-[#0f172a]">60</p>
                  </div>
                  <div className="rounded-[26px] bg-[#ffffff] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">Nhóm trọng tâm</p>
                    <p className="mt-2 text-base font-semibold text-[#0f172a]">Supplement + Skincare</p>
                  </div>
                  <div className="rounded-[26px] bg-[#ffffff] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">Điểm AI</p>
                    <p className="mt-2 text-base font-semibold text-[#0f172a]">Tư vấn trực tiếp từ PDP</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Duyệt theo danh mục",
                description: "Đi nhanh vào từng kệ sản phẩm nếu bạn đã biết mình cần gì.",
                href: "/categories/supplement",
                icon: Boxes,
              },
              {
                title: "Tìm bằng nhu cầu",
                description: "Dùng semantic search nếu bạn mới chỉ biết vấn đề hoặc mục tiêu của mình.",
                href: "/search?q=da%20nh%E1%BA%A1y%20c%E1%BA%A3m%20thi%E1%BA%BFu%20%E1%BA%A9m",
                icon: SearchCheck,
              },
              {
                title: "Tư vấn với AI",
                description: "Mở trang tư vấn riêng nếu bạn muốn được dẫn dắt theo câu hỏi.",
                href: "/consult",
                icon: Sparkles,
              },
              {
                title: "Xem lịch sử AI",
                description: "Theo dõi lại các truy vấn và phiên hỏi đáp bạn đã thực hiện trước đó.",
                href: "/ai-history",
                icon: ArrowRight,
              },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="rounded-[28px] border border-[#dce6df] bg-[#ffffff] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)] transition hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf4f1] text-[#5b8c7a]">
                  <item.icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-xl font-bold text-[#0f172a]">{item.title}</h2>
                <p className="mt-2 text-sm leading-7 text-[#475569]">{item.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            {storefrontCategories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className="rounded-[32px] border border-[#d7e5df] bg-[#ffffff] p-8 shadow-[0_12px_30px_rgba(15,23,42,0.05)]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5b8c7a]">{category.label}</p>
                <h2 className="mt-3 text-3xl font-bold text-[#0f172a]">{category.itemCount} sản phẩm</h2>
                <p className="mt-3 text-sm leading-7 text-[#475569]">{category.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5b8c7a]">Nổi bật trước</p>
              <h2 className="mt-2 text-3xl font-bold text-[#0f172a]">Sản phẩm nên xem đầu tiên</h2>
            </div>
            <Link href="/consult" className="inline-flex items-center text-sm font-semibold text-[#5b8c7a]">
              Chưa biết chọn gì? Mở tư vấn AI
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <div className="grid gap-8 xl:grid-cols-2">
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5b8c7a]">Supplement</p>
                  <h2 className="mt-2 text-2xl font-bold text-[#0f172a]">Đi từ nhu cầu năng lượng, miễn dịch và tập trung</h2>
                </div>
                <Link href="/categories/supplement" className="text-sm font-semibold text-[#5b8c7a]">
                  Xem hết
                </Link>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {supplementProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>

            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b88530]">Skincare</p>
                  <h2 className="mt-2 text-2xl font-bold text-[#0f172a]">Đi từ thiếu ẩm, hàng rào da và làm dịu</h2>
                </div>
                <Link href="/categories/skincare" className="text-sm font-semibold text-[#b88530]">
                  Xem hết
                </Link>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {skincareProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <StorefrontFooter />
    </div>
  );
}
