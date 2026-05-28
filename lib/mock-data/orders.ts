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
  status: "pending" | "processing" | "completed";
  subtotal: number;
  shipping: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: MockOrderItem[];
}

export const mockOrders: MockOrder[] = [
  {
    id: "ord-mock-1",
    orderNumber: "AC-F8A2B9C0",
    createdAt: "2026-05-26T14:30:00Z",
    status: "completed",
    subtotal: 1250000,
    shipping: {
      name: "Linh Nguyễn",
      email: "linh.nguyen@example.com",
      phone: "0901234567",
      address: "123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh"
    },
    items: [
      {
        productSlug: "daily-vitality-multivitamin",
        quantity: 2,
        name: "Daily Vitality Multivitamin",
        price: 450000,
        image: ""
      },
      {
        productSlug: "night-recovery-magnesium",
        quantity: 1,
        name: "Night Recovery Magnesium",
        price: 350000,
        image: ""
      }
    ]
  },
  {
    id: "ord-mock-2",
    orderNumber: "AC-C7B3A2D1",
    createdAt: "2026-05-27T10:15:00Z",
    status: "processing",
    subtotal: 650000,
    shipping: {
      name: "An Phạm",
      email: "an.pham@example.com",
      phone: "0918765432",
      address: "456 Đường Nguyễn Trãi, Quận 5, TP. Hồ Chí Minh"
    },
    items: [
      {
        productSlug: "hydrating-b5-serum",
        quantity: 1,
        name: "Hydrating B5 Serum",
        price: 650000,
        image: ""
      }
    ]
  },
  {
    id: "ord-mock-3",
    orderNumber: "AC-E4D2C9B8",
    createdAt: "2026-05-28T08:00:00Z",
    status: "pending",
    subtotal: 800000,
    shipping: {
      name: "Hoàng Vũ",
      email: "hoang.vu@example.com",
      phone: "0987654321",
      address: "789 Đường Láng, Quận Đống Đa, Hà Nội"
    },
    items: [
      {
        productSlug: "daily-vitality-multivitamin",
        quantity: 1,
        name: "Daily Vitality Multivitamin",
        price: 450000,
        image: ""
      },
      {
        productSlug: "night-recovery-magnesium",
        quantity: 1,
        name: "Night Recovery Magnesium",
        price: 350000,
        image: ""
      }
    ]
  }
];
