# Database

This folder holds database-related notes and configuration.

## Current schema (Phase 2)

The `User` model was added in **Phase 2**:

- `backend/prisma/schema.prisma` — `User` model + `Role` enum.
- `backend/prisma/migrations/` — versioned migrations (apply with
  `npm run migrate --prefix backend`).
- `backend/prisma/seed.ts` — demo admin and customer seed data (run with
  `npm run prisma:seed --prefix backend`).

Product, cart, order, and wishlist models will be added in later phases.