"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, LoaderCircle, Sparkles } from "lucide-react";
import type { ProductCategory } from "@/lib/mock-data/catalog";
import type { SearchResponsePayload } from "@/lib/ai/types";
import { getCategoryLabel } from "@/lib/mock-data/catalog";

const needsByCategory: Record<
  ProductCategory,
  { id: string; label: string; prompt: string; context: string }[]
> = {
  supplement: [
    {
      id: "energy",
      label: "Tăng năng lượng và tỉnh táo",
      prompt: "vitamin hỗ trợ năng lượng cho người làm việc văn phòng hay mệt",
      context: "Phù hợp khi bạn muốn bắt đầu từ nhu cầu tỉnh táo, đỡ uể oải và tập trung hơn.",
    },
    {
      id: "immune",
      label: "Hỗ trợ miễn dịch",
      prompt: "thực phẩm bổ sung hỗ trợ miễn dịch cho người hay mệt",
      context: "Thích hợp nếu bạn đang muốn ưu tiên đề kháng và chăm sóc nền tảng hằng ngày.",
    },
    {
      id: "sleep",
      label: "Cân bằng giấc ngủ",
      prompt: "supplement hỗ trợ ngủ ngon và phục hồi ban đêm",
      context: "Nên chọn khi bạn muốn AI ưu tiên các sản phẩm liên quan nghỉ ngơi và phục hồi.",
    },
  ],
  skincare: [
    {
      id: "hydration",
      label: "Da thiếu ẩm cần phục hồi",
      prompt: "skincare cho da thiếu ẩm nhạy cảm cần phục hồi hàng rào",
      context: "Điểm vào tốt cho nhu cầu cấp ẩm, làm dịu và phục hồi nền da.",
    },
    {
      id: "sensitive",
      label: "Da nhạy cảm dễ châm chích",
      prompt: "serum dịu nhẹ cho da nhạy cảm dễ đỏ rát ít hương liệu",
      context: "Phù hợp nếu bạn cần lọc ưu tiên dịu nhẹ và giảm nguy cơ kích ứng.",
    },
    {
      id: "blemish",
      label: "Da dầu mụn cần thông thoáng",
      prompt: "skincare cho da dầu mụn lỗ chân lông dễ bít tắc",
      context: "Nên dùng khi bạn đang tìm sản phẩm hướng đến mụn, dầu và lỗ chân lông.",
    },
  ],
};

const budgetOptions = [
  { id: "all", label: "Mọi mức giá", maxPrice: Infinity },
  { id: "under-400", label: "Dưới 400.000đ", maxPrice: 400000 },
  { id: "under-550", label: "Dưới 550.000đ", maxPrice: 550000 },
  { id: "premium", label: "Ưu tiên sản phẩm cao cấp", maxPrice: Infinity },
] as const;

export function ConsultationBuilder() {
  const [category, setCategory] = useState<ProductCategory>("supplement");
  const [needId, setNeedId] = useState(needsByCategory.supplement[0].id);
  const [budgetId, setBudgetId] = useState<(typeof budgetOptions)[number]["id"]>("all");
  const [results, setResults] = useState<SearchResponsePayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const needs = needsByCategory[category];
  const selectedNeed = needs.find((item) => item.id === needId) ?? needs[0];
  const selectedBudget = budgetOptions.find((item) => item.id === budgetId) ?? budgetOptions[0];

  const generatedQuery = useMemo(() => {
    const budgetPrompt =
      selectedBudget.id === "all"
        ? ""
        : selectedBudget.id === "premium"
          ? " cao cấp"
          : ` giá dưới ${selectedBudget.maxPrice.toLocaleString("vi-VN")}đ`;

    return `${selectedNeed.prompt}${budgetPrompt}`.trim();
  }, [selectedBudget, selectedNeed]);

  async function handleSubmit() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: generatedQuery, category, limit: 6 }),
      });

      const payload = (await response.json()) as SearchResponsePayload | { error?: string };
      if (!response.ok || !("results" in payload)) {
        throw new Error("Không thể tạo shortlist tư vấn lúc này.");
      }

      const filtered =
        selectedBudget.maxPrice === Infinity
          ? payload.results
          : payload.results.filter((item) => item.product.price <= selectedBudget.maxPrice);

      setResults({ ...payload, results: filtered });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Không thể tạo shortlist tư vấn lúc này.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-[32px] border border-[#dce6df] bg-[#ffffff] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.05)] sm:p-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5b8c7a]">Tư vấn nhiều bước</p>
          <h2 className="mt-2 text-3xl font-bold text-[#0f172a]">Đi từng bước để tạo shortlist sản phẩm phù hợp</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#475569]">
            Đây là phiên bản MVP hợp lý cho AuraCare: người dùng chọn danh mục, nhu cầu và ngân sách, sau đó AI dùng semantic search để đưa ra danh sách khởi đầu dễ quyết định hơn.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#5b8c7a] px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Tạo shortlist với AI"}
        </button>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <div className="rounded-[26px] bg-[#f8fbfa] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">Bước 1</p>
          <h3 className="mt-2 text-lg font-semibold text-[#0f172a]">Chọn nhóm sản phẩm</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {(["supplement", "skincare"] as ProductCategory[]).map((item) => {
              const active = item === category;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setCategory(item);
                    setNeedId(needsByCategory[item][0].id);
                    setResults(null);
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-[#5b8c7a] text-white"
                      : "border border-[#d7e5df] bg-white text-[#475569] hover:border-[#5b8c7a] hover:text-[#5b8c7a]"
                  }`}
                >
                  {getCategoryLabel(item)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-[26px] bg-[#f8fbfa] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">Bước 2</p>
          <h3 className="mt-2 text-lg font-semibold text-[#0f172a]">Chọn nhu cầu chính</h3>
          <div className="mt-4 space-y-3">
            {needs.map((item) => {
              const active = item.id === selectedNeed.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setNeedId(item.id);
                    setResults(null);
                  }}
                  className={`w-full rounded-[22px] border px-4 py-3 text-left transition ${
                    active
                      ? "border-[#5b8c7a] bg-[#edf4f1]"
                      : "border-[#d7e5df] bg-white hover:border-[#5b8c7a]"
                  }`}
                >
                  <p className="text-sm font-semibold text-[#0f172a]">{item.label}</p>
                  <p className="mt-1 text-xs leading-6 text-[#64748b]">{item.context}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-[26px] bg-[#f8fbfa] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">Bước 3</p>
          <h3 className="mt-2 text-lg font-semibold text-[#0f172a]">Chọn ngân sách</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {budgetOptions.map((item) => {
              const active = item.id === selectedBudget.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setBudgetId(item.id);
                    setResults(null);
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-[#0f172a] text-white"
                      : "border border-[#d7e5df] bg-white text-[#475569] hover:border-[#0f172a] hover:text-[#0f172a]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="mt-5 rounded-[22px] border border-[#e6ede8] bg-white px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">Truy vấn AI sẽ dùng</p>
            <p className="mt-2 text-sm leading-7 text-[#334155]">{generatedQuery}</p>
          </div>
        </div>
      </div>

      {error ? <p className="mt-5 text-sm font-medium text-[#c2410c]">{error}</p> : null}

      {results ? (
        <div className="mt-8 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[26px] border border-[#dce6df] bg-[#f8fbfa] p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#5b8c7a]" />
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5b8c7a]">Gợi ý từ AI</p>
            </div>
            <h3 className="mt-3 text-xl font-bold text-[#0f172a]">
              {results.results.length > 0
                ? `Đã tạo ${results.results.length} lựa chọn khởi đầu`
                : "Chưa có kết quả sau khi lọc ngân sách"}
            </h3>
            <p className="mt-3 text-sm leading-7 text-[#475569]">{results.explanation}</p>
            <p className="mt-4 text-sm leading-7 text-[#475569]">
              Luồng này rất phù hợp với phase hiện tại vì nó giúp website có cảm giác tư vấn thật, nhưng vẫn giữ AI trong vùng an toàn: gợi ý sản phẩm, không chẩn đoán.
            </p>
          </div>

          <div className="grid gap-4">
            {results.results.length > 0 ? (
              results.results.slice(0, 4).map((item) => (
                <div
                  key={item.product.slug}
                  className="rounded-[24px] border border-[#dce6df] bg-white p-5 shadow-[0_8px_22px_rgba(15,23,42,0.04)]"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#0f172a]">{item.product.name}</p>
                      <p className="mt-2 text-sm leading-7 text-[#475569]">{item.reason}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.product.concernTags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-[#edf4f1] px-3 py-1 text-xs font-semibold text-[#4f7c6d]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="inline-flex items-center rounded-full bg-[#0f172a] px-4 py-2 text-sm font-semibold text-white"
                    >
                      Xem sản phẩm
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[24px] border border-dashed border-[#d7e5df] bg-white p-6 text-sm leading-7 text-[#64748b]">
                Bộ lọc ngân sách hiện tại chưa giữ lại sản phẩm nào. Bạn có thể tăng ngưỡng giá hoặc chuyển sang
                “Mọi mức giá”.
              </div>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
