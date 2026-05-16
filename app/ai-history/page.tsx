import Link from "next/link";
import { ArrowLeft, Bot, History, SearchCheck } from "lucide-react";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { StorefrontHeader } from "@/components/storefront/storefront-header";
import { getUserAiHistory } from "@/lib/ai/history";

export default async function AiHistoryPage() {
  const historyItems = await getUserAiHistory();

  return (
    <div className="min-h-screen bg-[#f6f4ee] text-[#0f172a]">
      <StorefrontHeader />

      <main>
        <section className="border-b border-[#dce6df] bg-[#ffffff]">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
            <Link href="/" className="inline-flex items-center text-sm font-semibold text-[#5b8c7a]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại trang chủ
            </Link>

            <div className="mt-6 rounded-[36px] border border-[#dce6df] bg-[linear-gradient(160deg,#eff6f2_0%,#f9fbfa_100%)] p-8 shadow-[0_16px_34px_rgba(15,23,42,0.05)] sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5b8c7a]">AI History</p>
              <h1 className="mt-3 text-4xl font-bold leading-tight text-[#0f172a] sm:text-5xl">
                Lịch sử tương tác với AuraCare AI
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-[#475569]">
                Màn này cho người dùng xem lại các truy vấn semantic search và các phiên hỏi đáp với chatbot để theo
                dõi hành trình khám phá sản phẩm.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          {historyItems.length === 0 ? (
            <div className="rounded-[32px] border border-dashed border-[#d7e5df] bg-[#ffffff] p-10 text-center">
              <History className="mx-auto h-12 w-12 text-[#5b8c7a]" />
              <p className="mt-4 text-xl font-semibold text-[#0f172a]">Chưa có lịch sử AI</p>
              <p className="mt-2 text-sm text-[#64748b]">
                Hãy thử tìm kiếm bằng AI hoặc hỏi chatbot trên trang sản phẩm để bắt đầu.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {historyItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[28px] border border-[#d7e5df] bg-[#ffffff] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)]"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#edf4f1] text-[#5b8c7a]">
                      {item.type === "search" ? <SearchCheck className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#94a3b8]">
                        <span>{item.timestamp}</span>
                        <span className="rounded-full bg-[#edf4f1] px-3 py-1 text-[#4f7c6d]">{item.source}</span>
                      </div>
                      <h2 className="mt-3 text-xl font-bold text-[#0f172a]">{item.title}</h2>
                      <p className="mt-3 text-sm leading-7 text-[#475569]">{item.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <StorefrontFooter />
    </div>
  );
}
