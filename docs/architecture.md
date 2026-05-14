# Architecture

## 1. Overview

AuraCare AI is designed as a health-focused ecommerce platform with an AI enhancement layer.

The system is divided into five logical domains:

1. Storefront
2. Admin
3. Commerce Core
4. AI Services
5. Data and ML Pipeline

This separation is intentional:
- Storefront focuses on customer-facing UX.
- Admin focuses on internal operations and governance.
- Commerce Core contains source-of-truth business logic.
- AI Services remain modular so models, prompts, and retrieval logic can evolve.
- Data and ML Pipeline supports analytics, training, evaluation, and experimentation.

## 2. Recommended Technical Shape

## 2.1. Current Project Direction

The current repository is best evolved as a Next.js-first application with room for future service extraction.

Recommended path:
- Keep `Next.js + React + Tailwind + shadcn/ui` for primary web applications.
- Use `PostgreSQL` as the primary data store.
- Keep `Supabase` for authentication, storage, and managed Postgres features where useful.
- Introduce a dedicated Python service only when ML or ranking workloads become non-trivial.
- Do not buy a commercial storefront template in Phase 1.
- Build the storefront from `shadcn/ui` primitives with open-source inspiration only.
- Use `shadcn-admin` as the admin foundation.

## 2.2. Deployment Strategy by Phase

### Phase 0 to Phase 2

Architecture style:
- Modular monolith

Reason:
- Faster iteration
- Simpler deployment
- Lower operational complexity
- Better fit for academic/prototype scope

### Phase 3 onward

Possible extraction candidates:
- Search service
- Recommendation service
- Conversational AI orchestration service
- Batch workers / event consumers

## 3. Logical System Diagram

```text
[Customer Browser]
       |
       v
[Storefront Next.js App]
       |
       +--------------------+
       |                    |
       v                    v
[Commerce APIs]         [AI APIs]
       |                    |
       v                    v
[PostgreSQL / Supabase] [Vector Index / Retrieval / Prompt Layer]
       |
       v
[Analytics + Event Logs]
       |
       v
[ML / Ranking / Reporting Jobs]


[Admin Browser]
       |
       v
[Admin Next.js App]
       |
       v
[Commerce + Content + AI Ops APIs]
```

## 4. Domain Breakdown

## 4.1. Storefront

Responsibilities:
- Home page
- Search and category browsing
- Product detail pages
- Cart and checkout
- User account
- AI consult entry points
- Recommendation surfaces

Should contain:
- Presentation logic
- UI state
- API integration

Should not contain:
- Pricing rules
- Inventory reservation logic
- Recommendation model logic
- AI prompt composition logic

## 4.2. Admin

Responsibilities:
- Product management
- Category management
- Pricing and promotions
- Inventory control
- Order operations
- Customer service workflows
- AI logs and supervision
- Content management
- Reporting dashboard

Admin should be designed for:
- Large tables
- Filtering
- Bulk actions
- Role-based access

## 4.3. Commerce Core

This is the business heart of the platform.

Responsibilities:
- Product catalog
- Brand and category structure
- Inventory state
- Cart behavior
- Checkout workflow
- Orders
- Promotions
- Reviews and wishlist

Rules:
- Business logic should live here, not inside UI components.
- APIs should be typed and version-aware.
- Commerce Core remains model-agnostic and AI-agnostic.

## 4.4. AI Services

Responsibilities:
- Chat orchestration
- Retrieval
- Search understanding
- Recommendation scoring
- Human handoff summarization

Submodules:
- `intent-classifier`
- `knowledge-retriever`
- `response-generator`
- `recommendation-engine`
- `guardrail-layer`
- `feedback-logger`

## 4.5. Data and ML Pipeline

Responsibilities:
- Capture events
- Prepare features
- Compute product embeddings
- Compute user embeddings
- Batch scoring
- Offline evaluation
- Dashboard metrics

The data pipeline is a first-class part of the architecture and not an afterthought.

Phase 1 boundaries:
- Product scope: `supplement + skincare`
- AI scope: `chatbot + rule-based recommendation + semantic search`
- Routine builder is deferred to a later phase

## 5. Communication Boundaries

## 5.1. Storefront to Commerce Core

Recommended interface:
- Internal API routes initially
- Shared TypeScript DTOs

Example endpoints:
- `GET /api/products`
- `GET /api/products/:slug`
- `POST /api/cart/items`
- `POST /api/checkout`

## 5.2. Storefront to AI Services

Recommended interface:
- Separate AI route namespace

Example endpoints:
- `POST /api/ai/chat`
- `POST /api/ai/recommend`
- `POST /api/ai/search`

## 5.3. Admin to AI Ops

Example endpoints:
- `GET /api/admin/ai/sessions`
- `GET /api/admin/ai/messages`
- `POST /api/admin/ai/prompts`
- `POST /api/admin/ai/retrain-trigger`

## 6. Repository Structure Recommendation

## 6.1. Near-Term Structure

```text
/app
/components
/actions
/lib
/types
/docs
/prompts
/ml
```

## 6.2. Future Monorepo Structure

```text
/apps
  /storefront
  /admin
  /ai-service
/packages
  /ui
  /db
  /types
  /analytics
  /ai-core
  /config
/docs
/scripts
```

## 7. Cross-Cutting Concerns

## 7.1. Authentication and Authorization

Customer side:
- Signup / login
- Profile management
- Order ownership

Admin side:
- Role-based access control
- Protected routes
- Audit trails

Recommended roles:
- customer
- support
- pharmacist_consultant
- catalog_manager
- operations_manager
- admin

## 7.2. Observability

Minimum required:
- Structured logs
- Error capture
- API timing
- Event analytics
- AI request traces

## 7.3. Safety and AI Governance

All AI responses related to health must pass through:
- guardrails
- uncertainty framing
- escalation rules
- disclaimers

## 8. Data Flow Scenarios

## 8.1. Product Discovery Flow

1. User opens home page.
2. Storefront loads featured products and recommendation shelves.
3. Recommendation API uses user context + fallback rules.
4. Product listing is returned.
5. User clicks a product.
6. Event logs are stored for later training and analytics.

## 8.2. AI Consultation Flow

1. User opens AI chat.
2. Message enters intent classifier.
3. Relevant documents/products are retrieved.
4. Prompt is composed with rules and context.
5. LLM generates draft response.
6. Guardrail layer checks response.
7. Response is returned and logged.
8. If sensitive or uncertain, user is routed to human handoff.

## 8.4. Semantic Search Flow

1. User enters a natural language query.
2. Backend generates an embedding with `Gemini text-embedding-004`.
3. Query vector is compared against product vectors stored in `pgvector`.
4. Cosine similarity is used for nearest-neighbor matching.
5. A hybrid ranker may blend keyword score and vector score.
6. Search events are logged for analytics and future tuning.

## 8.3. Checkout Flow

1. User adds products to cart.
2. Cart state is saved.
3. Inventory availability is checked.
4. Promotions are applied.
5. User confirms checkout.
6. Order is created.
7. Payment state is persisted.
8. Events are logged for analytics and reorder prediction.

## 9. Architectural Principles

The project should follow these principles:

- Keep domain logic out of UI components.
- Keep AI logic modular and replaceable.
- Prefer typed contracts.
- Log important behavior from the start.
- Design for gradual extraction, not premature microservices.
- Keep recommendation and search explainable.
- Keep data model ML-friendly.

## 10. What Should Be Built First

Recommended build order:

1. Information architecture and docs
2. Shared domain types
3. Mock data and page shells
4. Catalog model and listing APIs
5. Cart and order basics
6. Search basics
7. AI FAQ and recommendation MVP
8. ML and personalization experiments

This architecture is optimized for iterative delivery while preserving a strong long-term foundation.
