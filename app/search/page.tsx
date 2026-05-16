import Link from "next/link";
import { ArrowRight, SearchCheck, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/storefront/product-card";
import { SearchAiWidget } from "@/components/storefront/search-ai-widget";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { StorefrontHeader } from "@/components/storefront/storefront-header";
import { runSemanticSearch } from "@/lib/ai/search";
import { getCategoryLabel, type ProductCategory } from "@/lib/mock-data/catalog";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: ProductCategory }>;
}) {
  const { q = "", category } = await searchParams;
  const searchResponse = await runSemanticSearch({
    query: q,
    category,
    limit: 12,
  });
  const results = searchResponse.results;

  return (
    <div className="min-h-screen bg-[#f6f4ee] text-[#0f172a]">
      <StorefrontHeader />

      <main>
        <section className="border-b border-[#dce6df] bg-[#ffffff]">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="rounded-[36px] border border-[#dce6df] bg-[linear-gradient(160deg,#eff6f2_0%,#f9fbfa_100%)] p-8 shadow-[0_16px_34px_rgba(15,23,42,0.05)] sm:p-10">
              <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5b8c7a]">
                    Kết quả tìm kiếm
                  </p>
                  <h1 className="mt-3 text-4xl font-bold leading-tight text-[#0f172a] sm:text-5xl">
                    {q ? `Tìm thấy kết quả cho "${q}"` : "Khám phá sản phẩm theo nhu cầu"}
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-8 text-[#475569] sm:text-base">
                    {searchResponse.explanation}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[26px] bg-[#ffffff] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">Từ khóa</p>
                    <p className="mt-2 text-base font-semibold text-[#0f172a]">{q || "Khám phá tổng quát"}</p>
                  </div>
                  <div className="rounded-[26px] bg-[#ffffff] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">Danh mục</p>
                    <p className="mt-2 text-base font-semibold text-[#0f172a]">
                      {category ? getCategoryLabel(category) : "Tất cả sản phẩm"}
                    </p>
                  </div>
                  <div className="rounded-[26px] bg-[#ffffff] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">Nguồn AI</p>
                    <p className="mt-2 text-base font-semibold text-[#0f172a]">
                      {searchResponse.source === "gemini-pgvector" ? "Gemini + pgvector" : "Fallback hybrid local"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8">
            <SearchAiWidget initialQuery={q} category={category} />
          </div>

          <div className="mb-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[28px] border border-[#dce6df] bg-[#ffffff] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#edf4f1] text-[#5b8c7a]">
                  <SearchCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#0f172a]">Giải thích ngắn cho kết quả</h2>
                  <p className="mt-2 text-sm leading-7 text-[#475569]">
                    Mỗi kết quả hiện đã có điểm xếp hạng, tín hiệu semantic, tín hiệu keyword và câu giải thích ngắn
                    để bạn kiểm thử luồng AI MVP ngay trên giao diện storefront.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-[#dce6df] bg-[#ffffff] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#edf4f1] text-[#5b8c7a]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#0f172a]">Gợi ý truy vấn</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      "da nhạy cảm thiếu ẩm",
                      "vitamin hỗ trợ tập trung",
                      "barrier repair",
                      "sleep balance",
                    ].map((term) => (
                      <Link
                        key={term}
                        href={`/search?q=${encodeURIComponent(term)}`}
                        className="rounded-full bg-[#edf4f1] px-3 py-2 text-xs font-semibold text-[#4f7c6d]"
                      >
                        {term}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5b8c7a]">Sản phẩm phù hợp</p>
              <p className="mt-2 text-sm text-[#64748b]">
                {results.length > 0
                  ? "Đây là các sản phẩm được AI MVP đánh giá là phù hợp nhất với truy vấn hiện tại."
                  : "Chưa có kết quả khớp, hãy thử thay đổi cách diễn đạt truy vấn."}
              </p>
            </div>
            {results[0] ? (
              <Link
                href={`/products/${results[0].product.slug}`}
                className="inline-flex items-center text-sm font-semibold text-[#5b8c7a]"
              >
                Xem sản phẩm nổi bật
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            ) : null}
          </div>

          {results.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {results.map((item) => (
                <div key={item.product.id} className="space-y-3">
                  <ProductCard product={item.product} />
                  <div className="rounded-[22px] bg-[#ffffff] px-4 py-4 shadow-[0_8px_20px_rgba(15,23,42,0.03)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#94a3b8]">Lý do AI match</p>
                    <p className="mt-2 text-sm leading-7 text-[#475569]">{item.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-[#d7e5df] bg-[#ffffff] px-6 py-12 text-center">
              <p className="text-lg font-semibold text-[#0f172a]">Chưa có sản phẩm phù hợp</p>
              <p className="mt-2 text-sm text-[#64748b]">
                Hãy thử với từ khóa như "da nhạy cảm thiếu ẩm" hoặc "vitamin hỗ trợ năng lượng".
              </p>
            </div>
          )}
        </section>
      </main>

      <StorefrontFooter />
    </div>
  );
}
