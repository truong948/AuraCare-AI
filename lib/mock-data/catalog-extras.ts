import type { MockProduct } from "./catalog";

function generateMockProducts(
  category: "medicine" | "personal-care" | "medical-devices",
  count: number,
  startId: number
): MockProduct[] {
  const brands = {
    medicine: ["Panadol", "Tiffy", "Decolgen", "Strepsils", "Berberin", "Smecta", "Efferalgan", "Oresol", "Eugica"],
    "personal-care": ["Dove", "Lifebuoy", "Clear", "Sunsilk", "Colgate", "P/S", "Listerine", "Nivea", "Romano"],
    "medical-devices": ["Omron", "Microlife", "Beurer", "Roche", "Braun", "Yuwell", "Sinocare"]
  };

  const images = {
    medicine: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1550572017-edb4b6099df3?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=600&q=80"
    ],
    "personal-care": [
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1571781926291-c477eb31f8d4?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1555820598-c167449c2560?auto=format&fit=crop&w=600&q=80"
    ],
    "medical-devices": [
      "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1583947581924-860bda6a45df?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1516245836540-1c60d922ce07?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80"
    ]
  };

  const names = {
    medicine: ["Giảm đau hạ sốt", "Trị cảm cúm", "Viên ngậm ho", "Hỗ trợ tiêu hóa", "Bù nước điện giải", "Trị viêm họng"],
    "personal-care": ["Sữa tắm trắng da", "Dầu gội sạch gàu", "Kem đánh răng ngừa sâu răng", "Nước súc miệng thảo dược", "Lăn khử mùi", "Sữa rửa mặt tạo bọt"],
    "medical-devices": ["Máy đo huyết áp bắp tay", "Nhiệt kế hồng ngoại đo trán", "Máy đo đường huyết", "Que thử đường huyết", "Máy xông mũi họng", "Cân sức khỏe điện tử"]
  };

  const descriptions = {
    medicine: "Sản phẩm chất lượng cao giúp giảm nhanh các triệu chứng thông thường, mang lại cảm giác thoải mái và an toàn cho sức khỏe gia đình bạn.",
    "personal-care": "Chăm sóc cơ thể mỗi ngày với công thức an toàn, làm sạch nhẹ nhàng và bảo vệ làn da, mái tóc của bạn trước các tác nhân từ môi trường.",
    "medical-devices": "Thiết bị y tế độ chính xác cao, đạt chuẩn quốc tế, giúp bạn dễ dàng theo dõi sức khỏe tại nhà cho mọi thành viên trong gia đình."
  };

  const products: MockProduct[] = [];
  const categoryBrands = brands[category];
  const categoryNames = names[category];
  const categoryImages = images[category];
  
  for (let i = 0; i < count; i++) {
    const id = `${category}-${startId + i}`;
    const brand = categoryBrands[i % categoryBrands.length];
    const name = categoryNames[i % categoryNames.length] + " " + (i + 1);
    const image = categoryImages[i % categoryImages.length];

    // Hàm tạo số ngẫu nhiên deterministic dựa trên chuỗi id và offset
    const random = (seedOffset: number) => {
      let hash = 0;
      const seedStr = `${id}-${seedOffset}`;
      for (let j = 0; j < seedStr.length; j++) {
        hash = seedStr.charCodeAt(j) + ((hash << 5) - hash);
      }
      const x = Math.sin(hash) * 10000;
      return x - Math.floor(x);
    };

    const price = 50000 + Math.floor(random(1) * 500000);
    const compareAtPrice = price + Math.floor(random(2) * 50000);
    const stockStatus = random(3) > 0.8 ? "low_stock" : "in_stock";
    const rating = 4 + random(4);
    const reviewCount = Math.floor(random(5) * 500);
    const countries = ["Vietnam", "Japan", "USA", "France", "Germany"];
    const originCountry = countries[Math.floor(random(6) * countries.length)];
    const badges = ["Best seller", "New", "Flash deal", "AI pick"];
    const badge = badges[Math.floor(random(7) * badges.length)] as any;
    
    products.push({
      id: id,
      slug: `${category}-${startId + i}-${name.toLowerCase().replace(/\s+/g, "-")}`,
      name: `${brand} - ${name}`,
      brand: brand,
      category: category,
      shortDescription: descriptions[category],
      longDescription: `Sản phẩm ${name} của thương hiệu ${brand}. ${descriptions[category]}`,
      price: price,
      compareAtPrice: compareAtPrice,
      stockStatus: stockStatus,
      packageSize: category === "medicine" ? "Hộp 10 vỉ" : category === "personal-care" ? "Chai 500ml" : "1 bộ",
      ingredientsText: "Thành phần an toàn, đã được kiểm nghiệm.",
      usageInstructions: "Đọc kỹ hướng dẫn sử dụng trước khi dùng.",
      warnings: "Để xa tầm tay trẻ em.",
      concernTags: [category],
      symptomTags: ["general"],
      benefitTags: ["health"],
      searchableText: `${brand} ${name} ${category}`,
      rating: rating,
      reviewCount: reviewCount,
      originCountry: originCountry,
      badge: badge,
      image: image,
      embeddingVector: null
    });
  }
  
  return products;
}

export const extraProducts: MockProduct[] = [
  ...generateMockProducts("medicine", 50, 1),
  ...generateMockProducts("personal-care", 50, 1),
  ...generateMockProducts("medical-devices", 50, 1)
];
