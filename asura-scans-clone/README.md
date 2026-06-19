# Asura Scans Clone

A production-style dark manga/manhwa reader built with Next.js 14 App Router, Tailwind CSS, shadcn/ui, Prisma/PostgreSQL, NextAuth, Cloudinary-ready image storage, MeiliSearch-ready search, Upstash Redis-ready hot caching, and Zustand client state.

## Project structure

```txt
asura-scans-clone/
  app/
    api/                         Route handlers for comics, chapters, auth, search, bookmarks, ratings, views
    browse/                      Filtered catalog page
    bookmarks/                   Auth-required bookmark grid
    comics/[slug]/               Comic detail page
    comics/[slug]/chapter/[num]/ Chapter reader
    leaderboard/                 Weekly/monthly/all-time rankings
    login/                       Credentials and Google sign-in
    search/                      Debounced search page
    layout.tsx                   Global layout, Inter font, nav/footer shell
    page.tsx                     Home page with hero, trending, latest, new, completed sections
  components/
    comics/                      Comic cards, filters, chapter list, badges, ratings, bookmark button
    common/                      Section heading
    layout/                      Navbar and footer
    leaderboard/                 Ranked tabs
    reader/                      Reader controls and image stack
    search/                      Full-screen search overlay
    ui/                          shadcn/ui source components
  lib/
    auth.ts                      NextAuth credentials + Google provider
    cache.ts                     Upstash Redis helper with fallback
    mock-data.ts                 50 in-memory comics for immediate UI rendering
    prisma.ts                    Prisma singleton
    search.ts                    MeiliSearch helper with fallback
    types.ts                     Shared app types
  prisma/
    schema.prisma                PostgreSQL schema
    seed.ts                      50 comics, 5-200 chapters each, genres, sample users
  public/logo.svg                Logo asset
  tailwind.config.ts             Exact brand color system under `brand`
```

## Quick start

```bash
npm install
cp .env.example .env
npm run db:generate
npm run dev
```

The UI renders immediately from local sample data. To use PostgreSQL-backed APIs, set `DATABASE_URL`, then run:

```bash
npm run db:push
npm run db:seed
```

Seed accounts:

- `reader@example.com` / `password123`
- `admin@example.com` / `password123`

## Feature coverage

- Sticky 60px navbar with logo, Home/Bookmarks/Browse links, resources dropdown, search, auth avatar/login, mobile drawer, and scroll shadow.
- Dark footer with exact surface border and resource links.
- Home page hero slider with 5s auto-rotation, gradient overlay, metadata, CTA, dots, and arrows.
- Trending row with rank overlays, desktop 10-column grid, mobile horizontal scroll.
- Latest Updates, New Titles, and Completed Series grids with cover thumbnails, chapter timestamps via `date-fns`, hover lift, purple glow, and NEW/END badges.
- Browse filters for genre multi-select, status, type, sort, active chips, and load-more grid.
- Comic detail pages with cover, metadata, rating, views, bookmark/start/share actions, genre pills, synopsis, paginated/filtered chapter list, and related comics.
- Reader with minimal black UI, chapter selector, prev/next controls, keyboard shortcuts, long-strip/paginated modes, quality/background settings, lazy images, and progress bar.
- Bookmarks page protected by NextAuth session.
- Leaderboard tabs and debounced search page.
- API route handlers for all requested endpoints with Prisma and safe mock fallbacks for read endpoints.

## Environment services

### PostgreSQL

Use Neon, Supabase, or local Postgres. The schema uses PostgreSQL arrays for `Comic.altTitles`.

### Auth

NextAuth is configured with:

- Credentials provider using `bcryptjs` hashed passwords.
- Google OAuth provider.
- Prisma adapter models in `schema.prisma`.

### Search

`/api/search` uses MeiliSearch when `MEILISEARCH_HOST` is configured. Without it, the route falls back to local mock search.

### Cache

Hot data helpers use Upstash Redis when `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are present. Without them, route handlers run the underlying fetcher directly.

### Images

The app is Cloudinary-ready through environment variables and allows `res.cloudinary.com` in `next.config.mjs`. Demo covers use Unsplash and reader pages use placeholder images.

## Commands

```bash
npm run dev          # local development
npm run build        # production build
npm run start        # run production build
npm run lint         # Next.js lint
npm run db:generate  # generate Prisma Client
npm run db:push      # sync schema to database
npm run db:seed      # seed comics/users/chapters/pages
```

## Deployment

1. Create a Vercel project from this folder.
2. Provision PostgreSQL with Neon or Supabase and set `DATABASE_URL`.
3. Add `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, Google OAuth variables, and optional Cloudinary/MeiliSearch/Upstash variables.
4. Run `npm run db:push && npm run db:seed` against the production database once.
5. Deploy with the default Vercel Next.js build command.
