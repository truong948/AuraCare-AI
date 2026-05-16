# Phụ Lục Minh Chứng Sử Dụng AI Tool

Môn học: Các công nghệ mới trong phát triển phần mềm  
Dự án: AuraCare AI - Website thương mại điện tử sức khỏe tích hợp AI  
Mục đích: Ghi lại các prompt tiêu biểu đã dùng trong quá trình phân tích, thiết kế, lập trình, kiểm thử và hoàn thiện báo cáo.

## 1. Prompt Lập Kế Hoạch Tổng Thể

Prompt:
> Bạn là lập trình viên web, AI, machine learning nhiều năm kinh nghiệm. Hãy giúp tôi phác thảo dự án website thương mại điện tử sản phẩm chăm sóc sức khỏe, có tích hợp AI chăm sóc khách hàng, gợi ý sản phẩm, semantic search. Dự án học thuật, tham khảo mô hình nhà thuốc điện tử nhưng không sao chép.

Lý do sử dụng:
- Cần xác định phạm vi đề tài phù hợp môn học.
- Cần tách rõ phase phát triển, công nghệ, dữ liệu, AI feature.

Kết quả:
- Chốt hướng AuraCare AI.
- Chọn Next.js, Tailwind, shadcn/ui, Supabase, Gemini embedding.
- Chọn nhóm sản phẩm Phase 1: supplement và skincare.

## 2. Prompt Thiết Kế Kiến Trúc

Prompt:
> Hãy xây dựng README chi tiết cho dự án AuraCare AI để các AI model khác có thể tiếp tục thực hiện. Bao gồm kiến trúc, ERD, API, AI/ML flow, roadmap, yêu cầu frontend/admin.

Lý do sử dụng:
- Tạo tài liệu nền làm source of truth.
- Giúp quá trình phát triển nhiều lượt không mất định hướng.

Kết quả:
- Tạo README tổng quan.
- Tạo docs architecture, ERD, API spec, roadmap.
- Xác định module storefront, admin, AI service, data model.

## 3. Prompt Xây Dựng UI Storefront

Prompt:
> Hãy sửa lại giao diện, dùng template trong thư mục temple để làm giao diện đẹp hơn, đơn giản hơn, tiếng Việt là chính, có nhiều trang và thanh nav chuyển được giữa các trang.

Lý do sử dụng:
- Website ban đầu còn giống dashboard, chưa giống ecommerce.
- Cần chuyển sang giao diện cửa hàng rõ ràng.

Kết quả:
- Tạo storefront header/footer.
- Tạo trang chủ, catalog, category, PDP, wishlist, compare.
- Tối ưu tiếng Việt và visual direction Clean Clinical.

## 4. Prompt Dữ Liệu Mẫu Và Catalog

Prompt:
> Hãy dựng mock dataset 60 sản phẩm gồm 30 supplement và 30 skincare, có concern_tags, symptom_tags, benefit_tags, pricing, variants, embedding_vector placeholder.

Lý do sử dụng:
- Cần dữ liệu đủ phong phú để test search, recommendation, AI Q&A.
- Cần schema thống nhất trước khi seed Supabase.

Kết quả:
- Tạo catalog mock đầy đủ metadata.
- Tạo UI category/PDP dựa trên dữ liệu mock.
- Chuẩn bị cho enrichment embedding.

## 5. Prompt AI MVP Phase 4

Prompt:
> Bắt đầu Phase 4: semantic search API thật với Gemini embedding + pgvector, chatbot FAQ/product Q&A mock API, rule-based recommendation engine cho home/PDP/cart.

Lý do sử dụng:
- Cần thể hiện công nghệ mới và AI trong sản phẩm.
- Cần chức năng AI có thể demo trực tiếp.

Kết quả:
- Tạo `/api/search`, `/api/chat`.
- Tạo semantic search fallback và pgvector-ready flow.
- Tạo product AI assistant trên PDP.
- Tạo recommendation shelves.

## 6. Prompt Personalization Analytics

Prompt:
> Mở rộng personalization ranking để dùng mạnh hơn recently viewed, wishlist, cart và bổ sung analytics breakdown theo từng nguồn tín hiệu trong AI Ops.

Lý do sử dụng:
- Cần thể hiện hướng machine learning/personalization.
- Cần bề mặt admin để giải thích vì sao AI gợi ý sản phẩm.

Kết quả:
- Tạo personalized shelf.
- Log recommendation events.
- Tạo AI Ops dashboard breakdown theo signal source.

## 7. Prompt Evaluation Và Safety

Prompt:
> Tiếp tục Phase 6 và 7: recommendation evaluation, personalization experiment runner, chatbot safety benchmark, AI readiness report, test và sửa lỗi.

Lý do sử dụng:
- Cần nâng dự án từ demo UI sang có khả năng đánh giá AI.
- Cần guardrail vì domain liên quan sức khỏe.

Kết quả:
- Tạo API recommendation evaluation.
- Tạo safety benchmark cho chatbot.
- Tạo AI readiness report.
- Thêm evaluation history snapshots.

## 8. Prompt Hoàn Thiện Commerce MVP

Prompt:
> Tiếp tục hoàn thành dự án: bổ sung order detail, admin order operations, navigation thống nhất cho cart, checkout, orders, test build và route.

Lý do sử dụng:
- Dự án cần demo end-to-end như ecommerce thật.
- Cần admin có thể theo dõi đơn hàng.

Kết quả:
- Tạo `/orders/[id]`.
- Tạo `/dashboard/orders`.
- Thêm trạng thái đơn hàng mock.
- Test route chính trả HTTP 200.

## 9. Prompt Đối Chiếu Quy Chế Cuối Kỳ

Prompt:
> Hãy kiểm tra dự án của tôi có đáp ứng toàn bộ yêu cầu trong file quy chế thi cuối kỳ không.

Lý do sử dụng:
- Cần audit dự án theo tiêu chí chính thức.
- Cần phát hiện thiếu Docker, deployment, báo cáo, RLS.

Kết quả:
- Xác định dự án đạt frontend, AI, tài liệu kỹ thuật.
- Xác định thiếu Docker, deploy, báo cáo PDF/Word, prompt appendix, commerce Supabase schema.

## 10. Prompt Hoàn Thiện Hồ Sơ Nộp Bài

Prompt:
> Thêm Dockerfile + docker-compose, viết báo cáo Word/PDF, tạo phụ lục AI prompts, tạo Supabase schema products/orders/order_items/RLS, chạy test cuối.

Lý do sử dụng:
- Cần chuyển dự án từ prototype sang hồ sơ nộp cuối kỳ.
- Cần bổ sung các yêu cầu bắt buộc còn thiếu.

Kết quả:
- Tạo Dockerfile, docker-compose.
- Tạo schema Supabase commerce core.
- Tạo báo cáo và phụ lục prompt.
- Chạy build/typecheck/test route local.

## 11. Nhận Xét Về Hiệu Quả Sử Dụng AI

AI tool giúp tăng tốc ở các phần:
- Phân tích yêu cầu và chia phase.
- Sinh skeleton UI nhanh.
- Gợi ý kiến trúc AI/search/recommendation.
- Phát hiện thiếu sót khi đối chiếu quy chế.
- Tạo tài liệu kỹ thuật và checklist triển khai.

Các phần vẫn cần con người quyết định:
- Phạm vi đề tài.
- Rủi ro pháp lý/y tế.
- Thiết kế database cuối cùng.
- Credential Supabase/Gemini/VPS.
- Kiểm thử trực tiếp trên URL production.

## 12. Kết Luận Phụ Lục

Dự án đã sử dụng AI tool như một trợ lý phân tích, lập trình, kiểm thử và viết tài liệu. Các prompt không thay thế hoàn toàn vai trò lập trình viên; người thực hiện vẫn phải đọc, chọn phương án, chạy test, sửa lỗi, và chịu trách nhiệm về kết quả cuối cùng.
