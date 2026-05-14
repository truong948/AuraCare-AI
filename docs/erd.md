# ERD and Data Model

## 1. Purpose

This document defines the initial data model for AuraCare AI.

The goal is to support:
- Ecommerce workflows
- Content workflows
- AI retrieval
- Recommendation systems
- Analytics and ML experimentation

## 2. Core Entity Groups

The schema is grouped into:

1. Identity and profiles
2. Catalog
3. Commerce
4. Content and knowledge
5. AI conversations and feedback
6. Analytics and event logs

## 3. High-Level ERD

```text
users ----< user_profiles
users ----< addresses
users ----< carts ----< cart_items >---- product_variants
users ----< orders ----< order_items >---- product_variants
users ----< wishlists ----< wishlist_items >---- products
users ----< reviews >---- products

brands ----< products
categories ----< products
products ----< product_variants
products ----< product_images
products ----< product_attributes
products ----< product_tags
products ----< inventory_items

articles
faqs
knowledge_sources

users ----< chatbot_sessions ----< chatbot_messages
chatbot_sessions ----< ai_handoffs
products ----< recommendation_logs
users ----< recommendation_logs

users ----< event_logs
products ----< event_logs
orders ----< event_logs
```

## 4. Identity and Profile Tables

## 4.1. users

Purpose:
- Authentication identity

Suggested fields:
- id
- email
- phone
- password_hash or auth_provider_reference
- role
- is_active
- created_at
- updated_at

## 4.2. user_profiles

Purpose:
- Extended profile and personalization

Suggested fields:
- id
- user_id
- full_name
- gender
- birth_year
- health_goals_json
- concerns_json
- allergies_json
- budget_preference
- communication_preferences_json
- created_at
- updated_at

## 4.3. addresses

Purpose:
- Shipping and billing addresses

Suggested fields:
- id
- user_id
- label
- recipient_name
- phone
- address_line_1
- address_line_2
- ward
- district
- province
- postal_code
- is_default
- created_at
- updated_at

## 5. Catalog Tables

## 5.1. categories

Purpose:
- Category tree

Suggested fields:
- id
- parent_id
- slug
- name
- description
- image_url
- sort_order
- is_active

## 5.2. brands

Purpose:
- Product brands

Suggested fields:
- id
- slug
- name
- description
- logo_url
- country_of_origin
- is_active

## 5.3. products

Purpose:
- Main product entity

Suggested fields:
- id
- slug
- name
- short_description
- long_description
- brand_id
- category_id
- product_type
- usage_instructions
- target_users
- warnings
- ingredients_text
- origin_country
- package_size
- searchable_text
- status
- is_featured
- created_at
- updated_at

AI-focused fields:
- symptom_tags_json
- concern_tags_json
- benefit_tags_json
- contraindication_tags_json
- age_group_tags_json
- gender_tags_json
- embedding_vector nullable
- embedding_status

## 5.4. product_variants

Purpose:
- Variant-level sellable units

Suggested fields:
- id
- product_id
- sku
- barcode
- variant_name
- unit_label
- price
- compare_at_price
- currency
- stock_status
- weight_grams
- is_default
- is_active

## 5.5. product_images

Purpose:
- Product gallery

Suggested fields:
- id
- product_id
- image_url
- alt_text
- sort_order
- is_primary

## 5.6. product_attributes

Purpose:
- Flexible attributes

Suggested fields:
- id
- product_id
- attribute_key
- attribute_value
- attribute_group

Examples:
- dosage
- skin_type
- age_range
- flavor
- storage_condition

## 5.7. product_tags

Purpose:
- Search and recommendation tagging

Suggested fields:
- id
- product_id
- tag_type
- tag_value

Examples:
- concern: digestion
- concern: immunity
- benefit: hydration
- persona: elderly

## 5.8. inventory_items

Purpose:
- Stock tracking

Suggested fields:
- id
- product_variant_id
- warehouse_code
- quantity_on_hand
- quantity_reserved
- reorder_threshold
- updated_at

## 6. Commerce Tables

## 6.1. carts

Suggested fields:
- id
- user_id nullable
- anonymous_id nullable
- status
- created_at
- updated_at

## 6.2. cart_items

Suggested fields:
- id
- cart_id
- product_variant_id
- quantity
- unit_price_snapshot
- added_at

## 6.3. orders

Suggested fields:
- id
- order_number
- user_id
- status
- payment_status
- fulfillment_status
- subtotal_amount
- discount_amount
- shipping_amount
- total_amount
- currency
- shipping_address_snapshot_json
- placed_at
- created_at
- updated_at

## 6.4. order_items

Suggested fields:
- id
- order_id
- product_variant_id
- product_name_snapshot
- sku_snapshot
- quantity
- unit_price
- discount_amount
- line_total

## 6.5. payments

Suggested fields:
- id
- order_id
- provider
- payment_method
- transaction_reference
- amount
- status
- paid_at
- metadata_json

## 6.6. promotions

Suggested fields:
- id
- code nullable
- name
- description
- promotion_type
- discount_type
- discount_value
- start_at
- end_at
- is_active
- conditions_json

## 6.7. coupons

Suggested fields:
- id
- promotion_id
- code
- usage_limit
- used_count
- per_user_limit
- is_active

## 6.8. reviews

Suggested fields:
- id
- user_id
- product_id
- rating
- title
- body
- status
- created_at

## 6.9. wishlists and wishlist_items

Suggested fields:
- wishlists: id, user_id, created_at
- wishlist_items: id, wishlist_id, product_id, created_at

## 7. Content and Knowledge Tables

## 7.1. articles

Suggested fields:
- id
- slug
- title
- excerpt
- content_markdown
- category
- cover_image_url
- author_name
- published_at
- status

## 7.2. faqs

Suggested fields:
- id
- question
- answer
- topic
- status
- updated_at

## 7.3. knowledge_sources

Purpose:
- Source tracking for AI retrieval

Suggested fields:
- id
- source_type
- source_ref
- title
- plain_text
- embedding_vector nullable
- last_indexed_at

Possible sources:
- article
- faq
- policy
- product

## 8. AI and Conversation Tables

## 8.1. chatbot_sessions

Suggested fields:
- id
- user_id nullable
- anonymous_id nullable
- channel
- started_at
- ended_at
- status
- escalation_status

## 8.2. chatbot_messages

Suggested fields:
- id
- session_id
- sender_type
- message_text
- intent
- retrieved_context_json
- model_name
- token_usage_json
- safety_flags_json
- created_at

## 8.3. ai_handoffs

Suggested fields:
- id
- session_id
- trigger_reason
- summary_text
- assigned_to nullable
- status
- created_at

## 8.4. recommendation_logs

Suggested fields:
- id
- user_id nullable
- anonymous_id nullable
- source_surface
- product_id
- recommended_product_id
- recommendation_reason
- score
- clicked_at nullable
- purchased_at nullable
- created_at

## 9. Analytics Tables

## 9.1. search_logs

Suggested fields:
- id
- user_id nullable
- anonymous_id nullable
- query_text
- normalized_query
- result_count
- clicked_product_id nullable
- search_type
- created_at

## 9.2. event_logs

Suggested fields:
- id
- event_name
- user_id nullable
- anonymous_id nullable
- session_id
- page_path
- source_surface
- product_id nullable
- order_id nullable
- payload_json
- device_type
- created_at

Tracked events:
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

## 10. Model-Friendly Data Notes

To support ML later:
- Keep raw interaction logs.
- Do not overwrite product metadata without version awareness.
- Preserve snapshots for order items.
- Maintain tags in structured and textual form.
- Store enough context for offline evaluation.

## 11. Suggested Initial Build Priority

Phase 1 tables:
- users
- user_profiles
- categories
- brands
- products
- product_variants
- product_images
- inventory_items
- carts
- cart_items
- orders
- order_items

Phase 1 dataset constraints:
- 60 SKU total
- 30 supplement
- 30 skincare
- every product must carry `embedding_vector = null` or `[]` at seed time

Phase 2 additions:
- promotions
- coupons
- reviews
- wishlists
- articles
- faqs

Phase 3 additions:
- chatbot_sessions
- chatbot_messages
- recommendation_logs
- search_logs
- event_logs
- knowledge_sources

## 12. Naming Principles

- Use plural table names.
- Use snake_case.
- Prefer explicit foreign keys.
- Store snapshots for mutable commerce data.
- Keep JSON columns for flexible metadata, but preserve core relational structure.

This ERD is designed to balance ecommerce needs with AI experimentation from the beginning.
