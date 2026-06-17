# Bookshelf.pk — Full-Stack Online Bookstore & Print-on-Demand

A production-grade, full-stack rebuild of **book-shelf.pk** — an online bookstore and
Print-on-Demand (POD) platform for Pakistan. Sells Non-Fiction, Business, Self-Help,
Fiction and Academic course books, with a custom document printing service.

![Django](https://img.shields.io/badge/Django-5.0-092E20?logo=django)
![DRF](https://img.shields.io/badge/DRF-3.15-A30000)
![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)
![Postgres](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql)

---

## ✨ Features

- **Catalogue** — books, categories (tree), authors, publishers, tags with filtering,
  full-text search, sorting, pagination, featured / bestsellers / new-arrivals / related.
- **Cart** — guest (session-based) and authenticated carts, coupon application.
- **Orders** — atomic checkout with stock decrement + audit trail, order tracking,
  cancellation & restock, COD / Stripe / JazzCash payment methods.
- **Reviews & Ratings** — verified-purchase detection, denormalised aggregates.
- **Wishlist** — per-user saved books.
- **Print-on-Demand** — print specifications, live price calculator, PDF upload
  (Cloudinary signed uploads), POD order tracking.
- **Payments** — Stripe + JazzCash gateways with mock fallbacks for local dev.
- **Auth** — JWT (access/refresh, rotation + blacklist) on the backend, NextAuth.js
  credentials provider on the frontend.
- **Promotions** — coupons, banners, flash sales.
- **Admin** — full Django admin for every model.
- **Consistent API envelope** — `{ success, data, message, errors }` everywhere.

---

## 🏗️ Architecture

```
                         ┌─────────────────────────────┐
                         │        Next.js 14 (TS)       │
                         │  App Router · Tailwind · RQ  │
                         │  Zustand · NextAuth · Axios  │
                         └───────────────┬─────────────┘
                                         │ REST (JWT)
                                         ▼
                         ┌─────────────────────────────┐
                         │   Django 5 + DRF (API v1)    │
                         │  apps/ · core/ · services/   │
                         └───────┬─────────────┬────────┘
                                 │             │
                      ┌──────────▼───┐   ┌─────▼──────┐
                      │  PostgreSQL  │   │   Redis    │
                      └──────────────┘   └─────┬──────┘
                                               │
                                       ┌───────▼───────┐
                                       │  Celery worker │
                                       │ (emails, POD)  │
                                       └───────────────┘
```

---

## 📁 Project layout

```
bookshelf.pk/
├── bookshelf_backend/   # Django + DRF API
├── bookshelf_frontend/  # Next.js 14 app
└── docker-compose.yml   # Orchestrates db, redis, backend, celery, frontend
```

---

## 🚀 Local setup

### Prerequisites
- Python 3.12, Node 20+, (optionally) PostgreSQL 15 & Redis 7. By default the
  backend uses SQLite and runs Celery tasks eagerly, so no extra services are needed.

### Backend

```bash
cd bookshelf_backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements/development.txt
cp .env.example .env                # optional; sensible defaults are built in
python manage.py migrate
python manage.py seed_data          # demo books, categories, POD specs, coupon
python manage.py createsuperuser
python manage.py runserver          # http://localhost:8000
```

Run the tests:

```bash
python manage.py test
```

### Frontend

```bash
cd bookshelf_frontend
npm install
cp .env.local.example .env.local    # set NEXTAUTH_SECRET
npm run dev                         # http://localhost:3000
```

Type-check & build:

```bash
npm run typecheck
npm run build
```

---

## 🐳 Docker

```bash
cd bookshelf.pk
cp bookshelf_backend/.env.example bookshelf_backend/.env
# set DATABASE_URL=postgresql://bookshelf_user:bookshelf_pass@db:5432/bookshelf_db
# set REDIS_URL=redis://redis:6379/0
docker compose up --build
```

Services: Postgres `:5432`, Redis `:6379`, API `:8000`, Frontend `:3000`.

---

## 🌐 API documentation

Base URL: `http://localhost:8000/api/v1`

| Area | Endpoints |
| --- | --- |
| Auth | `auth/register/`, `auth/login/`, `auth/logout/`, `auth/token/refresh/`, `auth/password/change/`, `auth/password/reset/` |
| Account | `account/profile/`, `account/addresses/` |
| Catalogue | `books/`, `books/{slug}/`, `books/featured/`, `books/bestsellers/`, `books/new-arrivals/`, `books/{slug}/related/`, `categories/`, `categories/{slug}/books/`, `authors/`, `search/?q=` |
| Cart | `cart/`, `cart/add/`, `cart/update/{id}/`, `cart/remove/{id}/`, `cart/clear/`, `cart/apply-coupon/` |
| Orders | `orders/`, `orders/create/`, `orders/{number}/`, `orders/{number}/cancel/` |
| Reviews | `books/{slug}/reviews/`, `reviews/{id}/` |
| Wishlist | `wishlist/`, `wishlist/add/`, `wishlist/remove/{book_id}/` |
| POD | `pod/specifications/`, `pod/specifications/calculate/`, `pod/orders/`, `pod/upload/` |
| Payments | `payments/stripe/intent/`, `payments/stripe/webhook/`, `payments/jazzcash/initiate/`, `payments/jazzcash/callback/` |
| Promotions | `banners/`, `flash-sales/` |

The browsable DRF API is available in development at `http://localhost:8000/api/v1/`.

---

## 🔐 Environment variables

See [`bookshelf_backend/.env.example`](bookshelf_backend/.env.example) and
[`bookshelf_frontend/.env.local.example`](bookshelf_frontend/.env.local.example)
for the full reference (DB, Redis, Cloudinary, Stripe, JazzCash, email, NextAuth).

---

## 🤝 Contributing

1. Create a feature branch.
2. Run `python manage.py test` (backend) and `npm run build` (frontend) before pushing.
3. Format Python with `black` and keep TypeScript `strict`-clean.
4. Open a pull request describing your change.

---

## 📄 License

MIT.
