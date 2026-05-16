"use client";

import { useState } from "react";
import Link from "next/link";
import { Bot, LoaderCircle, MessageSquareQuote, Sparkles } from "lucide-react";
import type { ChatResponsePayload } from "@/lib/ai/types";

const starterPrompts = [
  "Sản phẩm này phù hợp với ai?",
  "Giải thích thành phần chính giúp tôi",
  "Cách dùng sản phẩm này như thế nào?",
] as const;

export function ProductAiAssistant({
  productSlug,
  productName,
}: {
  productSlug: string;
  productName: string;
}) {
  const [message, setMessage] = useState<string>(starterPrompts[0]);
  const [data, setData] = useState<ChatResponsePayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function askAssistant(nextMessage: string) {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: nextMessage,
          productSlug,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Không thể lấy phản hồi từ AuraCare AI.");
      }

      setData(payload);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Không thể lấy phản hồi từ AuraCare AI.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!message.trim()) return;
    await askAssistant(message);
  }

  return (
    <div className="rounded-[30px] border border-[#dce6df] bg-[#ffffff] p-6 shadow-[0_16px_34px_rgba(15,23,42,0.04)]">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#edf4f1] text-[#5b8c7a]">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-[#0f172a]">Hỏi AuraCare AI về sản phẩm này</h2>
            <span className="rounded-full bg-[#f6f1e7] px-3 py-1 text-xs font-semibold text-[#9a6a1d]">
              FAQ / Product Q&A
            </span>
          </div>
          <p className="mt-2 text-sm leading-7 text-[#475569]">
            Dùng widget này để hỏi nhanh về thành phần, cách dùng hoặc mức độ phù hợp của {productName}.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {starterPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => {
              setMessage(prompt);
              void askAssistant(prompt);
            }}
            className="rounded-full bg-[#edf4f1] px-4 py-2 text-xs font-semibold text-[#4f7c6d]"
          >
            {prompt}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={3}
          className="w-full rounded-[22px] border border-[#d7e5df] bg-[#fbfcfa] px-4 py-3 text-sm text-[#334155] outline-none transition focus:border-[#5b8c7a]"
          placeholder="Ví dụ: sản phẩm này phù hợp cho da nhạy cảm không?"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#5b8c7a] px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Gửi câu hỏi"}
        </button>
      </form>

      {error ? <p className="mt-4 text-sm font-medium text-[#c2410c]">{error}</p> : null}

      {data ? (
        <div className="mt-5 space-y-4">
          <div className="rounded-[24px] bg-[#f8fbfa] p-4">
            <div className="flex items-center gap-2">
              <MessageSquareQuote className="h-4 w-4 text-[#5b8c7a]" />
              <span className="text-sm font-semibold text-[#0f172a]">
                {data.source === "gemini" ? "AuraCare AI đang dùng Gemini" : "AuraCare AI đang dùng fallback local"}
              </span>
            </div>
            <p className="mt-3 text-sm leading-7 text-[#475569]">{data.answer}</p>
          </div>

          {data.suggestions.length > 0 ? (
            <div className="rounded-[24px] border border-[#dce6df] p-4">
              <p className="text-sm font-semibold text-[#0f172a]">Sản phẩm nên xem thêm</p>
              <div className="mt-3 space-y-3">
                {data.suggestions.slice(0, 3).map((item) => (
                  <div key={item.product.id} className="rounded-[18px] bg-[#f8fbfa] p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[#0f172a]">{item.product.name}</p>
                        <p className="mt-1 text-sm text-[#475569]">{item.reason}</p>
                      </div>
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="inline-flex shrink-0 rounded-full bg-[#0f172a] px-3 py-2 text-xs font-semibold text-white"
                      >
                        Mở PDP
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex items-start gap-2 rounded-[22px] border border-[#f1e3c5] bg-[#fff9ee] px-4 py-3 text-sm text-[#7b5a23]">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
            {data.disclaimer}
          </div>

          <div className="rounded-[22px] border border-[#dce6df] bg-[#ffffff] px-4 py-4 text-sm text-[#475569]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#94a3b8]">Tóm tắt để handoff</p>
            <p className="mt-2 leading-7">{data.handoffSummary}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
