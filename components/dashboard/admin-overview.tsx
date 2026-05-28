import Link from "next/link";
import { getProducts, getProductFeedbacks, loadAllConsultations, loadAllOrdersServer } from "@/lib/database-service.server";
import { formatMockPrice } from "@/lib/mock-data/catalog";
import { CalendarDays, CheckCircle2, Clock3, MessageSquare, Receipt, Sparkles, AlertTriangle, UsersRound, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export async function AdminDashboardOverview() {
  const [products, orders, feedbacks, consultations] = await Promise.all([
    getProducts(),
    loadAllOrdersServer(),
    getProductFeedbacks(),
    loadAllConsultations()
  ]);

  // Compute metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.subtotal, 0);
  const totalOrders = orders.length;
  const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const lowStockProducts = products.filter(p => p.stockStatus === "low_stock").length;
  const totalCustomers = new Set(orders.map(o => o.shipping.email)).size;

  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const processingOrders = orders.filter(o => o.status === "processing").length;
  const completedOrders = orders.filter(o => o.status === "completed").length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <section className="overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.12),_transparent_32%),linear-gradient(135deg,_#ffffff_0%,_#f8fafc_100%)] px-6 py-8 shadow-sm shadow-slate-950/5 ring-1 ring-slate-200/80">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-600 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" /> Hệ thống Quản trị AuraCare
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Tổng quan Vận hành & Doanh thu
          </h1>
          <p className="text-sm leading-7 text-slate-600 sm:text-base">
            Báo cáo tổng hợp số liệu kinh doanh thực tế từ đơn hàng, phản hồi từ khách hàng và các hoạt động tư vấn của AI.
          </p>
        </div>
      </section>

      {/* Metrics Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          {
            label: "Tổng doanh thu",
            value: formatMockPrice(totalRevenue),
            desc: "Tổng giá trị đơn hàng",
            color: "bg-indigo-50 text-indigo-700",
            icon: Receipt
          },
          {
            label: "Giá trị trung bình (AOV)",
            value: formatMockPrice(aov),
            desc: "Doanh thu trên mỗi đơn",
            color: "bg-emerald-50 text-emerald-700",
            icon: Sparkles
          },
          {
            label: "Tổng đơn hàng",
            value: totalOrders,
            desc: `${pendingOrders} chờ xác nhận, ${processingOrders} đang xử lý`,
            color: "bg-sky-50 text-sky-700",
            icon: Receipt
          },
          {
            label: "Khách hàng mua",
            value: totalCustomers,
            desc: "Khách hàng duy nhất",
            color: "bg-violet-50 text-violet-700",
            icon: UsersRound
          },
          {
            label: "Sản phẩm sắp hết",
            value: lowStockProducts,
            desc: "Cần bổ sung kho",
            color: lowStockProducts > 0 ? "bg-amber-50 text-amber-700" : "bg-slate-50 text-slate-600",
            icon: AlertTriangle
          }
        ].map((item) => (
          <Card key={item.label} className="rounded-[28px] border-slate-200/80 bg-white shadow-sm shadow-slate-950/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {item.label}
                </span>
                <div className={`rounded-xl p-2.5 ${item.color}`}>
                  <item.icon className="h-4 w-4" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tracking-tight text-slate-950">{item.value}</p>
              <p className="mt-1 text-xs text-slate-500">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Main Grid: Orders & Feedback */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card className="rounded-[32px] border-slate-200/80 bg-white shadow-sm shadow-slate-950/5">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <CardTitle className="text-lg font-bold text-slate-950">Đơn hàng gần đây</CardTitle>
              <p className="text-xs text-slate-500 mt-1">5 giao dịch mới nhất được thực hiện</p>
            </div>
            <Link href="/dashboard/orders" className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1">
              Xem tất cả <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {orders.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500">Chưa có đơn hàng nào.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-3">Mã đơn</th>
                      <th className="px-6 py-3">Khách hàng</th>
                      <th className="px-6 py-3">Trạng thái</th>
                      <th className="px-6 py-3 text-right">Tổng cộng</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="align-middle hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-semibold text-slate-950">
                          {order.orderNumber}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-800">{order.shipping.name}</p>
                          <p className="text-xs text-slate-400">{order.shipping.phone}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            order.status === "completed" ? "bg-emerald-50 text-emerald-700" :
                            order.status === "processing" ? "bg-sky-50 text-sky-700" : "bg-amber-50 text-amber-700"
                          }`}>
                            {order.status === "completed" ? "Hoàn tất" :
                             order.status === "processing" ? "Đang xử lý" : "Chờ xác nhận"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-slate-950">
                          {formatMockPrice(order.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Feedback */}
        <Card className="rounded-[32px] border-slate-200/80 bg-white shadow-sm shadow-slate-950/5">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <CardTitle className="text-lg font-bold text-slate-950">Đánh giá mới nhất</CardTitle>
              <p className="text-xs text-slate-500 mt-1">Khách hàng nhận xét về sản phẩm</p>
            </div>
            <Link href="/dashboard/feedback" className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1">
              Xem tất cả <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="px-6 py-4 space-y-4">
            {feedbacks.length === 0 ? (
              <div className="text-center text-sm text-slate-500 py-6">Chưa có đánh giá nào.</div>
            ) : (
              feedbacks.slice(0, 3).map((fb) => (
                <div key={fb.id} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{fb.userName}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Sản phẩm: {fb.productName}</p>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-400 text-sm">
                      {"★".repeat(fb.rating)}
                      {"☆".repeat(5 - fb.rating)}
                    </div>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-600 italic">
                    "{fb.comment}"
                  </p>
                  <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" />
                    {new Date(fb.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      {/* AI Consultations Overview */}
      <section>
        <Card className="rounded-[32px] border-slate-200/80 bg-white shadow-sm shadow-slate-950/5">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <CardTitle className="text-lg font-bold text-slate-950">Phiên tư vấn AI gần đây</CardTitle>
              <p className="text-xs text-slate-500 mt-1">Thông tin chuẩn đoán và tư vấn hỗ trợ từ chatbot</p>
            </div>
            <Link href="/dashboard/consultations" className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1">
              Xem tất cả <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="px-6 py-5">
            {consultations.length === 0 ? (
              <div className="text-center text-sm text-slate-500 py-6">Chưa có phiên tư vấn nào.</div>
            ) : (
              <div className="grid gap-4 md:grid-cols-3">
                {consultations.slice(0, 3).map((c) => (
                  <div key={c.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm shadow-slate-950/[0.02] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
                          <Sparkles className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-950 truncate">{c.userFullName}</p>
                          <p className="text-[10px] text-slate-400 truncate">{c.userEmail}</p>
                        </div>
                      </div>
                      <div className="mt-3 space-y-1">
                        <p className="text-xs font-semibold text-slate-500">Mối bận tâm:</p>
                        <p className="text-xs font-medium text-slate-800 line-clamp-1">{c.skinConcern}</p>
                      </div>
                      <div className="mt-2 space-y-1">
                        <p className="text-xs font-semibold text-slate-500">Mô tả của khách:</p>
                        <p className="text-xs text-slate-600 line-clamp-2 italic">"{c.description}"</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {new Date(c.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                      <span className="text-indigo-600 font-semibold">Chi tiết AI khuyên dùng</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
