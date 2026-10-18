# Storybook Docs Template (`Guide.stories.jsx`)

One file per component folder. Export must be named `Docs`. Contains the full component documentation.

---

## Template

```jsx
import ComponentName from './ComponentName'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Folder/ComponentName',
}

export default meta

// ─── Primitives ──────────────────────────────────────────────────────────────

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

// ─── Anatomy helpers ──────────────────────────────────────────────────────────
// Border colors by part type:
//   Root component   → border-violet-400 / text-violet-600
//   Core component   → border-blue-300   / text-blue-500
//   Internal part    → border-slate-300  / text-slate-400
//   Interactive part → border-violet-300 / text-violet-500
//   Optional part    → border-green-300  / text-green-500

// ─── Props table helper ───────────────────────────────────────────────────────
const ApiTable = ({ component, rows }) => (
  <div className="mb-6">
    {component && <p className="text-xs font-mono font-semibold text-gray-500 mb-2">{component}</p>}
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-50">
            {['Prop', 'Type', 'Default', 'Description'].map((h) => (
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
          {rows.map(([prop, type, def, desc]) => (
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
  </div>
)

// ─── Story ───────────────────────────────────────────────────────────────────

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="p-8 max-w-4xl font-sans text-gray-900">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">ComponentName</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          Short description of what this component does and where it is used.
        </p>
      </div>

      {/* ── Overview ───────────────────────────────────────────────────────── */}
      <Section title="Overview">
        <Preview>{/* representative usage */}</Preview>
        <Code>{`<ComponentName prop="value" />`}</Code>
      </Section>

      {/* ── Anatomy ────────────────────────────────────────────────────────── */}
      <Section title="Anatomy">
        {/* Box diagram */}
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4">
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wide mb-1">
                State Label
              </span>
              <div className="relative p-4 border-2 border-dashed border-violet-400 rounded-xl inline-block">
                <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-[10px] font-mono font-semibold text-violet-600">
                  ComponentName
                </span>
                <div className="relative p-3 border border-dashed border-slate-300 rounded-lg mt-2">
                  <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-slate-400">
                    PartName
                  </span>
                  {/* mock content */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parts table */}
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
                ['ComponentName', '<div>', 'Root wrapper.'],
                ['PartName', '<element>', 'What this part does.'],
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

        <Code>{`<ComponentName>
  <PartName />
</ComponentName>`}</Code>
      </Section>

      {/* ── Variants / Features ────────────────────────────────────────────── */}
      <Section title="Variants" description="Short description of the variants.">
        <SubSection title="Default">
          <Preview>{/* default state */}</Preview>
        </SubSection>
        <SubSection title="Variant Name">
          <Preview>{/* variant demo */}</Preview>
        </SubSection>
      </Section>

      {/* ── Best Practices ─────────────────────────────────────────────────── */}
      {/*
        Structure: 4 fixed categories in this order:
          1. When to use      — 2–4 cards
          2. When not to use  — 2–4 cards
          3. Accessibility    — 2–3 cards
          4. Advice           — 2–4 cards

        Design rules per card:
          - Card: flex gap-3 p-4 rounded-lg border border-violet-100 bg-violet-50
          - Checkmark: mt-0.5 shrink-0 size-4 rounded-full bg-violet-500 text-white text-[10px] font-bold
          - Title: text-xs font-semibold text-violet-800 mb-0.5
          - Body: text-xs text-violet-700 leading-relaxed
          - Use plain text in title/body (no JSX tags) so .map() works

        Category sub-heading:
          - text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3
      */}
      <Section title="Best Practices">
        <div className="flex flex-col gap-8">
          {[
            {
              heading: 'When to use',
              items: [
                {
                  title: 'Rule title — short imperative sentence',
                  body: 'Explanation of why this rule exists and what breaks if ignored. Be specific to this component.',
                },
              ],
            },
            {
              heading: 'When not to use',
              items: [
                {
                  title: 'Rule title',
                  body: 'Explanation ...',
                },
              ],
            },
            {
              heading: 'Accessibility',
              items: [
                {
                  title: 'Rule title',
                  body: 'Explanation ...',
                },
              ],
            },
            {
              heading: 'Advice',
              items: [
                {
                  title: 'Rule title',
                  body: 'Explanation ...',
                },
              ],
            },
          ].map(({ heading, items }) => (
            <div key={heading}>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                {heading}
              </p>
              <div className="flex flex-col gap-3">
                {items.map(({ title, body }) => (
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
      </Section>

      {/* ── API Reference ──────────────────────────────────────────────────── */}
      <Section title="API Reference">
        <ApiTable
          component="ComponentName"
          rows={[
            ['prop', '"a" | "b"', '"a"', 'Description of this prop.'],
            ['className', 'string', '—', 'Additional CSS classes.'],
            ['children', 'ReactNode', '—', 'Content.'],
          ]}
        />
      </Section>
    </div>
  ),
}
```
