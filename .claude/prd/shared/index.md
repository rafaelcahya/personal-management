# Product Requirements Document (PRD)

<!-- files:start -->

**This module is split into one file per feature.** Read only the file your task needs.

| File                                             | Covers                                                 | Size  |
| ------------------------------------------------ | ------------------------------------------------------ | ----- |
| [agent-instructions.md](./agent-instructions.md) | 8. Agent Instructions                                  | 1 KB  |
| [api-standards.md](./api-standards.md)           | 4. API Standards                                       | 1 KB  |
| [database-tables.md](./database-tables.md)       | 6. Database Tables                                     | 3 KB  |
| [notifications.md](./notifications.md)           | 10. Notifications and Push (v1.33, #856, #857)         | 6 KB  |
| [nfr.md](./nfr.md)                               | 7. Non-Functional Requirements                         | 1 KB  |
| [ui-color-tokens.md](./ui-color-tokens.md)       | 5. UI/UX Standards                                     | 15 KB |
| [ui-data-table.md](./ui-data-table.md)           | Data Table Component                                   | 10 KB |
| [ui-forms.md](./ui-forms.md)                     | Form (Dialog/Modal)                                    | 8 KB  |
| [ui-layout.md](./ui-layout.md)                   | Page Container                                         | 5 KB  |
| [version-history.md](./version-history.md)       | Version history (read only when you need past changes) | 42 KB |

<!-- files:end -->

## Personal Management App

**Version:** 1.25
**Last Updated:** 2026-10-17
**Owner:** Rafael Cahya  
**Stack:** Next.js 15 App Router · Supabase (PostgreSQL) · Tailwind CSS · Base Components · Claude AI (Sonnet 4.6)

---

## Product Release Plan

> PRD version = document revision (tracks requirement changes).
> Product release version = what ships to production (GitHub milestone).

| Release  | Status  | GitHub Milestone                                                       | PRD Coverage                                                                | Issues      |
| -------- | ------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------- | ----------- |
| **v1.0** | Shipped | —                                                                      | PM PRD v1.0–v1.19 (all features to date: Inventory, Trading, Auth, Sidebar) | —           |
| **v1.1** | Planned | [v1.1](https://github.com/rafaelcahya/personal-management/milestone/2) | RT PRD section 10 Analytics, section 11 AI Coach                            | #4 #5 #6 #7 |
| **v1.2** | Planned | [v1.2](https://github.com/rafaelcahya/personal-management/milestone/3) | TBD                                                                         | —           |

---

## 1. Overview

Personal Management App is a personal web application for managing two main domains:

1. **Inventory** — Household product stock management
2. **Trading** — Stock portfolio management and analysis

The app includes an **AI Chat** powered by Claude for natural language interaction across both domains.

---

## 2. Users & Access

| Role               | Access                      |
| ------------------ | --------------------------- |
| Authenticated User | Full access to all features |
| Unauthenticated    | Redirect to `/login`        |

- Auth via Supabase (Google OAuth only)
- Session managed via SSR cookies (middleware.js)
- Every request to `/main/*` and `/api/*` must be authenticated

---

## 3. Modules & Features

---

---
