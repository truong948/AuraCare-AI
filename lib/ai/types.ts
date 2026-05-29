import type { MockProduct, ProductCategory } from "@/lib/mock-data/catalog";

export interface SearchRequestInput {
  query: string;
  category?: ProductCategory;
  limit?: number;
}

export interface SearchResultItem {
  product: MockProduct;
  score: number;
  semanticScore: number;
  keywordScore: number;
  reason: string;
}

export interface SearchResponsePayload {
  query: string;
  normalizedQuery: string;
  source: "gemini-pgvector" | "mock-hybrid";
  explanation: string;
  results: SearchResultItem[];
}

export interface RecommendationItem {
  product: MockProduct;
  score: number;
  reason: string;
}

export interface ChatRequestInput {
  message: string;
  history?: { role: string; content: string }[];
  productSlug?: string;
  category?: ProductCategory;
  imageBase64?: string;
}

export interface ChatResponsePayload {
  source: "gemini" | "mock";
  answer: string;
  suggestions: RecommendationItem[];
  faqMatches: string[];
  disclaimer: string;
  handoffSummary: string;
}
