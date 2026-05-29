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
    medicine: "https://cdn.shopify.com/s/files/1/0066/7569/3639/files/NMHL000385PK001945ZEROSUGARB12GUMMIES_5A008300ccfront.png?v=1756999567",
    "personal-care": "https://www.cerave.com/-/media/project/loreal/brand-sites/cerave/americas/us/products-v4/moisturizing-cream/cerave_moisturizing_cream_16oz_jar_front-700x700-v3.jpg?rev=7e37e9cc45754615b1532d77df5a0b52",
    "medical-devices": "https://nuunlife.com/cdn/shop/files/Nuun_Tube_Upright_withTabs_Strawberry_lemonade_web_1200x1200.png?v=1744037007"
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
  
  for (let i = 0; i < count; i++) {
    const brand = categoryBrands[i % categoryBrands.length];
    const name = categoryNames[i % categoryNames.length] + " " + (i + 1);
    const price = 50000 + Math.floor(Math.random() * 500000);
    
    products.push({
      id: `${category}-${startId + i}`,
      slug: `${category}-${startId + i}-${name.toLowerCase().replace(/\s+/g, "-")}`,
      name: `${brand} - ${name}`,
      brand: brand,
      category: category,
      shortDescription: descriptions[category],
      longDescription: `Sản phẩm ${name} của thương hiệu ${brand}. ${descriptions[category]}`,
      price: price,
      compareAtPrice: price + (Math.floor(Math.random() * 50000)),
      stockStatus: Math.random() > 0.8 ? "low_stock" : "in_stock",
      packageSize: category === "medicine" ? "Hộp 10 vỉ" : category === "personal-care" ? "Chai 500ml" : "1 bộ",
      ingredientsText: "Thành phần an toàn, đã được kiểm nghiệm.",
      usageInstructions: "Đọc kỹ hướng dẫn sử dụng trước khi dùng.",
      warnings: "Để xa tầm tay trẻ em.",
      concernTags: [category],
      symptomTags: ["general"],
      benefitTags: ["health"],
      searchableText: `${brand} ${name} ${category}`,
      rating: 4 + Math.random(),
      reviewCount: Math.floor(Math.random() * 500),
      originCountry: ["Vietnam", "Japan", "USA", "France", "Germany"][Math.floor(Math.random() * 5)],
      badge: ["Best seller", "New", "Flash deal", "AI pick"][Math.floor(Math.random() * 4)] as any,
      image: `https://placehold.co/600x600/0d9488/ffffff?text=${encodeURIComponent(name.split(" ").slice(0, 3).join(" "))}`,
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
