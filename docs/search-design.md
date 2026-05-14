# Search Design

## 1. Goal

Phase 1 search must deliver visible AI value while staying simple enough for a solo academic project.

The supported catalog scope is:
- supplement
- skincare

## 2. Phase 1 Scope

Included:
- keyword search
- semantic search
- hybrid ranking
- search logging

Excluded:
- advanced personalization rankers
- dedicated search microservice
- heavy embedding models

## 3. Technical Stack

- Supabase Postgres
- pgvector
- Gemini `text-embedding-004`

## 4. Required Query Flow

1. User enters a query.
2. Backend normalizes the query text.
3. Backend requests an embedding from `Gemini text-embedding-004`.
4. The embedding is compared with stored product vectors in `pgvector`.
5. Cosine similarity is used for vector ranking.
6. Keyword score may be blended with vector score.
7. Ranked results are returned.
8. Search logs are stored.

## 5. Product Embedding Inputs

Recommended text composition for each product:
- product name
- short description
- long description
- concern tags
- symptom tags
- benefit tags
- ingredients
- searchable_text

## 6. Mock Data and Enrichment

Phase 1 dataset:
- 60 products total
- 30 supplement
- 30 skincare

Each product must include:
- `embedding_vector: null` or `[]`

After seeding:
- run one enrichment script
- fetch products without embeddings
- generate embeddings via Gemini
- update the `embedding_vector` column

## 7. Ranking Strategy

Initial heuristic:

`final_score = 0.55 * vector_score + 0.45 * keyword_score`

This is only a baseline and may be tuned later.

## 8. Logging

Every search should log:
- query text
- normalized query
- result count
- clicked product
- search type
- timestamp

## 9. Why This Design

This design is chosen because:
- it works natively with Supabase
- it creates immediate user-visible value
- it is realistic for Phase 1
- it keeps infrastructure simple
