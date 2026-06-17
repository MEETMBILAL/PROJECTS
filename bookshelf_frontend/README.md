# Bookshelf.pk — Frontend (Next.js 14 + TypeScript)

Modern, editorial storefront for the Bookshelf.pk online bookstore & Print-on-Demand platform.

## Tech Stack

- Next.js 14 (App Router) + TypeScript (strict)
- Tailwind CSS (custom Bookshelf light theme)
- TanStack Query (server state) + Zustand (UI/cart/wishlist state)
- NextAuth.js (JWT credentials provider against the Django API)
- React Hook Form + Zod (forms & validation)
- Axios API client with response-envelope unwrapping

## Design System

| Token | Value |
| --- | --- |
| Primary (Deep Forest Green) | `#2C4A3E` |
| Secondary (Warm Amber) | `#C4933F` |
| Surface (Warm White) | `#FAFAF8` |
| Display font | Playfair Display |
| Body font | Inter |

Book covers always use `aspect-[2/3]`, cards use `rounded-xl` + subtle shadow with a gentle
hover lift, and sections alternate between warm white and cream backgrounds.

## Structure

```
src/
  app/
    (shop)/        # public storefront (home, books, categories, authors, cart, checkout, search, pod)
    (auth)/        # login, register, forgot-password (no navbar)
    (account)/     # protected: profile, orders, wishlist, pod-orders
    api/auth/      # NextAuth route handler
  components/      # layout, home, books, cart, checkout, pod, reviews, common
  hooks/           # useBooks, useCart, useWishlist, useSearch, useAuth, useDebounce
  lib/api/         # axios client + typed API modules
  store/           # Zustand stores (cart, wishlist, ui)
  types/           # shared TypeScript types
  constants/       # routes, query keys, config
```

## Local Setup

```bash
cd bookshelf_frontend
npm install
cp .env.local.example .env.local
# set NEXTAUTH_SECRET and NEXT_PUBLIC_API_URL (default points to http://localhost:8000/api/v1)
npm run dev
```

Open `http://localhost:3000` (the Django backend must be running for live data).

## Scripts

```bash
npm run dev        # dev server
npm run build      # production build
npm run typecheck  # tsc --noEmit (strict)
npm run lint       # next lint
```

## Environment Variables

See [`.env.local.example`](./.env.local.example):
`NEXT_PUBLIC_API_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`,
`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
