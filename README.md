# Pennywise Expense Tracker

A full-stack MERN expense tracker with JWT authentication, user-private expenses, dashboard totals/categories, responsive UI, and RESTful CRUD endpoints.

## Run locally

1. Install and start MongoDB locally (or set a MongoDB Atlas URI).
2. Copy `server/.env.example` to `server/.env`, then set `MONGO_URI` and a secure `JWT_SECRET`.
3. Install dependencies:
   ```bash
   npm install
   npm run install-all
   ```
4. Start both apps: `npm run dev`

The UI runs at `http://localhost:5173`; the API runs at `http://localhost:5000`.

## REST API

- `POST /api/auth/register` — create account
- `POST /api/auth/login` — authenticate
- `GET /api/auth/me` — authenticated profile
- `GET /api/expenses` — user expenses (optional `?category=`)
- `POST /api/expenses` — create expense
- `PUT /api/expenses/:id` — update expense
- `DELETE /api/expenses/:id` — delete expense
- `GET /api/expenses/summary` — category totals

Protected endpoints use `Authorization: Bearer <token>`.
