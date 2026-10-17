---
name: secrets-env-check
description: Security check for secrets and data leaks in this repo — env var inventory and which are public, NEXT_PUBLIC_ misuse, hardcoded or fallback secrets, error messages and logs that leak data, encryption keys, and XSS through rendered content. Use in security reviews and whenever code adds an env var, logs data, or renders user content.
---

# Secrets & Leak Check

## Env var inventory

| Variable                                                                                       | Exposure                                                 | Used for                                   |
| ---------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`                                    | Public by design                                         | Browser + server Supabase client           |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY`                                                                 | Public by design                                         | Web push subscribe                         |
| `NEXT_PUBLIC_JAWG_ACCESS_TOKEN`                                                                | Public (map tiles) — should be domain-restricted in Jawg | Maps                                       |
| `NEXT_PUBLIC_APP_URL`                                                                          | Public                                                   | Links                                      |
| `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL`                                                    | **Server only**                                          | Admin client                               |
| `ENCRYPTION_KEY` (64-char hex), `ENCRYPTION_SECRET_KEY`                                        | **Server only**                                          | Field encryption (Running / older modules) |
| `JWT_SECRET`                                                                                   | **Server only**                                          | Avatar URL signing                         |
| `ANTHROPIC_API_KEY`, `FINNHUB_API_KEY`                                                         | **Server only**                                          | AI, market data                            |
| `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`, `STRAVA_WEBHOOK_VERIFY_SECRET`                     | **Server only**                                          | Strava OAuth + webhook                     |
| `VAPID_PRIVATE_KEY`, `VAPID_EMAIL`                                                             | **Server only**                                          | Web push                                   |
| `INNGEST_SIGNING_KEY`                                                                          | **Server only**                                          | Inngest                                    |
| `CYPRESS_AUTH_SECRET`, `CYPRESS_BYPASS_ENABLED`, `CYPRESS_TEST_EMAIL`, `CYPRESS_TEST_PASSWORD` | Test only                                                | Cypress auth bypass and test login         |

## Checklist

**Env and secrets**

- [ ] No secret gets a `NEXT_PUBLIC_` prefix (that ships it to the browser).
- [ ] No hardcoded keys, tokens, or passwords in source, tests, or fixtures.
- [ ] **No fallback secrets** like `process.env.X || 'default-secret'` — a missing secret must fail loudly. (Known existing case: `lib/services/user/avatar.js` uses `JWT_SECRET || 'default-secret'`.)
- [ ] New env vars are documented in the PR and added to the deploy environment by the user.
- [ ] Server-only modules that read secrets aren't imported into client components.

**Leaks in responses and logs**

- [ ] 500 responses use a generic message — no `err.message`, no Postgres/PostgREST errors, no column or constraint names.
- [ ] Responses don't include tokens, encrypted blobs, other users' data, or internal IDs that aren't needed.
- [ ] Logs (`console.error('[module/...]', err)`) never print tokens, passwords, keys, full request bodies with personal data, or AI prompts with user data.
- [ ] Strava tokens are stored encrypted (`lib/utils/running/encrypt.js`) and never returned to the client.

**XSS and rendering**

- [ ] No `dangerouslySetInnerHTML` with user or AI content (today only `app/layout.tsx` uses it, for the static theme script).
- [ ] Markdown from AI output or user notes is rendered with `react-markdown` (as in `app/main/trading/event/...`). Never add `rehype-raw` without `rehype-sanitize` (installed) after it.
- [ ] URL params and query strings aren't put into `href`, `src`, or the DOM without checking (e.g. `javascript:` links).
- [ ] User-supplied URLs (event links) are validated as `http(s)` before rendering as links.

## Finding example

```
[S-2] CRITICAL — lib/services/user/avatar.js:4 — JWT_SECRET falls back to 'default-secret'.
Attack: if the env var is missing in a deploy, anyone can sign valid avatar URLs with the public default.
Fix: throw at startup when JWT_SECRET is missing.
```
