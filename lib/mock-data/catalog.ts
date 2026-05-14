export type ProductCategory = "supplement" | "skincare";

export interface MockProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: ProductCategory;
  shortDescription: string;
  longDescription: string;
  price: number;
  compareAtPrice: number;
  stockStatus: "in_stock" | "low_stock";
  packageSize: string;
  ingredientsText: string;
  usageInstructions: string;
  warnings: string;
  concernTags: string[];
  symptomTags: string[];
  benefitTags: string[];
  searchableText: string;
  rating: number;
  reviewCount: number;
  originCountry: string;
  badge: "Best seller" | "New" | "AI pick" | "Flash deal";
  image: string;
  embeddingVector: number[] | null;
}

export interface MockArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  content: string[];
}

const supplementBase = [
  {
    concern: "energy-support",
    symptom: "tiredness",
    benefit: "daily vitality",
    format: "capsules",
    ingredients: "vitamin b complex, iron, coq10",
    use: "Take 2 capsules after breakfast.",
    warning: "Consult a professional if pregnant or using prescription medicine.",
  },
  {
    concern: "sleep-balance",
    symptom: "light sleep",
    benefit: "night recovery",
    format: "gummies",
    ingredients: "magnesium, l-theanine, chamomile",
    use: "Take 1 serving 30 minutes before bedtime.",
    warning: "Do not exceed the recommended serving.",
  },
  {
    concern: "digestive-comfort",
    symptom: "bloating",
    benefit: "gut support",
    format: "powder sticks",
    ingredients: "probiotics, digestive enzymes, inulin",
    use: "Mix 1 stick with water after meals.",
    warning: "Store in a cool dry place.",
  },
  {
    concern: "immune-defense",
    symptom: "seasonal sensitivity",
    benefit: "immune support",
    format: "tablets",
    ingredients: "vitamin c, zinc, elderberry",
    use: "Take 1 tablet daily after lunch.",
    warning: "Food supplement, not a medicine.",
  },
  {
    concern: "focus-clarity",
    symptom: "mental fatigue",
    benefit: "focus support",
    format: "capsules",
    ingredients: "omega-3, ginkgo, bacopa",
    use: "Take 2 capsules in the morning.",
    warning: "Not suitable for children under 12.",
  },
  {
    concern: "beauty-from-within",
    symptom: "dull skin",
    benefit: "skin glow support",
    format: "powder sachets",
    ingredients: "collagen peptides, biotin, vitamin c",
    use: "Mix 1 sachet with cold water once daily.",
    warning: "Consume consistently for visible results.",
  },
  {
    concern: "joint-mobility",
    symptom: "joint stiffness",
    benefit: "mobility support",
    format: "capsules",
    ingredients: "glucosamine, msm, turmeric",
    use: "Take 2 capsules after meals.",
    warning: "Discontinue if discomfort persists.",
  },
  {
    concern: "heart-balance",
    symptom: "wellness maintenance",
    benefit: "cardio support",
    format: "softgels",
    ingredients: "omega-3 fish oil, vitamin e",
    use: "Take 1 softgel twice daily.",
    warning: "Contains fish-derived ingredients.",
  },
  {
    concern: "women-wellbeing",
    symptom: "monthly fatigue",
    benefit: "women's daily support",
    format: "tablets",
    ingredients: "iron, folate, b12",
    use: "Take 1 tablet after dinner.",
    warning: "Keep out of reach of children.",
  },
  {
    concern: "hydration-recovery",
    symptom: "post-workout fatigue",
    benefit: "electrolyte support",
    format: "effervescent tablets",
    ingredients: "sodium, potassium, magnesium",
    use: "Dissolve 1 tablet in 250ml water.",
    warning: "Do not use if seal is broken.",
  },
] as const;

const skincareBase = [
  {
    concern: "hydration-barrier",
    symptom: "tight skin",
    benefit: "deep hydration",
    texture: "serum",
    ingredients: "hyaluronic acid, panthenol, ceramides",
    use: "Apply 2 pumps after cleansing on damp skin.",
    warning: "Patch test before first use.",
  },
  {
    concern: "soothing-redness",
    symptom: "visible redness",
    benefit: "calming comfort",
    texture: "cream",
    ingredients: "centella asiatica, madecassoside, oat extract",
    use: "Apply a thin layer morning and evening.",
    warning: "Avoid direct contact with eyes.",
  },
  {
    concern: "blemish-control",
    symptom: "acne-prone skin",
    benefit: "clearer pores",
    texture: "gel cleanser",
    ingredients: "salicylic acid, niacinamide, zinc pca",
    use: "Massage on wet skin for 30 seconds then rinse.",
    warning: "Use sunscreen during the day.",
  },
  {
    concern: "bright-even-tone",
    symptom: "uneven tone",
    benefit: "radiance support",
    texture: "essence",
    ingredients: "vitamin c, tranexamic acid, licorice root",
    use: "Press gently into skin after toner.",
    warning: "Store away from direct sunlight.",
  },
  {
    concern: "oil-balance",
    symptom: "shine on t-zone",
    benefit: "balanced finish",
    texture: "light moisturizer",
    ingredients: "green tea, niacinamide, squalane",
    use: "Apply 1 to 2 pumps after treatment serum.",
    warning: "Do not combine with strong exfoliants on first use.",
  },
  {
    concern: "night-renewal",
    symptom: "rough texture",
    benefit: "overnight smoothing",
    texture: "night cream",
    ingredients: "retinal, peptides, ceramides",
    use: "Use at night only after moisturizer buffer if needed.",
    warning: "Not recommended during pregnancy.",
  },
  {
    concern: "sun-protection",
    symptom: "UV exposure",
    benefit: "daily shield",
    texture: "sunscreen fluid",
    ingredients: "uv filters, panthenol, vitamin e",
    use: "Apply generously as the final morning step.",
    warning: "Reapply every 2 to 3 hours outdoors.",
  },
  {
    concern: "sensitive-barrier",
    symptom: "reactive skin",
    benefit: "barrier resilience",
    texture: "balm",
    ingredients: "ceramides, beta glucan, bisabolol",
    use: "Use on dry zones or as a sealing step.",
    warning: "Stop using if irritation increases.",
  },
  {
    concern: "pore-refining",
    symptom: "visible pores",
    benefit: "smoother look",
    texture: "toner",
    ingredients: "pha, niacinamide, willow bark",
    use: "Sweep lightly with cotton or palms after cleansing.",
    warning: "Introduce gradually 3 nights per week.",
  },
  {
    concern: "eye-revival",
    symptom: "tired eye area",
    benefit: "brightened look",
    texture: "eye gel",
    ingredients: "caffeine, peptides, hyaluronic acid",
    use: "Tap a rice-grain amount around the eye contour.",
    warning: "Use only on external skin.",
  },
] as const;

const supplementBrands = ["Nutrivive", "Auralabs", "Vitaglow"];
const skincareBrands = ["Calmistry", "Derma Bloom", "Sage Skin"];
const countries = ["Japan", "Korea", "Australia", "USA", "France"];
const supplementBadges: MockProduct["badge"][] = ["Best seller", "AI pick", "Flash deal"];
const skincareBadges: MockProduct["badge"][] = ["New", "AI pick", "Best seller"];

function formatTitle(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildSupplementProducts() {
  return supplementBase.flatMap((item, itemIndex) =>
    Array.from({ length: 3 }, (_, variantIndex) => {
      const id = `supp-${itemIndex + 1}-${variantIndex + 1}`;
      const size = variantIndex === 0 ? "30 capsules" : variantIndex === 1 ? "60 capsules" : "90 capsules";
      const price = 260000 + itemIndex * 35000 + variantIndex * 40000;
      const compareAtPrice = price + 70000;
      const brand = supplementBrands[(itemIndex + variantIndex) % supplementBrands.length];
      const benefitName = formatTitle(item.benefit.replace(/\s+/g, "-"));

      return {
        id,
        slug: `${id}-${item.concern}-${variantIndex + 1}`,
        name: `${brand} ${benefitName} ${size}`,
        brand,
        category: "supplement" as const,
        shortDescription: `${formatTitle(item.concern)} support with ${item.ingredients}.`,
        longDescription: `${brand} ${benefitName} is a supplement concept designed for ${item.symptom} and ${item.benefit}. It combines ${item.ingredients} in an easy daily ${item.format} format for academic mock ecommerce testing.`,
        price,
        compareAtPrice,
        stockStatus: variantIndex === 2 ? "low_stock" : "in_stock",
        packageSize: size,
        ingredientsText: item.ingredients,
        usageInstructions: item.use,
        warnings: item.warning,
        concernTags: [item.concern, "supplement"],
        symptomTags: [item.symptom],
        benefitTags: [item.benefit, "daily wellness"],
        searchableText: `${brand} ${item.concern} ${item.symptom} ${item.benefit} ${item.ingredients}`,
        rating: 4.5 + ((itemIndex + variantIndex) % 3) * 0.1,
        reviewCount: 72 + itemIndex * 11 + variantIndex * 9,
        originCountry: countries[(itemIndex + variantIndex) % countries.length],
        badge: supplementBadges[(itemIndex + variantIndex) % supplementBadges.length],
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80",
        embeddingVector: null,
      } satisfies MockProduct;
    })
  );
}

function buildSkincareProducts() {
  return skincareBase.flatMap((item, itemIndex) =>
    Array.from({ length: 3 }, (_, variantIndex) => {
      const id = `skin-${itemIndex + 1}-${variantIndex + 1}`;
      const size = variantIndex === 0 ? "30 ml" : variantIndex === 1 ? "50 ml" : "75 ml";
      const price = 320000 + itemIndex * 45000 + variantIndex * 50000;
      const compareAtPrice = price + 90000;
      const brand = skincareBrands[(itemIndex + variantIndex) % skincareBrands.length];
      const benefitName = formatTitle(item.benefit.replace(/\s+/g, "-"));

      return {
        id,
        slug: `${id}-${item.concern}-${variantIndex + 1}`,
        name: `${brand} ${benefitName} ${item.texture} ${size}`,
        brand,
        category: "skincare" as const,
        shortDescription: `${formatTitle(item.concern)} care for ${item.symptom}.`,
        longDescription: `${brand} ${benefitName} is a skincare concept built for ${item.symptom} and ${item.benefit}. It features ${item.ingredients} in a ${item.texture} texture and is intended for mock research and UI testing.`,
        price,
        compareAtPrice,
        stockStatus: variantIndex === 2 ? "low_stock" : "in_stock",
        packageSize: size,
        ingredientsText: item.ingredients,
        usageInstructions: item.use,
        warnings: item.warning,
        concernTags: [item.concern, "skincare"],
        symptomTags: [item.symptom],
        benefitTags: [item.benefit, "skin support"],
        searchableText: `${brand} ${item.concern} ${item.symptom} ${item.benefit} ${item.ingredients}`,
        rating: 4.4 + ((itemIndex + variantIndex) % 4) * 0.1,
        reviewCount: 58 + itemIndex * 13 + variantIndex * 8,
        originCountry: countries[(itemIndex + variantIndex + 2) % countries.length],
        badge: skincareBadges[(itemIndex + variantIndex) % skincareBadges.length],
        image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=900&q=80",
        embeddingVector: null,
      } satisfies MockProduct;
    })
  );
}

export const mockProducts = [...buildSupplementProducts(), ...buildSkincareProducts()];

export const storefrontCategories = [
  {
    id: "supplement",
    label: "Thực phẩm bổ sung",
    description: "Hỗ trợ năng lượng, miễn dịch, tập trung, giấc ngủ và chăm sóc sắc đẹp mỗi ngày.",
    itemCount: mockProducts.filter((product) => product.category === "supplement").length,
  },
  {
    id: "skincare",
    label: "Chăm sóc da",
    description: "Dưỡng ẩm, phục hồi hàng rào bảo vệ da, hỗ trợ da mụn và làn da nhạy cảm.",
    itemCount: mockProducts.filter((product) => product.category === "skincare").length,
  },
] as const;

export const quickActions = [
  { title: "Hỏi Aura AI", description: "Nhận gợi ý sản phẩm bằng ngôn ngữ tự nhiên chỉ trong vài giây." },
  { title: "Tìm kiếm ngữ nghĩa", description: "Tìm theo nhu cầu, công dụng hoặc vấn đề da." },
  { title: "Mua lại nhanh", description: "Lưu sản phẩm yêu thích và quay lại đặt hàng dễ dàng." },
  { title: "Ghi chú sử dụng", description: "Đọc cách dùng, thành phần và lưu ý an toàn rõ ràng." },
] as const;

export const aiHighlights = [
  "Vitamin hỗ trợ năng lượng cho người làm việc văn phòng",
  "Chăm sóc da dịu nhẹ cho da thiếu nước và nhạy cảm",
  "Bộ gợi ý bổ sung cho miễn dịch và tập trung",
  "Phục hồi hàng rào bảo vệ da với công thức ít hương liệu",
] as const;

export const mockArticles: MockArticle[] = [
  {
    id: "article-1",
    slug: "how-to-choose-daily-supplements",
    title: "Cách chọn bộ thực phẩm bổ sung hằng ngày mà không làm routine trở nên quá tải",
    excerpt: "Hướng dẫn xây một nền tảng bổ sung đơn giản cho năng lượng, giấc ngủ và miễn dịch theo góc nhìn nghiên cứu.",
    category: "Hướng dẫn sức khỏe",
    content: [
      "Một routine tốt không cần quá nhiều sản phẩm. Với nhóm thực phẩm bổ sung, điều quan trọng nhất là hiểu rõ mục tiêu của bạn: năng lượng, giấc ngủ, miễn dịch hay vẻ ngoài của làn da.",
      "Nếu mục tiêu là năng lượng, hãy ưu tiên sản phẩm có nhóm vitamin B, sắt hoặc CoQ10. Nếu mục tiêu là nghỉ ngơi tốt hơn, magnesium hoặc l-theanine sẽ là những từ khóa đáng chú ý trong danh sách thành phần.",
      "Trong một storefront có AI như AuraCare, hệ thống recommendation nên giải thích rõ vì sao nó gợi ý sản phẩm, thay vì chỉ xếp hạng theo độ phổ biến."
    ],
  },
  {
    id: "article-2",
    slug: "sensitive-skin-barrier-basics",
    title: "Kiến thức cơ bản về hàng rào bảo vệ da nhạy cảm trước khi mua skincare",
    excerpt: "Tìm hiểu cách đọc thành phần, tránh yếu tố gây kích ứng và đơn giản hóa quyết định mua skincare.",
    category: "Sức khỏe làn da",
    content: [
      "Người dùng có làn da nhạy cảm thường không tìm bằng tên sản phẩm, mà tìm bằng nhu cầu: da châm chích, thiếu ẩm, đỏ rát hoặc dễ phản ứng. Đây là lý do semantic search đặc biệt hữu ích ở nhóm skincare.",
      "Khi đọc thành phần, hãy chú ý đến ceramides, panthenol, centella, oat extract hoặc hyaluronic acid. Những thành phần này thường được dùng trong các công thức hỗ trợ làm dịu và phục hồi da.",
      "Một PDP tốt không chỉ cần đẹp mà còn phải trình bày rõ thành phần, cách dùng, cảnh báo và nhóm người dùng phù hợp."
    ],
  },
  {
    id: "article-3",
    slug: "semantic-search-in-health-ecommerce",
    title: "Vì sao semantic search quan trọng trong thương mại điện tử sức khỏe",
    excerpt: "Tổng quan về cách vector search giúp tăng độ chính xác, niềm tin và khả năng chuyển đổi.",
    category: "Ghi chú AI",
    content: [
      "Keyword search phù hợp khi người dùng đã biết tên sản phẩm hoặc thương hiệu. Nhưng trong thương mại điện tử sức khỏe, người dùng thường nhập một mô tả dài về nhu cầu của họ.",
      "Semantic search cho phép hệ thống hiểu gần đúng ý định của câu hỏi đó, rồi đối chiếu với metadata sản phẩm như concern tags, symptom tags và benefit tags.",
      "Khi kết hợp semantic search với UI giải thích kết quả, người dùng sẽ tin tưởng hơn vào hệ thống gợi ý thay vì cảm thấy kết quả chỉ là quảng cáo."
    ],
  },
] as const;

export const featuredProducts = mockProducts.slice(0, 8);
export const supplementProducts = mockProducts.filter((product) => product.category === "supplement").slice(0, 8);
export const skincareProducts = mockProducts.filter((product) => product.category === "skincare").slice(0, 8);
export const flashDealProducts = [...mockProducts]
  .sort((first, second) => (second.compareAtPrice - second.price) - (first.compareAtPrice - first.price))
  .slice(0, 4);

export function formatMockPrice(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getProductsByCategory(category: ProductCategory) {
  return mockProducts.filter((product) => product.category === category);
}

export function getProductBySlug(slug: string) {
  return mockProducts.find((product) => product.slug === slug);
}

export function getRelatedProducts(product: MockProduct, limit = 4) {
  return mockProducts
    .filter((candidate) => candidate.slug !== product.slug && candidate.category === product.category)
    .sort((first, second) => {
      const firstOverlap = first.concernTags.filter((tag) => product.concernTags.includes(tag)).length;
      const secondOverlap = second.concernTags.filter((tag) => product.concernTags.includes(tag)).length;

      if (firstOverlap !== secondOverlap) {
        return secondOverlap - firstOverlap;
      }

      return second.rating - first.rating;
    })
    .slice(0, limit);
}

export function getArticleBySlug(slug: string) {
  return mockArticles.find((article) => article.slug === slug);
}

export function getCategoryLabel(category: ProductCategory) {
  return category === "supplement" ? "Thực phẩm bổ sung" : "Chăm sóc da";
}

export function getBadgeLabel(badge: MockProduct["badge"]) {
  switch (badge) {
    case "Best seller":
      return "Bán chạy";
    case "New":
      return "Mới";
    case "AI pick":
      return "AI gợi ý";
    case "Flash deal":
      return "Giá tốt";
  }
}

export function getStockLabel(stockStatus: MockProduct["stockStatus"]) {
  return stockStatus === "in_stock" ? "Còn hàng" : "Sắp hết hàng";
}

export function searchMockProducts(query: string, category?: ProductCategory) {
  const normalizedQuery = query.trim().toLowerCase();
  const products = category ? getProductsByCategory(category) : mockProducts;

  if (!normalizedQuery) {
    return products.slice(0, 12);
  }

  return [...products]
    .map((product) => {
      const haystack = [
        product.name,
        product.brand,
        product.shortDescription,
        product.longDescription,
        product.searchableText,
        ...product.concernTags,
        ...product.benefitTags,
        ...product.symptomTags,
      ]
        .join(" ")
        .toLowerCase();

      let score = 0;

      if (product.name.toLowerCase().includes(normalizedQuery)) score += 4;
      if (product.brand.toLowerCase().includes(normalizedQuery)) score += 2;
      if (haystack.includes(normalizedQuery)) score += 3;

      for (const token of normalizedQuery.split(/\s+/)) {
        if (haystack.includes(token)) score += 1;
      }

      return { product, score };
    })
    .filter((item) => item.score > 0)
    .sort((first, second) => {
      if (first.score !== second.score) {
        return second.score - first.score;
      }

      return second.product.rating - first.product.rating;
    })
    .map((item) => item.product);
}
