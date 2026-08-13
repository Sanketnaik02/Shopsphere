# ShopSphere — Phase 2 (Authentication)

## What was delivered

- Prisma `User` model (`id`, `name`, `email`, `passwordHash`, `role`, timestamps)
  with a `Role` enum (`CUSTOMER`, `ADMIN`), unique email, UUID ids.
- Password security with `bcryptjs` (10 salt rounds). Plain passwords are never
  stored; `passwordHash` is never returned by the API.
- JWT authentication using `jsonwebtoken`. Tokens contain only `userId` and
  `role`, are signed with `JWT_SECRET` from the environment, and expire after
  `JWT_EXPIRES_IN` (default `1d`).
- Authentication endpoints:
  - `POST /api/auth/register` — `201`, returns safe user + token.
  - `POST /api/auth/login` — `200`, returns safe user + token.
  - `GET /api/auth/me` — `200`, requires valid `Bearer` token.
  - `POST /api/auth/logout` — `200`, stateless (client discards token).
- Reusable middleware: `authenticate` (verifies JWT, loads user, attaches to
  `req.user`) and `requireRole` (role-aware authorization foundation).
- Zod request validation on the backend for both register and login.
- Consistent response envelope (`success`, `data` / `message` + `errorCode`).
- Meaningful HTTP status codes (201/200/401/403/409/400).
- Prisma seed with a demo admin and customer (hashed passwords).
- Frontend auth UI: `/login`, `/register`, protected `/dashboard`, lightweight
  `AuthProvider` context with token persistence in `localStorage`, route
  guarding via `ProtectedRoute`, and labeled/validated/loading form states.

## Demo credentials

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@shopsphere.local` | `Admin@12345` |
| Customer | `customer@shopsphere.local` | `Customer@12345` |

## Testability notes (for Postman / Rest Assured later)

- Register: valid, duplicate email (`409`), invalid email (`400`), missing
  name/email/password (`400`), short password (`400`).
- Login: valid (`200`), wrong password (`401`), unknown user (`401`), missing
  fields (`400`).
- `/api/auth/me`: valid token (`200`), no token (`401`), malformed token
  (`401`), expired token (`401`).
- Backend never exposes stack traces or raw database errors; non-`ApiError`
  failures return a generic `500` message.

## Explicitly NOT implemented (later phases)

- Products, cart, wishlist, checkout, orders, admin.
- Token blacklist / Redis (logout is client-side for stateless JWTs).
- Any QA automation tooling (Playwright, Rest Assured, Postman collections).