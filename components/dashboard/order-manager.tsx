"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, Clock3, PackageCheck, ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMockPrice } from "@/lib/mock-data/catalog";
import {
  getOrdersSummary,
  loadOrders,
  orderStatusLabels,
  updateOrderStatus,
  type Order,
  type OrderStatus,
} from "@/lib/orders";

const statusOptions: OrderStatus[] = ["pending", "processing", "completed"];

export function DashboardOrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(loadOrders());
  }, []);

  const summary = useMemo(() => getOrdersSummary(orders), [orders]);

  const handleStatusChange = (id: string, status: OrderStatus) => {
    setOrders(updateOrderStatus(id, status));
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Commerce Ops</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Quản lý đơn hàng</h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              Màn hình admin mock đọc đơn từ localStorage để demo luồng end-to-end trước khi nối backend thật.
            </p>
          </div>
          <Button asChild className="rounded-2xl bg-[#5b8c7a] text-white hover:bg-[#4f7c6d]">
            <Link href="/orders">Xem phía khách hàng</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Tổng đơn", value: summary.totalOrders, icon: ReceiptText },
          { label: "Chờ xác nhận", value: summary.pendingOrders, icon: Clock3 },
          { label: "Đang xử lý", value: summary.processingOrders, icon: PackageCheck },
          { label: "Doanh thu mock", value: formatMockPrice(summary.revenue), icon: CheckCircle2 },
        ].map((item) => (
          <div key={item.label} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf4f1] text-[#5b8c7a]">
              <item.icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-medium text-slate-500">{item.label}</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Danh sách đơn</p>
            <p className="mt-2 text-sm text-slate-600">Có thể đổi trạng thái để demo vận hành đơn hàng.</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {orders.length} orders
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="mt-6 rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
            Chưa có đơn hàng. Hãy đặt thử một đơn ở storefront để dữ liệu xuất hiện tại đây.
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-[28px] border border-slate-200 p-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                      <CalendarDays className="h-4 w-4" />
                      <span>{new Date(order.createdAt).toLocaleString("vi-VN")}</span>
                      <span className="rounded-full bg-[#edf4f1] px-3 py-1 text-xs font-semibold text-[#4f7c6d]">
                        {orderStatusLabels[order.status]}
                      </span>
                    </div>
                    <Link href={`/orders/${order.id}`} className="mt-2 block text-lg font-semibold text-slate-900 hover:text-[#5b8c7a]">
                      {order.id}
                    </Link>
                    <p className="mt-1 text-sm text-slate-500">
                      {order.shipping.name} · {order.items.length} dòng sản phẩm · {formatMockPrice(order.subtotal)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {statusOptions.map((status) => (
                      <Button
                        key={status}
                        type="button"
                        variant={order.status === status ? "default" : "outline"}
                        onClick={() => handleStatusChange(order.id, status)}
                        className="rounded-2xl"
                      >
                        {orderStatusLabels[status]}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
