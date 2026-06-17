# Bookshelf.pk — Full-Stack Online Bookstore & Print-on-Demand

A production-grade, full-stack online bookstore and Print-on-Demand (POD)
platform for Pakistan, selling Non-Fiction, Business, Self-Help, Fiction and
Academic Course books.

![Django](https://img.shields.io/badge/Django-5.0-092E20?logo=django)
![DRF](https://img.shields.io/badge/DRF-3.15-A30000)
![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)

---

## ✨ Features

- **Catalogue** — Books, Categories (nested), Authors, Publishers, Tags with
  rich filtering, full-text search, sorting and pagination.
- **Authentication** — JWT (SimpleJWT) email-based custom user, registration,
  login, token refresh, password change, addresses. NextAuth on the frontend.
- **Cart & Orders** — Session and user carts, stock-safe order creation with
  `select_for_update` locking, order numbers, cancellation + restock.
- **Reviews & Ratings** — Verified-purchase detection, denormalised rating
  aggregates on books.
- **Wishlist** — Per-user wishlist (server) + instant client-side wishlist.
- **Print-on-Demand** — Specifications, live price calculator, order
  submission, Cloudinary upload signatures.
- **Payments** — Stripe + JazzCash gateway integrations with safe dev stubs.
- **Promotions** — Coupons (percentage/fixed), banners, flash sales.
- **Emails** — HTML templates dispatched via Celery (order confirmation,
  shipped, welcome, password reset, POD received).
- **Consistent API** — Every response uses `{ success, data, message, errors }`.

---

## 🏗️ Architecture

```
                       ┌──────────────────────────┐
                       │   Next.js 14 (frontend)   │
                       │  App Router · TS · Tailwind│
                       │  TanStack Query · Zustand  │
                       │  NextAuth (JWT credentials)│
                       └────────────┬───────────────┘
                                    │  REST (Axios)
                                    ▼
                       ┌──────────────────────────┐
                       │   Django REST Framework   │
                       │  Views → Services → Models │
                       │  SimpleJWT · django-filter │
                       └───┬───────────┬────────┬───┘
                           │           │        │
                     ┌─────▼───┐  ┌────▼───┐ ┌──▼─────┐
                     │Postgres │  │ Redis  │ │Celery  │
                     │   DB    │  │ broker │ │worker  │
                     └─────────┘  └────────┘ └────────┘
```

The backend keeps business logic in a dedicated `services/` layer; views stay
thin and the same logic is reused by tests, Celery tasks and management
commands.

---

## 📁 Project Structure

```
bookshelf/
├── bookshelf_backend/     # Django + DRF API
│   ├── config/            # Settings split (base/dev/prod), urls, celery
│   ├── core/              # Abstract models, pagination, permissions, renderer
│   ├── apps/              # accounts, catalogue, inventory, orders, payments,
│   │                      # pod, reviews, wishlist, promotions
│   ├── services/          # cart / order / email / search business logic
│   ├── templates/emails/  # HTML email templates
│   ├── tests/             # factory_boy factories
│   └── requirements/      # base / development / production
└── bookshelf_frontend/    # Next.js 14 app
    └── src/
        ├── app/           # (shop) (auth) (account) route groups + api
        ├── components/    # layout, home, books, cart, checkout, pod, reviews
        ├── hooks/ lib/ store/ types/ constants/
```

---

## 🚀 Local Setup

### Prerequisites
- Python 3.12+, Node.js 20+
- (Optional) PostgreSQL 15 + Redis 7 — the backend falls back to SQLite and
  runs Celery eagerly without them.

### Backend

```bash
cd bookshelf_backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements/development.txt
cp .env.example .env                 # tweak as needed
python manage.py migrate
python manage.py seed_data           # demo books + admin user
python manage.py runserver
```

- API: <http://localhost:8000/api/v1/>
- Admin: <http://localhost:8000/admin/> (`admin@bookshelf.pk` / `admin12345`)
- Health: <http://localhost:8000/health/>

Run the test suite:

```bash
python manage.py test
```

### Frontend

```bash
cd bookshelf_frontend
npm install
cp .env.local.example .env.local     # set NEXTAUTH_SECRET, API URL
npm run dev
```

App: <http://localhost:3000>

---

## 🐳 Docker Setup

From the `bookshelf/` directory:

```bash
cp bookshelf_backend/.env.example bookshelf_backend/.env
docker compose up --build
```

Services: `db` (Postgres), `redis`, `backend` (Gunicorn :8000),
`celery` (worker), `frontend` (Next.js :3000).

---

## 📚 API Documentation

Base URL: `/api/v1/`

| Area     | Endpoint examples |
|----------|-------------------|
| Auth     | `POST /auth/register/`, `POST /auth/login/`, `POST /auth/token/refresh/` |
| Books    | `GET /books/`, `GET /books/{slug}/`, `GET /books/featured/`, `GET /search/?q=` |
| Taxonomy | `GET /categories/`, `GET /categories/{slug}/books/`, `GET /authors/` |
| Cart     | `GET /cart/`, `POST /cart/add/`, `PATCH /cart/update/{id}/`, `DELETE /cart/clear/` |
| Orders   | `GET /orders/`, `POST /orders/create/`, `POST /orders/{number}/cancel/` |
| Reviews  | `GET/POST /books/{slug}/reviews/`, `PATCH/DELETE /reviews/{id}/` |
| Wishlist | `GET /wishlist/`, `POST /wishlist/add/`, `DELETE /wishlist/remove/{id}/` |
| POD      | `GET /pod/specifications/`, `POST /pod/quote/`, `POST /pod/orders/` |
| Payments | `POST /payments/stripe/intent/`, `POST /payments/jazzcash/initiate/` |
| Promo    | `GET /banners/`, `GET /flash-sales/`, `POST /coupons/validate/` |

Try the browsable API at <http://localhost:8000/api/v1/books/>.

---

## 🔐 Environment Variables

See `bookshelf_backend/.env.example` and
`bookshelf_frontend/.env.local.example` for the full reference. Cloudinary,
Stripe and JazzCash all operate in **stub mode** until their credentials are
supplied, so the entire flow is testable out-of-the-box.

---

## 🤝 Contributing

1. Create a feature branch.
2. Run `python manage.py test` (backend) and `npm run build` (frontend).
3. Format Python with `black` and keep TypeScript `strict`-clean.
4. Open a pull request describing your change.

---

## 📄 License

MIT — see the repository root.
