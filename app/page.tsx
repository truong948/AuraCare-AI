import Link from "next/link";
import { ArrowRight, Bot, ShieldCheck, Sparkles } from "lucide-react";
import { AiRecommendationShelf } from "@/components/storefront/ai-recommendation-shelf";
import { PersonalizedShelf } from "@/components/storefront/personalized-shelf";
import { ProductCard } from "@/components/storefront/product-card";
import { ProductImage } from "@/components/storefront/product-image";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { StorefrontHeader } from "@/components/storefront/storefront-header";
import { getHomeRecommendations } from "@/lib/ai/recommendations";
import {
  flashDealProducts,
  getCategoryLabel,
  skincareProducts,
  storefrontCategories,
  supplementProducts,
} from "@/lib/mock-data/catalog";

const heroProducts = [supplementProducts[0], skincareProducts[0]].filter(Boolean);

export default function HomePage() {
  const recommendations = getHomeRecommendations(4);
  const featuredProducts = [...flashDealProducts, ...supplementProducts.slice(0, 2)].slice(0, 4);

  return (
    <div className="min-h-screen bg-[#f6f4ee] text-[#0f172a]">
      <StorefrontHeader />

      <main className="pb-16">
        <section className="border-b border-[#dce6df] bg-[radial-gradient(circle_at_top_right,rgba(232,169,80,0.18),transparent_28%),linear-gradient(180deg,#eff5f1_0%,#f6f4ee_100%)]">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-16">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#d7e5df] bg-white px-4 py-2 text-sm font-semibold text-[#5b8c7a] shadow-sm">
                <ShieldCheck className="h-4 w-4" />
                Sạch, gọn, dễ chọn
              </span>

              <div className="space-y-4">
                <h1 className="max-w-2xl text-4xl font-bold leading-tight text-[#0f172a] sm:text-5xl">
                  Mua sản phẩm sức khỏe đơn giản hơn với AuraCare AI
                </h1>
                <p className="max-w-xl text-base leading-8 text-[#475569]">
                  Tập trung vào supplement và skincare. Ít rối hơn, dễ tìm hơn, có AI hỗ trợ khi cần.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center rounded-2xl bg-[#5b8c7a] px-5 py-3 text-sm font-semibold text-white"
                >
                  Xem sản phẩm
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/consult"
                  className="inline-flex items-center rounded-2xl border border-[#d7e5df] bg-white px-5 py-3 text-sm font-semibold text-[#334155]"
                >
                  Tư vấn với AI
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Danh mục", value: "2" },
                  { label: "Sản phẩm", value: "60" },
                  { label: "AI hỗ trợ", value: "24/7" },
                ].map((item) => (
                  <div key={item.label} className="rounded-[24px] border border-[#dce6df] bg-white px-4 py-4 shadow-sm">
                    <p className="text-2xl font-bold text-[#0f172a]">{item.value}</p>
                    <p className="mt-1 text-sm text-[#64748b]">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {heroProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="overflow-hidden rounded-[30px] border border-[#dce6df] bg-white shadow-[0_16px_36px_rgba(15,23,42,0.08)]"
                >
                  <ProductImage product={product} className="aspect-[4/3]" imageClassName="p-5" />
                  <div className="space-y-3 p-5">
                    <span className="inline-flex rounded-full bg-[#edf4f1] px-3 py-1 text-xs font-semibold text-[#5b8c7a]">
                      {getCategoryLabel(product.category)}
                    </span>
                    <h2 className="line-clamp-2 text-lg font-semibold leading-7 text-[#0f172a]">{product.name}</h2>
                    <p className="line-clamp-2 text-sm leading-7 text-[#64748b]">{product.shortDescription}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5b8c7a]">Danh mục chính</p>
              <h2 className="mt-2 text-3xl font-bold text-[#0f172a]">Đi nhanh theo nhu cầu</h2>
            </div>
            <Link href="/products" className="text-sm font-semibold text-[#5b8c7a]">
              Xem tất cả
            </Link>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {storefrontCategories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className="rounded-[30px] border border-[#d7e5df] bg-white p-7 shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition hover:-translate-y-1"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5b8c7a]">{category.label}</p>
                <p className="mt-3 text-3xl font-bold text-[#0f172a]">{category.itemCount} sản phẩm</p>
                <p className="mt-3 max-w-lg text-sm leading-7 text-[#64748b]">{category.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <PersonalizedShelf />
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <AiRecommendationShelf
            title="AI gợi ý"
            description="Một vài lựa chọn khởi đầu dễ xem và dễ hỏi tiếp."
            items={recommendations}
            href="/consult"
            hrefLabel="Mở tư vấn AI"
            surface="home-default"
          />
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5b8c7a]">Nổi bật</p>
              <h2 className="mt-2 text-3xl font-bold text-[#0f172a]">Sản phẩm nên xem trước</h2>
            </div>
            <Link href="/compare" className="text-sm font-semibold text-[#5b8c7a]">
              So sánh sản phẩm
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[32px] bg-[linear-gradient(135deg,#28453a_0%,#5b8c7a_100%)] p-8 text-white shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12">
                <Bot className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-3xl font-bold">Chưa biết chọn gì?</h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-white/80">
                Vào trang tư vấn, chọn nhu cầu và để AI tạo shortlist gọn cho bạn.
              </p>
              <Link
                href="/consult"
                className="mt-6 inline-flex items-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[#355647]"
              >
                Bắt đầu tư vấn
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { title: "Wishlist", href: "/wishlist" },
                { title: "So sánh", href: "/compare" },
                { title: "Bài viết", href: "/articles" },
                { title: "Lịch sử AI", href: "/ai-history" },
              ].map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="rounded-[28px] border border-[#d7e5df] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition hover:-translate-y-1"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf4f1] text-[#5b8c7a]">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-[#0f172a]">{item.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <StorefrontFooter />
    </div>
  );
}
