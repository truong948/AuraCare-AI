import { AiOpsPanel } from "@/components/dashboard/ai-ops-panel";
import type { AiLogsRange } from "@/lib/ai/log-reader";

function normalizeSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function DashboardAiOpsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const rangeParam = normalizeSearchParam(params.range);
  const range: AiLogsRange =
    rangeParam === "24h" || rangeParam === "7d" || rangeParam === "all"
      ? rangeParam
      : "all";
  const surface = normalizeSearchParam(params.surface) ?? "all";

  return <AiOpsPanel range={range} surface={surface} />;
}
