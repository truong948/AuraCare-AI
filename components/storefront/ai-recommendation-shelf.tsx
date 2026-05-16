"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Bot } from "lucide-react";
import { ProductCard } from "@/components/storefront/product-card";
import type { RecommendationItem } from "@/lib/ai/types";

type RecommendationAnalyticsContext = {
  signalBreakdown?: Record<string, { count: number; weight: number }>;
  signalSummary?: string[];
};

export function AiRecommendationShelf({
  title,
  description,
  items,
  href,
  hrefLabel,
  surface = "generic-shelf",
  analyticsContext,
}: {
  title: string;
  description: string;
  items: RecommendationItem[];
  href?: string;
  hrefLabel?: string;
  surface?: string;
  analyticsContext?: RecommendationAnalyticsContext;
}) {
  const hasLoggedImpression = useRef(false);

  useEffect(() => {
    if (items.length === 0 || hasLoggedImpression.current) return;
    hasLoggedImpression.current = true;

    void fetch("/api/ai/recommendations/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "impression",
        surface,
        title,
        productSlugs: items.map((item) => item.product.slug),
        ...analyticsContext,
      }),
    });
  }, [analyticsContext, items, surface, title]);

  function handleProductOpen(productSlug: string) {
    void fetch("/api/ai/recommendations/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "click",
        surface,
        title,
        productSlug,
        ...analyticsContext,
      }),
    });
  }

  if (items.length === 0) return null;

  return (
    <section className="rounded-[36px] border border-[#d7e5df] bg-white p-6 shadow-[0_16px_34px_rgba(15,23,42,0.05)] sm:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#edf4f1] text-[#5b8c7a]">
              <Bot className="h-5 w-5" />
            </span>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5b8c7a]">AI Recommendation</p>
          </div>
          <h2 className="mt-3 text-3xl font-bold text-[#0f172a]">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[#475569]">{description}</p>
        </div>
        {href && hrefLabel ? (
          <Link href={href} className="inline-flex items-center text-sm font-semibold text-[#5b8c7a]">
            {hrefLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        ) : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <div key={item.product.id} className="space-y-3">
            <ProductCard product={item.product} onProductOpen={handleProductOpen} />
            <div className="rounded-[22px] bg-[#f8fbfa] px-4 py-3 text-sm text-[#475569]">
              <span className="font-semibold text-[#0f172a]">Vì sao được gợi ý:</span> {item.reason}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
