import { mockArticles } from "@/lib/mock-data/catalog";

export interface KnowledgeItem {
  id: string;
  title: string;
  answer: string;
  keywords: string[];
  type: "faq" | "article";
}

export const faqKnowledgeBase: KnowledgeItem[] = [
  {
    id: "faq-ai-scope",
    title: "AuraCare AI hỗ trợ người dùng như thế nào ở phase hiện tại?",
    answer:
      "Phase hiện tại tập trung vào chatbot hỗ trợ mua sắm, semantic search, recommendation rule-based và các bề mặt giải thích sản phẩm rõ ràng hơn.",
    keywords: ["ai", "semantic", "tim kiem", "goi y", "phase", "chatbot"],
    type: "faq",
  },
  {
    id: "faq-scope",
    title: "Vì sao storefront chỉ tập trung vào supplement và skincare?",
    answer:
      "Hai nhóm này phù hợp cho nghiên cứu UI/UX và AI hơn ở giai đoạn đầu vì có metadata phong phú, dễ gắn concern tags và ít rủi ro pháp lý hơn OTC hoặc thiết bị y tế.",
    keywords: ["supplement", "skincare", "bo sung", "cham soc da", "pham vi", "danh muc"],
    type: "faq",
  },
  {
    id: "faq-semantic-search",
    title: "Semantic search sẽ hoạt động như thế nào khi nối backend thật?",
    answer:
      "Người dùng nhập truy vấn tự nhiên, hệ thống tạo embedding bằng Gemini text-embedding-004, so khớp với pgvector trong Supabase và trả về sản phẩm có độ tương đồng cao nhất.",
    keywords: ["semantic", "embedding", "pgvector", "supabase", "gemini"],
    type: "faq",
  },
  {
    id: "faq-delivery",
    title: "Prototype có mô phỏng vận chuyển hay giao hàng thật không?",
    answer:
      "Prototype hiện chưa mô phỏng logistics thật. Giai đoạn này ưu tiên catalog, PDP, cart, checkout mock và AI surfaces.",
    keywords: ["giao hang", "van chuyen", "ship", "logistics"],
    type: "faq",
  },
];

export const articleKnowledgeBase: KnowledgeItem[] = mockArticles.map((article) => ({
  id: article.id,
  title: article.title,
  answer: [article.excerpt, ...article.content].join(" "),
  keywords: article.content
    .join(" ")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .split(/\s+/)
    .filter((token) => token.length > 3)
    .slice(0, 24),
  type: "article",
}));

export const storefrontKnowledgeBase: KnowledgeItem[] = [...faqKnowledgeBase, ...articleKnowledgeBase];

export function normalizeKnowledgeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function findKnowledgeMatches(query: string, limit = 3) {
  const normalizedQuery = normalizeKnowledgeText(query);

  return storefrontKnowledgeBase
    .map((item) => {
      let score = 0;

      if (normalizeKnowledgeText(item.title).includes(normalizedQuery)) score += 3;
      if (normalizeKnowledgeText(item.answer).includes(normalizedQuery)) score += 2;
      for (const keyword of item.keywords) {
        if (normalizedQuery.includes(normalizeKnowledgeText(keyword))) score += 1;
      }

      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((first, second) => second.score - first.score)
    .slice(0, limit)
    .map((entry) => entry.item);
}

export function buildKnowledgeContext(query: string, limit = 3) {
  return findKnowledgeMatches(query, limit).map((item) => ({
    title: item.title,
    answer: item.answer,
    type: item.type,
  }));
}
