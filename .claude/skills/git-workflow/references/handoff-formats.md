# Handoff Comment Formats

Post these as comments on the feature issue. Keep them short — link files instead of pasting them.

## API Contract (Backend → Frontend)

One block per new or changed endpoint. Use the response shape of the module (`{ success, data }` for Inventory/Trade, `{ data, message }` for Running).

```
📡 API Contract — Backend → Frontend
Endpoint: [METHOD] /api/{module}/v1/...
Request: [body or query shape]
Response 2xx: [shape]
Errors: 400 [when] · 401 · 404 [when] · 409 [when]
app-constants key: endpoints.[group].[key]
Ready to integrate: yes / pending migration
```

## Design Handoff (UI/UX → Frontend)

```
🎨 Design Handoff — UI/UX → Frontend
Feature: [name]
Spec: .claude/design/[file].md
Components to build:
  - [ComponentName] — states: default / hover / loading / empty / error
Base components:
  - [element] → components/base/[Component]
Notes: [gotchas]
```

## UI Ready (Frontend → Tester)

```
✅ UI Ready — Frontend → Tester
Feature: [name]
Changed:
  - [file path] — [what changed]
New ids (registered in app-constants):
  - [id] → [element]
Endpoints used:
  - [METHOD] /api/... — [purpose]
```

## id Request (Tester → Frontend)

```
🔖 id Request — Tester → Frontend
Component: [ComponentName] ([path])
Missing ids:
  - [componentName_pageName] → [which element]
Needed for: cypress/e2e/...
```

## Endpoint Gap (Tester → Backend)

```
⚠️ Endpoint Gap — Tester → Backend
Endpoint: [METHOD] /api/...
Problem: [e.g. returns 200 instead of 400 when X is an empty string]
Expected: [behavior the test should be able to assert]
```

## UX Gap (UI/UX → PM)

```
🎨 UX Gap — UI/UX → PM
PRD file: .claude/prd/{module}/{feature}.md
Gap: [what the spec would produce that hurts UX]
Proposal: [alternative]
```

## PRD Change Impact (PM → any agent)

```
📋 PRD Update — PM → [Agent]
Section: [file + heading]
Change: [what changed]
Impact on you: [what to do differently]
```

## Research Summary (Researcher → PM / UI/UX / Backend)

```
🔎 Research Report ready: [topic] — .claude/research/[file].md
For PM: [1–2 sentences]
For UI/UX: [if relevant]
For Backend/Frontend: [if relevant]
For Security Reviewer: [only if security findings]
```

## Test Result (Tester → user)

```
🧪 Tests — [feature]
Specs: [paths]
Result: [N] passing, 0 failing (headed, chrome)
Routes still returning 422: [list or none]
Report: cypress/reports/qa-coverage.md updated
```
