import { getProductRecommendations } from "@/lib/ai/recommendations";
import { getPersonalizedRecommendations, type PersonalizationSignals } from "@/lib/ai/recommendations";
import type { RecommendationItem } from "@/lib/ai/types";
import { mockProducts, type MockProduct } from "@/lib/mock-data/catalog";

export interface RecommendationEvaluationResult {
  evaluatedAt: string;
  k: number;
  catalogSize: number;
  evaluatedAnchors: number;
  precisionAtK: number;
  averageRelevantItemsAtK: number;
  coverage: number;
  categoryDiversity: number;
  weakAnchors: Array<{
    slug: string;
    name: string;
    precisionAtK: number;
    relevantItems: number;
  }>;
}

export interface PersonalizationScenarioEvaluation {
  id: string;
  name: string;
  expectedCategory: MockProduct["category"];
  expectedTags: string[];
  precisionAtK: number;
  categoryHitRate: number;
  tagHitRate: number;
  topProducts: Array<{
    slug: string;
    name: string;
    score: number;
    reason: string;
  }>;
}

export interface PersonalizationEvaluationResult {
  evaluatedAt: string;
  k: number;
  scenarioCount: number;
  averagePrecisionAtK: number;
  averageCategoryHitRate: number;
  averageTagHitRate: number;
  scenarios: PersonalizationScenarioEvaluation[];
}

type PersonalizationExperimentVariant = "baseline" | "category_intent" | "tag_intent" | "hybrid_intent";

export interface PersonalizationExperimentResult {
  evaluatedAt: string;
  k: number;
  variants: Array<{
    id: PersonalizationExperimentVariant;
    label: string;
    averagePrecisionAtK: number;
    averageCategoryHitRate: number;
    averageTagHitRate: number;
    wins: number;
    scenarioScores: Array<{
      scenarioId: string;
      scenarioName: string;
      precisionAtK: number;
      categoryHitRate: number;
      tagHitRate: number;
      topSlugs: string[];
    }>;
  }>;
  winner: {
    id: PersonalizationExperimentVariant;
    label: string;
    averagePrecisionAtK: number;
  };
  insights: Array<{
    title: string;
    severity: "info" | "warning" | "success";
    message: string;
  }>;
}

function getSharedTagCount(anchor: MockProduct, candidate: MockProduct) {
  const sharedConcerns = anchor.concernTags.filter((tag) => candidate.concernTags.includes(tag)).length;
  const sharedBenefits = anchor.benefitTags.filter((tag) => candidate.benefitTags.includes(tag)).length;
  const sharedSymptoms = anchor.symptomTags.filter((tag) => candidate.symptomTags.includes(tag)).length;

  return sharedConcerns * 2 + sharedBenefits * 1.5 + sharedSymptoms;
}

function isRelevantRecommendation(anchor: MockProduct, candidate: MockProduct) {
  if (anchor.slug === candidate.slug) return false;
  if (getSharedTagCount(anchor, candidate) >= 1.5) return true;
  return anchor.category === candidate.category && anchor.brand === candidate.brand;
}

export function evaluateRecommendationQuality(k = 4): RecommendationEvaluationResult {
  const normalizedK = Math.max(1, Math.min(k, 12));
  const recommendedSlugs = new Set<string>();
  const weakAnchors: RecommendationEvaluationResult["weakAnchors"] = [];
  let totalPrecision = 0;
  let totalRelevantItems = 0;
  let totalCategoryDiversity = 0;

  for (const anchor of mockProducts) {
    const recommendations = getProductRecommendations(anchor.slug, normalizedK);
    const relevantItems = recommendations.filter((item) =>
      isRelevantRecommendation(anchor, item.product)
    ).length;
    const precision = recommendations.length > 0 ? relevantItems / recommendations.length : 0;
    const categories = new Set(recommendations.map((item) => item.product.category));

    recommendations.forEach((item) => recommendedSlugs.add(item.product.slug));
    totalPrecision += precision;
    totalRelevantItems += relevantItems;
    totalCategoryDiversity += categories.size;

    if (precision < 0.5) {
      weakAnchors.push({
        slug: anchor.slug,
        name: anchor.name,
        precisionAtK: Number(precision.toFixed(3)),
        relevantItems,
      });
    }
  }

  const evaluatedAnchors = mockProducts.length;

  return {
    evaluatedAt: new Date().toISOString(),
    k: normalizedK,
    catalogSize: mockProducts.length,
    evaluatedAnchors,
    precisionAtK: Number((totalPrecision / evaluatedAnchors).toFixed(3)),
    averageRelevantItemsAtK: Number((totalRelevantItems / evaluatedAnchors).toFixed(2)),
    coverage: Number((recommendedSlugs.size / mockProducts.length).toFixed(3)),
    categoryDiversity: Number((totalCategoryDiversity / evaluatedAnchors).toFixed(2)),
    weakAnchors: weakAnchors
      .sort((first, second) => first.precisionAtK - second.precisionAtK)
      .slice(0, 8),
  };
}

function buildRecentlyViewedEntry(slug: string, index: number, viewCount = 1) {
  return {
    slug,
    viewedAt: new Date(Date.now() - index * 60_000).toISOString(),
    viewCount,
  };
}

const personalizationScenarios: Array<{
  id: string;
  name: string;
  expectedCategory: MockProduct["category"];
  expectedTags: string[];
  signals: PersonalizationSignals;
}> = [
  {
    id: "cart-energy-supplement",
    name: "Giỏ hàng thiên về năng lượng",
    expectedCategory: "supplement",
    expectedTags: ["energy-support", "daily vitality", "daily wellness"],
    signals: {
      cart: [
        { productSlug: "supp-1-1-energy-support-1", quantity: 2 },
        { productSlug: "supp-5-1-focus-clarity-1", quantity: 1 },
      ],
      wishlist: [],
      recentlyViewed: [],
    },
  },
  {
    id: "wishlist-sensitive-skincare",
    name: "Wishlist chăm sóc da nhạy cảm",
    expectedCategory: "skincare",
    expectedTags: ["hydration-barrier", "sensitive-barrier", "skin support"],
    signals: {
      cart: [],
      wishlist: [
        "skin-1-1-hydration-barrier-1",
        "skin-8-1-sensitive-barrier-1",
      ],
      recentlyViewed: [],
    },
  },
  {
    id: "recent-acne-skincare",
    name: "Xem gần đây về da mụn",
    expectedCategory: "skincare",
    expectedTags: ["blemish-control", "pore-refining", "clearer pores"],
    signals: {
      cart: [],
      wishlist: [],
      recentlyViewed: [
        buildRecentlyViewedEntry("skin-3-1-blemish-control-1", 0, 3),
        buildRecentlyViewedEntry("skin-9-1-pore-refining-1", 1, 2),
      ],
    },
  },
  {
    id: "mixed-beauty-glow",
    name: "Tín hiệu hỗn hợp cho sáng da",
    expectedCategory: "skincare",
    expectedTags: ["bright-even-tone", "beauty-from-within", "radiance support", "skin glow support"],
    signals: {
      cart: [{ productSlug: "supp-6-1-beauty-from-within-1", quantity: 1 }],
      wishlist: ["skin-4-1-bright-even-tone-1"],
      recentlyViewed: [buildRecentlyViewedEntry("skin-1-1-hydration-barrier-1", 0, 1)],
    },
  },
];

function getExpectedTagHit(product: MockProduct, expectedTags: string[]) {
  const productTags = [
    ...product.concernTags,
    ...product.benefitTags,
    ...product.symptomTags,
  ];

  return expectedTags.some((tag) => productTags.includes(tag));
}

function scoreScenarioRecommendations(
  recommendations: RecommendationItem[],
  expectedCategory: MockProduct["category"],
  expectedTags: string[]
) {
  const relevantItems = recommendations.filter((item) => {
    const categoryMatch = item.product.category === expectedCategory;
    const tagMatch = getExpectedTagHit(item.product, expectedTags);
    return categoryMatch && tagMatch;
  }).length;
  const categoryHits = recommendations.filter(
    (item) => item.product.category === expectedCategory
  ).length;
  const tagHits = recommendations.filter((item) =>
    getExpectedTagHit(item.product, expectedTags)
  ).length;

  return {
    precisionAtK:
      recommendations.length > 0
        ? Number((relevantItems / recommendations.length).toFixed(3))
        : 0,
    categoryHitRate:
      recommendations.length > 0
        ? Number((categoryHits / recommendations.length).toFixed(3))
        : 0,
    tagHitRate:
      recommendations.length > 0
        ? Number((tagHits / recommendations.length).toFixed(3))
        : 0,
  };
}

function rerankForExperiment({
  scenario,
  variant,
  k,
}: {
  scenario: (typeof personalizationScenarios)[number];
  variant: PersonalizationExperimentVariant;
  k: number;
}) {
  const candidatePool = getPersonalizedRecommendations(scenario.signals, Math.max(k * 3, 12));

  if (variant === "baseline") {
    return candidatePool.slice(0, k);
  }

  return candidatePool
    .map((item) => {
      const categoryMatch = item.product.category === scenario.expectedCategory;
      const tagMatch = getExpectedTagHit(item.product, scenario.expectedTags);
      let experimentBoost = 0;

      if (variant === "category_intent") {
        if (categoryMatch) experimentBoost += 32;
        if (tagMatch) experimentBoost += 8;
      }

      if (variant === "tag_intent") {
        if (tagMatch) experimentBoost += 32;
        if (categoryMatch) experimentBoost += 8;
      }

      if (variant === "hybrid_intent") {
        if (categoryMatch) experimentBoost += 22;
        if (tagMatch) experimentBoost += 22;
        if (categoryMatch && tagMatch) experimentBoost += 12;
      }

      return {
        ...item,
        score: Number((item.score + experimentBoost).toFixed(3)),
      };
    })
    .sort((first, second) => {
      if (first.score !== second.score) {
        return second.score - first.score;
      }

      return second.product.rating - first.product.rating;
    })
    .slice(0, k);
}

export function evaluatePersonalizationScenarios(k = 4): PersonalizationEvaluationResult {
  const normalizedK = Math.max(1, Math.min(k, 12));
  const scenarios = personalizationScenarios.map((scenario) => {
    const recommendations = getPersonalizedRecommendations(scenario.signals, normalizedK);
    const score = scoreScenarioRecommendations(
      recommendations,
      scenario.expectedCategory,
      scenario.expectedTags
    );

    return {
      id: scenario.id,
      name: scenario.name,
      expectedCategory: scenario.expectedCategory,
      expectedTags: scenario.expectedTags,
      precisionAtK: score.precisionAtK,
      categoryHitRate: score.categoryHitRate,
      tagHitRate: score.tagHitRate,
      topProducts: recommendations.map((item) => ({
        slug: item.product.slug,
        name: item.product.name,
        score: item.score,
        reason: item.reason,
      })),
    };
  });

  return {
    evaluatedAt: new Date().toISOString(),
    k: normalizedK,
    scenarioCount: scenarios.length,
    averagePrecisionAtK: Number(
      (scenarios.reduce((sum, item) => sum + item.precisionAtK, 0) / scenarios.length).toFixed(3)
    ),
    averageCategoryHitRate: Number(
      (scenarios.reduce((sum, item) => sum + item.categoryHitRate, 0) / scenarios.length).toFixed(3)
    ),
    averageTagHitRate: Number(
      (scenarios.reduce((sum, item) => sum + item.tagHitRate, 0) / scenarios.length).toFixed(3)
    ),
    scenarios,
  };
}

export function evaluatePersonalizationExperiments(k = 4): PersonalizationExperimentResult {
  const normalizedK = Math.max(1, Math.min(k, 12));
  const variants: Array<{ id: PersonalizationExperimentVariant; label: string }> = [
    { id: "baseline", label: "Baseline ranker" },
    { id: "category_intent", label: "Category intent boost" },
    { id: "tag_intent", label: "Tag intent boost" },
    { id: "hybrid_intent", label: "Hybrid intent boost" },
  ];
  const evaluatedVariants = variants.map((variant) => {
    const scenarioScores = personalizationScenarios.map((scenario) => {
      const recommendations = rerankForExperiment({
        scenario,
        variant: variant.id,
        k: normalizedK,
      });
      const score = scoreScenarioRecommendations(
        recommendations,
        scenario.expectedCategory,
        scenario.expectedTags
      );

      return {
        scenarioId: scenario.id,
        scenarioName: scenario.name,
        ...score,
        topSlugs: recommendations.map((item) => item.product.slug),
      };
    });

    return {
      ...variant,
      averagePrecisionAtK: Number(
        (
          scenarioScores.reduce((sum, item) => sum + item.precisionAtK, 0) /
          scenarioScores.length
        ).toFixed(3)
      ),
      averageCategoryHitRate: Number(
        (
          scenarioScores.reduce((sum, item) => sum + item.categoryHitRate, 0) /
          scenarioScores.length
        ).toFixed(3)
      ),
      averageTagHitRate: Number(
        (
          scenarioScores.reduce((sum, item) => sum + item.tagHitRate, 0) /
          scenarioScores.length
        ).toFixed(3)
      ),
      wins: 0,
      scenarioScores,
    };
  });

  for (const scenario of personalizationScenarios) {
    const best = [...evaluatedVariants]
      .map((variant) => ({
        variant,
        score:
          variant.scenarioScores.find((item) => item.scenarioId === scenario.id)?.precisionAtK ?? 0,
      }))
      .sort((first, second) => second.score - first.score)[0];

    if (best) {
      best.variant.wins += 1;
    }
  }

  const winner = [...evaluatedVariants].sort((first, second) => {
    if (first.averagePrecisionAtK !== second.averagePrecisionAtK) {
      return second.averagePrecisionAtK - first.averagePrecisionAtK;
    }

    if (first.wins !== second.wins) {
      return second.wins - first.wins;
    }

    return second.averageCategoryHitRate - first.averageCategoryHitRate;
  })[0];
  const baseline = evaluatedVariants.find((variant) => variant.id === "baseline") ?? winner;
  const strongestChallenger = evaluatedVariants
    .filter((variant) => variant.id !== "baseline")
    .sort((first, second) => {
      if (first.averagePrecisionAtK !== second.averagePrecisionAtK) {
        return second.averagePrecisionAtK - first.averagePrecisionAtK;
      }

      return second.wins - first.wins;
    })[0];
  const weakScenario = evaluatedVariants
    .flatMap((variant) =>
      variant.scenarioScores.map((score) => ({
        variantId: variant.id,
        variantLabel: variant.label,
        ...score,
      }))
    )
    .sort((first, second) => first.precisionAtK - second.precisionAtK)[0];
  const insights: PersonalizationExperimentResult["insights"] = [];

  if (winner.id === "baseline") {
    insights.push({
      title: "Giữ baseline ranker",
      severity: "success",
      message:
        "Baseline đang thắng theo scenario wins, nên chưa có bằng chứng đủ mạnh để bật intent boost trong ranking thật.",
    });
  } else {
    insights.push({
      title: "Có ứng viên ranker mới",
      severity: "warning",
      message: `${winner.label} đang vượt baseline trong bộ scenario test. Nên kiểm tra thêm với log thật trước khi áp dụng.`,
    });
  }

  if (strongestChallenger) {
    const delta = Number(
      (strongestChallenger.averagePrecisionAtK - baseline.averagePrecisionAtK).toFixed(3)
    );
    insights.push({
      title: "So sánh với baseline",
      severity: delta > 0 ? "warning" : "info",
      message: `${strongestChallenger.label} chênh ${delta} P@${normalizedK} so với baseline.`,
    });
  }

  if (weakScenario && weakScenario.precisionAtK < 0.75) {
    insights.push({
      title: "Scenario cần tối ưu",
      severity: "warning",
      message: `${weakScenario.scenarioName} đang thấp nhất ở ${weakScenario.variantLabel} với P@${normalizedK} ${weakScenario.precisionAtK}.`,
    });
  } else {
    insights.push({
      title: "Scenario ổn định",
      severity: "success",
      message:
        "Không có scenario nào dưới ngưỡng P@4 0.75 trong bộ test hiện tại.",
    });
  }

  return {
    evaluatedAt: new Date().toISOString(),
    k: normalizedK,
    variants: evaluatedVariants,
    winner: {
      id: winner.id,
      label: winner.label,
      averagePrecisionAtK: winner.averagePrecisionAtK,
    },
    insights,
  };
}
