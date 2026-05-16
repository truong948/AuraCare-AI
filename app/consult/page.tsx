import Link from "next/link";
import { ArrowRight, Bot, MessageSquareQuote, SearchCheck, ShieldCheck } from "lucide-react";
import { ConsultationBuilder } from "@/components/storefront/consultation-builder";
import { SearchAiWidget } from "@/components/storefront/search-ai-widget";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { StorefrontHeader } from "@/components/storefront/storefront-header";
import { getProductBySlug } from "@/lib/mock-data/catalog";

export default async function ConsultPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product: productSlug } = await searchParams;
  const product = productSlug ? getProductBySlug(productSlug) : undefined;

  return (
    <div className="min-h-screen bg-[#f6f4ee] text-[#0f172a]">
      <StorefrontHeader />

      <main>
        <section className="border-b border-[#dce6df] bg-[#ffffff]">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="rounded-[36px] border border-[#dce6df] bg-[linear-gradient(160deg,#eff6f2_0%,#f9fbfa_100%)] p-8 shadow-[0_16px_34px_rgba(15,23,42,0.05)] sm:p-10">
              <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5b8c7a]">Trang tư vấn sản phẩm</p>
                  <h1 className="mt-3 text-4xl font-bold leading-tight text-[#0f172a] sm:text-5xl">
                    Một nơi riêng để bắt đầu nếu bạn chưa biết nên chọn sản phẩm nào
                  </h1>
                  <p className="mt-4 max-w-3xl text-sm leading-8 text-[#475569] sm:text-base">
                    Thay vì buộc người dùng phải đi thẳng vào PDP, trang này đóng vai trò như điểm vào cho tư vấn:
                    mô tả nhu cầu, nhận gợi ý, rồi mới đi sang danh mục hoặc trang sản phẩm cụ thể.
                  </p>
                </div>

                <div className="rounded-[28px] bg-[#ffffff] p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">Ngữ cảnh hiện tại</p>
                  <p className="mt-3 text-lg font-semibold text-[#0f172a]">
                    {product ? `Đang tư vấn xoay quanh: ${product.name}` : "Tư vấn mở theo nhu cầu"}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[#475569]">
                    {product
                      ? "Người dùng có thể đi từ trang sản phẩm sang đây để hỏi sâu hơn về mức độ phù hợp, lựa chọn thay thế hoặc mua kèm."
                      : "Trang này phù hợp khi người dùng chỉ mới biết nhu cầu, chưa biết tên sản phẩm."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Mô tả nhu cầu",
                description: "Ví dụ: da nhạy cảm thiếu ẩm, hoặc vitamin hỗ trợ tập trung cho dân văn phòng.",
                icon: MessageSquareQuote,
              },
              {
                title: "Nhận gợi ý ban đầu",
                description: "AI sẽ gom những sản phẩm gần nhất theo ngữ nghĩa và metadata của catalog.",
                icon: SearchCheck,
              },
              {
                title: "Đi sang PDP để quyết định",
                description: "Sau khi có shortlist, người dùng đi vào trang sản phẩm để xem tư vấn chuyên sâu hơn.",
                icon: Bot,
              },
              {
                title: "Giữ an toàn nội dung",
                description: "AuraCare AI hỗ trợ tra cứu và gợi ý sản phẩm, không thay thế tư vấn y khoa chuyên môn.",
                icon: ShieldCheck,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[28px] border border-[#dce6df] bg-[#ffffff] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf4f1] text-[#5b8c7a]">
                  <item.icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-xl font-bold text-[#0f172a]">{item.title}</h2>
                <p className="mt-2 text-sm leading-7 text-[#475569]">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <ConsultationBuilder />
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <SearchAiWidget initialQuery={product ? `${product.name} phu hop voi ai` : "da nhay cam thieu am"} />

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {[
              "vitamin hỗ trợ miễn dịch cho người hay mệt",
              "serum dịu nhẹ cho da thiếu ẩm và nhạy cảm",
              "sản phẩm nào gần giống nhưng dịu hơn",
            ].map((prompt) => (
              <Link
                key={prompt}
                href={`/search?q=${encodeURIComponent(prompt)}`}
                className="rounded-[24px] border border-[#d7e5df] bg-[#ffffff] p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#94a3b8]">Truy vấn mẫu</p>
                <p className="mt-3 text-base font-semibold leading-7 text-[#0f172a]">{prompt}</p>
                <p className="mt-3 inline-flex items-center text-sm font-semibold text-[#5b8c7a]">
                  Mở kết quả tư vấn
                  <ArrowRight className="ml-2 h-4 w-4" />
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <StorefrontFooter />
    </div>
  );
}
