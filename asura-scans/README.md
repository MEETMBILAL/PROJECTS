# Asura Scans Clone

A pixel-perfect, fully functional clone of [Asura Scans](https://asurascans.com) — a manga/manhwa/manhua reading platform built with Next.js 14, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.

![Asura Scans Clone](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css)

## Features

- **Home Page** — Hero banner slider, Trending Today, Latest Updates, New Titles, Completed Series
- **Browse** — Multi-filter (genre, status, type), sort options, infinite scroll pagination
- **Comic Detail** — Full metadata, bookmarking, chapter list with search/sort
- **Chapter Reader** — Long-strip/paginated modes, keyboard navigation, reader settings
- **Bookmarks** — Auth-required saved comics with unread badges
- **Leaderboard** — Weekly/Monthly/All-time popular comics
- **Search** — Debounced instant search (MeiliSearch + Prisma fallback)
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
| Search | MeiliSearch (optional) |
| Cache | Upstash Redis (optional) |
| Deploy | Vercel + Supabase/Neon |

## Project Structure

```
asura-scans/
├── prisma/
│   ├── schema.prisma       # Full database schema
│   └── seed.ts             # 50 comics, chapters, genres, users
├── src/
│   ├── app/
│   │   ├── (main)/         # Pages with navbar/footer
│   │   ├── (reader)/       # Minimal chapter reader layout
│   │   └── api/            # REST API route handlers
│   ├── components/
│   │   ├── comics/         # ComicCard, HeroBanner, ChapterList, etc.
│   │   ├── layout/         # Navbar, Footer
│   │   ├── reader/         # Reader UI components
│   │   ├── search/         # SearchOverlay
│   │   └── ui/             # shadcn/ui primitives
│   ├── lib/                # Prisma, auth, comics service, redis
│   └── stores/             # Zustand stores
├── tailwind.config.ts      # Brand color system
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

Edit `.env` with your database URL and secrets:

```env
DATABASE_URL="postgresql://user:password@host:5432/asura_scans"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret"
```

Generate a secret:
```bash
openssl rand -base64 32
```

### 3. Set up the database

```bash
npm run db:push
npm run db:generate
npm run db:seed
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo Account

```
Email: demo@asura.com
Password: password123
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
| GET | `/api/leaderboard` | Popular comics leaderboard |

## Color System

| Token | Value | Usage |
|-------|-------|-------|
| `brand-purple` | `#913FE2` | Primary brand, CTAs |
| `brand-dark` | `#0F0F0F` | Page background |
| `brand-card` | `#1A1A1A` | Card backgrounds |
| `brand-nav` | `#111111` | Navbar background |
| `brand-gold` | `#FFD700` | Star ratings |
| `brand-badge-new` | `#22C55E` | NEW badge |
| `brand-badge-hot` | `#EF4444` | HOT badge |
| `brand-badge-completed` | `#3B82F6` | END badge |

## Optional Services

### MeiliSearch (Enhanced Search)

```bash
# Docker
docker run -d -p 7700:7700 getmeili/meilisearch:latest
```

Add to `.env`:
```env
MEILISEARCH_HOST="http://localhost:7700"
MEILISEARCH_API_KEY="your-master-key"
```

### Upstash Redis (Caching)

Sign up at [upstash.com](https://upstash.com) and add credentials to `.env`.

### Google OAuth

1. Create a project in [Google Cloud Console](https://console.cloud.google.com)
2. Enable Google+ API and create OAuth credentials
3. Add `http://localhost:3000/api/auth/callback/google` as redirect URI
4. Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to `.env`

## Deployment (Vercel)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set root directory to `asura-scans`
4. Add environment variables from `.env.example`
5. Connect a Neon/Supabase PostgreSQL database
6. Deploy

```bash
# Run migrations on deploy
npx prisma db push
npm run db:seed
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed sample data |
| `npm run db:studio` | Open Prisma Studio |

## License

This project is for educational purposes only. Asura Scans is a trademark of its respective owners.
