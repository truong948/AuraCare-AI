import { NextResponse } from "next/server";
import { logSearchEvent } from "@/lib/ai/logging";
import { runSemanticSearch } from "@/lib/ai/search";
import type { ProductCategory } from "@/lib/mock-data/catalog";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const query = typeof body.query === "string" ? body.query : "";
  const category =
    body.category === "supplement" || body.category === "skincare"
      ? (body.category as ProductCategory)
      : undefined;
  const limit = typeof body.limit === "number" ? body.limit : 8;

  if (!query.trim()) {
    return NextResponse.json({ error: "query is required" }, { status: 400 });
  }

  try {
    const result = await runSemanticSearch({ query, category, limit });
    await logSearchEvent({
      query,
      normalizedQuery: result.normalizedQuery,
      category: category ?? "all",
      source: result.source,
      resultCount: result.results.length,
      topSlugs: result.results.slice(0, 5).map((item) => item.product.slug),
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Không thể chạy semantic search.",
      },
      { status: 500 }
    );
  }
}
