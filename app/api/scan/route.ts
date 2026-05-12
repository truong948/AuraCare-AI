import { NextResponse } from "next/server";
import { scanSkin } from "@/actions/scan";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const imageUrl = typeof body.imageUrl === "string" ? body.imageUrl : "";

  if (!imageUrl) {
    return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
  }

  try {
    const result = await scanSkin(imageUrl);
    return NextResponse.json(result);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Không thể phân tích hình ảnh.",
        ai: {
          diagnosis: "Không xác định",
          symptoms: [],
          severity: "Không rõ",
          recommendations: "",
          symptomKeywords: "",
          rawText: ""
        },
        products: []
      },
      { status: 500 }
    );
  }
}
