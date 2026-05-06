# Frontend Agent Memory

> This file is the persistent memory for the Senior Frontend Engineer Agent.
> Update after every significant implementation decision, pattern discovery, or component reuse finding.
> Format: newest entries at the top of each section.

---

## Architecture

<!-- Record structural decisions about how the frontend is organized — folder ownership, data flow, rendering strategy -->

### Layer Map

| Layer              | Location                                | Responsibility                                                 |
| ------------------ | --------------------------------------- | -------------------------------------------------------------- |
| Pages              | `app/main/{landing,inventory,trading}/` | Route entry points — compose sections, no business logic       |
| Feature Components | `components/`                           | Domain-specific UI — tied to a module or feature               |
| Shared UI          | `components/ui/`                        | Reusable primitives (shadcn/ui + custom) — no domain knowledge |
| API Client         | `lib/api/`                              | All fetch calls — never call fetch directly in components      |
| Validation Schemas | `schemas/`                              | Zod schemas — shared with backend, used in react-hook-form     |
| Hooks              | `hooks/` (if exists) or co-located      | Business logic extracted from components                       |

### Rendering Strategy

<!-- Record which pages/features use SSR, SSG, CSR, and why -->

| Page / Feature                 | Strategy                 | Reason                                   |
| ------------------------------ | ------------------------ | ---------------------------------------- |
| <!-- e.g., /main/inventory --> | <!-- SSR / CSR / SSG --> | <!-- auth-gated / real-time / static --> |

### Data Flow Decisions

<!-- How data moves through the app — non-obvious ownership or prop passing patterns -->

| Date                | Feature          | Data Flow Pattern                                                  | Why             |
| ------------------- | ---------------- | ------------------------------------------------------------------ | --------------- |
| <!-- YYYY-MM-DD --> | <!-- feature --> | <!-- server fetch → props / client fetch / Context / URL state --> | <!-- reason --> |

### Architecture Decisions

<!-- Non-obvious structural choices that shaped how the frontend is built -->

| Date                | Decision                                                                     | Rationale    | Alternatives Rejected             |
| ------------------- | ---------------------------------------------------------------------------- | ------------ | --------------------------------- |
| <!-- YYYY-MM-DD --> | <!-- e.g., "inventory page uses client-side fetch, not server component" --> | <!-- why --> | <!-- what else was considered --> |

---

## Component Decisions

<!-- Record when a new component was created and why it wasn't handled by an existing one -->

| Date                | Component              | Location                | Why Created     | Reuse Notes               |
| ------------------- | ---------------------- | ----------------------- | --------------- | ------------------------- |
| <!-- YYYY-MM-DD --> | <!-- ComponentName --> | <!-- components/... --> | <!-- reason --> | <!-- who can reuse it --> |

---

## Pattern Discoveries

<!-- Reusable patterns found in this codebase that are not obvious from reading the code -->

- <!-- YYYY-MM-DD: pattern description + file reference -->

---

## Gotchas & Anti-Patterns

<!-- Things that looked right but caused bugs, re-renders, or broke the design system -->

- <!-- YYYY-MM-DD: what happened + what to do instead -->

---

## State Management Decisions

<!-- Non-obvious choices about where state lives and why -->

| Date                | Feature          | State Location                                | Why             |
| ------------------- | ---------------- | --------------------------------------------- | --------------- |
| <!-- YYYY-MM-DD --> | <!-- feature --> | <!-- local / Context / URL param / server --> | <!-- reason --> |

---

## Performance Findings

<!-- Measured or observed performance issues and how they were resolved -->

| Date                | Issue                  | Module                  | Fix Applied       |
| ------------------- | ---------------------- | ----------------------- | ----------------- |
| <!-- YYYY-MM-DD --> | <!-- what was slow --> | <!-- page/component --> | <!-- solution --> |

---

## API Integration Notes

<!-- Quirks in lib/api/ functions — unexpected response shapes, missing fields, error edge cases -->

- <!-- YYYY-MM-DD: endpoint + quirk + how frontend handles it -->

---

## Lessons Learned

<!-- Non-obvious things discovered while building — avoid re-learning -->

- <!-- YYYY-MM-DD: lesson -->

---

## Cross-Agent Signals

<!-- Feedback from QA or UX that changes how frontend should build things -->

| Date                | From Agent             | Signal           | Action Taken              |
| ------------------- | ---------------------- | ---------------- | ------------------------- |
| <!-- YYYY-MM-DD --> | <!-- QA/UX/Backend --> | <!-- finding --> | <!-- what was changed --> |
