import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { mockProducts } from "../lib/mock-data/catalog.ts";

const outputDir = path.join(process.cwd(), ".ai-data");
const outputPath = path.join(outputDir, "product-embeddings.json");
const exportPath = path.join(process.cwd(), "data", "catalog-seed-with-embeddings.json");

function isPlaceholderEnv(value) {
  if (!value) return true;
  const normalized = value.toLowerCase();
  return normalized.includes("your_") || normalized.includes("placeholder") || normalized.includes("example");
}

function buildProductEmbeddingText(product) {
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

function deterministicVector(text, dimensions = 64) {
  const vector = Array.from({ length: dimensions }, () => 0);
  for (let index = 0; index < text.length; index += 1) {
    vector[index % dimensions] += text.charCodeAt(index) % 97;
  }

  const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
  return vector.map((value) => Number((value / norm).toFixed(8)));
}

async function createVector(text) {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!isPlaceholderEnv(apiKey)) {
    try {
      const client = new GoogleGenerativeAI(apiKey);
      const model = client.getGenerativeModel({ model: "text-embedding-004" });
      const result = await model.embedContent(text);
      return {
        source: "gemini",
        dimensions: result.embedding.values.length,
        vector: result.embedding.values.map((value) => Number(value.toFixed(8))),
      };
    } catch (error) {
      console.warn("Gemini embedding failed, switching to deterministic fallback.", error);
    }
  }

  const fallbackVector = deterministicVector(text, 64);
  return {
    source: "deterministic-fallback",
    dimensions: fallbackVector.length,
    vector: fallbackVector,
  };
}

async function main() {
  const products = Array.isArray(mockProducts) ? mockProducts : [];

  if (products.length === 0) {
    throw new Error("Local mock catalog returned no products.");
  }

  const entries = [];
  const enrichedProducts = [];

  for (const product of products) {
    const embedding = await createVector(buildProductEmbeddingText(product));
    entries.push({
      slug: product.slug,
      source: embedding.source,
      dimensions: embedding.dimensions,
      vector: embedding.vector,
      updatedAt: new Date().toISOString(),
    });

    enrichedProducts.push({
      ...product,
      embeddingVector: embedding.vector,
    });
  }

  await mkdir(outputDir, { recursive: true });
  await writeFile(
    outputPath,
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

  await mkdir(path.dirname(exportPath), { recursive: true });
  await writeFile(
    exportPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        count: enrichedProducts.length,
        products: enrichedProducts,
      },
      null,
      2
    ),
    "utf8"
  );

  console.log(`Enriched ${entries.length} products.`);
  console.log(`Embedding store: ${outputPath}`);
  console.log(`Seed export: ${exportPath}`);
  console.log(`Source breakdown: ${JSON.stringify(entries.reduce((acc, entry) => {
    acc[entry.source] = (acc[entry.source] ?? 0) + 1;
    return acc;
  }, {}))}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
