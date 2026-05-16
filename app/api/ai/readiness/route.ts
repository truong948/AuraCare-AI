import { NextResponse } from "next/server";
import { buildAiReadinessReport } from "@/lib/ai/readiness";

export async function GET() {
  try {
    return NextResponse.json(await buildAiReadinessReport());
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Không thể tạo AI readiness report.",
      },
      { status: 500 }
    );
  }
}
