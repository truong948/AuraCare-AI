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

function buildMockAnswer(input: ChatRequestInput): ChatResponsePayload {
  const normalizedMessage = normalizeText(input.message);
  const product = input.productSlug ? getProductBySlug(input.productSlug) : undefined;
  const knowledgeMatches = findKnowledgeMatches(input.message, 3);
  const faqMatches = product ? [] : knowledgeMatches.map((entry) => entry.title);
  const escalationReason = getSafetyEscalationReason(input.message);

  let answer = "";

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
  } else if (faqMatches[0]) {
    answer = knowledgeMatches[0]?.answer ?? faqMatches[0];
  } else if (knowledgeMatches[0]) {
    answer = `Theo knowledge base hiện tại: ${knowledgeMatches[0].answer}`;
  } else {
    answer =
      "Mình có thể hỗ trợ bạn theo ba hướng: gợi ý sản phẩm theo nhu cầu, giải thích thành phần/cách dùng, hoặc hướng dẫn tìm kiếm bằng mô tả tự nhiên như 'da nhạy cảm thiếu ẩm' hoặc 'vitamin hỗ trợ tập trung'.";
  }

  const suggestions = product
    && !escalationReason
    ? getProductRecommendations(product.slug, 3)
    : [];

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
  })).results;
  const knowledgeContext = buildKnowledgeContext(input.message, 3);

  const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `
Bạn là AuraCare AI, trợ lý tư vấn sản phẩm cho một storefront học thuật bằng tiếng Việt.

Nguyên tắc:
- Trả lời ngắn gọn, rõ ràng, không quá 140 từ.
- Chỉ hỗ trợ tra cứu và gợi ý sản phẩm, không chẩn đoán bệnh.
- Không kê đơn, không điều chỉnh liều, không xử lý tình huống khẩn cấp; hãy khuyên người dùng gặp chuyên gia y tế khi câu hỏi vượt phạm vi sản phẩm.
- Nếu thông tin chưa chắc chắn, nói rõ đây chỉ là gợi ý tham khảo.

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
  } catch {
    // Gracefully fall back to the deterministic local assistant.
  }

  return buildMockAnswer(input);
}
