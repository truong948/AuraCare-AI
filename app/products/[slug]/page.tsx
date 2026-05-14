import Link from "next/link";
import { ArrowLeft, ArrowRight, BadgeCheck, ShieldAlert, Sparkles, Star } from "lucide-react";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/storefront/product-card";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { StorefrontHeader } from "@/components/storefront/storefront-header";
import { AddToCartButton } from "@/components/storefront/add-to-cart-button";
import {
  formatMockPrice,
  getBadgeLabel,
  getCategoryLabel,
  getProductBySlug,
  getRelatedProducts,
  getStockLabel,
  mockProducts,
} from "@/lib/mock-data/catalog";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product, 4);

  return (
    <div className="min-h-screen bg-[#f6f4ee] text-[#0f172a]">
      <StorefrontHeader />

      <main>
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Link href={`/categories/${product.category}`} className="inline-flex items-center text-sm font-semibold text-[#5b8c7a]">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại kệ {getCategoryLabel(product.category).toLowerCase()}
          </Link>

          <div className="mt-6 grid gap-6 lg:grid-cols-[0.96fr_1.04fr]">
            <div className="rounded-[36px] border border-[#dce6df] bg-[#ffffff] p-5 shadow-[0_16px_34px_rgba(15,23,42,0.06)] sm:p-6">
              <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,#f5fbf7_0%,#edf4f0_100%)]">
                <img src={product.image} alt={product.name} className="aspect-[4/4.2] w-full object-cover" />
                <span className="absolute left-4 top-4 rounded-full bg-[rgba(255,255,255,0.94)] px-3 py-1 text-xs font-semibold text-[#5b8c7a] shadow-sm">
                  {getBadgeLabel(product.badge)}
                </span>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[22px] bg-[#f8fbfa] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">Danh mục</p>
                  <p className="mt-2 text-sm font-semibold text-[#0f172a]">{getCategoryLabel(product.category)}</p>
                </div>
                <div className="rounded-[22px] bg-[#f8fbfa] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">Xuất xứ</p>
                  <p className="mt-2 text-sm font-semibold text-[#0f172a]">{product.originCountry}</p>
                </div>
                <div className="rounded-[22px] bg-[#f8fbfa] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">Quy cách</p>
                  <p className="mt-2 text-sm font-semibold text-[#0f172a]">{product.packageSize}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[36px] border border-[#dce6df] bg-[#ffffff] p-6 shadow-[0_16px_34px_rgba(15,23,42,0.06)] sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5b8c7a]">
                {product.brand} / {getCategoryLabel(product.category)}
              </p>
              <h1 className="mt-3 text-4xl font-bold leading-tight text-[#0f172a] sm:text-5xl">{product.name}</h1>
              <p className="mt-4 text-base leading-8 text-[#475569]">{product.longDescription}</p>

              <div className="mt-5 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-[#64748b]">
                  <Star className="h-4 w-4 fill-[#e8a950] text-[#e8a950]" />
                  <span className="font-semibold text-[#0f172a]">{product.rating.toFixed(1)}</span>
                  <span>({product.reviewCount} đánh giá)</span>
                </div>
                <span className="rounded-full bg-[#edf4f1] px-3 py-1 text-xs font-semibold text-[#5b8c7a]">
                  {getStockLabel(product.stockStatus)}
                </span>
              </div>

              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-3xl font-bold text-[#0f172a]">{formatMockPrice(product.price)}</p>
                  <p className="mt-1 text-sm text-[#94a3b8] line-through">{formatMockPrice(product.compareAtPrice)}</p>
                </div>
                <div className="rounded-2xl bg-[#f5efe1] px-4 py-3 text-sm font-semibold text-[#8e6423]">
                  Tiết kiệm {formatMockPrice(product.compareAtPrice - product.price)}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <AddToCartButton productSlug={product.slug} />
                <Link
                  href="/cart"
                  className="inline-flex items-center rounded-2xl border border-[#d7e5df] bg-[#ffffff] px-5 py-3 text-sm font-semibold text-[#334155] hover:bg-[#f8fbfa]"
                >
                  Xem giỏ hàng
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {[...product.concernTags, ...product.benefitTags].slice(0, 5).map((tag) => (
                  <span key={tag} className="rounded-full bg-[#f8fbfa] px-4 py-2 text-xs font-semibold text-[#4f7c6d]">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] bg-[#f8fbfa] p-5">
                  <div className="flex items-start gap-3">
                    <BadgeCheck className="mt-0.5 h-5 w-5 text-[#5b8c7a]" />
                    <div>
                      <h2 className="text-base font-bold text-[#0f172a]">Thành phần</h2>
                      <p className="mt-2 text-sm leading-7 text-[#475569]">{product.ingredientsText}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-[24px] bg-[#f8fbfa] p-5">
                  <div className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 h-5 w-5 text-[#5b8c7a]" />
                    <div>
                      <h2 className="text-base font-bold text-[#0f172a]">Hướng dẫn sử dụng</h2>
                      <p className="mt-2 text-sm leading-7 text-[#475569]">{product.usageInstructions}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-[24px] border border-[#f1e3c5] bg-[#fff9ee] p-5">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="mt-0.5 h-5 w-5 text-[#c7861b]" />
                  <div>
                    <h2 className="text-base font-bold text-[#0f172a]">Lưu ý an toàn</h2>
                    <p className="mt-2 text-sm leading-7 text-[#6b7280]">{product.warnings}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5b8c7a]">Gợi ý liên quan</p>
              <h2 className="mt-2 text-3xl font-bold text-[#0f172a]">Sản phẩm có nhu cầu tương tự</h2>
            </div>
            <Link href={`/categories/${product.category}`} className="inline-flex items-center text-sm font-semibold text-[#5b8c7a]">
              Xem toàn bộ danh mục
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      </main>

      <StorefrontFooter />
    </div>
  );
}
