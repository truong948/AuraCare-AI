import Link from "next/link";
import { ArrowRight, Bot, ShieldCheck, Sparkles } from "lucide-react";
import { AiRecommendationShelf } from "@/components/storefront/ai-recommendation-shelf";
import { PersonalizedShelf } from "@/components/storefront/personalized-shelf";
import { ProductCard } from "@/components/storefront/product-card";
import { ProductImage } from "@/components/storefront/product-image";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { HomeAiChatWidget } from "@/components/storefront/home-ai-chat-widget";
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
    <div className="min-h-screen bg-slate-50 text-[#0f172a]">
      <StorefrontHeader />

      <main className="pb-16">
        <section className="border-b border-slate-200/80 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_28%),linear-gradient(180deg,#eff6ff_0%,#ffffff_100%)]">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-16">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-[#0b57c5] shadow-sm">
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
                  className="inline-flex items-center rounded-2xl bg-[#0b57c5] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/10 hover:bg-[#0b57c5]/90 transition"
                >
                  Xem sản phẩm
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/consult"
                  className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-[#334155] hover:bg-slate-50 transition"
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
                  <div key={item.label} className="rounded-[24px] border border-slate-200 bg-white px-4 py-4 shadow-sm">
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
                  className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_16px_36px_rgba(15,23,42,0.05)] transition hover:border-blue-200 hover:shadow-[0_16px_36px_rgba(59,130,246,0.08)]"
                >
                  <ProductImage product={product} className="aspect-[4/3]" imageClassName="p-5" />
                  <div className="space-y-3 p-5">
                    <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0b57c5]">
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
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0b57c5]">Danh mục chính</p>
              <h2 className="mt-2 text-3xl font-bold text-[#0f172a]">Đi nhanh theo nhu cầu</h2>
            </div>
            <Link href="/products" className="text-sm font-semibold text-[#0b57c5] hover:underline">
              Xem tất cả
            </Link>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {storefrontCategories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className="rounded-[30px] border border-slate-200 bg-white p-7 shadow-[0_12px_30px_rgba(15,23,42,0.03)] transition hover:-translate-y-1 hover:border-blue-100 hover:shadow-[0_12px_30px_rgba(59,130,246,0.06)]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0b57c5]">{category.label}</p>
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
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0b57c5]">Nổi bật</p>
              <h2 className="mt-2 text-3xl font-bold text-[#0f172a]">Sản phẩm nên xem trước</h2>
            </div>
            <Link href="/compare" className="text-sm font-semibold text-[#0b57c5] hover:underline">
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
            <div className="rounded-[32px] bg-[linear-gradient(135deg,#1e3a8a_0%,#0b57c5_100%)] p-8 text-white shadow-[0_18px_40px_rgba(59,130,246,0.12)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12">
                <Bot className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-3xl font-bold">Chưa biết chọn gì?</h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-white/80">
                Vào trang tư vấn, chọn nhu cầu và để AI tạo shortlist gọn cho bạn.
              </p>
              <Link
                href="/consult"
                className="mt-6 inline-flex items-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[#0b57c5] shadow-sm hover:bg-slate-50 transition"
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
                  className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.03)] transition hover:-translate-y-1 hover:border-blue-100 hover:shadow-[0_12px_30px_rgba(59,130,246,0.06)]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-[#0b57c5]">
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
      <HomeAiChatWidget />
    </div>
  );
}
