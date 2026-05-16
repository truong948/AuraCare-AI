import { GoogleGenerativeAI } from "@google/generative-ai";
import { getGoogleApiKey } from "@/lib/ai/config";
import { readEmbeddingStore, writeEmbeddingStore, type StoredEmbeddingEntry } from "@/lib/ai/embedding-store";
import { mockProducts, type MockProduct } from "@/lib/mock-data/catalog";

export function buildProductEmbeddingText(product: MockProduct) {
  return [
    product.name,
    product.brand,
    product.shortDescription,
    product.longDescription,
    product.ingredientsText,
    product.usageInstructions,
    product.searchableText,
    product.concernTags.join(", "),
    product.symptomTags.join(", "),
    product.benefitTags.join(", "),
  ].join("\n");
}

function deterministicVector(text: string, dimensions = 12) {
  const vector = Array.from({ length: dimensions }, () => 0);
  for (let index = 0; index < text.length; index += 1) {
    vector[index % dimensions] += text.charCodeAt(index) % 97;
  }

  const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
  return vector.map((value) => Number((value / norm).toFixed(6)));
}

async function createLiveEmbedding(text: string) {
  const apiKey = getGoogleApiKey();
  if (!apiKey) return null;

  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

export async function createFullEmbedding(text: string) {
  try {
    const liveEmbedding = await createLiveEmbedding(text);
    if (liveEmbedding) {
      return {
        source: "gemini" as const,
        dimensions: liveEmbedding.length,
        vector: liveEmbedding.map((value) => Number(value.toFixed(8))),
      };
    }
  } catch {
    // Fall back below.
  }

  const fallbackVector = deterministicVector(text, 64);
  return {
    source: "deterministic-fallback" as const,
    dimensions: fallbackVector.length,
    vector: fallbackVector,
  };
}

export async function createPreviewEmbedding(text: string) {
  try {
    const liveEmbedding = await createLiveEmbedding(text);
    if (liveEmbedding) {
      return {
        source: "gemini" as const,
        dimensions: liveEmbedding.length,
        vector: liveEmbedding.slice(0, 12).map((value) => Number(value.toFixed(6))),
      };
    }
  } catch {
    // Fall back to deterministic preview for local development.
  }

  return {
    source: "deterministic-fallback" as const,
    dimensions: 12,
    vector: deterministicVector(text, 12),
  };
}

export async function previewProductEmbeddings(limit = 5) {
  const products = mockProducts.slice(0, Math.max(1, limit));

  return Promise.all(
    products.map(async (product) => {
      const preview = await createPreviewEmbedding(buildProductEmbeddingText(product));
      return {
        slug: product.slug,
        name: product.name,
        category: product.category,
        source: preview.source,
        dimensions: preview.dimensions,
        previewVector: preview.vector,
      };
    })
  );
}

export async function enrichCatalogEmbeddings(forceRefresh = false) {
  const existing = await readEmbeddingStore();
  const existingMap = new Map(existing.entries.map((entry) => [entry.slug, entry]));
  const nextEntries: StoredEmbeddingEntry[] = [];

  for (const product of mockProducts) {
    const current = existingMap.get(product.slug);
    if (current && !forceRefresh) {
      nextEntries.push(current);
      continue;
    }

    const embedding = await createFullEmbedding(buildProductEmbeddingText(product));
    nextEntries.push({
      slug: product.slug,
      source: embedding.source,
      dimensions: embedding.dimensions,
      vector: embedding.vector,
      updatedAt: new Date().toISOString(),
    });
  }

  await writeEmbeddingStore(nextEntries);
  return nextEntries;
}
