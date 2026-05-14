import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { MockProduct } from "@/lib/mock-data/catalog";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value / 25000);
}

export function ProductCard({ product }: { product: MockProduct }) {
  return (
    <Card className="overflow-hidden rounded-[28px] border border-[#d7e5df] bg-white py-0 shadow-sm shadow-slate-950/5">
      <div className="relative aspect-[4/3] overflow-hidden bg-[linear-gradient(180deg,#f6fbf8_0%,#edf5f1_100%)]">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#5b8c7a] shadow-sm">
          {product.badge}
        </span>
        <button
          aria-label={`Save ${product.name}`}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-sm transition hover:text-[#5b8c7a]"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>

      <CardContent className="space-y-4 px-5 py-5">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            {product.brand} / {product.category}
          </p>
          <h3 className="line-clamp-2 text-base font-semibold leading-6 text-slate-900">
            {product.name}
          </h3>
          <p className="line-clamp-2 text-sm leading-6 text-slate-600">{product.shortDescription}</p>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Star className="h-4 w-4 fill-[#e8a950] text-[#e8a950]" />
          <span className="font-medium text-slate-700">{product.rating.toFixed(1)}</span>
          <span>({product.reviewCount} reviews)</span>
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
            <p className="text-lg font-semibold text-slate-900">{formatCurrency(product.price)}</p>
            <p className="text-sm text-slate-400 line-through">
              {formatCurrency(product.compareAtPrice)}
            </p>
          </div>
          <Button className="rounded-2xl bg-[#5b8c7a] px-4 hover:bg-[#4f7c6d]">
            Add to cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
