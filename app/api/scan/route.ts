import { NextResponse } from "next/server";
import { scanSkin } from "@/actions/scan";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const imageUrl = typeof body.imageUrl === "string" ? body.imageUrl : "";
  const imageDataUrl = typeof body.imageDataUrl === "string" ? body.imageDataUrl : "";

  if (!imageUrl && !imageDataUrl) {
    return NextResponse.json({ error: "Cần cung cấp ảnh chụp da hoặc URL hình ảnh." }, { status: 400 });
  }

  try {
    const result = await scanSkin({ imageUrl, imageDataUrl });
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
          confidence: "low",
          carePlan: [],
          rawText: ""
        },
        products: [],
        source: "local-fallback",
        disclaimer: "Kết quả AI Scan chỉ mang tính tham khảo, không thay thế tư vấn y tế."
      },
      { status: 500 }
    );
  }
}
