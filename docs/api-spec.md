# API Specification

## 1. Purpose

This document defines the initial API surface for AuraCare AI.

The API is grouped into:
- Storefront APIs
- Admin APIs
- AI APIs
- Analytics APIs

This is a v1 planning document, not a final OpenAPI contract.

## 2. API Design Principles

- JSON over HTTP
- Stable resource naming
- Typed DTOs in application code
- Explicit error formats
- Auth-aware endpoints
- Safe AI output patterns

Recommended envelope for errors:

```json
{
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Requested product was not found."
  }
}
```

## 3. Storefront API Surface

## 3.1. Catalog

### GET /api/products

Purpose:
- Fetch product listing

Query params:
- `category`
- `brand`
- `q`
- `minPrice`
- `maxPrice`
- `sort`
- `page`
- `pageSize`

Response:
- paginated product list
- available filters

### GET /api/products/:slug

Purpose:
- Fetch product detail page data

Response includes:
- product details
- variant info
- gallery
- attributes
- related products

### GET /api/categories

Purpose:
- Fetch category tree

### GET /api/brands

Purpose:
- Fetch brand list

## 3.2. Cart

### GET /api/cart

Purpose:
- Read current cart

### POST /api/cart/items

Purpose:
- Add item to cart

Body:

```json
{
  "productVariantId": "uuid",
  "quantity": 1
}
```

### PATCH /api/cart/items/:id

Purpose:
- Update quantity

### DELETE /api/cart/items/:id

Purpose:
- Remove item from cart

## 3.3. Checkout and Orders

### POST /api/checkout

Purpose:
- Submit checkout

Body:
- shipping info
- cart reference
- payment method

### GET /api/orders

Purpose:
- Fetch current user's order history

### GET /api/orders/:orderNumber

Purpose:
- Fetch order detail

## 3.4. Account

### GET /api/me

Purpose:
- Read current user profile

### PATCH /api/me/profile

Purpose:
- Update profile

### GET /api/me/wishlist

### POST /api/me/wishlist

### DELETE /api/me/wishlist/:productId

## 4. Search API Surface

### GET /api/search

Purpose:
- Hybrid keyword and semantic search

Query params:
- `q`
- `category`
- `sort`
- `page`

Response:
- results
- interpreted query
- suggested filters

### POST /api/search/track

Purpose:
- Record search click or search outcome

## 5. AI API Surface

## 5.1. Chat

### POST /api/ai/chat

Purpose:
- Main AI customer support endpoint

Request:

```json
{
  "sessionId": "optional-session-id",
  "message": "Toi dang tim san pham bo sung vitamin cho nguoi hay met",
  "context": {
    "currentPage": "/products/abc",
    "productId": "optional-product-id"
  }
}
```

Response:

```json
{
  "sessionId": "uuid",
  "reply": "AI response text",
  "intent": "product_search",
  "suggestedProducts": [],
  "requiresHumanHandoff": false,
  "disclaimer": "Noi dung mang tinh tham khao."
}
```

## 5.2. Recommendations

### POST /api/ai/recommend

Purpose:
- Return recommendation list for a specific surface

Request:

```json
{
  "surface": "home_feed",
  "userId": "optional",
  "productId": "optional",
  "cartProductIds": []
}
```

Response:
- ranked products
- reason labels

## 5.3. Routine Builder

### POST /api/ai/routine

Purpose:
- Build a suggested health or care routine

Request:

```json
{
  "goal": "immunity_support",
  "constraints": ["sensitive_skin", "budget_under_500k"]
}
```

Response:
- structured routine
- recommended products
- disclaimers

## 5.4. Search Interpretation

### POST /api/ai/search

Purpose:
- Interpret natural language query and convert it into structured search hints

## 6. Admin API Surface

## 6.1. Product Management

### GET /api/admin/products

### POST /api/admin/products

### GET /api/admin/products/:id

### PATCH /api/admin/products/:id

### DELETE /api/admin/products/:id

## 6.2. Category and Brand Management

### GET /api/admin/categories

### POST /api/admin/categories

### GET /api/admin/brands

### POST /api/admin/brands

## 6.3. Inventory

### GET /api/admin/inventory

### PATCH /api/admin/inventory/:variantId

## 6.4. Orders

### GET /api/admin/orders

### GET /api/admin/orders/:id

### PATCH /api/admin/orders/:id/status

## 6.5. Customers

### GET /api/admin/customers

### GET /api/admin/customers/:id

## 6.6. Content

### GET /api/admin/articles

### POST /api/admin/articles

### GET /api/admin/faqs

### POST /api/admin/faqs

## 6.7. AI Operations

### GET /api/admin/ai/sessions

### GET /api/admin/ai/sessions/:id/messages

### GET /api/admin/ai/recommendation-logs

### POST /api/admin/ai/prompts

## 7. Analytics API Surface

### POST /api/events

Purpose:
- Generic event ingestion

Request:

```json
{
  "eventName": "product_view",
  "sessionId": "uuid",
  "pagePath": "/products/abc",
  "payload": {
    "productId": "uuid"
  }
}
```

### GET /api/admin/analytics/overview

### GET /api/admin/analytics/search

### GET /api/admin/analytics/recommendations

### GET /api/admin/analytics/chatbot

## 8. Auth Considerations

Protected routes:
- `/api/me/*`
- `/api/orders/*`
- all `/api/admin/*`

Optional anonymous mode:
- cart
- search
- recommendation
- chat

## 9. Versioning Strategy

Short term:
- keep API internal and consistent

Long term:
- version AI routes if behavior changes significantly
- version admin DTOs if workflow complexity increases

## 10. Future OpenAPI Candidates

This document should later evolve into:
- OpenAPI schema
- typed client SDK
- DTO validation schemas using Zod
