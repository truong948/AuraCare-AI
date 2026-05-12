export type ProductSuggestion = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  score: number;
};

export type ScanAIResponse = {
  diagnosis: string;
  symptoms: string[];
  severity: string;
  recommendations: string;
  symptomKeywords: string;
  rawText: string;
};

export type ScanApiResponse = {
  ai: ScanAIResponse;
  products: ProductSuggestion[];
  error?: string;
};
