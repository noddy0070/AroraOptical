# Order System Specification

## Order Fields

Order contains:

* userId
* products[]
* totalPrice
* shippingAddress
* paymentStatus
* orderStatus
* shippingTrackingId

---

## Order Status

```
Pending
Processing
Shipped
Delivered
Cancelled
```

---

## API

POST /api/order
Create order

GET /api/order/user/:id
Get user orders

GET /api/order
Admin fetch all orders

PUT /api/order/:id/status
Update order status

```
```
