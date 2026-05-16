import Link from "next/link";
import { Download, FileJson, Layers3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEmbeddingCoverage, getEmbeddingExportPayload } from "@/lib/ai/embedding-store";

export async function EmbeddingPayloadPanel() {
  const [coverage, payload] = await Promise.all([
    getEmbeddingCoverage(),
    getEmbeddingExportPayload(6),
  ]);

  return (
    <Card className="rounded-[32px] border-slate-200 shadow-sm shadow-slate-950/5">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-slate-900">Embedding payload & export</CardTitle>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Dùng panel này để xem coverage hiện tại của 60 SKU và export payload JSON phục vụ seed/upsert vào
              Supabase hoặc workflow nghiên cứu.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/api/ai/embeddings/export"
              className="inline-flex items-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Export JSON
            </Link>
            <Link
              href="/api/ai/embeddings/preview?limit=10"
              className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
            >
              <FileJson className="mr-2 h-4 w-4" />
              Preview API
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Total SKU</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{coverage.totalProducts}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Enriched</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{coverage.enrichedProducts}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Missing</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{coverage.missingProducts}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Generated at</p>
            <p className="mt-3 text-sm font-semibold text-slate-900">{coverage.generatedAt ?? "Chưa có file store"}</p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 p-5">
          <div className="flex items-center gap-2">
            <Layers3 className="h-4 w-4 text-slate-600" />
            <p className="text-sm font-semibold text-slate-900">Nguồn vector hiện tại</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {Object.entries(coverage.sourceBreakdown).length > 0 ? (
              Object.entries(coverage.sourceBreakdown).map(([source, count]) => (
                <span key={source} className="rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                  {source}: {count}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-500">Chưa có embedding nào được persist.</span>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {payload.products.map((product) => (
            <div key={product.slug} className="rounded-3xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-900">{product.name}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">{product.category}</p>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Vector dims: {product.embeddingVector?.length ?? 0}
              </p>
              <p className="mt-2 line-clamp-4 text-xs leading-6 text-slate-500">
                {product.embeddingVector ? product.embeddingVector.slice(0, 8).join(", ") : "Chưa có vector"}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
