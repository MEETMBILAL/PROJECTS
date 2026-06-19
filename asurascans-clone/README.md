# Asura Scans Clone

A pixel-perfect, full-stack **manga / manhwa / manhua reading platform** inspired by the design and feature set of asurascans.com — built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, **Prisma + PostgreSQL**, and **NextAuth.js**.

> ⚠️ **Educational project / not affiliated.** All comic titles, authors, synopses, covers and page images shown are **randomly generated, original placeholder data** (covers/pages use the [picsum.photos](https://picsum.photos) service). No real, copyrighted manga/manhwa content is reproduced.

---

## ✨ Features

- **Home** — auto-rotating hero slider, Trending Today (ranked), Latest Updates (with recent chapters & relative timestamps), New Titles, Completed Series.
- **Browse** — genre multi-select, status / type filters, sort (Latest / A‑Z / Rating / Views), active filter chips, infinite scroll + load‑more.
- **Comic detail** — cover, alt titles, author/artist, status & type badges, interactive star rating, bookmark, expandable synopsis, filterable + sortable + paginated chapter list, related comics.
- **Chapter reader** — minimal dark UI, long‑strip & paginated modes, chapter selector, prev/next, `←/→` keyboard shortcuts, reading progress bar, settings panel (quality / background), lazy‑loaded images.
- **Bookmarks** (`/bookmarks`) — saved grid with unread‑count badges, last‑read vs latest, remove on hover, empty state.
- **Leaderboard** — Weekly / Monthly / All‑time tabs with rank‑change indicators.
- **Search** — full‑screen overlay (`⌘K` / `Ctrl+K`) and a dedicated `/search` page with 300ms‑debounced instant results.
- **Auth** — NextAuth (email/password + Google OAuth), registration, demo account.
- **API** — typed Route Handlers for comics, chapters, pages, trending, latest, search, bookmarks, ratings, views.
- **Polished UX** — dark‑only theme, exact brand color system, skeleton/loading states, mobile‑responsive, accessible (aria labels, keyboard nav), styled scrollbars, purple focus glow.

## 🎨 Brand color system

Exposed in `tailwind.config.ts` under the `brand` key (e.g. `bg-brand-bg`, `text-brand-purple`):

| Token | Hex |
| --- | --- |
| `brand.purple` | `#913FE2` |
| `brand.purple-light` | `#B06EF5` |
| `brand.bg` | `#0F0F0F` |
| `brand.card` | `#1A1A1A` |
| `brand.card-hover` | `#222222` |
| `brand.surface` / `brand.border` | `#2A2A2A` |
| `brand.nav` | `#111111` |
| `brand.text-secondary` | `#A0A0A0` |
| `brand.text-muted` | `#666666` |
| `brand.gold` | `#FFD700` |
| `brand.new` | `#22C55E` |
| `brand.hot` | `#EF4444` |
| `brand.completed` | `#3B82F6` |

## 🧱 Tech stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 14 (App Router, RSC) + TypeScript |
| Styling | Tailwind CSS + custom theme |
| UI | shadcn/ui (Radix primitives) + lucide-react |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js (Credentials + Google) |
| State | Zustand (bookmarks, reader settings) |
| Caching | Upstash Redis (with in‑memory fallback) |
| Search | DB / in‑memory (Algolia & MeiliSearch env hooks included) |
| Images | Cloudinary / uploadthing ready (placeholder by default) |
| Dates | date-fns |

## 🚀 Getting started

### 1. Install

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

> **Zero‑config demo:** the app **runs out of the box without any database or services.** When `DATABASE_URL` is not configured (or points at the example default), the data layer transparently serves a deterministic in‑memory dataset of 50 comics. You can run the dev server immediately and explore every page.

### 3. Run the dev server

```bash
npm run dev
# http://localhost:3000
```

Sign in with the **demo account**: `demo@asura.dev` / `demo1234`.

## 🗄️ Using a real database (optional)

1. Provision a PostgreSQL database (Supabase, Neon, or local) and set `DATABASE_URL` + `DIRECT_URL` in `.env`.
2. Push the schema and seed it:

```bash
npm run prisma:push     # or: npm run prisma:migrate
npm run db:seed         # 20 genres, 50 comics, chapters, pages, demo users
```

Once a real `DATABASE_URL` is detected, all data access functions and API routes read from Postgres automatically (and fall back to the in‑memory dataset if the DB is unreachable).

### Seed data

`prisma/seed.ts` populates:

- **20 genres** (Action, Fantasy, Romance, Manhwa, System, Regression, Isekai, …)
- **50 comics** with realistic titles/slugs/synopses, **5–200 chapters** each
- Page images for the latest chapters of each comic
- **3 sample users** (`demo@asura.dev`, `alice@asura.dev`, `bob@asura.dev`, password `demo1234`)
- Sample bookmarks for the demo user

## 🔌 API routes

| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/comics` | List with filters & pagination |
| GET | `/api/comics/[slug]` | Single comic detail |
| GET | `/api/comics/[slug]/chapters` | Chapter list (filter/sort/paginate) |
| GET | `/api/chapters/[id]/pages` | Page image URLs for the reader |
| GET | `/api/trending` | Top 10 trending (cached) |
| GET | `/api/latest` | Latest updated comics (cached) |
| GET | `/api/search?q=` | Search comics |
| GET / POST | `/api/bookmarks` | List / add bookmark |
| DELETE | `/api/bookmarks/[id]` | Remove bookmark |
| POST | `/api/ratings` | Submit a 1–10 rating |
| POST | `/api/views` | Increment view count |
| POST | `/api/register` | Email/password sign‑up |
| * | `/api/auth/[...nextauth]` | NextAuth handlers |

## 📁 Project structure

```
asurascans-clone/
├─ prisma/
│  ├─ schema.prisma          # User, Comic, Chapter, ChapterPage, Genre, ComicGenre,
│  │                         # Bookmark, Rating, View, Comment + NextAuth models
│  └─ seed.ts                # Deterministic seed (genres, comics, chapters, users)
├─ public/favicon.svg
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx          # Root layout (Inter font, Navbar, Footer, Toaster)
│  │  ├─ page.tsx            # Home (hero + all sections)
│  │  ├─ globals.css         # Theme tokens, scrollbars, section headings
│  │  ├─ browse/             # Browse + filters
│  │  ├─ comics/[slug]/      # Detail + chapter/[num] reader
│  │  ├─ bookmarks/          # Bookmarks (auth/local)
│  │  ├─ leaderboard/        # Weekly/Monthly/All‑time
│  │  ├─ search/             # Search page
│  │  ├─ login/              # Sign in / register
│  │  └─ api/                # Route handlers (see table above)
│  ├─ components/
│  │  ├─ ui/                 # shadcn/ui primitives
│  │  ├─ comic-card.tsx      # Reusable cover/title/rating/hover card
│  │  ├─ comic-grid.tsx      # Infinite‑scroll grid
│  │  ├─ hero-slider.tsx     # Auto‑sliding featured section
│  │  ├─ chapter-list.tsx    # Filterable / sortable / paginated
│  │  ├─ reader.tsx          # Reader controls + viewer
│  │  ├─ filter-bar.tsx      # Browse filters + chips
│  │  ├─ search-modal.tsx    # ⌘K overlay search
│  │  ├─ bookmark-button.tsx # Optimistic toggle
│  │  ├─ star-rating.tsx, status-badge.tsx, genre-pill.tsx, …
│  │  ├─ navbar.tsx, footer.tsx
│  ├─ lib/
│  │  ├─ data.ts             # DB + in‑memory data access layer
│  │  ├─ mock-data.ts        # Deterministic synthetic dataset generator
│  │  ├─ prisma.ts, redis.ts, auth.ts, types.ts, constants.ts, utils.ts
│  └─ store/                 # Zustand stores (bookmarks, reader)
├─ tailwind.config.ts        # Full custom brand theme
├─ next.config.mjs
└─ .env.example
```

## 📜 Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run build` | `prisma generate` + production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run prisma:push` | Push schema to DB |
| `npm run prisma:migrate` | Create/apply migrations |
| `npm run db:seed` | Seed the database |

## ☁️ Deployment

Deploy to **Vercel** with a **Supabase / Neon** PostgreSQL database:

1. Push this repo and import it into Vercel.
2. Add the environment variables from `.env.example` (at minimum `DATABASE_URL`, `DIRECT_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`).
3. Run `prisma migrate deploy` + `db:seed` against your production database.
4. (Optional) Add Google OAuth, Upstash Redis, and Cloudinary/uploadthing credentials.

## 📄 License

For educational/demo use only. Not affiliated with Asura Scans. Replace all placeholder data before any non‑demo use.
