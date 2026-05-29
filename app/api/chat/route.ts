import { NextResponse } from "next/server";
import { runChatAssistant } from "@/lib/ai/chat";
import { logChatEvent } from "@/lib/ai/logging";
import type { ProductCategory } from "@/lib/mock-data/catalog";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const message = typeof body.message === "string" ? body.message : "";
  const productSlug = typeof body.productSlug === "string" ? body.productSlug : undefined;
  const history = Array.isArray(body.history) ? body.history : [];
  const imageBase64 = typeof body.imageBase64 === "string" ? body.imageBase64 : undefined;
  const category =
    body.category === "supplement" || body.category === "skincare"
      ? (body.category as ProductCategory)
      : undefined;

  if (!message.trim() && !imageBase64) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  try {
    const result = await runChatAssistant({ message, history, productSlug, category, imageBase64 });
    await logChatEvent({
      message,
      productSlug: productSlug ?? null,
      category: category ?? null,
      source: result.source,
      suggestionSlugs: result.suggestions.map((item) => item.product.slug),
      handoffSummary: result.handoffSummary,
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Không thể tạo phản hồi từ chatbot.",
      },
      { status: 500 }
    );
  }
}
