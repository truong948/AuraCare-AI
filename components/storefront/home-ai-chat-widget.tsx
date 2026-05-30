"use client";

import { useEffect, useRef, useState, type FormEvent, type ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bot, ChevronDown, Send, Sparkles, X, Activity, ImagePlus, Trash2 } from "lucide-react";
import type { ChatResponsePayload } from "@/lib/ai/types";
import { formatMockPrice } from "@/lib/mock-data/catalog";
import { createClient } from "@/utils/supabase/client";

const quickPrompts = [
  "Da nhạy cảm thiếu ẩm",
  "Gợi ý sản phẩm trị mụn",
  "Vitamin tăng cường miễn dịch",
  "Sản phẩm chống lão hóa",
] as const;

/** Định dạng suggestion phẳng được lưu vào Supabase */
interface FlatSuggestion {
  name: string;
  slug: string;
  price: number;
  image: string;
  reason?: string;
}

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  image_url?: string;
  suggestions?: ChatResponsePayload["suggestions"] | FlatSuggestion[];
};

/** Chuẩn hóa suggestion về format nested để render nhất quán */
function normalizeSuggestion(item: any): { product: { id: string; name: string; slug: string; price: number; image: string }; reason?: string } {
  if (item && item.product) {
    return item as any;
  }
  // Format phẳng từ Supabase history
  return {
    product: {
      id: item?.slug ?? "",
      name: item?.name ?? "",
      slug: item?.slug ?? "",
      price: item?.price ?? 0,
      image: item?.image ?? "",
    },
    reason: item?.reason,
  };
}

function createMessageId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

// Simple text formatter to handle bold, newlines, and bullet points
function FormattedText({ text }: { text: string }) {
  const lines = text.split("\n");
  
  return (
    <>
      {lines.map((line, lineIdx) => {
        // Handle bullet points
        const isBullet = line.trimStart().startsWith("•") || line.trimStart().startsWith("-") || line.trimStart().startsWith("*");
        const content = isBullet ? line.trimStart().replace(/^[•\-\*]\s*/, "") : line;
        
        const parts = content.split(/(\*\*.*?\*\*)/g);
        const rendered = parts.map((part, partIdx) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={partIdx}>{part.slice(2, -2)}</strong>;
          }
          return <span key={partIdx}>{part}</span>;
        });

        if (isBullet) {
          return <div key={lineIdx} className="flex gap-2 mt-1"><span className="text-teal-500">•</span><span>{rendered}</span></div>;
        }
        if (line === "") {
          return <div key={lineIdx} className="h-2" />;
        }
        return <div key={lineIdx}>{rendered}</div>;
      })}
    </>
  );
}

export function HomeAiChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [pendingImagePreview, setPendingImagePreview] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Xin chào! Mình là **Dược sĩ AI** của AuraCare 💊\n\nBạn có thể:\n• Mô tả triệu chứng để mình gợi ý sản phẩm\n• Gửi ảnh da để mình phân tích\n• Hỏi về thành phần, cách dùng bất kỳ sản phẩm nào",
    },
  ]);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Check auth state and load chat history
  useEffect(() => {
    async function initAuth() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
        }
      } catch {
        // Not logged in — that's fine
      }
    }
    initAuth();
  }, []);

  // Load chat history from Supabase when user is logged in
  useEffect(() => {
    if (!userId || historyLoaded) return;
    
    async function loadHistory() {
      try {
        const supabase = createClient();
        const { data, error: fetchError } = await (supabase as any)
          .from("chat_messages")
          .select("id, role, content, image_url, suggestions, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: true })
          .limit(100);

        if (!fetchError && data && data.length > 0) {
          const loaded: ChatMessage[] = [
            {
              id: "welcome",
              role: "assistant",
              content:
                "Xin chào! Mình là **Dược sĩ AI** của AuraCare 💊\n\nBạn có thể:\n• Mô tả triệu chứng để mình gợi ý sản phẩm\n• Gửi ảnh da để mình phân tích\n• Hỏi về thành phần, cách dùng bất kỳ sản phẩm nào",
            },
            ...data.map((row: any) => ({
              id: row.id,
              role: row.role as "user" | "assistant",
              content: row.content,
              image_url: row.image_url || undefined,
              suggestions: row.suggestions || undefined,
            })),
          ];
          setMessages(loaded);
        }
      } catch {
        // Failed to load — use default
      }
      setHistoryLoaded(true);
    }
    loadHistory();
  }, [userId, historyLoaded]);

  useEffect(() => {
    if (!open) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, open, loading]);

  // Save a message to Supabase
  async function saveMessage(msg: ChatMessage) {
    if (!userId) return;
    try {
      const supabase = createClient();
      await (supabase as any).from("chat_messages").insert({
        id: msg.id,
        user_id: userId,
        role: msg.role,
        content: msg.content,
        image_url: msg.image_url || null,
        suggestions: msg.suggestions ? JSON.parse(JSON.stringify(
          msg.suggestions.map(s => {
            const n = normalizeSuggestion(s);
            return { name: n.product.name, slug: n.product.slug, price: n.product.price, image: n.product.image, reason: n.reason };
          })
        )) : null,
      });
    } catch {
      // Silent fail — chat still works locally
    }
  }

  function handleImageSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Max 4MB
    if (file.size > 4 * 1024 * 1024) {
      setError("Ảnh quá lớn. Vui lòng chọn ảnh dưới 4MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setPendingImage(base64);
      setPendingImagePreview(base64);
    };
    reader.readAsDataURL(file);
    
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function askAssistant(message: string) {
    const trimmed = message.trim();
    if ((!trimmed && !pendingImage) || loading) return;

    setLoading(true);
    setError("");
    setOpen(true);

    const userMsg: ChatMessage = {
      id: createMessageId(),
      role: "user",
      content: trimmed || "📷 Phân tích ảnh này giúp mình",
      image_url: pendingImagePreview || undefined,
    };
    setMessages((current) => [...current, userMsg]);
    
    // Save user message
    void saveMessage(userMsg);

    const imageToSend = pendingImage;
    setPendingImage(null);
    setPendingImagePreview(null);

    try {
      const history = messages.filter(m => m.id !== "welcome").map(m => ({ role: m.role, content: m.content }));
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: trimmed || "Phân tích hình ảnh và tư vấn sản phẩm phù hợp", 
          history,
          imageBase64: imageToSend || undefined,
        }),
      });
      const data = (await response.json()) as ChatResponsePayload & { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Không thể lấy phản hồi từ AuraCare AI.");
      }

      const assistantMsg: ChatMessage = {
        id: createMessageId(),
        role: "assistant",
        content: data.answer,
        suggestions: data.suggestions,
      };
      setMessages((current) => [...current, assistantMsg]);
      setInput("");
      
      // Save assistant message
      void saveMessage(assistantMsg);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Không thể lấy phản hồi từ AuraCare AI.");
      const errorMsg: ChatMessage = {
        id: createMessageId(),
        role: "assistant",
        content: "Hệ thống đang bận. Bạn thử lại hoặc đặt câu hỏi ngắn hơn nhé.",
      };
      setMessages((current) => [...current, errorMsg]);
    } finally {
      setLoading(false);
    }
  }

  async function clearHistory() {
    if (!confirm("Bạn có chắc muốn xóa toàn bộ lịch sử chat?")) return;
    
    if (userId) {
      try {
        const supabase = createClient();
        await (supabase as any).from("chat_messages").delete().eq("user_id", userId);
      } catch {
        // Silent
      }
    }
    
    setMessages([{
      id: "welcome",
      role: "assistant",
      content: "Xin chào! Mình là **Dược sĩ AI** của AuraCare 💊\n\nBạn có thể:\n• Mô tả triệu chứng để mình gợi ý sản phẩm\n• Gửi ảnh da để mình phân tích\n• Hỏi về thành phần, cách dùng bất kỳ sản phẩm nào",
    }]);
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
                  <Activity className="w-3 h-3" /> 
                  {userId ? "💾 Đã đăng nhập • Chat được lưu" : "Chưa đăng nhập • Chat tạm thời"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clearHistory}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition hover:bg-white/20 hover:text-white"
                aria-label="Xóa lịch sử"
                title="Xóa lịch sử chat"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition hover:bg-white/20 hover:text-white"
                aria-label="Đóng chatbot"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Chat History */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 px-4 py-5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className="flex flex-col gap-2 max-w-[85%]">
                  {/* Image Preview (for user messages with images) */}
                  {message.image_url && (
                    <div className={`overflow-hidden rounded-2xl border border-slate-200 shadow-sm ${message.role === "user" ? "ml-auto" : ""}`}>
                      <Image 
                        src={message.image_url} 
                        alt="Ảnh tư vấn" 
                        width={200}
                        height={150}
                        className="max-h-48 w-auto rounded-2xl object-cover"
                      />
                    </div>
                  )}
                  
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
                        {message.suggestions.slice(0, 3).map((rawItem, idx) => {
                          const item = normalizeSuggestion(rawItem);
                          if (!item.product.slug) return null;
                          return (
                            <Link
                              key={item.product.slug + idx}
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
                          );
                        })}
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

          {/* Pending Image Preview */}
          {pendingImagePreview && (
            <div className="border-t border-slate-100 bg-slate-50 px-4 py-2">
              <div className="relative inline-block">
                <Image src={pendingImagePreview} alt="Preview" width={100} height={80} className="h-20 w-auto rounded-lg border border-slate-200 object-cover" />
                <button
                  type="button"
                  onClick={() => { setPendingImage(null); setPendingImagePreview(null); }}
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-sm text-xs"
                >
                  ×
                </button>
              </div>
            </div>
          )}

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
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />
              
              {/* Image upload button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-300 bg-white text-slate-500 shadow-sm transition hover:border-teal-400 hover:text-teal-600 disabled:opacity-50"
                aria-label="Gửi ảnh tư vấn"
                title="Gửi ảnh để tư vấn"
              >
                <ImagePlus className="h-5 w-5" />
              </button>

              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if(input.trim() || pendingImage) handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
                  }
                }}
                rows={1}
                placeholder={pendingImage ? "Mô tả thêm về ảnh (tùy chọn)..." : "Nhập triệu chứng hoặc nhu cầu..."}
                className="max-h-[8rem] min-h-[3rem] flex-1 resize-none rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-[#0f172a] shadow-sm outline-none transition focus:border-[#0d9488] focus:ring-1 focus:ring-[#0d9488]"
              />
              <button
                type="submit"
                disabled={loading || (!input.trim() && !pendingImage)}
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
