# Asura Scans — Manga / Manhwa Reading Platform

A pixel-perfect, full-stack clone of [asurascans.com](https://asurascans.com), built with the
modern Next.js App Router stack. It ships with a complete reading experience: a featured hero
slider, trending / latest / new / completed rails, a filterable browse library, comic detail pages,
an immersive chapter reader, bookmarks, a leaderboard, and instant search.

> **Runs out of the box with zero configuration.** When no database is configured the app serves a
> rich, deterministic mock dataset (50 comics, thousands of chapters) so every page renders fully.
> Point it at a PostgreSQL database and run the seed to switch to real persistence.

## ✨ Tech Stack

| Concern          | Choice                                              |
| ---------------- | --------------------------------------------------- |
| Framework        | Next.js 14 (App Router, TypeScript)                 |
| Styling          | Tailwind CSS with a custom `brand` theme            |
| UI components    | shadcn/ui (Radix primitives)                        |
| Database / ORM   | PostgreSQL + Prisma                                  |
| Auth             | NextAuth.js (Credentials + Google OAuth)            |
| Client state     | Zustand (bookmarks, reader settings) with persist   |
| Virtualization   | @tanstack/react-virtual (chapter lists)             |
| Dates            | date-fns (relative timestamps)                      |
| Deploy           | Vercel + Supabase / Neon                            |

Optional integrations are wired via environment variables and degrade gracefully when absent:
Cloudinary / UploadThing (image storage), Algolia / MeiliSearch (search), Upstash Redis (cache).

## 🎨 Color System

The exact AsuraScans palette is defined under the `brand` key in
[`tailwind.config.ts`](./tailwind.config.ts):

| Token                   | Hex       |
| ----------------------- | --------- |
| `brand-purple`          | `#913FE2` |
| `brand-purple-light`    | `#B06EF5` |
| `brand-bg`              | `#0F0F0F` |
| `brand-card`            | `#1A1A1A` |
| `brand-card-hover`      | `#222222` |
| `brand-surface`         | `#2A2A2A` |
| `brand-nav`             | `#111111` |
| `brand-text`            | `#FFFFFF` |
| `brand-text-secondary`  | `#A0A0A0` |
| `brand-text-muted`      | `#666666` |
| `brand-gold` (rating)   | `#FFD700` |
| `brand-new` (badge)     | `#22C55E` |
| `brand-hot` (badge)     | `#EF4444` |
| `brand-completed`       | `#3B82F6` |

## 📁 Project Structure

```
asura-scans/
├─ prisma/
│  ├─ schema.prisma          # Full data model (User, Comic, Chapter, ...)
│  └─ seed.ts                # Seeds 50 comics, chapters, pages, test users
├─ public/
│  └─ favicon.svg
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx          # Root layout (Inter font, providers, chrome)
│  │  ├─ globals.css         # Dark theme, scrollbars, section accents
│  │  ├─ page.tsx            # Home (hero + trending/latest/new/completed)
│  │  ├─ browse/             # Filterable, infinite-scroll library
│  │  ├─ comics/[slug]/      # Comic detail
│  │  │  └─ chapter/[num]/   # Immersive reader
│  │  ├─ bookmarks/          # Saved comics (auth-aware)
│  │  ├─ leaderboard/        # Weekly / Monthly / All-time
│  │  ├─ search/             # Debounced instant search
│  │  ├─ login/              # Auth (email/password + Google)
│  │  └─ api/                # Route handlers (see below)
│  ├─ components/
│  │  ├─ ui/                 # shadcn/ui primitives
│  │  ├─ layout/             # Navbar, Footer, Logo, UserMenu, SiteShell
│  │  ├─ comic/              # ComicCard, ComicGrid, ChapterList, Rating, ...
│  │  ├─ home/               # HeroSlider
│  │  ├─ browse/             # FilterBar
│  │  ├─ leaderboard/        # LeaderboardTabs
│  │  ├─ reader/             # Reader
│  │  └─ search/             # SearchOverlay
│  ├─ lib/                   # data layer, prisma, auth, mock data, utils
│  ├─ store/                 # Zustand stores (bookmarks, reader)
│  └─ types/                 # next-auth type augmentation
├─ .env.example
├─ tailwind.config.ts
└─ package.json
```

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment (optional for demo)

```bash
cp .env.example .env
```

The app works immediately without a database (mock data). To enable persistence, set `DATABASE_URL`
(and `DIRECT_URL`) to a PostgreSQL instance, and add `NEXTAUTH_SECRET`.

### 3. Set up the database (optional)

```bash
npm run db:push     # create tables from the Prisma schema
npm run db:seed     # populate 50 comics, chapters, pages, and test users
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 🔐 Demo Account

- **Email:** `demo@asurascans.com`
- **Password:** `demo1234`

This account works in demo mode (no DB) and is also created by the seed script.

## 🛣️ API Routes

| Method   | Route                          | Description                          |
| -------- | ------------------------------ | ------------------------------------ |
| `GET`    | `/api/comics`                  | List with filters & pagination       |
| `GET`    | `/api/comics/[slug]`           | Single comic detail                  |
| `GET`    | `/api/comics/[slug]/chapters`  | Chapter list                         |
| `GET`    | `/api/chapters/[id]/pages`     | Page image URLs for the reader       |
| `GET`    | `/api/trending`                | Top trending comics                  |
| `GET`    | `/api/latest`                  | Latest updated comics                |
| `GET`    | `/api/search?q=`               | Search comics                        |
| `GET`    | `/api/leaderboard?period=`     | Leaderboard by period                |
| `GET`    | `/api/genres`                  | All genres                           |
| `POST`   | `/api/bookmarks`               | Add bookmark (auth)                  |
| `DELETE` | `/api/bookmarks/[id]`          | Remove bookmark (auth)               |
| `POST`   | `/api/ratings`                 | Submit a star rating (auth)          |
| `POST`   | `/api/views`                   | Increment view count                 |
| `POST`   | `/api/register`                | Create an account                    |
| `*`      | `/api/auth/[...nextauth]`      | NextAuth handlers                    |

## ⌨️ Keyboard Shortcuts

- `⌘/Ctrl + K` — open search
- `←` / `→` — previous / next chapter (in the reader)

## 📦 Scripts

| Script              | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start the dev server                 |
| `npm run build`     | Production build (runs `prisma generate`) |
| `npm run start`     | Start the production server          |
| `npm run lint`      | Lint                                 |
| `npm run typecheck` | Type-check with `tsc`                |
| `npm run db:push`   | Push the Prisma schema               |
| `npm run db:seed`   | Seed the database                    |
| `npm run db:studio` | Open Prisma Studio                   |

## ☁️ Deploying to Vercel

1. Push this repo to GitHub and import it into Vercel.
2. Provision a PostgreSQL database (Supabase or Neon) and set `DATABASE_URL` / `DIRECT_URL`.
3. Set `NEXTAUTH_SECRET` and `NEXTAUTH_URL`, plus any optional integration keys.
4. Deploy. Run `npm run db:push && npm run db:seed` against the production database once.

## 📝 Notes

This is a non-commercial, educational clone built to demonstrate full-stack engineering. All comic
covers/pages are randomized placeholder images (picsum.photos); no copyrighted content is bundled.
