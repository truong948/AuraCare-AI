import { readFile } from "node:fs/promises";
import path from "node:path";
import { getProductBySlug } from "@/lib/mock-data/catalog";

export interface AiLogEntry {
  timestamp: string;
  [key: string]: unknown;
}

export type AiLogsRange = "24h" | "7d" | "all";

export interface AiLogsSummaryOptions {
  range?: AiLogsRange;
  surface?: string;
}

interface SignalMetric {
  count: number;
  weight: number;
}

function getLogPath(filename: string) {
  return path.join(process.cwd(), ".ai-logs", filename);
}

async function readJsonLines(filename: string) {
  try {
    const raw = await readFile(getLogPath(filename), "utf8");
    return raw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => JSON.parse(line) as AiLogEntry);
  } catch {
    return [];
  }
}

export async function readSearchLogs() {
  return readJsonLines("search-events.jsonl");
}

export async function readChatLogs() {
  return readJsonLines("chat-events.jsonl");
}

export async function readRecommendationLogs() {
  return readJsonLines("recommendation-events.jsonl");
}

export async function readEvaluationLogs() {
  return readJsonLines("evaluation-events.jsonl");
}

function getRangeStart(range: AiLogsRange) {
  const now = Date.now();

  switch (range) {
    case "24h":
      return now - 24 * 60 * 60 * 1000;
    case "7d":
      return now - 7 * 24 * 60 * 60 * 1000;
    case "all":
      return null;
  }
}

function filterLogsByRange(entries: AiLogEntry[], range: AiLogsRange) {
  const rangeStart = getRangeStart(range);
  if (!rangeStart) return entries;

  return entries.filter((entry) => {
    const timestamp = Date.parse(entry.timestamp);
    return Number.isFinite(timestamp) && timestamp >= rangeStart;
  });
}

function filterRecommendationLogs(entries: AiLogEntry[], surface?: string) {
  if (!surface || surface === "all") return entries;
  return entries.filter((entry) => String(entry.surface ?? "unknown") === surface);
}

function listRecommendationSurfaces(entries: AiLogEntry[]) {
  return [...new Set(entries.map((entry) => String(entry.surface ?? "unknown")))].sort();
}

function summarizeRecommendationLogs(entries: AiLogEntry[]) {
  const bySurface = new Map<string, { impressions: number; clicks: number }>();

  for (const entry of entries) {
    const surface = String(entry.surface ?? "unknown");
    const action = String(entry.action ?? "impression");
    const current = bySurface.get(surface) ?? { impressions: 0, clicks: 0 };

    if (action === "click") {
      current.clicks += 1;
    } else {
      current.impressions += 1;
    }

    bySurface.set(surface, current);
  }

  return [...bySurface.entries()]
    .map(([surface, metrics]) => ({
      surface,
      ...metrics,
      ctr:
        metrics.impressions > 0
          ? Number((metrics.clicks / metrics.impressions).toFixed(3))
          : 0,
    }))
    .sort((first, second) => {
      if (first.impressions !== second.impressions) {
        return second.impressions - first.impressions;
      }

      return second.clicks - first.clicks;
    });
}

function summarizeRecommendationProducts(entries: AiLogEntry[]) {
  const byProduct = new Map<string, { clicks: number; surfaces: Set<string> }>();

  for (const entry of entries) {
    if (String(entry.action ?? "") !== "click") continue;

    const productSlug = String(entry.productSlug ?? "");
    if (!productSlug) continue;

    const current = byProduct.get(productSlug) ?? {
      clicks: 0,
      surfaces: new Set<string>(),
    };

    current.clicks += 1;
    current.surfaces.add(String(entry.surface ?? "unknown"));
    byProduct.set(productSlug, current);
  }

  return [...byProduct.entries()]
    .map(([productSlug, metrics]) => {
      const product = getProductBySlug(productSlug);

      return {
        productSlug,
        productName: product?.name ?? productSlug,
        category: product?.category ?? "unknown",
        clicks: metrics.clicks,
        surfaces: [...metrics.surfaces],
      };
    })
    .sort((first, second) => second.clicks - first.clicks);
}

function buildRecommendationOverview(entries: AiLogEntry[]) {
  let impressions = 0;
  let clicks = 0;

  for (const entry of entries) {
    if (String(entry.action ?? "") === "click") {
      clicks += 1;
    } else {
      impressions += 1;
    }
  }

  return {
    impressions,
    clicks,
    ctr: impressions > 0 ? Number((clicks / impressions).toFixed(3)) : 0,
  };
}

function isSignalMetric(value: unknown): value is SignalMetric {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Record<string, unknown>;
  return typeof candidate.count === "number" && typeof candidate.weight === "number";
}

function summarizePersonalizationSignals(entries: AiLogEntry[]) {
  const bySource = new Map<
    string,
    {
      impressions: number;
      clicks: number;
      events: number;
      totalCount: number;
      totalWeight: number;
    }
  >();

  for (const entry of entries) {
    if (String(entry.surface ?? "") !== "home-personalized") continue;
    if (!entry.signalBreakdown || typeof entry.signalBreakdown !== "object") continue;

    const action = String(entry.action ?? "impression");
    const breakdown = entry.signalBreakdown as Record<string, unknown>;

    for (const [source, value] of Object.entries(breakdown)) {
      if (!isSignalMetric(value)) continue;

      const current = bySource.get(source) ?? {
        impressions: 0,
        clicks: 0,
        events: 0,
        totalCount: 0,
        totalWeight: 0,
      };

      if (action === "click") {
        current.clicks += 1;
      } else {
        current.impressions += 1;
      }

      current.events += 1;
      current.totalCount += value.count;
      current.totalWeight += value.weight;
      bySource.set(source, current);
    }
  }

  return [...bySource.entries()]
    .map(([source, metrics]) => ({
      source,
      impressions: metrics.impressions,
      clicks: metrics.clicks,
      ctr:
        metrics.impressions > 0
          ? Number((metrics.clicks / metrics.impressions).toFixed(3))
          : 0,
      averageCount:
        metrics.events > 0
          ? Number((metrics.totalCount / metrics.events).toFixed(2))
          : 0,
      averageWeight:
        metrics.events > 0
          ? Number((metrics.totalWeight / metrics.events).toFixed(2))
          : 0,
      totalWeight: Number(metrics.totalWeight.toFixed(2)),
    }))
    .sort((first, second) => {
      if (first.totalWeight !== second.totalWeight) {
        return second.totalWeight - first.totalWeight;
      }

      return second.clicks - first.clicks;
    });
}

export async function readAiLogsSummary(options: AiLogsSummaryOptions = {}) {
  const range = options.range ?? "all";
  const selectedSurface = options.surface ?? "all";
  const [rawSearchLogs, rawChatLogs, rawRecommendationLogs, rawEvaluationLogs] = await Promise.all([
    readSearchLogs(),
    readChatLogs(),
    readRecommendationLogs(),
    readEvaluationLogs(),
  ]);
  const searchLogs = filterLogsByRange(rawSearchLogs, range);
  const chatLogs = filterLogsByRange(rawChatLogs, range);
  const evaluationLogs = filterLogsByRange(rawEvaluationLogs, range);
  const timeFilteredRecommendationLogs = filterLogsByRange(rawRecommendationLogs, range);
  const recommendationLogs = filterRecommendationLogs(timeFilteredRecommendationLogs, selectedSurface);

  return {
    filters: {
      range,
      surface: selectedSurface,
    },
    availableSurfaces: listRecommendationSurfaces(timeFilteredRecommendationLogs),
    searchLogs,
    chatLogs,
    evaluationLogs,
    recommendationLogs,
    totalSearches: searchLogs.length,
    totalChats: chatLogs.length,
    totalEvaluations: evaluationLogs.length,
    totalRecommendationEvents: recommendationLogs.length,
    latestSearch: searchLogs.at(-1) ?? null,
    latestChat: chatLogs.at(-1) ?? null,
    latestEvaluation: evaluationLogs.at(-1) ?? null,
    latestRecommendation: recommendationLogs.at(-1) ?? null,
    recommendationOverview: buildRecommendationOverview(recommendationLogs),
    recommendationSurfaces: summarizeRecommendationLogs(recommendationLogs),
    personalizationSignals: summarizePersonalizationSignals(recommendationLogs),
    topRecommendedProducts: summarizeRecommendationProducts(recommendationLogs).slice(0, 6),
  };
}
