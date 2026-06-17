# AGENTS.md

## Cursor Cloud specific instructions

This repository is a portfolio collection of independent projects. There is no
top-level package manager; each project is self-contained.

### Projects

| Project | Type | How to run (dev) | Notes |
| --- | --- | --- | --- |
| `notes-app` | Create React App (React 19) | `BROWSER=none PORT=3000 npm start` | Notes editor, data in `localStorage`. |
| `weather-app` | Create React App (React 19) | `BROWSER=none PORT=3001 npm start` | Calls OpenWeatherMap; API key is hardcoded in `src/App.js`. Needs outbound network. |
| `random-quote-app` | Vite (React 18) | `npm run dev` (serves on `5173`) | Islamic reflections; all data bundled, no network needed. |
| `COMIXHUB`, `Tavro`, `STREETSOLE`, `M BILAL RESUME`, `college project` | Static HTML/CSS | Serve statically, e.g. `python3 -m http.server 8000` from repo root | Plain `index.html` sites, no build step. |

The two CRA apps both default to port 3000, so run one with an alternate
`PORT` (e.g. `PORT=3001`) when running them simultaneously.

### Dependencies / node_modules gotcha

`node_modules`, `build`, and `dist` were originally committed to git with
**Windows** binaries, so the `.bin` shims lacked the Linux executable bit and
`react-scripts`/`vite` failed with `Permission denied`. They are now gitignored.
The startup update script does a clean reinstall (`rm -rf node_modules` then
`npm install`) per JS app, which recreates correct Linux symlinks. A plain
`npm install` over the old committed `node_modules` does NOT fix the exec bits —
a clean reinstall is required if you ever see `Permission denied` from a CLI.

### Lint / test / build

- CRA apps have no standalone lint script; ESLint runs during `npm start` /
  `npm run build`. Use `CI=true npm run build` to treat warnings as errors.
- `npm test` in `notes-app` and `weather-app` currently FAILS: the only test is
  leftover CRA boilerplate (`renders learn react link`) that does not match the
  rewritten apps. The Jest runner itself works; the failure is a stale test, not
  an environment problem.
- `random-quote-app` has no tests; build with `npm run build`.
