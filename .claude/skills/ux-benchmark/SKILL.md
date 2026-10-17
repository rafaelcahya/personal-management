---
name: ux-benchmark
description: Benchmark how well-known products solve a UX problem (e.g. Strava, Garmin Connect, Runna for running; brokerage and portfolio apps for trading; inventory apps) and turn it into concrete patterns that fit this repo's base components and tokens. Use when a feature needs UX references before PM or UI/UX decide.
---

# UX Benchmark

## Pick references that match the domain

| Module     | Look at                                                                                             |
| ---------- | --------------------------------------------------------------------------------------------------- |
| Running    | Strava, Garmin Connect, Runna, TrainingPeaks, Nike Run Club, intervals.icu                          |
| Trading    | Brokerage apps and portfolio trackers (e.g. Stockbit, TradingView, Yahoo Finance portfolio, Koyfin) |
| Inventory  | Home inventory and pantry apps, Notion-style databases, Sortly                                      |
| General UI | Linear, Vercel, Stripe dashboard (patterns for tables, empty states, settings)                      |

Use 3–5 references. Prefer official help docs, product pages, and changelogs over screenshots of unknown age.

## For each reference

- **How it works** — the flow in 2–4 steps.
- **What's good** — and why it works (less typing, clear status, progressive disclosure, ...).
- **What doesn't fit** — paid-only, mobile-native gesture, needs data we don't have, too complex for one user.

## Turn it into a recommendation

- Name the pattern and map it to what we have: base components (`ui-builder` catalog), `Section` cards, `Sheet`, `Modal`, Recharts, tokens.
- Say what states it needs (loading, empty, error, pending AI, needs-reconnect).
- Flag accessibility concerns (color-only meaning, hover-only info, tiny targets).
- Keep it to one user, personal use — skip social/team features unless asked.

## Output

Goes into the **For UI/UX** and **For PM** sections of the research report (`research-report`):

```markdown
- **Pattern:** Effort-adjusted pace bands — Runna, Strava Route Builder — shows a pace range per climb segment so effort stays even.
  Fits: Section card + Recharts area chart with segment bands; table fallback on mobile.
  States: loading skeleton, "not enough elevation data" empty state.
  Watch out: band colors need a label, not color alone.
```
