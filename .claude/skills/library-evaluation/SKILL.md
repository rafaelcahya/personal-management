---
name: library-evaluation
description: Evaluate npm packages for this repo — check what's already installed, fit with Next.js 15 / React / Tailwind 3.4 / JS-only code, bundle and SSR impact, maintenance and security signals, license, and produce a use/consider/avoid table. Use before recommending or adding any dependency.
---

# Library Evaluation

## Before searching

- Check `package.json` — maybe something installed already does it (e.g. charts: `recharts`; toasts: `sonner`; maps: Leaflet / MapLibre GL; animation: GSAP; forms: react-hook-form; dates: check what's there).
- Check whether a base component in `components/base/` already covers it.

## Criteria

| Criterion     | What to check                                                                                                                                                                                 |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fit           | Works with React 19 / Next.js 15 App Router; client-only or SSR-safe? needs `'use client'` or `dynamic(..., { ssr: false })`? JS-friendly (no TS-only APIs)? Tailwind 3.4 compatible styling? |
| Size          | Bundle size (min+gzip, e.g. bundlephobia / pkg-size), tree-shakable?                                                                                                                          |
| Maintenance   | Last release date, release cadence, open vs closed issues, number of maintainers                                                                                                              |
| Security      | Known advisories (GitHub advisories, `npm audit` notes), install scripts, dependency count                                                                                                    |
| License       | MIT / Apache / BSD fine; flag GPL/AGPL or "source available"                                                                                                                                  |
| Accessibility | For UI libraries: keyboard and screen-reader support                                                                                                                                          |
| Cost to adopt | API complexity, migration effort, how many files change                                                                                                                                       |

## Output

| Package | Purpose | Size (gz) | Last release | Weekly downloads | License | Verdict                         |
| ------- | ------- | --------- | ------------ | ---------------- | ------- | ------------------------------- |
| ...     | ...     | ...       | YYYY-MM      | ...              | MIT     | ✅ Use / ⚠️ Consider / ❌ Avoid |

Then 2–4 bullets: why the winner, where it plugs in (file paths), and what to watch for.

## Rules

- Always include "build it with what we have" as an option when it's realistic.
- Adding a dependency is a user decision — the report recommends; Backend/Frontend add it only after plan approval.
- Read `.claude/skills/next-best-practices/bundling.md` for packages that need special Next.js handling.
