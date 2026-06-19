# Asura Scans Clone

A pixel-perfect, fully functional clone of [Asura Scans](https://asurascans.com) — a manga/manhwa reading platform built with Next.js 14, Tailwind CSS, Prisma, and NextAuth.

![Theme Color](https://img.shields.io/badge/theme-%23913FE2-purple)

## Features

- **Home** — Hero banner slider, Trending Today, Latest Updates, New Titles, Completed Series
- **Browse** — Multi-filter (genre, status, type), sort options, infinite scroll
- **Comic Detail** — Cover, metadata, ratings, bookmarks, chapter list with virtualization
- **Chapter Reader** — Lazy-loaded images, keyboard navigation, reading settings
- **Bookmarks** — Auth-required saved comics with unread badges
- **Leaderboard** — Weekly / Monthly / All-time rankings
- **Search** — Debounced instant search (MeiliSearch or Prisma fallback)
- **Auth** — Email/password + Google OAuth via NextAuth.js

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js |
| State | Zustand |
| Search | MeiliSearch (optional) |
| Cache | Upstash Redis (optional) |
| Images | Picsum placeholders (swap for Cloudinary/uploadthing) |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database ([Neon](https://neon.tech) or [Supabase](https://supabase.com) recommended)

### 1. Clone & Install

```bash
cd asura-scans
npm install
```

### 2. Environment

```bash
cp .env.example .env
```

Edit `.env` with your database URL and secrets:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
```

### 3. Database Setup

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo Credentials

| Email | Password |
|-------|----------|
| demo@asurascans.com | password123 |
| reader@asurascans.com | password123 |

## Project Structure

```
asura-scans/
├── app/
│   ├── api/                  # Route handlers
│   ├── browse/               # Browse page with filters
│   ├── bookmarks/            # User bookmarks (auth)
│   ├── comics/[slug]/        # Comic detail + chapter reader
│   ├── leaderboard/          # Rankings
│   ├── login/                # Auth page
│   └── search/               # Search results
├── components/
│   ├── comics/               # ComicCard, ChapterList, etc.
│   ├── home/                 # HeroBanner, TrendingRow
│   ├── layout/               # Navbar, Footer
│   ├── reader/               # Reader controls
│   └── ui/                   # shadcn/ui components
├── lib/                      # Prisma, auth, comics service
├── prisma/
│   ├── schema.prisma         # Full database schema
│   └── seed.ts               # 50 comics, chapters, users
├── stores/                   # Zustand stores
└── types/                    # TypeScript types
```

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/comics` | List with filters & pagination |
| GET | `/api/comics/[slug]` | Single comic detail |
| GET | `/api/comics/[slug]/chapters` | Chapter list or single chapter |
| GET | `/api/chapters/[id]/pages` | Reader page images |
| POST | `/api/bookmarks` | Add bookmark |
| DELETE | `/api/bookmarks/[id]` | Remove bookmark |
| GET | `/api/trending` | Top 10 trending |
| GET | `/api/latest` | Latest updated comics |
| GET | `/api/search?q=` | Search comics |
| POST | `/api/ratings` | Submit star rating |
| POST | `/api/views` | Increment view count |

## Color System

All brand colors are defined in `tailwind.config.ts` under the `brand` key:

| Token | Value |
|-------|-------|
| Primary purple | `#913FE2` |
| Dark background | `#0F0F0F` |
| Card background | `#1A1A1A` |
| Surface/border | `#2A2A2A` |
| Text secondary | `#A0A0A0` |
| Rating gold | `#FFD700` |

## Deployment (Vercel)

1. Push to GitHub and import to [Vercel](https://vercel.com)
2. Add environment variables from `.env.example`
3. Connect a Neon/Supabase PostgreSQL database
4. Run migrations: `npx prisma migrate deploy`
5. Seed production (optional): `npx prisma db seed`

## Optional Integrations

### MeiliSearch
Set `MEILISEARCH_HOST` and `MEILISEARCH_API_KEY` for full-text search. Falls back to Prisma `contains` queries when not configured.

### Upstash Redis
Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` for trending/latest caching.

### Google OAuth
Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` from Google Cloud Console.

## License

Educational clone — not affiliated with Asura Scans. For learning purposes only.
