# Bookshelf.pk — Full-Stack Online Bookstore & Print-on-Demand Platform

A production-grade, full-stack online bookstore inspired by **book-shelf.pk** — an online
bookstore and Print-on-Demand (POD) platform for Pakistan. Sells Non-Fiction, Business,
Self-Help, Fiction, and Academic course books, with on-demand printing.

## Tech Stack

**Backend**
- ![Django](https://img.shields.io/badge/Django-5.0-092E20?logo=django) Django 5 + Django REST Framework
- ![Postgres](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql) PostgreSQL (SQLite fallback for local dev)
- ![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis) Redis + Celery (async tasks & emails)
- JWT auth via `djangorestframework-simplejwt`, Cloudinary media, Stripe + JazzCash payment stubs

**Frontend**
- ![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=next.js) Next.js 14 (App Router) + TypeScript (strict)
- ![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss) Tailwind CSS design system
- TanStack Query (server state), Zustand (cart/wishlist/UI), NextAuth.js (credentials), React Hook Form + Zod

## Features

- Catalogue with categories, authors, publishers, tags; filtering, search, ordering & pagination
- Featured / Best Seller / New Arrival collections and related-book recommendations
- Cart (session + user based), coupons, multi-step checkout (COD / JazzCash / Stripe)
- Orders with snapshots, status lifecycle, cancellation
- Reviews & ratings, wishlist
- Print-on-Demand: specifications, live price calculator, file upload (Cloudinary signed uploads)
- User account: profile, addresses, order history, POD orders
- JWT auth with auto token refresh, welcome / order / password-reset emails (Celery)
- SEO: per-page metadata, OpenGraph, JSON-LD for books
- Unified API response envelope, custom pagination/exception handling
- Docker + docker-compose for the whole stack

## Architecture

```
                         ┌──────────────────────────┐
   Browser  ◀──────────▶ │  Next.js 14 (frontend)   │
                         │  App Router · TS · Tailwind│
                         │  TanStack Query · Zustand  │
                         └────────────┬───────────────┘
                                      │  REST (Axios + JWT)
                                      ▼
                         ┌──────────────────────────┐
                         │  Django + DRF (backend)  │
                         │  apps/ · services/ · core/ │
                         └───┬─────────┬─────────┬────┘
                             │         │         │
                       ┌─────▼──┐ ┌────▼───┐ ┌───▼─────┐
                       │Postgres│ │ Redis  │ │Cloudinary│
                       └────────┘ │+Celery │ │  media   │
                                  └────────┘ └──────────┘
```

```
.
├── bookshelf_backend/    # Django project (config/, apps/, core/, services/)
├── bookshelf_frontend/   # Next.js app (src/app, components, lib, hooks, store)
└── docker-compose.yml    # db + redis + backend + celery + frontend
```

## Local Setup

### Prerequisites
- Python 3.12+, Node.js 20+, (optional) PostgreSQL 15 & Redis 7

### Backend

```bash
cd bookshelf_backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements/development.txt
cp .env.example .env                # defaults to SQLite + console email
python manage.py migrate
python manage.py seed_demo          # optional demo catalogue/POD/coupons
python manage.py createsuperuser
python manage.py runserver          # http://localhost:8000
```

API root: `http://localhost:8000/api/v1/` · Admin: `http://localhost:8000/admin/`
Health check: `http://localhost:8000/health/`

Run tests: `python manage.py test apps`

### Frontend

```bash
cd bookshelf_frontend
npm install
cp .env.local.example .env.local    # set NEXT_PUBLIC_API_URL + NEXTAUTH_SECRET
npm run dev                         # http://localhost:3000
```

Typecheck: `npm run typecheck` · Build: `npm run build`

## Docker Setup

```bash
cp bookshelf_backend/.env.example bookshelf_backend/.env
docker compose up --build
# frontend → http://localhost:3000   backend → http://localhost:8000
```

The backend entrypoint waits for Postgres, runs migrations, and collects static files.
Seed demo data with: `docker compose exec backend python manage.py seed_demo`.

## API Documentation

Key endpoints (all under `/api/v1/`):

| Area     | Endpoints |
|----------|-----------|
| Auth     | `auth/register/`, `auth/login/`, `auth/logout/`, `auth/token/refresh/`, `auth/password/reset/`, `auth/password/change/` |
| Catalogue| `books/`, `books/{slug}/`, `books/featured/`, `books/bestsellers/`, `books/new-arrivals/`, `categories/`, `authors/`, `search/?q=` |
| Cart     | `cart/`, `cart/add/`, `cart/update/{id}/`, `cart/remove/{id}/`, `cart/clear/`, `cart/apply-coupon/` |
| Orders   | `orders/`, `orders/create/`, `orders/{order_number}/`, `orders/{order_number}/cancel/` |
| Reviews  | `books/{slug}/reviews/`, `reviews/{id}/` |
| Wishlist | `wishlist/`, `wishlist/add/`, `wishlist/remove/{book_id}/` |
| POD      | `pod/specifications/`, `pod/orders/`, `pod/orders/calculate-price/`, `pod/upload/` |
| Payments | `payments/stripe/intent/`, `payments/stripe/webhook/`, `payments/jazzcash/initiate/`, `payments/jazzcash/callback/` |
| Account  | `account/profile/`, `account/addresses/` |

All responses use a consistent envelope:

```json
{ "success": true, "data": {  }, "message": "Request successful", "errors": null }
```

## Environment Variables

See `bookshelf_backend/.env.example` and `bookshelf_frontend/.env.local.example` for the full
reference (database, Redis, Cloudinary, Stripe, JazzCash, email, CORS, JWT lifetimes, etc.).
Payment gateways and Cloudinary operate in **mock mode** when credentials are absent, so the
full flow is testable locally without third-party accounts.

## Contributing

1. Create a feature branch.
2. Backend: format with `black`, keep business logic in `services/`, ensure `python manage.py test apps` passes.
3. Frontend: keep `strict` TypeScript (no `any`), run `npm run typecheck` and `npm run build`.
4. Open a pull request describing the change.

## License

MIT
