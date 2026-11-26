# AI Restaurant Operating System — Engineering Case Study

## Problem and intended user journey

Restaurant orders, customer messages, kitchen preparation, waiter service and billing often happen in separate systems. This project demonstrates an integrated WhatsApp and web-dashboard journey.

## Implemented public components

| Stage | Public artifact | What can be inspected |
| --- | --- | --- |
| Guest browsing | [Interactive menu](../images/interactive-menu.png) | Ordering interface |
| Message handling | [Main n8n workflow](../images/main-n8n-workflow.png) | Session and intent routing |
| Kitchen handoff | [Kitchen dashboard](../images/kitchen-dashboard.png) | Preparation states |
| Staff service | [Waiter dashboard](../images/waiter-dashboard.png) | Service and closure controls |
| Operations insights | [Reports dashboard](../images/reports-dashboard.png) | Reporting interface |
| Post-payment lifecycle | [Close-session workflow](../images/close-session-workflow.png) | Session reset |

The two sanitized workflow exports contain **84 and 3 nodes**, respectively (counted from the committed JSON exports on 26 Nov 2026); a node count is **not** a measure of throughput or production availability.

## Engineering decisions

- Separate session states from free-form AI-generated responses.
- Route structured orders into an authoritative data store before staff execution.
- Use dashboards for kitchen and waiter responsibilities.
- Keep customer handoff and post-payment session closure explicit.
- Maintain a sanitized public implementation without real credentials or customer data.

## Demonstration and evidence boundary

The screenshots and public exports demonstrate implementation choices. This repository does **not** publish independently audited sales, wait-time reductions, customer-volume figures or production SLAs. The portfolio implementation must not be deployed unchanged in a live restaurant.

## Security and deployment boundary

Before deployment, review authentication, authorization, Supabase RLS, payment-state integrity, webhook validation, secret management, rate limiting and observability. See [Security](SECURITY.md) and [Setup](SETUP.md).

## Public assets

[Walkthrough](../assets/visual-tour.webp) · [System architecture](../images/system-architecture.svg) · [Workflows directory](../workflows/) · [Source web app](../web-app/)
