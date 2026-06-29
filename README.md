# FoodRush — Food Delivery Aggregator Platform

A FoodPanda-class, multi-app food delivery platform built to global production standards.

## System Overview

This is a **monorepo** containing every app and service in the platform, all sharing one core API.

| App / Service | Tech | Status |
|---|---|---|
| **Backend API** | NestJS + Prisma + PostgreSQL/PostGIS + Redis | 🟢 Phase 1 (in progress) |
| **Customer Web** | Next.js 16 (App Router, PWA) | ⚪ Phase 2 |
| **Customer Mobile** | Flutter | ⚪ Phase 2 |
| **Restaurant Portal** | Next.js | ⚪ Phase 3 |
| **Rider Mobile** | Flutter | ⚪ Phase 3 |
| **Admin Portal** | Next.js | ⚪ Phase 4 |

## Repository Layout

```
foodrush/
├── apps/
│   └── backend/            # NestJS core API (auth, restaurants, menus, orders, ...)
├── packages/               # Shared code (types, config) — added as web/mobile land
├── docker-compose.yml      # Postgres (PostGIS) + Redis for local dev
└── package.json            # npm workspaces root
```

## Quick Start (Backend)

### Prerequisites
- Node.js 20+ (you have 24 ✓)
- Docker Desktop (for Postgres + Redis) — https://www.docker.com/products/docker-desktop/

### Run

```bash
# 1. Start Postgres + Redis
docker compose up -d

# 2. Install dependencies
npm install

# 3. Configure environment
cp apps/backend/.env.example apps/backend/.env

# 4. Run database migrations + seed
npm run db:migrate --workspace=backend
npm run db:seed --workspace=backend

# 5. Start the API in watch mode
npm run dev --workspace=backend
```

API runs at `http://localhost:4000`, Swagger docs at `http://localhost:4000/docs`.

## Architecture

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full system design, data model, and order-state machine.

## Build Phases

1. **Foundation** — monorepo, DB schema, auth, restaurants, menus, orders *(current)*
2. **Customer experience** — customer app + web
3. **Supply side** — restaurant portal + rider app
4. **Operations** — admin portal
5. **Real-time & money** — live tracking, payments, payouts, notifications
