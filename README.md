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

**Phase 1 — Foundation.**

Planned roadmap:

| Phase | Scope |
| --- | --- |
| 1 | Foundation (current) |
| 2 | Authentication |
| 3 | Products |
| 4 | Cart |
| 5 | Wishlist |
| 6 | Addresses + Checkout + Orders |
| 7 | Admin |
| 8 | Polish + API Documentation + Seed Data |

## Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, TypeScript, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL, Prisma ORM |
| Validation | Zod (later phases) |
| Authentication | JWT (later phases) |
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
│   │   ├── controllers/  Request handlers
│   │   ├── middleware/   Express middleware (CORS, error handling, ...)
│   │   ├── routes/       API route definitions
│   │   ├── services/     Business logic layer
│   │   ├── utils/        Shared helpers (ApiError, asyncHandler, ...)
│   │   ├── app.ts        Express app assembly
│   │   └── server.ts     Server bootstrap
│   └── prisma/        Prisma schema (PostgreSQL)
├── database/          Database-related notes/config (schema designed in later phases)
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
FRONTEND_URL=
API_BASE_URL=
```

### 3. Start the backend

```bash
npm run dev --prefix backend
```

The API runs at http://localhost:4000 by default.

### 4. Start the frontend

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

## Development Rules

- No microservices, Docker orchestration, Kubernetes, Kafka, Redis, or GraphQL.
- No QA automation code in this repository.
- Backend enforces business rules; frontend stays a thin client.
- UI uses semantic HTML, proper labels, and meaningful button text.
