---
name: github-issue-create
description: Create the single GitHub issue for a feature or fix in this repo — the required template, PRD file pointers, labels, milestone, Project 3 fields, safe body editing, and the summary table shown to the user afterwards. Use when PM (or the main session) needs to open a new issue.
---

# GitHub Issue Create

**One issue per feature or fix.** Every agent works in it. No per-role issues, no `[PM]`/`[Backend]` title prefixes.

## Body template

```markdown
## 👤 User Story

As a [persona], I want [goal] so that [reason].

## 📋 Description

[Context — casual, plain English]

## ✅ Acceptance Criteria

- [ ] ...

## 🛠️ Tasks

### PM / UI/UX

- [ ] ...

### Backend

- [ ] TBD after analysis

### Frontend

- [ ] TBD after analysis

### Tester

- [ ] TBD after development

## 📝 Notes

PRD: `.claude/prd/{module}/{feature}.md` (read only this file)
Design spec: `.claude/design/[file]` (if any)
[Technical decisions, edge cases, constraints]
```

PM fills User Story, Description, Acceptance Criteria, Notes. Backend, Frontend, and Tester fill their own Tasks later. **The PRD file pointer in Notes is required** — it's how agents know which single file to read.

## Create it

Write the body to a file first (never build it in a PowerShell variable — it flattens newlines):

```bash
gh issue create \
  --title "Route pacing simulator for hilly routes" \
  --body-file /tmp/issue.md \
  --milestone v1.33 \
  --label P2 --label "module: running" --label "type: feature" \
  --label "agent: backend" --label "agent: frontend" --label "agent: tester"
```

- Title: plain feature name, or `<type>: <short description>` for chores/docs.
- Labels: one priority (`P0`–`P3`), one `module: …` (`inventory`, `running`, `trading`, `auth`, `shared`), one `type: …` (`feature`, `bug`, `tech-debt`, `test`), and an `agent: …` per agent involved (`backend`, `frontend`, `ui/ux`, `tester`).
- Milestone: the release (`v1.33`). If it doesn't exist, create it only with the user's approval: `gh api repos/{owner}/{repo}/milestones -f title=v1.33`.

## Add to Project #3

```bash
gh project item-add 3 --owner rafaelcahya --url <issue-url>
```

Then set **Status = Todo** and **Priority** (field option ids: `gh project field-list 3 --owner rafaelcahya --format json`). Module and Release are single-select fields whose options may not include the new release — **don't recreate field options through the API** (it replaces the whole option list); tell the user to add the option in the Project settings.

## Edit an issue body

```bash
gh issue view {n} --json body --jq .body > /tmp/issue.md   # edit the file
gh issue edit {n} --body-file /tmp/issue.md
```

## Tell the user

Stop after creating issues (don't start branches or code unless asked) and show:

| #                                                                     | Title | Role                      |
| --------------------------------------------------------------------- | ----- | ------------------------- |
| [#842](https://github.com/rafaelcahya/personal-management/issues/842) | ...   | Backend, Frontend, Tester |
