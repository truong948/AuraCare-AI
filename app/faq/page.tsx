import Link from "next/link";
import { ArrowLeft, Bot, SearchCheck, ShieldCheck } from "lucide-react";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { StorefrontHeader } from "@/components/storefront/storefront-header";
import { faqKnowledgeBase } from "@/lib/ai/knowledge";

const faqIcons = [Bot, ShieldCheck, SearchCheck] as const;

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
            {faqKnowledgeBase.map((item, index) => {
              const Icon = faqIcons[index % faqIcons.length];
              return (
              <div
                key={item.id}
                className="rounded-[28px] border border-[#d7e5df] bg-[#ffffff] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#edf4f1] text-[#5b8c7a]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#0f172a]">{item.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-[#475569]">{item.answer}</p>
                  </div>
                </div>
              </div>
            )})}
          </div>
        </section>
      </main>

      <StorefrontFooter />
    </div>
  );
}
