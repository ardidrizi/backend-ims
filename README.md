# Inventory Management Backend

## Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Install & run](#install--run)
  - [Environment Variables](#environment-variables)
  - [Database & Seeding](#database--seeding)
- [API Reference](#api-reference)
  - [Authentication & Users](#authentication--users)
  - [Products](#products)
  - [Categories](#categories)
  - [Suppliers](#suppliers)
  - [Stock Movements](#stock-movements)
  - [Admin Guard Example](#admin-guard-example)
- [Testing](#testing)
- [Scripts](#scripts)
- [Notes](#notes)

## Overview
This repository contains a TypeScript-based Express backend for tracking products, categories, suppliers, and stock moves. It exposes a RESTful API backed by Prisma and PostgreSQL while handling authentication with JWTs and password hashing with bcrypt. The goal is to provide a clean canvas for an inventory workflow with CRUD operations, auditing via stock movements, and admin-only checks.

## Tech Stack
- Node.js + TypeScript (targeted at ES6)
- Express + middleware (`cors`, `body-parser`, `morgan`)
- Prisma ORM with `@prisma/client` against PostgreSQL
- Authentication helpers via `bcrypt` and `jsonwebtoken`
- Environment management with `dotenv`
- Testing via Jest and Supertest
- Utilities that can be leveraged for future Supabase integration (`@supabase/supabase-js`)

## Architecture
- `src/app.ts` boots the Express app, wires in CORS/morgan/body parsing, and mounts routers under the `/api` prefix.
- Routers live in `src/routes/*.ts`, each delegating to the controllers in `src/controllers/`.
- `src/middlewares/checkAdmin.ts` provides a reusable guard that verifies a JWT carries the `isAdmin` flag before letting a request proceed.
- Data models are declared in `prisma/schema.prisma`, and Prisma Client is instantiated in each controller module.
- `src/db/seed.ts` seeds the categories, supplier, and sample products so the API can be exercised immediately.

## Getting Started

### Prerequisites
- Node.js 18+ (the project targets modern ES modules).
- PostgreSQL reachable via a `DATABASE_URL`.
- `npx prisma` for syncing the schema when the database is fresh (`npx prisma db push` is sufficient if migrations are not used yet).

### Install & run
```bash
git clone <repo>
cd backend-INVENTORY-MANAGMENT
npm install
# configure the .env file (see below)
npm run seed         # optional but recommended to insert sample data
npm run dev          # starts nodemon against src/app.ts
```

Once the app compiles, you can also run:
```bash
npm run build
npm run start        # runs node dist/server.js per package.json
```

### Environment Variables
Copy `.env.example` (if supplied) or create a `.env` file with:

| Key | Description |
| --- | ----------- |
| `DATABASE_URL` | PostgreSQL connection URL used by Prisma Client |
| `TOKEN_SECRET` | HMAC secret for signing JWTs (required for `login`, `signup`, and `checkAdmin`) |
| `PORT` | Optional; defaults to `5000` and controls `app.ts`’s listener |

### Database & Seeding
- The Prisma schema defines `User`, `Product`, `Category`, `Supplier`, and `StockMovement`, with explicit relations (Product → Category/Supplier, StockMovement → Product) and a `Role` enum for future role checks.
- `src/db/seed.ts` ensures Category I/II and a supplier with `id=1` exist, then inserts fruits/produce items with `quantity: 100`, linking to the default supplier and categories. Run `npm run seed` after `DATABASE_URL` is ready.

## API Reference
Routes are all mounted under `/api`.

### Authentication & Users
- `POST /api/signup` — `{ email, password, name, isAdmin? }`. Validates format, hashes the password, defaults `isAdmin` to `false`, and saves the user.
- `POST /api/login` — `{ email, password }`. Verifies credentials, signs a JWT (HS256, 6h) including `isAdmin`, `email`, `id`, and optional `name`, and returns `{ authToken }`.
- `GET /api/users`, `GET /api/users/:id`, `PUT /api/users/:id`, `DELETE /api/users/:id` — basic CRUD for users via Prisma.

### Products
- `POST /api/products` — requires `name`, `price`, and `supplierId` (the controller currently hard-codes `categoryId: 1`, `expiration: new Date()`, `sku: "default-sku"`, `quantity: 0`). Validates positive price.
- `GET /api/products` — supports `?page=1&pageSize=10` to paginate results.
- `GET /api/products/:id`, `PUT /api/products/:id`, `DELETE /api/products/:id` — fetch, update (name/price/supplierId), and delete a product. `PUT` also checks for valid price and presence of required fields.

### Categories
- `GET /api/categories`, `GET /api/categories/:id`, `POST /api/categories`, `PUT /api/categories/:id`, `DELETE /api/categories/:id` — straightforward CRUD for category names.

### Suppliers
- `GET /api/suppliers`, `GET /api/suppliers/:id`, `POST /api/suppliers`, `PUT /api/suppliers/:id`, `DELETE /api/suppliers/:id`.
- Creating a supplier accepts `{ name, contactInfo, email, phone, address, products }` and connects listed `productId`s to the supplier via Prisma’s nested `connect`.

### Stock Movements
- `GET /api/stock-movements` — returns entries whose `productId` still points to an existing product.
- `POST /api/stock-movements` — payload `{ productId, quantityChanged, type }`; records inventory activity.
- `GET /api/stock-movements/:id`, `PUT /api/stock-movements/:id`, `DELETE /api/stock-movements/:id` — standard CRUD (delete returns HTTP 204 when successful).

### Admin Guard Example
- `src/middlewares/checkAdmin.ts` reads the `Authorization: Bearer <token>` header, verifies the token with `TOKEN_SECRET`, and ensures the decoded payload has `isAdmin: true`.
- `src/routes.ts` demonstrates hooking that guard and the `adminProtectedRoute` handler (returns `"Welcome, Admin!"`). You can wrap any `/api` route with the middleware for admin-only access.

## Testing
- `npm run test` uses Jest + Supertest.
- Key specs: `tests/stockMovementController.test.ts` mocks Prisma and checks all CRUD flows plus error handling; `tests/productController.test.ts` spins up the Express app, creates temporary products via Prisma, and hits each `/products` endpoint; `tests/inventory.test.js` demonstrates how an aggregation endpoint could be exercised through the Express app.

## Scripts
- `npm run dev` — `nodemon` watches `src/app.ts` for rapid iteration.
- `npm run seed` — runs `ts-node src/db/seed.ts` to insert default categories, supplier, and products.
- `npm run build` — compiles TypeScript to `dist/`.
- `npm run start` — executes `node dist/server.js` (ensure `npm run build` has been run and adjusts entrypoint if needed).
- `npm run test` — runs Jest suites.

## Notes
- Logging: requests pass through `morgan("dev")`, so console output includes HTTP details.
- All JSON parsing happens via `body-parser` so POST/PUT bodies should be sent with `Content-Type: application/json`.
- The default product creation path hard-codes `categoryId`/`sku`/`expiration`; adjust `src/controllers/productController.ts` if you need dynamic values.
- Remember to keep `TOKEN_SECRET` and `DATABASE_URL` private in production and rotate JWT secrets periodically.
