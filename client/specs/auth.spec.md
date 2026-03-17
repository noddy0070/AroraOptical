# Authentication Specification

## Methods

Authentication supports:

* Email + password login
* Google login (via Firebase)
* JWT authentication

---

## API

POST /api/auth/register

POST /api/auth/login

POST /api/auth/logout

GET /api/auth/me

---

## Security

Passwords are hashed using:

```
bcrypt
```

JWT stored in:

```
HTTP-only cookie
```
