"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { isPlaceholderEnv } from "@/lib/ai/config";
import { mockProducts, type MockProduct } from "@/lib/mock-data/catalog";
import type { ScanAIResponse, ProductSuggestion } from "@/types/scan";

const DISCLAIMER =
  "Kết quả AI Scan chỉ mang tính tham khảo và hỗ trợ lựa chọn sản phẩm chăm sóc da, không thay thế chẩn đoán hoặc điều trị từ bác sĩ da liễu.";

function extractJsonPayload(text: string) {
  const jsonMatch = text.match(/\{[\s\S]*\}/m);
  if (!jsonMatch) return null;

  try {
    return JSON.parse(jsonMatch[0]);
  } catch {
    return null;
  }
}

function normalizeAiResult(text: string): ScanAIResponse {
  const parsed = extractJsonPayload(text);

  if (parsed && typeof parsed === "object") {
    return {
      diagnosis: String(parsed.diagnosis ?? "Không xác định"),
      symptoms: Array.isArray(parsed.symptoms)
        ? parsed.symptoms.map(String)
        : String(parsed.symptoms ?? "").split(/,|;/).map((item) => item.trim()).filter(Boolean),
      severity: String(parsed.severity ?? "Không rõ"),
      recommendations: String(parsed.recommendations ?? parsed.clinical_recommendation ?? "Hãy tham khảo ý kiến bác sĩ da liễu nếu cần."),
      symptomKeywords: String(parsed.symptomKeywords ?? parsed.tags ?? parsed.keywords ?? "viêm da, mụn"),
      confidence: normalizeConfidence(parsed.confidence),
      carePlan: Array.isArray(parsed.carePlan)
        ? parsed.carePlan.map(String)
        : String(parsed.carePlan ?? "").split(/\\n|,|;/).map((item) => item.trim()).filter(Boolean),
      rawText: text
    };
  }

  return {
    diagnosis: "Không xác định",
    symptoms: [],
    severity: "Không rõ",
    recommendations: "Không có thông tin đủ.",
    symptomKeywords: "viêm da, mụn",
    confidence: "low",
    carePlan: [],
    rawText: text
  };
}

function normalizeConfidence(value: unknown): "low" | "medium" | "high" {
  const normalized = String(value ?? "").toLowerCase();
  if (normalized.includes("high") || normalized.includes("cao")) return "high";
  if (normalized.includes("medium") || normalized.includes("trung")) return "medium";
  return "low";
}

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  return {
    mimeType: match[1],
    data: match[2],
  };
}

function expandSymptomTokens(input: string) {
  const text = input.toLowerCase();
  const tokens = new Set(
    text
      .split(/[^a-zA-Z0-9À-ỹ]+/)
      .map((item) => item.trim())
      .filter(Boolean)
  );

  const expansions = [
    { match: ["mụn", "acne", "comedone", "viêm"], add: ["blemish-control", "acne-prone skin", "clearer pores", "pore-refining"] },
    { match: ["đỏ", "redness", "kích", "rát", "irritation"], add: ["soothing-redness", "visible redness", "calming comfort", "sensitive-barrier"] },
    { match: ["khô", "thiếu", "ẩm", "tight", "dry"], add: ["hydration-barrier", "tight skin", "deep hydration", "barrier resilience"] },
    { match: ["dầu", "nhờn", "oil", "shine"], add: ["oil-balance", "shine on t-zone", "balanced finish"] },
    { match: ["lỗ", "pore", "pores"], add: ["pore-refining", "visible pores", "smoother look"] },
    { match: ["sạm", "thâm", "tone", "dull", "uneven"], add: ["bright-even-tone", "uneven tone", "radiance support", "skin glow support"] },
    { match: ["nhạy", "sensitive", "reactive"], add: ["sensitive-barrier", "reactive skin", "barrier resilience", "soothing-redness"] },
    { match: ["nắng", "uv", "spf", "sun"], add: ["sun-protection", "UV exposure", "daily shield"] },
  ];

  for (const group of expansions) {
    if (group.match.some((keyword) => text.includes(keyword))) {
      group.add.forEach((item) => tokens.add(item));
    }
  }

  return Array.from(tokens);
}

function scoreProduct(product: MockProduct, tokens: string[]) {
  const haystack = [
    product.name,
    product.brand,
    product.category,
    product.shortDescription,
    product.longDescription,
    product.ingredientsText,
    product.searchableText,
    ...product.concernTags,
    ...product.symptomTags,
    ...product.benefitTags,
  ]
    .join(" ")
    .toLowerCase();

  let score = product.category === "skincare" ? 0.18 : 0.04;
  for (const token of tokens) {
    const normalized = token.toLowerCase();
    if (!normalized) continue;
    if (haystack.includes(normalized)) score += normalized.length > 8 ? 0.18 : 0.1;
  }
  if (product.badge === "AI pick") score += 0.08;
  if (product.rating >= 4.7) score += 0.04;
  return Number(Math.min(score, 0.98).toFixed(2));
}

function buildProductReason(product: MockProduct, aiResult: ScanAIResponse) {
  const matched = [...product.concernTags, ...product.symptomTags, ...product.benefitTags]
    .filter((tag) => aiResult.symptomKeywords.toLowerCase().includes(tag.toLowerCase()))
    .slice(0, 2);

  if (matched.length) {
    return `Phù hợp vì có tag liên quan: ${matched.join(", ")}.`;
  }

  if (product.category === "skincare") {
    return "Được ưu tiên vì thuộc nhóm chăm sóc da và có metadata gần với dấu hiệu AI nhận diện.";
  }

  return "Gợi ý bổ trợ, nên cân nhắc theo nhu cầu cá nhân và đọc kỹ hướng dẫn sử dụng.";
}

function recommendProducts(aiResult: ScanAIResponse): ProductSuggestion[] {
  const tokens = expandSymptomTokens(
    [aiResult.diagnosis, aiResult.symptoms.join(" "), aiResult.symptomKeywords, aiResult.recommendations].join(" ")
  );

  return mockProducts
    .map((product) => ({
      product,
      score: scoreProduct(product, tokens),
    }))
    .filter((item) => item.score > 0.16)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(({ product, score }) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      description: product.shortDescription,
      price: product.price,
      image: product.image,
      category: product.category,
      reason: buildProductReason(product, aiResult),
      score,
    }));
}

function buildFallbackScan(): ScanAIResponse {
  return {
    diagnosis: "Đánh giá mô phỏng: da có thể đang nhạy cảm, thiếu ẩm hoặc có dấu hiệu mẩn đỏ nhẹ",
    symptoms: ["da nhạy cảm", "thiếu ẩm", "mẩn đỏ nhẹ", "hàng rào da cần phục hồi"],
    severity: "Nhẹ đến trung bình",
    recommendations:
      "Môi trường hiện tại chưa có Gemini API key thật nên đây là kết quả mô phỏng để demo luồng AI Scan. Nên ưu tiên làm sạch dịu nhẹ, phục hồi hàng rào bảo vệ da, cấp ẩm và dùng chống nắng ban ngày. Nếu da đau rát, sưng viêm lan rộng hoặc kéo dài, hãy gặp bác sĩ da liễu.",
    symptomKeywords: "soothing-redness visible redness sensitive-barrier hydration-barrier tight skin deep hydration blemish-control",
    confidence: "low",
    carePlan: [
      "Làm sạch dịu nhẹ, tránh tẩy rửa mạnh.",
      "Dùng sản phẩm phục hồi hàng rào da và cấp ẩm.",
      "Thử sản phẩm trên vùng nhỏ trước khi dùng toàn mặt.",
      "Dùng kem chống nắng vào ban ngày.",
    ],
    rawText: "local fallback",
  };
}

export async function scanSkin(input: { imageDataUrl?: string; imageUrl?: string }) {
  const imageDataUrl = input.imageDataUrl?.trim() ?? "";
  const imageUrl = input.imageUrl?.trim() ?? "";

  if (!imageDataUrl && !imageUrl) {
    throw new Error("Cần cung cấp ảnh chụp da hoặc URL hình ảnh.");
  }

  const googleApiKey = process.env.GOOGLE_API_KEY;
  if (isPlaceholderEnv(googleApiKey)) {
    const ai = buildFallbackScan();
    return {
      ai,
      products: recommendProducts(ai),
      disclaimer: DISCLAIMER,
      source: "local-fallback" as const,
    };
  }

  const aiClient = new GoogleGenerativeAI(googleApiKey!);

  const prompt = `Bạn là trợ lý AI hỗ trợ chăm sóc da trong một website thương mại điện tử học thuật.
Nhiệm vụ: quan sát ảnh da người dùng và mô tả các dấu hiệu có thể thấy để hỗ trợ chọn sản phẩm chăm sóc da.
Ràng buộc an toàn:
- Không khẳng định chẩn đoán bệnh.
- Không kê đơn thuốc.
- Không đưa phác đồ điều trị y tế.
- Nếu có dấu hiệu nghiêm trọng, khuyến nghị gặp bác sĩ da liễu.
Trả về duy nhất JSON hợp lệ bằng tiếng Việt với các khóa:
{
  "diagnosis": "",
  "symptoms": [""],
  "severity": "",
  "recommendations": "",
  "symptomKeywords": "",
  "confidence": "low|medium|high",
  "carePlan": [""]
}
Trong đó diagnosis nên viết là "Đánh giá tham khảo: ..." thay vì chẩn đoán chắc chắn. symptomKeywords nên chứa cả tiếng Việt và tag tiếng Anh như acne-prone skin, visible redness, hydration-barrier, sensitive-barrier nếu phù hợp.`;

  const model = aiClient.getGenerativeModel({ model: "gemini-1.5-flash" });
  const imagePart = parseDataUrl(imageDataUrl);

  const response = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          imagePart
            ? { inlineData: imagePart }
            : { text: `URL hình ảnh da cần phân tích: ${imageUrl}` },
        ]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json"
    }
  });

  const extractedText = response.response?.text?.() ?? "";
  const aiResult = normalizeAiResult(extractedText || "");

  return {
    ai: aiResult,
    products: recommendProducts(aiResult),
    disclaimer: DISCLAIMER,
    source: "gemini-vision" as const,
  };
}
