# Bookshelf.pk — Backend (Django + DRF)

Production-grade REST API for an online bookstore & Print-on-Demand (POD) platform for Pakistan.

## Tech Stack

- Python 3.12, Django 5
- Django REST Framework + SimpleJWT (JWT auth)
- PostgreSQL (SQLite fallback for local dev)
- Redis + Celery (async email & POD jobs)
- Cloudinary (media), Stripe + JazzCash (payment stubs)
- drf-spectacular (OpenAPI docs)

## Architecture

```
config/            # settings split (base / development / production), urls, celery, wsgi/asgi
core/              # abstract models, pagination, permissions, renderer, exception handler, utils
services/          # business logic layer (cart, order, email, search)
apps/
  accounts/        # CustomUser (email login), Address, JWT auth
  catalogue/       # Book, Category, Author, Publisher, Tag + filters/search
  inventory/       # StockItem, StockMovement
  orders/          # Cart, CartItem, Order, OrderItem (+ Celery tasks)
  payments/        # Payment, Transaction + Stripe/JazzCash gateways
  pod/             # PODSpecification, PODOrder (+ Cloudinary signed upload)
  reviews/         # Review (ratings, verified purchase)
  wishlist/        # WishlistItem
  promotions/      # Coupon, Banner, FlashSale
templates/emails/  # transactional HTML emails
tests/             # factory_boy factories
```

All API responses use a consistent envelope:

```json
{ "success": true, "data": { }, "message": "OK", "errors": null }
```

## Local Setup

```bash
cd bookshelf_backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements/development.txt

cp .env.example .env
# For local SQLite, set: DATABASE_URL=sqlite:///db.sqlite3

python manage.py migrate
python manage.py seed_data        # demo books, categories, coupons, POD specs, admin user
python manage.py runserver
```

- API root: `http://localhost:8000/api/v1/`
- Swagger docs: `http://localhost:8000/api/docs/`
- Admin: `http://localhost:8000/admin/` → `admin@bookshelf.pk` / `admin12345`

## Running Tests

```bash
python manage.py test
# or
pytest
```

## Celery (optional, requires Redis)

```bash
celery -A config worker -l info
```

In development `CELERY_TASK_ALWAYS_EAGER=True`, so tasks run synchronously without a broker.

## Key Endpoints

| Area | Endpoint |
| --- | --- |
| Auth | `POST /api/v1/auth/{register,login,logout}/`, `POST /api/v1/auth/token/refresh/` |
| Books | `GET /api/v1/books/`, `GET /api/v1/books/{slug}/`, `/featured/ /bestsellers/ /new-arrivals/` |
| Search | `GET /api/v1/search/?q=&category=&min_price=&max_price=&language=&format=` |
| Cart | `GET/POST/PATCH/DELETE /api/v1/cart/...` |
| Orders | `GET /api/v1/orders/`, `POST /api/v1/orders/create/` |
| Reviews | `GET/POST /api/v1/books/{slug}/reviews/` |
| Wishlist | `GET /api/v1/wishlist/`, `POST /api/v1/wishlist/add/` |
| POD | `GET /api/v1/pod/specifications/`, `POST /api/v1/pod/orders/` |
| Payments | `POST /api/v1/payments/{stripe/intent,jazzcash/initiate}/` |

## Environment Variables

See [`.env.example`](./.env.example) for the full list (database, Redis, Cloudinary,
Stripe, JazzCash, email, CORS).
