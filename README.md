# Asura Scans Clone

A production-ready Next.js 14 App Router manga/manhwa reader inspired by the public Asura Scans layout: dark-only UI, purple brand system, featured slider, trending/latest grids, browse filters, comic detail pages, chapter reader, bookmarks, leaderboard, search, Prisma/Postgres schema, NextAuth, Redis/search hooks, and seed data.

## Tech stack

- Next.js 14 App Router + TypeScript
- Tailwind CSS with exact `brand` color tokens
- shadcn/ui-style source components built on Radix primitives
- Prisma ORM + PostgreSQL
- NextAuth.js credentials + Google OAuth
- Zustand client bookmark state
- MeiliSearch or Algolia search adapter with local fallback
- Upstash Redis cache helper
- Cloudinary/uploadthing environment placeholders

## Setup

```bash
npm install
cp .env.example .env.local
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

The app renders against built-in sample data when `DATABASE_URL` is not configured, so UI development can start immediately. Configure PostgreSQL and run the seed for persistent data.

Demo credentials after seeding:

- `reader@asura.test` / `password123`
- `admin@asura.test` / `password123`

## Important files

```txt
app/
  api/                         Route handlers for comics, chapters, bookmarks, search, ratings, views, auth
  browse/page.tsx              Filtered browse page
  bookmarks/page.tsx           Auth-gated bookmarks page
  comics/[slug]/page.tsx       Comic detail page
  comics/[slug]/chapter/[num]  Minimal reader page
  leaderboard/page.tsx         Weekly/monthly/all-time rankings
  page.tsx                     Home page with hero/trending/latest/new/completed sections
components/
  comics/                      Manga-specific cards, filters, reader, chapter list, search
  layout/                      Sticky nav, footer, route-aware app shell
  ui/                          shadcn/ui-style primitives
hooks/                         Debounce and Zustand bookmark store
lib/                           Data access, mock data, Prisma, auth, search, cache utilities
prisma/schema.prisma           Full PostgreSQL schema
prisma/seed.ts                 50 comics with 5-200 chapters each, genres, demo users
```

## Environment variables

See `.env.example` for all required and optional variables:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `MEILISEARCH_HOST` / `MEILISEARCH_API_KEY`
- `ALGOLIA_*`
- `CLOUDINARY_*` or `UPLOADTHING_*`

## Scripts

```bash
npm run dev              # Start development server
npm run build            # Production build
npm run lint             # Next.js lint
npm run typecheck        # TypeScript check
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Create/apply migration
npm run seed             # Seed sample content
```

## Design system

The Tailwind theme extends `brand` colors exactly as requested:

- `brand.primary`: `#913FE2`
- `brand.dark`: `#0F0F0F`
- `brand.card`: `#1A1A1A`
- `brand.cardHover`: `#222222`
- `brand.surface`: `#2A2A2A`
- `brand.nav`: `#111111`
- `brand.text`: `#FFFFFF`
- `brand.secondary`: `#A0A0A0`
- `brand.muted`: `#666666`
- `brand.accent`: `#B06EF5`
- `brand.rating`: `#FFD700`
- `brand.new`: `#22C55E`
- `brand.hot`: `#EF4444`
- `brand.completed`: `#3B82F6`

## Deployment

Deploy to Vercel with a managed Postgres provider such as Supabase or Neon. Add the variables above in the Vercel project settings, run Prisma migrations against production, and configure Google OAuth redirect URLs for `/api/auth/callback/google`.
