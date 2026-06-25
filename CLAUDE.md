# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AroraOptical is a full-stack eyewear e-commerce platform with a React/Vite frontend and Node.js/Express backend, using MongoDB as the database.

## Commands

### Root-level (run from `d:\Work\AroraOptical`)
```bash
npm run build       # Install all deps + build frontend (client/dist/)
npm run dev         # Start backend with nodemon (port 3000)
npm run front       # Start frontend Vite dev server (port 5173)
```

### Frontend only (from `client/`)
```bash
npm run dev         # Vite HMR dev server
npm run build       # Production build
npm run lint        # ESLint
npm run preview     # Preview production build
```

No tests are configured — `npm test` returns an error.

## Architecture

### Monorepo Structure
```
AroraOptical/
├── api/            # Express backend
├── client/         # React/Vite frontend
└── package.json    # Root scripts only (no shared deps)
```

### Backend (`api/`)

MVC-style layout:
- `models/` — Mongoose schemas: User, Product, Order, Prescription, EyeTest
- `controllers/` — Business logic per domain
- `routes/` — Express routers, all mounted under `/api/`
- `middleware/` — `authMiddleware` (JWT from cookies), `verifyAdmin` (role check)
- `utils/` — Passport config (Google OAuth20), Shiprocket API wrapper, helpers

**API route structure:**
- `/api/auth` — Signup, login, Google OAuth callback, OTP, password reset
- `/api/user` — Profile, cart, wishlist, addresses, prescriptions
- `/api/product` — Catalog, search, filter
- `/api/admin` — Product/user/order management, attributes, policies
- `/api/order` — Order CRUD + Shiprocket shipping sync
- `/api/eye-test` — Booking with time-slot availability
- `/api/image` — Cloudinary signature generation + deletion
- `/api/policy` — Public-facing policy pages

**Auth flow:** JWT stored in HTTP-only cookies. `authMiddleware` verifies on protected routes. Google OAuth via Passport.js with `express-session`.

**Shiprocket integration** lives in `api/utils/` — handles serviceability checks, shipment creation, AWB generation, and order tracking. See `SHIPROCKET_SETUP.md` for endpoint details.

### Frontend (`client/src/`)

- `pages/` — Route-level components grouped by domain (Admin/, Product/, Auth/, Eye-Test/, etc.)
- `components/` — Shared UI components
- `redux/` — Redux Toolkit store with a single `authSlice`; persisted to localStorage via redux-persist
- `providers/` — `AuthProvider` (syncs auth on load), `RoutesProvider`
- `Routes/` — Route definitions with `ProtectedRoute` wrapper

**State management:** Only auth state is in Redux. All other UI state is local or server-fetched via Axios.

**Auth:** `ProtectedRoute` redirects unauthenticated users to login. Admin pages have an additional mobile-block (desktop-only enforcement).

**Navigation:** `PrimaryNavbar` and `SecondaryNavbar` are hidden on admin/auth routes. `Footer` is hidden on admin/auth/lens routes — controlled in `RoutesProvider`.

**API calls:** All Axios requests use `withCredentials: true`. Base URL is `VITE_BASE_URL` env var pointing to the backend.

### Key Integrations
- **Cloudinary** — Product image uploads; frontend gets a signed URL from `/api/image`, uploads directly to Cloudinary
- **Razorpay** — Payment gateway for online checkout
- **Shiprocket** — Logistics: serviceability, shipment creation, tracking
- **Google OAuth** — Passport.js strategy on backend, redirect-based flow
- **Nodemailer** — Transactional email (OTP, order confirmations)
- **Twilio** — SMS notifications
- **Firebase** — Initialized in frontend (exact usage TBD)

## Environment Variables

Backend (`api/.env`):
```
PORT=3000
MONGO=<mongodb-uri>
JWT_SECRET=
SESSION_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
FRONTEND_URL=http://localhost:5173
EMAIL_USER=
EMAIL_PASS=
SHIPROCKET_EMAIL=
SHIPROCKET_PASSWORD=
SHIPROCKET_PICKUP_LOCATION=Primary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Frontend (`client/.env`):
```
VITE_BASE_URL=http://localhost:3000
```

## Deployment

Both frontend and backend deploy to Vercel (`vercel.json` present). Database is MongoDB Atlas. CORS is configured for `aroraopticals.com` (production) and `localhost:5173` (dev).
