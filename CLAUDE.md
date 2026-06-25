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
- `/api/order` — Order CRUD + payment endpoints (see Payment section below)
- `/api/eye-test` — Booking with time-slot availability
- `/api/image` — Cloudinary signature generation + deletion
- `/api/policy` — Public-facing policy pages

**Auth flow:** JWT stored in HTTP-only cookies. `authMiddleware` verifies on protected routes. Google OAuth via Passport.js with `express-session`.

**Shiprocket integration** lives in `api/utils/` — handles serviceability checks, shipment creation, AWB generation, and order tracking. See `SHIPROCKET_SETUP.md` for endpoint details. Full API integration is a future phase; `createCODOrder` and `createPhonepeOrder` each contain a `// TODO: Integrate Shiprocket API in the next phase` placeholder.

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

### Payment & Order Flow

**Active payment gateway: PhonePe** (`pg-sdk-node`). Razorpay is installed but not used.

**Order endpoints (`api/routes/order.route.js`):**
| Route | Purpose |
|---|---|
| `POST /api/order/create-phonepe` | Online payment via PhonePe — creates Pending order, returns `checkoutPageUrl` |
| `GET  /api/order/status` | PhonePe redirect callback — confirms/fails order, clears cart, triggers Shiprocket, redirects to `/thank-you` or `/failed` |
| `POST /api/order/create-cod` | Cash on Delivery — creates Confirmed order, triggers Shiprocket immediately |
| `POST /api/order/create-mock` | **Dev/staging only** — simulates instant payment success (no Shiprocket); returns 404 in `NODE_ENV=production` |

**Amount handling (critical):** All monetary values are stored in the DB in **rupees**. PhonePe SDK expects **paise**, so `createPhonepeOrder` receives paise from the frontend (`totalAmount * 100`) and converts to rupees before saving (`/ 100`). Never store paise in the Order document.

**Shiprocket trigger:** `triggerShiprocketForOrder(order)` in `order.controller.js` — fires non-blocking (no `await` at call site) after a confirmed PhonePe payment or COD order placement. It populates product details, maps to the Shiprocket payload, and saves `shiprocket.orderId` / `shiprocket.shipmentId` / `shiprocket.status` back to the Order document on success. Errors are logged but never surface to the user.

**Shiprocket address field mapping:** `shiprocket.js` `createShipment()` expects `orderData.shippingAddress` to use the Order model's field names: `fullName`, `flat`, `area`, `pincode`, `mobileNumber` (not `name`, `address`, `zipcode`, `phone`). The Shiprocket token is cached for 23 hours (Shiprocket JWTs last 24 h; the API does not return `expires_in`).

**User order history:** Stored in two places — the `Order` collection (full document) and `User.orders[]` (snapshot of cart items at time of order + reference to Order `_id`). `getOrders` in `user.controller.js` populates both. The Settings/Orders page calls `/api/user/orders/:userId`.

**Post-payment frontend pages:**
- `client/src/pages/Product/ThankYou.jsx` — shown on success, auto-redirects to `/` after 10 s
- `client/src/pages/Product/PaymentFailed.jsx` — shown on failure, auto-redirects to `/checkout` after 10 s with a countdown

### Local Payment Testing

On `localhost`, `Step2.jsx` detects the hostname and automatically routes online payment methods (UPI/Card/Net Banking) to `POST /api/order/create-mock` instead of PhonePe. The button label changes to "Simulate Payment (Dev)". COD works identically on localhost and production.

Set `NODE_ENV=development` in `api/.env` for local dev — the mock endpoint is blocked in production.

### Order Model — key fields

- `finalAmount` / `totalPrice` — always stored in **rupees**
- `paymentDetails.method` — `'COD' | 'PhonePe' | 'Online'`
- `paymentDetails.status` — `'Pending' | 'Completed' | 'Failed'`
- `status` — `'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned' | 'Failed'`
- `shiprocket` — subdocument (`orderId`, `shipmentId`, `awbCode`, `courierName`, `trackingUrl`, …); populated only after Shiprocket integration

### Admin Panel

- Desktop-only — renders a "Desktop Access Required" message on viewports < 768 px
- Order management at `/admin/order-management` — uses `selectedOrder.shippingAddress.fullName / flat / area / city / state / pincode / mobileNumber` (not `name/address/zipcode/phone`)
- Orders table shows two distinct status columns: **Order Status** (Pending/Confirmed/Shipped/…) and **Payment** (status badge + method label). Both use separate colour helpers: `getStatusColor()` and `getPaymentStatusColor()`.
- COD orders: Order Status = `Confirmed`, Payment Status = `Pending` (cash collected on delivery). PhonePe orders: both become `Confirmed`/`Completed` only after the gateway callback succeeds.
- Row actions (eye + trash icons) appear on hover. Clicking the eye icon opens a right-side drawer panel; clicking trash opens a confirm dialog.
- The drawer has a **Shipping & Tracking** section. If `order.shiprocket.shipmentId` exists it shows Shipment ID, AWB, Courier, and an external tracker link. A **Refresh** button fetches live events from `GET /api/order/:orderId/track` and renders a vertical timeline of up to 8 activities.
- Admin can **delete** an order via `DELETE /api/order/admin/:orderId`; this removes the order document and clears the reference from `User.orders[]`.
- The **Order List** sidebar entry has been removed — the sidebar's Order section now has only **Order Management**.

### Key Integrations
- **Cloudinary** — Product image uploads; frontend gets a signed URL from `/api/image`, uploads directly to Cloudinary
- **PhonePe** — `pg-sdk-node`; env `PHONEPE_ENV=PRODUCTION|SANDBOX` switches between live and test credentials
- **Shiprocket** — Logistics: serviceability, shipment creation, tracking (full order-creation integration is a future phase)
- **Google OAuth** — Passport.js strategy on backend, redirect-based flow
- **Nodemailer** — Transactional email (OTP, order confirmations)
- **Twilio** — SMS notifications
- **Firebase** — Initialized in frontend (exact usage TBD)

## Environment Variables

Backend (`api/.env`):
```
PORT=3000
NODE_ENV=development
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
PHONEPE_CLIENT_ID=
PHONEPE_CLIENT_SECRET=
PHONEPE_CLIENT_VERSION=1
PHONEPE_ENV=PRODUCTION
PHONEPE_REDIRECT_URL=https://<your-backend>/api/order/status
PHONEPE_FRONTEND_URL=https://<your-frontend>
```

Frontend (`client/.env`):
```
VITE_BASE_URL=http://localhost:3000
```

## Deployment

Both frontend and backend deploy to Vercel (`vercel.json` present). Database is MongoDB Atlas. CORS is configured for `aroraopticals.com` (production) and `localhost:5173` (dev).
