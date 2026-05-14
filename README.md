# AuraCare AI

Blueprint hoc thuat cho mot website thuong mai dien tu ve san pham cham soc suc khoe, tich hop AI cham soc khach hang, goi y san pham, tim kiem thong minh, va cac tinh nang machine learning ca nhan hoa.

Tai lieu nay duoc viet de:
- Lam tai lieu tong cho du an.
- Lam ngu canh dau vao cho cac mo hinh AI khac khi thuc hien tung module.
- Giu cho du an co dinh huong ky thuat, du lieu, va quy trinh phat trien nhat quan.

## 0. Decisions Locked for Phase 1

Nhung quyet dinh duoi day da duoc chot va phai duoc xem la source of truth:

- Storefront: tu build bang `Next.js + Tailwind + shadcn/ui`
- Storefront inspiration: Medusa storefront starter, Taxonomy, Long Chau, Pharmacity
- Admin: `shadcn-admin`
- Product scope Phase 1:
  - `supplement`
  - `skincare`
- Mock data scope:
  - `60 SKU`
  - `30 supplement`
  - `30 skincare`
- AI scope Phase 1:
  - `chatbot`
  - `rule-based recommendation`
  - `semantic search`
- Explicitly not in Phase 1:
  - `routine builder`
  - `OTC`
  - `medical devices`
- Branding:
  - name: `AuraCare`
  - direction: `Clean Clinical`
  - primary: `#5B8C7A`
  - accent: `#E8A950`
- Semantic search stack:
  - `Gemini text-embedding-004`
  - `Supabase Postgres`
  - `pgvector`
  - `cosine similarity`
- Mock data rule:
  - moi product phai co san truong `embedding_vector`
  - gia tri ban dau la `[]` hoac `null`
  - sau khi seed se enrich bang script mot lan

## 1. Luu y pham vi

Day la du an hoc thuat, nghien cuu, proof-of-concept.

Muc tieu:
- Xay dung mot he thong web giong mo hinh nha thuoc/healthcare commerce hien dai.
- Hoc va thuc hanh ve web engineering, recommendation system, retrieval, chatbot, va workflow AI.
- Uu tien tinh he thong, kha nang mo rong, va gia tri nghien cuu.

Khong phai muc tieu:
- Copy 1:1 mot website cu the.
- Dua ra chan doan y khoa chinh thuc.
- Tu dong thay the bac si, duoc si, hoac chuyen gia y te.

Trong tai lieu nay, website tham khao la mo hinh tuong tu nha thuoc dien tu lon tai Viet Nam, nhung san pham cu the, giao dien, va cach van hanh se duoc thiet ke lai phu hop muc tieu nghien cuu.

## 2. Tam nhin san pham

AuraCare AI la mot nen tang ecommerce ve suc khoe va cham soc ca nhan, ket hop:
- Catalog san pham lon.
- Tim kiem va duyet danh muc tot.
- Trang san pham day du thong tin.
- Gio hang, dat hang, theo doi don.
- Tro ly AI ho tro khach hang.
- He thong goi y san pham thong minh.
- He thong ho so nguoi dung va so thich suc khoe.
- He thong admin quan tri catalog, don hang, khach hang, noi dung, va hoat dong AI.

Gia tri khac biet so voi website ecommerce thong thuong:
- AI product recommendation theo muc tieu va hanh vi.
- AI semantic search.
- AI customer care chatbot.
- ML forecasting va phan tich hanh vi.

## 3. Muc tieu tong the

### 3.1. Muc tieu nghiep vu

- Hien thi va ban cac nhom san pham cham soc suc khoe va cham soc ca nhan.
- Toi uu trai nghiem tim kiem, loc, va kham pha san pham.
- Tang kha nang chuyen doi nho goi y san pham va cross-sell.
- Giam tai cho bo phan cham soc khach hang bang AI chatbot.
- Xay dung nen du lieu de huan luyen hoac thu nghiem cac mo hinh recommendation va ranking.

### 3.2. Muc tieu ky thuat

- Kien truc mo rong duoc.
- Tach duoc tang giao dien, commerce core, AI service, va admin.
- Ho tro thu nghiem nhanh cac module AI.
- Co he thong event tracking ngay tu dau.
- Co tai lieu ro rang de con nguoi va AI agent khac tiep tuc du an.

### 3.3. Muc tieu hoc thuat / nghien cuu

- Xay dung he thong recommendation rule-based va ML-based.
- Thu nghiem retrieval augmented generation cho chatbot va QA.
- Thu nghiem semantic search bang embedding.
- Thu nghiem ranking san pham dua tren profile va context.
- Thu nghiem chatbot handoff tu AI sang nguoi that.

## 4. Doi tuong nguoi dung

### 4.1. Khach hang

Nhu cau:
- Tim san pham nhanh.
- Hieu cong dung, cach dung, doi tuong su dung.
- Duoc goi y san pham phu hop.
- Duoc tu van nhanh neu chua biet nen mua gi.
- Mua hang de dang, minh bach gia, giam gia, giao hang.

### 4.2. Quan tri vien / nhan vien van hanh

Nhu cau:
- Quan ly san pham, danh muc, ton kho, gia, khuyen mai.
- Quan ly don hang va trang thai giao nhan.
- Quan ly noi dung, banner, bai viet.
- Quan ly phien chat AI va ticket can ho tro nguoi that.
- Xem bao cao kinh doanh va phan tich hanh vi.

### 4.3. Duoc si / nhan vien tu van

Nhu cau:
- Nhan yeu cau tu AI handoff.
- Xem tom tat hoi thoai va profile khach.
- Xem san pham AI de xuat.
- Duyet / sua / bo sung goi y.

### 4.4. Nhom nghien cuu / AI engineer

Nhu cau:
- Co data schema ro rang.
- Co event log day du.
- Co pipeline huan luyen va danh gia mo hinh.
- Co kha nang A/B test.

## 5. Pham vi chuc nang

## 5.1. Frontend website nguoi dung

### a. Home page

- Hero banner.
- Search bar trung tam.
- Danh muc noi bat.
- Flash sale / deal theo thoi gian.
- San pham ban chay.
- San pham goi y cho nguoi dung.
- Khu vuc "Hoi AI nen mua gi".
- Khu vuc bai viet / kien thuc suc khoe.
- Testimonials, trust signals, chinh sach giao hang.

### b. Listing / category pages

- Breadcrumb.
- Category tree.
- Filter da tieu chi.
- Sort.
- Pagination / infinite scroll.
- Product card co thong tin ngắn gon.
- Badge: ban chay, moi, sale, can tu van.

### c. Search results page

- Keyword search.
- Semantic search.
- Suggest query.
- Search by symptom / need.
- Search facets.
- Search correction / typo tolerance.

### d. Product detail page

- Ten, gia, ton kho, sku.
- Gallery.
- Cong dung.
- Thanh phan.
- Cach dung.
- Doi tuong su dung.
- Canh bao / luu y.
- Danh gia.
- San pham lien quan.
- Gợi y "thuong mua cung".
- Widget hoi AI ve san pham.

### e. Cart / checkout

- Gio hang.
- Voucher.
- Uoc tinh giao hang.
- Checkout thong tin giao nhan.
- Payment method.
- Order confirmation.

### f. User account

- Ho so co ban.
- Dia chi giao hang.
- Lich su don hang.
- Wishlist.
- San pham da xem.
- Lich su hoi AI.
- Cau hinh muc tieu suc khoe.

### g. Content / knowledge

- Blog.
- Bai viet huong dan.
- FAQ.
- Tra cuu theo trieu chung / nhu cau.

## 5.2. AI-facing features

### a. AI customer care chatbot

Chuc nang:
- Tra loi FAQ.
- Tra loi ve giao hang, doi tra, thanh toan.
- Tra loi thong tin san pham dua tren knowledge base.
- Huong dan tim san pham phu hop.
- Goi y category / brand / budget.
- Chuyen tiep sang nguoi that neu qua nguong.

### b. AI recommendation

Chuc nang:
- Gợi y tren home page.
- Gợi y tren PDP.
- Gợi y trong cart.
- Gợi y mua lai.
- Gợi y theo muc tieu / concern.

### c. AI semantic search

Chuc nang:
- Tim theo ngon ngu tu nhien.
- Tim theo nhu cau mo ta dai.
- Gop nhom ket qua theo y dinh.

### d. AI triage (chi muc tieu hoc thuat)

Chuc nang:
- Nhan y dinh nguoi dung.
- Phan loai muc do ho tro.
- Xac dinh khi nao nen chuyen sang duoc si / ho tro nguoi that.

Luu y:
- Khong khang dinh chan doan.
- Luon co disclaimer.
- Routine builder duoc day sang phase sau.

## 5.3. Admin system

### a. Catalog management

- CRUD san pham.
- Variant.
- Brand.
- Category.
- Attributes.
- Images.
- Medical / health tags.
- Search metadata.

### b. Pricing and promotions

- Gia goc.
- Gia ban.
- Voucher.
- Flash sale.
- Combo.
- Cross-sell.

### c. Inventory and fulfillment

- Ton kho.
- Kho.
- Reservation.
- Reorder threshold.

### d. Order management

- Danh sach don.
- Trang thai.
- Chi tiet don.
- Refund / cancel.
- Ghi chu van hanh.

### e. Customer management

- Ho so khach.
- Lich su mua.
- Lich su chat.
- Segment.
- Loyalty.

### f. Content management

- Banner.
- Bai viet.
- Landing page.
- FAQ.
- Policy pages.

### g. AI ops

- Xem log hoi thoai.
- Danh gia chat luong phan hoi AI.
- Quan ly prompt.
- Quan ly knowledge source.
- Quan ly fallback / escalation rules.

### h. Analytics

- Revenue.
- Conversion.
- Search analytics.
- Recommendation CTR.
- Chatbot resolution rate.

## 6. Pham vi san pham de xuat

De an toan va hop ly cho phase dau, pham vi san pham duoc khoa lai thanh:

- `supplement`
- `skincare`

Neu muon mo rong hoc thuat:
- duoc my pham
- personal care
- OTC products.
- Prescription-like metadata model.
- Tu van can phe duyet.

Khuyen nghi:
- Phase 1 chi tap trung hai nhom tren de AI co du depth ma van gon pham vi.
- Chua can mo phong nghiep vu bac si / don thuoc qua sau.

## 7. Kien truc he thong de xuat

## 7.1. Cong nghe tong quan

### Frontend

- Next.js 16
- React 19
- Tailwind CSS 4
- shadcn/ui

### Backend / platform

- Next.js App Router cho BFF va mot phan API nhe
- Supabase cho auth, storage, va co the dung Postgres phase dau
- PostgreSQL la co so du lieu chinh

### AI / ML services

- Python FastAPI cho service ML neu can tach rieng
- Gemini cho LLM va embeddings giai doan dau
- `text-embedding-004` cho semantic search
- pgvector cho retrieval

### Background jobs

- Redis / queue worker
- Cron jobs cho recommendation refresh, embedding, indexing

### Search

Phase 1 chot:
- PostgreSQL full-text + pgvector
- Hybrid search = keyword + vector

### Observability

- Logging
- Analytics events
- Error monitoring
- Feature flags neu can

## 7.2. Kien truc logic

He thong co the chia thanh cac khoi:

1. Storefront app
2. Admin app
3. Commerce core
4. AI service
5. Data/ML pipeline
6. Search/indexing pipeline

### Storefront app

Trach nhiem:
- Render giao dien nguoi dung.
- Giao tiep voi backend.
- Goi chatbot widget.
- Hien thi recommendation va search.

### Admin app

Trach nhiem:
- Quan tri du lieu.
- Quan tri workflow.
- Quan tri content.
- Quan tri AI operations.

### Commerce core

Trach nhiem:
- Product.
- Pricing.
- Inventory.
- Cart.
- Checkout.
- Order.
- Customer.
- Promotions.

### AI service

Trach nhiem:
- Chat orchestration.
- Retrieval.
- Recommendation API.
- Ranking API.
- Prompt routing.

### Data/ML pipeline

Trach nhiem:
- Sinh features.
- Train model.
- Batch scoring.
- Evaluate metrics.

## 7.3. Kien truc repository

Lua chon 1: monorepo.

De xuat:

```text
/apps
  /storefront
  /admin
  /ai-service
/packages
  /ui
  /db
  /types
  /config
  /analytics
  /ai-core
/docs
/scripts
```

Neu giu repo don gian giai doan dau:

```text
/app
/components
/lib
/types
/actions
/docs
/ml
/prompts
```

## 8. Kien truc du lieu

## 8.1. Thuc the chinh

Bang du lieu nghiep vu co ban:

- users
- user_profiles
- addresses
- categories
- brands
- products
- product_variants
- product_images
- product_attributes
- product_tags
- inventory_items
- carts
- cart_items
- orders
- order_items
- payments
- promotions
- coupons
- reviews
- wishlists
- articles
- faqs
- chatbot_sessions
- chatbot_messages
- recommendation_logs
- search_logs
- event_logs

## 8.2. Truong du lieu san pham can co

Moi san pham nen co:
- id
- slug
- name
- short_description
- long_description
- brand_id
- category_id
- price
- compare_at_price
- currency
- stock_status
- images
- ingredients
- usage_instructions
- target_users
- warnings
- tags
- origin_country
- package_size
- attributes_json
- searchable_text

Truong du lieu phuc vu AI/ML:
- symptom_tags
- concern_tags
- benefit_tags
- contraindication_tags
- age_group_tags
- gender_tags
- budget_bucket
- popularity_score
- margin_score
- embedding_vector

## 8.3. User profile phuc vu personalization

- basic demographics
- health goals
- concerns
- allergies
- preferred brands
- budget level
- purchase history
- viewed products
- search history
- chat intents

## 8.4. Event tracking schema

Can tracking tu ngay dau:
- page_view
- search
- search_click
- product_view
- add_to_cart
- remove_from_cart
- begin_checkout
- purchase
- recommendation_impression
- recommendation_click
- chat_open
- chat_message
- chat_resolution
- wishlist_add

Moi event nen co:
- event_id
- user_id hoac anonymous_id
- session_id
- timestamp
- page
- source
- device
- payload_json

## 9. AI / ML architecture

## 9.1. AI layer overview

AI layer duoc chia thanh 4 nhom:

1. Conversational AI
2. Search and retrieval AI
3. Recommendation AI
4. Predictive ML

## 9.2. Conversational AI

### Muc tieu

- Ho tro khach hang tu dong.
- Giam tai cho nhan vien.
- Tang conversion nhờ huong dan dung san pham.

### Nguon du lieu

- FAQ
- Policy
- Product knowledge
- Article content
- Structured product metadata

### Kien truc de xuat

- Input classifier
- Retrieval step
- Prompt composer
- LLM response generation
- Safety / disclaimer layer
- Escalation rule

### Nhan intent de xuat

- product_search
- product_compare
- usage_question
- shipping_question
- return_policy
- order_tracking
- routine_builder
- symptom_guidance
- human_handoff

### Luu y

- Co prompt system ro rang.
- Co rule cam output qua muc.
- Co disclaimer khi noi dung lien quan suc khoe.

## 9.3. Recommendation system

### Phase 1: rule-based recommendation

Dung khi chua co nhieu data.

Ky thuat:
- Cung category
- Cung concern tags
- Cung ingredient family
- Cung muc gia
- Frequently bought together (co the mock)
- Best sellers

### Phase 2: heuristic scoring

Score = weighted sum cua:
- category relevance
- tag overlap
- user profile overlap
- popularity
- recency
- margin
- stock availability

### Phase 3: ML recommendation

Huong nghien cuu:
- collaborative filtering
- matrix factorization
- implicit feedback model
- session-based recommendation
- learning-to-rank

### Vi tri ap dung recommendation

- Home feed
- Similar products
- Complementary products
- Cart upsell
- Post-purchase reorder

## 9.4. Semantic search

### Muc tieu

Cho phep nguoi dung tim bang cau tu nhien:
- "san pham bo sung vitamin cho nguoi hay met"
- "serum diu nhe cho da nhay cam"
- "do dung cho me va be gia duoi 300k"

### Kien truc

- Lexical search
- Synonym expansion
- Vector search
- Hybrid ranking

### Input de search

- Product title
- Description
- Tags
- Ingredients
- Indications
- FAQs

## 9.5. Predictive ML

Sau khi co du lieu event va transaction, co the nghien cuu:
- propensity to buy
- churn prediction
- reorder prediction
- category affinity
- promotion response
- stock demand forecasting

## 10. Prompt engineering va AI orchestration

## 10.1. Prompt classes can co

- system prompt cho chatbot
- prompt cho recommendation explanation
- prompt cho search interpretation
- prompt cho handoff summary
- prompt cho admin AI analytics explanation

## 10.2. Nguyen tac prompt

- Ngan gon, ro role.
- Cam output chan doan khang dinh.
- Biet gioi han thong tin.
- Neu khong du context thi hoi them.
- Neu query nhay cam thi handoff.

## 10.3. Guardrails

- No medical diagnosis guarantee
- No prescription generation
- No replacement of professionals
- No fabricated product claims
- Explain uncertainty
- Provide safe fallback

## 11. UX / UI blueprint

## 11.1. Storefront UX goals

- Tin cay
- Nhanh
- De tim
- De mua
- Co cam giac duoc "huong dan"

### Thanh phan giao dien chinh

- sticky header
- search prominence
- mega menu
- category strip
- flash sale block
- recommendation shelves
- AI consult widget
- rich product cards
- trust section

## 11.2. Product card

Nen hien:
- Anh
- Ten
- Gia
- Gia giam
- Rating
- Tag
- CTA

Co the them:
- "AI goi y"
- "Phu hop voi"
- "Can tu van"

## 11.3. Product detail UX

Can co:
- Gallery tot
- Muc thong tin ro rang
- Accordion de giam roi
- Related products
- FAQ lien quan
- Chat voi AI ve san pham nay

## 11.4. Admin UX

Admin can toi uu cho:
- bang du lieu lon
- thao tac nhanh
- filter tot
- bulk actions
- chart co y nghia
- workflow ro rang

## 12. Bao mat, quyen rieng tu, va risk management

Du an la hoc thuat nhung van nen thiet ke theo best practices:

- RBAC cho admin
- Session management an toan
- Input validation
- Rate limit cho AI endpoints
- Audit log
- Encryption at rest va in transit
- Consent neu luu du lieu nhay cam
- Data retention rules

## 12.1. Doi voi du lieu suc khoe

Can coi la nhom nhay cam.

Can co:
- thong bao ro rang
- consent
- muc dich su dung
- quyen xoa / chinh sua

## 12.2. Doi voi AI

Can co:
- prompt logging
- response logging
- moderation
- handoff rule
- human review cho noi dung nhay cam

## 13. SEO, noi dung, va growth

Website ecommerce suc khoe rat can SEO.

Can co:
- category landing pages
- product structured data
- FAQ structured data
- article hub
- internal linking
- unique product descriptions
- search indexable pages

Noi dung phuc vu ca:
- SEO
- chatbot retrieval
- trust building

## 14. Roadmap phat trien de xuat

## Phase 0 - Discovery and planning

- Chot pham vi
- Chot taxonomy
- Chot architecture
- Chon template
- Chot data model
- Chot AI use cases

Deliverables:
- README nay
- sitemap
- ERD
- module map

## Phase 1 - UI shell and static prototype

- Storefront layout
- Admin layout
- Mock pages
- Design system
- Sample dataset

Deliverables:
- responsive UI
- static navigation
- mock product listing
- mock admin

## Phase 2 - Commerce core MVP

- auth
- catalog
- PDP
- cart
- checkout mock / sandbox
- order history
- admin catalog CRUD

Deliverables:
- end-to-end basic ecommerce

## Phase 3 - Search and content

- keyword search
- filter
- article CMS
- FAQ
- structured product metadata

Deliverables:
- searchable catalog
- content pages

## Phase 4 - AI MVP

- FAQ chatbot
- product suggestion chatbot
- rule-based recommendation
- AI handoff summary

Deliverables:
- chatbot widget
- recommendation shelves

## Phase 5 - ML and personalization

- event pipeline
- user segmentation
- heuristic ranking
- vector search
- personalized home feed

Deliverables:
- measurable AI personalization

## Phase 6 - Research extensions

- A/B testing
- collaborative filtering
- LTR ranking
- demand forecasting
- pharmacist copilot

## 15. Tieu chi thanh cong

### Product metrics

- search success rate
- add-to-cart rate
- checkout conversion
- repeat purchase proxy
- chatbot containment rate
- recommendation CTR

### AI metrics

- answer relevance
- hallucination rate
- retrieval hit rate
- handoff accuracy
- recommendation precision@k
- NDCG / MAP neu co ranking evaluation

### Engineering metrics

- page load speed
- API latency
- error rate
- uptime
- indexing freshness

## 16. Kiem thu

## 16.1. Frontend testing

- component tests
- page rendering tests
- responsive checks
- accessibility checks

## 16.2. Backend testing

- API tests
- auth tests
- order workflow tests
- inventory logic tests

## 16.3. AI testing

- prompt regression set
- retrieval eval set
- recommendation offline eval
- safety red-team prompts

## 16.4. E2E testing

Luong can cover:
- search -> PDP -> cart -> checkout
- chatbot -> suggestion -> PDP
- home -> recommendation click
- admin CRUD product

## 17. Tai lieu va folder docs de xay dung sau

De du an de train AI agent, nen co them:

```text
/docs
  /architecture.md
  /erd.md
  /api-spec.md
  /ai-prompts.md
  /recommendation-design.md
  /search-design.md
  /admin-requirements.md
  /storefront-requirements.md
  /ml-experiments.md
  /roadmap.md
```

## 18. De xuat cach su dung tai lieu nay de prompt AI khac

Khi giao viec cho model khac, nen truyen:

1. README.md nay
2. Pham vi task cu the
3. Danh sach file cho phep sua
4. Tieu chi hoan thanh
5. Yeu cau coding style

### Mau prompt handoff

```text
Ban dang lam viec tren du an AuraCare AI.
Hay doc README.md truoc de hieu tong the kien truc, pham vi, va muc tieu.

Task hien tai:
- Xay dung [ten module]

Yeu cau:
- Khong pha vo kien truc tong the mo ta trong README.md
- Neu can them bang du lieu, cap nhat dung naming va data flow da quy dinh
- Uu tien code sach, typed, de mo rong

Output:
- Code
- Giai thich thay doi
- Danh sach file da sua
- Risk / assumptions
```

## 19. De xuat backlog module chi tiet

### Storefront backlog

- Header + mega menu
- Search UI
- Home blocks
- Category page
- Product cards
- PDP
- Reviews
- Wishlist
- Cart drawer
- Checkout
- Order history
- AI chat widget

### Admin backlog

- Auth
- Dashboard
- Product table
- Product form
- Category management
- Inventory table
- Order table
- Customer table
- Promotion manager
- Content manager
- AI logs
- Analytics dashboard

### AI backlog

- FAQ retriever
- Product QA agent
- Recommendation API
- Search query parser
- Human handoff logic
- Prompt dashboard

### ML backlog

- event feature store
- user embedding
- product embedding
- hybrid ranking
- collaborative filtering baseline
- offline evaluation notebook

## 20. Quy uoc thiet ke ky thuat

- Frontend dung TypeScript nghiem tuc.
- UI dung Tailwind + shadcn/ui.
- Components duoc tach nho, de tai su dung.
- Du lieu demo duoc dat tach khoi UI.
- Mock dataset Phase 1 phai dung du cho database seed va embedding enrichment.
- API contracts typed.
- Khong nhung business logic phuc tap truc tiep vao component.
- AI prompts duoc version hoa.
- Event names nhat quan.
- Data model uu tien mo rong.

## 20.1. Mock Data Rules for Phase 1

Mock dataset Phase 1 phai co:
- `60 SKU` tong cong
- `30 supplement`
- `30 skincare`

Moi object san pham phai co toi thieu:
- id
- slug
- name
- brand
- category
- short_description
- long_description
- price
- compare_at_price
- stock_status
- package_size
- ingredients_text
- usage_instructions
- warnings
- concern_tags
- symptom_tags
- benefit_tags
- searchable_text
- embedding_vector

Gia tri ban dau cho `embedding_vector`:
- `[]` hoac `null`

Sau khi seed vao database:
- chay 1 script enrich duy nhat
- goi Gemini embedding API
- update lai cot `embedding_vector`

## 20.2. Semantic Search Execution Rule

Semantic search Phase 1 phai di theo pipeline:

1. User query
2. Tao vector bang `Gemini text-embedding-004`
3. So khop voi `pgvector` trong `Supabase Postgres`
4. Dung `cosine similarity`
5. Tra ket qua hybrid neu can voi lexical search

Nguyen tac:
- Khong dung embedding model qua nang o phase dau
- Khong tach service rieng neu Postgres + pgvector da du
- Search logs phai duoc luu tu ngay dau

## 21. Ranh gioi hoc thuat va dao duc

Vi du an co yeu to suc khoe va AI, can dat cac nguyen tac:
- Khong tu nhan la he thong chan doan y khoa.
- Khong khuyen khich bo qua chuyen gia y te.
- Khong tao claim vuot qua du lieu.
- Neu gap truong hop nhay cam, khuyen nghi lien he chuyen gia.
- Minh bach khi noi dung la "AI-generated".

## 22. Ket luan

AuraCare AI nen duoc xem la mot du an giao nhau giua:
- ecommerce engineering
- health information UX
- conversational AI
- recommendation systems
- search and retrieval
- machine learning experimentation

Chien luoc dung nhat la:
- Bat dau bang mot commerce platform manh.
- Cai dat event va data dung ngay tu dau.
- Them AI theo lop, tu don gian den nang cao.
- Luu y tinh mo rong, tinh giai thich duoc, va kha nang handoff cho agent khac.

Neu du an duoc thuc hien theo README nay, doi nguoi hoac AI agent khac co the tiep quan tung module mot cach co he thong ma khong mat dinh huong tong the.
