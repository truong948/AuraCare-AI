export interface MockConsultation {
  id: string;
  userId: string | null;
  userEmail: string;
  userFullName: string;
  skinConcern: string;
  description: string;
  aiSummary: {
    analysis: string;
    routine: string[];
    explanation: string;
  };
  createdAt: string;
}

export const mockConsultations: MockConsultation[] = [
  {
    id: "consult-1",
    userId: "user-1",
    userEmail: "linh.nguyen@example.com",
    userFullName: "Linh Nguyễn",
    skinConcern: "Da khô ráp và sần sùi",
    description: "Da mình dạo này rất khô, sờ vào ráp ráp ở hai bên má và có bong tróc nhẹ khi trang điểm.",
    aiSummary: {
      analysis: "Lớp sừng biểu bì bị thiếu hụt lipid tự nhiên và nhân tố ẩm tự nhiên (NMF), dẫn đến mất nước qua da (TEWL).",
      routine: [
        "Sữa rửa mặt dịu nhẹ cấp ẩm Hydrating Cleanser",
        "Hydrating B5 Serum (Hyaluronic Acid + B5)",
        "Kem dưỡng Barrier Repair Cream để phục hồi hàng rào bảo vệ"
      ],
      explanation: "Routine tập trung cấp nước sâu bằng serum hyaluronic acid kết hợp khóa ẩm bằng kem dưỡng nhiều ceramide để khôi phục lớp sừng bảo vệ da."
    },
    createdAt: "2026-05-27T14:30:00Z"
  },
  {
    id: "consult-2",
    userId: "user-4",
    userEmail: "hoang.vu@example.com",
    userFullName: "Hoàng Vũ",
    skinConcern: "Da tiết nhiều dầu và mụn cám",
    description: "Vùng chữ T tiết dầu cực nhiều, lỗ chân lông to và thường xuyên nổi mụn đầu đen, mụn cám li ti.",
    aiSummary: {
      analysis: "Tuyến bã nhờn hoạt động quá mức do thiếu ẩm bề mặt hoặc sừng hóa cổ nang lông gây tắc nghẽn.",
      routine: [
        "Sữa rửa mặt chứa BHA/Salicylic Acid",
        "Tinh chất Niacinamide 10% để kiểm soát bã nhờn và se khít lỗ chân lông",
        "Gel dưỡng ẩm mỏng nhẹ Oil-Free Gel Lotion"
      ],
      explanation: "Sử dụng BHA để làm sạch sâu cổ nang lông, kết hợp Niacinamide điều tiết hoạt động của tuyến bã nhờn giúp da thông thoáng và giảm mụn."
    },
    createdAt: "2026-05-28T09:15:00Z"
  }
];

let clientConsultations: MockConsultation[] = [...mockConsultations];

export function getLocalConsultations(): MockConsultation[] {
  return clientConsultations;
}

export function addLocalConsultation(consultation: Omit<MockConsultation, "id" | "createdAt">): MockConsultation {
  const newConsult: MockConsultation = {
    ...consultation,
    id: `consult-local-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  clientConsultations = [newConsult, ...clientConsultations];
  return newConsult;
}
