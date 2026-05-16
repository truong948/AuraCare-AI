# AuraCare AI MVP Status

## Current Completion

AuraCare AI is now a working academic ecommerce prototype for supplement and skincare discovery with AI-assisted shopping.

Completed surfaces:
- Storefront home, product catalog, category pages, search, product detail pages, wishlist, compare, cart, checkout, order history, and order detail.
- Admin dashboard for overview, product management, order operations, settings, and AI Ops.
- AI MVP with chatbot, product Q&A, semantic-search-ready flow, rule-based recommendations, personalization signals, AI history, and AI Ops analytics.
- Research and readiness layer with recommendation evaluation, personalization experiments, chat safety benchmark, readiness checks, and evaluation history snapshots.

## Demo Flow

1. Open `/`.
2. Browse `/products` or a category page.
3. Open a product detail page and use the product AI assistant.
4. Add products to cart.
5. Complete mock checkout at `/checkout`.
6. Review orders at `/orders` and `/orders/[id]`.
7. Review operations at `/dashboard/orders`.
8. Review AI quality and readiness at `/dashboard/ai-ops`.

## Known Dev-Mode Limits

- Orders, cart, wishlist, compare, recently viewed, and admin product edits are localStorage-based.
- Gemini/Supabase production readiness depends on real environment keys and database configuration.
- Semantic search is architected for Gemini embeddings and pgvector, but local dev can fall back to mock embeddings.
- Payment, logistics, inventory reservation, and legal medical review are intentionally mocked for the academic MVP.

## Next Production Hardening

- Move cart, orders, and admin CRUD from localStorage to Supabase tables.
- Add authenticated customer/admin roles and route guards for commerce operations.
- Replace mock checkout with a sandbox payment provider.
- Run embedding enrichment with a real Gemini API key and persist vectors into Supabase pgvector.
- Add automated E2E tests for search, PDP, cart, checkout, order detail, and AI guardrails.
