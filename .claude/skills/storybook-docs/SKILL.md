---
name: storybook-docs
description: Write or update Storybook docs for base components in components/base/ — the Guide.stories.jsx docs page and per-variant visual stories, using the project's fixed templates. Use when a base component is created or changed, or its docs are missing or out of date.
---

# Storybook Docs

Every folder in `components/base/` has:

| File                                                          | Export                             | Content                                                                                                                    |
| ------------------------------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `Guide.stories.jsx`                                           | `Docs`                             | Full documentation page: overview, anatomy, props, best practices (When to use / When not to use / Accessibility / Advice) |
| `{Component}.stories.jsx` (one per subcomponent where needed) | one story per variant / prop value | Visual stories                                                                                                             |

## Templates — follow them exactly

- Docs page: [references/docs-template.md](references/docs-template.md)
- Visual stories: [references/visual-story-template.md](references/visual-story-template.md)

Key rules from the templates:

- **1 variant = 1 story, 1 prop value = 1 story.**
- Each visual story has 4 parts in order: info guide → live preview (gray container) → 2–3 best-practice cards → copy-ready JSX snippet.
- Best practices use the violet ✓ card stack. Docs pages group them into the 4 fixed categories with gray uppercase sub-headings; visual stories use 2–3 flat cards.
- `meta.title` is `'{Folder}/{ComponentName}'`.

## When to update

- A base component's props, variants, or behavior changed (only after an approved Base Component Modification Request — see `ui-builder`).
- A new base component is added.
- Docs show an API that no longer exists.

## Check

```bash
npm run build-storybook 2>&1 | tail -30
```

Run it only when the user asks or the change is large — it's slow. For small edits, lint the changed story files.
