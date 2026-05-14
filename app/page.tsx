import { ArrowRight, Bot, Boxes, CalendarDays, MessageSquareQuote, SearchCheck, ShieldCheck, Sparkles, Star, Stethoscope } from "lucide-react";
import { ProductCard } from "@/components/storefront/product-card";
import {
  flashDealProducts,
  mockArticles,
  quickActions,
  skincareProducts,
  supplementProducts,
} from "@/lib/mock-data/catalog";

const navItems = ["Home", "Why AuraCare", "Categories", "AI Consult", "Knowledge", "Admin"];

const faqItems = [
  {
    question: "Can AuraCare AI recommend products by concern instead of just keywords?",
    answer:
      "Yes. Phase 1 is designed to support concern-based discovery using tags, semantic search, and product metadata for supplement and skincare items.",
  },
  {
    question: "Will the chatbot replace professional medical advice?",
    answer:
      "No. The chatbot is framed as an educational and shopping support tool, with clear disclaimers and future handoff logic for sensitive situations.",
  },
  {
    question: "Why are supplement and skincare the only categories in Phase 1?",
    answer:
      "They offer the best balance of ecommerce clarity, AI explainability, and manageable legal and operational complexity for an academic prototype.",
  },
  {
    question: "How will semantic search be implemented later?",
    answer:
      "The planned flow is user query to Gemini embedding to pgvector cosine matching inside Supabase, optionally blended with keyword ranking for hybrid search.",
  },
] as const;

const stats = [
  { label: "Mock products", value: "60", icon: Boxes },
  { label: "AI-first surfaces", value: "3", icon: Bot },
  { label: "Search and discovery goals", value: "12+", icon: SearchCheck },
  { label: "Planned research phases", value: "6", icon: Sparkles },
] as const;

function currency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value / 25000);
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f3f4fb] text-slate-950">
      <header className="relative">
        <nav className="fixed inset-x-0 top-0 z-40 bg-transparent">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 shadow-lg shadow-slate-900/10 backdrop-blur">
                <Stethoscope className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/70">
                  Clean Clinical
                </p>
                <p className="text-xl font-semibold tracking-tight">AuraCare</p>
              </div>
            </div>

            <div className="hidden items-center gap-8 lg:flex">
              {navItems.map((item) => (
                <a key={item} href="/" className="text-sm font-medium text-white/90 transition hover:text-white">
                  {item}
                </a>
              ))}
            </div>

            <a
              href="/"
              className="hidden rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#5f50f3] shadow-sm transition hover:-translate-y-0.5 lg:inline-flex"
            >
              Ask Aura AI
            </a>
          </div>
        </nav>

        <section className="overflow-hidden rounded-b-[36px] bg-[linear-gradient(180deg,#4b3df2_0%,#8a7aff_20%,#bfc4ff_45%,#eef0ff_70%,#ffffff_100%)] pt-32 text-white">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-24 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur">
                <ShieldCheck className="h-4 w-4" />
                Research-led health commerce with AI-powered discovery
              </div>

              <div className="max-w-2xl space-y-4">
                <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-[3.6rem]">
                  Smarter supplement and skincare discovery, built for modern health ecommerce.
                </h1>
                <p className="max-w-xl text-base leading-8 text-white/85 sm:text-lg">
                  AuraCare transforms a healthcare storefront into an AI-enhanced shopping experience with semantic
                  search, recommendation-ready data, and cleaner product education from the first screen.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="/"
                  className="inline-flex items-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#4e4bff] shadow-sm transition hover:-translate-y-0.5"
                >
                  Explore products
                </a>
                <a
                  href="/"
                  className="inline-flex items-center rounded-xl border-2 border-white/70 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  See AI features
                </a>
              </div>

              <div className="inline-flex items-center gap-3 rounded-2xl bg-[#8a7aff] px-5 py-3 shadow-sm">
                <span className="text-2xl font-extrabold">4.9★</span>
                <span className="text-sm text-white/90">Projected UX rating for our AI-assisted shopping model</span>
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <img
                src="/prime-dental/heroimg.png"
                alt="AuraCare healthcare illustration"
                className="w-full max-w-[440px] drop-shadow-[0_28px_48px_rgba(36,34,92,0.22)]"
              />
            </div>
          </div>
        </section>
      </header>

      <main className="pb-16">
        <section className="mx-auto -mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[20px] bg-[#f5f6ff] px-5 py-5 shadow-[0_20px_35px_rgba(0,0,0,0.08)]">
            <div className="grid gap-4 md:grid-cols-[1.1fr_1.1fr_1fr_1fr_1.1fr]">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Concern</label>
                <input
                  className="h-11 w-full rounded-2xl border border-[#d8ddff] bg-white px-4 text-sm outline-none"
                  placeholder="hydration, energy, immunity..."
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Keyword</label>
                <input
                  className="h-11 w-full rounded-2xl border border-[#d8ddff] bg-white px-4 text-sm outline-none"
                  placeholder="Search products or ingredients"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Category</label>
                <select className="h-11 w-full rounded-2xl border border-[#d8ddff] bg-white px-4 text-sm outline-none">
                  <option>Supplement</option>
                  <option>Skincare</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Budget</label>
                <input
                  className="h-11 w-full rounded-2xl border border-[#d8ddff] bg-white px-4 text-sm outline-none"
                  placeholder="Under $25"
                />
              </div>
              <div className="flex items-end">
                <button className="h-11 w-full rounded-full bg-[#8a7aff] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5">
                  Search with AI
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {quickActions.slice(0, 3).map((item) => (
              <div key={item.title} className="text-center">
                <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#f0eeff] text-[#8a7aff]">
                  {item.title.includes("AI") ? (
                    <Bot className="h-6 w-6" />
                  ) : item.title.includes("Search") ? (
                    <SearchCheck className="h-6 w-6" />
                  ) : (
                    <ShieldCheck className="h-6 w-6" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
            <div className="overflow-hidden rounded-[24px]">
              <img
                src="/prime-dental/testimonialimg.jpg"
                alt="Clinical trust visual"
                className="h-full min-h-[360px] w-full object-cover"
              />
            </div>

            <div className="flex items-center">
              <div className="space-y-5 px-2 sm:px-4">
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8a7aff]">Why AuraCare</span>
                <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                  A cleaner storefront for health products, built around guidance rather than noise.
                </h2>
                <p className="text-base leading-8 text-slate-600">
                  We are using this template structure because it gives us a confident hero, a floating action bar,
                  strong trust sections, and clear educational blocks. The content, product strategy, and AI layer are
                  all adapted specifically for AuraCare.
                </p>
                <div className="text-4xl text-[#8a7aff]">❝</div>
                <p className="max-w-xl text-slate-600 italic">
                  "The goal is not just to sell products, but to help users discover the right product faster through
                  better structure, better metadata, and better AI."
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src="/prime-dental/pro.jpg"
                    alt="Project owner"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-slate-900">AuraCare Research Direction</p>
                    <p className="text-sm text-slate-500">AI-enhanced commerce blueprint</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8a7aff]">Featured Products</span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Flash deals and best sellers</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Product cards remain part of the ecommerce identity, but the surrounding layout now inherits the calmer,
              more premium rhythm of the imported template.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {flashDealProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="bg-[linear-gradient(135deg,#6b63ff,#a69eff)] py-14 text-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 text-center sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
            {stats.map((item) => (
              <div key={item.label}>
                <item.icon className="mx-auto mb-3 h-9 w-9 text-[#f5f6ff]" />
                <p className="text-4xl font-extrabold text-amber-100">{item.value}</p>
                <p className="mt-2 text-sm text-white/90">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8a7aff]">Category Shelves</span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Supplement and skincare focus</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              We are intentionally keeping Phase 1 narrow so search quality, recommendation quality, and product
              education stay strong.
            </p>
          </div>

          <div className="grid gap-10 xl:grid-cols-2">
            <div>
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-slate-900">Supplement picks</h3>
                <a href="/" className="text-sm font-semibold text-[#8a7aff]">
                  View all
                </a>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {supplementProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>

            <div>
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-slate-900">Skincare picks</h3>
                <a href="/" className="text-sm font-semibold text-[#8a7aff]">
                  View all
                </a>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {skincareProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8a7aff]">Knowledge Hub</span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Latest notes and research-friendly articles</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              We reuse the template's editorial section structure to support both SEO and retrieval content for the AI assistant.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {mockArticles.map((article, index) => (
              <div
                key={article.id}
                className="flex gap-4 rounded-[18px] bg-white p-3 shadow-sm shadow-slate-950/5"
              >
                <img
                  src={`/prime-dental/blog${index + 1}.jpg`}
                  alt={article.title}
                  className="h-[150px] w-[150px] rounded-[12px] object-cover"
                />
                <div className="flex flex-1 flex-col justify-center">
                  <h3 className="text-lg font-bold leading-7 text-slate-900">{article.title}</h3>
                  <p className="mt-1 text-xs text-slate-400">March 2026</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{article.excerpt}</p>
                  <a href="/" className="mt-3 text-sm font-semibold text-[#8a7aff]">
                    Read More →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8a7aff]">FAQ</span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Frequently asked project questions</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              This block mirrors the template's FAQ rhythm while answering the most important strategic questions of this build.
            </p>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <details
                key={item.question}
                open={index === 0}
                className="overflow-hidden rounded-[14px] border border-[#eef1ff] bg-white"
              >
                <summary className="cursor-pointer list-none bg-[#f5f8ff] px-5 py-4 text-base font-semibold text-slate-900">
                  {item.question}
                </summary>
                <div className="px-5 py-4 text-sm leading-7 text-slate-600">{item.answer}</div>
              </details>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-5 rounded-[18px] bg-[linear-gradient(135deg,#6b63ff,#a69eff)] px-8 py-8 text-white md:flex-row md:items-center">
            <div className="max-w-2xl">
              <h3 className="text-2xl font-bold">Ready for the next build step?</h3>
              <p className="mt-2 text-sm leading-7 text-white/85">
                The homepage is now rebuilt using the imported template structure. Next we can apply the same visual language to category listing, product detail, and semantic search results.
              </p>
            </div>
            <a
              href="/"
              className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-bold text-[#4b3df2] transition hover:-translate-y-0.5"
            >
              Build category page
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </section>
      </main>

      <footer className="mt-8 bg-white py-12">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.7fr_0.9fr_0.9fr] lg:px-8">
          <div>
            <h4 className="text-lg font-bold text-slate-900">Subscribe to AuraCare updates</h4>
            <p className="mt-3 max-w-sm text-sm leading-7 text-slate-600">
              Follow the project as we evolve it from a static storefront into an AI-powered health commerce research platform.
            </p>
            <div className="mt-4 flex gap-2">
              <input
                className="h-11 flex-1 rounded-xl border border-slate-200 px-4 text-sm outline-none"
                placeholder="Enter your email"
              />
              <button className="rounded-xl bg-[linear-gradient(135deg,#6b63ff,#4b3df2)] px-5 text-sm font-semibold text-white">
                Subscribe
              </button>
            </div>
          </div>

          <div>
            <h5 className="mb-3 font-bold text-slate-900">Menu</h5>
            <div className="space-y-2 text-sm text-slate-600">
              {navItems.slice(0, 5).map((item) => (
                <a key={item} href="/" className="block hover:text-[#4e4bff]">
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h5 className="mb-3 font-bold text-slate-900">Phase 1 scope</h5>
            <div className="space-y-2 text-sm text-slate-600">
              <p>Supplement</p>
              <p>Skincare</p>
              <p>Chatbot</p>
              <p>Recommendation</p>
              <p>Semantic search</p>
            </div>
          </div>

          <div>
            <h5 className="mb-3 font-bold text-slate-900">Contact</h5>
            <div className="space-y-3 text-sm text-slate-600">
              <p className="flex items-start gap-2">
                <MessageSquareQuote className="mt-0.5 h-4 w-4 text-[#4e4bff]" />
                Academic ecommerce and AI prototype
              </p>
              <p className="flex items-start gap-2">
                <CalendarDays className="mt-0.5 h-4 w-4 text-[#4e4bff]" />
                Current phase: Storefront shell and dataset setup
              </p>
              <p className="flex items-start gap-2">
                <Star className="mt-0.5 h-4 w-4 text-[#4e4bff]" />
                Based on imported template structure, adapted for AuraCare
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
