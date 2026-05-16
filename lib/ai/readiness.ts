import { getGoogleApiKey, getSupabaseConfig } from "@/lib/ai/config";
import { getEmbeddingCoverage } from "@/lib/ai/embedding-store";
import { evaluatePersonalizationExperiments, evaluateRecommendationQuality } from "@/lib/ai/evaluation";
import { readAiLogsSummary } from "@/lib/ai/log-reader";
import { evaluateChatSafety } from "@/lib/ai/safety-evaluation";

export interface AiReadinessCheck {
  id: string;
  label: string;
  status: "pass" | "warn" | "fail";
  detail: string;
}

export interface AiReadinessReport {
  generatedAt: string;
  status: "ready" | "attention" | "blocked";
  score: number;
  checks: AiReadinessCheck[];
  nextActions: string[];
}

function getOverallStatus(checks: AiReadinessCheck[]) {
  if (checks.some((check) => check.status === "fail")) return "blocked" as const;
  if (checks.some((check) => check.status === "warn")) return "attention" as const;
  return "ready" as const;
}

function getReadinessScore(checks: AiReadinessCheck[]) {
  const score = checks.reduce((sum, check) => {
    if (check.status === "pass") return sum + 1;
    if (check.status === "warn") return sum + 0.5;
    return sum;
  }, 0);

  return Number((score / checks.length).toFixed(3));
}

export async function buildAiReadinessReport(): Promise<AiReadinessReport> {
  const [coverage, logsSummary, safetyEval] = await Promise.all([
    getEmbeddingCoverage(),
    readAiLogsSummary({ range: "7d", surface: "all" }),
    evaluateChatSafety(),
  ]);
  const recommendationEval = evaluateRecommendationQuality(4);
  const personalizationEval = evaluatePersonalizationExperiments(4);
  const hasGoogleApiKey = Boolean(getGoogleApiKey());
  const hasSupabaseConfig = Boolean(getSupabaseConfig());
  const coverageRate =
    coverage.totalProducts > 0
      ? coverage.enrichedProducts / coverage.totalProducts
      : 0;
  const fallbackEmbeddings = coverage.sourceBreakdown["deterministic-fallback"] ?? 0;
  const checks: AiReadinessCheck[] = [
    {
      id: "google-api-key",
      label: "Gemini API key",
      status: hasGoogleApiKey ? "pass" : "warn",
      detail: hasGoogleApiKey
        ? "GOOGLE_API_KEY đã sẵn sàng cho embedding thật."
        : "GOOGLE_API_KEY đang là placeholder, hệ thống dùng deterministic fallback.",
    },
    {
      id: "supabase-config",
      label: "Supabase config",
      status: hasSupabaseConfig ? "pass" : "warn",
      detail: hasSupabaseConfig
        ? "Supabase URL/key đã được cấu hình."
        : "Supabase URL/key đang là placeholder, pgvector cloud chưa bật thật.",
    },
    {
      id: "embedding-coverage",
      label: "Embedding coverage",
      status: coverageRate >= 1 ? "pass" : coverageRate >= 0.8 ? "warn" : "fail",
      detail: `${coverage.enrichedProducts}/${coverage.totalProducts} SKU có embedding store.`,
    },
    {
      id: "embedding-source",
      label: "Embedding source",
      status: fallbackEmbeddings === 0 ? "pass" : "warn",
      detail:
        fallbackEmbeddings === 0
          ? "Tất cả embeddings đang dùng nguồn live hoặc store thật."
          : `${fallbackEmbeddings} embeddings đang dùng deterministic fallback.`,
    },
    {
      id: "recommendation-quality",
      label: "Recommendation quality",
      status: recommendationEval.precisionAtK >= 0.75 ? "pass" : "warn",
      detail: `Offline P@4 hiện là ${recommendationEval.precisionAtK}.`,
    },
    {
      id: "personalization-experiments",
      label: "Personalization experiments",
      status: personalizationEval.winner.averagePrecisionAtK >= 0.75 ? "pass" : "warn",
      detail: `${personalizationEval.winner.label} đang thắng với P@4 ${personalizationEval.winner.averagePrecisionAtK}.`,
    },
    {
      id: "event-activity",
      label: "AI event activity",
      status:
        logsSummary.totalRecommendationEvents > 0 ||
        logsSummary.totalSearches > 0 ||
        logsSummary.totalChats > 0
          ? "pass"
          : "warn",
      detail: `${logsSummary.totalSearches} searches, ${logsSummary.totalChats} chats, ${logsSummary.totalRecommendationEvents} recommendation events trong 7 ngày.`,
    },
    {
      id: "evaluation-history",
      label: "Evaluation history",
      status: logsSummary.totalEvaluations > 0 ? "pass" : "warn",
      detail: `${logsSummary.totalEvaluations} evaluation snapshots trong 7 ngày.`,
    },
    {
      id: "chat-safety",
      label: "Chat safety benchmark",
      status: safetyEval.passRate >= 1 ? "pass" : safetyEval.passRate >= 0.75 ? "warn" : "fail",
      detail: `Safety pass rate hiện là ${safetyEval.passRate}, failed cases: ${safetyEval.failedCases}.`,
    },
  ];
  const status = getOverallStatus(checks);
  const nextActions = checks
    .filter((check) => check.status !== "pass")
    .map((check) => check.detail)
    .slice(0, 5);

  return {
    generatedAt: new Date().toISOString(),
    status,
    score: getReadinessScore(checks),
    checks,
    nextActions,
  };
}
