# Admin Requirements

## 1. Admin Goal

The admin system should manage the full lifecycle of:
- products
- pricing
- inventory
- orders
- customers
- content
- AI supervision

It should be optimized for operations, not marketing visuals.

## 2. Admin Users

Expected roles:
- support
- pharmacist_consultant
- catalog_manager
- inventory_operator
- operations_manager
- admin

## 3. Main Admin Modules

1. Dashboard
2. Product management
3. Category and brand management
4. Inventory management
5. Order management
6. Customer management
7. Promotion management
8. Content management
9. AI operations
10. Analytics and reporting

## 4. Dashboard Requirements

Should show:
- revenue summary
- orders summary
- low stock alerts
- top searched terms
- AI chatbot usage
- recommendation performance

## 5. Product Management Requirements

Must support:
- create product
- edit product
- delete or archive product
- manage variants
- manage images
- manage tags and attributes
- publish/unpublish

Important metadata:
- healthcare concerns
- usage instructions
- warnings
- target audience
- search tags

## 6. Category and Brand Management

Must support:
- category hierarchy
- sorting
- active/inactive state
- brand profile

## 7. Inventory Management

Must support:
- per-SKU stock view
- quantity updates
- threshold alerts
- warehouse field

## 8. Order Management

Must support:
- order list with filters
- order detail
- status transitions
- payment state
- fulfillment state
- refund/cancel notes

Recommended filters:
- order date
- status
- payment state
- customer

## 9. Customer Management

Must support:
- customer profile
- order history
- AI conversation history
- segmentation fields
- support notes

## 10. Promotion Management

Should support:
- flash sales
- coupon codes
- start and end time
- discount rules
- eligibility conditions

## 11. Content Management

Should support:
- articles
- FAQ
- homepage banners
- promo blocks
- trust and policy pages

## 12. AI Operations Module

This module is critical for the research value of the project.

Must support:
- view chat sessions
- inspect individual messages
- see detected intent
- see retrieved sources
- view recommendation logs
- mark AI responses as helpful/unhelpful
- monitor escalation rate

Future enhancements:
- prompt versioning
- retrieval debugging
- experiment comparisons

## 13. Analytics Module

Must support:
- revenue charts
- product performance
- search analytics
- recommendation CTR
- chatbot resolution rate
- user funnel summaries

## 14. UX Principles for Admin

- information density is acceptable
- tables must be strong
- filters must be first-class
- bulk actions save time
- important states must be visible
- operations should be auditable

## 15. Recommended Build Order

1. Admin shell and auth guard
2. Dashboard overview
3. Product table
4. Product form
5. Category and brand management
6. Inventory table
7. Order table and order detail
8. Customer table
9. AI logs
10. Analytics
