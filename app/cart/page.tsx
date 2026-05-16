"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { AiRecommendationShelf } from "@/components/storefront/ai-recommendation-shelf";
import { ProductImage } from "@/components/storefront/product-image";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { StorefrontHeader } from "@/components/storefront/storefront-header";
import { getCartRecommendations } from "@/lib/ai/recommendations";
import { formatMockPrice, getProductBySlug } from "@/lib/mock-data/catalog";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const cartRecommendations = getCartRecommendations(items.map((item) => item.productSlug), 4);

  return (
    <div className="min-h-screen bg-[#f6f4ee] text-[#0f172a]">
      <StorefrontHeader />
      <main className="py-10">
        <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="rounded-[36px] border border-[#dce6df] bg-white p-8 shadow-[0_16px_34px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5b8c7a]">Giỏ hàng</p>
              <h1 className="mt-3 text-4xl font-bold text-[#0f172a]">Kiểm tra lại sản phẩm trước khi thanh toán</h1>
            </div>
            <Link
              href="/checkout"
              className="inline-flex items-center rounded-2xl bg-[#5b8c7a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4f7c6d]"
            >
              Tiếp đến thanh toán
            </Link>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-[#d7e5df] bg-white p-10 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-[#5b8c7a]" />
            <p className="mt-4 text-xl font-semibold text-[#0f172a]">Giỏ hàng trống</p>
            <p className="mt-2 text-sm text-[#64748b]">Thêm sản phẩm để bắt đầu thanh toán.</p>
            <Link
              href="/"
              className="mt-6 inline-flex rounded-2xl bg-[#5b8c7a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4f7c6d]"
            >
              Quay về cửa hàng
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
            <div className="space-y-4">
              {items.map((item) => {
                const product = getProductBySlug(item.productSlug);
                if (!product) return null;

                return (
                  <div
                    key={item.productSlug}
                    className="rounded-[28px] border border-[#d7e5df] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex gap-4">
                        <ProductImage product={product} className="h-24 w-24 shrink-0 rounded-3xl" imageClassName="p-2" />
                        <div className="min-w-0">
                          <p className="text-base font-semibold text-[#0f172a]">{product.name}</p>
                          <p className="mt-1 text-sm text-[#64748b]">{product.shortDescription}</p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 sm:items-end">
                        <div className="inline-flex items-center gap-2 rounded-full bg-[#f5f8f6] px-3 py-2 text-sm text-[#334155]">
                          <button onClick={() => updateQuantity(product.slug, item.quantity - 1)} className="rounded-full bg-white p-2 shadow-sm">
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="font-semibold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(product.slug, item.quantity + 1)} className="rounded-full bg-white p-2 shadow-sm">
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="text-lg font-semibold text-[#0f172a]">{formatMockPrice(product.price * item.quantity)}</p>
                        <button
                          onClick={() => removeItem(product.slug)}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-[#c2410c] hover:text-[#9a3412]"
                        >
                          <Trash2 className="h-4 w-4" /> Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-[28px] border border-[#d7e5df] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5b8c7a]">Tóm tắt đơn hàng</p>
              <div className="mt-4 space-y-3 text-sm text-[#475569]">
                <div className="flex items-center justify-between">
                  <span>Thành tiền</span>
                  <span>{formatMockPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Phí vận chuyển</span>
                  <span>Miễn phí</span>
                </div>
              </div>
              <div className="mt-6 rounded-3xl bg-[#f8fbfa] p-4 text-sm text-[#334155]">
                <p className="font-semibold">Sẵn sàng cho bước thanh toán</p>
                <p className="mt-2">Giỏ hàng hiện có {items.length} sản phẩm với tổng giá trị {formatMockPrice(subtotal)}.</p>
              </div>
              <Link
                href="/checkout"
                className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-[#5b8c7a] px-4 py-3 text-sm font-semibold text-white hover:bg-[#4f7c6d]"
              >
                Đi tới thanh toán
              </Link>
            </div>
          </div>
        )}

        <AiRecommendationShelf
          title="Gợi ý mua kèm cho giỏ hàng hiện tại"
          description="Rule-based recommendation đang nhìn vào concern tags, benefit tags và mức độ gần nhau giữa các sản phẩm trong giỏ để đề xuất lựa chọn tiếp theo."
          items={cartRecommendations}
          href="/search?q=goi%20y%20bo%20sung"
          hrefLabel="Mở semantic search"
          surface="cart-cross-sell"
        />
        </div>
      </main>
      <StorefrontFooter />
    </div>
  );
}
