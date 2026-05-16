"use client";

import { useEffect, useState } from "react";
import { CalendarDays, ShoppingBag } from "lucide-react";
import { loadOrders, orderStatusLabels } from "@/lib/orders";
import { formatMockPrice } from "@/lib/mock-data/catalog";
import Link from "next/link";
import { ProductImage } from "@/components/storefront/product-image";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { StorefrontHeader } from "@/components/storefront/storefront-header";

export default function OrdersPage() {
  const [orders, setOrders] = useState([] as Array<ReturnType<typeof loadOrders>[number]>);

  useEffect(() => {
    setOrders(loadOrders());
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f4ee] text-[#0f172a]">
      <StorefrontHeader />
      <main className="py-10">
        <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="rounded-[36px] border border-[#dce6df] bg-white p-8 shadow-[0_16px_34px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5b8c7a]">Đơn hàng</p>
              <h1 className="mt-3 text-4xl font-bold text-[#0f172a]">Lịch sử đơn hàng</h1>
            </div>
            <Link href="/" className="inline-flex items-center rounded-2xl bg-[#5b8c7a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4f7c6d]">
              Quay về cửa hàng
            </Link>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-[#d7e5df] bg-white p-10 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-[#5b8c7a]" />
            <p className="mt-4 text-xl font-semibold text-[#0f172a]">Chưa có đơn hàng</p>
            <p className="mt-2 text-sm text-[#64748b]">Hoàn tất thanh toán để tạo đơn hàng mẫu trong localStorage.</p>
            <Link href="/cart" className="mt-6 inline-flex rounded-2xl bg-[#5b8c7a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4f7c6d]">
              Xem giỏ hàng
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="rounded-[28px] border border-[#d7e5df] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-[#64748b]">
                      <CalendarDays className="h-4 w-4" />
                      <span>{new Date(order.createdAt).toLocaleString("vi-VN")}</span>
                    </div>
                    <Link href={`/orders/${order.id}`} className="mt-2 block text-xl font-semibold text-[#0f172a] hover:text-[#5b8c7a]">
                      Mã đơn hàng: {order.id}
                    </Link>
                    <p className="text-sm text-[#475569]">Trạng thái: {orderStatusLabels[order.status]}</p>
                  </div>
                  <div className="rounded-2xl bg-[#f5f8f6] px-4 py-3 text-sm text-[#334155]">
                    Tổng: {formatMockPrice(order.subtotal)}
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-[#f8fbfa] p-4">
                    <p className="text-sm font-semibold text-[#0f172a]">Thông tin giao hàng</p>
                    <p className="mt-3 text-sm text-[#475569]">{order.shipping.name}</p>
                    <p className="text-sm text-[#475569]">{order.shipping.email}</p>
                    <p className="text-sm text-[#475569]">{order.shipping.phone}</p>
                    <p className="mt-2 text-sm text-[#475569]">{order.shipping.address}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-[#f8fbfa] p-4">
                    <p className="text-sm font-semibold text-[#0f172a]">Sản phẩm</p>
                    <div className="mt-3 space-y-3">
                      {order.items.map((item) => (
                        <div key={item.productSlug} className="flex items-center gap-3">
                          <ProductImage
                            product={{ image: item.image, name: item.name }}
                            className="h-14 w-14 shrink-0 rounded-2xl"
                            imageClassName="p-1.5"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#0f172a]">{item.name}</p>
                            <p className="text-xs text-[#64748b]">Số lượng {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </main>
      <StorefrontFooter />
    </div>
  );
}
