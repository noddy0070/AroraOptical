# Arora Optical - Full Stack E-commerce Platform

## Overview
Arora Optical is a full-stack web application designed for optical businesses, providing a modern e-commerce experience for eyewear, eye tests, and related services. The platform features user and admin portals, product and order management, payment and shipping integrations, and more.

## Features
- User registration, login, and Google OAuth authentication
- Product catalog, cart, checkout, and order management
- Eye test booking and prescription management
- Admin dashboard for managing users, products, orders, analytics, and policies
- Payment integration with Razorpay
- Shipping integration with Shiprocket
- Image uploads via Cloudinary
- Email and SMS notifications (Nodemailer, Twilio)
- Responsive frontend with React, Vite, Tailwind CSS, and Redux

## Folder Structure
```
/                # Project root
|-- api/         # Backend (Node.js, Express, MongoDB)
|   |-- models/        # Mongoose schemas
|   |-- routes/        # Express routers (API endpoints)
|   |-- controllers/   # Business logic for each route
|   |-- utils/         # Utility modules (integrations, helpers)
|   |-- middleware/    # Custom middleware (auth, etc.)
|   |-- index.js       # Backend entry point
|   |-- package.json   # Backend dependencies and scripts
|
|-- client/     # Frontend (React, Vite, Tailwind CSS)
|   |-- src/           # Main frontend source code
|   |   |-- components/    # Reusable UI components
|   |   |-- pages/         # Page components (Home, Product, Admin, etc.)
|   |   |-- redux/         # Redux state management
|   |   |-- utils/         # Utility functions
|   |   |-- providers/     # Context providers
|   |   |-- App.jsx        # Main app component
|   |   |-- main.jsx       # Entry point
|   |-- public/        # Static assets
|   |-- package.json   # Frontend dependencies and scripts
|
|-- package.json   # Project-level dependencies (if any)
|-- .gitignore     # Git ignore rules
```

## Setup Instructions

### Prerequisites
- Node.js (v16+ recommended)
- npm (v8+ recommended)
- MongoDB instance (local or cloud)

### 1. Clone the Repository
```bash
git clone <repo-url>
cd AroraOptical
```

### 2. Install Dependencies
```bash
# Install backend dependencies
cd api
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Environment Variables
Create a `.env` file in the `api/` directory with the following variables:
```
PORT=3000
MONGO=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
SESSION_SECRET=<your-session-secret>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
FRONTEND_URL=http://localhost:5173
# Add other integration keys as needed (Razorpay, Cloudinary, Twilio, etc.)
```

### 4. Run the Application
```bash
# Start backend (from project root)
npm run dev --prefix api

# Start frontend (in a new terminal)
npm run dev --prefix client
```

- Backend: http://localhost:3000
- Frontend: http://localhost:5173

## Main Dependencies
- **Backend:** express, mongoose, passport, jsonwebtoken, bcryptjs, razorpay, shiprocket, cloudinary, nodemailer, twilio
- **Frontend:** react, vite, tailwindcss, redux, @mui/material, @heroicons/react, framer-motion, recharts

## API Endpoints
- `/api/user` - User management
- `/api/auth` - Authentication (local, Google OAuth)
- `/api/admin` - Admin operations
- `/api/image` - Image uploads
- `/api/eye-test` - Eye test booking
- `/api/order` - Order management

## License
This project is licensed under the ISC License.

---

For more details, see the code comments and explore the `api/` and `client/` directories. 