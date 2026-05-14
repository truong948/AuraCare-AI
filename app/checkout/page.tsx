"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { AlertTriangle, CreditCard, MapPin, Package, User } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { createOrder, OrderShipping } from "@/lib/orders";
import { getProductBySlug, formatMockPrice } from "@/lib/mock-data/catalog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [shipping, setShipping] = useState<OrderShipping>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");

  const orderTotal = useMemo(() => subtotal, [subtotal]);

  const handleChange = (field: keyof OrderShipping, value: string) => {
    setShipping((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!shipping.name || !shipping.email || !shipping.phone || !shipping.address) {
      setError("Vui lòng điền đầy đủ thông tin giao hàng.");
      return;
    }
    if (items.length === 0) {
      setError("Giỏ hàng trống, thêm sản phẩm trước khi thanh toán.");
      return;
    }

    createOrder(items, shipping);
    clearCart();
    router.push("/orders");
  };

  return (
    <div className="min-h-screen bg-[#f6f4ee] text-[#0f172a] py-10">
      <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="rounded-[36px] border border-[#dce6df] bg-white p-8 shadow-[0_16px_34px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5b8c7a]">Thanh toán</p>
              <h1 className="mt-3 text-4xl font-bold text-[#0f172a]">Hoàn tất đơn hàng</h1>
            </div>
            <Link href="/cart" className="inline-flex items-center rounded-2xl bg-[#e8a950] px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-[#d59c48]">
              Quay lại giỏ hàng
            </Link>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <form onSubmit={handleSubmit} className="rounded-[28px] border border-[#d7e5df] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
            <div className="mb-4 flex items-center gap-3 text-[#0f172a]">
              <User className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Thông tin giao hàng</h2>
            </div>
            <div className="grid gap-4">
              <label className="block text-sm font-medium text-slate-700">
                Họ tên
                <input
                  value={shipping.name}
                  onChange={(event) => handleChange("name", event.target.value)}
                  className="mt-2 block w-full rounded-2xl border border-slate-200 bg-[#f8fbfa] px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Email
                <input
                  type="email"
                  value={shipping.email}
                  onChange={(event) => handleChange("email", event.target.value)}
                  className="mt-2 block w-full rounded-2xl border border-slate-200 bg-[#f8fbfa] px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Số điện thoại
                <input
                  type="tel"
                  value={shipping.phone}
                  onChange={(event) => handleChange("phone", event.target.value)}
                  className="mt-2 block w-full rounded-2xl border border-slate-200 bg-[#f8fbfa] px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Địa chỉ giao hàng
                <textarea
                  value={shipping.address}
                  onChange={(event) => handleChange("address", event.target.value)}
                  rows={4}
                  className="mt-2 block w-full rounded-2xl border border-slate-200 bg-[#f8fbfa] px-4 py-3 text-sm text-slate-900 outline-none"
                />
              </label>
            </div>
            {error ? (
              <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                <AlertTriangle className="inline-block h-4 w-4 align-text-bottom" /> {error}
              </div>
            ) : null}
            <Button type="submit" className="mt-6 rounded-2xl bg-[#5b8c7a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4f7c6d]">
              Thanh toán (giả lập)
            </Button>
          </form>

          <div className="rounded-[28px] border border-[#d7e5df] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
            <div className="mb-4 flex items-center gap-3 text-[#0f172a]">
              <CreditCard className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Tóm tắt đơn hàng</h2>
            </div>
            <div className="space-y-4 text-sm text-[#475569]">
              {items.map((item) => {
                const product = getProductBySlug(item.productSlug);
                if (!product) return null;
                return (
                  <div key={product.slug} className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-[#f8fbfa] px-4 py-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-[#0f172a]">{product.name}</p>
                      <p className="text-xs text-[#64748b]">Số lượng: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-[#0f172a]">{formatMockPrice(product.price * item.quantity)}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 space-y-2 border-t border-slate-200 pt-4 text-sm text-[#475569]">
              <div className="flex items-center justify-between">
                <span>Tạm tính</span>
                <span>{formatMockPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Phí vận chuyển</span>
                <span>Miễn phí</span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold text-[#0f172a]">
                <span>Tổng đơn</span>
                <span>{formatMockPrice(orderTotal)}</span>
              </div>
            </div>
            <div className="mt-6 rounded-3xl bg-[#f8fbfa] p-4 text-sm text-[#334155]">
              <p className="font-semibold">Chú ý</p>
              <p className="mt-2">Đây là shell thanh toán giả lập cho Phase 2 MVP. Đơn được lưu tạm trong localStorage và hiển thị tại trang đơn hàng.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
