"use client";

import { useEffect, useState, useTransition } from "react";
import { Star, MessageSquare, Send, Calendar, AlertCircle } from "lucide-react";
import { getProductFeedbacks, submitProductFeedback } from "@/lib/database-service";
import type { ProductFeedback } from "@/lib/mock-data/feedbacks";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";

interface ProductFeedbackSectionProps {
  productId: string;
  productSlug: string;
}

export function ProductFeedbackSection({ productId, productSlug }: ProductFeedbackSectionProps) {
  const [feedbacks, setFeedbacks] = useState<ProductFeedback[]>([]);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  // Load reviews and user session
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getProductFeedbacks(productSlug);
        setFeedbacks(data);

        const supabase = createClient();
        const { data: { user: sessionUser } } = await supabase.auth.getUser();
        setUser(sessionUser);
      } catch (err) {
        console.error("Failed to load feedbacks/session data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [productId, productSlug]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!comment.trim()) {
      setErrorMsg("Vui lòng nhập nội dung đánh giá.");
      return;
    }

    startTransition(async () => {
      const res = await submitProductFeedback(productId, rating, comment);
      if (res.success) {
        setSuccessMsg("Cảm ơn bạn đã gửi đánh giá sản phẩm!");
        setComment("");
        setRating(5);
        // Refresh reviews list
        const updatedFeedbacks = await getProductFeedbacks(productSlug);
        setFeedbacks(updatedFeedbacks);
      } else {
        setErrorMsg(res.error || "Gửi đánh giá thất bại. Vui lòng thử lại.");
      }
    });
  };

  // Calculate statistics
  const count = feedbacks.length;
  const averageRating = count > 0 
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / count).toFixed(1)
    : "0.0";

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const starCount = feedbacks.filter((f) => f.rating === stars).length;
    const percentage = count > 0 ? Math.round((starCount / count) * 100) : 0;
    return { stars, percentage, count: starCount };
  });

  return (
    <section className="rounded-[36px] border border-[#dce6df] bg-[#ffffff] p-6 shadow-[0_16px_34px_rgba(15,23,42,0.04)] sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf4f1] text-[#5b8c7a]">
          <MessageSquare className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#0f172a]">Khách hàng đánh giá</h2>
          <p className="text-xs text-slate-500">Phản hồi thực tế từ cộng đồng chăm sóc da AuraCare</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_1.9fr] lg:items-start">
        {/* Left Side: Rating Summary */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-[#f8fbfa] p-6 border border-[#e8f2ee] text-center lg:text-left">
            <div className="flex flex-col lg:flex-row items-center gap-4 justify-center lg:justify-start">
              <span className="text-5xl font-black text-[#0f172a]">{averageRating}</span>
              <div>
                <div className="flex items-center gap-0.5 text-amber-400 justify-center lg:justify-start">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.round(Number(averageRating)) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-1">Dựa trên {count} đánh giá khách hàng</p>
              </div>
            </div>

            {/* Distribution chart */}
            <div className="mt-6 space-y-2.5">
              {ratingDistribution.map((dist) => (
                <div key={dist.stars} className="flex items-center gap-3 text-xs">
                  <span className="w-10 text-right font-medium text-slate-500">{dist.stars} sao</span>
                  <div className="h-2 flex-1 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#5b8c7a] transition-all duration-300"
                      style={{ width: `${dist.percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-slate-400 text-right">{dist.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review form */}
          <div className="rounded-3xl border border-slate-100 bg-[#fbfbfd] p-6">
            <h3 className="font-bold text-[#0f172a] text-base mb-4">Viết đánh giá của bạn</h3>
            {loading ? (
              <p className="text-xs text-slate-400">Đang tải biểu mẫu...</p>
            ) : user ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Star Picker */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                    Chọn số sao đánh giá:
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((stars) => (
                      <button
                        key={stars}
                        type="button"
                        className="p-0.5 text-amber-400 focus:outline-none transition transform active:scale-95"
                        onClick={() => setRating(stars)}
                        onMouseEnter={() => setHoverRating(stars)}
                        onMouseLeave={() => setHoverRating(0)}
                      >
                        <Star
                          className={`h-7 w-7 ${
                            (hoverRating || rating) >= stars
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-200"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment Area */}
                <div>
                  <label htmlFor="comment" className="block text-xs font-semibold text-slate-500 mb-1.5">
                    Nhận xét sản phẩm:
                  </label>
                  <textarea
                    id="comment"
                    rows={3}
                    placeholder="Sản phẩm này có điểm gì tốt? Có dễ sử dụng và hiệu quả ra sao..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={isPending}
                    className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-[#5b8c7a] transition resize-none"
                  />
                </div>

                {errorMsg && (
                  <p className="text-xs text-rose-500 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" /> {errorMsg}
                  </p>
                )}

                {successMsg && (
                  <p className="text-xs text-emerald-600 flex items-center gap-1 font-semibold">
                    {successMsg}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full h-11 rounded-xl bg-[#5b8c7a] hover:bg-[#4f7c6d] text-white font-semibold text-xs transition active:scale-[0.98] flex items-center justify-center gap-1.5"
                >
                  {isPending ? "Đang gửi..." : <><Send className="h-3.5 w-3.5" /> Gửi đánh giá</>}
                </Button>
              </form>
            ) : (
              <div className="text-center py-4 space-y-3">
                <p className="text-xs text-slate-500 leading-5">
                  Bạn cần đăng nhập để gửi phản hồi đánh giá sản phẩm.
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-xl border-[#d7e5df] text-[#5b8c7a] hover:bg-[#f8fbfa] text-xs font-semibold px-4 py-2"
                >
                  <a href="/login">Đăng nhập để đánh giá</a>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Reviews List */}
        <div className="space-y-4 max-h-[620px] overflow-y-auto pr-1">
          {feedbacks.length === 0 ? (
            <div className="text-center text-sm text-slate-400 py-12">
              Sản phẩm chưa có bình luận nào. Hãy là người đầu tiên để lại đánh giá!
            </div>
          ) : (
            feedbacks.map((fb) => (
              <div key={fb.id} className="rounded-2xl border border-slate-100 bg-slate-50/20 p-5 space-y-3 hover:border-slate-200/60 transition">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{fb.userName}</span>
                    <span className="rounded-full bg-[#edf4f1] px-2 py-0.5 text-[10px] font-semibold text-[#4f7c6d]">
                      Đã mua hàng
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(fb.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>

                <div className="flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${i < fb.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                    />
                  ))}
                </div>

                <p className="text-xs leading-6 text-slate-700 font-medium">
                  {fb.comment}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
