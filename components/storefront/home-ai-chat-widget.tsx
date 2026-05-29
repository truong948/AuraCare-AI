"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bot, ChevronDown, Send, Sparkles, X, Activity } from "lucide-react";
import type { ChatResponsePayload } from "@/lib/ai/types";
import { formatMockPrice } from "@/lib/mock-data/catalog";

const quickPrompts = [
  "Da nhạy cảm thiếu ẩm",
  "Gợi ý sản phẩm trị mụn",
  "Dược phẩm trị mất ngủ",
  "Hỏi về thành phần thuốc",
] as const;

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestions?: ChatResponsePayload["suggestions"];
};

function createMessageId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

// Simple text formatter to handle bold and newlines
function FormattedText({ text }: { text: string }) {
  const parts = text.split(/(\*\*.*?\*\*|\n)/g);
  
  return (
    <>
      {parts.map((part, index) => {
        if (part === "\n") return <br key={index} />;
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

export function HomeAiChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Xin chào! Mình là Dược sĩ AI của AuraCare. Bạn đang quan tâm đến sản phẩm nào, hay có triệu chứng gì cần tư vấn?",
    },
  ]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, open, loading]);

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

      setMessages((current) => [
        ...current,
        { 
          id: createMessageId(), 
          role: "assistant", 
          content: data.answer,
          suggestions: data.suggestions
        },
      ]);
      setInput("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Không thể lấy phản hồi từ AuraCare AI.");
      setMessages((current) => [
        ...current,
        {
          id: createMessageId(),
          role: "assistant",
          content: "Hệ thống đang bận. Bạn thử lại hoặc đặt câu hỏi ngắn hơn nhé.",
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
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {open ? (
        <div className="mb-3 flex h-[min(42rem,calc(100vh-6rem))] w-[calc(100vw-2rem)] max-w-[26rem] flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-2xl sm:w-[26rem]">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 bg-[#0d9488] px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 shadow-inner">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-base font-bold">AuraCare AI</p>
                <p className="text-xs text-teal-100 flex items-center gap-1">
                  <Activity className="w-3 h-3" /> Tư vấn chuyên môn y tế
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition hover:bg-white/20 hover:text-white"
              aria-label="Đóng chatbot"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 px-4 py-5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className="flex flex-col gap-2 max-w-[85%]">
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                      message.role === "user"
                        ? "bg-[#0d9488] text-white rounded-br-sm"
                        : "border border-slate-200 bg-white text-[#334155] rounded-bl-sm"
                    }`}
                  >
                    <FormattedText text={message.content} />
                  </div>
                  
                  {/* Inline Product Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-2 space-y-2">
                      <p className="text-xs font-semibold text-[#64748b] ml-1">Sản phẩm gợi ý:</p>
                      <div className="flex flex-col gap-2">
                        {message.suggestions.slice(0, 3).map((item) => (
                          <Link
                            key={item.product.id}
                            href={`/products/${item.product.slug}`}
                            className="group flex gap-3 rounded-xl border border-slate-200 bg-white p-2 transition hover:border-[#0d9488] shadow-sm hover:shadow-md"
                          >
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                              <Image 
                                src={item.product.image || "/placeholder.png"} 
                                alt={item.product.name} 
                                fill 
                                className="object-cover" 
                              />
                            </div>
                            <div className="flex flex-col justify-center">
                              <p className="line-clamp-2 text-xs font-semibold text-[#0f172a] group-hover:text-[#0d9488]">
                                {item.product.name}
                              </p>
                              <p className="mt-1 text-xs font-bold text-[#e11d48]">
                                {formatMockPrice(item.product.price)}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-4 py-4 shadow-sm">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400"></div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-100 bg-white p-4">
            {/* Horizontal Scroll Quick Prompts */}
            <div className="mb-4 flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => void askAssistant(prompt)}
                  className="whitespace-nowrap rounded-full border border-[#d7e5df] bg-slate-50 px-4 py-2 text-xs font-medium text-[#475569] transition hover:bg-teal-50 hover:text-[#0d9488]"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if(input.trim()) handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
                  }
                }}
                rows={1}
                placeholder="Nhập triệu chứng hoặc nhu cầu..."
                className="max-h-[8rem] min-h-[3rem] flex-1 resize-none rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-[#0f172a] shadow-sm outline-none transition focus:border-[#0d9488] focus:ring-1 focus:ring-[#0d9488]"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0d9488] text-white shadow-sm transition hover:bg-[#0f766e] disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Gửi câu hỏi"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
            {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
          </div>
        </div>
      ) : null}

      {/* Floating Button */}
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="group flex h-14 items-center gap-3 rounded-full bg-[#0d9488] pl-2 pr-5 text-sm font-semibold text-white shadow-xl transition hover:bg-[#0f766e] hover:shadow-teal-500/20 hover:scale-105"
        aria-label={open ? "Thu gọn chatbot" : "Mở chatbot tư vấn"}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0d9488]">
          <Bot className="h-6 w-6" />
        </span>
        <span>Hỏi Dược Sĩ AI</span>
        <ChevronDown className={`h-4 w-4 transition duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
    </div>
  );
}
