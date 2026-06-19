# Asura Scans Clone

A production-ready dark manga/manhwa reader inspired by Asura-style reading platforms. Built with Next.js 14 App Router, TypeScript, Tailwind CSS, shadcn-style components, Prisma/PostgreSQL, NextAuth, Zustand, and Upstash Redis.

## Project structure

```txt
asura-scans-clone/
  app/
    api/
      auth/[...nextauth]/route.ts
      bookmarks/route.ts
      bookmarks/[id]/route.ts
      chapters/[id]/pages/route.ts
      comics/route.ts
      comics/[slug]/route.ts
      comics/[slug]/chapters/route.ts
      latest/route.ts
      ratings/route.ts
      search/route.ts
      trending/route.ts
      views/route.ts
    bookmarks/page.tsx
    browse/page.tsx
    comics/[slug]/page.tsx
    comics/[slug]/chapter/[num]/page.tsx
    leaderboard/page.tsx
    login/page.tsx
    search/page.tsx
    globals.css
    layout.tsx
    page.tsx
  components/
    ui/
    reader/
    bookmark-button.tsx
    browse-filters.tsx
    chapter-list.tsx
    comic-card.tsx
    comic-grid.tsx
    hero-carousel.tsx
    navbar.tsx
    search-overlay.tsx
  lib/
    auth.ts
    comics.ts
    mock-data.ts
    prisma.ts
    redis.ts
    utils.ts
  prisma/
    schema.prisma
    seed.ts
  store/
    bookmark-store.ts
    reader-store.ts
  types/
    comic.ts
    next-auth.d.ts
```

## Features

- Sticky 60px dark navbar with resources dropdown, search overlay, login action, and mobile drawer.
- Home page with auto-rotating hero, trending ranks, latest updates, new titles, and completed series.
- Browse page with genre multi-select, status/type/sort filters, active chips, responsive grid, and load-more pagination.
- Comic detail page with metadata, cover, rating, views, bookmark action, share actions, expandable synopsis, genre tags, chapter search/sort/pagination, and related comics.
- Reader page with minimal black UI, chapter selector, prev/next controls, keyboard arrows, long-strip/paginated modes, settings panel, lazy images, and progress bar.
- Auth-required bookmarks page with empty state, unread count, and remove bookmark action.
- Leaderboard and debounced search pages.
- Prisma schema for users, comics, chapters, chapter pages, genres, bookmarks, ratings, views, and comments.
- API route handlers for all requested endpoints.
- Demo fallback data when `DATABASE_URL` is not configured.

## Setup

```bash
npm install
cp .env.example .env.local
npm run db:push
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

Demo credentials after seeding:

- `reader@asuraclone.test` / `password123`
- `admin@asuraclone.test` / `password123`

## Environment

Use Neon or Supabase for PostgreSQL, Upstash for Redis, Google OAuth for social login, and Cloudinary or uploadthing for image uploads. Search is routed through `/api/search` and can be replaced with Algolia or MeiliSearch indexing using the variables in `.env.example`.

## Scripts

- `npm run dev` - start local development
- `npm run build` - production build
- `npm run lint` - Next.js lint
- `npm run typecheck` - TypeScript checks
- `npm run db:push` - push Prisma schema
- `npm run db:seed` - seed demo data

## Deployment

1. Provision PostgreSQL on Neon or Supabase.
2. Provision Redis on Upstash.
3. Add all required environment variables in Vercel.
4. Run `npm run build`.
5. Deploy to Vercel.
