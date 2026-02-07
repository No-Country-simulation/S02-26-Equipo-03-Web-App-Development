# Architecture

## Project Context

Producto objetivo: SaaS all-in-one para incorporación, impuestos y bookkeeping en USA.

Objetivo técnico del MVP: permitir que e-commerce integren nuestra API/pixel para medir conversiones reales de pagos Stripe y optimizar campañas en Google/Meta desde un backoffice.

## Scope (MVP con esteroides)

- Login y registro de cuentas cliente (e-commerce).
- Integración desde frontend del e-commerce a nuestra API.
- Definición y gestión de campañas (incluye versionado v1, v2, etc.).
- Uno o múltiples pixeles por campaña.
- Flujo de checkout/pago con Stripe y confirmación de estado.
- Métricas por campaña, producto y precio, con filtros por fecha y comparación de periodos.
- Notificaciones por correo para campañas con bajo rendimiento.
- Asistente virtual IA para soporte y análisis sobre datos del sistema.

## High-Level Diagram

```mermaid
flowchart LR
  EC[E-commerce Frontend]
  BO[Backoffice UI<br/>Next.js]
  API[Integration API<br/>Next.js]
  DB[(Turso SQLite)]
  S[Stripe]
  P[Meta Pixel / Google Analytics]
  W[Webhook Endpoint]
  E[Email Provider]
  AI[AI Assistant Service]

  EC -->|Track + purchase events| API
  EC -->|Client-side events| P

  BO -->|Manage campaigns| API
  BO -->|Read dashboards| API

  API -->|Store campaigns, sales, metrics| DB
  DB -->|Data| API

  API -->|Create checkout/subscription| S
  S -->|Webhook payment event| W
  W -->|Validate and process| API

  API -->|Send conversion events| P
  API -->|Send alerts| E

  BO -->|Ask for insights| API
  API -->|Context for assistant| AI
  AI -->|Recommendations| API
  API -->|Response| BO
```

## Diagram 1: E-commerce Integration Flow

```mermaid
flowchart LR
  EC[E-commerce Frontend] -->|API key + event payload| API[Integration API]
  API -->|Validate schema and auth| API
  API -->|Persist event| DB[(Turso)]
  API -->|ACK/Result| EC
```

## Diagram 2: Campaign Management Backoffice

```mermaid
flowchart LR
  U[Marketing User] --> BO[Backoffice UI]
  BO -->|Create/Edit campaign| API[Campaign API]
  API -->|Save config, pixel mapping, version| DB[(Turso)]
  DB -->|Campaign state| API
  API -->|Updated view| BO
```

## Diagram 3: Pixel and Conversion Attribution

```mermaid
flowchart LR
  EC[E-commerce Frontend] -->|Client events| P[Meta Pixel / Google Analytics]
  EC -->|Checkout start| API[Integration API]
  API -->|Create checkout session| S[Stripe]
  S -->|Payment webhook| W[Webhook Endpoint]
  W -->|Verified payment| API
  API -->|Server-side conversion event| P
```

## Diagram 4: Stripe Payment and Status Confirmation

```mermaid
flowchart LR
  EC[E-commerce Frontend] -->|Pay in hosted checkout| S[Stripe]
  S -->|payment_intent / invoice / subscription events| W[Webhook Endpoint]
  W -->|Verify signature| API[Payment Processor]
  API -->|Update order and subscription status| DB[(Turso)]
  API -->|Status API response| BO[Backoffice UI]
```

## Diagram 5: Metrics, Filters and Period Comparison

```mermaid
flowchart LR
  U[Marketing User] --> BO[Backoffice UI]
  BO -->|Select date range and comparison period| API[Metrics API]
  API -->|Aggregate by campaign/product/price| DB[(Turso)]
  DB -->|Aggregated metrics| API
  API -->|Dashboard cards and charts| BO
```

## Diagram 6: Alerts for Low-Performance Campaigns

```mermaid
flowchart LR
  CRON[Scheduled Job] --> API[Monitoring Service]
  API -->|Evaluate campaign KPIs| DB[(Turso)]
  API -->|Threshold breached| E[Email Provider]
  E -->|Emergency alert| U[Marketing User]
```

## Diagram 7: AI Virtual Assistant

```mermaid
flowchart LR
  U[Marketing User] --> BO[Backoffice UI Chat]
  BO -->|Question + tenant context| API[Assistant API]
  API -->|Retrieve metrics and campaign context| DB[(Turso)]
  API -->|Prompt with business context| AI[LLM Provider]
  AI -->|Answer + recommendation| API
  API -->|Response in chat| BO
```

## Diagram 8: Usage and Cost Tracking

```mermaid
flowchart LR
  API[Platform Services] -->|Integration API usage logs| DB[(Turso)]
  AI[LLM Provider] -->|Token usage metadata| API
  API -->|Cost estimation records| DB
  BO[Backoffice UI] -->|View usage and cost dashboards| API
```
