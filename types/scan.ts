export type ProductSuggestion = {
  id: string;
  slug: string;
  name: string;
  brand?: string;
  description: string | null;
  price: number | null;
  image?: string;
  category?: string;
  reason?: string;
  score: number;
};

export type ScanAIResponse = {
  diagnosis: string;
  symptoms: string[];
  severity: string;
  recommendations: string;
  symptomKeywords: string;
  confidence?: "low" | "medium" | "high";
  carePlan?: string[];
  rawText: string;
};

export type ScanApiResponse = {
  ai: ScanAIResponse;
  products: ProductSuggestion[];
  disclaimer?: string;
  source?: "gemini-vision" | "local-fallback";
  error?: string;
};
