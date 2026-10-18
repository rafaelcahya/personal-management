---
name: research-report
description: Run a research task for this repo and write the structured Research Report to .claude/research/ — reading the codebase first, targeted web research, source priority, the report template with sections per role, and the short handoff. Use for any Researcher task; pair with library-evaluation or ux-benchmark for those topics.
---

# Research Report

## Process

1. **Codebase first** — Grep/Glob for what already exists (components, libraries in `package.json`, similar features). Don't recommend something the repo already has.
2. **Targeted searches** — specific queries ("recharts 3 brush accessibility", not "chart library"). Fetch only sources that look useful.
3. **Source priority** — official docs > maintainer blogs / changelogs > GitHub repo + issues > well-known articles > everything else. Note the date of anything time-sensitive.
4. **Evaluate** against this stack: Next.js 15 App Router, JS/JSX, Supabase, Tailwind 3.4, base components (Radix), react-hook-form + Zod 4, Recharts 3, Inngest, Cypress.
5. **So what?** Every finding ends with what it means for this project.

## File

`.claude/research/{YYYY-MM-DD}-{topic}.md` — the only place you write.

## Template

```markdown
## Research Report: [Topic]

**Date:** YYYY-MM-DD
**Triggered by:** [issue #n / PM request / product discovery]
**Scope:** [what was researched, what wasn't]

### Executive summary

[2–3 sentences: the key finding and the top recommendation]

### For PM — product insights

| Finding | Source | Recommendation | Priority |
| ------- | ------ | -------------- | -------- |

### For UI/UX — patterns

- **Pattern:** [name] — [what] — [why it fits here] — [reference]
- **Accessibility:** ...

### For Backend + Frontend — technical

[Library table from `library-evaluation`, if any]

- Implementation notes specific to this codebase (file paths, where it plugs in)

### For Security Reviewer + Tester

- **[SECURITY]** ...
- **[EDGE CASE]** ...
- **[TEST SCENARIO]** ...

### Sources

- [Title](url) — what it covers (date)
```

Leave out sections that don't apply instead of filling them with filler.

## Handoff

Final report (≤ 15 lines): report path, executive summary, and the Research Summary comment text (`git-workflow` → handoff formats) for the caller to post.
