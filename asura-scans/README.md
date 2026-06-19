# Asura Scans Clone

A pixel-perfect, fully functional clone of [Asura Scans](https://asurascans.com) — a manga/manhwa/manhua reading platform built with Next.js 14, TypeScript, Tailwind CSS, Prisma, and NextAuth.js.

![Asura Scans Clone](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)

## Features

- **Home Page** — Hero banner slider, Trending Today, Latest Updates, New Titles, Completed Series
- **Browse** — Multi-filter (genre, status, type), sort options, infinite scroll pagination
- **Comic Detail** — Full metadata, bookmark/rating, virtualized chapter list, related comics
- **Chapter Reader** — Lazy-loaded images, keyboard navigation, reading settings panel
- **Bookmarks** — Auth-required reading list with unread badges
- **Leaderboard** — Weekly/Monthly/All-time rankings
- **Search** — Debounced instant search with overlay and dedicated results page
- **Auth** — Email/password + Google OAuth via NextAuth.js

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js |
| State | Zustand |
| Search | MeiliSearch (with DB fallback) |
| Caching | Upstash Redis |
| Images | Uploadthing / Cloudinary / Picsum (seed) |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database ([Neon](https://neon.tech), [Supabase](https://supabase.com), or local)
- (Optional) Upstash Redis, MeiliSearch

### Installation

```bash
# Clone and enter project
cd asura-scans

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your database URL and secrets

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Seed the database (50 comics, chapters, test users)
npx prisma db seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Test Accounts

| Email | Password |
|-------|----------|
| test@asura.com | password123 |
| admin@asura.com | password123 |
| reader@asura.com | password123 |

## Project Structure

```
asura-scans/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed script (50 comics)
├── src/
│   ├── app/               # Next.js App Router pages & API
│   │   ├── api/           # REST API route handlers
│   │   ├── browse/        # Browse page with filters
│   │   ├── bookmarks/     # User bookmarks (auth)
│   │   ├── comics/        # Comic detail & chapter reader
│   │   ├── leaderboard/   # Rankings page
│   │   ├── search/        # Search results
│   │   └── auth/          # Sign in / Register
│   ├── components/
│   │   ├── ui/            # shadcn/ui primitives
│   │   ├── layout/        # Navbar, Footer
│   │   ├── comics/        # ComicCard, ChapterList, etc.
│   │   ├── home/          # HeroBanner
│   │   ├── browse/        # Filters, ComicGrid
│   │   ├── reader/        # Reader controls
│   │   └── search/        # SearchOverlay
│   ├── lib/               # Utilities, Prisma, Auth, Redis
│   ├── store/             # Zustand stores
│   └── types/             # TypeScript types
├── tailwind.config.ts     # Brand color system
├── .env.example
└── README.md
```

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/comics` | List comics with filters & pagination |
| GET | `/api/comics/[slug]` | Single comic detail |
| GET | `/api/comics/[slug]/chapters` | Chapter list |
| GET | `/api/chapters/[id]/pages` | Chapter page images |
| POST | `/api/bookmarks` | Add bookmark |
| DELETE | `/api/bookmarks/[id]` | Remove bookmark |
| GET | `/api/trending` | Top 10 trending |
| GET | `/api/latest` | Latest updated comics |
| GET | `/api/search?q=` | Search comics |
| POST | `/api/ratings` | Submit star rating |
| POST | `/api/views` | Increment view count |
| GET | `/api/leaderboard` | Leaderboard data |

## Color System

| Token | Value | Usage |
|-------|-------|-------|
| `brand-purple` | `#913FE2` | Primary brand, CTAs |
| `brand-dark` | `#0F0F0F` | Page background |
| `brand-card` | `#1A1A1A` | Card backgrounds |
| `brand-surface` | `#2A2A2A` | Borders, dividers |
| `brand-gold` | `#FFD700` | Star ratings |
| `brand-new` | `#22C55E` | NEW badges |
| `brand-hot` | `#EF4444` | HOT badges |
| `brand-completed` | `#3B82F6` | END badges |

## Deployment

### Vercel + Neon/Supabase

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Set environment variables from `.env.example`
4. Run `npx prisma db push` against production DB
5. Run seed: `npx prisma db seed`

### Optional Services

- **Upstash Redis** — Enable response caching for trending/latest endpoints
- **MeiliSearch** — Faster full-text search (auto-falls back to PostgreSQL)
- **Uploadthing** — User-uploaded cover images

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npx prisma studio    # Database GUI
npx prisma db seed   # Seed database
```

## License

This project is for educational purposes only. Asura Scans is a trademark of its respective owners.
