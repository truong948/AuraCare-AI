import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  formatMockPrice,
  getBadgeLabel,
  getCategoryLabel,
  type MockProduct,
} from "@/lib/mock-data/catalog";

export function ProductCard({ product }: { product: MockProduct }) {
  return (
    <Card className="group overflow-hidden rounded-[28px] border border-[#d7e5df] bg-[#ffffff] py-0 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.1)]">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-[linear-gradient(180deg,#f6fbf8_0%,#edf5f1_100%)]">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          <span className="absolute left-4 top-4 rounded-full bg-[rgba(255,255,255,0.95)] px-3 py-1 text-xs font-semibold text-[#5b8c7a] shadow-sm">
            {getBadgeLabel(product.badge)}
          </span>
          <span
            aria-hidden="true"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(255,255,255,0.92)] text-[#64748b] shadow-sm transition group-hover:text-[#5b8c7a]"
          >
            <Heart className="h-4 w-4" />
          </span>
        </div>
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
      </CardContent>
    </Card>
  );
}
