import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/storefront/product-card";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { StorefrontHeader } from "@/components/storefront/storefront-header";
import {
  getBadgeLabel,
  getProductsByCategory,
  storefrontCategories,
  type MockProduct,
  type ProductCategory,
} from "@/lib/mock-data/catalog";

const categoryAccents: Record<ProductCategory, { badge: string; panel: string; chip: string }> = {
  supplement: {
    badge: "text-[#5b8c7a]",
    panel: "bg-[linear-gradient(160deg,#eff6f2_0%,#f8fbf9_100%)]",
    chip: "bg-[#edf4f1] text-[#4f7c6d]",
  },
  skincare: {
    badge: "text-[#b88530]",
    panel: "bg-[linear-gradient(160deg,#fff7ea_0%,#fffdf8_100%)]",
    chip: "bg-[#fff3df] text-[#8e6423]",
  },
};

function sortProducts(products: MockProduct[], sort: string) {
  const cloned = [...products];

  switch (sort) {
    case "price-asc":
      return cloned.sort((first, second) => first.price - second.price);
    case "price-desc":
      return cloned.sort((first, second) => second.price - first.price);
    case "rating":
      return cloned.sort((first, second) => second.rating - first.rating);
    default:
      return cloned.sort((first, second) => second.reviewCount - first.reviewCount);
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ sort?: string; badge?: string }>;
}) {
  const { category } = await params;
  const { sort = "popular", badge = "all" } = await searchParams;
  const currentCategory = storefrontCategories.find((item) => item.id === category);

  if (!currentCategory) {
    notFound();
  }

  const baseProducts = getProductsByCategory(currentCategory.id);
  const filteredProducts =
    badge === "all" ? baseProducts : baseProducts.filter((product) => product.badge === badge);
  const products = sortProducts(filteredProducts, sort);
  const accent = categoryAccents[currentCategory.id];
  const benefitTags = Array.from(new Set(baseProducts.flatMap((product) => product.benefitTags))).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#f6f4ee] text-[#0f172a]">
      <StorefrontHeader />

      <main>
        <section className="border-b border-[#dce6df] bg-[#ffffff]">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <Link href="/" className="inline-flex items-center text-sm font-semibold text-[#5b8c7a]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại trang chủ
            </Link>

            <div
              className={`mt-6 rounded-[36px] border border-[#dce6df] p-8 shadow-[0_16px_34px_rgba(15,23,42,0.05)] sm:p-10 ${accent.panel}`}
            >
              <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
                <div>
                  <p className={`text-sm font-semibold uppercase tracking-[0.22em] ${accent.badge}`}>
                    Danh mục {currentCategory.label.toLowerCase()}
                  </p>
                  <h1 className="mt-3 text-4xl font-bold leading-tight text-[#0f172a] sm:text-5xl">
                    {currentCategory.description}
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-8 text-[#475569] sm:text-base">
                    Đây là trang danh mục chính của AuraCare: có khối giới thiệu, filter mock, sắp xếp mock, và grid
                    sản phẩm sẵn sàng để nối sang semantic search hoặc recommendation.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {benefitTags.map((tag) => (
                      <span key={tag} className={`rounded-full px-4 py-2 text-xs font-semibold ${accent.chip}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[26px] bg-[#ffffff] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">Sản phẩm</p>
                    <p className="mt-2 text-3xl font-bold text-[#0f172a]">{baseProducts.length}</p>
                  </div>
                  <div className="rounded-[26px] bg-[#ffffff] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">Tìm kiếm</p>
                    <p className="mt-2 text-base font-semibold text-[#0f172a]">Tag theo nhu cầu và triệu chứng</p>
                  </div>
                  <div className="rounded-[26px] bg-[#ffffff] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">Lớp AI</p>
                    <p className="mt-2 text-base font-semibold text-[#0f172a]">Gợi ý có thể giải thích</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[28px] border border-[#dce6df] bg-[#ffffff] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#edf4f1] text-[#5b8c7a]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#0f172a]">AI sẽ dùng danh mục này như thế nào?</h2>
                  <p className="mt-2 text-sm leading-7 text-[#475569]">
                    Query embeddings, concern tags, ingredient text, và benefit tags có thể kết hợp để trả về kết quả
                    bám sát nhu cầu hơn nhiều so với tìm kiếm từ khóa thuần túy.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-[#dce6df] bg-[#ffffff] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#edf4f1] text-[#5b8c7a]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#0f172a]">Định vị an toàn cho nghiên cứu</h2>
                  <p className="mt-2 text-sm leading-7 text-[#475569]">
                    Đây là storefront học thuật tập trung vào khám phá và giáo dục sản phẩm, không đưa ra chẩn đoán và
                    luôn giữ nội dung ở dạng có cấu trúc, dễ giải thích.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 flex flex-col gap-4 rounded-[28px] border border-[#d7e5df] bg-[#ffffff] p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)] lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className={`text-sm font-semibold uppercase tracking-[0.2em] ${accent.badge}`}>Bộ lọc danh mục</p>
              <h2 className="mt-2 text-3xl font-bold text-[#0f172a]">
                Duyệt toàn bộ kệ {currentCategory.label.toLowerCase()}
              </h2>
            </div>

            <form className="grid gap-3 sm:grid-cols-3">
              <input type="hidden" name="category" value={currentCategory.id} />
              <label className="space-y-2 text-sm font-medium text-[#334155]">
                Sắp xếp
                <select
                  name="sort"
                  defaultValue={sort}
                  className="h-11 w-full rounded-2xl border border-[#d7e5df] bg-[#fbfcfa] px-4 text-sm text-[#334155] outline-none"
                >
                  <option value="popular">Phổ biến nhất</option>
                  <option value="price-asc">Giá thấp đến cao</option>
                  <option value="price-desc">Giá cao đến thấp</option>
                  <option value="rating">Đánh giá cao nhất</option>
                </select>
              </label>
              <label className="space-y-2 text-sm font-medium text-[#334155]">
                Nhãn sản phẩm
                <select
                  name="badge"
                  defaultValue={badge}
                  className="h-11 w-full rounded-2xl border border-[#d7e5df] bg-[#fbfcfa] px-4 text-sm text-[#334155] outline-none"
                >
                  <option value="all">Tất cả</option>
                  <option value="Best seller">Bán chạy</option>
                  <option value="AI pick">AI gợi ý</option>
                  <option value="Flash deal">Giá tốt</option>
                  <option value="New">Mới</option>
                </select>
              </label>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="h-11 w-full rounded-2xl bg-[#5b8c7a] px-5 text-sm font-semibold text-[#ffffff] transition hover:bg-[#4f7c6d]"
                >
                  Áp dụng
                </button>
              </div>
            </form>
          </div>

          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className={`text-sm font-semibold uppercase tracking-[0.2em] ${accent.badge}`}>Kết quả hiển thị</p>
              <p className="mt-2 text-sm text-[#64748b]">
                {products.length} sản phẩm phù hợp với bộ lọc hiện tại
              </p>
            </div>
            <Link href={`/products/${products[0]?.slug ?? ""}`} className="inline-flex items-center text-sm font-semibold text-[#5b8c7a]">
              Mở một trang chi tiết mẫu
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {products.length === 0 ? (
            <div className="mt-8 rounded-[28px] border border-dashed border-[#d7e5df] bg-[#ffffff] px-6 py-10 text-center">
              <p className="text-lg font-semibold text-[#0f172a]">Chưa có sản phẩm khớp bộ lọc này</p>
              <p className="mt-2 text-sm text-[#64748b]">Hãy đổi nhãn hoặc kiểu sắp xếp để xem thêm kết quả.</p>
            </div>
          ) : null}
        </section>
      </main>

      <StorefrontFooter />
    </div>
  );
}
