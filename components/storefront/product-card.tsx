"use client";

import Link from "next/link";
import { Plus, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductImage } from "@/components/storefront/product-image";
import { useCart } from "@/components/cart/cart-context";
import {
  formatMockPrice,
  type MockProduct,
} from "@/lib/mock-data/catalog";
import { toast } from "react-hot-toast";

export function ProductCard({
  product,
  onProductOpen,
}: {
  product: MockProduct;
  onProductOpen?: (productSlug: string) => void;
}) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product.slug, 1);
    toast.success(`Đã thêm ${product.name} vào giỏ hàng`);
  };

  return (
    <Card
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
      onClickCapture={(event) => {
        if (!onProductOpen) return;
        const target = event.target as HTMLElement | null;
        const productLink = target?.closest(`a[href="/products/${product.slug}"]`);
        if (productLink) {
          onProductOpen(product.slug);
        }
      }}
    >
      <Link href={`/products/${product.slug}`} className="block relative">
        <ProductImage product={product} className="aspect-square bg-white" imageClassName="p-4 group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          <span className="inline-flex items-center gap-1 rounded bg-[#0d9488] px-2 py-1 text-[10px] font-bold uppercase text-white shadow-sm">
            <ShieldCheck className="h-3 w-3" /> Chính hãng
          </span>
          {product.badge && (
            <span className="inline-block rounded bg-rose-500 px-2 py-1 text-[10px] font-bold uppercase text-white shadow-sm">
              {product.badge}
            </span>
          )}
        </div>
      </Link>

      <CardContent className="flex flex-col gap-2 p-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {product.brand}
        </p>
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="line-clamp-2 min-h-[40px] text-sm font-semibold leading-5 text-slate-800 transition group-hover:text-[#0d9488]">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span className="font-medium text-slate-700">{product.rating.toFixed(1)}</span>
          <span>({product.reviewCount})</span>
        </div>

        <div className="mt-2 flex items-end justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-base font-bold text-rose-600">
              {formatMockPrice(product.price)}
            </span>
            {product.compareAtPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                {formatMockPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          <Button 
            onClick={handleAddToCart}
            size="icon" 
            className="h-8 w-8 rounded-full bg-[#0d9488] text-white hover:bg-teal-700"
            aria-label="Thêm vào giỏ"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
