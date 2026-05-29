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

  if (input.imageBase64) {
    answer = "Tính năng nhận diện hình ảnh yêu cầu kết nối Gemini AI. Hiện hệ thống đang ở chế độ offline nên chưa thể phân tích ảnh. Vui lòng mô tả tình trạng bằng text để mình hỗ trợ bạn nhé!";
  } else if (escalationReason === "urgent") {
    answer =
      "Mình không thể xử lý tình huống khẩn cấp hoặc triệu chứng nguy hiểm. Bạn nên liên hệ cơ sở y tế hoặc người có chuyên môn ngay. AuraCare chỉ hỗ trợ thông tin sản phẩm ở mức tham khảo.";
  } else if (escalationReason === "medical-advice") {
    answer =
      "Mình không thể chẩn đoán, kê đơn hoặc điều chỉnh liều dùng. Mình có thể giúp bạn đọc thông tin sản phẩm, thành phần, cảnh báo và gợi ý câu hỏi để trao đổi với dược sĩ/bác sĩ.";
  } else if (product) {
    if (normalizedMessage.includes("thanh phan") || normalizedMessage.includes("ingredient")) {
      answer = `**${product.name}** có các thành phần chính: ${product.ingredientsText}.\n\nĐây là nhóm thành phần phù hợp để hỗ trợ ${product.benefitTags[0]?.replace(/-/g, " ") ?? "nhu cầu hiện tại"}.`;
    } else if (normalizedMessage.includes("cach dung") || normalizedMessage.includes("su dung")) {
      answer = `**Cách dùng ${product.name}:**\n${product.usageInstructions}`;
    } else if (normalizedMessage.includes("gia") || normalizedMessage.includes("bao nhieu")) {
      answer = `**${product.name}** hiện có giá **${formatMockPrice(product.price)}**.\n\n${product.compareAtPrice > product.price ? `Giá gốc: ${formatMockPrice(product.compareAtPrice)} — bạn tiết kiệm ${formatMockPrice(product.compareAtPrice - product.price)}!` : ""}`;
    } else if (
      normalizedMessage.includes("phu hop") ||
      normalizedMessage.includes("ai nen dung") ||
      normalizedMessage.includes("dung cho")
    ) {
      answer = `**${product.name}** phù hợp nhất với người dùng đang quan tâm tới: ${product.concernTags.join(", ")}.\n\n**Lợi ích:** ${product.benefitTags.join(", ")}.\n\n⚠️ **Lưu ý:** ${product.warnings}`;
    } else if (normalizedMessage.includes("luu y") || normalizedMessage.includes("canh bao")) {
      answer = `⚠️ **Lưu ý khi dùng ${product.name}:**\n${product.warnings}`;
    } else {
      answer = `**${product.name}** — ${product.brand}\n\n${product.shortDescription}\n\n**Thành phần chính:** ${product.ingredientsText}\n**Giá:** ${formatMockPrice(product.price)}\n\nBạn muốn biết thêm về thành phần, cách dùng, hay đối tượng phù hợp?`;
    }
  } else {
    // Search for relevant products
    const searchResponse = await runSemanticSearch({ query: input.message, category: input.category, limit: 5 });
    suggestions = searchResponse.results
      .filter(r => r.score > 0.2)
      .map(r => ({ product: r.product, score: r.score, reason: r.reason }));
    
    const isQuestion = input.message.includes("?") || input.message.toLowerCase().includes("thế nào") || input.message.toLowerCase().includes("tại sao");
    
    if (isQuestion && knowledgeMatches[0]) {
      answer = knowledgeMatches[0].answer;
    } else if (suggestions.length > 0) {
      const topNames = suggestions.slice(0, 3).map(s => `**${s.product.name}**`).join(", ");
      answer = `Dựa trên nhu cầu "${input.message}" của bạn, mình gợi ý các sản phẩm sau:\n\n${topNames}\n\nBạn có thể xem chi tiết từng sản phẩm bên dưới. Cần mình giải thích thêm về sản phẩm nào không?`;
    } else if (faqMatches[0]) {
      answer = knowledgeMatches[0]?.answer ?? faqMatches[0];
    } else {
      answer =
        "Mình có thể hỗ trợ bạn:\n\n• **Gợi ý sản phẩm** — mô tả nhu cầu như \"da nhạy cảm\", \"mất ngủ\", \"thiếu vitamin\"\n• **Giải thích thành phần** — hỏi về bất kỳ sản phẩm nào\n• **Gửi ảnh tư vấn** — chụp ảnh da để mình phân tích\n\nBạn thử nhé!";
    }
  }

  if (product && !escalationReason && !input.imageBase64) {
    suggestions = getProductRecommendations(product.slug, 3).map(item => ({ ...item, reason: "Sản phẩm tương tự" }));
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
    limit: 5,
  })).results.filter(item => item.score > 0.2);
  const knowledgeContext = buildKnowledgeContext(input.message, 3);

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
  
  let historyText = "";
  if (input.history && input.history.length > 0) {
    const recentHistory = input.history.slice(-10); // last 10 messages for context
    historyText = "\n## LỊCH SỬ CHAT GẦN ĐÂY:\n" + recentHistory.map(m => `${m.role === 'user' ? 'Khách' : 'AI'}: ${m.content}`).join('\n') + "\n";
  }

  const productCatalogSummary = relevantProducts.map((item, i) => 
    `${i + 1}. **${item.product.name}** (${item.product.brand}) — ${formatMockPrice(item.product.price)}
   Danh mục: ${item.product.category} | Tồn kho: ${item.product.stockStatus === "in_stock" ? "Còn hàng" : "Sắp hết"}
   Thành phần: ${item.product.ingredientsText}
   Công dụng: ${item.product.benefitTags.join(", ")}
   Phù hợp cho: ${item.product.concernTags.join(", ")}
   Lý do gợi ý: ${item.reason}`
  ).join('\n\n');
  
  const systemPrompt = `Bạn là **Dược sĩ AI AuraCare** — trợ lý tư vấn sức khỏe và mỹ phẩm chuyên nghiệp.

## QUY TẮC BẮT BUỘC:
1. **Luôn gợi ý sản phẩm CỤ THỂ** từ danh sách catalog bên dưới khi người dùng hỏi về nhu cầu/triệu chứng. KHÔNG BAO GIỜ trả lời chung chung mà không đề cập sản phẩm.
2. **Giải thích NGẮN GỌN** vì sao sản phẩm đó phù hợp (dựa trên thành phần, công dụng).
3. **Trả lời bằng tiếng Việt**, thân thiện, dễ hiểu, có cấu trúc rõ ràng.
4. **KHÔNG kê đơn thuốc**, KHÔNG chẩn đoán bệnh, KHÔNG điều chỉnh liều lượng.
5. Nếu câu hỏi nghiêm trọng → khuyên đi khám bác sĩ.
6. **KHÔNG** liệt kê giá tiền hay hiển thị ảnh sản phẩm — hệ thống UI sẽ tự hiển thị.
7. Sử dụng **markdown** (bold, bullet points) để dễ đọc.
8. Khi gợi ý sản phẩm, hãy nhắc chính xác tên sản phẩm từ catalog.
${input.imageBase64 ? "\n9. **PHÂN TÍCH HÌNH ẢNH**: Người dùng đã gửi kèm ảnh. Hãy phân tích hình ảnh (tình trạng da, sản phẩm, triệu chứng...) rồi gợi ý sản phẩm phù hợp từ catalog.\n" : ""}
${historyText}

## SẢN PHẨM TRONG CATALOG (dùng để gợi ý):
${productCatalogSummary || "Không có sản phẩm liên quan."}

${product ? `## SẢN PHẨM ĐANG XEM:
**${product.name}** — ${product.brand}
Mô tả: ${product.shortDescription}
Thành phần: ${product.ingredientsText}
Cách dùng: ${product.usageInstructions}
Cảnh báo: ${product.warnings}
Công dụng: ${product.benefitTags.join(", ")}
Phù hợp cho: ${product.concernTags.join(", ")}` : ""}

## KNOWLEDGE BASE:
${JSON.stringify(knowledgeContext, null, 2)}`;

  const userMessage = input.message || "Hãy phân tích hình ảnh tôi gửi và tư vấn sản phẩm phù hợp.";

  try {
    let response;
    
    if (input.imageBase64) {
      // Multimodal: image + text
      const imageData = input.imageBase64.replace(/^data:image\/\w+;base64,/, "");
      const mimeMatch = input.imageBase64.match(/^data:(image\/\w+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
      
      response = await model.generateContent([
        { text: systemPrompt + "\n\nCâu hỏi của khách hàng: " + userMessage },
        { inlineData: { data: imageData, mimeType } },
      ]);
    } else {
      // Text only
      response = await model.generateContent(
        systemPrompt + "\n\nCâu hỏi của khách hàng: " + userMessage
      );
    }
    
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
  } catch (err) {
    console.error("Gemini API error:", err);
    return null;
  }
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
