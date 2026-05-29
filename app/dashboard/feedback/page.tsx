import { CalendarDays, ShieldAlert, Star, Trash2 } from "lucide-react";
import { getProductFeedbacks } from "@/lib/database-service.server";
import { requireAdmin } from "@/lib/auth/roles";
import { deleteFeedbackAction } from "./actions";
import { Button } from "@/components/ui/button";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function DashboardFeedbackPage() {
  await requireAdmin();
  const feedbacks = await getProductFeedbacks();

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Quản trị Feedback
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Đánh giá khách hàng
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              Duyệt qua tất cả các bình luận, phản hồi và điểm số đánh giá từ phía người dùng đối với danh mục sản phẩm.
            </p>
          </div>
          <div className="flex h-12 items-center gap-2 rounded-2xl bg-slate-900 px-4 text-sm font-semibold text-white">
            <ShieldAlert className="h-4 w-4 text-cyan-300" />
            Admin only
          </div>
        </div>
      </section>

      {/* Feedbacks Grid */}
      <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm shadow-slate-950/5">
        <div className="border-b border-slate-100 px-6 py-5">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
            Danh sách đánh giá ({feedbacks.length})
          </p>
        </div>

        {feedbacks.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500">
            Chưa có đánh giá nào được ghi nhận.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {feedbacks.map((fb) => (
              <div key={fb.id} className="p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-6 hover:bg-slate-50/30 transition">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-900 text-base">{fb.userName}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDate(fb.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Stars */}
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < fb.rating ? "fill-amber-400" : "text-slate-200"}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-slate-400">Sản phẩm:</span>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                      {fb.productName}
                    </span>
                  </div>

                  <p className="text-sm leading-6 text-slate-700 italic bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    &quot;{fb.comment}&quot;
                  </p>
                </div>

                <div className="self-end sm:self-start">
                  <form action={deleteFeedbackAction}>
                    <input type="hidden" name="feedbackId" value={fb.id} />
                    <Button
                      type="submit"
                      variant="ghost"
                      className="rounded-2xl text-rose-600 hover:bg-rose-50 hover:text-rose-700 h-11 w-11 p-0 flex items-center justify-center border border-rose-100"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
