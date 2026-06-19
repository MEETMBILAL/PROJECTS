# Asura Scans Clone

A pixel-perfect, fully functional clone of [Asura Scans](https://asurascans.com) — a manga/manhwa/manhua reading platform built with Next.js 14, Tailwind CSS, Prisma, and NextAuth.

![Asura Scans Clone](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss)

## Features

- **Home Page** — Hero banner slider, Trending Today, Latest Updates, New Titles, Completed Series
- **Browse** — Genre/status/type filters, sort options, infinite scroll, active filter chips
- **Comic Detail** — Cover, metadata, ratings, bookmarks, expandable synopsis, virtualized chapter list
- **Chapter Reader** — Minimal dark UI, lazy-loaded pages, keyboard navigation, reader settings
- **Bookmarks** — Auth-required saved comics with unread badges
- **Leaderboard** — Weekly/Monthly/All-time ranked comics
- **Search** — Debounced instant search with overlay and dedicated results page
- **Auth** — Email/password + Google OAuth via NextAuth.js

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS with custom brand theme |
| UI | shadcn/ui (Radix primitives) |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js |
| State | Zustand |
| Search | MeiliSearch (with Prisma fallback) |
| Cache | Upstash Redis (optional) |
| Images | Next/Image + Cloudinary/UploadThing ready |

## Project Structure

```
asura-scans/
├── prisma/
│   ├── schema.prisma      # Full database schema
│   └── seed.ts            # 50 comics, chapters, users
├── src/
│   ├── app/
│   │   ├── (site)/        # Main pages with navbar/footer
│   │   ├── (reader)/      # Minimal chapter reader layout
│   │   └── api/           # REST API route handlers
│   ├── components/        # UI + feature components
│   ├── lib/               # Prisma, auth, redis, search, data
│   ├── store/             # Zustand stores
│   └── types/             # TypeScript interfaces
├── tailwind.config.ts     # Brand color system
└── .env.example
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (local, [Neon](https://neon.tech), or [Supabase](https://supabase.com))

### 1. Install dependencies

```bash
cd asura-scans
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/asura_scans"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"  # openssl rand -base64 32
```

### 3. Set up the database

```bash
npm run db:push      # Push schema to database
npm run db:seed      # Seed 50 comics + test users
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Test Accounts

| Email | Password |
|-------|----------|
| test@asura.com | password123 |
| admin@asura.com | password123 |
| reader@asura.com | password123 |

## Optional Services

### MeiliSearch (enhanced search)

```bash
docker run -d -p 7700:7700 getmeili/meilisearch
```

Set `MEILISEARCH_HOST` and `MEILISEARCH_API_KEY` in `.env`.

### Upstash Redis (caching)

Create a free database at [upstash.com](https://upstash.com) and set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.

### Google OAuth

1. Create credentials in [Google Cloud Console](https://console.cloud.google.com)
2. Set authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
3. Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to `.env`

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/comics` | List comics with filters & pagination |
| GET | `/api/comics/[slug]` | Single comic detail |
| GET | `/api/comics/[slug]/chapters` | Chapter list |
| GET | `/api/chapters/[id]/pages` | Reader page images |
| GET/POST | `/api/bookmarks` | List/create bookmarks |
| DELETE | `/api/bookmarks/[id]` | Remove bookmark |
| GET | `/api/trending` | Top 10 trending |
| GET | `/api/latest` | Latest updated comics |
| GET | `/api/search?q=` | Search comics |
| POST | `/api/ratings` | Submit star rating |
| POST | `/api/views` | Increment view count |
| GET | `/api/leaderboard` | Ranked comics |

## Deploy to Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables from `.env.example`
4. Connect a Neon/Supabase PostgreSQL database
5. Deploy — run `npm run db:push && npm run db:seed` via Vercel CLI or CI

## Color System

| Token | Value | Usage |
|-------|-------|-------|
| `brand-purple` | `#913FE2` | Primary brand, CTAs |
| `brand-dark` | `#0F0F0F` | Page background |
| `brand-card` | `#1A1A1A` | Card backgrounds |
| `brand-nav` | `#111111` | Navbar |
| `brand-gold` | `#FFD700` | Star ratings |

All colors are configured in `tailwind.config.ts` under the `brand` key.

## License

This project is for educational purposes only. Asura Scans is a trademark of its respective owners.
