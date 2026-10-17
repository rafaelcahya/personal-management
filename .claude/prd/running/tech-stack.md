## 6. Tech Stack

| Layer           | Technology                     | Notes                                                               |
| --------------- | ------------------------------ | ------------------------------------------------------------------- |
| Framework       | Next.js 15 App Router          | JavaScript/JSX — matches Personal Management                        |
| UI              | Tailwind CSS + Base Components | Matches Personal Management for visual consistency                  |
| Charts          | Recharts (Phase 1)             | Visx for correlation view in Phase 2                                |
| Map             | Leaflet + OpenStreetMap        | Renders activity routes                                             |
| Database        | PostgreSQL 16                  | Standard PG with proper indexing — no TimescaleDB                   |
| ORM             | Drizzle ORM                    | Lightweight, well-suited to Next.js API routes                      |
| Auth            | Supabase SSR                   | Shared project with Personal Management                             |
| Data sync       | Strava API                     | OAuth + webhook + polling fallback                                  |
| AI              | Claude API (Sonnet 4.6)        | Running coach, tool use, streaming SSE — Sonnet for all queries     |
| Background jobs | Inngest                        | Serverless-native job queue — backfill, sync, AI insight generation |
| Cache           | Redis (Upstash)                | Rate limit counter, AI context cache                                |
| File storage    | Cloudflare R2                  | GPX/FIT file upload + backup                                        |
| Deployment      | Vercel                         | Web app + API routes — serverless                                   |
| Monitoring      | Sentry + Vercel Analytics      |                                                                     |

---

## 6.1 UI Design Standards

These rules apply to all components in Running Tracker. Frontend and UI/UX agents must follow this as the source of truth.

### Input Focus Ring

All `<Input>` elements (base) and `<textarea>` elements **must** use the violet focus ring, not the default gray from the CSS variable `--ring`:

```
focus-visible:ring-violet-200 focus-visible:border-violet-600
```

For native `<textarea>` (not base Input):

```
focus:outline-none focus:ring-2 focus:ring-violet-500
```

**Reason:** The default `--ring` in globals.css is dark gray (`0 0% 3.9%`), which is inconsistent with the violet brand color used across the running tracker UI.

### Brand Color

Primary accent: `violet-600` (`#7c3aed`) — used for CTA buttons, active states, focus rings, and highlights.

---
