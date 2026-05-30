"use client";

import { useEffect, useState } from "react";
import {
  Truck,
  PackageOpen,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  MapPin,
} from "lucide-react";
import { loadOrders, updateOrderStatus, type Order } from "@/lib/orders";

type ShippingStatus = "processing" | "shipped" | "delivered";

interface StatusColumnConfig {
  status: ShippingStatus;
  title: string;
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
  headerColor: string;
}

const columns: StatusColumnConfig[] = [
  {
    status: "processing",
    title: "Đang chuẩn bị",
    icon: <PackageOpen className="h-5 w-5 text-blue-600" />,
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    headerColor: "bg-blue-50/80",
  },
  {
    status: "shipped",
    title: "Đang giao hàng",
    icon: <Truck className="h-5 w-5 text-amber-600" />,
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    headerColor: "bg-amber-50/80",
  },
  {
    status: "delivered",
    title: "Giao thành công",
    icon: <CheckCircle2 className="h-5 w-5 text-teal-600" />,
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    headerColor: "bg-teal-50/80",
  },
];

export function ShippingManager() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function init() {
      const data = await loadOrders();
      setOrders(data);
    }
    init();
  }, []);

  const moveOrder = async (id: string, newStatus: string) => {
    try {
      const updated = await updateOrderStatus(id, newStatus as any);
      setOrders(updated);
    } catch {
      // Cập nhật local state khi Supabase thất bại
      setOrders((cur) =>
        cur.map((o) => (o.id === id ? { ...o, status: newStatus as any } : o))
      );
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-[32px] border border-[#dce6df] bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#5b8c7a]">
            Logistics Management
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-[#0f172a]">Quản lý Giao hàng</h1>
        </div>
        <p className="text-[#475569] text-sm max-w-2xl">
          Theo dõi hành trình của các đơn hàng. Di chuột vào từng thẻ đơn hàng để thao tác chuyển
          trạng thái nhanh chóng giữa các bước giao nhận.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(({ status, title, icon, bgColor, borderColor, headerColor }) => {
          const columnOrders = orders.filter((o) => (o.status as string) === status);

          return (
            <div
              key={status}
              className={`flex flex-col rounded-3xl border ${borderColor} ${bgColor} overflow-hidden`}
            >
              <div
                className={`flex items-center justify-between p-4 ${headerColor}`}
              >
                <div className="flex items-center gap-2 text-[#0f172a] font-semibold">
                  {icon}
                  <h3>{title}</h3>
                </div>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold shadow-sm text-slate-700">
                  {columnOrders.length}
                </span>
              </div>

              <div className="flex-1 p-4 space-y-4 min-h-[500px]">
                {columnOrders.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">
                    Không có đơn hàng
                  </div>
                ) : (
                  columnOrders.map((order) => (
                    <div
                      key={order.id}
                      className="group relative rounded-2xl border border-[#dce6df] bg-white p-4 shadow-sm transition-all hover:border-[#0d9488] hover:shadow-md"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm font-bold text-[#0d9488]">
                          {order.id.slice(0, 8).toUpperCase()}
                        </span>
                        <span className="text-[10px] font-medium text-slate-500">
                          {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>

                      <p className="font-semibold text-[#0f172a] text-sm">{order.shipping.name}</p>
                      <div className="flex items-start gap-1 mt-1.5 text-xs text-slate-500">
                        <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                        <p className="line-clamp-2">{order.shipping.address}</p>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                        <p className="text-xs font-semibold text-[#0f172a]">
                          {order.subtotal.toLocaleString("vi-VN")} đ
                        </p>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {status === "processing" && (
                            <button
                              onClick={() => moveOrder(order.id, "shipped")}
                              className="flex items-center gap-1 rounded-xl bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-700 hover:bg-amber-200"
                            >
                              Giao hàng <ChevronRight className="h-3 w-3" />
                            </button>
                          )}
                          {status === "shipped" && (
                            <>
                              <button
                                onClick={() => moveOrder(order.id, "processing")}
                                className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                              >
                                <ChevronLeft className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => moveOrder(order.id, "delivered")}
                                className="flex items-center gap-1 rounded-xl bg-teal-100 px-2.5 py-1 text-[10px] font-bold text-teal-700 hover:bg-teal-200"
                              >
                                Hoàn tất <ChevronRight className="h-3 w-3" />
                              </button>
                            </>
                          )}
                          {status === "delivered" && (
                            <button
                              onClick={() => moveOrder(order.id, "shipped")}
                              className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                            >
                              <ChevronLeft className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
