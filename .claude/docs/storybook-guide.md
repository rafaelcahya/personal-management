# Storybook Story Guide

Templates and conventions for writing stories in this project.

---

## Folder Structure

```
components/base/
├── Field/
│   ├── FieldContainer.jsx
│   ├── FieldContainer.stories.jsx   ← story per sub-component
│   ├── Guide.stories.jsx            ← main docs for the Field folder
│   └── ...
└── Input/
    ├── Input.jsx
    ├── Default.stories.jsx
    └── Guide.stories.jsx            ← main docs for the Input folder
```

**Rules:**

- Each component has its own `.stories.jsx` file in the same folder
- `Guide.stories.jsx` contains `export const Docs` — the main documentation for that folder
- Docs always appears at the top (configured via `storySort` in `.storybook/preview.js`)

---

## Meta Object

```jsx
/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Field/FieldContainer', // sidebar path: Folder/Subfolder/ComponentName
}

export default meta
```

For component stories with controls:

```jsx
/** @type {import('@storybook/nextjs').Meta<typeof Input>} */
const meta = {
  title: 'Input/Input/Input Field',
  component: Input,
}

export default meta
```

---

## Story Export

Each story is a named export with a `name` and `render` property:

```jsx
export const GapVariants = {
  name: 'Gap Variants', // label shown in the sidebar
  render: () => <div>...</div>,
}
```

`name` is optional — if omitted, Storybook derives it from the variable name (camelCase → "Camel Case").

---

## Story Types

### 1. Docs Story (`Guide.stories.jsx`)

A single large story that documents the entire component. Always exported as `Docs`.

```jsx
export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="p-8 max-w-4xl font-sans text-gray-900">
      {/* Header */}
      {/* One Section per feature */}
    </div>
  ),
}
```

**Important:** `export const Docs` in `Guide.stories.jsx` must not be modified once finalized.

### 2. Component Story

Focuses on a single behavior or variant of a component. **Every story must have three parts: information guide, live preview, and code snippet.**

```jsx
export const ErrorState = {
  name: 'Error State',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* 1. Information guide */}
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">error</code> to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> — Input
        automatically gets a red border and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldError</code> renders the
        message.
      </p>

      {/* 2. Live preview */}
      <div className="w-80">
        <FieldContent size="base" required error="Enter a valid email address.">
          <FieldLabel>Email</FieldLabel>
          <FieldControl>
            <Input defaultValue="wrong@" />
          </FieldControl>
          <FieldError />
        </FieldContent>
      </div>

      {/* 3. Code snippet */}
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent size="base" required error="Enter a valid email address.">
  <FieldLabel>Email</FieldLabel>
  <FieldControl>
    <Input defaultValue="wrong@" />
  </FieldControl>
  <FieldError />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
```

---

## Primitives for Docs

Always define these primitives inside `Guide.stories.jsx` before the story:

```jsx
const Section = ({ title, description, children }) => (
  <div className="mb-12">
    <h2 className="text-xl font-semibold text-gray-900 mb-1">{title}</h2>
    {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
    <hr className="mb-5 border-gray-200" />
    {children}
  </div>
)

const SubSection = ({ title, description, children }) => (
  <div className="mb-8">
    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">{title}</h3>
    {description && <p className="text-xs text-gray-500 mb-3">{description}</p>}
    {children}
  </div>
)

const Preview = ({ children }) => (
  <div className="flex flex-col gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg mb-3 w-80">
    {children}
  </div>
)

const Code = ({ children }) => (
  <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto mb-4 leading-relaxed">
    <code>{children}</code>
  </pre>
)

const Tag = ({ children, color = 'gray' }) => {
  const colors = {
    gray: 'bg-gray-100 text-gray-600',
    violet: 'bg-violet-100 text-violet-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
  }
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-medium ${colors[color]}`}
    >
      {children}
    </span>
  )
}
```

---

## Anatomy Section

The **Anatomy** section goes immediately after **Overview**. It shows every composable part of the component visually and as a parts table.

### Structure

```
1. Box diagram    — dashed-border outlines showing part boundaries and hierarchy
2. Parts table    — table listing Part, Element, and Description for each named part
3. Source code    — copy-ready JSX showing all parts together
```

### 1. Box Diagram

Use colored dashed borders to outline each composable part. Each box shows:

- A small label in the top-left corner with the part name
- Nested boxes for nested hierarchy

Show multiple state panels side-by-side when the component has distinct visual states (e.g. Closed / Open, Day View / Month View / Year View). Label each panel with a small monospace caption above it.

| Part type        | Border color class  | Label color       |
| ---------------- | ------------------- | ----------------- |
| Root component   | `border-violet-400` | `text-violet-600` |
| Core component   | `border-blue-300`   | `text-blue-500`   |
| Internal part    | `border-slate-300`  | `text-slate-400`  |
| Interactive part | `border-violet-300` | `text-violet-500` |
| Optional part    | `border-green-300`  | `text-green-500`  |

**Template:**

```jsx
{
  /* Wrap all panels in a gray card */
}
;<div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4">
  <div className="flex flex-wrap gap-8">
    {/* Panel: one state or view */}
    <div className="flex flex-col gap-2">
      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wide mb-1">
        State Label
      </span>

      {/* Root component */}
      <div className="relative p-4 border-2 border-dashed border-violet-400 rounded-xl inline-block">
        <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-[10px] font-mono font-semibold text-violet-600">
          ComponentName
        </span>

        {/* Internal part */}
        <div className="relative p-3 border border-dashed border-slate-300 rounded-lg mt-2">
          <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-slate-400">
            PartName
          </span>
          {/* mock content */}
        </div>

        {/* Optional part */}
        <div className="relative p-3 border border-dashed border-green-300 rounded-lg mt-2">
          <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-green-500">
            OptionalPart
          </span>
        </div>
      </div>
    </div>
  </div>
</div>
```

### 2. Parts Table

A table listing every named part. Columns: **Part**, **Element**, **Description**.

```jsx
<div className="overflow-x-auto mb-4">
  <table className="w-full text-sm border-collapse">
    <thead>
      <tr className="bg-gray-50">
        {['Part', 'Element', 'Description'].map((h) => (
          <th
            key={h}
            className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700 text-xs uppercase tracking-wide"
          >
            {h}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {[
        ['PartName', '<element>', 'What this part does.'],
        ['OtherPart', '<element>', 'What this part does.'],
      ].map(([part, el, desc]) => (
        <tr key={part} className="even:bg-gray-50">
          <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
            {part}
          </td>
          <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400 whitespace-nowrap">
            {el}
          </td>
          <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">{desc}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

### 3. Source Code

Show JSX for all parts assembled together — both the props shortcut form and the sub-component form if both exist.

```jsx
<Code>{`{/* Props shortcut */}
<ComponentName propA="..." propB="..." />

{/* Sub-components */}
<ComponentName>
  <SubPartA />
  <SubPartB />
</ComponentName>`}</Code>
```

---

## Full Docs Template

```jsx
import ComponentName from './ComponentName'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Field/ComponentName',
}

export default meta

// ─── Primitives ──────────────────────────────────────────────────────────────

const Section = ({ title, description, children }) => ( ... )
const SubSection = ({ title, description, children }) => ( ... )
const Preview = ({ children }) => ( ... )
const Code = ({ children }) => ( ... )
const Tag = ({ children, color = 'gray' }) => ( ... )

// ─── Story ───────────────────────────────────────────────────────────────────

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="p-8 max-w-4xl font-sans text-gray-900">

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">ComponentName</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          Short description of the component.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <Preview>
          {/* usage example */}
        </Preview>
      </Section>

      {/* Variants / main features */}
      <Section title="Variants" description="...">
        <SubSection title="Default">
          <Preview>...</Preview>
        </SubSection>
        <SubSection title="Props — ComponentName">
          {/* props table */}
        </SubSection>
      </Section>

      {/* Usage */}
      <Section title="Usage Examples">
        <SubSection title="Basic">
          <Code>{`...`}</Code>
        </SubSection>
      </Section>

    </div>
  ),
}
```

---

## Props Table Template

```jsx
<div className="overflow-x-auto mb-6">
  <table className="w-full text-sm border-collapse">
    <thead>
      <tr className="bg-gray-50">
        {['Prop', 'Type', 'Default', 'Description'].map((h) => (
          <th
            key={h}
            className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700"
          >
            {h}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {[
        ['propName', '"a" | "b"', '"a"', 'Prop description'],
        ['className', 'string', '—', 'Additional CSS classes'],
        ['children', 'ReactNode', '—', 'Content'],
      ].map(([prop, type, def, desc]) => (
        <tr key={prop} className="even:bg-gray-50">
          <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
            {prop}
          </td>
          <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500 max-w-xs">
            {type}
          </td>
          <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400">
            {def}
          </td>
          <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">{desc}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

---

## Component Story Template

Every story **must** have three parts in order:

1. **Information guide** — brief explanation of what the story demonstrates
2. **Live preview** — rendered component
3. **Code snippet** — copy-ready JSX

```jsx
import ComponentName from './ComponentName'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Field/ComponentName',
}

export default meta

export const StoryName = {
  name: 'Story Name',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* 1. Information guide */}
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Short explanation of what this story shows and when to use it.
      </p>

      {/* 2. Live preview */}
      <div className="...">
        <ComponentName />
      </div>

      {/* 3. Code snippet */}
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<ComponentName />`}</code>
      </pre>
    </div>
  ),
}
```

### Guide content rules

- Keep it short and to the point — no need to be lengthy
- Mention the key props or behavior being demonstrated
- Use inline `<code>` for component or prop names
- If the story shows multiple variants, one guide at the top is enough — not one per variant

---

## Story Ordering (`preview.js`)

Sidebar order is controlled via `storySort` in `.storybook/preview.js`. `Docs` is always first, followed by specific story names, then `*` for the rest.

```js
options: {
  storySort: {
    order: [
      'Input',
      [
        'Button', ['Docs', '*'],
        'Field',  ['Docs', '*'],
        'Input',  ['Docs', 'Input Field', '*'],
      ],
    ],
  },
},
```

**Rules:**

- `'Docs'` is always the first entry in the child array
- Add specific story names when a particular order is required
- `'*'` catches all stories not explicitly listed

---

## Naming Conventions

| Item            | Convention                                     |
| --------------- | ---------------------------------------------- |
| File            | `ComponentName.stories.jsx`                    |
| Meta title      | `'Folder/Subfolder/Component Name'`            |
| Export variable | PascalCase — `ErrorState`, `GapVariants`       |
| Story `name`    | Title Case — `'Error State'`, `'Gap Variants'` |
| Docs export     | Always `export const Docs`                     |

---

## Import Paths

```jsx
// Inside Field/ → import other Field components
import FieldContent from './FieldContent'
import FieldControl from './FieldControl'

// Inside Field/ → import Input or Textarea
import Input from '../Input/Input'
import Textarea from '../Input/Textarea'

// Inside Input/ → import Field components
import FieldContent from '../Field/FieldContent'
import FieldControl from '../Field/FieldControl'
```
