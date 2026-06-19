# Asura Scans — Clone

A pixel-perfect, full-stack **manga / manhwa / manhua reading platform** inspired by the design language of asurascans.com. Built as a production-quality reference app with Next.js 14 (App Router), Prisma, NextAuth, Tailwind CSS and shadcn/ui.

> ⚠️ **Disclaimer:** This is an educational clone. All series titles, synopses and cover/page images are **original fictional placeholders** (covers/pages are generated via [picsum.photos](https://picsum.photos)). No copyrighted content is bundled or reproduced.

---

## ✨ Features

- **Home** — auto-rotating hero carousel, Trending Today (ranked), Latest Updates (with per-chapter timestamps), New Titles & Completed Series sections.
- **Browse** — genre multi-select, status / type / sort filters, active filter chips, and infinite-scroll + load-more pagination.
- **Comic detail** — cover, metadata, interactive star rating, bookmarks, share, expandable synopsis, searchable/sortable/paginated chapter list, related comics.
- **Chapter reader** — immersive dark UI, long-strip & paginated modes, chapter selector, prev/next, keyboard shortcuts (`←` / `→`), reading-progress bar, and a settings panel (mode, image quality, background, page width).
- **Bookmarks** (auth) — grid with unread-count badges, last-read vs latest chapter, optimistic remove, empty state.
- **Leaderboard** — Weekly / Monthly / All-time tabs with rank-change indicators.
- **Search** — debounced (300ms) full-screen overlay search + dedicated `/search` page.
- **Auth** — email/password (credentials) + optional Google OAuth via NextAuth.
- Dark-mode only, fully responsive, accessible (aria labels, keyboard nav), skeleton/loading states everywhere.

## 🧱 Tech stack

| Concern        | Choice                                            |
| -------------- | ------------------------------------------------- |
| Framework      | Next.js 14 (App Router, TypeScript)               |
| Styling        | Tailwind CSS (custom `brand` theme) + shadcn/ui   |
| Database / ORM | PostgreSQL + Prisma                               |
| Auth           | NextAuth.js (Credentials + Google)                |
| Client state   | Zustand                                           |
| Dates          | date-fns                                          |
| Icons          | lucide-react                                      |

> The spec also calls for Cloudinary/uploadthing, Algolia/MeiliSearch and Upstash Redis. These are **optional**: the app ships working fallbacks (picsum images, Prisma-backed search, no external cache) and `.env.example` documents the variables so you can plug them in without code changes.

## 🎨 Color system

The exact brand palette lives under the `brand` key in [`tailwind.config.ts`](./tailwind.config.ts):

```
purple #913FE2 · purple-light #B06EF5 · bg #0F0F0F · card #1A1A1A · card-hover #222222
surface #2A2A2A · nav #111111 · text #FFFFFF · text-secondary #A0A0A0 · text-muted #666666
gold #FFD700 · new #22C55E · hot #EF4444 · completed #3B82F6
```

## 🚀 Getting started

### 1. Prerequisites

- Node.js 18.18+ (20+ recommended)
- A PostgreSQL database (local, [Supabase](https://supabase.com) or [Neon](https://neon.tech))

### 2. Install

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Set at minimum:

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/asurascans?schema=public"
NEXTAUTH_SECRET="<openssl rand -base64 32>"
NEXTAUTH_URL="http://localhost:3000"
```

Google OAuth and the other integrations are optional.

### 4. Set up the database & seed

```bash
npm run db:push    # create tables from the Prisma schema
npm run db:seed    # 50 comics, chapters, genres + test users
```

### 5. Run

```bash
npm run dev
```

Open <http://localhost:3000>.

**Demo login:** `reader@asura.dev` / `password123`

## 📜 Scripts

| Script             | Description                          |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Start the dev server                 |
| `npm run build`    | Generate Prisma client + build       |
| `npm run start`    | Start the production server          |
| `npm run lint`     | Run ESLint                           |
| `npm run db:push`  | Push the Prisma schema to the DB     |
| `npm run db:seed`  | Seed sample data                     |
| `npm run db:studio`| Open Prisma Studio                   |

## 🗂️ Project structure

```
asura-scans-clone/
├── prisma/
│   ├── schema.prisma          # User, Comic, Chapter, ChapterPage, Genre, ComicGenre,
│   │                          # Bookmark, Rating, View, Comment (+ NextAuth models)
│   └── seed.ts                # 50 fictional comics + chapters/pages + users
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout (Inter font, providers, chrome)
│   │   ├── page.tsx           # Home
│   │   ├── browse/            # Browse + filters
│   │   ├── comics/[slug]/     # Detail + /chapter/[num] reader
│   │   ├── bookmarks/         # Auth-gated bookmarks
│   │   ├── leaderboard/       # Tabbed leaderboard
│   │   ├── search/            # Search page
│   │   ├── login/             # Auth
│   │   └── api/               # Route handlers (comics, chapters, bookmarks,
│   │                          # trending, latest, search, ratings, views, leaderboard, auth)
│   ├── components/
│   │   ├── ui/                # shadcn/ui primitives
│   │   ├── comics/            # ComicCard, ComicGrid, RatingStars, BookmarkButton, ChapterList…
│   │   ├── home/              # HeroCarousel, TrendingRow
│   │   ├── browse/            # FilterBar, InfiniteComicGrid
│   │   ├── reader/            # ChapterReader
│   │   ├── search/            # SearchModal, SearchResults
│   │   ├── leaderboard/, bookmarks/, auth/, layout/
│   ├── lib/                   # db, auth, queries, serializers, utils, constants, bookmarks
│   ├── store/                 # Zustand stores (reader, ui, bookmark)
│   └── types/                 # Shared types + next-auth augmentation
├── tailwind.config.ts         # Full custom theme
└── .env.example
```

## 🔌 API routes

| Method   | Route                          | Purpose                          |
| -------- | ------------------------------ | -------------------------------- |
| `GET`    | `/api/comics`                  | List with filters & pagination   |
| `GET`    | `/api/comics/[slug]`           | Single comic detail              |
| `GET`    | `/api/comics/[slug]/chapters`  | Chapter list                     |
| `GET`    | `/api/chapters/[id]/pages`     | Reader page image URLs           |
| `POST`   | `/api/bookmarks`               | Add / update bookmark            |
| `DELETE` | `/api/bookmarks/[id]`          | Remove bookmark (by comic/bm id) |
| `GET`    | `/api/trending`                | Top trending                     |
| `GET`    | `/api/latest`                  | Latest updates                   |
| `GET`    | `/api/search?q=`               | Search comics                    |
| `POST`   | `/api/ratings`                 | Submit star rating               |
| `POST`   | `/api/views`                   | Increment view count             |
| `GET`    | `/api/leaderboard?period=`     | Ranked leaderboard               |

## ☁️ Deployment (Vercel + Supabase/Neon)

1. Create a Postgres database on Supabase or Neon and copy its connection string.
2. Import the repo into Vercel.
3. Add the env vars from `.env.example` in the Vercel project settings.
4. The `build` script runs `prisma generate` automatically. Run `npm run db:push && npm run db:seed` once against your production database (locally with the prod `DATABASE_URL`, or via a one-off job).

## 📄 License

For educational/demo use only.
