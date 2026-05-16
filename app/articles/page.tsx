import Link from "next/link";
import { ArrowRight, BookOpenText } from "lucide-react";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { StorefrontHeader } from "@/components/storefront/storefront-header";
import { mockArticles } from "@/lib/mock-data/catalog";

export default function ArticlesPage() {
  return (
    <div className="min-h-screen bg-[#f6f4ee] text-[#0f172a]">
      <StorefrontHeader />

      <main>
        <section className="border-b border-[#dce6df] bg-[#ffffff]">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="rounded-[36px] border border-[#dce6df] bg-[linear-gradient(160deg,#eff6f2_0%,#f9fbfa_100%)] p-8 shadow-[0_16px_34px_rgba(15,23,42,0.05)] sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5b8c7a]">Kho kiến thức</p>
              <h1 className="mt-3 text-4xl font-bold leading-tight text-[#0f172a] sm:text-5xl">
                Một trang riêng cho bài viết thay vì chỉ đặt dưới homepage
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-8 text-[#475569] sm:text-base">
                Trang này biến phần article từ homepage thành một khu nội dung thật sự, giúp website có cấu trúc rõ hơn
                và hỗ trợ AI tốt hơn bằng việc duy trì lớp kiến thức biên tập riêng.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
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
                  <div className="flex items-center gap-2 text-[#5b8c7a]">
                    <BookOpenText className="h-4 w-4" />
                    <p className="text-xs font-semibold uppercase tracking-[0.2em]">{article.category}</p>
                  </div>
                  <h2 className="mt-3 text-xl font-bold leading-8 text-[#0f172a]">{article.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-[#475569]">{article.excerpt}</p>
                  <Link href={`/articles/${article.slug}`} className="mt-4 inline-flex items-center text-sm font-semibold text-[#5b8c7a]">
                    Đọc bài viết
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <StorefrontFooter />
    </div>
  );
}
