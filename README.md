# ShopTal — Fullstack E‑commerce (Client + Server)

A university/academic project containing a full e‑commerce stack:
- ShopTal-client — Next.js (TypeScript) frontend (App Router, Tailwind, shadcn/radix UI, Zustand, NextAuth, Stripe).
- ShopTal-server — Express + TypeScript backend using Prisma for DB access, JWT auth, and modular routes (auth, users, products, orders, payments, analytics, etc).

This root README provides a high‑level overview, quickstart, architecture notes, and pointers to per‑app documentation.

---

## Repository layout

- ShopTal-client/ — Next.js client (TypeScript, App Router)
- ShopTal-server/ — Express backend (TypeScript, Prisma)
- (Other files and infra/config in repo root)

See the client README: ShopTal-client/README.md  
See the server README (ERD): ShopTal-server/README.md

---

## Project overview

ShopTal is a modern, accessible e‑commerce platform with:
- Product catalog, categories & subcategories
- Search, filters, pagination
- Cart & checkout flow with Stripe integration
- Authentication (NextAuth on client, JWT on server)
- Admin dashboard (products, orders, users, analytics)
- REST API with modular route structure and common helpers (pagination, JWT helpers)
- Prisma as ORM for database access

The client focuses on performance and accessibility (AR/ARIA roles, keyboard navigation, lazy loading). The server splits features into modules (auth, user, product, analytics, payment, etc).

---

## Tech stack (high level)

Client
- Next.js (App Router) — TypeScript
- React
- Tailwind CSS, shadcn UI + Radix
- Zustand (state)
- NextAuth (auth)
- Stripe (payments)
- Recharts, Embla, React Hook Form, Zod, Jest + RTL

Server
- Node.js + Express — TypeScript
- Prisma ORM
- JWT for auth, bcrypt for password hashing
- Modular route controllers (src/app/modules/**)
- Helpers: pagination, JWT helpers, ApiError class, etc

Repository language composition: predominantly TypeScript.

---

## Quickstart (development)

Prerequisites:
- Node.js (v18+ recommended)
- pnpm (or npm/yarn; the repo README uses pnpm)
- PostgreSQL (or the DB configured in Prisma DATABASE_URL)
- (Optional) Stripe test keys for checkout flows

1. Clone repository
   ```bash
   git clone https://github.com/sujoy-karmokar/shoptal.git
   cd shoptal
   ```

2. Client: install & run
   ```bash
   cd ShopTal-client
   pnpm install
   pnpm dev
   # open http://localhost:3000
   ```

3. Server: install & run
   ```bash
   cd ../ShopTal-server
   pnpm install
   # ensure .env with DATABASE_URL and other vars (see env list below)
   pnpm dev
   # default server port typically 5000 or as defined in config
   ```

Notes:
- The client expects an API base URL in NEXT_PUBLIC_API_URL (pointing to the running server).
- If using Prisma migrations:
  ```bash
  npx prisma migrate dev --name init
  npx prisma generate
  ```

---

## Important environment variables (examples)

Client (ShopTal-client/.env.local)
- NEXT_PUBLIC_API_URL=http://localhost:5000
- NEXTAUTH_URL=http://localhost:3000
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

Server (ShopTal-server/.env)
- DATABASE_URL="postgresql://user:pass@host:port/dbname?schema=public"
- JWT_SECRET=your_jwt_secret
- BCRYPT_SALT_ROUNDS=10
- STRIPE_SECRET_KEY=sk_test_xxx
- STRIPE_WEBHOOK_SECRET=whsec_xxx
- NODE_ENV=development
- PORT=5000

Adjust names/casing to match project config (the server code references config and env vars such as bcrypt_salt_rounds and uses process.env access — confirm exact key names when creating .env).

---

## How the pieces connect

- Frontend (Next.js) calls the REST endpoints exposed by ShopTal-server for listing products, authentication, orders, payments, analytics, etc.
- Authentication:
  - Client: NextAuth is used for session management.
  - Server: JWT-based auth middleware protects API routes; roles (USER, ADMIN) are enforced in many routes.
- Payments are implemented using Stripe — server exposes a create-payment-intent endpoint and webhook handling (check server routes for payment module).
- Database: Prisma models drive the DB schema (look for prisma/schema.prisma in the server).

---

## Development tips & important files

- ShopTal-client/src/app/ — Next.js pages and layout (root layout fetches categories)
- ShopTal-client/src/components/ — modular UI components (dashboard, homepage, search)
- ShopTal-client/src/lib/api.ts — functions for calling backend APIs (look for NEXT_PUBLIC_API_URL usage)
- ShopTal-server/src/app/modules/ — route modules (auth, user, product, order, payment, analytics, etc)
- ShopTal-server/src/helpers/ — helpers (paginationHelper, jwtHelpers, etc)
- ShopTal-server/src/app/routes/index.ts — central route registration
- ShopTal-server/src/shared/prisma.ts — Prisma client instance
- ShopTal-server/README.md — contains ERD diagram link (useful for DB understanding)

---

## Testing & linting

- Client includes scripts for testing and linting. See ShopTal-client/README.md for specifics (Jest, React Testing Library).
- Server may include unit/integration tests depending on project; run server test scripts if present.

---

## Deployment

- Client: Build with `pnpm build` and deploy to Vercel/Netlify. Ensure NEXT_PUBLIC_API_URL points to deployed backend.
- Server: Deploy to a Node host (Heroku, DigitalOcean, Render) or containerize. Run Prisma migrations against your production DB and set env vars accordingly.
- Stripe: configure webhook endpoint and secret for production.

---

## ERD / Data model

An ERD image is present in the server README:
https://i.ibb.co/km87qXW/Shop-Tal-Diagram-drawio.png

---

## Where to read more

- Client README: ShopTal-client/README.md — detailed client README with tech stack, scripts, and project structure.
- Server README: ShopTal-server/README.md — ERD and server notes.

---

## Contribution, license & credits

- Built / maintained by sujoy karmokar
- This repository is currently intended for portfolio/academic/demo use. See license and use disclaimers in subproject READMEs.

---

## Next steps

If you want, I can also add a `.env.example` for both client and server, create a contributor guide, or open a PR with deployment instructions.