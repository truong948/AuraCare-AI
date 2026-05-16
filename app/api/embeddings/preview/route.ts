import { NextResponse } from "next/server";
import { previewProductEmbeddings } from "@/lib/ai/embeddings";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") ?? "5");

  try {
    const previews = await previewProductEmbeddings(limit);
    return NextResponse.json({
      count: previews.length,
      previews,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Không thể tạo embedding preview.",
      },
      { status: 500 }
    );
  }
}
