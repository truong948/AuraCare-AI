"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/utils/supabase/server";
import type { ScanAIResponse, ProductSuggestion } from "@/types/scan";

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
      rawText: text
    };
  }

  return {
    diagnosis: "Không xác định",
    symptoms: [],
    severity: "Không rõ",
    recommendations: "Không có thông tin đủ.",
    symptomKeywords: "viêm da, mụn",
    rawText: text
  };
}

export async function scanSkin(imageUrl: string) {
  if (!imageUrl) {
    throw new Error("Image URL is required for skin scan.");
  }

  const googleApiKey = process.env.GOOGLE_API_KEY;
  if (!googleApiKey) {
    throw new Error("Missing GOOGLE_API_KEY environment variable.");
  }

  const aiClient = new GoogleGenerativeAI(googleApiKey);

  const prompt = `Bạn là một bác sĩ da liễu chuyên sâu. Phân tích các triệu chứng viêm, mụn, đỏ, sưng và da nhạy cảm trong hình ảnh sau. Trả về kết quả chỉ dưới dạng JSON với các khóa sau:
{
  "diagnosis": "",
  "symptoms": [""],
  "severity": "",
  "recommendations": "",
  "symptomKeywords": ""
}
Nếu cần, giải thích ngắn gọn nhưng không thêm bất kỳ văn bản nào ngoài JSON. Hãy dùng tiếng Việt rõ ràng và tập trung vào da mặt.`;

  const model = aiClient.getGenerativeModel({ model: "gemini-1.5-pro" });
  const response = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: prompt
          },
          {
            text: `Đây là URL hình ảnh da cần phân tích: ${imageUrl}`
          }
        ]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json"
    }
  });

  const extractedText = response.response?.text?.() ?? "";
  const aiResult = normalizeAiResult(extractedText || "");
  const symptomKeywords = aiResult.symptomKeywords || aiResult.symptoms.join(", ") || "viêm mụn";

  const supabase = await createClient();
  const { data, error } = await (supabase.rpc as any)(
    "match_products_by_symptoms",
    {
      symptom_keywords: symptomKeywords,
      match_limit: 5
    }
  );

  const productData = Array.isArray(data) ? (data as ProductSuggestion[]) : [];

  return {
    ai: aiResult,
    products: error ? [] : productData,
    error: error?.message
  };
}
