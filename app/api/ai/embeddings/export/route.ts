import { NextResponse } from "next/server";
import { getEmbeddingCoverage, getEmbeddingExportPayload } from "@/lib/ai/embedding-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? Number(limitParam) : undefined;

  try {
    const [coverage, payload] = await Promise.all([
      getEmbeddingCoverage(),
      getEmbeddingExportPayload(limit),
    ]);

    return NextResponse.json({
      ...coverage,
      ...payload,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Không thể export embedding payload.",
      },
      { status: 500 }
    );
  }
}
