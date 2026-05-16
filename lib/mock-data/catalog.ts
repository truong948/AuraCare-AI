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

const countries = ["Japan", "Korea", "Australia", "USA", "France"];
const supplementBadges: MockProduct["badge"][] = ["Best seller", "AI pick", "Flash deal"];
const skincareBadges: MockProduct["badge"][] = ["New", "AI pick", "Best seller"];

interface RealProductAsset {
  brand: string;
  name: string;
  sizes: [string, string, string];
  image: string;
}

const realSupplementProducts: RealProductAsset[] = [
  {
    brand: "Nature Made",
    name: "Zero Sugar Energy B12 Gummies",
    sizes: ["60 gummies", "90 gummies", "120 gummies"],
    image: "https://cdn.shopify.com/s/files/1/0066/7569/3639/files/NMHL000385PK001945ZEROSUGARB12GUMMIES_5A008300ccfront.png?v=1756999567",
  },
  {
    brand: "Nature Made",
    name: "Melatonin 3 mg + Magnesium Sleep Gummies",
    sizes: ["30 gummies", "60 gummies", "90 gummies"],
    image: "https://cdn.shopify.com/s/files/1/0066/7569/3639/files/NMHL000736PK002707MELATONINMAGNESIUMGUMMIES_300cc5A008frontnf.png?v=1766510235",
  },
  {
    brand: "Nature Made",
    name: "Probiotic + Prebiotic Fiber Gummies",
    sizes: ["50 gummies", "80 gummies", "120 gummies"],
    image: "https://cdn.shopify.com/s/files/1/0066/7569/3639/files/NMHL000585PK002247PROBIOTICPREBIOTICFIBERGUMMIES_5A008300ccfrontnf.png?v=1741619813",
  },
  {
    brand: "Nature Made",
    name: "Zero Sugar Vitamin C Gummies",
    sizes: ["60 gummies", "90 gummies", "120 gummies"],
    image: "https://cdn.shopify.com/s/files/1/0066/7569/3639/files/NM_HL000383_PK002563_ZERO_SUGAR_VIT_C_GUMMIES_5A009_500cc_front_nf.png?v=1770753876",
  },
  {
    brand: "Nature Made",
    name: "Focus Boost Capsules",
    sizes: ["30 capsules", "60 capsules", "90 capsules"],
    image: "https://cdn.shopify.com/s/files/1/0066/7569/3639/files/NMHL000739PK002600FOCUSBOOST_5A044150ccfrontnf.png?v=1766510129",
  },
  {
    brand: "Nature Made",
    name: "Collagen Peptides + C Gummies",
    sizes: ["60 gummies", "90 gummies", "120 gummies"],
    image: "https://cdn.shopify.com/s/files/1/0066/7569/3639/files/NM_HL000744_PK002845_COLLAGEN_GUMMIES_5A009_400cc_front_nf.png?v=1777234288",
  },
  {
    brand: "Nature Made",
    name: "Glucosamine Chondroitin Complex with MSM",
    sizes: ["60 tablets", "90 tablets", "120 tablets"],
    image: "https://cdn.shopify.com/s/files/1/0066/7569/3639/files/NMHL000055PK002321GLUCOSAMINECHONDCOMPLEXMSM_5A008300ccfront.png?v=1757005867",
  },
  {
    brand: "Nature Made",
    name: "Fish Oil 1000 mg Softgels",
    sizes: ["100 softgels", "150 softgels", "200 softgels"],
    image: "https://cdn.shopify.com/s/files/1/0066/7569/3639/files/NM2662PK000743FISHOIL_5A008300ccfront.png?v=1695678872",
  },
  {
    brand: "Nature Made",
    name: "Iron 18 mg Gummies with Vitamin C",
    sizes: ["60 gummies", "90 gummies", "120 gummies"],
    image: "https://cdn.shopify.com/s/files/1/0066/7569/3639/files/NM3284PK001267IRONGUMMIESfront.png?v=1695678574",
  },
  {
    brand: "Nuun",
    name: "Nuun Sport Electrolyte Tablets",
    sizes: ["10 tablets", "20 tablets", "30 tablets"],
    image: "https://nuunlife.com/cdn/shop/files/Nuun_Tube_Upright_withTabs_Strawberry_lemonade_web_1200x1200.png?v=1744037007",
  },
];
const realSkincareProducts: RealProductAsset[] = [
  {
    brand: "CeraVe",
    name: "Hydrating Hyaluronic Acid Serum",
    sizes: ["30 ml", "50 ml", "75 ml"],
    image: "https://www.cerave.com/-/media/project/loreal/brand-sites/cerave/americas/us/products/hydrating-hyaluronic-acid-serum/700x700/hydrating-hyaluronic-acid-serum-front-700x700-v1.jpg?rev=7e9d7479b01940a39f84ffec62dca5ba",
  },
  {
    brand: "CeraVe",
    name: "Moisturizing Cream",
    sizes: ["56 g", "340 g", "453 g"],
    image: "https://www.cerave.com/-/media/project/loreal/brand-sites/cerave/americas/us/products-v4/moisturizing-cream/cerave_moisturizing_cream_16oz_jar_front-700x700-v3.jpg?rev=7e37e9cc45754615b1532d77df5a0b52",
  },
  {
    brand: "CeraVe",
    name: "Acne Foaming Cream Cleanser",
    sizes: ["89 ml", "150 ml", "236 ml"],
    image: "https://www.cerave.com/-/media/project/loreal/brand-sites/cerave/americas/us/skincare/cleansers/acne-pdp-resizes/foaming-cleanser/acne-foaming-cleanser-tube-packshot-700x785-v1.jpg?rev=a5e2960fd1bf4bceb9a3f31d44fa740f",
  },
  {
    brand: "The Ordinary",
    name: "Niacinamide 10% + Zinc 1% Serum",
    sizes: ["30 ml", "60 ml", "120 ml"],
    image: "https://theordinary.com/dw/image/v2/BFKJ_PRD/on/demandware.static/-/Sites-deciem-master/default/dwce8a7cdf/Images/products/The%20Ordinary/rdn-niacinamide-10pct-zinc-1pct-30ml.png?sw=900&sh=900&sm=fit",
  },
  {
    brand: "The Ordinary",
    name: "Natural Moisturizing Factors + HA",
    sizes: ["30 ml", "100 ml", "150 ml"],
    image: "https://theordinary.com/dw/image/v2/BFKJ_PRD/on/demandware.static/-/Sites-deciem-master/default/dw51f90af8/Images/products/The%20Ordinary/rdn-natural-moisturizing-factors-ha-30ml.png?sw=900&sh=900&sm=fit",
  },
  {
    brand: "The Ordinary",
    name: "Retinal 0.2% Emulsion",
    sizes: ["15 ml", "30 ml", "50 ml"],
    image: "https://theordinary.com/dw/image/v2/BFKJ_PRD/on/demandware.static/-/Sites-deciem-master/default/dwa863ca2c/Images/products/The%20Ordinary/ord-retinal-02-emulsion-15ml.png?sw=900&sh=900&sm=fit",
  },
  {
    brand: "CeraVe",
    name: "Hydrating Mineral Sunscreen SPF 50",
    sizes: ["50 ml", "75 ml", "100 ml"],
    image: "https://www.cerave.com/-/media/project/loreal/brand-sites/cerave/americas/us/sunscreen/face/50-spf-face/50-spf-face_front.jpg?rev=876337554bf7423bb530d2f754cb9e78",
  },
  {
    brand: "CeraVe",
    name: "Healing Ointment",
    sizes: ["42 g", "85 g", "340 g"],
    image: "https://www.cerave.com/-/media/project/loreal/brand-sites/cerave/americas/us/skincare/moisturizers/healing-ointment/2025/healing-ointment_front.jpg?rev=c41d50fa05b34fa59e5affe3b389b681",
  },
  {
    brand: "Paula's Choice",
    name: "Skin Perfecting 2% BHA Liquid Exfoliant",
    sizes: ["30 ml", "118 ml", "236 ml"],
    image: "https://www.paulaschoice.com/dw/image/v2/BBNX_PRD/on/demandware.static/-/Sites-pc-catalog/default/dw006e394e/images/products/2-percent-bha-liquid-exfoliant-2010-portrait.png?sw=1000&sfrm=png",
  },
  {
    brand: "The Ordinary",
    name: "Caffeine Solution 5% + EGCG",
    sizes: ["30 ml", "60 ml", "90 ml"],
    image: "https://theordinary.com/dw/image/v2/BFKJ_PRD/on/demandware.static/-/Sites-deciem-master/default/dwd2b40942/Images/products/The%20Ordinary/rdn-caffeine-solution-5pct-egcg-30ml.png?sw=900&sh=900&sm=fit",
  },
];
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
      const realProduct = realSupplementProducts[itemIndex];
      const size = realProduct.sizes[variantIndex];
      const price = 260000 + itemIndex * 35000 + variantIndex * 40000;
      const compareAtPrice = price + 70000;
      const brand = realProduct.brand;
      const benefitName = formatTitle(item.benefit.replace(/\s+/g, "-"));

      return {
        id,
        slug: `${id}-${item.concern}-${variantIndex + 1}`,
        name: `${realProduct.name} ${size}`,
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
        image: realProduct.image,
        embeddingVector: null,
      } satisfies MockProduct;
    })
  );
}

function buildSkincareProducts() {
  return skincareBase.flatMap((item, itemIndex) =>
    Array.from({ length: 3 }, (_, variantIndex) => {
      const id = `skin-${itemIndex + 1}-${variantIndex + 1}`;
      const realProduct = realSkincareProducts[itemIndex];
      const size = realProduct.sizes[variantIndex];
      const price = 320000 + itemIndex * 45000 + variantIndex * 50000;
      const compareAtPrice = price + 90000;
      const brand = realProduct.brand;
      const benefitName = formatTitle(item.benefit.replace(/\s+/g, "-"));

      return {
        id,
        slug: `${id}-${item.concern}-${variantIndex + 1}`,
        name: `${realProduct.name} ${size}`,
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
        image: realProduct.image,
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
