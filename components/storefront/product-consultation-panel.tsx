import Link from "next/link";
import { ArrowRight, BadgeCheck, Bot, ClipboardList, Scale, ShieldCheck } from "lucide-react";
import type { MockProduct } from "@/lib/mock-data/catalog";
import { getProductRecommendations } from "@/lib/ai/recommendations";
import { formatMockPrice } from "@/lib/mock-data/catalog";

export function ProductConsultationPanel({ product }: { product: MockProduct }) {
  const topRecommendations = getProductRecommendations(product.slug, 3);
  const closestAlternative = topRecommendations[0];
  const bundleSuggestion = topRecommendations.find(
    (item) => item.product.category !== product.category
  );

  const consultScenarios = [
    {
      title: "Ai nên cân nhắc sản phẩm này",
      description: `Phù hợp nhất với người đang quan tâm tới ${product.concernTags
        .slice(0, 2)
        .join(", ")} và muốn hỗ trợ ${product.benefitTags.slice(0, 2).join(", ")}.`,
      icon: BadgeCheck,
    },
    {
      title: "Cách hỏi AI hiệu quả",
      description: "Hỏi theo tình trạng, mục tiêu, thành phần mong muốn hoặc ngân sách để nhận câu trả lời sát hơn.",
      icon: Bot,
    },
    {
      title: "Lưu ý an toàn",
      description: product.warnings,
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
      <div className="rounded-[34px] border border-[#d7e5df] bg-[#ffffff] p-6 shadow-[0_16px_34px_rgba(15,23,42,0.04)] sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5b8c7a]">Tư vấn trên trang sản phẩm</p>
            <h2 className="mt-2 text-3xl font-bold text-[#0f172a]">Một lớp tư vấn rõ ràng trước khi người dùng quyết định</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#475569]">
              Thay vì chỉ hiển thị giá và thành phần, PDP của AuraCare được thiết kế để trả lời ba câu hỏi chính:
              sản phẩm này hợp với ai, nên dùng thế nào, và nếu chưa hợp thì nên xem lựa chọn nào khác.
            </p>
          </div>
          <Link
            href={`/consult?product=${encodeURIComponent(product.slug)}`}
            className="inline-flex items-center rounded-full bg-[#0f172a] px-5 py-3 text-sm font-semibold text-white"
          >
            Mở tư vấn chuyên sâu
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {consultScenarios.map((scenario) => (
            <div key={scenario.title} className="rounded-[26px] bg-[#f8fbfa] p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf4f1] text-[#5b8c7a]">
                <scenario.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[#0f172a]">{scenario.title}</h3>
              <p className="mt-2 text-sm leading-7 text-[#475569]">{scenario.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[28px] border border-[#d7e5df] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf4f1] text-[#5b8c7a]">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">Lựa chọn thay thế gần nhất</p>
                <h3 className="text-xl font-semibold text-[#0f172a]">
                  {closestAlternative ? closestAlternative.product.name : "Đang cập nhật"}
                </h3>
              </div>
            </div>

            {closestAlternative ? (
              <div className="mt-4 space-y-3">
                <p className="text-sm leading-7 text-[#475569]">{closestAlternative.reason}</p>
                <p className="text-sm font-semibold text-[#0f172a]">
                  Giá tham khảo: {formatMockPrice(closestAlternative.product.price)}
                </p>
                <Link
                  href={`/products/${closestAlternative.product.slug}`}
                  className="inline-flex items-center text-sm font-semibold text-[#5b8c7a]"
                >
                  Xem sản phẩm thay thế
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            ) : null}
          </div>

          <div className="rounded-[28px] border border-[#d7e5df] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf4f1] text-[#5b8c7a]">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">Mua kèm / routine</p>
                <h3 className="text-xl font-semibold text-[#0f172a]">
                  {bundleSuggestion ? bundleSuggestion.product.name : "Gợi ý đang đồng danh mục"}
                </h3>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-sm leading-7 text-[#475569]">
                {bundleSuggestion
                  ? bundleSuggestion.reason
                  : "Hiện tại recommendation đang ưu tiên các lựa chọn gần nhu cầu nhất. Khi mở rộng AI layer, phần này có thể trở thành mua kèm đa bước theo routine."}
              </p>
              {bundleSuggestion ? (
                <Link
                  href={`/products/${bundleSuggestion.product.slug}`}
                  className="inline-flex items-center text-sm font-semibold text-[#5b8c7a]"
                >
                  Xem gợi ý mua kèm
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              ) : (
                <Link href="/consult" className="inline-flex items-center text-sm font-semibold text-[#5b8c7a]">
                  Mở trang tư vấn AI
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
