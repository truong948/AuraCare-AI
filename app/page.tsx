import {
  ArrowRight,
  BadgeCheck,
  Bot,
  Boxes,
  CalendarDays,
  ChevronRight,
  FlaskConical,
  Leaf,
  MessageSquareQuote,
  Pill,
  ScanSearch,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/storefront/product-card";
import {
  aiHighlights,
  flashDealProducts,
  formatMockPrice,
  getBadgeLabel,
  getCategoryLabel,
  mockArticles,
  quickActions,
  skincareProducts,
  storefrontCategories,
  supplementProducts,
} from "@/lib/mock-data/catalog";

const navItems = [
  { label: "Trang chủ", href: "#top" },
  { label: "Danh mục", href: "#categories" },
  { label: "Ưu đãi", href: "#deals" },
  { label: "AI tư vấn", href: "#ai-consult" },
  { label: "Kiến thức", href: "#knowledge" },
] as const;

const featureIcons = [Bot, SearchCheck, ShieldCheck, Sparkles] as const;

const stats = [
  { label: "Sản phẩm mock", value: "60", icon: Boxes },
  { label: "SKU bổ sung", value: "30", icon: Pill },
  { label: "SKU chăm sóc da", value: "30", icon: FlaskConical },
  { label: "Bề mặt AI", value: "3", icon: Bot },
] as const;

const trustPoints = [
  {
    title: "Metadata sản phẩm có cấu trúc",
    description: "Mỗi SKU đều có concern tags, symptom tags, benefit tags, hướng dẫn dùng và lưu ý an toàn để AI có thể giải thích vì sao nó đề xuất sản phẩm đó.",
    icon: BadgeCheck,
  },
  {
    title: "Khám phá theo hướng sức khỏe trước",
    description: "Bố cục ưu tiên ý định tìm kiếm, nội dung giáo dục và sự rõ ràng trong tra cứu trước khi đẩy mạnh các pattern bán hàng gây áp lực.",
    icon: ShieldCheck,
  },
  {
    title: "Không gian thử nghiệm AI học thuật",
    description: "Storefront này được thiết kế để thử semantic search, logic recommendation và các kiểu hỗ trợ mua sắm có thể giải thích được.",
    icon: Sparkles,
  },
] as const;

const faqItems = [
  {
    question: "AuraCare AI sẽ làm gì ở phase đầu?",
    answer:
      "Phase 1 tập trung vào chatbot hỗ trợ khách hàng, recommendation rule-based, và semantic search để người dùng tìm sản phẩm theo nhu cầu thay vì chỉ theo từ khoá.",
  },
  {
    question: "Vì sao chỉ chọn supplement và skincare?",
    answer:
      "Đây là hai nhóm sản phẩm cân bằng tốt giữa khả năng trình bày dữ liệu, giá trị AI, và mức độ an toàn để phát triển một prototype học thuật có chiều sâu.",
  },
  {
    question: "Semantic search sẽ được triển khai như thế nào?",
    answer:
      "Luồng dự kiến là query của người dùng được embedding bằng Gemini text-embedding-004, sau đó so khớp cosine similarity trên Supabase pgvector và trả về kết quả phù hợp nhất.",
  },
  {
    question: "Chatbot có thay thế chuyên gia hay bác sĩ không?",
    answer:
      "Không. AuraCare AI được định nghĩa là công cụ hỗ trợ mua sắm và giáo dục sản phẩm, không đóng vai trò chẩn đoán hay thay thế tư vấn y khoa chuyên môn.",
  },
] as const;

const heroSignals = [
  "AI gợi ý sản phẩm",
  "Tìm theo nhu cầu",
  "Giao diện sạch và tin cậy",
] as const;

const heroProducts = [supplementProducts[0], skincareProducts[0]] as const;

export default function HomePage() {
  return (
    <div id="top" className="min-h-screen bg-[#f6f4ee] text-[#0f172a]">
      <header className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(232,169,80,0.22),transparent_28%),linear-gradient(180deg,#5b8c7a_0%,#7aa18f_22%,#cfe0d6_62%,#f6f4ee_100%)] text-[#ffffff]">
        <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(15,23,42,0.18),transparent)]" />
        <div className="absolute left-[-120px] top-24 h-72 w-72 rounded-full bg-[rgba(255,255,255,0.1)] blur-3xl" />
        <div className="absolute right-[-80px] top-32 h-80 w-80 rounded-full bg-[#f4d18c]/20 blur-3xl" />

        <nav className="fixed inset-x-0 top-0 z-40">
          <div className="mx-auto mt-4 flex max-w-7xl items-center justify-between rounded-full border border-[rgba(255,255,255,0.15)] bg-[rgba(15,23,42,0.15)] px-4 py-3 shadow-[0_16px_35px_rgba(15,23,42,0.1)] backdrop-blur-md sm:px-6 lg:px-8">
            <a href="#top" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.12)]">
                <Stethoscope className="h-5 w-5 text-[#ffffff]" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[rgba(255,255,255,0.7)]">
                  Clean Clinical
                </p>
                <p className="text-lg font-semibold tracking-tight text-[#ffffff]">AuraCare</p>
              </div>
            </a>

            <div className="hidden items-center gap-7 lg:flex">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-[rgba(255,255,255,0.9)] transition hover:text-[#ffffff]"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <a
              href="#ai-consult"
              className="hidden rounded-full bg-[#ffffff] px-5 py-2.5 text-sm font-semibold text-[#406958] shadow-sm transition hover:-translate-y-0.5 lg:inline-flex"
            >
              Tư vấn với AI
            </a>
          </div>
        </nav>

        <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-24 pt-32 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-28 lg:pt-40">
          <div className="space-y-7">
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.1)] px-4 py-2 text-sm text-[rgba(255,255,255,0.9)] backdrop-blur">
              <ShieldCheck className="h-4 w-4 text-[#ffffff]" />
              Prototype thương mại điện tử sức khỏe với trải nghiệm khám phá ưu tiên AI
            </div>

            <div className="space-y-5">
              <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-[#ffffff] sm:text-5xl lg:text-[3.7rem]">
                Website sức khỏe được thiết kế lại để tìm kiếm thông minh hơn, đáng tin hơn và được hướng dẫn tốt hơn.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[rgba(255,255,255,0.86)] sm:text-lg">
                Dựa trên nhịp bố cục của template bạn cung cấp, homepage này được thiết kế lại thành một storefront
                hiện đại cho supplement và skincare, nơi AI hỗ trợ người dùng tìm đúng sản phẩm nhanh hơn và hiểu sản
                phẩm tốt hơn.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="#deals"
                className="inline-flex items-center rounded-2xl bg-[#ffffff] px-5 py-3 text-sm font-semibold text-[#406958] shadow-sm transition hover:-translate-y-0.5"
              >
                Xem sản phẩm nổi bật
              </a>
              <a
                href="#categories"
                className="inline-flex items-center rounded-2xl border border-[rgba(255,255,255,0.45)] px-5 py-3 text-sm font-semibold text-[#ffffff] transition hover:bg-[rgba(255,255,255,0.1)]"
              >
                Khám phá danh mục
              </a>
            </div>

            <div className="flex flex-wrap gap-3">
              {heroSignals.map((signal) => (
                <span
                  key={signal}
                  className="rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.1)] px-4 py-2 text-sm text-[rgba(255,255,255,0.9)]"
                >
                  {signal}
                </span>
              ))}
            </div>

            <div className="inline-flex items-center gap-3 rounded-3xl bg-[rgba(255,255,255,0.12)] px-5 py-4 backdrop-blur-sm">
              <span className="text-2xl font-extrabold text-[#fde7bb]">4.9★</span>
              <span className="max-w-xs text-sm text-[rgba(255,255,255,0.9)]">
                Trải nghiệm tham chiếu cho một luồng khám phá sản phẩm bình tĩnh hơn và đáng tin cậy hơn
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[560px]">
            <div className="absolute -left-10 top-14 h-40 w-40 rounded-full bg-[rgba(255,255,255,0.12)] blur-3xl" />
            <div className="absolute -right-6 top-6 h-44 w-44 rounded-full bg-[rgba(244,209,140,0.2)] blur-3xl" />

            <div className="relative overflow-hidden rounded-[36px] border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.14)] p-5 shadow-[0_24px_60px_rgba(15,23,42,0.16)] backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between rounded-[24px] bg-[rgba(255,255,255,0.15)] px-4 py-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgba(255,255,255,0.68)]">
                    Xem trước tìm kiếm AI
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#ffffff]">
                    &quot;vitamin cho người thiếu năng lượng và skincare cho da thiếu ẩm&quot;
                  </p>
                </div>
                <div className="rounded-full bg-[#f4d18c] px-3 py-1 text-xs font-bold text-[#5d4724]">
                  Giai đoạn 1
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {heroProducts.map((product) => (
                  <div
                    key={product.id}
                    className="overflow-hidden rounded-[28px] bg-[#ffffff] shadow-[0_18px_35px_rgba(15,23,42,0.1)]"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-[linear-gradient(180deg,#f6fbf8_0%,#edf5f1_100%)]">
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="space-y-3 p-4">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-[#edf4f1] px-3 py-1 text-xs font-semibold text-[#5b8c7a]">
                          {getCategoryLabel(product.category)}
                        </span>
                        <span className="text-xs font-semibold text-[#64748b]">{getBadgeLabel(product.badge)}</span>
                      </div>
                      <h3 className="line-clamp-2 text-base font-bold leading-6 text-[#0f172a]">{product.name}</h3>
                      <p className="line-clamp-2 text-sm leading-6 text-[#475569]">{product.shortDescription}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[22px] bg-[rgba(255,255,255,0.14)] px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgba(255,255,255,0.68)]">
                    Match by concern
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#ffffff]">thiếu ẩm, giấc ngủ, miễn dịch</p>
                </div>
                <div className="rounded-[22px] bg-[rgba(255,255,255,0.14)] px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgba(255,255,255,0.68)]">
                    Giải thích thành phần
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#ffffff]">nội dung dễ hiểu</p>
                </div>
                <div className="rounded-[22px] bg-[rgba(255,255,255,0.14)] px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgba(255,255,255,0.68)]">
                    Xếp hạng ngữ nghĩa
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#ffffff]">tốt hơn tìm từ khóa đơn thuần</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </header>

      <main className="pb-20">
        <section className="mx-auto -mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-[#d8e3dc] bg-[#ffffff] px-5 py-5 shadow-[0_20px_40px_rgba(15,23,42,0.08)]">
            <div className="grid gap-4 md:grid-cols-[1.1fr_1.1fr_1fr_1fr_auto]">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#334155]">Nhu cầu</label>
                <input
                  className="h-12 w-full rounded-2xl border border-[#d7e5df] bg-[#fbfcfa] px-4 text-sm text-[#334155] outline-none transition focus:border-[#5b8c7a]"
                  placeholder="thiếu ẩm, miễn dịch, mụn..."
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#334155]">Từ khóa</label>
                <input
                  className="h-12 w-full rounded-2xl border border-[#d7e5df] bg-[#fbfcfa] px-4 text-sm text-[#334155] outline-none transition focus:border-[#5b8c7a]"
                  placeholder="thành phần, triệu chứng, công dụng"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#334155]">Danh mục</label>
                <select className="h-12 w-full rounded-2xl border border-[#d7e5df] bg-[#fbfcfa] px-4 text-sm text-[#334155] outline-none transition focus:border-[#5b8c7a]">
                  <option>Tất cả sản phẩm</option>
                  <option>Thực phẩm bổ sung</option>
                  <option>Chăm sóc da</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#334155]">Ngân sách</label>
                <input
                  className="h-12 w-full rounded-2xl border border-[#d7e5df] bg-[#fbfcfa] px-4 text-sm text-[#334155] outline-none transition focus:border-[#5b8c7a]"
                  placeholder="Dưới 500.000đ"
                />
              </div>
              <div className="flex items-end">
                <button className="inline-flex h-12 items-center justify-center rounded-full bg-[#5b8c7a] px-6 text-sm font-semibold text-[#ffffff] transition hover:-translate-y-0.5 hover:bg-[#4e7a69]">
                  Tìm với AI
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((item, index) => {
              const Icon = featureIcons[index % featureIcons.length];

              return (
                <div
                  key={item.title}
                  className="rounded-[28px] border border-[#dce6df] bg-[#ffffff] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition hover:-translate-y-1"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf4f1] text-[#5b8c7a]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold text-[#0f172a]">{item.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-[#475569]">{item.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section id="categories" className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5b8c7a]">Danh mục</span>
              <h2 className="mt-2 text-3xl font-bold text-[#0f172a] sm:text-4xl">
                Danh mục được tối ưu để AI gợi ý tốt hơn
              </h2>
            </div>
            <a href="#ai-consult" className="inline-flex items-center text-sm font-semibold text-[#5b8c7a]">
              Cách AI sử dụng dữ liệu này
              <ChevronRight className="ml-1 h-4 w-4" />
            </a>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {storefrontCategories.map((category) => {
              const isSupplement = category.id === "supplement";
              const Icon = isSupplement ? Pill : FlaskConical;

              return (
                <div
                  key={category.id}
                  className="overflow-hidden rounded-[32px] border border-[#d7e5df] bg-[#ffffff] shadow-[0_12px_30px_rgba(15,23,42,0.05)]"
                >
                  <div
                    className={`relative p-8 ${
                      isSupplement
                        ? "bg-[linear-gradient(135deg,#eff5f1_0%,#f8faf7_100%)]"
                        : "bg-[linear-gradient(135deg,#fff6e8_0%,#fefcf7_100%)]"
                    }`}
                  >
                    <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-[rgba(255,255,255,0.4)] blur-2xl" />
                    <div className="relative flex items-start justify-between gap-5">
                      <div>
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(255,255,255,0.8)] text-[#5b8c7a] shadow-sm">
                          <Icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-[#0f172a]">{category.label}</h3>
                        <p className="mt-3 max-w-md text-sm leading-7 text-[#475569]">{category.description}</p>
                      </div>
                      <div className="rounded-full bg-[#ffffff] px-4 py-2 text-sm font-semibold text-[#334155] shadow-sm">
                        {category.itemCount} sản phẩm
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 px-8 py-5 text-sm text-[#475569]">
                    <span className="rounded-full bg-[#edf4f1] px-3 py-1 text-[#5b8c7a]">
                      {isSupplement ? "năng lượng, giấc ngủ, miễn dịch" : "thiếu ẩm, hàng rào da, mụn"}
                    </span>
                    <span className="rounded-full bg-[#f7f2e6] px-3 py-1 text-[#9a6a1d]">
                      {isSupplement ? "chăm sóc hằng ngày" : "hỗ trợ làn da"}
                    </span>
                    <Link href={`/categories/${category.id}`} className="ml-auto inline-flex items-center font-semibold text-[#5b8c7a]">
                      Xem danh mục
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[32px] bg-[linear-gradient(160deg,#1f3a31_0%,#375c4f_100%)] p-8 text-[#ffffff] shadow-[0_22px_45px_rgba(31,58,49,0.18)] sm:p-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.08)] px-4 py-2 text-sm text-[rgba(255,255,255,0.8)]">
                <ShieldCheck className="h-4 w-4" />
                Vì sao là AuraCare
              </span>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-[#ffffff] sm:text-4xl">
                Một giao diện thương mại điện tử sức khỏe được xây quanh sự rõ ràng, tin cậy và khả năng giải thích của AI.
              </h2>
              <p className="mt-4 text-base leading-8 text-[rgba(255,255,255,0.82)]">
                Phần này không còn dùng ảnh nha khoa nữa. Thay vào đó, nó giải thích đúng lợi thế của AuraCare: dữ
                liệu sản phẩm có cấu trúc, giao diện thương mại điện tử sạch, và một lớp AI có thể giải thích được.
              </p>

              <div className="mt-7 space-y-4">
                {trustPoints.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[24px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.08)] p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[rgba(255,255,255,0.12)] text-[#f4d18c]">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[#ffffff]">{item.title}</h3>
                        <p className="mt-2 text-sm leading-7 text-[rgba(255,255,255,0.78)]">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-[#d7e5df] bg-[#ffffff] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.05)] sm:p-8">
              <div className="grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-[28px] bg-[linear-gradient(160deg,#f3f8f5_0%,#ebf3ef_100%)] p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5b8c7a]">DNA storefront</p>
                  <h3 className="mt-3 text-2xl font-bold text-[#0f172a]">Đây không còn là template nha khoa thay chữ một cách cơ học.</h3>
                  <p className="mt-3 text-sm leading-7 text-[#475569]">
                    Homepage hiện được tổ chức như một storefront sức khỏe hiện đại: tìm kiếm theo nhu cầu, duyệt theo
                    danh mục, ưu đãi nổi bật, tư vấn AI và nội dung giáo dục sản phẩm.
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-[#ffffff] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">Sẵn sàng dữ liệu</p>
                      <p className="mt-2 text-sm font-semibold text-[#0f172a]">Concern tags + benefit tags + cảnh báo</p>
                    </div>
                    <div className="rounded-2xl bg-[#ffffff] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">Sẵn sàng AI</p>
                      <p className="mt-2 text-sm font-semibold text-[#0f172a]">Semantic search + gợi ý có thể giải thích</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="overflow-hidden rounded-[28px] bg-[#f7faf8] shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                    <img
                      src={supplementProducts[1].image}
                      alt={supplementProducts[1].name}
                      className="h-48 w-full object-cover"
                    />
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-[#edf4f1] px-3 py-1 text-xs font-semibold text-[#5b8c7a]">
                          thực phẩm bổ sung
                        </span>
                        <span className="text-xs font-semibold text-[#64748b]">truy vấn có chủ đích</span>
                      </div>
                      <p className="mt-3 text-base font-bold leading-7 text-[#0f172a]">
                        Người dùng có thể khám phá sản phẩm theo nhu cầu, không chỉ theo tên SKU.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-[#e3ece7] bg-[#ffffff] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">Hướng nghiên cứu</p>
                    <p className="mt-2 text-sm leading-7 text-[#475569]">
                      AuraCare tập trung vào UX thương mại điện tử có AI hỗ trợ, không chỉ dừng ở việc tham khảo giao diện.
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                      <img src="/prime-dental/pro.jpg" alt="Project owner" className="h-11 w-11 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold text-[#0f172a]">Định hướng AuraCare</p>
                        <p className="text-sm text-[#64748b]">Prototype thương mại điện tử sức khỏe tích hợp AI</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="deals" className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[40px] border border-[#d8e3dc] bg-[#ffffff] shadow-[0_24px_48px_rgba(15,23,42,0.08)]">
            <div className="grid gap-0 xl:grid-cols-[0.92fr_1.08fr]">
              <div className="bg-[linear-gradient(160deg,#214034_0%,#497562_58%,#88aa9c_100%)] p-8 text-[#ffffff] sm:p-10">
                <span className="inline-flex items-center rounded-full border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.1)] px-4 py-2 text-sm font-semibold text-[rgba(255,255,255,0.84)]">
                  Khu ưu đãi nổi bật
                </span>
                <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
                  Một bề mặt bán hàng cao cấp hơn nhưng vẫn giữ được cảm giác sạch và đáng tin.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-8 text-[rgba(255,255,255,0.82)] sm:text-base">
                  Thay vì chỉ đặt một grid sản phẩm trên nền xanh, khối này giờ có cấu trúc giống storefront thật hơn:
                  ưu đãi nổi bật, chỉ số tiết kiệm, và lối vào rõ ràng sang các trang danh mục và sản phẩm.
                </p>

                <div className="mt-7 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[24px] bg-[rgba(255,255,255,0.1)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgba(255,255,255,0.66)]">
                      Mức tiết kiệm
                    </p>
                    <p className="mt-2 text-3xl font-bold text-[#ffffff]">32%</p>
                  </div>
                  <div className="rounded-[24px] bg-[rgba(255,255,255,0.1)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgba(255,255,255,0.66)]">
                      Nhóm nổi bật
                    </p>
                    <p className="mt-2 text-base font-semibold text-[#ffffff]">Thiếu ẩm, năng lượng, phục hồi da</p>
                  </div>
                  <div className="rounded-[24px] bg-[rgba(255,255,255,0.1)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgba(255,255,255,0.66)]">
                      Chế độ AI
                    </p>
                    <p className="mt-2 text-base font-semibold text-[#ffffff]">Giải thích vì sao các deal này phù hợp</p>
                  </div>
                </div>

                <div className="mt-7 rounded-[28px] bg-[rgba(255,255,255,0.1)] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgba(255,255,255,0.66)]">
                    Deal tiêu biểu
                  </p>
                  <div className="mt-3 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-[#ffffff]">{flashDealProducts[0].name}</p>
                      <p className="mt-2 text-sm leading-7 text-[rgba(255,255,255,0.8)]">
                        {flashDealProducts[0].shortDescription}
                      </p>
                    </div>
                    <div className="shrink-0 rounded-2xl bg-[#f4d18c] px-4 py-3 text-right text-[#5d4724]">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em]">Giá hiện tại</p>
                      <p className="mt-1 text-lg font-bold">{formatMockPrice(flashDealProducts[0].price)}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href={`/products/${flashDealProducts[0].slug}`}
                    className="inline-flex items-center rounded-2xl bg-[#ffffff] px-5 py-3 text-sm font-semibold text-[#2d5244] transition hover:-translate-y-0.5"
                  >
                    Mở deal nổi bật
                  </Link>
                  <Link
                    href="/categories/supplement"
                    className="inline-flex items-center rounded-2xl border border-[rgba(255,255,255,0.35)] px-5 py-3 text-sm font-semibold text-[#ffffff] transition hover:bg-[rgba(255,255,255,0.08)]"
                  >
                    Xem danh mục
                  </Link>
                </div>
              </div>

              <div className="bg-[#f9fbfa] p-6 sm:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5b8c7a]">Danh sách ưu đãi</p>
                    <h3 className="mt-2 text-2xl font-bold text-[#0f172a]">Các sản phẩm nổi bật đã sẵn sàng cho trang chi tiết</h3>
                  </div>
                  <Link href="/categories/skincare" className="text-sm font-semibold text-[#5b8c7a]">
                    Xem tất cả
                  </Link>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  {flashDealProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#eef4f0] py-14">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 text-center sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
            {stats.map((item) => (
              <div key={item.label} className="rounded-[28px] bg-[#ffffff] p-7 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
                <item.icon className="mx-auto mb-4 h-10 w-10 text-[#5b8c7a]" />
                <p className="text-4xl font-extrabold text-[#0f172a]">{item.value}</p>
                <p className="mt-2 text-sm text-[#475569]">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="ai-consult" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="rounded-[32px] bg-[linear-gradient(160deg,#163128_0%,#2f5547_100%)] p-8 text-[#ffffff] shadow-[0_20px_40px_rgba(22,49,40,0.18)] sm:p-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.1)] px-4 py-2 text-sm text-[rgba(255,255,255,0.8)]">
                <Bot className="h-4 w-4" />
                Bề mặt AI tư vấn
              </span>
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Hỗ trợ mua sắm bằng ngôn ngữ tự nhiên, được thiết kế ngay từ đầu.</h2>
              <p className="mt-4 text-sm leading-8 text-[rgba(255,255,255,0.8)] sm:text-base">
                Khu vực này mô phỏng cách AuraCare AI sẽ xuất hiện trong storefront: không quá phô trương, nhưng luôn
                sẵn sàng giải thích ingredient, gợi ý sản phẩm, và trả lời các câu hỏi discovery phức tạp.
              </p>

              <div className="mt-6 space-y-3">
                {aiHighlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="flex items-center gap-3 rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.08)] px-4 py-3 text-sm text-[rgba(255,255,255,0.9)]"
                  >
                    <BadgeCheck className="h-4 w-4 text-[#f4d18c]" />
                    {highlight}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-[#d7e5df] bg-[#ffffff] p-8 shadow-[0_12px_30px_rgba(15,23,42,0.05)] sm:p-10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5b8c7a]">Tìm kiếm ngữ nghĩa</span>
                  <h3 className="mt-2 text-3xl font-bold text-[#0f172a]">Ô tìm kiếm hiểu nhu cầu, không chỉ hiểu từ khóa</h3>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf4f1] text-[#5b8c7a]">
                  <ScanSearch className="h-7 w-7" />
                </div>
              </div>

              <div className="mt-6 rounded-[28px] bg-[#f7faf8] p-5">
                <div className="rounded-2xl border border-[#d7e5df] bg-[#ffffff] px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#94a3b8]">Ví dụ truy vấn</p>
                  <p className="mt-2 text-base font-semibold text-[#0f172a]">
                    &quot;skincare dịu nhẹ cho da nhạy cảm thiếu ẩm, ít hương liệu&quot;
                  </p>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-[#ffffff] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">Bước 1</p>
                    <p className="mt-2 text-sm font-semibold text-[#0f172a]">Gemini embedding</p>
                    <p className="mt-2 text-sm leading-6 text-[#475569]">Chuyển truy vấn của người dùng thành vector ngữ nghĩa.</p>
                  </div>
                  <div className="rounded-2xl bg-[#ffffff] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">Bước 2</p>
                    <p className="mt-2 text-sm font-semibold text-[#0f172a]">pgvector matching</p>
                    <p className="mt-2 text-sm leading-6 text-[#475569]">So khớp cosine similarity với embeddings sản phẩm trong Supabase.</p>
                  </div>
                  <div className="rounded-2xl bg-[#ffffff] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">Bước 3</p>
                    <p className="mt-2 text-sm font-semibold text-[#0f172a]">Giải thích kết quả</p>
                    <p className="mt-2 text-sm leading-6 text-[#475569]">Trả về sản phẩm kèm concern tags và lý do gợi ý.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="rounded-[36px] border border-[#d7e5df] bg-[#ffffff] p-6 shadow-[0_16px_34px_rgba(15,23,42,0.06)] sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5b8c7a]">Kệ bổ sung</span>
                  <h2 className="mt-2 text-3xl font-bold text-[#0f172a]">Tổ chức quanh năng lượng, miễn dịch và chăm sóc hằng ngày</h2>
                </div>
                <Link href="/categories/supplement" className="inline-flex items-center text-sm font-semibold text-[#5b8c7a]">
                  Xem danh mục bổ sung
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              <div className="mt-8 grid gap-5 xl:grid-cols-[0.88fr_1.12fr]">
                <div className="rounded-[30px] bg-[linear-gradient(160deg,#eff6f2_0%,#f9fbfa_100%)] p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5b8c7a]">Ý định tìm kiếm</p>
                  <h3 className="mt-3 text-2xl font-bold text-[#0f172a]">Tìm theo nhu cầu, sau đó để AI giải thích thành phần và độ phù hợp.</h3>
                  <p className="mt-3 text-sm leading-7 text-[#475569]">
                    Đây là nhóm lý tưởng cho recommendation rule-based ở phase đầu, vì các tag như energy, sleep,
                    immunity và daily wellness đủ rõ để AI gợi ý mà vẫn dễ giải thích.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {["hỗ trợ năng lượng", "cân bằng giấc ngủ", "hỗ trợ miễn dịch", "đẹp từ bên trong"].map((tag) => (
                      <span key={tag} className="rounded-full bg-[#ffffff] px-3 py-2 text-xs font-semibold text-[#4f7c6d] shadow-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {supplementProducts.slice(0, 3).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[36px] border border-[#eadfcb] bg-[#fffaf3] p-6 shadow-[0_16px_34px_rgba(15,23,42,0.05)] sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b88530]">Kệ chăm sóc da</span>
                  <h2 className="mt-2 text-3xl font-bold text-[#0f172a]">Tối ưu cho thiếu ẩm, phục hồi hàng rào da và nội dung dễ hiểu hơn</h2>
                </div>
                <Link href="/categories/skincare" className="inline-flex items-center text-sm font-semibold text-[#b88530]">
                  Xem danh mục chăm sóc da
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              <div className="mt-8 grid gap-5 xl:grid-cols-[1.12fr_0.88fr]">
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {skincareProducts.slice(0, 3).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                <div className="rounded-[30px] bg-[#ffffff] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b88530]">Ghi chú trải nghiệm</p>
                  <h3 className="mt-3 text-2xl font-bold text-[#0f172a]">Một kệ sản phẩm nhẹ nhàng hơn cho người dùng muốn ít lời hứa quá mức và hướng dẫn rõ hơn.</h3>
                  <p className="mt-3 text-sm leading-7 text-[#475569]">
                    Skincare là nơi semantic search thể hiện rõ nhất vì người dùng thường mô tả bằng nhu cầu như
                    &quot;dehydrated sensitive skin&quot; thay vì biết sẵn tên hoạt chất hoặc SKU.
                  </p>
                  <div className="mt-6 space-y-3">
                    {["dưỡng ẩm hàng rào da", "làm dịu đỏ da", "hỗ trợ da mụn", "bảo vệ chống nắng"].map((tag) => (
                      <div key={tag} className="rounded-2xl border border-[#f0e5d2] bg-[#fffaf3] px-4 py-3 text-sm font-semibold text-[#7b5a23]">
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="knowledge" className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5b8c7a]">Kho kiến thức</span>
              <h2 className="mt-2 text-3xl font-bold text-[#0f172a] sm:text-4xl">
                Nội dung biên tập giúp tăng độ tin cậy và hỗ trợ truy xuất thông tin
              </h2>
            </div>
            <a href="#top" className="inline-flex items-center text-sm font-semibold text-[#5b8c7a]">
              Xem thêm bài viết
              <ChevronRight className="ml-1 h-4 w-4" />
            </a>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {mockArticles.map((article, index) => (
              <article
                key={article.id}
                className="overflow-hidden rounded-[28px] border border-[#d7e5df] bg-[#ffffff] shadow-[0_12px_30px_rgba(15,23,42,0.05)]"
              >
                <img
                  src={`/prime-dental/blog${(index % 4) + 1}.jpg`}
                  alt={article.title}
                  className="h-52 w-full object-cover"
                />
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5b8c7a]">{article.category}</p>
                  <h3 className="mt-3 text-xl font-bold leading-8 text-[#0f172a]">{article.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#475569]">{article.excerpt}</p>
                  <a href="#top" className="mt-4 inline-flex items-center text-sm font-semibold text-[#5b8c7a]">
                    Đọc bài viết
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5b8c7a]">FAQ</span>
            <h2 className="mt-2 text-3xl font-bold text-[#0f172a] sm:text-4xl">Câu hỏi thường gặp về dự án</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#475569] sm:text-base">
              Khối này giữ đúng tinh thần FAQ trong template, nhưng nội dung đã chuyển sang giải thích chiến lược xây
              dựng storefront và AI layer của AuraCare.
            </p>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <details
                key={item.question}
                open={index === 0}
                className="overflow-hidden rounded-[20px] border border-[#d7e5df] bg-[#ffffff] shadow-[0_12px_30px_rgba(15,23,42,0.05)]"
              >
                <summary className="cursor-pointer list-none bg-[#f6faf7] px-5 py-4 text-base font-semibold text-[#0f172a]">
                  {item.question}
                </summary>
                <div className="px-5 py-4 text-sm leading-7 text-[#475569]">{item.answer}</div>
              </details>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-5 rounded-[32px] bg-[linear-gradient(135deg,#273f35_0%,#4f7c6d_100%)] px-8 py-8 text-[#ffffff] md:flex-row md:items-center">
            <div className="max-w-2xl">
              <h3 className="text-2xl font-bold">Nền tảng homepage đã sẵn sàng cho các màn ecommerce tiếp theo</h3>
              <p className="mt-2 text-sm leading-7 text-[rgba(255,255,255,0.8)]">
                Từ giao diện này, bước tiếp theo rất hợp lý là dựng category page, product detail page, và khung semantic search result page để toàn bộ storefront đồng nhất.
              </p>
            </div>
            <a
              href="#categories"
              className="inline-flex items-center rounded-full bg-[#ffffff] px-6 py-3 text-sm font-bold text-[#355647] transition hover:-translate-y-0.5"
            >
              Khám phá danh mục
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </section>
      </main>

      <footer className="mt-8 bg-[#f1efe7] py-12">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.7fr_0.9fr_0.9fr] lg:px-8">
          <div>
            <h4 className="text-lg font-bold text-[#0f172a]">Nhận cập nhật từ AuraCare</h4>
            <p className="mt-3 max-w-sm text-sm leading-7 text-[#475569]">
              Theo dõi dự án khi storefront này tiếp tục phát triển thành một nền tảng nghiên cứu thương mại điện tử sức khỏe có AI hỗ trợ.
            </p>
            <div className="mt-4 flex gap-2">
              <input
                className="h-11 flex-1 rounded-xl border border-[#d7e5df] bg-[#ffffff] px-4 text-sm outline-none"
                placeholder="Nhập email của bạn"
              />
              <button className="rounded-xl bg-[#5b8c7a] px-5 text-sm font-semibold text-[#ffffff]">Đăng ký</button>
            </div>
          </div>

          <div>
            <h5 className="mb-3 font-bold text-[#0f172a]">Điều hướng</h5>
            <div className="space-y-2 text-sm text-[#475569]">
              {navItems.map((item) => (
                <a key={item.label} href={item.href} className="block hover:text-[#5b8c7a]">
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h5 className="mb-3 font-bold text-[#0f172a]">Phạm vi giai đoạn 1</h5>
            <div className="space-y-3 text-sm text-[#475569]">
              <p className="flex items-start gap-2">
                <Leaf className="mt-0.5 h-4 w-4 text-[#5b8c7a]" />
                Chỉ tập trung bổ sung và chăm sóc da
              </p>
              <p className="flex items-start gap-2">
                <Bot className="mt-0.5 h-4 w-4 text-[#5b8c7a]" />
                Chatbot + gợi ý sản phẩm
              </p>
              <p className="flex items-start gap-2">
                <ScanSearch className="mt-0.5 h-4 w-4 text-[#5b8c7a]" />
                Tìm kiếm ngữ nghĩa với pgvector
              </p>
            </div>
          </div>

          <div>
            <h5 className="mb-3 font-bold text-[#0f172a]">Ghi chú dự án</h5>
            <div className="space-y-3 text-sm text-[#475569]">
              <p className="flex items-start gap-2">
                <MessageSquareQuote className="mt-0.5 h-4 w-4 text-[#5b8c7a]" />
                Prototype học thuật về ecommerce và AI
              </p>
              <p className="flex items-start gap-2">
                <CalendarDays className="mt-0.5 h-4 w-4 text-[#5b8c7a]" />
                Giai đoạn hiện tại: hoàn thiện storefront shell
              </p>
              <p className="flex items-start gap-2">
                <Star className="mt-0.5 h-4 w-4 text-[#5b8c7a]" />
                Lấy cảm hứng từ template nhưng được dựng lại cho AuraCare
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
