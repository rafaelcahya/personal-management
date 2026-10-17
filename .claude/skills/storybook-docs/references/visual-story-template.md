# Storybook Visual Story Template

**Rule: 1 variant = 1 story. 1 prop value = 1 story.**

Each visual story must have exactly 4 parts in this order:

1. Information guide — what this variant/prop does
2. Live preview — rendered component inside a gray container
3. Best Practices — 2–3 focused ✓ cards for this specific variant
4. Code snippet — copy-ready JSX

> **Best Practices uses the same card-stack pattern in both docs and visual stories.**
> Both `Guide.stories.jsx` and each visual story use the same design: a vertical stack of violet cards,
> each with a ✓ checkmark icon, a bold title, and a body.
>
> The difference is scope and structure:
>
> - **Docs** (`Guide.stories.jsx`): 4 fixed categories — _When to use / When not to use / Accessibility / Advice_ — each with 2–4 cards and a gray uppercase sub-heading.
> - **Visual stories**: No sub-headings. Just 2–3 flat cards focused on this specific variant/prop only.

---

## Template

```jsx
import ComponentName from './ComponentName'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Folder/ComponentName',
}

export default meta

// Define once per file, reuse across all stories in the file
const BestPractices = ({ items }) => (
  <div className="flex flex-col gap-8 w-full max-w-2xl">
    {items.map(({ heading, cards }) => (
      <div key={heading}>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          {heading}
        </p>
        <div className="flex flex-col gap-3">
          {cards.map(({ title, body }) => (
            <div
              key={title}
              className="flex gap-3 p-4 rounded-lg border border-violet-100 bg-violet-50"
            >
              <span className="mt-0.5 shrink-0 size-4 rounded-full bg-violet-500 flex items-center justify-center text-white text-[10px] font-bold">
                ✓
              </span>
              <div>
                <p className="text-xs font-semibold text-violet-800 mb-0.5">{title}</p>
                <p className="text-xs text-violet-700 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
)

export const VariantName = {
  name: 'Variant Name',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Information guide */}
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Short explanation of what this variant/prop means and what it does visually. Use inline{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">propName</code> for prop names.
      </p>

      {/* 2. Live preview */}
      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">label describing what is shown</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <ComponentName prop="value" />
        </div>
      </div>

      {/* 3. Best Practices — 4 fixed categories, same card pattern as Guide.stories.jsx */}
      {/*
        Structure: always 4 categories in this order:
          1. When to use      — 1–2 cards focused on this variant
          2. When not to use  — 1–2 cards focused on this variant
          3. Accessibility    — 1 card relevant to this variant
          4. Advice           — 1–2 cards for pairing/usage tips

        Design rules per card:
          - Card: flex gap-3 p-4 rounded-lg border border-violet-100 bg-violet-50
          - Checkmark: mt-0.5 shrink-0 size-4 rounded-full bg-violet-500 text-white text-[10px] font-bold
          - Title: text-xs font-semibold text-violet-800 mb-0.5
          - Body: text-xs text-violet-700 leading-relaxed
          - Use plain text in title/body (no JSX tags) so .map() works

        Category sub-heading:
          - text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3

        Define a local BestPractices component per file to avoid repeating the markup.
      */}
      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Rule title — short imperative sentence',
                body: 'Explanation focused on this specific variant/prop.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Rule title',
                body: 'Explain what breaks or looks wrong if misused.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Rule title',
                body: 'Accessibility note specific to this variant.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Rule title',
                body: 'Pairing tip or usage advice for this variant.',
              },
            ],
          },
        ]}
      />

      {/* 4. Code snippet */}
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<ComponentName prop="value" />`}</code>
      </pre>
    </div>
  ),
}
```

---

## Multiple demos in one story

When one story needs to show several related examples of the **same prop/variant** (e.g. a prop that accepts many values), wrap each demo in its own labeled container. Each demo still gets its own Best Practices immediately after it.

```jsx
export const VariantName = {
  name: 'Variant Name',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Information guide */}
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">Description ...</p>

      {/* 2a. First demo */}
      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">first example label</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <ComponentName prop="a" />
        </div>
      </div>

      {/* 3a. Best Practices for first demo */}
      <div className="flex flex-col gap-3 w-full max-w-2xl">
        {[{ title: 'Rule for this demo', body: 'Explanation...' }].map(({ title, body }) => (
          <div
            key={title}
            className="flex gap-3 p-4 rounded-lg border border-violet-100 bg-violet-50"
          >
            <span className="mt-0.5 shrink-0 size-4 rounded-full bg-violet-500 flex items-center justify-center text-white text-[10px] font-bold">
              ✓
            </span>
            <div>
              <p className="text-xs font-semibold text-violet-800 mb-0.5">{title}</p>
              <p className="text-xs text-violet-700 leading-relaxed">{body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 2b. Second demo */}
      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">second example label</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <ComponentName prop="b" />
        </div>
      </div>

      {/* 3b. Best Practices for second demo */}
      <div className="flex flex-col gap-3 w-full max-w-2xl">
        {[{ title: 'Rule for this demo', body: 'Explanation...' }].map(({ title, body }) => (
          <div
            key={title}
            className="flex gap-3 p-4 rounded-lg border border-violet-100 bg-violet-50"
          >
            <span className="mt-0.5 shrink-0 size-4 rounded-full bg-violet-500 flex items-center justify-center text-white text-[10px] font-bold">
              ✓
            </span>
            <div>
              <p className="text-xs font-semibold text-violet-800 mb-0.5">{title}</p>
              <p className="text-xs text-violet-700 leading-relaxed">{body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Shared code snippet */}
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<ComponentName prop="a" />
<ComponentName prop="b" />`}</code>
      </pre>
    </div>
  ),
}
```

---

## Layout rules

- Outer container: `flex flex-col gap-6 w-full` — no `items-center`, no `max-w-*`
- Gray demo container: `p-4 bg-gray-50 border border-gray-200 rounded-lg`
- Demo label above container: `text-xs text-gray-400`
- Best Practices container: `flex flex-col gap-3 w-full max-w-2xl`
- Each Best Practices card: `flex gap-3 p-4 rounded-lg border border-violet-100 bg-violet-50`
- Checkmark span: `mt-0.5 shrink-0 size-4 rounded-full bg-violet-500 flex items-center justify-center text-white text-[10px] font-bold`
- Card title: `text-xs font-semibold text-violet-800 mb-0.5`
- Card body: `text-xs text-violet-700 leading-relaxed`
- Inline code inside Best Practices: `bg-violet-100` (not `bg-gray-100`)
- Description, Best Practices, code snippet: capped at `max-w-2xl`
- Live preview section: no max-width cap
