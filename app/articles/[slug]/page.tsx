import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpenText } from "lucide-react";
import { notFound } from "next/navigation";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { StorefrontHeader } from "@/components/storefront/storefront-header";
import { getArticleBySlug, mockArticles } from "@/lib/mock-data/catalog";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = mockArticles.filter((item) => item.slug !== article.slug).slice(0, 2);

  return (
    <div className="min-h-screen bg-[#f6f4ee] text-[#0f172a]">
      <StorefrontHeader />

      <main>
        <section className="border-b border-[#dce6df] bg-[#ffffff]">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
            <Link href="/#knowledge" className="inline-flex items-center text-sm font-semibold text-[#5b8c7a]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại kho kiến thức
            </Link>

            <div className="mt-6 rounded-[36px] border border-[#dce6df] bg-[linear-gradient(160deg,#eff6f2_0%,#f9fbfa_100%)] p-8 shadow-[0_16px_34px_rgba(15,23,42,0.05)] sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#5b8c7a]">{article.category}</p>
              <h1 className="mt-3 text-4xl font-bold leading-tight text-[#0f172a] sm:text-5xl">{article.title}</h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-[#475569]">{article.excerpt}</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-[#d7e5df] bg-[#ffffff] p-8 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
            <div className="mb-6 flex items-center gap-3 text-[#0f172a]">
              <BookOpenText className="h-5 w-5 text-[#5b8c7a]" />
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5b8c7a]">Nội dung bài viết</p>
            </div>

            <div className="space-y-5 text-base leading-8 text-[#334155]">
              {article.content.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="mt-10 rounded-[32px] border border-[#d7e5df] bg-[#ffffff] p-8 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5b8c7a]">Đọc tiếp</p>
                <h2 className="mt-2 text-3xl font-bold text-[#0f172a]">Bài viết liên quan</h2>
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {relatedArticles.map((relatedArticle) => (
                <article
                  key={relatedArticle.slug}
                  className="rounded-[28px] border border-[#d7e5df] bg-[#f8fbfa] p-6"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5b8c7a]">{relatedArticle.category}</p>
                  <h3 className="mt-3 text-xl font-bold leading-8 text-[#0f172a]">{relatedArticle.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#475569]">{relatedArticle.excerpt}</p>
                  <Link
                    href={`/articles/${relatedArticle.slug}`}
                    className="mt-4 inline-flex items-center text-sm font-semibold text-[#5b8c7a]"
                  >
                    Mở bài viết
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <StorefrontFooter />
    </div>
  );
}
