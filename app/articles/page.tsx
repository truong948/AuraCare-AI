import Link from "next/link";
import { ArrowRight, BookOpenText } from "lucide-react";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { StorefrontHeader } from "@/components/storefront/storefront-header";
import Parser from "rss-parser";

const parser = new Parser();

async function getHealthNews() {
  const sources = [
    { name: "VnExpress", url: "https://vnexpress.net/rss/suc-khoe.rss" },
    { name: "Tuổi Trẻ", url: "https://tuoitre.vn/rss/suc-khoe.rss" }
  ];

  let allArticles = [];

  for (const source of sources) {
    try {
      const response = await fetch(source.url, { next: { revalidate: 3600 } });
      const xml = await response.text();
      const feed = await parser.parseString(xml);
      
      const articles = feed.items.map(item => {
        let imageUrl = item.enclosure?.url;
        if (!imageUrl && item.content) {
          const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
          if (imgMatch) imageUrl = imgMatch[1];
        }
        
        return {
          id: item.guid || item.link,
          title: item.title,
          excerpt: item.contentSnippet?.slice(0, 150) + "...",
          link: item.link,
          imageUrl: imageUrl || "https://placehold.co/600x400/0d9488/ffffff?text=Health+News",
          source: source.name,
          pubDate: new Date(item.pubDate || new Date())
        };
      });
      
      allArticles = [...allArticles, ...articles];
    } catch (error) {
      console.error(`Error fetching RSS from ${source.name}:`, error);
    }
  }

  return allArticles.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
}

export default async function ArticlesPage() {
  const articles = await getHealthNews();

  return (
    <div className="min-h-screen bg-[#f6f4ee] text-[#0f172a]">
      <StorefrontHeader />

      <main>
        <section className="border-b border-[#dce6df] bg-[#ffffff]">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="rounded-[36px] border border-[#dce6df] bg-[linear-gradient(160deg,#eff6f2_0%,#f9fbfa_100%)] p-8 shadow-[0_16px_34px_rgba(15,23,42,0.05)] sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0d9488]">Tin tức Y tế</p>
              <h1 className="mt-3 text-4xl font-bold leading-tight text-[#0f172a] sm:text-5xl">
                Cập nhật thông tin sức khỏe từ các báo lớn
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-8 text-[#475569] sm:text-base">
                Tổng hợp các bài viết y khoa, lời khuyên chăm sóc sức khỏe và thông tin dịch bệnh mới nhất từ VnExpress, Tuổi Trẻ và các nguồn uy tín khác.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {articles.map((article) => (
              <a
                key={article.id}
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col overflow-hidden rounded-[28px] border border-[#d7e5df] bg-[#ffffff] shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition-all hover:shadow-[0_20px_40px_rgba(13,148,136,0.1)] hover:-translate-y-1"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={article.imageUrl}
                    alt={article.title || ""}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#0d9488] shadow-sm backdrop-blur-sm">
                    {article.source}
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-2 text-[#0d9488]">
                    <BookOpenText className="h-4 w-4" />
                    <p className="text-xs font-semibold uppercase tracking-[0.2em]">{article.pubDate.toLocaleDateString('vi-VN')}</p>
                  </div>
                  <h2 className="mt-3 text-xl font-bold leading-8 text-[#0f172a] group-hover:text-[#0d9488] transition-colors line-clamp-3">
                    {article.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[#475569] line-clamp-3 flex-1">
                    {article.excerpt}
                  </p>
                  <div className="mt-6 inline-flex items-center text-sm font-semibold text-[#0d9488]">
                    Đọc toàn bộ
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>

      <StorefrontFooter />
    </div>
  );
}
