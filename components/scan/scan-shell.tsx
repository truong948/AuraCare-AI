"use client";

import { useState, useTransition, Suspense, use } from "react";
import { Button } from "@/components/ui/button";
import type { ScanApiResponse } from "@/types/scan";

const fetchScanResult = async (imageUrl: string) => {
  const response = await fetch("/api/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageUrl })
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Không thể liên kết tới API scan.");
  }

  return response.json() as Promise<ScanApiResponse>;
};

function ScanResult({ promise }: { promise: Promise<ScanApiResponse> }) {
  const result = use(promise);

  if (result.error) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-900 dark:border-rose-900/20 dark:bg-rose-950/20 dark:text-rose-200">
        <p className="font-semibold">Lỗi quét:</p>
        <p>{result.error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-slate-50">Kết quả chẩn đoán</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-900">
            <p className="text-sm uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Chẩn đoán</p>
            <p className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">{result.ai.diagnosis}</p>
          </div>
          <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-900">
            <p className="text-sm uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Mức độ</p>
            <p className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">{result.ai.severity}</p>
          </div>
        </div>
        <div className="mt-6 rounded-3xl bg-slate-950/5 p-5 dark:bg-slate-800">
          <p className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">Triệu chứng nhận diện</p>
          <p className="mt-2 text-slate-700 dark:text-slate-300">{result.ai.symptoms.join(", ") || "Không xác định"}</p>
        </div>
        <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-900">
          <p className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">Khuyến nghị</p>
          <p className="mt-2 text-slate-700 dark:text-slate-300 whitespace-pre-line">{result.ai.recommendations}</p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-slate-50">Sản phẩm gợi ý</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Các sản phẩm phù hợp với triệu chứng đã nhận diện.</p>

        {result.products.length ? (
          <div className="mt-5 grid gap-4">
            {result.products.map((product) => (
              <div key={product.id} className="rounded-3xl border border-slate-200 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-950 dark:text-slate-50">{product.name}</h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{product.description ?? "Không có mô tả"}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    Score {product.score?.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">Không có sản phẩm phù hợp tìm thấy.</p>
        )}
      </section>
    </div>
  );
}

export default function ScanShell() {
  const [imageUrl, setImageUrl] = useState("");
  const [scanPromise, setScanPromise] = useState<Promise<ScanApiResponse> | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Camera Scan</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-slate-50">Mô phỏng giao diện quét da</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Dán URL hình ảnh từ Supabase Storage và bắt đầu kiểm tra da bằng AI.</p>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950/5 p-6 shadow-inner dark:border-slate-800 dark:bg-slate-900/80">
            <div className="absolute inset-x-0 top-6 flex items-center justify-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
            </div>
            <div className="relative mt-10 h-[320px] overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-900/80 shadow-inner dark:border-slate-800">
              {imageUrl ? (
                <img src={imageUrl} alt="Preview da" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-center text-slate-500 dark:text-slate-400">
                  <div>
                    <p className="text-lg font-semibold">Chưa có ảnh</p>
                    <p className="mt-2 text-sm">Dán URL ảnh Supabase để xem trước.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (!imageUrl) return;
              startTransition(() => {
                setScanPromise(fetchScanResult(imageUrl));
              });
            }}
            className="grid gap-4"
          >
            <label className="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
              URL hình ảnh từ Supabase Storage
              <input
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="https://...supabase.co/storage/v1/object/public/..."
                className="h-12 rounded-3xl border border-slate-200 bg-slate-50 px-4 text-slate-950 outline-none transition-colors focus:border-slate-400 focus:ring-2 focus:ring-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:border-slate-600 dark:focus:ring-slate-700"
              />
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={!imageUrl || isPending}>
                {isPending ? "Đang quét..." : "Bắt đầu quét"}
              </Button>
              <p className="text-sm text-slate-500 dark:text-slate-400">Kết quả sẽ được hiển thị bằng React Suspense.</p>
            </div>
          </form>
        </div>
      </section>

      <section className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-950">
          <h2 className="text-xl font-semibold text-slate-950 dark:text-slate-50">Kết quả quét</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Bấm bắt đầu để AI phân tích hình ảnh và hiển thị danh sách sản phẩm phù hợp.</p>
        </div>

        <Suspense
          fallback={
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-500 shadow-card dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              Đang phân tích hình ảnh và tìm sản phẩm phù hợp...
            </div>
          }
        >
          {scanPromise ? (
            <ScanResult promise={scanPromise} />
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-500 shadow-card dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
              Chưa có kết quả. Nhập URL và bấm "Bắt đầu quét".
            </div>
          )}
        </Suspense>
      </section>
    </div>
  );
}
