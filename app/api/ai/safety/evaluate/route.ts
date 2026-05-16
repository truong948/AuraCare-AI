import { NextResponse } from "next/server";
import { evaluateChatSafety } from "@/lib/ai/safety-evaluation";

export async function GET() {
  try {
    return NextResponse.json(await evaluateChatSafety());
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Không thể đánh giá safety benchmark.",
      },
      { status: 500 }
    );
  }
}
