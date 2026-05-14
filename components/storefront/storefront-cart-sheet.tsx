"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/components/cart/cart-context";
import { getBadgeLabel, formatMockPrice, getProductBySlug } from "@/lib/mock-data/catalog";

export function StorefrontCartSheet() {
  const { items, subtotal, count, updateQuantity, removeItem } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="rounded-2xl bg-[#e8a950] px-4 text-slate-950 hover:bg-[#d59c48]">
          <ShoppingBag className="mr-2 h-4 w-4" />
          Giỏ hàng ({count})
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full border-[#d7e5df] bg-[#fcfdfc] p-0 sm:max-w-md">
        <SheetHeader className="border-b border-[#e3ece7] px-6 py-5">
          <SheetTitle className="text-xl font-bold text-[#0f172a]">Giỏ hàng</SheetTitle>
          <SheetDescription className="text-sm leading-6 text-[#64748b]">
            Giỏ hàng được đồng bộ trong trình duyệt để thử commerce core Phase 2.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          {items.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-[#d7e5df] bg-[#ffffff] p-6 text-center text-sm text-[#64748b]">
              Giỏ hàng đang trống. Thêm sản phẩm để tiếp tục.
            </div>
          ) : (
            items.map((item) => {
              const product = getProductBySlug(item.productSlug);
              if (!product) return null;

              return (
                <div
                  key={item.productSlug}
                  className="rounded-[24px] border border-[#d7e5df] bg-[#ffffff] p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
                >
                  <div className="flex gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-24 w-24 rounded-2xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="rounded-full bg-[#edf4f1] px-3 py-1 text-xs font-semibold text-[#5b8c7a] inline-flex">
                            {getBadgeLabel(product.badge)}
                          </p>
                          <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-[#0f172a]">
                            {product.name}
                          </h3>
                        </div>
                        <p className="text-sm font-bold text-[#0f172a]">{formatMockPrice(product.price)}</p>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 rounded-full bg-[#f5f8f6] px-2 py-1 text-sm text-[#334155]">
                          <button
                            onClick={() => updateQuantity(product.slug, item.quantity - 1)}
                            className="rounded-full bg-[#ffffff] p-1 text-[#64748b] shadow-sm"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-semibold text-[#0f172a]">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.slug, item.quantity + 1)}
                            className="rounded-full bg-[#ffffff] p-1 text-[#64748b] shadow-sm"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <Link href={`/products/${product.slug}`} className="text-sm font-semibold text-[#5b8c7a]">
                            Xem sản phẩm
                          </Link>
                          <button
                            onClick={() => removeItem(product.slug)}
                            className="text-sm font-semibold text-[#c2410c]"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <SheetFooter className="border-t border-[#e3ece7] bg-[#ffffff] px-6 py-5">
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#64748b]">Tạm tính</span>
              <span className="text-lg font-bold text-[#0f172a]">{formatMockPrice(subtotal)}</span>
            </div>
            <Button asChild className="h-11 w-full rounded-2xl bg-[#5b8c7a] text-[#ffffff] hover:bg-[#4f7c6d]">
              <Link href="/cart">
                Xem giỏ hàng và thanh toán
              </Link>
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
