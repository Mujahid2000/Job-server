# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Job portal backend API built with Express.js 5 and TypeScript. Three user roles: Applicant, Company, Admin. Dual database: MongoDB (primary, via Mongoose) and PostgreSQL (analytics/supplementary, via pg pool). Real-time features via Socket.IO.

## Commands

```bash
npm run dev      # Development with hot-reload (ts-node-dev)
npm run build    # Compile TypeScript to dist/
npm start        # Run compiled JS from dist/
```

No test framework is configured.

## Architecture

**Layered MVC**: Routes -> Controllers -> Services -> Models

- **Routes** (`src/routes/`) — Express routers, Swagger annotations live here
- **Controllers** (`src/controller/`) — Request handling, delegates to services
- **Services** (`src/services/`) — Business logic
- **Models** (`src/models/`) — Mongoose schemas (33+ models). The User model (`UserModels.ts`) handles password hashing and JWT token generation methods

**Entry point**: `src/index.ts` — Sets up Express, Socket.IO, CORS, Swagger, mounts all routes, connects both databases, handles graceful shutdown.

**Config**: `src/config/config.ts` — All env vars validated with Zod schema. App exits immediately on invalid config.

### Key Route Mounting

| Path | Route File | Purpose |
|------|-----------|---------|
| `/user` | UserRoute | Auth, registration, profile |
| `/applicantData` | ApplicantRoute | Applicant CRUD |
| `/companyData` | AccountSetupRoute | Company setup |
| `/getCompanyData` | CompanyRoute | Company info retrieval |
| `/jobs` | JobApplicationRoute | Job postings |
| `/appliedJobs` | AppliedJobsRoute | Application tracking |
| `/shortList` | ShortListedRoute | Candidate shortlisting |
| `/candidateJobApplyData` | CandidateRoute | Candidate application data |
| `/api/paypal` | PaypalRoutes | Payment processing |
| `/data/payments` | SubscriptionData | Subscriptions |
| `/tags` | TagsRoute | Job categorization |
| `/liveNotification` | LiveNotification | Real-time notifications |
| `/notification` | NotificationData | Notification management |
| `/jwt` | JWTTokenMiddleware | Token generation/refresh |

### Authentication

JWT-based with access + refresh token rotation. Middleware chain:
1. `JWTTokenMiddleware` (`/jwt` route) — Token creation and refresh endpoints
2. `VerificationMiddleware` — Verifies access tokens on protected routes
3. `roleMiddleware` (`allowRoles`) — Role-based access; also shorthand files `allowAdmin.ts`, `allowApplicant.ts`, `allowCompany.ts`
4. Token payload supports `{ id, email, role }` and `{ data: { ...user } }` formats

### Utilities

- `ApiError` — Structured error class with statusCode, errors array
- `ApiResponse` — Standardized success response wrapper
- `asyncHandler` — Catches async errors and forwards to error middleware
- `FileUploader` — Cloudinary integration via multer
- `EmailService` — Nodemailer for transactional emails
- `logger` — Winston logger

### External Services

- **Cloudinary** — File/image uploads
- **PayPal** — Payments and subscriptions (sandbox credentials)
- **Nodemailer** — Email via Gmail SMTP
- **Socket.IO** — Real-time notifications (users join rooms by userId)

## Environment Variables

Required (validated at startup by Zod):
`MONGO_URI`, `POSTGRES_URL`, `SECRET_TOKEN`, `REFRESH_TOKEN_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`

Optional with defaults: `PORT` (5000), `NODE_ENV` (development), `ACCESS_TOKEN_EXPIRY` (1d), `REFRESH_TOKEN_EXPIRY` (10d), `FRONTEND_URL`, `EMAIL_*`

## Conventions

- Controllers wrap service calls in `asyncHandler` for error propagation
- Errors thrown as `ApiError` instances, caught by `errorMiddleware` at the end of the middleware stack
- Role checks use `allowRoles(['Company'])` or the shorthand middleware files
- Socket.IO instance attached to `req.io` via middleware for use in controllers/services
- Swagger annotations are inline in route files, auto-scanned from `./src/routes/*.ts`
- API docs served at `/api-docs`

## Frontend

Frontend is a separate deployment at `https://my-job-brown.vercel.app`. CORS is configured for this origin plus `localhost:3000` in development.
