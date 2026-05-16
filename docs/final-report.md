# BÁO CÁO ĐỒ ÁN CUỐI KỲ

Môn học: Các công nghệ mới trong phát triển phần mềm  
Đề tài: AuraCare AI - Website thương mại điện tử sản phẩm chăm sóc sức khỏe tích hợp AI  
Công nghệ chính: Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, Supabase, Gemini AI, Docker  

<!-- pagebreak -->

## 1. Giới Thiệu Đề Tài

AuraCare AI là một website thương mại điện tử học thuật trong lĩnh vực sản phẩm chăm sóc sức khỏe, tập trung vào hai nhóm sản phẩm: thực phẩm bổ sung và chăm sóc da. Dự án được xây dựng với mục tiêu mô phỏng một hệ thống ecommerce hiện đại có tích hợp trí tuệ nhân tạo để hỗ trợ tìm kiếm, tư vấn sản phẩm, gợi ý cá nhân hóa và phân tích vận hành AI.

Bối cảnh của đề tài xuất phát từ nhu cầu người dùng thường gặp khi mua sản phẩm sức khỏe trực tuyến: quá nhiều sản phẩm, khó hiểu thành phần, khó biết sản phẩm nào phù hợp với nhu cầu cá nhân, và thiếu một trợ lý hỗ trợ tức thời. AuraCare AI giải quyết vấn đề này bằng cách kết hợp giao diện storefront rõ ràng với các lớp AI như chatbot, semantic search, rule-based recommendation và AI Ops dashboard.

Đây là dự án học thuật, không nhằm mục đích kinh doanh thật và không sao chép giao diện hoặc dữ liệu từ một nhà thuốc cụ thể. Các website nhà thuốc điện tử lớn tại Việt Nam chỉ được dùng làm nguồn tham khảo về mô hình nghiệp vụ và luồng trải nghiệm người dùng.

## 2. Mục Tiêu Dự Án

Mục tiêu kỹ thuật:
- Xây dựng ứng dụng web full-stack bằng Next.js App Router và TypeScript.
- Thiết kế giao diện hiện đại, responsive bằng Tailwind CSS và shadcn/ui.
- Tích hợp Supabase cho authentication, database, RLS và storage.
- Tạo nền tảng AI gồm chatbot, semantic search, recommendation và analytics.
- Đóng gói ứng dụng bằng Docker để có thể chạy bằng `docker compose up`.
- Chuẩn bị quy trình triển khai production qua VPS, domain và SSL.

Mục tiêu nghiệp vụ:
- Cho phép người dùng duyệt sản phẩm, xem chi tiết, thêm vào giỏ, thanh toán mock và xem đơn hàng.
- Cho phép admin xem dashboard, quản lý sản phẩm mock, quản lý đơn hàng và giám sát AI.
- Cho phép người dùng nhận tư vấn sản phẩm dựa trên nhu cầu.
- Cho phép hệ thống ghi nhận tín hiệu hành vi như recently viewed, wishlist và cart để cá nhân hóa.

Mục tiêu học thuật:
- Thực hành kiến trúc web hiện đại.
- Thực hành Supabase Auth, RLS, Storage và schema PostgreSQL.
- Thực hành Docker hóa ứng dụng Next.js.
- Thực hành sử dụng AI tool trong phát triển phần mềm.
- Thực hành thiết kế AI safety và evaluation dashboard.

<!-- pagebreak -->

## 3. Công Nghệ Sử Dụng

### 3.1. Next.js App Router

Dự án sử dụng Next.js với App Router. Các route chính được tổ chức trong thư mục `app`, bao gồm storefront, dashboard, API routes và các trang dynamic như `/products/[slug]`, `/categories/[category]`, `/orders/[id]`.

Các thành phần App Router đã được sử dụng:
- Server Components cho các trang đọc dữ liệu tĩnh/mock hoặc server-side.
- Client Components cho cart, wishlist, compare, chatbot widget và dashboard tương tác.
- API Routes cho search, chat, products, AI readiness và evaluation.
- Dynamic routes cho product detail, article detail và order detail.

### 3.2. TypeScript

TypeScript được sử dụng trong toàn bộ codebase. Các type domain chính gồm product, cart item, order, AI search payload, chat payload, recommendation item và AI readiness report.

Lệnh kiểm tra:

```bash
npm run typecheck
```

Kết quả hiện tại: pass.

### 3.3. Tailwind CSS và shadcn/ui

Giao diện được xây dựng bằng Tailwind CSS và các component shadcn/ui như Button, Card, Sheet, Avatar, Separator, Input, Checkbox, Radio Group. Visual direction của dự án là Clean Clinical: xanh sage, trắng, xám nhạt và accent amber.

### 3.4. Supabase

Supabase được dùng cho:
- Authentication: đăng ký, đăng nhập.
- Database: skin profiles, skin diaries, commerce schema đề xuất.
- Storage: upload ảnh nhật ký da vào bucket `diary_images`.
- RLS: chính sách phân quyền cho dữ liệu người dùng.
- pgvector: chuẩn bị cho semantic search bằng embedding vector.

### 3.5. Gemini AI

Gemini được chọn cho:
- Chatbot và product Q&A.
- Embedding model `text-embedding-004`.
- Semantic search pipeline: user query -> embedding -> Supabase pgvector -> product results.

Trong môi trường demo, hệ thống có fallback local để vẫn chạy khi chưa cấu hình API key thật.

### 3.6. Docker

Dự án đã có:
- `Dockerfile`
- `docker-compose.yml`
- `.dockerignore`
- tài liệu triển khai Docker tại `docs/docker-deployment.md`

Lệnh chạy:

```bash
docker compose up --build
```

<!-- pagebreak -->

## 4. Kiến Trúc Hệ Thống

AuraCare AI được thiết kế theo kiến trúc module:

Frontend layer:
- Storefront pages.
- Dashboard/admin pages.
- Shared layout components.
- UI components.

Application layer:
- Cart, wishlist, compare local state.
- Order mock logic.
- Recommendation engine.
- AI search/chat APIs.

Data layer:
- Mock catalog 60 SKU.
- Supabase Auth.
- Supabase Storage.
- Supabase SQL schema cho commerce core.
- AI logs dạng JSONL trong môi trường local.

AI layer:
- Semantic search.
- Chatbot.
- Product Q&A.
- Recommendation.
- Personalization analytics.
- AI safety evaluation.
- AI readiness report.

## 5. Thiết Kế Database

Các bảng Supabase đã có hoặc đã chuẩn bị:

### 5.1. skin_profiles

Lưu hồ sơ chăm sóc da của người dùng:
- user_id
- skin_type
- concerns
- allergies
- routine_goals

RLS:
- user chỉ xem/thêm/sửa hồ sơ của chính mình.

### 5.2. skin_diaries

Lưu nhật ký da:
- user_id
- image_url
- notes
- created_at

RLS:
- user chỉ thao tác nhật ký của chính mình.

Storage:
- ảnh được upload vào bucket `diary_images`.

### 5.3. products

Schema commerce core đã được chuẩn bị trong `supabase-sql/commerce_core.sql`:
- slug
- name
- brand
- category
- descriptions
- price
- stock_status
- tags
- image
- embedding_vector vector(768)

RLS:
- public read sản phẩm.
- admin manage sản phẩm.

### 5.4. orders

Lưu đơn hàng:
- order_number
- user_id
- status
- payment_status
- subtotal
- shipping information

RLS:
- user xem đơn của chính mình.
- user tạo đơn của chính mình.
- admin cập nhật trạng thái.

### 5.5. order_items

Lưu snapshot sản phẩm tại thời điểm đặt hàng:
- order_id
- product_slug
- product_name
- product_image
- unit_price
- quantity
- line_total

RLS:
- user xem item thuộc đơn của mình.
- admin quản lý item.

<!-- pagebreak -->

## 6. Phân Tích Chức Năng

### 6.1. Trang Chủ

Trang chủ giới thiệu AuraCare AI, các danh mục chính, sản phẩm nổi bật, kệ cá nhân hóa và khu vực gọi người dùng đến trang tư vấn AI. Thiết kế ưu tiên ít chữ, nhiều khoảng trắng và điều hướng rõ ràng.

### 6.2. Catalog và Danh Mục

Trang `/products` đóng vai trò điểm vào tổng hợp. Người dùng có thể chuyển sang supplement hoặc skincare, xem sản phẩm nổi bật và dùng semantic search nếu chưa biết tên sản phẩm cụ thể.

Trang `/categories/[category]` hiển thị sản phẩm theo từng nhóm, có filter cơ bản theo concern/benefit và sort.

### 6.3. Product Detail Page

PDP hiển thị:
- ảnh sản phẩm đồng đều.
- thương hiệu, danh mục, xuất xứ, quy cách.
- giá, giá so sánh, trạng thái tồn kho.
- mô tả, thành phần, hướng dẫn dùng, cảnh báo.
- thêm vào giỏ hàng.
- wishlist và compare.
- product AI assistant.
- recommendation liên quan.

### 6.4. Cart và Checkout

Cart cho phép:
- xem sản phẩm đã thêm.
- tăng giảm số lượng.
- xóa sản phẩm.
- xem subtotal.
- nhận gợi ý mua kèm.

Checkout hiện là mock:
- nhập thông tin giao hàng.
- tạo đơn trong localStorage.
- chuyển sang trang lịch sử đơn.

### 6.5. Orders

Trang `/orders` hiển thị lịch sử đơn hàng mock. Trang `/orders/[id]` hiển thị chi tiết đơn, thông tin giao hàng, sản phẩm trong đơn và nút mua lại.

### 6.6. Dashboard/Admin

Dashboard có:
- overview.
- quản lý sản phẩm mock.
- quản lý đơn hàng mock.
- AI Ops.
- settings.

Màn `/dashboard/orders` cho phép admin demo đổi trạng thái đơn hàng giữa chờ xác nhận, đang xử lý và hoàn tất.

<!-- pagebreak -->

## 7. Chức Năng AI

### 7.1. Chatbot

Chatbot hỗ trợ:
- hỏi đáp FAQ.
- tư vấn sản phẩm ở mức thông tin.
- giải thích vì sao sản phẩm phù hợp.
- tạo handoff summary.

Guardrail:
- không chẩn đoán bệnh.
- không kê đơn.
- không đưa liều dùng y tế nguy hiểm.
- escalation nếu người dùng mô tả triệu chứng khẩn cấp.

### 7.2. Product Q&A

Trên PDP, người dùng có thể hỏi:
- sản phẩm phù hợp với ai.
- thành phần chính là gì.
- nên lưu ý gì khi dùng.
- có sản phẩm thay thế nào không.

### 7.3. Semantic Search

Luồng thiết kế:
1. User nhập truy vấn tự nhiên.
2. Gemini tạo vector 768 chiều bằng `text-embedding-004`.
3. Supabase pgvector so khớp cosine.
4. API trả danh sách sản phẩm.

Trong môi trường local chưa có key thật, hệ thống dùng fallback metadata scoring để demo UX.

### 7.4. Recommendation

Recommendation hiện gồm:
- home recommendations.
- PDP related products.
- cart cross-sell.
- personalized shelf dựa trên recently viewed, wishlist và cart.

Thuật toán Phase hiện tại:
- rule-based score.
- tag overlap.
- category affinity.
- weighted anchors từ hành vi người dùng.

### 7.5. Personalization Analytics

AI Ops hiển thị:
- recommendation logs.
- signal breakdown.
- top clicked/recommended products.
- weak anchors.
- experiment insights.

### 7.6. Evaluation và Readiness

Hệ thống có:
- recommendation offline evaluation.
- personalization scenario evaluation.
- experiment runner.
- safety benchmark.
- AI readiness report.
- evaluation history snapshots.

<!-- pagebreak -->

## 8. AI Trong Quá Trình Phát Triển

AI tool được dùng như trợ lý lập trình và phân tích. Các nhóm tác vụ có sử dụng AI:
- phân tích đề tài.
- lập kế hoạch phase.
- thiết kế README và docs.
- xây UI storefront/admin.
- xây API chatbot/search/recommendation.
- rà soát quy chế cuối kỳ.
- tạo Docker, schema Supabase, báo cáo và phụ lục.

AI không thay thế hoàn toàn lập trình viên. Người thực hiện vẫn quyết định phạm vi, kiểm tra code, chạy test, sửa lỗi và chịu trách nhiệm về tính đúng đắn.

Minh chứng prompt được trình bày trong file phụ lục `docs/ai-prompts-appendix.md`.

## 9. Docker và Deployment

### 9.1. Dockerfile

Dockerfile dùng multi-stage build:
- stage `deps`: cài dependencies.
- stage `builder`: build Next.js.
- stage `runner`: chạy standalone production server.

### 9.2. Docker Compose

`docker-compose.yml` expose port 3000 và truyền biến môi trường:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GOOGLE_API_KEY`

### 9.3. VPS Deployment

Quy trình deploy đề xuất:
1. Thuê VPS Ubuntu.
2. Cài Docker và Docker Compose.
3. Clone repository từ GitHub.
4. Tạo file `.env`.
5. Chạy `docker compose up -d --build`.
6. Cấu hình Nginx reverse proxy.
7. Trỏ domain về VPS.
8. Cài SSL bằng Certbot hoặc Cloudflare.

Hiện tại môi trường local chưa có credential VPS/domain nên chưa thể deploy thật từ máy này.

<!-- pagebreak -->

## 10. Kiểm Thử

Các lệnh đã chạy:

```bash
npm run typecheck
npm run build
```

Kết quả:
- TypeScript pass.
- Production build pass.
- Các route chính trả HTTP 200 trong môi trường local.

Các route đã kiểm:
- `/`
- `/products`
- `/cart`
- `/checkout`
- `/orders`
- `/dashboard/orders`
- `/dashboard/ai-ops`
- `/api/ai/readiness`
- `/api/ai/safety/evaluate`

Kiểm thử AI:
- Safety benchmark pass rate: 1.0 trong test local.
- Readiness status: attention do chưa cấu hình key production thật.

## 11. Hạn Chế

Các phần còn là mock/local:
- Cart.
- Wishlist.
- Compare.
- Orders.
- Admin product edit.
- Một phần AI logs.

Các phần cần production credential:
- Gemini API key thật.
- Supabase project thật.
- VPS/domain/SSL.
- GitHub repository nộp cho giảng viên.

Các phần cần hoàn thiện nếu phát triển tiếp:
- Payment sandbox.
- Inventory reservation.
- Admin RBAC thật.
- Supabase CRUD thật cho commerce core.
- E2E test bằng Playwright.
- Review nội dung y tế bởi chuyên gia.

<!-- pagebreak -->

## 12. Hướng Phát Triển

Phase tiếp theo nên ưu tiên:
1. Chuyển orders/products/cart sang Supabase thật.
2. Seed 60 SKU vào bảng products.
3. Chạy script enrichment embedding với Gemini.
4. Kết nối semantic search vào pgvector production.
5. Bổ sung role admin/user.
6. Triển khai production bằng Docker trên VPS.
7. Viết E2E tests cho search -> PDP -> cart -> checkout -> order.
8. Tối ưu báo cáo AI Ops dựa trên dữ liệu thật.

## 13. Kết Luận

AuraCare AI đã đạt mức MVP học thuật tương đối đầy đủ: có storefront, catalog, PDP, cart, checkout mock, order history, admin dashboard, AI chatbot, semantic-search-ready flow, recommendation, personalization analytics và AI readiness.

Dự án thể hiện được việc vận dụng các công nghệ mới trong phát triển phần mềm: Next.js App Router, TypeScript, Tailwind/shadcn UI, Supabase, AI/ML workflow và Docker. Những hạn chế còn lại chủ yếu nằm ở phần production hóa: deploy VPS/domain/SSL, dữ liệu commerce thật trên Supabase và thanh toán/logistics thật.

<!-- pagebreak -->

## 14. Cơ Sở Lý Thuyết Và Cách Tiếp Cận

### 14.1. Ứng dụng web full-stack hiện đại

Một ứng dụng web full-stack hiện đại không chỉ bao gồm giao diện người dùng, mà còn cần có kiến trúc dữ liệu, xác thực, phân quyền, triển khai, giám sát và tài liệu vận hành. Trong dự án AuraCare AI, khái niệm full-stack được thể hiện qua nhiều lớp: storefront phục vụ người dùng cuối, dashboard phục vụ quản trị, API routes xử lý nghiệp vụ, Supabase đóng vai trò backend-as-a-service, và Docker đóng gói môi trường chạy.

Next.js App Router được lựa chọn vì hỗ trợ tốt mô hình kết hợp Server Components và Client Components. Server Components giúp giảm lượng JavaScript gửi về trình duyệt cho những phần chủ yếu hiển thị dữ liệu, trong khi Client Components phù hợp với các tương tác như cart, wishlist, compare, chatbot và dashboard analytics.

### 14.2. Backend-as-a-Service với Supabase

Supabase được xem như một lựa chọn phù hợp cho dự án học thuật vì cung cấp nhiều thành phần backend quan trọng trong cùng một hệ sinh thái: PostgreSQL, Auth, Storage, Row Level Security và edge-friendly API. Thay vì xây dựng một custom backend bằng Express.js hoặc NestJS, dự án sử dụng Supabase để tập trung vào kiến trúc sản phẩm, dữ liệu và AI.

Điểm quan trọng nhất khi dùng Supabase là RLS. RLS giúp đảm bảo rằng quyền truy cập dữ liệu được kiểm soát tại tầng database, không chỉ ở tầng giao diện. Với các bảng như `skin_profiles`, `skin_diaries`, `orders`, người dùng chỉ được phép thao tác dữ liệu của chính mình. Điều này phù hợp với yêu cầu môn học về phân quyền và bảo mật dữ liệu.

### 14.3. AI trong thương mại điện tử

AI trong ecommerce có thể được triển khai ở nhiều mức độ. Ở mức đơn giản, hệ thống dùng rule-based recommendation để gợi ý sản phẩm dựa trên danh mục, tag và sản phẩm đang xem. Ở mức nâng cao hơn, hệ thống có thể sử dụng embedding để tìm kiếm ngữ nghĩa, hoặc học từ hành vi người dùng để cá nhân hóa kết quả.

AuraCare AI áp dụng cách tiếp cận tăng dần. Phase đầu sử dụng mock catalog và rule-based scoring để có trải nghiệm nhanh. Phase sau bổ sung semantic search bằng Gemini embedding và Supabase pgvector. Cách tiếp cận này giảm rủi ro kỹ thuật, đồng thời vẫn thể hiện được định hướng machine learning.

### 14.4. An toàn trong domain sức khỏe

Vì dự án liên quan đến sản phẩm sức khỏe, chatbot không được đóng vai trò bác sĩ. Hệ thống cần có guardrail để tránh chẩn đoán, kê đơn hoặc đưa lời khuyên y tế nguy hiểm. Trong AuraCare AI, chatbot chỉ hỗ trợ thông tin sản phẩm, giải thích thành phần, cảnh báo người dùng đọc kỹ hướng dẫn và khuyến nghị liên hệ chuyên gia y tế khi gặp tình huống nghiêm trọng.

<!-- pagebreak -->

## 15. Phân Tích Yêu Cầu Hệ Thống

### 15.1. Tác nhân sử dụng hệ thống

Hệ thống có ba nhóm tác nhân chính. Nhóm thứ nhất là khách hàng, người truy cập website để tìm hiểu sản phẩm, dùng semantic search, hỏi AI, thêm sản phẩm vào giỏ hàng và đặt đơn mock. Nhóm thứ hai là quản trị viên, người theo dõi sản phẩm, đơn hàng và hoạt động AI trong dashboard. Nhóm thứ ba là hệ thống AI, đóng vai trò trợ lý xử lý truy vấn, gợi ý sản phẩm và tạo báo cáo readiness.

### 15.2. Yêu cầu chức năng

Các yêu cầu chức năng chính:
- Người dùng có thể duyệt trang chủ, catalog và danh mục sản phẩm.
- Người dùng có thể xem chi tiết sản phẩm, thành phần, hướng dẫn sử dụng và cảnh báo.
- Người dùng có thể thêm sản phẩm vào cart, wishlist và compare.
- Người dùng có thể thực hiện checkout mock và xem lịch sử đơn.
- Người dùng có thể hỏi AI trên trang sản phẩm hoặc trang tư vấn.
- Admin có thể xem dashboard tổng quan, quản lý sản phẩm mock và quản lý đơn hàng mock.
- Admin có thể xem AI Ops để theo dõi search, chat, recommendation và readiness.
- Hệ thống có thể chạy bằng Docker Compose.

### 15.3. Yêu cầu phi chức năng

Các yêu cầu phi chức năng:
- Giao diện responsive trên desktop và mobile.
- Code TypeScript có type rõ ràng.
- Kiến trúc component tách nhỏ, dễ bảo trì.
- Dễ triển khai bằng Docker.
- Có khả năng mở rộng từ mock/localStorage sang Supabase thật.
- Có tài liệu mô tả kiến trúc, API, ERD, roadmap và deployment.
- Có guardrail AI cho nội dung sức khỏe.

### 15.4. Phạm vi và giới hạn

Phạm vi hiện tại tập trung vào MVP học thuật. Các chức năng như thanh toán thật, vận chuyển thật, kiểm kho thật và tư vấn y tế chuyên sâu chưa thuộc phạm vi triển khai. Điều này giúp dự án vẫn khả thi trong thời gian môn học, đồng thời không làm tăng rủi ro pháp lý.

<!-- pagebreak -->

## 16. Thiết Kế Giao Diện Và Trải Nghiệm Người Dùng

### 16.1. Định hướng thiết kế

AuraCare AI sử dụng phong cách Clean Clinical. Đây là phong cách cân bằng giữa cảm giác tin cậy của sản phẩm sức khỏe và sự thân thiện của một website thương mại điện tử. Màu chủ đạo là xanh sage, nền trắng/xám nhạt và accent amber cho CTA hoặc khuyến mãi.

Trang chủ được thiết kế để giảm tải nhận thức. Thay vì đưa quá nhiều banner và chữ lớn, giao diện ưu tiên các điểm vào rõ ràng: xem sản phẩm, tư vấn AI, danh mục chính và sản phẩm nổi bật. Cách này phù hợp với người dùng chưa biết chính xác sản phẩm mình cần.

### 16.2. Luồng người dùng chính

Luồng mua hàng cơ bản:
1. Người dùng vào trang chủ.
2. Người dùng mở catalog hoặc tìm kiếm.
3. Người dùng xem PDP.
4. Người dùng hỏi AI nếu cần giải thích thêm.
5. Người dùng thêm sản phẩm vào cart.
6. Người dùng checkout mock.
7. Người dùng xem đơn hàng và chi tiết đơn.

Luồng tư vấn AI:
1. Người dùng mở trang tư vấn.
2. Người dùng nhập nhu cầu tự nhiên.
3. Hệ thống gọi API search/chat.
4. Hệ thống trả kết quả sản phẩm kèm lý do gợi ý.
5. Người dùng mở PDP để xem sâu hơn.

### 16.3. Khả năng responsive

Header storefront có phiên bản desktop và mobile. Trên mobile, sidebar menu sử dụng Sheet component để tiết kiệm không gian. Product grid tự chuyển số cột theo kích thước màn hình. Các card sử dụng border radius lớn, khoảng cách rõ ràng và font dễ đọc.

### 16.4. Tính nhất quán giao diện

Các trang cart, checkout, orders và order detail đều được gắn cùng StorefrontHeader và StorefrontFooter để người dùng không bị rời khỏi trải nghiệm ecommerce. Dashboard dùng layout riêng với sidebar và header quản trị.

<!-- pagebreak -->

## 17. Thiết Kế Dữ Liệu Và RLS Chi Tiết

### 17.1. Nguyên tắc thiết kế dữ liệu

Thiết kế dữ liệu của AuraCare AI tuân theo ba nguyên tắc. Thứ nhất, dữ liệu sản phẩm phải đủ giàu metadata để phục vụ search và recommendation. Thứ hai, dữ liệu người dùng phải được phân quyền chặt bằng RLS. Thứ ba, các bảng commerce phải có khả năng lưu snapshot để không mất thông tin đơn hàng nếu sản phẩm thay đổi sau này.

### 17.2. Bảng products

Bảng `products` chứa thông tin catalog. Ngoài các trường thương mại như giá, thương hiệu, tồn kho và ảnh, bảng này còn có các trường AI như `concern_tags`, `symptom_tags`, `benefit_tags`, `searchable_text` và `embedding_vector`. Các trường này giúp hệ thống hiểu sản phẩm ở mức ngữ nghĩa, không chỉ theo tên.

RLS cho sản phẩm cho phép public read, vì catalog cần hiển thị cho mọi người dùng. Tuy nhiên thao tác insert, update và delete chỉ nên dành cho admin. Trong schema đã chuẩn bị, quyền admin được xác định thông qua `app_metadata.role = 'admin'`.

### 17.3. Bảng orders và order_items

Bảng `orders` lưu thông tin đơn hàng cấp cao, còn `order_items` lưu từng dòng sản phẩm. Thiết kế này giúp một đơn hàng có nhiều sản phẩm và dễ mở rộng cho thanh toán, vận chuyển, hoàn tiền hoặc xuất hóa đơn.

RLS cho orders đảm bảo user chỉ xem đơn của chính mình. Admin có quyền cập nhật trạng thái đơn. Với `order_items`, user chỉ xem được item thuộc đơn hàng của mình thông qua điều kiện exists liên kết với bảng `orders`.

### 17.4. Storage và dữ liệu ảnh

Supabase Storage được dùng cho ảnh nhật ký da. Với sản phẩm, dự án hiện dùng ảnh URL từ nguồn bên ngoài để demo nhanh, nhưng production có thể chuyển ảnh sản phẩm về Supabase Storage. Khi đó cần policy storage riêng để public read ảnh sản phẩm và authenticated/admin upload.

<!-- pagebreak -->

## 18. Kiến Trúc AI/ML Chi Tiết

### 18.1. Semantic search

Tìm kiếm truyền thống thường phụ thuộc vào keyword. Nếu người dùng gõ "da nhạy cảm thiếu ẩm", hệ thống keyword có thể bỏ sót sản phẩm không chứa đúng cụm từ đó. Semantic search giải quyết bằng cách chuyển truy vấn và sản phẩm thành vector embedding, sau đó so khớp theo khoảng cách cosine.

Trong AuraCare AI, pipeline được thiết kế như sau:
1. Chuẩn hóa truy vấn người dùng.
2. Gửi truy vấn sang Gemini `text-embedding-004`.
3. Nhận vector 768 chiều.
4. Gọi Supabase RPC `match_products_by_embedding`.
5. Sắp xếp sản phẩm theo similarity.
6. Trả kết quả kèm lý do giải thích.

### 18.2. Recommendation engine

Recommendation engine hiện dùng cách tiếp cận giải thích được. Mỗi sản phẩm ứng viên được chấm điểm dựa trên overlap về category, concern tags, symptom tags và benefit tags. Với personalized shelf, hệ thống còn tính trọng số từ recently viewed, wishlist và cart.

Cách tiếp cận này có ưu điểm là dễ hiểu, dễ debug và phù hợp giai đoạn MVP. Khi có dữ liệu thật, hệ thống có thể mở rộng sang collaborative filtering, session-based recommendation hoặc learning-to-rank.

### 18.3. Chatbot và product Q&A

Chatbot hoạt động ở vai trò trợ lý mua sắm. Nó không đưa chẩn đoán y tế, không kê đơn và không thay thế bác sĩ. Đối với câu hỏi liên quan sản phẩm, chatbot có thể dùng metadata sản phẩm để trả lời ngắn gọn, giải thích thành phần và gợi ý xem sản phẩm liên quan.

### 18.4. AI Ops

AI Ops là phần giúp dự án có chiều sâu học thuật. Thay vì chỉ có chatbot, hệ thống còn có dashboard theo dõi:
- số lượt search.
- số lượt chat.
- recommendation events.
- signal contribution.
- safety benchmark.
- readiness score.
- evaluation snapshots.

Điều này thể hiện tư duy vận hành AI: một tính năng AI không chỉ cần chạy được, mà còn cần đo lường, giám sát và đánh giá rủi ro.

<!-- pagebreak -->

## 19. Bảo Mật, Quyền Riêng Tư Và An Toàn AI

### 19.1. Bảo mật xác thực

Supabase Auth được dùng để quản lý đăng ký và đăng nhập. Khi user đăng nhập, Supabase phát hành session token và cookie/session được Next.js sử dụng ở server/client. Việc dùng Supabase Auth giúp giảm rủi ro tự triển khai password hashing hoặc session management sai cách.

### 19.2. Row Level Security

RLS là lớp bảo vệ quan trọng nhất ở database. Nếu chỉ kiểm tra quyền ở frontend, người dùng có thể gọi API trực tiếp để truy cập dữ liệu trái phép. RLS đưa logic quyền xuống database, đảm bảo kể cả khi API bị gọi ngoài ý muốn, dữ liệu vẫn được bảo vệ.

Trong dự án, RLS được áp dụng cho profile, diary và schema commerce. Các policy quan trọng:
- user chỉ đọc hồ sơ của chính mình.
- user chỉ đọc nhật ký của chính mình.
- user chỉ đọc đơn hàng của chính mình.
- admin mới được quản lý sản phẩm và cập nhật đơn hàng.

### 19.3. Quyền riêng tư dữ liệu sức khỏe

Nhật ký da và thông tin nhu cầu sức khỏe có tính nhạy cảm. Vì vậy production cần:
- không log dữ liệu cá nhân quá mức.
- không đưa ảnh hoặc ghi chú cá nhân vào prompt nếu không cần.
- có chính sách xóa dữ liệu.
- có thông báo rõ ràng rằng AI chỉ hỗ trợ tham khảo.

### 19.4. An toàn AI

Guardrail chatbot hiện xử lý các nhóm rủi ro:
- yêu cầu chẩn đoán bệnh.
- yêu cầu kê đơn.
- câu hỏi liều dùng nguy hiểm.
- triệu chứng khẩn cấp như khó thở, đau ngực, sốc phản vệ.

Khi gặp tình huống này, chatbot từ chối trả lời theo hướng y tế và khuyến nghị người dùng liên hệ bác sĩ hoặc cơ sở y tế.

<!-- pagebreak -->

## 20. Quy Trình Phát Triển Và Quản Lý Mã Nguồn

### 20.1. Chia phase phát triển

Dự án được chia thành các phase:
- Phase 0: lập kế hoạch, kiến trúc, tài liệu.
- Phase 1: storefront và admin skeleton.
- Phase 2: commerce core MVP.
- Phase 3: search và content.
- Phase 4: AI MVP.
- Phase 5: personalization analytics.
- Phase 6: evaluation và research extensions.
- Phase 7: AI operations readiness.
- Phase 8: MVP hardening và hồ sơ nộp bài.

Cách chia phase giúp tránh triển khai lan man. Mỗi phase có deliverable rõ ràng và có thể kiểm thử độc lập.

### 20.2. Quy ước mã nguồn

Code được tổ chức theo module. Các component UI dùng lại đặt trong `components`, logic AI đặt trong `lib/ai`, dữ liệu mock đặt trong `lib/mock-data`, API route đặt trong `app/api`, SQL đặt trong `supabase-sql`, tài liệu đặt trong `docs`.

### 20.3. Git và commit history

Dự án có Git repository và commit history. Để nộp bài, repository cần được push lên GitHub public hoặc private có cấp quyền cho giảng viên. Commit history nên thể hiện quá trình phát triển theo chức năng thay vì chỉ một commit cuối.

### 20.4. Vai trò của tài liệu

README và docs đóng vai trò source of truth. Điều này đặc biệt hữu ích khi dự án có nhiều module và nhiều lần phát triển bằng AI tool. Tài liệu giúp người đọc hiểu vì sao chọn công nghệ, cách chạy dự án, cách deploy và phần nào còn hạn chế.

<!-- pagebreak -->

## 21. Kiểm Thử Và Đánh Giá Chất Lượng

### 21.1. Kiểm thử tĩnh

Lệnh `npm run typecheck` kiểm tra TypeScript. Đây là lớp kiểm thử quan trọng để phát hiện lỗi type, sai payload hoặc sai props giữa các component. Kết quả hiện tại pass.

### 21.2. Kiểm thử build production

Lệnh `npm run build` kiểm tra khả năng build production. Đây là bước quan trọng hơn dev server vì Next.js sẽ collect page data, tối ưu route và phát hiện các lỗi chỉ xuất hiện trong production build. Dự án hiện build pass.

### 21.3. Kiểm thử Docker

Docker Compose đã được kiểm tra bằng:
- `docker compose config`.
- `docker compose up -d --build`.
- kiểm tra container `healthy`.
- kiểm tra các route chính trả HTTP 200.

Việc Docker build pass chứng minh ứng dụng có thể chạy trong môi trường độc lập, không phụ thuộc cấu hình máy phát triển.

### 21.4. Kiểm thử chức năng AI

AI safety benchmark hiện có pass rate 1.0 trong local test. AI readiness trong container demo có thể ở trạng thái `blocked` nếu dùng placeholder key. Đây không phải lỗi logic mà là cơ chế cảnh báo rằng production cần Supabase/Gemini credentials thật.

### 21.5. Kiểm thử còn thiếu

Dự án chưa có bộ E2E test tự động bằng Playwright. Nếu phát triển tiếp, cần viết test cho các flow:
- search -> PDP -> add to cart.
- cart -> checkout -> orders.
- PDP chatbot -> recommendation.
- dashboard orders update status.
- AI Ops readiness render.

<!-- pagebreak -->

## 22. Triển Khai Production

### 22.1. Mô hình triển khai đề xuất

Mô hình production đề xuất:
- VPS Ubuntu.
- Docker Compose chạy service Next.js.
- Caddy reverse proxy cấp SSL tự động.
- Domain trỏ A record về IP VPS.
- Supabase hosted project.
- Gemini API key thật.

Repository đã có `docker-compose.prod.yml` và `deploy/Caddyfile`. Caddy giúp đơn giản hóa HTTPS vì tự yêu cầu và gia hạn chứng chỉ Let's Encrypt khi domain đã trỏ đúng.

### 22.2. Các bước triển khai

Các bước triển khai:
1. SSH vào VPS.
2. Cài Docker và Docker Compose plugin.
3. Clone repository từ GitHub.
4. Copy `deploy/env.production.example` thành `.env`.
5. Cập nhật `APP_DOMAIN`, Supabase URL, Supabase anon key và Gemini key.
6. Chạy `docker compose -f docker-compose.prod.yml up -d --build`.
7. Kiểm tra `docker compose ps`.
8. Mở domain HTTPS để demo.

### 22.3. Kiểm tra sau deploy

Sau deploy cần kiểm:
- trang chủ load qua HTTPS.
- `/products` load đúng.
- `/dashboard/ai-ops` load đúng.
- `/api/ai/readiness` không còn blocked do thiếu key.
- semantic search gọi được Supabase/Gemini nếu đã cấu hình.
- Supabase RLS không cho user truy cập dữ liệu người khác.

### 22.4. Rủi ro khi deploy

Các rủi ro thường gặp:
- DNS chưa trỏ đúng IP.
- port 80/443 bị firewall chặn.
- biến môi trường sai.
- Supabase redirect URL chưa cấu hình domain production.
- Caddy không lấy được chứng chỉ vì domain chưa public.

<!-- pagebreak -->

## 23. Đối Chiếu Với Quy Chế Cuối Kỳ

### 23.1. Các mục đã đáp ứng

Dự án đáp ứng các mục:
- Next.js App Router.
- TypeScript.
- Tailwind CSS và shadcn/ui.
- Supabase Auth.
- Supabase Database và Storage ở module diary/profile.
- RLS cho dữ liệu người dùng và schema commerce chuẩn bị.
- CRUD/mock CRUD cho sản phẩm, diary/profile operations.
- Dockerfile và Docker Compose.
- Git repository có commit history.
- AI tool minh chứng bằng phụ lục prompt.
- Báo cáo toàn văn có file Word/PDF.

### 23.2. Các mục cần cấu hình thật trước ngày nộp

Các mục cần hoàn tất bằng credential thật:
- push GitHub repository và cấp quyền cho giảng viên.
- deploy lên VPS/domain/SSL.
- cấu hình Supabase project production.
- chạy SQL schema trên Supabase.
- cập nhật redirect URL trong Supabase Auth.
- cập nhật Gemini API key production.

### 23.3. Mức độ sẵn sàng

Ở thời điểm hiện tại, dự án sẵn sàng để demo local và Docker. Về mặt hồ sơ, đã có báo cáo và phụ lục. Về mặt production, cần VPS/domain/SSL thật để đạt trọn yêu cầu demo trực tiếp trên URL production.

<!-- pagebreak -->

## 24. Câu Hỏi Vấn Đáp Dự Kiến

### 24.1. Vì sao chọn Next.js App Router?

Next.js App Router hỗ trợ Server Components, Client Components, route handlers và kiến trúc file-based routing hiện đại. Điều này phù hợp với yêu cầu môn học và giúp dự án có thể kết hợp giao diện, API và server-side rendering trong cùng một codebase.

### 24.2. RLS là gì và vì sao cần RLS?

RLS là Row Level Security, cơ chế bảo mật ở cấp từng dòng trong PostgreSQL. RLS cần thiết vì nó đảm bảo user chỉ truy cập dữ liệu được phép, kể cả khi API bị gọi trực tiếp. Trong dự án, RLS được dùng để bảo vệ profile, diary và order.

### 24.3. Docker dùng để làm gì?

Docker đóng gói ứng dụng cùng môi trường chạy, giúp ứng dụng chạy nhất quán giữa máy phát triển và VPS. Với Docker Compose, chỉ cần một lệnh để build và chạy service. Điều này giảm lỗi do khác biệt môi trường.

### 24.4. Semantic search khác keyword search như thế nào?

Keyword search tìm theo từ khóa xuất hiện trong văn bản. Semantic search chuyển truy vấn và sản phẩm thành vector embedding để tìm theo ý nghĩa. Vì vậy semantic search có thể hiểu các câu mô tả nhu cầu tự nhiên như "da nhạy cảm thiếu ẩm" dù tên sản phẩm không chứa đúng cụm từ đó.

### 24.5. Dự án dùng AI tool như thế nào?

AI tool được dùng để phân tích yêu cầu, lập kế hoạch, viết skeleton code, gợi ý kiến trúc AI, rà soát quy chế, viết tài liệu và kiểm thử. Tuy nhiên người thực hiện vẫn kiểm tra, quyết định thiết kế và chạy test.

<!-- pagebreak -->

## 25. Đánh Giá Kết Quả Đạt Được

### 25.1. Về sản phẩm

Dự án đã xây dựng được một ecommerce prototype có đầy đủ luồng chính từ khám phá sản phẩm đến tạo đơn hàng mock. Giao diện có tính nhất quán, responsive và phù hợp định hướng sản phẩm sức khỏe.

### 25.2. Về kỹ thuật

Dự án thể hiện được nhiều công nghệ trong đề cương: Next.js App Router, TypeScript, Supabase, Tailwind CSS, shadcn/ui, Docker và AI tool. Ngoài ra, dự án còn mở rộng sang AI Ops, evaluation và readiness report, giúp tăng chiều sâu học thuật.

### 25.3. Về AI/ML

Các tính năng AI không chỉ dừng ở chatbot đơn giản. Hệ thống có semantic-search-ready flow, recommendation engine, personalization analytics, safety benchmark và readiness checks. Đây là điểm nổi bật so với một website CRUD thông thường.

### 25.4. Về hạn chế

Hạn chế lớn nhất là một số phần commerce vẫn đang ở trạng thái mock/localStorage. Để production thật, cần nối toàn bộ cart/orders/products vào Supabase, thêm payment sandbox và triển khai domain/SSL.

### 25.5. Bài học rút ra

Thông qua dự án, người thực hiện học được cách xây dựng một ứng dụng web hiện đại theo hướng module, cách dùng Supabase RLS, cách Docker hóa Next.js, cách tích hợp AI có guardrail và cách chuẩn bị tài liệu học thuật cho một dự án phần mềm.

<!-- pagebreak -->

## 26. Tài Liệu Tham Khảo

- Next.js Documentation.
- Supabase Documentation.
- Tailwind CSS Documentation.
- shadcn/ui Documentation.
- Google Gemini API Documentation.
- PostgreSQL Row Level Security Documentation.
- Docker Documentation.
- README và docs nội bộ của dự án AuraCare AI.
