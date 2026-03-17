# Admin Panel Specification

## Overview

The Admin Panel allows administrators to manage the ecommerce platform including products, orders, users, policies, images, and shipping.

Admin users have elevated permissions compared to normal users.

---

# Roles

### Admin

Full access to:

* Product management
* Order management
* User management
* Policy management
* Image uploads
* Shipping management
* Analytics (future)

### Customer

Limited access:

* View products
* Place orders
* Manage personal profile

---

# Authentication

Admin authentication uses:

* JWT token
* HTTP-only cookies
* Role verification middleware

### Middleware

```
auth.js
```

Checks:

```
user.role === "admin"
```

Unauthorized users receive:

```
403 Forbidden
```

---

# Admin Features

## 1. Product Management

Admin can:

* Create product
* Update product
* Delete product
* Upload product images
* Manage product attributes
* Manage inventory

### API Endpoints

POST /api/product
Create new product

PUT /api/product/:id
Update product

DELETE /api/product/:id
Delete product

GET /api/product
Fetch all products

---

## 2. Order Management

Admin can:

* View all orders
* Update order status
* Cancel orders
* Generate shipping labels

### Order Status

```
Pending
Processing
Shipped
Delivered
Cancelled
```

### API

GET /api/order
Get all orders

PUT /api/order/:id/status
Update order status

---

## 3. User Management

Admin can:

* View all users
* Ban users
* Change roles

### API

GET /api/user
Fetch users

PUT /api/user/:id/role
Update user role

DELETE /api/user/:id
Delete user

---

## 4. Image Management

Admin can upload images for products.

Images are stored using:

Cloudinary or external storage.

### API

POST /api/image/upload

Returns:

```
{
  url: string
}
```

---

## 5. Policy Management

Admin can manage:

* Return policy
* Privacy policy
* Shipping policy

### API

GET /api/policy
POST /api/policy
PUT /api/policy/:id

---

## 6. Eye Test Management

Admin can:

* Create eye test slots
* Manage appointments

### API

POST /api/eyetest
GET /api/eyetest

---

# Admin Dashboard UI

Admin dashboard includes:

* Product table
* Order table
* User table
* Policy editor
* Image upload interface

### Layout

Sidebar Navigation

```
Dashboard
Products
Orders
Users
Policies
Images
Eye Test
Settings
```

---

# Security

Admin routes must always verify:

1. Authentication
2. Admin role

Middleware chain:

```
verifyToken → verifyAdmin
```

---

# Error Handling

Errors should follow this structure:

```
{
  success: false,
  message: "Error message"
}
```

---

# Future Enhancements

Admin panel will later include:

* Analytics dashboard
* Revenue reports
* Inventory alerts
* Coupon management
* Discount engine
* Bulk product import

```
```
