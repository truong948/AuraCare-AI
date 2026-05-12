import { redirect } from "next/navigation";
import { createServerComponentSupabaseClient } from "@/lib/supabase-server";
import { DiaryUploader } from "@/components/diary/diary-uploader";
import { DiaryGrid } from "@/components/diary/diary-grid";
import { ImageComparison } from "@/components/image-comparison";
import type { DiaryEntry } from "@/types/diary";

export default async function DiaryPage() {
  const supabase = createServerComponentSupabaseClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth");
  }

  const { data: entries, error } = await supabase
    .from("skin_diaries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const diaryEntries = (entries as unknown) as DiaryEntry[];
  const latestEntry = diaryEntries[0];
  const previousEntry = diaryEntries[1];

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 dark:bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <DiaryUploader />
            {diaryEntries.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-700 shadow-card dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                Chưa có mục nhật ký nào. Hãy upload ảnh đầu tiên để bắt đầu theo dõi tiến trình da của bạn.
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-card dark:border-slate-800 dark:bg-slate-900">
                <h2 className="text-2xl font-semibold text-slate-950 dark:text-slate-50">Latest capture</h2>
                <p className="mt-2 text-slate-600 dark:text-slate-300">Ảnh gần nhất sẽ giúp AuraCare ghi lại tiến trình da của bạn.</p>
                <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800">
                  <img src={latestEntry.image_url} alt={latestEntry.notes} className="h-[420px] w-full object-cover" />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-card dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-2xl font-semibold text-slate-950 dark:text-slate-50">So sánh ảnh</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">Kéo thanh để xem trước/sau giữa hai lần chụp gần nhất.</p>
              {latestEntry && previousEntry ? (
                <div className="mt-6">
                  <ImageComparison beforeImage={previousEntry.image_url} afterImage={latestEntry.image_url} beforeLabel="Lần trước" afterLabel="Lần này" />
                </div>
              ) : (
                <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
                  Cần ít nhất 2 lần upload để hiển thị so sánh ảnh.
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-card dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-2xl font-semibold text-slate-950 dark:text-slate-50">Hướng dẫn</h2>
              <ul className="mt-4 space-y-3 text-slate-600 dark:text-slate-300">
                <li>1. Upload ảnh da mặt trong điều kiện ánh sáng tự nhiên.</li>
                <li>2. Ghi chú ngắn về sản phẩm hoặc cảm nhận da.</li>
                <li>3. Sử dụng so sánh ảnh để theo dõi tiến trình qua thời gian.</li>
              </ul>
            </div>
          </div>
        </div>

        <section>
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Nhật ký da</p>
              <h1 className="text-3xl font-semibold text-slate-950 dark:text-slate-50">Bảng ghi ảnh</h1>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">{diaryEntries.length} mục đã lưu</p>
          </div>

          <DiaryGrid entries={diaryEntries} />
        </section>
      </div>
    </main>
  );
}
