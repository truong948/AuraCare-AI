export interface ProductFeedback {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const mockFeedbacks: ProductFeedback[] = [
  {
    id: "fb-1",
    productId: "prod-1",
    productSlug: "daily-vitality-multivitamin",
    productName: "Daily Vitality Multivitamin",
    userId: "user-1",
    userName: "Linh Nguyễn",
    rating: 5,
    comment: "Sản phẩm bổ sung năng lượng rất tốt, giảm hẳn mệt mỏi vào buổi chiều sau khi dùng được 2 tuần.",
    createdAt: "2026-05-20T08:30:00Z"
  },
  {
    id: "fb-2",
    productId: "prod-1",
    productSlug: "daily-vitality-multivitamin",
    productName: "Daily Vitality Multivitamin",
    userId: "user-2",
    userName: "Minh Trần",
    rating: 4,
    comment: "Dễ uống, đóng gói cẩn thận. Tuy nhiên nên uống sau ăn no vì có sắt dễ cồn cào nhẹ.",
    createdAt: "2026-05-22T10:15:00Z"
  },
  {
    id: "fb-3",
    productId: "prod-2",
    productSlug: "night-recovery-magnesium",
    productName: "Night Recovery Magnesium",
    userId: "user-3",
    userName: "An Phạm",
    rating: 5,
    comment: "Gummies vị ngon, giúp ngủ sâu giấc hơn hẳn. Mình dùng trước khi ngủ 30p thấy hiệu quả rõ rệt.",
    createdAt: "2026-05-24T22:00:00Z"
  },
  {
    id: "fb-4",
    productId: "prod-6",
    productSlug: "hydrating-b5-serum",
    productName: "Hydrating B5 Serum",
    userId: "user-4",
    userName: "Hoàng Vũ",
    rating: 5,
    comment: "Serum thấm nhanh, không bết rít. Da nhạy cảm của mình không bị kích ứng chút nào. Cấp ẩm sâu tuyệt vời!",
    createdAt: "2026-05-25T14:40:00Z"
  },
  {
    id: "fb-5",
    productId: "prod-6",
    productSlug: "hydrating-b5-serum",
    productName: "Hydrating B5 Serum",
    userId: "user-5",
    userName: "Phương Lê",
    rating: 3,
    comment: "Cấp ẩm tạm ổn nhưng dung tích hơi ít so với giá tiền. Dùng hao nhanh.",
    createdAt: "2026-05-26T09:12:00Z"
  }
];

// Local state fallback for client-side modifications in development
let clientFeedbacks: ProductFeedback[] = [...mockFeedbacks];

export function getLocalFeedbacks(productId?: string): ProductFeedback[] {
  if (productId) {
    return clientFeedbacks.filter(f => f.productId === productId || f.productSlug === productId);
  }
  return clientFeedbacks;
}

export function addLocalFeedback(feedback: Omit<ProductFeedback, "id" | "createdAt">): ProductFeedback {
  const newFeedback: ProductFeedback = {
    ...feedback,
    id: `fb-local-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  clientFeedbacks = [newFeedback, ...clientFeedbacks];
  return newFeedback;
}

export function deleteLocalFeedback(id: string): boolean {
  const initialLength = clientFeedbacks.length;
  clientFeedbacks = clientFeedbacks.filter(f => f.id !== id);
  return clientFeedbacks.length < initialLength;
}
