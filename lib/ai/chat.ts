import { GoogleGenerativeAI } from "@google/generative-ai";
import { getGoogleApiKey } from "@/lib/ai/config";
import { buildKnowledgeContext, findKnowledgeMatches, normalizeKnowledgeText } from "@/lib/ai/knowledge";
import { getProductRecommendations } from "@/lib/ai/recommendations";
import { runSemanticSearch } from "@/lib/ai/search";
import type { ChatRequestInput, ChatResponsePayload } from "@/lib/ai/types";
import { formatMockPrice, getProductBySlug } from "@/lib/mock-data/catalog";

const disclaimer =
  "AuraCare AI chỉ hỗ trợ tra cứu và gợi ý sản phẩm trong prototype học thuật này, không thay thế tư vấn y khoa chuyên môn.";

const normalizeText = normalizeKnowledgeText;

function getSafetyEscalationReason(message: string) {
  const normalizedMessage = normalizeText(message);
  const urgentTerms = [
    "kho tho",
    "dau nguc",
    "ngat",
    "soc phan ve",
    "tu tu",
    "co bau",
    "mang thai",
    "tre em",
  ];
  const diagnosisTerms = [
    "chan doan",
    "toi bi benh gi",
    "benh gi",
    "ke don",
    "thuoc ke don",
    "uống thuốc gì",
    "uong thuoc gi",
    "lieu dung",
    "tang lieu",
  ];

  if (urgentTerms.some((term) => normalizedMessage.includes(term))) {
    return "urgent";
  }

  if (diagnosisTerms.some((term) => normalizedMessage.includes(term))) {
    return "medical-advice";
  }

  return null;
}



function buildHandoffSummary(input: ChatRequestInput, answer: string, productName?: string) {
  const summaryParts = [
    `Người dùng hỏi: ${input.message}`,
    productName ? `Sản phẩm đang xem: ${productName}` : "Không có PDP cụ thể",
    `Tóm tắt AI: ${answer}`,
  ];

  return summaryParts.join(" | ");
}

async function buildMockAnswer(input: ChatRequestInput): Promise<ChatResponsePayload> {
  const normalizedMessage = normalizeText(input.message);
  const product = input.productSlug ? getProductBySlug(input.productSlug) : undefined;
  const knowledgeMatches = findKnowledgeMatches(input.message, 3);
  const faqMatches = product ? [] : knowledgeMatches.map((entry) => entry.title);
  const escalationReason = getSafetyEscalationReason(input.message);

  let answer = "";
  let suggestions: { product: any; score: number; reason: string }[] = [];

  if (escalationReason === "urgent") {
    answer =
      "Mình không thể xử lý tình huống khẩn cấp hoặc triệu chứng nguy hiểm. Bạn nên liên hệ cơ sở y tế hoặc người có chuyên môn ngay. AuraCare chỉ hỗ trợ thông tin sản phẩm ở mức tham khảo.";
  } else if (escalationReason === "medical-advice") {
    answer =
      "Mình không thể chẩn đoán, kê đơn hoặc điều chỉnh liều dùng. Mình có thể giúp bạn đọc thông tin sản phẩm, thành phần, cảnh báo và gợi ý câu hỏi để trao đổi với dược sĩ/bác sĩ.";
  } else if (product) {
    if (normalizedMessage.includes("thanh phan") || normalizedMessage.includes("ingredient")) {
      answer = `${product.name} có các thành phần chính: ${product.ingredientsText}. Đây là nhóm thành phần phù hợp để hỗ trợ ${product.benefitTags[0]?.replace(/-/g, " ") ?? "nhu cầu hiện tại"}.`;
    } else if (normalizedMessage.includes("cach dung") || normalizedMessage.includes("su dung")) {
      answer = `Cách dùng gợi ý cho ${product.name}: ${product.usageInstructions}`;
    } else if (normalizedMessage.includes("gia") || normalizedMessage.includes("bao nhieu")) {
      answer = `${product.name} hiện có giá ${formatMockPrice(product.price)} trong mock storefront. Đây là mức giá tham khảo để test luồng recommendation và PDP.`;
    } else if (
      normalizedMessage.includes("phu hop") ||
      normalizedMessage.includes("ai nen dung") ||
      normalizedMessage.includes("dung cho")
    ) {
      answer = `${product.name} phù hợp nhất với người dùng đang quan tâm tới ${product.concernTags.join(", ")} và muốn hỗ trợ ${product.benefitTags.join(", ")}. Tuy nhiên, hãy đọc kỹ lưu ý: ${product.warnings}`;
    } else if (normalizedMessage.includes("luu y") || normalizedMessage.includes("canh bao")) {
      answer = `Lưu ý chính của ${product.name}: ${product.warnings}`;
    } else {
      answer = `${product.name} là một sản phẩm thuộc nhóm ${product.category === "supplement" ? "thực phẩm bổ sung" : "chăm sóc da"}, nổi bật với ${product.ingredientsText}. Nếu bạn muốn, mình có thể giải thích thêm về thành phần, cách dùng hoặc đối tượng phù hợp.`;
    }
  } else {
    const searchResponse = await runSemanticSearch({ query: input.message, category: input.category, limit: 3 });
    suggestions = searchResponse.results
      .filter(r => r.score > 0.35)
      .map(r => ({ product: r.product, score: r.score, reason: r.reason }));
    
    // Check if it's a strong knowledge match (e.g. asking a specific question)
    const isQuestion = input.message.includes("?") || input.message.toLowerCase().includes("thế nào") || input.message.toLowerCase().includes("tại sao");
    
    if (isQuestion && knowledgeMatches[0]) {
      answer = knowledgeMatches[0].answer;
    } else if (suggestions.length > 0) {
      answer = `Dựa trên mô tả của bạn, mình xin gợi ý một số sản phẩm phù hợp.`;
    } else if (faqMatches[0]) {
      answer = knowledgeMatches[0]?.answer ?? faqMatches[0];
    } else {
      answer =
        "Mình có thể hỗ trợ bạn theo ba hướng: gợi ý sản phẩm theo nhu cầu, giải thích thành phần/cách dùng, hoặc hướng dẫn tìm kiếm bằng mô tả tự nhiên như 'da nhạy cảm thiếu ẩm' hoặc 'vitamin hỗ trợ tập trung'.";
    }
  }

  if (product && !escalationReason) {
    suggestions = getProductRecommendations(product.slug, 3).map(item => ({ ...item, reason: "Gợi ý tương tự" }));
  }

  return {
    source: "mock",
    answer,
    suggestions,
    faqMatches,
    disclaimer,
    handoffSummary: `${buildHandoffSummary(input, answer, product?.name)}${
      escalationReason ? ` | Escalation reason: ${escalationReason}` : ""
    }`,
  };
}

async function buildGeminiAnswer(input: ChatRequestInput) {
  const apiKey = getGoogleApiKey();
  if (!apiKey) return null;

  const product = input.productSlug ? getProductBySlug(input.productSlug) : undefined;
  const relevantProducts = (await runSemanticSearch({
    query: product ? `${input.message} ${product.name}` : input.message,
    category: input.category,
    limit: 3,
  })).results.filter(item => item.score > 0.35);
  const knowledgeContext = buildKnowledgeContext(input.message, 3);

  const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: "gemini-2.5-pro" });
  
  let historyText = "";
  if (input.history && input.history.length > 0) {
    historyText = "\nLỊCH SỬ CHAT TRƯỚC ĐÓ:\n" + input.history.map(m => `${m.role === 'user' ? 'Khách hàng' : 'AuraCare AI'}: ${m.content}`).join('\n') + "\n";
  }
  
  const prompt = `
Bạn là AuraCare AI, trợ lý tư vấn sản phẩm cho một cửa hàng y tế trực tuyến bằng tiếng Việt.
Nguyên tắc:
- Trả lời ngắn gọn, rõ ràng, thân thiện.
- Không kê đơn thuốc hoặc điều chỉnh liều lượng. Khuyên người dùng hỏi ý kiến bác sĩ nếu câu hỏi vượt quá phạm vi sản phẩm cơ bản.
- KHÔNG hiển thị ảnh hay giá tiền khi gợi ý sản phẩm, chỉ cần nhắc tên, hệ thống giao diện sẽ tự xử lý hiển thị.
${historyText}
Yêu cầu hiện tại của khách hàng: "${input.message}"

Ngữ cảnh sản phẩm hiện tại:
${product ? JSON.stringify(product, null, 2) : "Không có sản phẩm cụ thể."}

Các sản phẩm gần nhất với câu hỏi:
${JSON.stringify(
  relevantProducts.map((item) => ({
    name: item.product.name,
    category: item.product.category,
    concernTags: item.product.concernTags,
    benefitTags: item.product.benefitTags,
    ingredientsText: item.product.ingredientsText,
    reason: item.reason,
  })),
  null,
  2
)}

Knowledge base liên quan:
${JSON.stringify(knowledgeContext, null, 2)}

Câu hỏi của người dùng:
${input.message}
`;

  const response = await model.generateContent(prompt);
  const answer = response.response.text().trim();

  return {
    source: "gemini" as const,
    answer,
    suggestions: relevantProducts.map((item) => ({
      product: item.product,
      score: item.score,
      reason: item.reason,
    })),
    faqMatches: knowledgeContext.map((item) => item.title),
    disclaimer,
    handoffSummary: buildHandoffSummary(input, answer, product?.name),
  } satisfies ChatResponsePayload;
}

export async function runChatAssistant(input: ChatRequestInput): Promise<ChatResponsePayload> {
  try {
    const geminiResponse = await buildGeminiAnswer(input);
    if (geminiResponse) {
      return geminiResponse;
    }
  } catch (err) {
    console.error("Gemini fallback triggered due to error:", err);
  }

  return buildMockAnswer(input);
}
