import { readFileSync } from "node:fs";
import { readFile as readFileAsync } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const seedPath = path.join(process.cwd(), "data", "catalog-seed-with-embeddings.json");

function parseDotEnv() {
  try {
    const raw = readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
    return Object.fromEntries(
      raw
        .split(/\r?\n/)
        .map((line) => line.match(/^\s*([^#=]+)=(.*)$/))
        .filter(Boolean)
        .map((match) => [match[1].trim(), match[2].trim().replace(/^['"]|['"]$/g, "")])
    );
  } catch {
    return {};
  }
}

function requiredEnv(name, env) {
  const value = process.env[name] ?? env[name];
  if (!value || /your_|placeholder|example|changeme/i.test(value)) {
    throw new Error(`Missing ${name}. Add it to .env.local before seeding.`);
  }
  return value;
}

function vectorToPg(vector) {
  if (!Array.isArray(vector) || vector.length !== 768) return null;
  return `[${vector.map((value) => Number(value).toFixed(8)).join(",")}]`;
}

function toSku(slug) {
  return slug
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

async function main() {
  const localEnv = parseDotEnv();
  const dryRun = process.argv.includes("--dry-run");

  const payload = JSON.parse(await readFileAsync(seedPath, "utf8"));
  const products = Array.isArray(payload.products) ? payload.products : [];
  if (products.length === 0) {
    throw new Error(`No products found in ${seedPath}. Run npm run ai:enrich-embeddings first.`);
  }

  const rows = products.map((product) => ({
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    category: product.category,
    short_description: product.shortDescription,
    long_description: product.longDescription,
    price: product.price,
    compare_at_price: product.compareAtPrice ?? 0,
    stock_status: product.stockStatus ?? "in_stock",
    package_size: product.packageSize,
    ingredients_text: product.ingredientsText,
    usage_instructions: product.usageInstructions,
    warnings: product.warnings,
    concern_tags: product.concernTags ?? [],
    symptom_tags: product.symptomTags ?? [],
    benefit_tags: product.benefitTags ?? [],
    searchable_text: product.searchableText ?? "",
    rating: product.rating ?? 4.5,
    review_count: product.reviewCount ?? 0,
    origin_country: product.originCountry ?? "Vietnam",
    badge: product.badge,
    image: product.image,
    embedding_vector: vectorToPg(product.embeddingVector),
  }));

  const missingVectors = rows.filter((row) => row.embedding_vector === null).length;

  if (dryRun) {
    console.log(`Dry run OK: ${rows.length} products are ready for Supabase upsert.`);
    console.log(`Embedding vectors ready: ${rows.length - missingVectors}/${rows.length}`);
    return;
  }

  const supabaseUrl = requiredEnv("NEXT_PUBLIC_SUPABASE_URL", localEnv);
  const serviceRoleKey = requiredEnv("SUPABASE_SERVICE_ROLE_KEY", localEnv);
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
  const { data: upserted, error } = await supabase
    .from("products")
    .upsert(rows, { onConflict: "slug" })
    .select("id, slug, price, package_size");

  if (error) throw error;

  const variants = (upserted ?? []).map((product) => ({
    product_id: product.id,
    sku: `${toSku(product.slug)}-DEFAULT`,
    label: product.package_size ?? "Gói tiêu chuẩn",
    price: product.price,
    stock_quantity: 100,
  }));

  if (variants.length > 0) {
    const { error: variantError } = await supabase
      .from("product_variants")
      .upsert(variants, { onConflict: "sku" });
    if (variantError) throw variantError;
  }

  console.log(`Seeded ${rows.length} products and ${variants.length} variants.`);
  if (missingVectors > 0) {
    console.warn(`${missingVectors} products have no 768-dimension embedding_vector. Set GOOGLE_API_KEY and rerun npm run ai:enrich-embeddings.`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
