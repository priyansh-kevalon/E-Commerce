# E-Commerce Backend

REST API for the E-Commerce application built with **Node.js, Express, MongoDB and Mongoose**.

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- bcryptjs password hashing
- CORS + dotenv

## Getting Started

```bash
cd backend
npm install
cp .env.example .env   # then edit values
npm run dev            # nodemon (development)
npm start              # node (production)
```

The API runs on `http://localhost:5000` by default.

## Environment Variables

| Variable       | Description                          |
| -------------- | ------------------------------------ |
| `PORT`         | Server port (default `5000`)         |
| `NODE_ENV`     | `development` or `production`        |
| `CLIENT_URL`   | Frontend origin allowed by CORS      |
| `MONGO_URI`    | MongoDB connection string            |
| `JWT_SECRET`   | Secret used to sign JWT tokens       |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `30d`)        |

## API Base Prefix

All resources are served under `/api`:

```
/api/auth        /api/users       /api/products    /api/categories
/api/cart        /api/wishlist    /api/orders      /api/admin
```

## Health Check

```
GET /api/health
```

## Authentication

Passwords are hashed with bcryptjs. Authenticated requests send the JWT as
`Authorization: Bearer <token>`.

| Method | Endpoint             | Access  | Description                    |
| ------ | -------------------- | ------- | ------------------------------ |
| POST   | `/api/auth/register` | Public  | Create a customer account      |
| POST   | `/api/auth/login`    | Public  | Log in and receive a JWT       |
| GET    | `/api/auth/me`       | Private | Get the current user           |

### Seed an admin account

```bash
npm run seed:admin
# also reset the password to the .env value:
npm run seed:admin -- --reset-password
```

Uses `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env` (defaults: `admin@shopease.com` / `Admin@123`).

## Categories

| Method | Endpoint              | Access        | Description                                   |
| ------ | --------------------- | ------------- | --------------------------------------------- |
| GET    | `/api/categories`     | Public        | List categories (`?status=active`, `?withCount=true`) |
| GET    | `/api/categories/:id` | Public        | Get one category                              |
| POST   | `/api/categories`     | Admin         | Create category                               |
| PUT    | `/api/categories/:id` | Admin         | Update category                               |
| DELETE | `/api/categories/:id` | Admin         | Delete (blocked while products reference it)  |

## Products

| Method | Endpoint            | Access | Description                     |
| ------ | ------------------- | ------ | ------------------------------- |
| GET    | `/api/products`     | Public | List products (see query params)|
| GET    | `/api/products/:id` | Public | Get product details             |
| POST   | `/api/products`     | Admin  | Create product                  |
| PUT    | `/api/products/:id` | Admin  | Update product                  |
| DELETE | `/api/products/:id` | Admin  | Delete product                  |

### Product listing query parameters

| Param       | Example               | Description                                              |
| ----------- | --------------------- | -------------------------------------------------------- |
| `search`    | `?search=iphone`      | Case-insensitive match on name / brand / description     |
| `category`  | `?category=electronics` | Category name **or** ObjectId                          |
| `minPrice`  | `?minPrice=100`       | Minimum selling price (uses discount price when present) |
| `maxPrice`  | `?maxPrice=500`       | Maximum selling price                                    |
| `sort`      | `?sort=price_asc`     | `newest`, `oldest`, `price_asc`, `price_desc`, `rating`, `popular`, `name_asc`, `name_desc` |
| `featured`  | `?featured=true`      | Only featured products                                   |
| `inStock`   | `?inStock=true`       | Only products with stock > 0                             |
| `minRating` | `?minRating=4`        | Minimum average rating                                   |
| `page`      | `?page=2`             | Page number (default 1)                                  |
| `limit`     | `?limit=12`           | Items per page (default 12, max 100)                     |

The list response includes a `pagination` object:
`{ total, page, limit, totalPages, hasNextPage, hasPrevPage }`.

## Response Format

```jsonc
// Success
{ "success": true, "message": "Login successful", "data": { } }

// Error
{ "success": false, "message": "Invalid email or password" }
```

## Project Structure

```
backend/
├── config/         # Database connection
├── controllers/    # Route handlers (business logic)
├── middleware/     # Auth, admin and error middleware
├── models/         # Mongoose schemas
├── routes/         # Express routers
├── utils/          # Helpers (token, response)
├── validators/     # Input validation
├── uploads/        # Uploaded images
├── server.js       # App entry point
└── package.json
```
