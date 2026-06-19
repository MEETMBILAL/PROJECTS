# Asura Scans Clone

A production-quality, full-stack **manga / manhwa / manhua reading platform** built as a faithful
functional clone of a modern scanlation reader. Dark-mode only, blazing fast, fully responsive and
accessible.

> All sample comics, covers and chapter pages are **randomly generated placeholder content**
> (via `picsum.photos`). No copyrighted works are hosted or distributed — this is an educational
> demonstration project.

## ✨ Features

- **Home** — auto-rotating hero slider, Trending Today (ranked), Latest Updates (with last 3
  chapters + relative timestamps), New Titles, Completed Series.
- **Browse** — genre multi-select, status / type / sort filters, active filter chips, and
  infinite-scroll + load-more grid.
- **Comic detail** — cover, metadata, interactive star rating, bookmark, synopsis (show more),
  filterable/sortable/paginated chapter list, related comics.
- **Reader** — minimal black UI, top/bottom bars, chapter selector, prev/next, keyboard shortcuts
  (← →), long-strip & paginated modes, settings panel (quality, background, width), progress bar,
  lazy-loaded images.
- **Bookmarks** (auth) — unread-count badges, last-read vs latest, hover remove, empty state.
- **Leaderboard** — Weekly / Monthly / All-time tabs with rank-change indicators.
- **Search** — instant debounced (300ms) overlay (⌘/Ctrl + K) and a full results page.
- **Auth** — NextAuth.js credentials (bcrypt) + optional Google OAuth.

## 🧱 Tech Stack

| Area        | Choice                                            |
| ----------- | ------------------------------------------------- |
| Framework   | Next.js 14 (App Router, TypeScript, RSC)          |
| Styling     | Tailwind CSS (custom `brand` theme) + shadcn/ui   |
| Database    | PostgreSQL + Prisma ORM                           |
| Auth        | NextAuth.js (Credentials + Google)                |
| State       | Zustand (reader settings, optimistic bookmarks)   |
| Caching     | Upstash Redis (graceful in-memory fallback)       |
| Images      | next/image (Cloudinary / UploadThing ready)       |
| Search      | DB search (Algolia / MeiliSearch ready)           |
| Deploy      | Vercel + Supabase / Neon                          |

## 🎨 Color System

Defined under `theme.extend.colors.brand` in `tailwind.config.ts`:

| Token | Hex |
| ----- | --- |
| `brand-purple` | `#913FE2` |
| `brand-purple-light` | `#B06EF5` |
| `brand-bg` | `#0F0F0F` |
| `brand-card` | `#1A1A1A` |
| `brand-card-hover` | `#222222` |
| `brand-surface` | `#2A2A2A` |
| `brand-nav` | `#111111` |
| `brand-text` | `#FFFFFF` |
| `brand-text-secondary` | `#A0A0A0` |
| `brand-text-muted` | `#666666` |
| `brand-gold` | `#FFD700` |
| `brand-new` | `#22C55E` |
| `brand-hot` | `#EF4444` |
| `brand-completed` | `#3B82F6` |

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 18.18+ (Node 20+ recommended)
- A PostgreSQL database (local Docker, [Supabase](https://supabase.com) or [Neon](https://neon.tech))

### 2. Install

```bash
npm install
```

### 3. Environment

```bash
cp .env.example .env
```

Set at least `DATABASE_URL` and `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`).
Google OAuth, Cloudinary/UploadThing, Upstash and search keys are all optional — the app boots
without them.

### 4. Database

```bash
npm run prisma:generate     # generate Prisma client
npm run prisma:push         # push schema (or: npm run prisma:migrate)
npm run db:seed             # seed 50 comics, chapters, genres, demo users
```

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo accounts

| Email | Password |
| ----- | -------- |
| `demo@asura.test` | `password123` |
| `admin@asura.test` | `password123` |

## 🗂️ Project Structure

```
prisma/
  schema.prisma            # User, Comic, Chapter, ChapterPage, Genre, ComicGenre,
                           # Bookmark, Rating, View, Comment (+ NextAuth models)
  seed.ts                  # reproducible seed (50 comics, 5-200 chapters each)
src/
  app/
    layout.tsx             # root layout (Inter font, Navbar, Footer, providers)
    page.tsx               # Home
    browse/                # Browse + filters
    comics/[slug]/         # Comic detail
    comics/[slug]/chapter/[num]/   # Reader
    bookmarks/             # Bookmarks (auth)
    leaderboard/           # Leaderboard
    search/                # Search results
    login/ register/       # Auth
    about/ privacy/ dmca/  # Static
    api/                   # Route handlers (see below)
  components/
    ui/                    # shadcn-style primitives
    comic/                 # ComicCard, ComicGrid, HeroSlider, ChapterList, RatingStars, …
    layout/                # Navbar, Footer, Logo
    search/ browse/ bookmarks/ leaderboard/ reader/ auth/
  lib/                     # prisma, auth, comics (data access), redis cache, utils, types
  store/                   # Zustand stores (reader settings, bookmarks)
```

## 🔌 API Routes

| Method | Route | Description |
| ------ | ----- | ----------- |
| GET | `/api/comics` | List with filters & pagination |
| GET | `/api/comics/[slug]` | Single comic detail |
| GET | `/api/comics/[slug]/chapters` | Chapter list |
| GET | `/api/chapters/[id]/pages` | Page image URLs for the reader |
| POST | `/api/bookmarks` | Add / update bookmark (auth) |
| DELETE | `/api/bookmarks/[id]` | Remove bookmark by comic or bookmark id (auth) |
| GET | `/api/trending` | Top trending comics |
| GET | `/api/latest` | Latest updated comics |
| GET | `/api/search?q=` | Search comics |
| POST | `/api/ratings` | Submit a 1-10 rating (auth) |
| POST | `/api/views` | Increment view count |
| POST | `/api/register` | Create a credentials account |
| * | `/api/auth/[...nextauth]` | NextAuth handler |

## 📦 Deployment

1. Push to GitHub and import into **Vercel**.
2. Provision a PostgreSQL database (Supabase/Neon) and set `DATABASE_URL`.
3. Set `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, and any optional provider keys in Vercel env vars.
4. The `build` script runs `prisma generate` automatically. Run `prisma migrate deploy` and the
   seed against your production DB as needed.

## 📜 Scripts

| Script | Purpose |
| ------ | ------- |
| `npm run dev` | Start dev server |
| `npm run build` | Production build (`prisma generate` + `next build`) |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run prisma:push` | Push schema to DB |
| `npm run db:seed` | Seed sample data |

## ⚖️ License & Disclaimer

For educational/demo use. Sample content is fictional and procedurally generated. Do not use this
project to host or distribute copyrighted material.
