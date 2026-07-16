# Database Schema

This public portfolio version documents the main tables used by the system.

## `orders`

Recommended fields:

| Field | Type | Purpose |
|---|---|---|
| `order_id` | text | Unique business order identifier |
| `customer_phone` | text | Customer identifier used by the WhatsApp workflow |
| `customer_name` | text | Optional customer name |
| `items` | jsonb | Structured order items |
| `items_text` | text | Human-readable item summary |
| `special_request` | text | Customer notes |
| `total` | numeric | Order total |
| `order_status` | text | `pending`, `preparing`, `ready`, `served`, `bill_requested`, `closed`, `cancelled` |
| `source` | text | Order source |
| `order_type` | text | `dine_in`, `takeaway`, or `unknown` |
| `table_id` | text | Optional table identifier |
| `payment_status` | text | `unpaid` or `paid` |
| `payment_method` | text | Optional payment method |
| `created_at` | timestamptz | Creation timestamp |
| `preparing_at` | timestamptz | Preparation start |
| `ready_at` | timestamptz | Ready timestamp |
| `completed_at` | timestamptz | Paid-and-closed timestamp |
| `cancelled_at` | timestamptz | Cancellation timestamp |

## `order_events`

| Field | Type | Purpose |
|---|---|---|
| `order_id` | text | Related order identifier |
| `event_type` | text | Lifecycle event |
| `notes` | text | Human-readable event note |
| `created_at` | timestamptz | Event timestamp |

## Customer Session Table

The n8n Data Table named `customers` stores:

- Customer identity
- Session status
- Current order
- Special requests
- Order statistics
- Loyalty indicators
- Table and order type context

## Chat Messages Table

The n8n Data Table named `chat_messages` stores:

- Customer phone
- Customer name
- Message role
- Message text
- Session direction

> Production deployments should use strict access controls, Supabase Row Level Security, and data-retention policies.
