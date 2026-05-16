import { Bot, BrainCircuit, MessagesSquare, SearchCheck, SignalHigh } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmbeddingPayloadPanel } from "@/components/dashboard/embedding-payload-panel";
import { type AiLogsRange, readAiLogsSummary } from "@/lib/ai/log-reader";
import { previewProductEmbeddings } from "@/lib/ai/embeddings";
import {
  evaluatePersonalizationExperiments,
  evaluatePersonalizationScenarios,
  evaluateRecommendationQuality,
} from "@/lib/ai/evaluation";
import { buildAiReadinessReport } from "@/lib/ai/readiness";
import { evaluateChatSafety } from "@/lib/ai/safety-evaluation";

function renderValue(value: unknown) {
  if (value === null || value === undefined) return "Chưa có";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function getSignalLabel(source: string) {
  switch (source) {
    case "cart":
      return "Giỏ hàng";
    case "wishlist":
      return "Wishlist";
    case "recently_viewed":
      return "Đã xem gần đây";
    default:
      return source;
  }
}

function buildAiOpsHref(range: AiLogsRange, surface: string) {
  const params = new URLSearchParams();
  params.set("range", range);
  params.set("surface", surface);
  return `/dashboard/ai-ops?${params.toString()}`;
}

function FilterLink({
  href,
  isActive,
  children,
}: {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={[
        "inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition",
        isActive
          ? "bg-slate-900 text-white"
          : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

export async function AiOpsPanel({
  range = "all",
  surface = "all",
}: {
  range?: AiLogsRange;
  surface?: string;
}) {
  const [summary, embeddingPreview, readiness, safetyEvaluation] = await Promise.all([
    readAiLogsSummary({ range, surface }),
    previewProductEmbeddings(3),
    buildAiReadinessReport(),
    evaluateChatSafety(),
  ]);
  const evaluation = evaluateRecommendationQuality(4);
  const personalizationEvaluation = evaluatePersonalizationScenarios(4);
  const personalizationExperiments = evaluatePersonalizationExperiments(4);
  const rangeOptions: Array<{ value: AiLogsRange; label: string }> = [
    { value: "24h", label: "24h" },
    { value: "7d", label: "7 ngày" },
    { value: "all", label: "Tất cả" },
  ];
  const surfaceOptions = ["all", ...summary.availableSurfaces];

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
              Bộ lọc AI Ops
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Personalization analytics
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center xl:justify-end">
            <div className="flex flex-wrap gap-2">
              {rangeOptions.map((item) => (
                <FilterLink
                  key={item.value}
                  href={buildAiOpsHref(item.value, summary.filters.surface)}
                  isActive={summary.filters.range === item.value}
                >
                  {item.label}
                </FilterLink>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {surfaceOptions.map((item) => (
                <FilterLink
                  key={item}
                  href={buildAiOpsHref(summary.filters.range, item)}
                  isActive={summary.filters.surface === item}
                >
                  {item === "all" ? "Mọi surface" : item}
                </FilterLink>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Search events",
            value: summary.totalSearches,
            icon: SearchCheck,
            description: "Số lượt semantic search đã được ghi log local.",
          },
          {
            title: "Chat events",
            value: summary.totalChats,
            icon: MessagesSquare,
            description: "Số phiên product Q&A / FAQ chatbot đã được lưu.",
          },
          {
            title: "Recommendation events",
            value: summary.totalRecommendationEvents,
            icon: Bot,
            description: "Số lượt impression và click từ các kệ gợi ý.",
          },
          {
            title: "Recommendation CTR",
            value: summary.recommendationOverview.ctr,
            icon: BrainCircuit,
            description: "Tỷ lệ click tổng hợp trên các impression đã được ghi.",
          },
          {
            title: "Signal sources",
            value: summary.personalizationSignals.length,
            icon: SignalHigh,
            description: "Số nguồn tín hiệu đang xuất hiện trong log cá nhân hóa.",
          },
          {
            title: "Precision@4",
            value: evaluation.precisionAtK,
            icon: BrainCircuit,
            description: "Đánh giá offline dựa trên tag relevance của catalog mock.",
          },
          {
            title: "Scenario P@4",
            value: personalizationEvaluation.averagePrecisionAtK,
            icon: SignalHigh,
            description: "Độ khớp trung bình của các kịch bản personalization.",
          },
          {
            title: "Best ranker",
            value: personalizationExperiments.winner.averagePrecisionAtK,
            icon: BrainCircuit,
            description: personalizationExperiments.winner.label,
          },
          {
            title: "AI readiness",
            value: readiness.score,
            icon: SignalHigh,
            description: readiness.status,
          },
          {
            title: "Safety pass",
            value: safetyEvaluation.passRate,
            icon: BrainCircuit,
            description: `${safetyEvaluation.failedCases} failed cases`,
          },
          {
            title: "Embedding preview",
            value: embeddingPreview.length,
            icon: SearchCheck,
            description: "Số SKU đang được preview vector trong panel này.",
          },
          {
            title: "AI layer",
            value: "Phase 4.1",
            icon: MessagesSquare,
            description: "Semantic search, chatbot, logging và handoff summary.",
          },
        ].map((item) => (
          <Card key={item.title} className="rounded-[28px] border-slate-200 shadow-sm shadow-slate-950/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {item.title}
                </CardTitle>
                <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                  <item.icon className="h-4 w-4" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-slate-900">{item.value}</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="rounded-[32px] border-slate-200 shadow-sm shadow-slate-950/5">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">AI readiness report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-3xl border border-slate-200 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Trạng thái tổng thể</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Score {readiness.score} · generated at {readiness.generatedAt}
                  </p>
                </div>
                <div
                  className={[
                    "rounded-2xl px-3 py-2 text-sm font-semibold",
                    readiness.status === "ready"
                      ? "bg-emerald-50 text-emerald-700"
                      : readiness.status === "attention"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-rose-50 text-rose-700",
                  ].join(" ")}
                >
                  {readiness.status}
                </div>
              </div>
            </div>
            {readiness.checks.map((check) => (
              <div key={check.id} className="rounded-3xl border border-slate-200 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{check.label}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{check.detail}</p>
                  </div>
                  <div
                    className={[
                      "rounded-2xl px-3 py-2 text-sm font-semibold",
                      check.status === "pass"
                        ? "bg-emerald-50 text-emerald-700"
                        : check.status === "warn"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-rose-50 text-rose-700",
                    ].join(" ")}
                  >
                    {check.status}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border-slate-200 shadow-sm shadow-slate-950/5">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">Evaluation history</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {summary.evaluationLogs.length === 0 ? (
              <p className="text-sm text-slate-500">
                Chưa có snapshot evaluation nào. Gọi API evaluate với `persist=true` để lưu lịch sử.
              </p>
            ) : (
              summary.evaluationLogs
                .slice(-6)
                .reverse()
                .map((entry, index) => (
                  <div key={`${entry.timestamp}-${index}`} className="rounded-3xl border border-slate-200 p-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      <span>{entry.timestamp}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">{renderValue(entry.type)}</span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-900">
                      Recommendation P@K: {renderValue(entry.recommendationPrecisionAtK)}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Personalization P@K: {renderValue(entry.personalizationPrecisionAtK)}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Winner: {renderValue(entry.winner)}
                    </p>
                  </div>
                ))
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="rounded-[32px] border-slate-200 shadow-sm shadow-slate-950/5">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">Chat safety benchmark</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-3xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-900">Kết quả tổng quan</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Pass rate {safetyEvaluation.passRate} · failed cases {safetyEvaluation.failedCases}
              </p>
            </div>
            {safetyEvaluation.cases.map((testCase) => (
              <div key={testCase.id} className="rounded-3xl border border-slate-200 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{testCase.expectedBehavior}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{testCase.prompt}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{testCase.answerPreview}</p>
                  </div>
                  <div
                    className={[
                      "rounded-2xl px-3 py-2 text-sm font-semibold",
                      testCase.passed
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700",
                    ].join(" ")}
                  >
                    {testCase.passed ? "pass" : "fail"}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border-slate-200 shadow-sm shadow-slate-950/5">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">Phase 7 next actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {readiness.nextActions.length === 0 ? (
              <p className="text-sm text-slate-500">Không có action blocker trong readiness report hiện tại.</p>
            ) : (
              readiness.nextActions.map((item) => (
                <div key={item} className="rounded-3xl border border-slate-200 p-4">
                  <p className="text-sm leading-6 text-slate-600">{item}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="rounded-[32px] border-slate-200 shadow-sm shadow-slate-950/5">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">Log semantic search gần nhất</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {summary.searchLogs.length === 0 ? (
              <p className="text-sm text-slate-500">Chưa có search log nào được ghi.</p>
            ) : (
              summary.searchLogs
                .slice(-5)
                .reverse()
                .map((entry, index) => (
                  <div key={`${entry.timestamp}-${index}`} className="rounded-3xl border border-slate-200 p-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      <span>{entry.timestamp}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">{renderValue(entry.source)}</span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-900">{renderValue(entry.query)}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Top slugs: {renderValue(entry.topSlugs)}
                    </p>
                  </div>
                ))
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border-slate-200 shadow-sm shadow-slate-950/5">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">Log chatbot gần nhất</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {summary.chatLogs.length === 0 ? (
              <p className="text-sm text-slate-500">Chưa có chat log nào được ghi.</p>
            ) : (
              summary.chatLogs
                .slice(-5)
                .reverse()
                .map((entry, index) => (
                  <div key={`${entry.timestamp}-${index}`} className="rounded-3xl border border-slate-200 p-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      <span>{entry.timestamp}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">{renderValue(entry.source)}</span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-900">{renderValue(entry.message)}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Handoff: {renderValue(entry.handoffSummary)}
                    </p>
                  </div>
                ))
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-[32px] border-slate-200 shadow-sm shadow-slate-950/5">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">Analytics cho personalization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  label: "Impressions",
                  value: summary.recommendationOverview.impressions,
                },
                {
                  label: "Clicks",
                  value: summary.recommendationOverview.clicks,
                },
                {
                  label: "Surfaces",
                  value: summary.recommendationSurfaces.length,
                },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>

            {summary.recommendationSurfaces.length === 0 ? (
              <p className="text-sm text-slate-500">Chưa có dữ liệu impression/click từ recommendation shelves.</p>
            ) : (
              summary.recommendationSurfaces.map((surface) => (
                <div key={surface.surface} className="rounded-3xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{surface.surface}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {surface.impressions} impressions · {surface.clicks} clicks
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                      CTR {surface.ctr}
                    </div>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-slate-900"
                      style={{ width: `${Math.min(surface.ctr * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border-slate-200 shadow-sm shadow-slate-950/5">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">Breakdown theo nguồn tín hiệu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {summary.personalizationSignals.length === 0 ? (
              <p className="text-sm text-slate-500">
                Chưa có log `home-personalized` chứa breakdown từ cart, wishlist hoặc recently viewed.
              </p>
            ) : (
              summary.personalizationSignals.map((signal) => (
                <div key={signal.source} className="rounded-3xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{getSignalLabel(signal.source)}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {signal.impressions} impressions · {signal.clicks} clicks · CTR {signal.ctr}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                      {signal.totalWeight}
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Avg count
                      </p>
                      <p className="mt-1 text-lg font-semibold text-slate-900">{signal.averageCount}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Avg weight
                      </p>
                      <p className="mt-1 text-lg font-semibold text-slate-900">{signal.averageWeight}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="rounded-[32px] border-slate-200 shadow-sm shadow-slate-950/5">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">Recommendation logs gần nhất</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {summary.recommendationLogs.length === 0 ? (
              <p className="text-sm text-slate-500">Chưa có recommendation log nào được ghi.</p>
            ) : (
              summary.recommendationLogs
                .slice(-6)
                .reverse()
                .map((entry, index) => (
                  <div key={`${entry.timestamp}-${index}`} className="rounded-3xl border border-slate-200 p-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      <span>{entry.timestamp}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">{renderValue(entry.surface)}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">{renderValue(entry.action)}</span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-900">{renderValue(entry.title)}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Product: {renderValue(entry.productSlug ?? entry.productSlugs)}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Signals: {renderValue(entry.signalSummary)}
                    </p>
                  </div>
                ))
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="rounded-[32px] border-slate-200 shadow-sm shadow-slate-950/5">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">Offline recommendation eval</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  label: `Precision@${evaluation.k}`,
                  value: evaluation.precisionAtK,
                },
                {
                  label: "Coverage",
                  value: evaluation.coverage,
                },
                {
                  label: "Avg relevant",
                  value: evaluation.averageRelevantItemsAtK,
                },
                {
                  label: "Category diversity",
                  value: evaluation.categoryDiversity,
                },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    {item.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-3xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-900">Phạm vi đánh giá</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {evaluation.evaluatedAnchors} anchors trên {evaluation.catalogSize} SKU, relevance dựa trên
                concern, benefit, symptom tags và brand/category fallback.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border-slate-200 shadow-sm shadow-slate-950/5">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">Personalization scenario eval</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  label: `Scenario P@${personalizationEvaluation.k}`,
                  value: personalizationEvaluation.averagePrecisionAtK,
                },
                {
                  label: "Category hit",
                  value: personalizationEvaluation.averageCategoryHitRate,
                },
                {
                  label: "Tag hit",
                  value: personalizationEvaluation.averageTagHitRate,
                },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    {item.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-3xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-900">Kịch bản đã chạy</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {personalizationEvaluation.scenarioCount} kịch bản gồm giỏ hàng, wishlist, xem gần đây và tín hiệu hỗn hợp.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="rounded-[32px] border-slate-200 shadow-sm shadow-slate-950/5">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">Kịch bản personalization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {personalizationEvaluation.scenarios.map((scenario) => (
              <div key={scenario.id} className="rounded-3xl border border-slate-200 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{scenario.name}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {scenario.expectedCategory} · {scenario.expectedTags.slice(0, 3).join(", ")}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                    P@{personalizationEvaluation.k} {scenario.precisionAtK}
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Category hit
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">{scenario.categoryHitRate}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Tag hit
                    </p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">{scenario.tagHitRate}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Top: {scenario.topProducts.slice(0, 2).map((item) => item.name).join(" · ")}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border-slate-200 shadow-sm shadow-slate-950/5">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">Intent ranker experiments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-3xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-900">Ranker thắng hiện tại</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {personalizationExperiments.winner.label} đạt P@{personalizationExperiments.k}{" "}
                {personalizationExperiments.winner.averagePrecisionAtK}.
              </p>
            </div>
            {personalizationExperiments.variants.map((variant) => (
              <div key={variant.id} className="rounded-3xl border border-slate-200 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{variant.label}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {variant.wins} scenario wins · category {variant.averageCategoryHitRate} · tag{" "}
                      {variant.averageTagHitRate}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                    P@{personalizationExperiments.k} {variant.averagePrecisionAtK}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="rounded-[32px] border-slate-200 shadow-sm shadow-slate-950/5">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">Experiment insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {personalizationExperiments.insights.map((insight) => (
              <div key={insight.title} className="rounded-3xl border border-slate-200 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{insight.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{insight.message}</p>
                  </div>
                  <div
                    className={[
                      "rounded-2xl px-3 py-2 text-sm font-semibold",
                      insight.severity === "success"
                        ? "bg-emerald-50 text-emerald-700"
                        : insight.severity === "warning"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-slate-100 text-slate-700",
                    ].join(" ")}
                  >
                    {insight.severity}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border-slate-200 shadow-sm shadow-slate-950/5">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">Research backlog gợi ý</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              "Gắn intent classifier thật vào query hoặc session trước khi boost category/tag.",
              "Thêm negative scenario để kiểm tra ranker có overfit vào tag phổ biến hay không.",
              "Lưu experiment result theo thời gian để theo dõi drift khi catalog mock thay đổi.",
            ].map((item) => (
              <div key={item} className="rounded-3xl border border-slate-200 p-4">
                <p className="text-sm leading-6 text-slate-600">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="rounded-[32px] border-slate-200 shadow-sm shadow-slate-950/5">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">Top sản phẩm được click từ AI</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {summary.topRecommendedProducts.length === 0 ? (
              <p className="text-sm text-slate-500">Chưa có click nào từ recommendation shelves.</p>
            ) : (
              summary.topRecommendedProducts.map((item, index) => (
                <div key={item.productSlug} className="rounded-3xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Top {index + 1}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">{item.productName}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.clicks} clicks · {item.category}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                      {item.clicks}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="rounded-[32px] border-slate-200 shadow-sm shadow-slate-950/5">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">Anchors cần cải thiện</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {evaluation.weakAnchors.length === 0 ? (
              <p className="text-sm text-slate-500">Không có anchor nào dưới ngưỡng precision 0.5.</p>
            ) : (
              evaluation.weakAnchors.map((item) => (
                <div key={item.slug} className="rounded-3xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.relevantItems} sản phẩm relevant trong top {evaluation.k}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                      {item.precisionAtK}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border-slate-200 shadow-sm shadow-slate-950/5">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">Nhận định nhanh</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-3xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-900">Surface hoạt động mạnh nhất</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {summary.recommendationSurfaces[0]
                  ? `${summary.recommendationSurfaces[0].surface} đang có nhiều impression nhất với CTR ${summary.recommendationSurfaces[0].ctr}.`
                  : "Chưa đủ dữ liệu để xác định surface mạnh nhất."}
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-900">Tín hiệu personalization</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Kệ `home-personalized` sẽ phản ánh rõ hơn khi người dùng xem PDP, lưu wishlist hoặc thêm giỏ hàng. Đây là điểm tự nhiên để đánh giá Phase 5 baseline.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-900">Bước nên làm tiếp</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Khi dữ liệu đủ dày hơn, chúng ta có thể thêm ranking theo intent, source và category affinity thay vì chỉ dừng ở overlap rule-based.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card className="rounded-[32px] border-slate-200 shadow-sm shadow-slate-950/5">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900">Preview embedding cho catalog</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {embeddingPreview.map((item) => (
            <div key={item.slug} className="rounded-3xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-900">{item.name}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">
                {item.category} · {item.source}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Vector preview: {item.previewVector.join(", ")}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <EmbeddingPayloadPanel />
    </div>
  );
}
