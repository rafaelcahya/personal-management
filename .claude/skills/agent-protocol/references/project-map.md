# Project Map

Personal productivity app for one user, four domains: Inventory, Stock Trading, Running Tracker (with AI coach), and Auth + User Settings. Every data row is scoped to `user_id`.

```
app/
├── api/{module}/v1/{resource}/...route.js   API route handlers
│     modules: inventory, trade, running, user, investment-flow,
│     currency-investments, watchlist, valuation, forex, notifications, home
├── main/
│   ├── landing/ inventory/ trading/ running/ settings/ notifications/ security/
│   ├── hooks/ lib/ components/              shared page-level code
│   └── layout.jsx
└── globals.css                              CSS variables / design tokens

components/
├── base/                                    base component library (Radix UI) + Guide.stories.jsx
├── ui/                                      shared components
└── {feature}/                               feature components

lib/
├── api/                                     frontend fetch functions (one file per resource)
├── services/{domain}/                       backend business logic
├── supabase/  server.ts · admin.js · client.js
├── inngest/                                 background jobs (Inngest functions, served by app/api/inngest)
├── running/                                 running domain helpers
├── constants/ · utils/ · hooks/
└── rate-limit.js

schemas/                                     Zod schemas (shared frontend/backend)
supabase/                                    migrations

cypress/
├── e2e/{module}/{menu}/{menu}-api.cy.js     specs (one file per menu)
├── fixtures/app-constants.json + .yaml      endpoints + ids (always update both)
├── support/common/...                       custom commands (registered in support/e2e.ts)
├── support/db/...                           DB query functions
├── plugin/tasks/                            cy.task() registrations
└── reports/qa-coverage.md                   QA report (cumulative)

.claude/
├── prd/                                     PRD files (PM owns)
├── design/                                  UI/UX specs
├── research/                                Researcher reports
├── agents/subagents/                        agent definitions
├── agent-memory/{agent}/MEMORY.md           built-in agent memory
├── skills/                                  project skills
└── hooks/                                   hook scripts
```
