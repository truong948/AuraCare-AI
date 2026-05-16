"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CompareToggleButton } from "@/components/storefront/compare-toggle-button";
import { ProductImage } from "@/components/storefront/product-image";
import { WishlistToggleButton } from "@/components/storefront/wishlist-toggle-button";
import {
  formatMockPrice,
  getBadgeLabel,
  getCategoryLabel,
  type MockProduct,
} from "@/lib/mock-data/catalog";

export function ProductCard({
  product,
  onProductOpen,
}: {
  product: MockProduct;
  onProductOpen?: (productSlug: string) => void;
}) {
  return (
    <Card
      className="group overflow-hidden rounded-[28px] border border-[#d7e5df] bg-[#ffffff] py-0 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.1)]"
      onClickCapture={(event) => {
        if (!onProductOpen) return;
        const target = event.target as HTMLElement | null;
        const productLink = target?.closest(`a[href="/products/${product.slug}"]`);
        if (productLink) {
          onProductOpen(product.slug);
        }
      }}
    >
      <Link href={`/products/${product.slug}`} className="block">
        <ProductImage product={product} className="aspect-[4/3]" imageClassName="p-5 group-hover:scale-[1.03]">
          <span className="absolute left-4 top-4 rounded-full bg-[rgba(255,255,255,0.95)] px-3 py-1 text-xs font-semibold text-[#5b8c7a] shadow-sm">
            {getBadgeLabel(product.badge)}
          </span>
          <WishlistToggleButton productSlug={product.slug} className="absolute right-4 top-4 h-9 w-9" />
        </ProductImage>
      </Link>

      <CardContent className="space-y-4 px-5 py-5">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#94a3b8]">
            {product.brand} / {getCategoryLabel(product.category)}
          </p>
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="line-clamp-2 text-base font-semibold leading-6 text-[#0f172a] transition group-hover:text-[#4f7c6d]">
              {product.name}
            </h3>
          </Link>
          <p className="line-clamp-2 text-sm leading-6 text-[#475569]">{product.shortDescription}</p>
        </div>

        <div className="flex items-center gap-2 text-sm text-[#64748b]">
          <Star className="h-4 w-4 fill-[#e8a950] text-[#e8a950]" />
          <span className="font-medium text-[#334155]">{product.rating.toFixed(1)}</span>
          <span>({product.reviewCount} đánh giá)</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {product.concernTags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#edf4f1] px-3 py-1 text-xs font-medium text-[#5b8c7a]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-[#0f172a]">{formatMockPrice(product.price)}</p>
            <p className="text-sm text-[#94a3b8] line-through">
              {formatMockPrice(product.compareAtPrice)}
            </p>
          </div>
          <Button asChild className="rounded-2xl bg-[#5b8c7a] px-4 text-[#ffffff] hover:bg-[#4f7c6d]">
            <Link href={`/products/${product.slug}`}>Xem chi tiết</Link>
          </Button>
        </div>

        <div className="flex items-center justify-between gap-3">
          <CompareToggleButton productSlug={product.slug} />
          <Link href="/wishlist" className="text-sm font-semibold text-[#5b8c7a]">
            Xem wishlist
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
