"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, CheckCircle2, MapPin, Package, RefreshCw, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { ProductImage } from "@/components/storefront/product-image";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { StorefrontHeader } from "@/components/storefront/storefront-header";
import { Button } from "@/components/ui/button";
import { formatMockPrice } from "@/lib/mock-data/catalog";
import { getOrderById, orderStatusLabels, type Order } from "@/lib/orders";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { addItem } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setOrder(getOrderById(params.id) ?? null);
    setLoaded(true);
  }, [params.id]);

  const itemCount = useMemo(
    () => order?.items.reduce((total, item) => total + item.quantity, 0) ?? 0,
    [order]
  );

  const handleReorder = () => {
    if (!order) return;
    order.items.forEach((item) => addItem(item.productSlug, item.quantity));
  };

  if (loaded && !order) {
    return (
      <div className="min-h-screen bg-[#f6f4ee] text-[#0f172a]">
        <StorefrontHeader />
        <main className="px-4 py-12">
          <div className="mx-auto max-w-3xl rounded-[32px] border border-dashed border-[#d7e5df] bg-white p-10 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-[#5b8c7a]" />
            <h1 className="mt-4 text-3xl font-bold">Không tìm thấy đơn hàng</h1>
            <p className="mt-3 text-sm leading-7 text-[#64748b]">Đơn hàng mẫu chỉ được lưu trong trình duyệt hiện tại.</p>
            <Link href="/orders" className="mt-6 inline-flex rounded-2xl bg-[#5b8c7a] px-5 py-3 text-sm font-semibold text-white">
              Quay lại lịch sử đơn
            </Link>
          </div>
        </main>
        <StorefrontFooter />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f6f4ee] text-[#0f172a]">
        <StorefrontHeader />
        <main className="px-4 py-12">
          <div className="mx-auto max-w-3xl rounded-[32px] border border-[#d7e5df] bg-white p-10 text-center">
            <RefreshCw className="mx-auto h-8 w-8 animate-spin text-[#5b8c7a]" />
            <p className="mt-4 text-sm text-[#64748b]">Đang tải đơn hàng...</p>
          </div>
        </main>
        <StorefrontFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f4ee] text-[#0f172a]">
      <StorefrontHeader />
      <main className="py-10">
        <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6 lg:px-8">
        <Link href="/orders" className="inline-flex items-center text-sm font-semibold text-[#5b8c7a]">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại lịch sử đơn
        </Link>

        <section className="rounded-[36px] border border-[#dce6df] bg-white p-8 shadow-[0_16px_34px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5b8c7a]">Chi tiết đơn hàng</p>
              <h1 className="mt-3 text-4xl font-bold text-[#0f172a]">{order.id}</h1>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-[#64748b]">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#f8fbfa] px-4 py-2">
                  <CalendarDays className="h-4 w-4" />
                  {new Date(order.createdAt).toLocaleString("vi-VN")}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#edf4f1] px-4 py-2 font-semibold text-[#4f7c6d]">
                  <CheckCircle2 className="h-4 w-4" />
                  {orderStatusLabels[order.status]}
                </span>
              </div>
            </div>

            <div className="rounded-[28px] bg-[#28453a] p-5 text-white">
              <p className="text-sm text-white/70">Tổng thanh toán</p>
              <p className="mt-2 text-3xl font-bold">{formatMockPrice(order.subtotal)}</p>
              <p className="mt-1 text-sm text-white/70">{itemCount} sản phẩm</p>
              <Button onClick={handleReorder} className="mt-5 rounded-2xl bg-white text-[#28453a] hover:bg-[#f6f4ee]">
                Mua lại đơn này
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="rounded-[30px] border border-[#d7e5df] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-[#5b8c7a]" />
              <h2 className="text-lg font-bold">Giao hàng</h2>
            </div>
            <div className="mt-5 space-y-2 text-sm leading-7 text-[#475569]">
              <p className="font-semibold text-[#0f172a]">{order.shipping.name}</p>
              <p>{order.shipping.email}</p>
              <p>{order.shipping.phone}</p>
              <p>{order.shipping.address}</p>
            </div>
          </div>

          <div className="rounded-[30px] border border-[#d7e5df] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-[#5b8c7a]" />
              <h2 className="text-lg font-bold">Sản phẩm trong đơn</h2>
            </div>
            <div className="mt-5 space-y-4">
              {order.items.map((item) => (
                <div key={item.productSlug} className="flex gap-4 rounded-[24px] border border-[#d7e5df] bg-[#f8fbfa] p-4">
                  <ProductImage product={{ image: item.image, name: item.name }} className="h-20 w-20 shrink-0 rounded-2xl" imageClassName="p-2" />
                  <div className="min-w-0 flex-1">
                    <Link href={`/products/${item.productSlug}`} className="font-semibold leading-6 text-[#0f172a] hover:text-[#5b8c7a]">
                      {item.name}
                    </Link>
                    <p className="mt-1 text-sm text-[#64748b]">Số lượng: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-[#0f172a]">{formatMockPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        </div>
      </main>
      <StorefrontFooter />
    </div>
  );
}
