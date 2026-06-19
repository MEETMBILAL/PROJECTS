# Asura Scans Clone

A dark, responsive manga/manhwa reader platform inspired by Asura Scans. Built with Next.js 14 App Router, TypeScript, Tailwind CSS, shadcn-style components, Prisma/PostgreSQL, NextAuth, Zustand, Upstash Redis, Algolia, and Cloudinary/uploadthing-ready configuration.

## Project structure

```txt
app/
  api/                    Route handlers for comics, chapters, auth, search, ratings, views
  browse/                 Filterable comic browser
  bookmarks/              Auth-gated bookmark library
  comics/[slug]/          Comic detail page
  comics/[slug]/chapter/  Minimal reader UI
  leaderboard/            Weekly/monthly/all-time rankings
  search/                 Debounced instant search page
components/
  ui/                     shadcn-style primitives
  *.tsx                   Feature components (cards, hero, reader, filters, nav)
lib/
  auth.ts                 NextAuth configuration
  cache.ts                Upstash Redis helpers
  mock-data.ts            Typed 50-comic catalogue used by local pages/API
  prisma.ts               Prisma singleton
  search.ts               Algolia search with local fallback
prisma/
  schema.prisma           PostgreSQL schema
  seed.ts                 50-comic seed script
store/
  use-reader-store.ts     Zustand reader settings
```

## Setup

```bash
npm install --legacy-peer-deps
cp .env.example .env.local
npm run db:generate
npm run dev
```

Open http://localhost:3000.

## Database

1. Create a PostgreSQL database on Supabase or Neon.
2. Set `DATABASE_URL` in `.env.local`.
3. Push the schema and seed sample data:

```bash
npm run db:push
npm run db:seed
```

Sample users:

- `reader@asuraclone.dev`
- `scanlator@asuraclone.dev`
- `admin@asuraclone.dev`

Password for all seed users: `asura1234`

## Auth

NextAuth is configured with:

- Email/password credentials
- Google OAuth
- Prisma adapter models

Set `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET` before testing OAuth.

## Search, cache, and media

- Search uses Algolia if `ALGOLIA_*` variables are present; otherwise it falls back to the local catalogue.
- Hot routes use Upstash Redis if `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are configured.
- `.env.example` includes Cloudinary and uploadthing variables for production image storage.

## Scripts

```bash
npm run dev          # Start Next dev server
npm run build        # Prisma generate + production build
npm run start        # Start production server
npm run lint         # Next lint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push Prisma schema
npm run db:seed      # Seed sample comics/users
```

## Design system

The exact requested color system is defined under `theme.extend.colors.brand` in `tailwind.config.ts`:

- Primary purple `#913FE2`
- Dark background `#0F0F0F`
- Card `#1A1A1A`
- Card hover `#222222`
- Surface/border `#2A2A2A`
- Nav `#111111`
- Text, rating, and badge colors

The app is dark-only, uses Inter via `next/font`, 3:4 covers, thin dark scrollbars, 150ms transitions, and purple focus glow.
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
