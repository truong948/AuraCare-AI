# Phase 4 Semantic Search Flow

## Muc tieu

Tai Phase 4, semantic search cua AuraCare duoc thiet ke theo co che:

1. User nhap truy van bang ngon ngu tu nhien.
2. Backend chuan hoa query.
3. Neu moi truong da co `GOOGLE_API_KEY` va `Supabase`, backend goi `Gemini text-embedding-004`.
4. Vector query duoc dua vao ham `match_products_by_embedding` tren `pgvector`.
5. Ket qua vector duoc blend voi keyword score.
6. Frontend hien thi ly do goi y.

## Fallback hien tai

Neu chua co khoa that:

1. Query van duoc normalize.
2. He thong tao diem semantic xap xi tu metadata local:
   - concern tags
   - benefit tags
   - symptom tags
   - searchable text
3. He thong van tra ve `score`, `semanticScore`, `keywordScore`, `reason`.

## API route

- `POST /api/search`
- Body:

```json
{
  "query": "da nhay cam thieu am",
  "category": "skincare",
  "limit": 8
}
```

## Widget hien thi

- `app/search/page.tsx`: hien thi ket qua server-side va widget semantic search de test truc tiep.
- `app/products/[slug]/page.tsx`: widget product Q&A goi `POST /api/chat`.
- `app/cart/page.tsx`: kệ recommendation mua kèm cho giỏ hàng.

## Logging local

- Search events duoc append vao `.ai-logs/search-events.jsonl`
- Chat events duoc append vao `.ai-logs/chat-events.jsonl`
- Day la logging local phu hop cho prototype hoc thuat, giup giu lai query, source va handoff summary ma chua can database.

## Embedding preview

- `GET /api/embeddings/preview?limit=5`
- Route nay duoc dung de preview embedding cho 60 SKU mock.
- Neu da co `GOOGLE_API_KEY`, preview se dung `Gemini text-embedding-004`.
- Neu chua co key, he thong dung deterministic fallback vector de test flow.

## Ghi chu thuc thi

- Search core: [E:\auracare-ai\lib\ai\search.ts](E:/auracare-ai/lib/ai/search.ts:1)
- Chat core: [E:\auracare-ai\lib\ai\chat.ts](E:/auracare-ai/lib/ai/chat.ts:1)
- Recommendation core: [E:\auracare-ai\lib\ai\recommendations.ts](E:/auracare-ai/lib/ai/recommendations.ts:1)
