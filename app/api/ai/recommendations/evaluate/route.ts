import { NextResponse } from "next/server";
import {
  evaluatePersonalizationExperiments,
  evaluatePersonalizationScenarios,
  evaluateRecommendationQuality,
} from "@/lib/ai/evaluation";
import { logEvaluationEvent } from "@/lib/ai/logging";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const k = Number(searchParams.get("k") ?? "4");
  const shouldPersist = searchParams.get("persist") === "true";

  try {
    const payload = {
      recommendationQuality: evaluateRecommendationQuality(k),
      personalizationScenarios: evaluatePersonalizationScenarios(k),
      personalizationExperiments: evaluatePersonalizationExperiments(k),
    };

    if (shouldPersist) {
      await logEvaluationEvent({
        type: "recommendation-evaluation",
        k: payload.recommendationQuality.k,
        recommendationPrecisionAtK: payload.recommendationQuality.precisionAtK,
        personalizationPrecisionAtK: payload.personalizationScenarios.averagePrecisionAtK,
        winner: payload.personalizationExperiments.winner,
        insights: payload.personalizationExperiments.insights,
      });
    }

    return NextResponse.json({
      persisted: shouldPersist,
      ...payload,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Không thể đánh giá recommendation.",
      },
      { status: 500 }
    );
  }
}
