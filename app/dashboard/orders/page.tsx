"use client";

import { useState, useMemo } from "react";
import { mockOrders, type MockOrder, type OrderStatus } from "@/lib/mock-data/orders";
import { PackageOpen, Clock, Truck, CheckCircle2, XCircle } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<MockOrder[]>(mockOrders);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"><Clock className="h-3 w-3" /> Chờ xử lý</span>;
      case "processing":
        return <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"><PackageOpen className="h-3 w-3" /> Đang chuẩn bị</span>;
      case "shipped":
        return <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700"><Truck className="h-3 w-3" /> Đang giao</span>;
      case "delivered":
        return <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700"><CheckCircle2 className="h-3 w-3" /> Đã giao</span>;
      case "cancelled":
        return <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700"><XCircle className="h-3 w-3" /> Đã hủy</span>;
    }
  };

  const handleStatusChange = (id: string, newStatus: OrderStatus) => {
    setOrders(current => current.map(o => o.id === id ? { ...o, status: newStatus } : o));
    // Here we would normally call an API to update Supabase.
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-[32px] border border-[#dce6df] bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#5b8c7a]">Order Management</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#0f172a]">Quản lý đơn hàng</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mt-4">
          <div className="rounded-2xl bg-[#f6f4ee] p-5">
            <p className="text-sm font-medium text-[#5b8c7a]">Tổng đơn</p>
            <p className="mt-2 text-3xl font-semibold text-[#0d9488]">{orders.length}</p>
          </div>
          <div className="rounded-2xl bg-[#f6f4ee] p-5">
            <p className="text-sm font-medium text-[#5b8c7a]">Chờ xử lý</p>
            <p className="mt-2 text-3xl font-semibold text-slate-700">{orders.filter(o => o.status === 'pending').length}</p>
          </div>
          <div className="rounded-2xl bg-[#f6f4ee] p-5">
            <p className="text-sm font-medium text-[#5b8c7a]">Đang giao</p>
            <p className="mt-2 text-3xl font-semibold text-amber-600">{orders.filter(o => o.status === 'shipped').length}</p>
          </div>
          <div className="rounded-2xl bg-[#f6f4ee] p-5">
            <p className="text-sm font-medium text-[#5b8c7a]">Thành công</p>
            <p className="mt-2 text-3xl font-semibold text-teal-600">{orders.filter(o => o.status === 'delivered').length}</p>
          </div>
        </div>
      </div>

      <div className="rounded-[32px] border border-[#dce6df] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5b8c7a]">Danh sách đơn hàng</p>
            <p className="mt-2 text-sm text-[#475569]">Quản lý, theo dõi và cập nhật trạng thái đơn hàng.</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#dce6df] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#475569]">
              <thead className="bg-[#0d9488] text-xs uppercase text-white shadow-sm">
                <tr>
                  <th className="px-4 py-4 font-semibold text-center w-16">STT</th>
                  <th className="px-4 py-4 font-semibold min-w-[140px]">Mã đơn hàng</th>
                  <th className="px-4 py-4 font-semibold min-w-[180px]">Khách hàng</th>
                  <th className="px-4 py-4 font-semibold">Ngày đặt</th>
                  <th className="px-4 py-4 font-semibold text-right">Tổng tiền</th>
                  <th className="px-4 py-4 font-semibold text-center">Trạng thái</th>
                  <th className="px-4 py-4 font-semibold text-center w-40">Cập nhật</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dce6df] bg-white">
                {orders.map((order, index) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4 text-center font-medium text-[#0f172a]">{index + 1}</td>
                    <td className="px-4 py-4 font-bold text-[#0d9488]">{order.orderNumber}</td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-[#0f172a]">{order.shipping.name}</p>
                      <p className="text-xs text-[#5b8c7a] mt-0.5">{order.shipping.phone}</p>
                    </td>
                    <td className="px-4 py-4 text-xs font-medium text-[#475569]">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                    </td>
                    <td className="px-4 py-4 text-right font-semibold text-[#0f172a]">
                      {order.subtotal.toLocaleString('vi-VN')} đ
                    </td>
                    <td className="px-4 py-4 text-center">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className="w-full text-xs rounded-xl border border-[#dce6df] bg-[#f6f4ee] px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#0d9488]"
                      >
                        <option value="pending">Chờ xử lý</option>
                        <option value="processing">Đang chuẩn bị</option>
                        <option value="shipped">Đang giao</option>
                        <option value="delivered">Đã giao</option>
                        <option value="cancelled">Hủy đơn</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
