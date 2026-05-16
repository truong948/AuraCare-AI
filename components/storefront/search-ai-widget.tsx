"use client";

import { useState } from "react";
import Link from "next/link";
import { Bot, LoaderCircle, SearchCheck, Sparkles } from "lucide-react";
import type { SearchResponsePayload } from "@/lib/ai/types";
import { getCategoryLabel } from "@/lib/mock-data/catalog";

export function SearchAiWidget({
  initialQuery,
  category,
}: {
  initialQuery: string;
  category?: "supplement" | "skincare";
}) {
  const [query, setQuery] = useState(initialQuery);
  const [data, setData] = useState<SearchResponsePayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, category, limit: 4 }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Không thể chạy tìm kiếm AI.");
      }

      setData(payload);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Không thể chạy tìm kiếm AI.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[28px] border border-[#dce6df] bg-[#ffffff] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#edf4f1] text-[#5b8c7a]">
          <SearchCheck className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-[#0f172a]">Trợ lý semantic search</h2>
            <span className="rounded-full bg-[#f6f1e7] px-3 py-1 text-xs font-semibold text-[#9a6a1d]">
              Phase 4 AI MVP
            </span>
          </div>
          <p className="mt-2 text-sm leading-7 text-[#475569]">
            Gọi thử API tìm kiếm AI để xem hệ thống giải thích vì sao nó match sản phẩm với truy vấn của bạn.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ví dụ: da nhạy cảm thiếu ẩm ít hương liệu"
          className="h-12 flex-1 rounded-2xl border border-[#d7e5df] bg-[#fbfcfa] px-4 text-sm text-[#334155] outline-none transition focus:border-[#5b8c7a]"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#5b8c7a] px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Phân tích truy vấn"}
        </button>
      </form>

      {error ? <p className="mt-4 text-sm font-medium text-[#c2410c]">{error}</p> : null}

      {data ? (
        <div className="mt-5 space-y-4">
          <div className="rounded-[24px] bg-[#f8fbfa] p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#edf4f1] px-3 py-1 text-xs font-semibold text-[#5b8c7a]">
                {data.source === "gemini-pgvector" ? "Gemini + pgvector" : "Fallback hybrid local"}
              </span>
              {category ? (
                <span className="rounded-full bg-[#f6f1e7] px-3 py-1 text-xs font-semibold text-[#9a6a1d]">
                  {getCategoryLabel(category)}
                </span>
              ) : null}
            </div>
            <p className="mt-3 text-sm leading-7 text-[#475569]">{data.explanation}</p>
          </div>

          <div className="grid gap-3">
            {data.results.slice(0, 3).map((item) => (
              <div key={item.product.id} className="rounded-[24px] border border-[#dce6df] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-[#5b8c7a]" />
                      <p className="text-sm font-semibold text-[#0f172a]">{item.product.name}</p>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-[#475569]">{item.reason}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                      <span className="rounded-full bg-[#edf4f1] px-3 py-1 text-[#4f7c6d]">
                        Score {item.score.toFixed(2)}
                      </span>
                      <span className="rounded-full bg-[#f8fbfa] px-3 py-1 text-[#64748b]">
                        Semantic {item.semanticScore.toFixed(2)}
                      </span>
                      <span className="rounded-full bg-[#f8fbfa] px-3 py-1 text-[#64748b]">
                        Keyword {item.keywordScore.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="inline-flex items-center rounded-full bg-[#0f172a] px-4 py-2 text-sm font-semibold text-white"
                  >
                    Xem PDP
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-2 rounded-[22px] border border-[#f1e3c5] bg-[#fff9ee] px-4 py-3 text-sm text-[#7b5a23]">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
            Kết quả này là lớp hiển thị của semantic search phase 4. Khi môi trường có khóa thật, widget sẽ dùng
            Gemini embeddings và pgvector thay vì fallback local.
          </div>
        </div>
      ) : null}
    </div>
  );
}
