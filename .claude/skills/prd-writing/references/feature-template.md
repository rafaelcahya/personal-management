# Feature Section Template

```markdown
#### [number] [Feature name]

**Status:** Draft | Review | Approved | Done | Deprecated
**Release:** v1.xx
**Issue:** #n

**What it is**
[1–2 sentences: what this does and why the user wants it]

**User stories**

- As a runner, I want to [action], so that [benefit].
- ...

**Acceptance criteria**

- GIVEN [context] WHEN [action] THEN [result]
- GIVEN [error context] WHEN [invalid action] THEN [what the user sees]
- ...

**Validations**

| Field | Rule              | Message                                           |
| ----- | ----------------- | ------------------------------------------------- |
| title | required, max 200 | "Race name is required" / "Race name is too long" |

**Error states**

| Situation      | What the user sees                               |
| -------------- | ------------------------------------------------ |
| Network or 500 | Inline error with a Retry button                 |
| 401            | Redirect to login                                |
| Not found      | "This [thing] doesn't exist anymore" + back link |

**API** (when there's backend work)

| Method | Path                | Notes                 |
| ------ | ------------------- | --------------------- |
| GET    | /api/running/v1/... | paginated, owner only |

**Data** (when there's a schema change)

- table `rt_...`: new column `...` (type, nullable, default)

**Test ids** (when known)

- `[elementName]_[pageName]`

**Definition of done**

- [ ] UI with all states, WCAG 2.1 AA
- [ ] API with validation and error handling
- [ ] Cypress API tests passing (headed)
- [ ] PRD updated with the final behavior
```
