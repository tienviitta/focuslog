# FocusLog

FocusLog is a small, client-side focus timer. You pick a duration, run a session, and keep a simple log of completed blocks for **today**. Data stays in the browser (`localStorage`); there is no account or server database.

## Tech stack

| Area      | Choice                                                                                                                                                     |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework | [Next.js](https://nextjs.org/) 16 (App Router)                                                                                                             |
| UI        | [React](https://react.dev/) 19                                                                                                                             |
| Language  | [TypeScript](https://www.typescriptlang.org/) (strict)                                                                                                     |
| Styling   | [Tailwind CSS](https://tailwindcss.com/) v4 (`@import "tailwindcss"`, `@theme`)                                                                            |
| Fonts     | [Geist](https://vercel.com/font) via `next/font`                                                                                                           |
| Lint      | [ESLint](https://eslint.org/) 9 + [`eslint-config-next`](https://www.npmjs.com/package/eslint-config-next) (Core Web Vitals + TypeScript)                  |
| Format    | [Prettier](https://prettier.io/) (with `eslint-config-prettier` to avoid rule clashes)                                                                     |
| Tests     | [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/docs/react-testing-library/intro/) + [jsdom](https://github.com/jsdom/jsdom) |

CI (GitHub Actions) runs on Node **20**: `lint`, `format:check`, `test`, and `build`.

## Run locally

**Prerequisites:** [Node.js](https://nodejs.org/) 20+ and npm.

```bash
git clone <your-repo-url>
cd focuslog
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The dev server uses Next’s defaults (including hot reload).

Other useful commands:

| Command                | Purpose                                        |
| ---------------------- | ---------------------------------------------- |
| `npm run build`        | Production build                               |
| `npm run start`        | Serve the production build (run `build` first) |
| `npm run lint`         | ESLint                                         |
| `npm run format`       | Format the repo with Prettier                  |
| `npm run format:check` | Check formatting (same as CI)                  |

## Test

```bash
npm test
```

Runs the full suite once (Vitest). For local iteration:

```bash
npm run test:watch
```

Tests cover timer math (`lib/focus-timer`), session persistence and validation (`lib/focus-storage`), and selected components (`FocusTimer`, `SessionPicker`). Test files live next to sources as `*.test.ts` / `*.test.tsx`.

## Deployment (Vercel from GitHub)

FocusLog is a static-friendly Next app (no custom server required). Deploying on [Vercel](https://vercel.com/) from GitHub is straightforward:

1. Push this repository to GitHub (if it is not already).
2. In the Vercel dashboard, choose **Add New… → Project** and **Import** the GitHub repo.
3. Use the defaults Vercel suggests for Next.js:
   - **Framework Preset:** Next.js
   - **Build Command:** `next build` (or `npm run build`)
   - **Output:** handled by Vercel for Next
   - **Install Command:** `npm ci` or `npm install`
4. Add the project and deploy. Vercel will build on every push to the connected branch (typically `main`) unless you change **Git** settings.

**Environment variables:** none are required for the current feature set. If you add analytics or APIs later, configure them under **Project → Settings → Environment Variables** in Vercel.

**GitHub Actions:** the workflow in `.github/workflows/ci.yml` mirrors what you want green before merge: lint, format, tests, and build. It does not deploy by itself; Vercel’s Git integration performs deployments when you push.

## Key architectural decisions

- **App Router + mostly static UI:** The home route is prerendered; interactive behavior lives under a client boundary where needed.
- **Single client island:** `FocusLogApp` and its children are client components because timers, form state, and `localStorage` require the browser. The shell (`layout.tsx`, `page.tsx`) stays lean and passes metadata and global styles.
- **Pure logic in `lib/`:** Countdown calculations (`focus-timer.ts`) and storage parsing/validation (`focus-storage.ts`) are separated from React. That keeps behavior testable without rendering and reduces duplicate logic.
- **Defensive storage reads:** Sessions loaded from `localStorage` are validated before use so corrupted or hand-edited JSON cannot crash the UI.
- **Path alias `@/*`:** Imports use `@/components/...` and `@/lib/...` for stable, readable paths (configured in `tsconfig.json` and mirrored in `vitest.config.ts`).
- **TypeScript split for tests:** Vitest config and `*.test.*` files are excluded from Next’s production typecheck so `next build` stays focused on app code; tests still run under Vitest and are linted by ESLint.
