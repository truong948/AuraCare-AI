# AuraCare AI Supabase Setup

## Trạng thái cần đạt

Supabase phải có đủ:

- Auth profiles: `profiles`, trigger tự tạo profile khi người dùng đăng ký, role `user/admin`.
- Catalog: `products`, `product_variants`, `embedding_vector vector(768)`.
- Commerce: `orders`, `order_items`.
- Skin diary: `skin_profiles`, `skin_diaries`, bucket public `diary_images`.
- AI: RPC `match_products_by_embedding` cho Gemini `text-embedding-004` + pgvector.
- RLS: public đọc catalog, user chỉ đọc/ghi dữ liệu của chính mình, admin quản trị.

## Cài CLI và push schema

```bash
npm install -g supabase
supabase login
supabase link --project-ref <PROJECT_REF>
supabase db push
```

Nếu chưa muốn dùng CLI, mở Supabase SQL Editor và chạy nội dung file:

```text
supabase/migrations/20260528000100_initial_schema.sql
```

## Biến môi trường

`.env.local` cần có:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
GOOGLE_API_KEY=<gemini-api-key>
```

`SUPABASE_SERVICE_ROLE_KEY` chỉ dùng cho script seed/enrichment ở máy local hoặc server private. Không đưa key này vào frontend, GitHub public, hoặc biến `NEXT_PUBLIC_*`.

## Seed sản phẩm và embedding

Tạo hoặc refresh embedding payload:

```bash
npm run ai:enrich-embeddings
```

Đẩy catalog lên Supabase:

```bash
npm run db:seed-products -- --dry-run
npm run db:seed-products
```

Nếu `GOOGLE_API_KEY` chưa thật, script vẫn có fallback vector 768 chiều để test kỹ thuật, nhưng semantic search sẽ không có chất lượng thật. Khi có Gemini key, chạy lại cả hai lệnh trên.

## Tạo admin đầu tiên

Sau khi đăng ký tài khoản trong website, chạy trong SQL Editor:

```sql
update public.profiles
set role = 'admin'
where email = 'your-admin-email@example.com';
```

## Kiểm tra nhanh

```bash
npm run typecheck
npm run build
```

Sau khi push schema và seed, kiểm tra các URL:

- `/products`: xem catalog.
- `/products/<slug>`: xem PDP và tư vấn AI.
- `/search`: thử semantic search.
- `/diary`: upload ảnh vào bucket `diary_images`.
- `/dashboard/users`: đăng nhập admin để kiểm tra phân quyền.
