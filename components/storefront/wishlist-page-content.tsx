"use client";

import Link from "next/link";
import { Heart, Sparkles, Trash2 } from "lucide-react";
import { ProductCard } from "@/components/storefront/product-card";
import { useWishlist } from "@/components/wishlist/wishlist-context";
import { getProductBySlug } from "@/lib/mock-data/catalog";

export function WishlistPageContent() {
  const { items, count, clearWishlist } = useWishlist();
  const products = items
    .map((slug) => getProductBySlug(slug))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  if (products.length === 0) {
    return (
      <div className="rounded-[32px] border border-dashed border-[#d7e5df] bg-white p-8 text-center shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#edf4f1] text-[#5b8c7a]">
          <Heart className="h-7 w-7" />
        </div>
        <h2 className="mt-5 text-2xl font-bold text-[#0f172a]">Wishlist của bạn đang trống</h2>
        <p className="mt-3 text-sm leading-7 text-[#475569]">
          Hãy lưu lại những sản phẩm bạn muốn quay lại xem sau, rồi dùng AI để so sánh hoặc xin gợi ý thêm.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/products" className="rounded-2xl bg-[#5b8c7a] px-5 py-3 text-sm font-semibold text-white">
            Duyệt sản phẩm
          </Link>
          <Link
            href="/consult"
            className="rounded-2xl border border-[#d7e5df] bg-white px-5 py-3 text-sm font-semibold text-[#334155]"
          >
            Mở tư vấn AI
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 rounded-[30px] border border-[#dce6df] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)] sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5b8c7a]">Wishlist cá nhân</p>
          <h2 className="mt-2 text-3xl font-bold text-[#0f172a]">{count} sản phẩm đang được lưu</h2>
          <p className="mt-3 text-sm leading-7 text-[#475569]">
            Đây là lớp tiện ích rất hợp cho storefront AI: người dùng lưu trước, rồi quay lại so sánh hoặc hỏi sâu trên từng PDP.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/compare"
            className="inline-flex items-center rounded-2xl border border-[#d7e5df] bg-white px-5 py-3 text-sm font-semibold text-[#334155]"
          >
            <Sparkles className="mr-2 h-4 w-4 text-[#5b8c7a]" />
            Đi tới so sánh
          </Link>
          <button
            type="button"
            onClick={clearWishlist}
            className="inline-flex items-center rounded-2xl bg-[#fdf2f2] px-5 py-3 text-sm font-semibold text-[#b42318]"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa toàn bộ
          </button>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
