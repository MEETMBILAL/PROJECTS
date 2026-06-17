# Submission 1

- **Model:** Claude Opus 4.8
- **Source branch:** `cursor/bookshelf-fullstack-rebuild-a98f`
- **Project:** Bookshelf.pk — full-stack online bookstore + Print-on-Demand

This folder contains one model's complete generated codebase:

- `bookshelf_backend/` — Django 5 + Django REST Framework API (JWT auth,
  catalogue, cart/orders, reviews, wishlist, POD, payments, promotions),
  services layer, Celery tasks, email templates, Docker.
- `bookshelf_frontend/` — Next.js 14 (App Router) + TypeScript + Tailwind +
  TanStack Query + Zustand + NextAuth storefront.
- `docker-compose.yml` — one-command stack (Postgres, Redis, backend, Celery,
  frontend).
- `README.md` — full setup and API documentation.

Verified: backend `manage.py test` (9 passing) + dev server smoke test;
frontend `tsc --noEmit` clean and `next build` succeeds (18 routes).
