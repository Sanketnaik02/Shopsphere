# ShopSphere

E-Commerce System Under Test.

## Project

ShopSphere is a realistic e-commerce web application developed as a **System
Under Test (SUT)** for a QA automation portfolio.

The application itself lives in this repository. The **QA automation work**
(manual testing, Postman collections, Rest Assured API tests, Playwright UI
tests, CI/CD pipelines) is maintained **separately** and is not part of this
repository.

## Purpose

- Provides a stable, realistic target application for QA testing.
- Uses a mainstream, real-world technology stack.
- Follows predictable, testable conventions (semantic HTML, REST APIs with
  stable JSON responses, business logic enforced on the backend).

## Current Phase

**Phase 2 — Authentication.**

Completed road map:

| Phase | Scope |
| --- | --- |
| 1 | Foundation |
| 2 | Authentication (current) |
| 3 | Products |
| 4 | Cart |
| 5 | Wishlist |
| 6 | Addresses + Checkout + Orders |
| 7 | Admin |
| 8 | Polish + API Documentation + Seed Data |

## Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, TypeScript, Tailwind CSS, React Router |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL, Prisma ORM |
| Validation | Zod |
| Authentication | JSON Web Tokens (JWT), bcryptjs |
| API | REST / JSON |
| API docs | Swagger / OpenAPI (later phases) |

## Project Structure

```
shopsphere/
│
├── frontend/          React + Vite + TypeScript + Tailwind CSS application
├── backend/           Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── config/    Environment configuration
│   │   ├── controllers/  Request handlers (auth, health)
│   │   ├── middleware/   Express middleware (validation, auth, error handling)
│   │   ├── routes/       API route definitions
│   │   ├── services/     Business logic layer (auth, health)
│   │   ├── lib/          Shared infrastructure (Prisma client)
│   │   ├── types/        Shared types (auth user, JWT payload, Express types)
│   │   ├── validators/   Zod request schemas
│   │   ├── utils/        Shared helpers (ApiError, asyncHandler, JWT, password)
│   │   ├── app.ts        Express app assembly
│   │   └── server.ts     Server bootstrap
│   └── prisma/        Prisma schema + migrations + seed
├── database/          Database-related notes/config
├── docs/              Phase notes and decisions
├── .env.example       Environment variable template
└── package.json       Root scripts (dev/build)
```

## Prerequisites

- Node.js 18+ (tested with Node 24)
- npm 10+
- PostgreSQL (needed once the database schema is introduced in a later phase)

## Local Setup

### 1. Install dependencies

```bash
npm run install:all
```

This installs root, `backend`, and `frontend` dependencies.

### 2. Configure environment variables

```bash
cp .env.example .env
```

Create the backend environment file:

```bash
cp .env.example backend/.env
```

The backend reads `.env` from its own directory at startup. Never commit real
secrets. Required placeholders are in `.env.example`:

```
DATABASE_URL=
PORT=
JWT_SECRET=
JWT_EXPIRES_IN=
FRONTEND_URL=
API_BASE_URL=
```

### 3. Prepare the database

Apply migrations and seed demo users:

```bash
npm run migrate --prefix backend
npm run prisma:seed --prefix backend
```

`npm run migrate --prefix backend` is `prisma migrate dev` (creates and applies
migrations). The seed inserts the demo admin and customer users (see
[Demo credentials](#demo-credentials)).

### 4. Start the backend

```bash
npm run dev --prefix backend
```

The API runs at http://localhost:4000 by default.

### 5. Start the frontend

```bash
npm run dev --prefix frontend
```

The app runs at http://localhost:5173 by default.

### Run both together

From the repository root:

```bash
npm run dev
```

### Build (production bundles)

```bash
npm run build
```

## Health API

```
GET /api/health
```

Expected response — HTTP 200:

```json
{
  "success": true,
  "message": "ShopSphere API is running"
}
```

This endpoint is used as a stable baseline for later API testing.

## Auth API

All responses use a consistent envelope:

```json
{
  "success": true,
  "data": { ... }
}
```

Errors:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Password must be at least 8 characters",
  "errorCode": "VALIDATION_ERROR"
}
```

### Register

```
POST /api/auth/register
```

Body:

```json
{
  "name": "Sanket",
  "email": "sanket@example.com",
  "password": "Password@123"
}
```

- Valid — `201 Created`, returns `{ user, token }`.
- Duplicate email — `409 Conflict` (`EMAIL_TAKEN`).
- Validation failure — `400 Bad Request` (`VALIDATION_ERROR`).

### Login

```
POST /api/auth/login
```

Body:

```json
{
  "email": "sanket@example.com",
  "password": "Password@123"
}
```

- Valid — `200 OK`, returns `{ user, token }`.
- Bad credentials — `401 Unauthorized` (`INVALID_CREDENTIALS`).

### Current user

```
GET /api/auth/me
Authorization: Bearer <token>
```

- Valid token — `200 OK`, returns `{ user }`.
- Missing/invalid/expired token — `401 Unauthorized`.

### Logout

```
POST /api/auth/logout
```

JWTs are stateless; logout is handled client-side by discarding the token. The
endpoint returns `200 OK` for API consistency.

Role protection is available via `requireRole('ADMIN' | 'CUSTOMER')` middleware —
used by admin features in later phases.

## Demo credentials

Local development only (seeded into the database, password hashes stored):

| Role | Name | Email | Password |
| --- | --- | --- | --- |
| Admin | ShopSphere Admin | `admin@shopsphere.local` | `Admin@12345` |
| Customer | Demo Customer | `customer@shopsphere.local` | `Customer@12345` |

## Development Rules

- No microservices, Docker orchestration, Kubernetes, Kafka, Redis, or GraphQL.
- No QA automation code in this repository.
- Backend enforces business rules; frontend stays a thin client.
- UI uses semantic HTML, proper labels, and meaningful button text.
