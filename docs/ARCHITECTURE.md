# FoodRush — System Architecture

## 1. High-level system

```
                ┌─────────────────────────────────────────────┐
                │              Client applications             │
                ├──────────────┬──────────────┬────────────────┤
   Customer ──▶ │ Customer App │ Customer Web │                │
   (mobile/web) │  (Flutter)   │  (Next.js)   │                │
                ├──────────────┼──────────────┤   Admin Portal │ ◀── Ops team
   Vendor    ──▶│  Restaurant Portal (Next.js)│   (Next.js)    │
   Rider     ──▶│  Rider App (Flutter)        │                │
                └──────────────┴──────────────┴────────────────┘
                                   │ HTTPS / WSS
                                   ▼
                ┌─────────────────────────────────────────────┐
                │            FoodRush Core API (NestJS)         │
                │  auth · users · restaurants · menus · orders  │
                │  (+ riders · payments · realtime — phased)    │
                └───────────────┬─────────────────┬─────────────┘
                                │                 │
                      ┌─────────▼──────┐   ┌──────▼───────┐
                      │ PostgreSQL +   │   │    Redis     │
                      │ PostGIS        │   │ cache/queues │
                      └────────────────┘   └──────────────┘
```

All clients talk to **one core API**. This keeps business rules (pricing,
order lifecycle, authorization) in a single place rather than duplicated per app.

## 2. Tech stack

| Concern | Choice | Why |
|---|---|---|
| API framework | NestJS | Modular, DI, first-class TypeScript, scales to large teams |
| ORM | Prisma | Type-safe queries, great migrations DX |
| Database | PostgreSQL + PostGIS | Relational integrity + geospatial queries |
| Cache / queues / realtime | Redis | Pub/sub for live tracking, BullMQ jobs later |
| Auth | JWT (access + rotating refresh) over OTP | Phone-first login, standard for this market |
| Mobile | Flutter | One codebase → iOS + Android |
| Web / portals | Next.js | SSR storefront SEO + great DX |

## 3. Roles & access model

Four roles drive everything: `CUSTOMER`, `RESTAURANT_OWNER`, `RIDER`, `ADMIN`.

- All routes are **protected by default** (`JwtAuthGuard` registered globally).
- Public routes opt out with `@Public()` (storefront browse, auth endpoints).
- `@Roles(...)` + `RolesGuard` restrict endpoints to specific roles.
- Resource-level checks (e.g. "is this *your* restaurant/order/address?") live in
  the services, not just the guard — defense in depth.

## 4. Authentication flow (OTP)

```
POST /api/auth/otp/request { phone }      → creates OtpChallenge, sends SMS
                                            (dev mode logs/returns the code)
POST /api/auth/otp/verify  { phone, code } → verifies, creates user if new,
                                            returns { accessToken, refreshToken }
POST /api/auth/refresh     { refreshToken } → rotates refresh token, new pair
POST /api/auth/logout                       → revokes all refresh tokens
```

- OTP codes are stored only as argon2 hashes, expire (default 5 min), and lock
  after 5 failed attempts.
- Refresh tokens are opaque, stored hashed, single-use (rotated on every refresh).

## 5. Order lifecycle (state machine)

Defined as a single source of truth in `orders/order-status.machine.ts`:

```
PENDING_PAYMENT ─▶ PLACED ─▶ ACCEPTED ─▶ PREPARING ─▶ READY_FOR_PICKUP
       │             │          │                          │
       ▼             ▼          ▼                          ├─▶ RIDER_ASSIGNED ─┐
   CANCELLED     REJECTED   CANCELLED                       └─▶ PICKED_UP ◀─────┘
                                                                  │
                                                                  ▼
                                                              ON_THE_WAY ─▶ DELIVERED
```

- Every transition is validated; illegal jumps are rejected with `400`.
- Each transition is **authorized by actor role** (a restaurant can `ACCEPT`,
  a rider can mark `PICKED_UP`, a customer can `CANCEL` early, admin can do all).
- Every transition writes an immutable `OrderEvent` → full audit timeline.
- `CASH_ON_DELIVERY` orders start at `PLACED`; card/wallet start at
  `PENDING_PAYMENT` until the payment step (Phase 5) confirms them.

## 6. Pricing integrity

Order totals are **always computed server-side** from live menu prices at
checkout — the client never sends prices. Each line = (item price + selected
modifier prices) × qty. We snapshot item name, unit price, and modifiers onto
the order so historical orders stay correct even if the menu later changes.

## 7. Data model (core entities)

`User · RefreshToken · OtpChallenge · Address · Restaurant · Cuisine ·
OpeningHour · MenuCategory · MenuItem · ModifierGroup · ModifierOption ·
Cart · CartItem · Order · OrderItem · OrderEvent · RiderProfile`

See `apps/backend/prisma/schema.prisma` for the full schema with indexes.

## 8. Roadmap

| Phase | Scope | Status |
|---|---|---|
| 1 | Monorepo, schema, auth, restaurants, menus, orders | ✅ delivered |
| 2 | Cart service, customer web (Next.js) + mobile (Flutter) | next |
| 3 | Restaurant portal, rider app + live GPS | planned |
| 4 | Admin portal (dispatch, onboarding, finance) | planned |
| 5 | WebSocket tracking, payments (JazzCash/Easypaisa/card), payouts, notifications | planned |

## 9. Conventions

- Money stored as `Decimal(10,2)`; computed with `Prisma.Decimal` (never floats).
- Geo stored as `Decimal(10,7)` lat/lng; PostGIS available for radius/zone queries.
- IDs are `cuid()`. Order numbers are short human-friendly codes (`FR-XXXXXX`).
- DTOs validate every input via `class-validator`; unknown fields are rejected.
