"use client";

import { useMemo } from "react";
import { mockOrders } from "@/lib/mock-data/orders";
import { Banknote, TrendingUp, ShoppingBag, CreditCard } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from "recharts";

export default function RevenuePage() {
  const chartData = useMemo(() => {
    // We only want completed/delivered orders for revenue
    const validOrders = mockOrders.filter(o => o.status === "delivered" || o.status === "shipped");
    
    // Group by date
    const daily: Record<string, { date: string; revenue: number; orders: number }> = {};
    
    // Initialize last 14 days with 0
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      daily[dateStr] = { date: dateStr, revenue: 0, orders: 0 };
    }

    validOrders.forEach(order => {
      const dateStr = new Date(order.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      if (daily[dateStr]) {
        daily[dateStr].revenue += order.subtotal;
        daily[dateStr].orders += 1;
      }
    });

    return Object.values(daily);
  }, []);

  const totalRevenue = chartData.reduce((sum, day) => sum + day.revenue, 0);
  const totalOrders = chartData.reduce((sum, day) => sum + day.orders, 0);
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Formatting for charts
  const formatVND = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)} Tr`;
    return `${(value / 1000).toFixed(0)} K`;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-[32px] border border-[#dce6df] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#5b8c7a]">Financial Overview</p>
            <h1 className="mt-2 text-3xl font-semibold text-[#0f172a]">Báo cáo doanh thu</h1>
          </div>
          <div className="rounded-full bg-teal-50 px-4 py-2 text-sm font-semibold text-[#0d9488]">
            14 ngày gần nhất
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mt-4">
          <div className="group rounded-3xl border border-[#dce6df] bg-gradient-to-br from-teal-50 to-white p-6 transition-all hover:border-[#0d9488] hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0d9488] text-white">
                <Banknote className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#5b8c7a]">Tổng doanh thu</p>
                <p className="mt-1 text-2xl font-bold text-[#0f172a]">{totalRevenue.toLocaleString('vi-VN')} đ</p>
              </div>
            </div>
          </div>
          
          <div className="group rounded-3xl border border-[#dce6df] bg-gradient-to-br from-teal-50 to-white p-6 transition-all hover:border-[#0d9488] hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0d9488] text-white">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#5b8c7a]">Số đơn thành công</p>
                <p className="mt-1 text-2xl font-bold text-[#0f172a]">{totalOrders} đơn</p>
              </div>
            </div>
          </div>

          <div className="group rounded-3xl border border-[#dce6df] bg-gradient-to-br from-teal-50 to-white p-6 transition-all hover:border-[#0d9488] hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0d9488] text-white">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#5b8c7a]">Trung bình mỗi đơn</p>
                <p className="mt-1 text-2xl font-bold text-[#0f172a]">{avgOrderValue.toLocaleString('vi-VN')} đ</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-[32px] border border-[#dce6df] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#0d9488]" />
              <h3 className="text-lg font-bold text-[#0f172a]">Biểu đồ doanh thu</h3>
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis tickFormatter={formatVND} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="revenue" name="Doanh thu" fill="#0d9488" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[32px] border border-[#dce6df] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-[#0f172a]">Lượng đơn hàng</h3>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="orders" name="Số lượng đơn" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-[#dce6df] rounded-2xl shadow-md">
        <p className="font-bold text-[#0f172a] mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex flex-col gap-1">
            <span className="text-sm text-[#5b8c7a]">{entry.name}</span>
            <span className="font-semibold" style={{ color: entry.color }}>
              {entry.name === 'Doanh thu' 
                ? `${entry.value.toLocaleString('vi-VN')} đ` 
                : `${entry.value} đơn`}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};
