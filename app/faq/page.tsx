import Link from "next/link";
import { ArrowLeft, Bot, SearchCheck, ShieldCheck } from "lucide-react";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { StorefrontHeader } from "@/components/storefront/storefront-header";

const faqItems = [
  {
    question: "AuraCare AI hỗ trợ người dùng như thế nào ở phase hiện tại?",
    answer:
      "Phase hiện tại tập trung vào chatbot hỗ trợ mua sắm, semantic search, recommendation rule-based và các bề mặt giải thích sản phẩm rõ ràng hơn.",
    icon: Bot,
  },
  {
    question: "Vì sao storefront chỉ tập trung vào supplement và skincare?",
    answer:
      "Hai nhóm này phù hợp cho nghiên cứu UI/UX và AI hơn ở giai đoạn đầu vì có metadata phong phú, dễ gắn concern tags và ít rủi ro pháp lý hơn OTC hoặc thiết bị y tế.",
    icon: ShieldCheck,
  },
  {
    question: "Semantic search sẽ hoạt động như thế nào khi nối backend thật?",
    answer:
      "Người dùng nhập truy vấn tự nhiên, hệ thống tạo embedding bằng Gemini text-embedding-004, so khớp với pgvector trong Supabase và trả về sản phẩm có độ tương đồng cao nhất.",
    icon: SearchCheck,
  },
] as const;

export default function FaqPage() {
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
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5b8c7a]">FAQ</p>
              <h1 className="mt-3 text-4xl font-bold leading-tight text-[#0f172a] sm:text-5xl">
                Câu hỏi thường gặp về storefront và AI của AuraCare
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-[#475569]">
                Trang này giúp phase 3 có một bề mặt FAQ riêng thay vì chỉ đặt các câu hỏi ở homepage. Sau này có thể
                nối trực tiếp với chatbot hoặc knowledge base.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqItems.map((item) => (
              <div
                key={item.question}
                className="rounded-[28px] border border-[#d7e5df] bg-[#ffffff] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#edf4f1] text-[#5b8c7a]">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#0f172a]">{item.question}</h2>
                    <p className="mt-3 text-sm leading-7 text-[#475569]">{item.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <StorefrontFooter />
    </div>
  );
}
