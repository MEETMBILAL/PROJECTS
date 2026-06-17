# 📚 Bookshelf.pk — Full-Stack Online Bookstore & Print-on-Demand Platform

A production-grade, full-stack rebuild of an online bookstore and Print-on-Demand (POD)
platform for Pakistan. Sells Non-Fiction, Business, Self-Help, Fiction and Academic course
books, and lets users upload manuscripts for on-demand printing.

![Django](https://img.shields.io/badge/Django-5.0-092E20?logo=django)
![DRF](https://img.shields.io/badge/DRF-3.15-A30000)
![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38BDF8?logo=tailwindcss)

## ✨ Features

- **Catalogue** — books, categories (nested), authors, publishers, tags with rich filtering,
  full-text search, sorting and pagination
- **Cart & Checkout** — session + user carts (merge on login), coupons, shipping rules,
  Pakistan-specific multi-step checkout (COD / JazzCash / Stripe)
- **Orders** — order creation with stock decrement, status tracking, cancellation, history
- **Reviews & Ratings** — verified-purchase badges, aggregate ratings
- **Wishlist** — per-user saved books
- **Print-on-Demand** — spec selection, live price calculator, file upload (Cloudinary signed),
  POD order tracking
- **Promotions** — coupons, banners, flash sales
- **Auth** — JWT (SimpleJWT) on the backend, NextAuth credentials provider on the frontend
- **Transactional emails** — welcome, order confirmation/shipped, password reset, POD received
- **SEO** — per-page metadata, OpenGraph, JSON-LD `Book` structured data
- **Admin** — themed Django admin (django-admin-interface) for full content management

## 🏗️ Architecture

```
┌─────────────────────────────┐         ┌──────────────────────────────┐
│   Next.js 14 Frontend       │  HTTPS  │     Django + DRF Backend      │
│  (App Router, TS, Tailwind) │ ◄─────► │   /api/v1/  (JWT auth)        │
│  TanStack Query · Zustand   │  JSON   │   services/ business layer    │
│  NextAuth (credentials)     │         │                               │
└─────────────────────────────┘         └───────────────┬──────────────┘
                                                         │
                              ┌──────────────────────────┼───────────────────────┐
                              ▼                           ▼                        ▼
                       ┌────────────┐            ┌────────────┐           ┌───────────────┐
                       │ PostgreSQL │            │   Redis    │           │  Cloudinary   │
                       └────────────┘            │  + Celery  │           │  Stripe /     │
                                                 └────────────┘           │  JazzCash     │
                                                                          └───────────────┘
```

- **Backend:** [`bookshelf_backend/`](./bookshelf_backend) — see its [README](./bookshelf_backend/README.md)
- **Frontend:** [`bookshelf_frontend/`](./bookshelf_frontend) — see its [README](./bookshelf_frontend/README.md)

## 🚀 Quick Start (local, without Docker)

**1. Backend**

```bash
cd bookshelf_backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements/development.txt
cp .env.example .env          # set DATABASE_URL=sqlite:///db.sqlite3 for local
python manage.py migrate
python manage.py seed_data
python manage.py runserver    # http://localhost:8000
```

**2. Frontend** (in a second terminal)

```bash
cd bookshelf_frontend
npm install
cp .env.local.example .env.local   # set NEXTAUTH_SECRET
npm run dev                          # http://localhost:3000
```

Demo admin: `admin@bookshelf.pk` / `admin12345` · API docs: `http://localhost:8000/api/docs/`

## 🐳 Docker Setup

A root [`docker-compose.yml`](./docker-compose.yml) orchestrates Postgres, Redis, the Django
backend, a Celery worker and the Next.js frontend:

```bash
docker compose up --build
# backend  → http://localhost:8000
# frontend → http://localhost:3000
```

Create `bookshelf_backend/.env` first (copy from `.env.example`).

## 📖 API Documentation

Interactive docs are served by drf-spectacular:

- Swagger UI: `http://localhost:8000/api/docs/`
- ReDoc: `http://localhost:8000/api/redoc/`
- OpenAPI schema: `http://localhost:8000/api/schema/`

## 🧪 Testing

```bash
# backend
cd bookshelf_backend && python manage.py test

# frontend
cd bookshelf_frontend && npm run typecheck && npm run build
```

## 🔐 Environment Variables

See [`bookshelf_backend/.env.example`](./bookshelf_backend/.env.example) and
[`bookshelf_frontend/.env.local.example`](./bookshelf_frontend/.env.local.example).

## 📂 Project Layout

| Path | Description |
| --- | --- |
| `bookshelf_backend/` | Django REST API |
| `bookshelf_frontend/` | Next.js storefront |
| `docker-compose.yml` | Full-stack container orchestration |

## 📝 License

MIT — provided for educational/demo purposes.
