import {
  type MockProduct,
  getProductBySlug,
  mockProducts,
} from "@/lib/mock-data/catalog";
import type { RecommendationItem } from "@/lib/ai/types";
import type { RecentlyViewedEntry } from "@/lib/recently-viewed";

type RecommendationSource = "cart" | "wishlist" | "recently_viewed";

interface WeightedAnchor {
  product: MockProduct;
  source: RecommendationSource;
  weight: number;
}

interface AffinityProfile {
  categories: Record<string, number>;
  brands: Record<string, number>;
  concernTags: Record<string, number>;
  benefitTags: Record<string, number>;
  symptomTags: Record<string, number>;
}

export interface PersonalizationSignals {
  cart: Array<{ productSlug: string; quantity: number }>;
  wishlist: string[];
  recentlyViewed: RecentlyViewedEntry[];
}

function getOverlapScore(source: string[], target: string[]) {
  return source.filter((item) => target.includes(item)).length;
}

function sumOverlapWeight(source: string[], weights: Record<string, number>) {
  return source.reduce((sum, item) => sum + (weights[item] ?? 0), 0);
}

function getReason(anchor: MockProduct, candidate: MockProduct) {
  const sharedConcerns = anchor.concernTags.filter((tag) => candidate.concernTags.includes(tag));
  const sharedBenefits = anchor.benefitTags.filter((tag) => candidate.benefitTags.includes(tag));
  const sharedSymptoms = anchor.symptomTags.filter((tag) => candidate.symptomTags.includes(tag));

  if (sharedConcerns[0]) {
    return `Cùng phù hợp với nhu cầu ${sharedConcerns[0].replace(/-/g, " ")}.`;
  }

  if (sharedBenefits[0]) {
    return `Cùng hướng tới lợi ích ${sharedBenefits[0].replace(/-/g, " ")}.`;
  }

  if (sharedSymptoms[0]) {
    return `Đều được gắn với tình trạng ${sharedSymptoms[0].replace(/-/g, " ")}.`;
  }

  if (anchor.category === candidate.category) {
    return `Cùng thuộc danh mục ${anchor.category === "supplement" ? "thực phẩm bổ sung" : "chăm sóc da"}.`;
  }

  return "Phù hợp như một lựa chọn bổ sung trong cùng hành trình chăm sóc.";
}

function buildRecommendationScore(anchor: MockProduct, candidate: MockProduct) {
  let score = 0;

  if (anchor.category === candidate.category) score += 2.4;
  if (anchor.brand === candidate.brand) score += 0.6;

  score += getOverlapScore(anchor.concernTags, candidate.concernTags) * 2.2;
  score += getOverlapScore(anchor.benefitTags, candidate.benefitTags) * 1.8;
  score += getOverlapScore(anchor.symptomTags, candidate.symptomTags) * 1.4;

  if (candidate.badge === "AI pick") score += 0.8;
  if (candidate.badge === "Best seller") score += 0.6;

  score += candidate.rating * 0.2;

  return score;
}

function mapRecommendation(anchor: MockProduct, candidate: MockProduct): RecommendationItem {
  return {
    product: candidate,
    score: Number(buildRecommendationScore(anchor, candidate).toFixed(3)),
    reason: getReason(anchor, candidate),
  };
}

export function getHomeRecommendations(limit = 4) {
  return [...mockProducts]
    .sort((first, second) => {
      const firstScore = (first.badge === "AI pick" ? 2 : 0) + first.rating * 0.6 + first.reviewCount * 0.01;
      const secondScore = (second.badge === "AI pick" ? 2 : 0) + second.rating * 0.6 + second.reviewCount * 0.01;
      return secondScore - firstScore;
    })
    .slice(0, limit)
    .map((product) => ({
      product,
      score: Number(((product.badge === "AI pick" ? 2 : 0) + product.rating * 0.6).toFixed(3)),
      reason:
        product.category === "supplement"
          ? "Phù hợp để bắt đầu với nhu cầu năng lượng, miễn dịch hoặc tập trung."
          : "Phù hợp với người dùng đang tìm routine chăm sóc da đơn giản và dễ hiểu.",
    }));
}

function addWeightedValue(target: Record<string, number>, key: string, value: number) {
  target[key] = Number(((target[key] ?? 0) + value).toFixed(3));
}

function buildAffinityProfile(anchors: WeightedAnchor[]): AffinityProfile {
  const profile: AffinityProfile = {
    categories: {},
    brands: {},
    concernTags: {},
    benefitTags: {},
    symptomTags: {},
  };

  anchors.forEach(({ product, weight }) => {
    addWeightedValue(profile.categories, product.category, weight);
    addWeightedValue(profile.brands, product.brand, weight);
    product.concernTags.forEach((tag) => addWeightedValue(profile.concernTags, tag, weight * 1.1));
    product.benefitTags.forEach((tag) => addWeightedValue(profile.benefitTags, tag, weight));
    product.symptomTags.forEach((tag) => addWeightedValue(profile.symptomTags, tag, weight * 0.85));
  });

  return profile;
}

function buildWeightedAnchors(signals: PersonalizationSignals) {
  const anchors: WeightedAnchor[] = [];
  const excludedSlugs = new Set<string>();

  signals.cart.forEach(({ productSlug, quantity }) => {
    const product = getProductBySlug(productSlug);
    if (!product) return;

    excludedSlugs.add(productSlug);
    anchors.push({
      product,
      source: "cart",
      weight: Number((3.8 + Math.min(quantity, 4) * 0.7).toFixed(3)),
    });
  });

  signals.wishlist.forEach((productSlug, index) => {
    const product = getProductBySlug(productSlug);
    if (!product) return;

    excludedSlugs.add(productSlug);
    anchors.push({
      product,
      source: "wishlist",
      weight: Number((2.8 + Math.max(0, 0.9 - index * 0.15)).toFixed(3)),
    });
  });

  signals.recentlyViewed.forEach((entry, index) => {
    const product = getProductBySlug(entry.slug);
    if (!product) return;

    excludedSlugs.add(entry.slug);
    const recencyWeight = Math.max(0.75, 1.9 - index * 0.22);
    const repeatViewWeight = Math.min(entry.viewCount, 4) * 0.32;

    anchors.push({
      product,
      source: "recently_viewed",
      weight: Number((recencyWeight + repeatViewWeight).toFixed(3)),
    });
  });

  return { anchors, excludedSlugs };
}

function getSourceCoverageBonus(candidate: MockProduct, anchors: WeightedAnchor[]) {
  const matchedSources = new Set<RecommendationSource>();

  anchors.forEach((anchor) => {
    if (
      anchor.product.category === candidate.category ||
      anchor.product.brand === candidate.brand ||
      getOverlapScore(anchor.product.concernTags, candidate.concernTags) > 0 ||
      getOverlapScore(anchor.product.benefitTags, candidate.benefitTags) > 0 ||
      getOverlapScore(anchor.product.symptomTags, candidate.symptomTags) > 0
    ) {
      matchedSources.add(anchor.source);
    }
  });

  return matchedSources.size > 1 ? (matchedSources.size - 1) * 1.15 : 0;
}

function getSourcePriority(source: RecommendationSource) {
  switch (source) {
    case "cart":
      return 3;
    case "wishlist":
      return 2;
    case "recently_viewed":
      return 1;
  }
}

function getTopTag(candidateTags: string[], weights: Record<string, number>) {
  return [...candidateTags]
    .map((tag) => ({ tag, weight: weights[tag] ?? 0 }))
    .sort((first, second) => second.weight - first.weight)[0];
}

function formatTagForUi(tag: string) {
  return tag.replace(/-/g, " ");
}

function buildPersonalizedReason(
  candidate: MockProduct,
  anchors: WeightedAnchor[],
  profile: AffinityProfile
) {
  const sourceScores = anchors.reduce<Record<RecommendationSource, number>>(
    (acc, anchor) => {
      const overlapScore =
        buildRecommendationScore(anchor.product, candidate) * anchor.weight +
        (anchor.product.category === candidate.category ? 0.75 : 0);

      acc[anchor.source] += overlapScore;
      return acc;
    },
    {
      cart: 0,
      wishlist: 0,
      recently_viewed: 0,
    }
  );

  const topSource = (Object.entries(sourceScores) as Array<[RecommendationSource, number]>)
    .sort((first, second) => {
      if (first[1] !== second[1]) {
        return second[1] - first[1];
      }

      return getSourcePriority(second[0]) - getSourcePriority(first[0]);
    })[0]?.[0];

  const concernMatch = getTopTag(candidate.concernTags, profile.concernTags);
  const benefitMatch = getTopTag(candidate.benefitTags, profile.benefitTags);
  const symptomMatch = getTopTag(candidate.symptomTags, profile.symptomTags);
  const crossSignalMatches = Object.values(sourceScores).filter((value) => value > 0).length;

  if (topSource === "cart") {
    if (concernMatch?.weight) {
      return `Khớp mạnh với nhóm sản phẩm trong giỏ hàng cho nhu cầu ${formatTagForUi(concernMatch.tag)}.`;
    }

    return "Ưu tiên vì bổ sung tốt cho các sản phẩm bạn đang cân nhắc mua.";
  }

  if (topSource === "wishlist") {
    if (benefitMatch?.weight) {
      return `Phù hợp với nhóm sản phẩm bạn đã lưu, đặc biệt ở lợi ích ${formatTagForUi(benefitMatch.tag)}.`;
    }

    return "Được ưu tiên từ các sản phẩm bạn đã lưu để quay lại xem sau.";
  }

  if (topSource === "recently_viewed") {
    if (symptomMatch?.weight) {
      return `Liên quan đến các sản phẩm bạn vừa xem cho tình trạng ${formatTagForUi(symptomMatch.tag)}.`;
    }

    return "Được gợi ý từ những sản phẩm bạn vừa khám phá gần đây.";
  }

  if (crossSignalMatches >= 2 && concernMatch?.weight) {
    return `Khớp đồng thời nhiều tín hiệu quan tâm của bạn quanh nhu cầu ${formatTagForUi(concernMatch.tag)}.`;
  }

  if (candidate.category === "supplement") {
    return "Được ưu tiên từ hành vi xem, lưu và thêm vào giỏ ở nhóm thực phẩm bổ sung.";
  }

  return "Được ưu tiên từ hành vi xem, lưu và thêm vào giỏ ở nhóm chăm sóc da.";
}

export function getProductRecommendations(productSlug: string, limit = 4) {
  const anchor = getProductBySlug(productSlug);
  if (!anchor) return [];

  return mockProducts
    .filter((candidate) => candidate.slug !== anchor.slug)
    .map((candidate) => mapRecommendation(anchor, candidate))
    .sort((first, second) => {
      if (first.score !== second.score) {
        return second.score - first.score;
      }

      return second.product.rating - first.product.rating;
    })
    .slice(0, limit);
}

export function getCartRecommendations(productSlugs: string[], limit = 4) {
  const anchors = productSlugs
    .map((slug) => getProductBySlug(slug))
    .filter(Boolean) as MockProduct[];

  if (anchors.length === 0) return getHomeRecommendations(limit);

  const existing = new Set(productSlugs);

  return mockProducts
    .filter((candidate) => !existing.has(candidate.slug))
    .map((candidate) => {
      const scores = anchors.map((anchor) => mapRecommendation(anchor, candidate));
      const total = scores.reduce((sum, item) => sum + item.score, 0);
      const best = [...scores].sort((first, second) => second.score - first.score)[0];

      return {
        product: candidate,
        score: Number(total.toFixed(3)),
        reason: best?.reason ?? "Được gợi ý như lựa chọn bổ sung cho giỏ hàng hiện tại.",
      };
    })
    .sort((first, second) => {
      if (first.score !== second.score) {
        return second.score - first.score;
      }

      return second.product.reviewCount - first.product.reviewCount;
    })
    .slice(0, limit);
}

export function getPersonalizedRecommendations(signals: PersonalizationSignals, limit = 4) {
  const { anchors, excludedSlugs } = buildWeightedAnchors(signals);

  if (anchors.length === 0) return [];

  const profile = buildAffinityProfile(anchors);

  return mockProducts
    .filter((candidate) => !excludedSlugs.has(candidate.slug))
    .map((candidate) => {
      const anchorScore = anchors.reduce(
        (sum, anchor) => sum + buildRecommendationScore(anchor.product, candidate) * anchor.weight,
        0
      );
      const categoryAffinity = (profile.categories[candidate.category] ?? 0) * 1.15;
      const brandAffinity = (profile.brands[candidate.brand] ?? 0) * 0.7;
      const concernAffinity = sumOverlapWeight(candidate.concernTags, profile.concernTags) * 1.35;
      const benefitAffinity = sumOverlapWeight(candidate.benefitTags, profile.benefitTags) * 1.05;
      const symptomAffinity = sumOverlapWeight(candidate.symptomTags, profile.symptomTags) * 0.9;
      const crossSignalBonus = getSourceCoverageBonus(candidate, anchors);
      const stockBoost = candidate.stockStatus === "in_stock" ? 0.45 : 0.15;
      const badgeBoost =
        candidate.badge === "AI pick" ? 0.85 : candidate.badge === "Best seller" ? 0.55 : 0.2;
      const popularityBoost = candidate.rating * 0.22 + candidate.reviewCount * 0.006;
      const priceMomentumBoost = Math.max(0, candidate.compareAtPrice - candidate.price) / 250000;
      const personalizedScore =
        anchorScore +
        categoryAffinity +
        brandAffinity +
        concernAffinity +
        benefitAffinity +
        symptomAffinity +
        crossSignalBonus +
        stockBoost +
        badgeBoost +
        popularityBoost +
        priceMomentumBoost;

      return {
        product: candidate,
        score: Number(personalizedScore.toFixed(3)),
        reason: buildPersonalizedReason(candidate, anchors, profile),
      };
    })
    .sort((first, second) => {
      if (first.score !== second.score) {
        return second.score - first.score;
      }

      return second.product.rating - first.product.rating;
    })
    .slice(0, limit);
}
