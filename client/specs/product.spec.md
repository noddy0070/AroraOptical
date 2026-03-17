# Product System Specification

## Product Fields

Product contains:

* name
* description
* price
* brand
* category
* images
* attributes
* stock
* rating
* reviews

---

## API

GET /api/product
Fetch all products

GET /api/product/:id
Fetch product by id

POST /api/product
Create product (admin only)

PUT /api/product/:id
Update product

DELETE /api/product/:id
Delete product

---

## Filtering

Products can be filtered by:

* brand
* category
* price
* lens type
* frame type

---

## Sorting

Supported sorts:

* price ascending
* price descending
* popularity
* newest

```
```
