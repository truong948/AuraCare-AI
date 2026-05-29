"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { Bot, ChevronDown, LoaderCircle, Send, Sparkles, X } from "lucide-react";
import type { ChatResponsePayload } from "@/lib/ai/types";

const quickPrompts = [
  "Tư vấn cho da nhạy cảm thiếu ẩm",
  "Gợi ý sản phẩm cho da dầu mụn",
  "Tôi muốn hỏi về thành phần và cách dùng",
] as const;

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

function createMessageId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

export function HomeAiChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState<string>(quickPrompts[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Xin chào. Mình là AuraCare AI. Bạn có thể hỏi về sản phẩm, thành phần, cách dùng hoặc nhu cầu chăm sóc da.",
    },
  ]);
  const [payload, setPayload] = useState<ChatResponsePayload | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, open, payload]);

  async function askAssistant(message: string) {
    const trimmed = message.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError("");
    setOpen(true);
    setMessages((current) => [...current, { id: createMessageId(), role: "user", content: trimmed }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = (await response.json()) as ChatResponsePayload & { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Không thể lấy phản hồi từ AuraCare AI.");
      }

      setPayload(data);
      setMessages((current) => [
        ...current,
        { id: createMessageId(), role: "assistant", content: data.answer },
      ]);
      setInput("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Không thể lấy phản hồi từ AuraCare AI.");
      setMessages((current) => [
        ...current,
        {
          id: createMessageId(),
          role: "assistant",
          content: "Mình chưa trả lời được lúc này. Bạn thử lại hoặc đặt câu hỏi ngắn hơn nhé.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void askAssistant(input);
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
      {open ? (
        <div className="mb-3 flex h-[min(34rem,calc(100vh-7rem))] w-[calc(100vw-2rem)] max-w-[22rem] flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.16)] sm:w-[22rem]">
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0b57c5] text-white shadow-lg shadow-blue-500/10">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0f172a]">AuraCare AI</p>
                <p className="text-xs text-[#64748b]">Tư vấn nhanh trên trang chủ</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#64748b] transition hover:bg-slate-100 hover:text-[#0f172a]"
              aria-label="Đóng chatbot"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/70 px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "bg-[#0b57c5] text-white"
                      : "border border-slate-200 bg-white text-[#334155]"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {payload?.suggestions?.length ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">
                  Gợi ý tiếp theo
                </p>
                <div className="mt-3 grid gap-2">
                  {payload.suggestions.slice(0, 2).map((item) => (
                    <Link
                      key={item.product.id}
                      href={`/products/${item.product.slug}`}
                      className="rounded-xl bg-slate-50 px-3 py-2 text-sm font-medium text-[#0f172a] transition hover:bg-blue-50 hover:text-[#0b57c5]"
                    >
                      {item.product.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            {payload?.disclaimer ? (
              <p className="text-xs leading-5 text-[#94a3b8]">{payload.disclaimer}</p>
            ) : null}

            <div ref={bottomRef} />
          </div>

          <div className="border-t border-slate-100 bg-white px-4 py-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => void askAssistant(prompt)}
                  className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-[#475569] transition hover:bg-blue-50 hover:text-[#0b57c5]"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                rows={2}
                placeholder="Nhập câu hỏi..."
                className="min-h-[3rem] flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-[#0f172a] outline-none transition focus:border-[#0b57c5] focus:bg-white"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0b57c5] text-white transition hover:bg-[#0b57c5]/90 disabled:cursor-not-allowed disabled:opacity-70"
                aria-label="Gửi câu hỏi"
              >
                {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </form>

            {error ? <p className="mt-3 text-xs font-medium text-[#c2410c]">{error}</p> : null}
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-[#0f172a] shadow-[0_12px_28px_rgba(15,23,42,0.12)] transition hover:border-blue-200 hover:text-[#0b57c5]"
        aria-label={open ? "Thu gọn chatbot" : "Mở chatbot tư vấn"}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0b57c5] text-white">
          <Bot className="h-4 w-4" />
        </span>
        <span className="hidden sm:inline">Hỏi AI</span>
        <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
      </button>
    </div>
  );
}
