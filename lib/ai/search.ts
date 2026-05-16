import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getGoogleApiKey, getSupabaseConfig } from "@/lib/ai/config";
import type { SearchRequestInput, SearchResponsePayload, SearchResultItem } from "@/lib/ai/types";
import {
  getProductsByCategory,
  mockProducts,
  type MockProduct,
} from "@/lib/mock-data/catalog";

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function tokenize(value: string) {
  return normalizeText(value)
    .split(/[^a-z0-9]+/i)
    .map((token) => token.trim())
    .filter(Boolean);
}

const queryExpansionRules = [
  { match: "da nhay cam", additions: ["sensitive skin", "reactive skin", "sensitive-barrier", "soothing-redness"] },
  { match: "thieu am", additions: ["hydration", "hydration-barrier", "deep hydration", "tight skin"] },
  { match: "hang rao da", additions: ["barrier", "ceramides", "sensitive-barrier"] },
  { match: "do da", additions: ["redness", "soothing-redness", "calming comfort"] },
  { match: "da mun", additions: ["blemish", "acne-prone skin", "blemish-control"] },
  { match: "mien dich", additions: ["immune", "immune-defense", "immune support"] },
  { match: "nang luong", additions: ["energy", "energy-support", "daily vitality"] },
  { match: "tap trung", additions: ["focus", "focus-clarity", "focus support"] },
  { match: "giac ngu", additions: ["sleep", "sleep-balance", "night recovery"] },
  { match: "bo sung", additions: ["supplement", "daily wellness"] },
  { match: "cham soc da", additions: ["skincare", "skin support"] },
] as const;

function buildExpandedQueryContext(query: string) {
  const normalizedQuery = normalizeText(query);
  const additions = queryExpansionRules
    .filter((rule) => normalizedQuery.includes(rule.match))
    .flatMap((rule) => rule.additions);
  const expandedQuery = [normalizedQuery, ...additions].join(" ").trim();
  const tokens = tokenize(expandedQuery);

  return {
    normalizedQuery,
    expandedQuery,
    tokens,
  };
}

function getHaystack(product: MockProduct) {
  return normalizeText(
    [
      product.name,
      product.brand,
      product.shortDescription,
      product.longDescription,
      product.searchableText,
      product.ingredientsText,
      product.usageInstructions,
      ...product.concernTags,
      ...product.benefitTags,
      ...product.symptomTags,
    ].join(" ")
  );
}

function getKeywordScore(product: MockProduct, normalizedQuery: string, expandedQuery: string, tokens: string[]) {
  const haystack = getHaystack(product);
  let score = 0;

  if (normalizeText(product.name).includes(normalizedQuery)) score += 5;
  if (normalizeText(product.brand).includes(normalizedQuery)) score += 2;
  if (haystack.includes(normalizedQuery)) score += 3;
  if (expandedQuery && haystack.includes(expandedQuery)) score += 2;

  for (const token of tokens) {
    if (haystack.includes(token)) score += 1;
  }

  return score;
}

function getSemanticFallbackScore(product: MockProduct, tokens: string[]) {
  const keywordSet = new Set(tokens);
  const productTokens = new Set(tokenize(getHaystack(product)));

  let overlap = 0;
  for (const token of keywordSet) {
    if (productTokens.has(token)) overlap += 1;
  }

  const denominator = Math.max(keywordSet.size + productTokens.size - overlap, 1);
  const jaccard = overlap / denominator;
  const tagBoost =
    product.concernTags.filter((tag) => keywordSet.has(normalizeText(tag))).length * 0.12 +
    product.benefitTags.filter((tag) => keywordSet.has(normalizeText(tag))).length * 0.1 +
    product.symptomTags.filter((tag) => keywordSet.has(normalizeText(tag))).length * 0.1;

  return Number(Math.min(1, jaccard + tagBoost).toFixed(4));
}

function getReason(product: MockProduct, tokens: string[], semanticScore: number) {
  const matchingConcerns = product.concernTags.filter((tag) => tokenize(tag).some((token) => tokens.includes(token)));
  const matchingBenefits = product.benefitTags.filter((tag) => tokenize(tag).some((token) => tokens.includes(token)));
  const matchingSymptoms = product.symptomTags.filter((tag) => tokenize(tag).some((token) => tokens.includes(token)));

  if (matchingConcerns[0]) {
    return `Khớp mạnh với nhu cầu ${matchingConcerns[0].replace(/-/g, " ")} và metadata concern tags.`;
  }

  if (matchingBenefits[0]) {
    return `Liên quan trực tiếp tới lợi ích ${matchingBenefits[0].replace(/-/g, " ")} được mô tả trong truy vấn.`;
  }

  if (matchingSymptoms[0]) {
    return `Được gắn với tình trạng ${matchingSymptoms[0].replace(/-/g, " ")} gần với mô tả của người dùng.`;
  }

  if (semanticScore > 0.4) {
    return "Khớp ngữ nghĩa tốt giữa mô tả người dùng và phần mô tả sản phẩm.";
  }

  return "Có mức độ liên quan vừa phải dựa trên mô tả, thành phần và tag sản phẩm.";
}

function mapMockHybridResults(products: MockProduct[], normalizedQuery: string, limit: number): SearchResultItem[] {
  const { expandedQuery, tokens } = buildExpandedQueryContext(normalizedQuery);

  return products
    .map((product) => {
      const keywordScore = getKeywordScore(product, normalizedQuery, expandedQuery, tokens);
      const semanticScore = getSemanticFallbackScore(product, tokens);
      const finalScore = normalizedQuery
        ? Number((0.55 * semanticScore + 0.45 * Math.min(keywordScore / 10, 1)).toFixed(4))
        : Number((0.6 + product.rating * 0.06).toFixed(4));

      return {
        product,
        score: finalScore,
        semanticScore,
        keywordScore: Number(Math.min(keywordScore / 10, 1).toFixed(4)),
        reason: normalizedQuery
          ? getReason(product, tokens, semanticScore)
          : "Được ưu tiên vì có đánh giá tốt và metadata đầy đủ cho gợi ý AI.",
      };
    })
    .filter((item) => !normalizedQuery || item.score > 0.08 || item.keywordScore > 0 || item.semanticScore > 0)
    .sort((first, second) => {
      if (first.score !== second.score) {
        return second.score - first.score;
      }

      return second.product.rating - first.product.rating;
    })
    .slice(0, limit);
}

async function embedQuery(query: string) {
  const googleApiKey = getGoogleApiKey();
  if (!googleApiKey) return null;

  const client = new GoogleGenerativeAI(googleApiKey);
  const model = client.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.embedContent(query);
  return result.embedding.values;
}

async function runPgvectorSearch(input: SearchRequestInput) {
  const googleApiKey = getGoogleApiKey();
  const supabase = getSupabaseConfig();

  if (!googleApiKey || !supabase) {
    return null;
  }

  const queryEmbedding = await embedQuery(input.query);
  if (!queryEmbedding) return null;

  const client = createSupabaseClient(supabase.url, supabase.anonKey);
  const { data, error } = await client.rpc("match_products_by_embedding", {
    query_embedding: queryEmbedding,
    match_limit: input.limit ?? 12,
    match_category: input.category ?? null,
  });

  if (error || !Array.isArray(data)) {
    throw new Error(error?.message ?? "Không thể gọi hàm match_products_by_embedding.");
  }

  const { normalizedQuery, expandedQuery, tokens } = buildExpandedQueryContext(input.query);

  const merged: SearchResultItem[] = [];
  for (const item of data as Record<string, unknown>[]) {
    const slug = typeof item.slug === "string" ? item.slug : null;
    const product = slug ? (mockProducts.find((candidate) => candidate.slug === slug) as MockProduct | undefined) : undefined;
    if (!product) continue;

    const similarity = typeof item.similarity === "number" ? item.similarity : 0;
    const keywordScore = Number(
      Math.min(getKeywordScore(product, normalizedQuery, expandedQuery, tokens) / 10, 1).toFixed(4)
    );
    const score = Number((0.55 * similarity + 0.45 * keywordScore).toFixed(4));

    merged.push({
      product,
      score,
      semanticScore: Number(similarity.toFixed(4)),
      keywordScore,
      reason:
        typeof item.reason === "string" && item.reason
          ? item.reason
          : getReason(product, tokens, similarity),
    });
  }

  return {
    query: input.query,
    normalizedQuery,
    source: "gemini-pgvector" as const,
    explanation:
      "Kết quả được xếp hạng bằng Gemini embedding + pgvector, sau đó pha thêm điểm keyword để giữ độ chính xác với tên sản phẩm và tag.",
    results: merged,
  } satisfies SearchResponsePayload;
}

export async function runSemanticSearch(input: SearchRequestInput): Promise<SearchResponsePayload> {
  const normalizedQuery = normalizeText(input.query);
  const limit = input.limit ?? 12;
  const products = input.category ? getProductsByCategory(input.category) : mockProducts;

  if (!normalizedQuery) {
    return {
      query: input.query,
      normalizedQuery,
      source: "mock-hybrid",
      explanation: "Chưa có truy vấn cụ thể nên hệ thống trả về nhóm sản phẩm nổi bật để bắt đầu khám phá.",
      results: mapMockHybridResults(products, normalizedQuery, limit),
    };
  }

  try {
    const liveResponse = await runPgvectorSearch(input);
    if (liveResponse && liveResponse.results.length > 0) {
      return liveResponse;
    }
  } catch {
    // Fall back to mock hybrid search so the storefront stays usable without cloud config.
  }

  return {
    query: input.query,
    normalizedQuery,
    source: "mock-hybrid",
    explanation:
      "Môi trường hiện tại đang dùng semantic search fallback tại local: điểm ngữ nghĩa được xấp xỉ từ metadata, tag và mô tả sản phẩm để giữ nguyên trải nghiệm phase 4.",
    results: mapMockHybridResults(products, normalizedQuery, limit),
  };
}
