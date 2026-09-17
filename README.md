# Zylo — Full-Stack E-Commerce Application

A production-structured, end-to-end e-commerce web app called Zylo:
React (Vite) + Tailwind CSS on the frontend, Node.js + Express + MongoDB
(Mongoose) on the backend, connected by a JWT-authenticated REST API.

Every feature described below is fully wired — there are no stubbed
endpoints or fake data on the frontend. All product, cart, and order data
comes from the MongoDB-backed API.

## What's included

- **Auth**: JWT-based signup/login, bcrypt password hashing, role-based
  access control (`customer` vs `admin`).
- **Catalog**: keyword search (MongoDB text index), category filtering,
  price range filtering, sorting (price/rating/newest), pagination.
- **Cart**: server-persisted cart per user — add/update/remove items,
  quantity synced live with stock levels.
- **Checkout & Mock Payment Gateway**: places an order, then simulates a
  call to a payment processor (Stripe/Razorpay-style) that flips the order
  from `Pending` → `Paid` (or `Failed`, with a retry-payment flow).
- **Order tracking**: order history dashboard + a live status timeline
  (`Placed → Confirmed → Shipped → Out for Delivery → Delivered`), with an
  admin panel to advance order status.
- **Admin dashboard**: create/deactivate products, update order status.

## Project structure

```
zylo/
├── backend/
│   ├── config/db.js
│   ├── models/            # User, Product, Cart, Order (Mongoose)
│   ├── middleware/         # auth (JWT), errorHandler
│   ├── controllers/        # authController, productController, cartController, orderController
│   ├── routes/              # authRoutes, productRoutes, cartRoutes, orderRoutes
│   ├── utils/generateToken.js
│   ├── seed/seed.js         # demo admin/customer + 10 sample products
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/              # axios.js + authService, productService, cartService, orderService
    │   ├── context/           # AuthContext, CartContext
    │   ├── components/        # Navbar, ProductCard, CartDrawer, BannerCarousel, CategoryDropdown, ProtectedRoute
    │   ├── pages/              # Home, ProductList, ProductDetail, Login, Register, Checkout, Orders, OrderDetail, Profile, AdminDashboard
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── tailwind.config.js
    ├── package.json
    └── .env.example
```

## Prerequisites

- Node.js 18+ and npm
- MongoDB running locally (`mongodb://127.0.0.1:27017`) **or** a free
  MongoDB Atlas cluster connection string

## Step-by-step setup

### 1. Get MongoDB running

Either:
- Install MongoDB Community Server locally and start it (`mongod`), or
- Create a free cluster at https://www.mongodb.com/atlas and copy its
  connection string.

### 2. Backend setup

```bash
cd zylo/backend
npm install
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/zylo
JWT_SECRET=replace_this_with_a_long_random_secret_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
PAYMENT_SIMULATED_SUCCESS_RATE=1
```

- `MONGO_URI`: your local or Atlas connection string.
- `JWT_SECRET`: any long random string (e.g. generate one with
  `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`).
- `PAYMENT_SIMULATED_SUCCESS_RATE`: a number from 0 to 1 controlling how
  often the mock payment gateway "succeeds" (1 = always succeed, 0.7 = fails
  ~30% of the time so you can test the retry-payment flow).

Seed the database with a demo admin, a demo customer, and 10 sample
products:

```bash
npm run seed
```

This prints the demo login credentials:
```
Admin login    -> admin@zylo.test / admin123
Customer login -> customer@zylo.test / customer123
```

Start the backend:

```bash
npm run dev
```

The API is now running at `http://localhost:5000/api`. Verify with:

```bash
curl http://localhost:5000/api/health
```

### 3. Frontend setup

Open a **new terminal**:

```bash
cd zylo/frontend
npm install
cp .env.example .env
```

`.env` should point at the backend:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### 4. Test the full flow

1. Go to `http://localhost:5173` — you should see the homepage with
   seeded products (if empty, confirm `npm run seed` ran successfully).
2. Register a new account, or log in with the demo customer account.
3. Search/filter/sort products on the Products page.
4. Add items to your cart (cart drawer opens automatically), adjust
   quantities.
5. Proceed to Checkout, fill in a shipping address, choose a payment
   method, and place the order — the mock payment gateway will process it
   and redirect you to the order tracking page.
6. Visit "My Orders" to see order history; open an order to see its live
   tracking timeline.
7. Log in as the admin account (`admin@zylo.test` /
   `admin123`) and visit `/admin` to add new products or advance order
   statuses — refresh the customer's order page to see the tracking
   timeline update in real time.

## API reference (backend)

| Method | Endpoint                       | Access        | Description                              |
|--------|---------------------------------|---------------|-------------------------------------------|
| POST   | /api/auth/register              | Public        | Create account                            |
| POST   | /api/auth/login                 | Public        | Login, returns JWT                        |
| GET    | /api/auth/me                    | Private       | Get current user profile                  |
| PUT    | /api/auth/me                    | Private       | Update profile / addresses                |
| GET    | /api/products                   | Public        | List products (keyword, category, minPrice, maxPrice, sort, page, limit) |
| GET    | /api/products/categories        | Public        | Distinct category list                    |
| GET    | /api/products/:idOrSlug         | Public        | Single product detail                     |
| POST   | /api/products                   | Admin         | Create product                            |
| PUT    | /api/products/:id                | Admin         | Update product                            |
| DELETE | /api/products/:id                | Admin         | Deactivate product                        |
| POST   | /api/products/:id/reviews        | Private       | Add a product review                      |
| GET    | /api/cart                       | Private       | Get current user's cart                   |
| POST   | /api/cart/items                  | Private       | Add item to cart                          |
| PUT    | /api/cart/items/:itemId          | Private       | Update item quantity                      |
| DELETE | /api/cart/items/:itemId          | Private       | Remove item from cart                     |
| DELETE | /api/cart                        | Private       | Clear cart                                |
| POST   | /api/orders                      | Private       | Place order + run mock payment gateway    |
| POST   | /api/orders/:id/pay               | Private       | Retry payment on a pending/failed order   |
| GET    | /api/orders/myorders              | Private       | Current user's order history              |
| GET    | /api/orders/:id                   | Private       | Single order detail (owner or admin)      |
| GET    | /api/orders                       | Admin         | All orders                                |
| PUT    | /api/orders/:id/status             | Admin         | Update order status (tracking)            |

All `Private`/`Admin` routes require an `Authorization: Bearer <token>`
header — the frontend's axios instance (`src/api/axios.js`) attaches this
automatically from `localStorage` after login.

## Notes on the mock payment gateway

`backend/controllers/orderController.js` contains `runMockPaymentGateway`,
which simulates an async call to a real processor (Stripe/Razorpay-style):
it waits briefly, then resolves with a generated transaction ID based on
`PAYMENT_SIMULATED_SUCCESS_RATE`. On success the order's `paymentStatus`
flips to `Paid`, stock is decremented, and the cart is cleared; on failure
the order is saved as `Pending`/`Failed` and the user can retry from the
order detail page. To wire in a real gateway later, replace the body of
`runMockPaymentGateway` with an actual Stripe/Razorpay SDK call and keep
the rest of the order flow unchanged.

## Production build

```bash
# Frontend
cd frontend
npm run build      # outputs static files to frontend/dist
npm run preview    # preview the production build locally

# Backend
cd backend
NODE_ENV=production npm start
```

For a real deployment, serve `frontend/dist` via a static host or CDN,
run the backend behind a process manager (e.g. PM2) or containerize it,
point `MONGO_URI` at your production database, set a strong `JWT_SECRET`,
and update `CLIENT_URL` / `VITE_API_BASE_URL` to your real domains.
