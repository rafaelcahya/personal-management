---
name: git-workflow
description: GitHub and git rules for this repo — one issue per feature on Project #3, writing your task list into the issue before coding, the shared feat/fix branch from release/vX.Y, 50/72 commit messages, PRs with Closes #n, status flow, and posting cross-agent handoff comments. Use whenever you touch the issue, branch, commits, PR, or need to hand off to another agent.
---

# Git Workflow (v2)

## Issues

- **One issue per feature.** All agents work in the same issue. Don't create per-role issues.
- PM creates the issue (see the `github-issue-create` skill). Everyone else only edits it.
- **Hard gate:** before writing code or tests, add your task list under your role in the issue's 🛠️ Tasks section. Edit the body without breaking its newlines:

  ```bash
  gh issue view {n} --json body --jq .body > /tmp/issue.md   # edit the file, then:
  gh issue edit {n} --body-file /tmp/issue.md
  ```

  In PowerShell, never pipe `gh` output into a variable and write it back — it splits the body into lines and flattens it. Use Bash or a file.

- Status on Project #3: **Todo → In Progress → Done**. Only the user sets Done, after the Tester confirms 100% pass.

## Branches

```
release/vX.Y                          milestone integration branch (from master)
feat/issue-{n}-{short-description}    shared feature branch — Backend, Frontend, Tester all push here
fix/issue-{n}-{short-description}     shared hotfix branch
```

- Branch from `release/vX.Y`, never from master.
- Don't create your own branch if the feature branch exists. There are no `feature/` branches.

## Commits

Follow the 50/72 rule:

```
<type>: <description> (#n)

Optional body explaining what changed and why.
Wrap at 72 characters per line.
```

- Subject ≤ 50 characters. Types: `feat`, `fix`, `chore`, `docs`, `test`, `refactor`.
- **Never commit or push unless the user asked for it.**
- Never skip hooks (`--no-verify`).

## Pull requests

- From the feature branch to `release/vX.Y`, with `Closes #n` in the body.
- `Closes #n` only auto-closes when the PR lands on master. A PR into `release/vX.Y` leaves the issue open — the user closes it.
- If reviewers find CRITICAL issues, fix them on the **same branch** and push again.
- When the milestone is done, the user opens `release/vX.Y` → `master`.

## Handoffs between agents

Handoffs are **comments on the feature issue**. There's no signal file.

```bash
gh issue view {n} --comments                  # read handoffs addressed to you
gh issue comment {n} --body-file handoff.md   # post one
```

- Agents without Bash (UI/UX, Researcher) put the comment text in their final report; the caller posts it.
- When you've handled a handoff, reply `Resolved: <what was done>`. Never delete comments.
- Formats: [references/handoff-formats.md](references/handoff-formats.md).

| Finishing agent | Must post                                                       | For                       |
| --------------- | --------------------------------------------------------------- | ------------------------- |
| PM              | PRD Change Impact (when agents are already working)             | affected agents           |
| Researcher      | Research summary                                                | PM / UI/UX / Backend      |
| UI/UX           | Design Handoff                                                  | Frontend                  |
| Backend         | API Contract (one per new or changed endpoint)                  | Frontend                  |
| Frontend        | UI Ready                                                        | Tester                    |
| Tester          | id Request / Endpoint Gap (when blocked); pass result when done | Frontend / Backend / user |

Skip the handoff when nothing another agent depends on changed (internal refactor, bug fix with no shape change).
