import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { mockProducts, type MockProduct } from "@/lib/mock-data/catalog";

export interface StoredEmbeddingEntry {
  slug: string;
  source: "gemini" | "deterministic-fallback";
  dimensions: number;
  vector: number[];
  updatedAt: string;
}

const EMBEDDING_STORE_PATH = path.join(process.cwd(), ".ai-data", "product-embeddings.json");

async function ensureDirectory() {
  await mkdir(path.dirname(EMBEDDING_STORE_PATH), { recursive: true });
}

export async function readEmbeddingStore() {
  try {
    const raw = await readFile(EMBEDDING_STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as { generatedAt?: string; entries?: StoredEmbeddingEntry[] };
    return {
      generatedAt: parsed.generatedAt ?? null,
      entries: Array.isArray(parsed.entries) ? parsed.entries : [],
    };
  } catch {
    return {
      generatedAt: null,
      entries: [] as StoredEmbeddingEntry[],
    };
  }
}

export async function writeEmbeddingStore(entries: StoredEmbeddingEntry[]) {
  await ensureDirectory();
  await writeFile(
    EMBEDDING_STORE_PATH,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        count: entries.length,
        entries,
      },
      null,
      2
    ),
    "utf8"
  );
}

export async function getEmbeddingCoverage() {
  const { generatedAt, entries } = await readEmbeddingStore();
  const available = new Set(entries.map((entry) => entry.slug));

  return {
    generatedAt,
    totalProducts: mockProducts.length,
    enrichedProducts: available.size,
    missingProducts: mockProducts.length - available.size,
    sourceBreakdown: entries.reduce<Record<string, number>>((accumulator, entry) => {
      accumulator[entry.source] = (accumulator[entry.source] ?? 0) + 1;
      return accumulator;
    }, {}),
  };
}

export async function getEnrichedCatalogProducts() {
  const { entries } = await readEmbeddingStore();
  const entryMap = new Map(entries.map((entry) => [entry.slug, entry]));

  return mockProducts.map((product) => {
    const stored = entryMap.get(product.slug);
    return {
      ...product,
      embeddingVector: stored?.vector ?? product.embeddingVector ?? null,
    } satisfies MockProduct;
  });
}

export async function getEmbeddingExportPayload(limit?: number) {
  const products = await getEnrichedCatalogProducts();
  const { generatedAt, entries } = await readEmbeddingStore();
  const selected = typeof limit === "number" ? products.slice(0, Math.max(limit, 1)) : products;

  return {
    generatedAt,
    count: selected.length,
    totalStoredEntries: entries.length,
    products: selected,
  };
}
