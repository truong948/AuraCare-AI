export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface MockOrderItem {
  productSlug: string;
  quantity: number;
  name: string;
  price: number;
  image: string;
}

export interface MockOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  subtotal: number;
  shipping: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: MockOrderItem[];
}

// Generate some realistic past dates
const now = new Date();
const dates = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(now);
  d.setDate(d.getDate() - i);
  return d.toISOString();
});

export const mockOrders: MockOrder[] = [
  {
    id: "ord-mock-1",
    orderNumber: "AC-F8A2B9C0",
    createdAt: dates[0],
    status: "pending",
    subtotal: 1250000,
    shipping: { name: "Linh Nguyễn", email: "linh.nguyen@example.com", phone: "0901234567", address: "123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh" },
    items: [
      { productSlug: "daily-vitality-multivitamin", quantity: 2, name: "Daily Vitality Multivitamin", price: 450000, image: "https://images.unsplash.com/photo-1584308666744-24d5e12f60a5" },
      { productSlug: "night-recovery-magnesium", quantity: 1, name: "Night Recovery Magnesium", price: 350000, image: "https://images.unsplash.com/photo-1550572017-edb30d8a5624" }
    ]
  },
  {
    id: "ord-mock-2",
    orderNumber: "AC-C7B3A2D1",
    createdAt: dates[0],
    status: "processing",
    subtotal: 650000,
    shipping: { name: "An Phạm", email: "an.pham@example.com", phone: "0918765432", address: "456 Đường Nguyễn Trãi, Quận 5, TP. Hồ Chí Minh" },
    items: [
      { productSlug: "hydrating-b5-serum", quantity: 1, name: "Hydrating B5 Serum", price: 650000, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be" }
    ]
  },
  {
    id: "ord-mock-3",
    orderNumber: "AC-E4D2C9B8",
    createdAt: dates[1],
    status: "shipped",
    subtotal: 800000,
    shipping: { name: "Hoàng Vũ", email: "hoang.vu@example.com", phone: "0987654321", address: "789 Đường Láng, Quận Đống Đa, Hà Nội" },
    items: [
      { productSlug: "daily-vitality-multivitamin", quantity: 1, name: "Daily Vitality Multivitamin", price: 450000, image: "https://images.unsplash.com/photo-1584308666744-24d5e12f60a5" },
      { productSlug: "night-recovery-magnesium", quantity: 1, name: "Night Recovery Magnesium", price: 350000, image: "https://images.unsplash.com/photo-1550572017-edb30d8a5624" }
    ]
  },
  {
    id: "ord-mock-4",
    orderNumber: "AC-B2C3D4E5",
    createdAt: dates[1],
    status: "delivered",
    subtotal: 1200000,
    shipping: { name: "Trần Minh", email: "tran.minh@example.com", phone: "0977112233", address: "Số 5, Ngõ 10, Trần Phú, Hà Đông, Hà Nội" },
    items: [
      { productSlug: "pro-collagen-peptides", quantity: 2, name: "Pro Collagen Peptides", price: 600000, image: "https://images.unsplash.com/photo-1584308666744-24d5e12f60a5" }
    ]
  },
  {
    id: "ord-mock-5",
    orderNumber: "AC-A1B2C3D4",
    createdAt: dates[2],
    status: "delivered",
    subtotal: 450000,
    shipping: { name: "Lê Hoa", email: "le.hoa@example.com", phone: "0911223344", address: "Biên Hòa, Đồng Nai" },
    items: [
      { productSlug: "daily-vitality-multivitamin", quantity: 1, name: "Daily Vitality Multivitamin", price: 450000, image: "https://images.unsplash.com/photo-1584308666744-24d5e12f60a5" }
    ]
  },
  {
    id: "ord-mock-6",
    orderNumber: "AC-Z9Y8X7W6",
    createdAt: dates[2],
    status: "shipped",
    subtotal: 2300000,
    shipping: { name: "Nguyễn Hải", email: "nguyen.hai@example.com", phone: "0999888777", address: "Hải Phòng" },
    items: [
      { productSlug: "premium-skincare-set", quantity: 1, name: "Premium Skincare Set", price: 2300000, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be" }
    ]
  },
  {
    id: "ord-mock-7",
    orderNumber: "AC-M1N2O3P4",
    createdAt: dates[3],
    status: "processing",
    subtotal: 900000,
    shipping: { name: "Phạm Thúy", email: "pham.thuy@example.com", phone: "0933445566", address: "Đà Nẵng" },
    items: [
      { productSlug: "omega-3-fish-oil", quantity: 3, name: "Omega 3 Fish Oil", price: 300000, image: "https://images.unsplash.com/photo-1584308666744-24d5e12f60a5" }
    ]
  },
  {
    id: "ord-mock-8",
    orderNumber: "AC-Q5R6S7T8",
    createdAt: dates[4],
    status: "cancelled",
    subtotal: 350000,
    shipping: { name: "Đặng Nam", email: "dang.nam@example.com", phone: "0944556677", address: "Cần Thơ" },
    items: [
      { productSlug: "night-recovery-magnesium", quantity: 1, name: "Night Recovery Magnesium", price: 350000, image: "https://images.unsplash.com/photo-1550572017-edb30d8a5624" }
    ]
  },
  {
    id: "ord-mock-9",
    orderNumber: "AC-U9V0W1X2",
    createdAt: dates[5],
    status: "delivered",
    subtotal: 1500000,
    shipping: { name: "Bùi Ngọc", email: "bui.ngoc@example.com", phone: "0955667788", address: "Vũng Tàu" },
    items: [
      { productSlug: "hydrating-b5-serum", quantity: 2, name: "Hydrating B5 Serum", price: 650000, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be" },
      { productSlug: "vitamin-c-glow", quantity: 1, name: "Vitamin C Glow", price: 200000, image: "https://images.unsplash.com/photo-1584308666744-24d5e12f60a5" }
    ]
  },
  {
    id: "ord-mock-10",
    orderNumber: "AC-Y3Z4A5B6",
    createdAt: dates[6],
    status: "delivered",
    subtotal: 2100000,
    shipping: { name: "Lý Tâm", email: "ly.tam@example.com", phone: "0966778899", address: "Bình Dương" },
    items: [
      { productSlug: "premium-skincare-set", quantity: 1, name: "Premium Skincare Set", price: 2100000, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be" }
    ]
  },
  {
    id: "ord-mock-11",
    orderNumber: "AC-C7D8E9F0",
    createdAt: dates[7],
    status: "delivered",
    subtotal: 600000,
    shipping: { name: "Đỗ Đạt", email: "do.dat@example.com", phone: "0922334455", address: "Quy Nhơn" },
    items: [
      { productSlug: "pro-collagen-peptides", quantity: 1, name: "Pro Collagen Peptides", price: 600000, image: "https://images.unsplash.com/photo-1584308666744-24d5e12f60a5" }
    ]
  },
  {
    id: "ord-mock-12",
    orderNumber: "AC-G1H2I3J4",
    createdAt: dates[9],
    status: "delivered",
    subtotal: 950000,
    shipping: { name: "Võ Giang", email: "vo.giang@example.com", phone: "0988776655", address: "Đà Lạt" },
    items: [
      { productSlug: "hydrating-b5-serum", quantity: 1, name: "Hydrating B5 Serum", price: 650000, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be" },
      { productSlug: "omega-3-fish-oil", quantity: 1, name: "Omega 3 Fish Oil", price: 300000, image: "https://images.unsplash.com/photo-1584308666744-24d5e12f60a5" }
    ]
  },
  {
    id: "ord-mock-13",
    orderNumber: "AC-K5L6M7N8",
    createdAt: dates[10],
    status: "cancelled",
    subtotal: 1250000,
    shipping: { name: "Ngô Cường", email: "ngo.cuong@example.com", phone: "0933221100", address: "Nha Trang" },
    items: [
      { productSlug: "daily-vitality-multivitamin", quantity: 1, name: "Daily Vitality Multivitamin", price: 450000, image: "https://images.unsplash.com/photo-1584308666744-24d5e12f60a5" },
      { productSlug: "night-recovery-magnesium", quantity: 1, name: "Night Recovery Magnesium", price: 350000, image: "https://images.unsplash.com/photo-1550572017-edb30d8a5624" },
      { productSlug: "omega-3-fish-oil", quantity: 1, name: "Omega 3 Fish Oil", price: 450000, image: "https://images.unsplash.com/photo-1584308666744-24d5e12f60a5" }
    ]
  },
  {
    id: "ord-mock-14",
    orderNumber: "AC-O9P0Q1R2",
    createdAt: dates[11],
    status: "delivered",
    subtotal: 850000,
    shipping: { name: "Trịnh Thảo", email: "trinh.thao@example.com", phone: "0912345678", address: "Huế" },
    items: [
      { productSlug: "pro-collagen-peptides", quantity: 1, name: "Pro Collagen Peptides", price: 600000, image: "https://images.unsplash.com/photo-1584308666744-24d5e12f60a5" },
      { productSlug: "vitamin-c-glow", quantity: 1, name: "Vitamin C Glow", price: 250000, image: "https://images.unsplash.com/photo-1584308666744-24d5e12f60a5" }
    ]
  },
  {
    id: "ord-mock-15",
    orderNumber: "AC-S3T4U5V6",
    createdAt: dates[12],
    status: "delivered",
    subtotal: 1350000,
    shipping: { name: "Đinh Tài", email: "dinh.tai@example.com", phone: "0977889900", address: "Vinh" },
    items: [
      { productSlug: "premium-skincare-set", quantity: 1, name: "Premium Skincare Set", price: 1350000, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be" }
    ]
  }
];

// Helper for clients to mutate local memory state if needed
export function updateMockOrderStatus(id: string, newStatus: OrderStatus) {
  const idx = mockOrders.findIndex(o => o.id === id);
  if (idx >= 0) {
    mockOrders[idx].status = newStatus;
  }
}
