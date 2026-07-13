import { Star, CheckCircle2, Clock, AlertCircle, X } from 'lucide-react'
import { Badge } from './Badge'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Badge',
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

// ─── Story ───────────────────────────────────────────────────────────────────

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="p-8 max-w-4xl font-sans text-gray-900">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Badge</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A small inline label used to highlight status, category, or metadata. Single component —
          no sub-parts. Supports four semantic variants, five sizes, and seven border-radius
          options. Compose with any icon or text as children.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <div className="flex flex-wrap items-center gap-2 p-4 bg-gray-50 border border-gray-200 rounded-lg mb-3">
          <Badge variant="default">Active</Badge>
          <Badge variant="secondary">Draft</Badge>
          <Badge variant="destructive">Error</Badge>
          <Badge variant="outline">Pending</Badge>
          <Badge variant="default">
            <CheckCircle2 />
            Verified
          </Badge>
          <Badge size="lg" variant="secondary">
            Large
          </Badge>
          <Badge radius="md" variant="outline">
            Rounded
          </Badge>
        </div>
        <Code>{`import { Badge } from '@/components/base/Badge/Badge'

<Badge variant="default">Active</Badge>
<Badge variant="secondary">Draft</Badge>
<Badge size="lg" radius="md">Large Rounded</Badge>`}</Code>
      </Section>

      {/* Anatomy */}
      <Section title="Anatomy">
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4">
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wide mb-1">
                Badge structure
              </span>

              {/* Root — Badge */}
              <div className="relative p-4 pt-7 border-2 border-dashed border-violet-400 rounded-xl inline-flex items-center gap-3">
                <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-[10px] font-mono font-semibold text-violet-600">
                  Badge
                </span>

                {/* Optional icon left */}
                <div className="relative flex items-center justify-center border border-dashed border-green-300 rounded p-2 pt-5 min-w-[58px]">
                  <span className="absolute top-1 left-1.5 text-[10px] font-mono text-green-500 whitespace-nowrap">
                    icon (opt)
                  </span>
                  <Star size={12} className="text-gray-400" />
                </div>

                {/* Core — label */}
                <div className="relative border border-dashed border-blue-300 rounded px-3 py-1.5 pt-5">
                  <span className="absolute top-1 left-1.5 text-[10px] font-mono text-blue-500 whitespace-nowrap">
                    label
                  </span>
                  <span className="text-xs font-medium text-gray-700">Badge</span>
                </div>

                {/* Optional icon right */}
                <div className="relative flex items-center justify-center border border-dashed border-green-300 rounded p-2 pt-5 min-w-[58px]">
                  <span className="absolute top-1 left-1.5 text-[10px] font-mono text-green-500 whitespace-nowrap">
                    icon (opt)
                  </span>
                  <X size={12} className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-4">
          {[
            { border: 'border-violet-400', text: 'text-violet-600', label: 'Root (Badge)' },
            { border: 'border-blue-300', text: 'text-blue-500', label: 'Core part' },
            { border: 'border-green-300', text: 'text-green-500', label: 'Optional part' },
          ].map(({ border, text, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className={`inline-block w-4 h-4 border-2 border-dashed rounded ${border}`} />
              <span className={`text-[10px] font-mono ${text}`}>{label}</span>
            </div>
          ))}
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
                [
                  'Badge',
                  '<span>',
                  'The outer container. Renders as a span by default, or the child element when asChild is used.',
                ],
                [
                  'icon (optional)',
                  '<svg>',
                  'Any SVG placed before or after the label. Auto-sized to 12px via [&>svg]:size-3.',
                ],
                ['label', 'text', 'Text content inside the badge. Keep it short — 1 to 3 words.'],
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

        <Code>{`{/* Basic badge */}
<Badge variant="default">Active</Badge>

{/* With icon left */}
<Badge variant="default">
  <CheckCircle2 />
  Verified
</Badge>

{/* With icon right */}
<Badge variant="destructive">
  Error
  <X />
</Badge>

{/* As a link (asChild) */}
<Badge asChild variant="outline">
  <a href="/details">View Details</a>
</Badge>`}</Code>
      </Section>

      {/* Variants */}
      <Section
        title="Variants"
        description="Four semantic variants map to different levels of emphasis and meaning."
      >
        <div className="flex flex-col gap-5 mb-4">
          {[
            {
              variant: 'default',
              desc: 'Primary emphasis — active states, success, or the primary category.',
              labels: ['Active', 'Published', 'New'],
            },
            {
              variant: 'secondary',
              desc: 'Low emphasis — neutral states, drafts, or supplemental info.',
              labels: ['Draft', 'Archived', 'Beta'],
            },
            {
              variant: 'destructive',
              desc: 'Danger or error — failed states, critical warnings.',
              labels: ['Error', 'Failed', 'Expired'],
            },
            {
              variant: 'outline',
              desc: 'Minimal emphasis — pending states, optional info, or tags.',
              labels: ['Pending', 'Review', 'Optional'],
            },
          ].map(({ variant, desc, labels }) => (
            <div key={variant} className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <code className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                  {variant}
                </code>
                <span className="text-xs text-gray-500">{desc}</span>
              </div>
              <div className="flex flex-wrap gap-2 pl-1">
                {labels.map((label) => (
                  <Badge key={label} variant={variant}>
                    {label}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
        <Code>{`<Badge variant="default">Active</Badge>
<Badge variant="secondary">Draft</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Pending</Badge>`}</Code>
      </Section>

      {/* Size */}
      <Section title="Size" description="Five sizes control padding and font size. Default is md.">
        <div className="flex flex-col gap-4 mb-4">
          {[
            { size: 'xs', classes: 'px-1.5 py-0 text-[10px]' },
            { size: 'sm', classes: 'px-2 py-px text-xs' },
            { size: 'base', classes: 'px-2 py-0.5 text-xs — default' },
            { size: 'lg', classes: 'px-2.5 py-0.5 text-sm' },
            { size: 'xl', classes: 'px-3 py-1 text-sm' },
          ].map(({ size, classes }) => (
            <div key={size} className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <code className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded w-8">
                  {size}
                </code>
                <span className="text-xs text-gray-400">{classes}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 pl-1">
                <Badge size={size} variant="default">
                  Active
                </Badge>
                <Badge size={size} variant="secondary">
                  Draft
                </Badge>
                <Badge size={size} variant="destructive">
                  Error
                </Badge>
                <Badge size={size} variant="outline">
                  Pending
                </Badge>
              </div>
            </div>
          ))}
        </div>
        <Code>{`<Badge size="xs">Active</Badge>
<Badge size="sm">Active</Badge>
<Badge size="base">Active</Badge>   {/* default */}
<Badge size="lg">Active</Badge>
<Badge size="xl">Active</Badge>`}</Code>
      </Section>

      {/* Radius */}
      <Section
        title="Radius"
        description="Seven radius options ranging from sharp corners to a pill shape. Default is full."
      >
        <div className="flex flex-col gap-4 mb-4">
          {[
            { radius: 'none', desc: 'rounded-none — sharp corners' },
            { radius: 'xs', desc: 'rounded-sm — 2px' },
            { radius: 'sm', desc: 'rounded — 4px' },
            { radius: 'base', desc: 'rounded-md — 6px' },
            { radius: 'md', desc: 'rounded-lg — 8px' },
            { radius: 'lg', desc: 'rounded-xl — 12px' },
            { radius: 'full', desc: 'rounded-full — pill shape (default)' },
          ].map(({ radius, desc }) => (
            <div key={radius} className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <code className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded w-10">
                  {radius}
                </code>
                <span className="text-xs text-gray-400">{desc}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 pl-1">
                <Badge radius={radius} variant="default">
                  Active
                </Badge>
                <Badge radius={radius} variant="secondary">
                  Draft
                </Badge>
                <Badge radius={radius} variant="outline">
                  Pending
                </Badge>
              </div>
            </div>
          ))}
        </div>
        <Code>{`<Badge radius="none">Active</Badge>
<Badge radius="xs">Active</Badge>
<Badge radius="sm">Active</Badge>
<Badge radius="base">Active</Badge>
<Badge radius="md">Active</Badge>
<Badge radius="lg">Active</Badge>
<Badge radius="full">Active</Badge>  {/* default */}`}</Code>
      </Section>

      {/* With Icon */}
      <Section
        title="With Icon"
        description="Drop any SVG icon as a sibling of the label text. Icons are auto-sized to 12px and spaced via gap-1."
      >
        <SubSection title="Icon Left">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="default">
              <CheckCircle2 />
              Active
            </Badge>
            <Badge variant="secondary">
              <Clock />
              Pending
            </Badge>
            <Badge variant="destructive">
              <AlertCircle />
              Error
            </Badge>
            <Badge variant="outline">
              <Star />
              Saved
            </Badge>
          </div>
        </SubSection>
        <SubSection title="Icon Right">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="default">
              Active
              <CheckCircle2 />
            </Badge>
            <Badge variant="secondary">
              Close
              <X />
            </Badge>
            <Badge variant="destructive">
              Remove
              <X />
            </Badge>
            <Badge variant="outline">
              Saved
              <Star />
            </Badge>
          </div>
        </SubSection>
        <Code>{`{/* Icon left */}
<Badge variant="default"><CheckCircle2 />Active</Badge>
<Badge variant="destructive"><AlertCircle />Error</Badge>

{/* Icon right */}
<Badge variant="secondary">Close<X /></Badge>`}</Code>
      </Section>

      {/* As Child */}
      <Section
        title="As Child"
        description="Pass asChild to merge badge styles onto the child element — useful for rendering a badge as a link or button without losing semantics."
      >
        <div className="flex flex-wrap items-center gap-2 p-4 bg-gray-50 border border-gray-200 rounded-lg mb-3">
          <Badge asChild variant="default">
            <a href="#">View Details</a>
          </Badge>
          <Badge asChild variant="secondary">
            <a href="#">Learn More</a>
          </Badge>
          <Badge asChild variant="outline">
            <button type="button">Dismiss</button>
          </Badge>
        </div>
        <Code>{`<Badge asChild variant="default">
  <a href="/details">View Details</a>
</Badge>

<Badge asChild variant="destructive">
  <button type="button" onClick={handleRemove}>Remove</button>
</Badge>`}</Code>
      </Section>

      {/* Best Practices */}
      <Section title="Best Practices">
        <div className="flex flex-col gap-8">
          {[
            {
              heading: 'When to use',
              items: [
                {
                  title: 'Short, non-interactive status labels next to items in a list or table',
                  body: 'Active, Draft, Error, Published — 1–3 words that communicate state at a glance without requiring the user to click or interact with the badge.',
                },
                {
                  title: 'Numeric count or notification indicators on icons or nav items',
                  body: 'e.g. "3 new", "12 unread". The badge communicates quantity compactly and is instantly recognizable as a count indicator.',
                },
                {
                  title: 'Category or metadata labels on cards and headings',
                  body: "Labels that users read but don't click — feature flags, content types, or plan tier labels that provide context without triggering navigation.",
                },
              ],
            },
            {
              heading: 'When not to use',
              items: [
                {
                  title: "Don't use as a primary action button",
                  body: 'Use Button instead. Badge has no interactive semantics by default — a span with onClick is inaccessible. Use asChild with a button element if the badge must trigger an action.',
                },
                {
                  title: "Don't use for clickable filter tags",
                  body: 'Filter chips that toggle state need a dedicated interactive component with keyboard focus, checked state, and ARIA role. Badge is a static label, not an input control.',
                },
                {
                  title: "Don't put long text in a badge",
                  body: 'Keep it 1–3 words max. Longer text breaks the visual pattern users expect from a badge and reduces scannability. Use a label or description element for longer status text.',
                },
              ],
            },
            {
              heading: 'Accessibility',
              items: [
                {
                  title: 'Add aria-label when the badge conveys critical status',
                  body: 'Badge renders as a <span> with no implicit ARIA role. If the badge is the primary way a status is communicated (e.g. in a table row), add aria-label or a visually-hidden description so screen readers announce it.',
                },
                {
                  title: 'Never rely on color alone to convey meaning',
                  body: 'Always pair color with text or an icon. Users with color blindness cannot distinguish variant="destructive" (red) from variant="default" by color alone — the label or icon carries the meaning.',
                },
                {
                  title: 'When using asChild with a button, ensure it has an accessible label',
                  body: 'If the badge children are icon-only, add aria-label to the button so screen readers can announce what it does. Icon + label combinations are automatically readable without extra attributes.',
                },
              ],
            },
            {
              heading: 'Advice',
              items: [
                {
                  title: 'Pair variant="destructive" with AlertCircle for scannable error states',
                  body: 'The red background plus an icon makes the error state recognizable without reading the label. Users scanning a long list identify errors by shape and color before reading text.',
                },
                {
                  title: 'Use radius="md" or radius="sm" for tag-style chips',
                  body: 'Pill shape (full) suits status labels like Active or Draft. Rounded corners (md/sm) suit tag chips in card footers or form fields where they need to blend with surrounding UI elements.',
                },
                {
                  title: 'Apply hover styles to asChild link badges',
                  body: 'Badge styling alone (no text-decoration, no cursor change) can be mistaken for a static label. Add hover:underline or hover:opacity-80 so the badge reads as clearly interactive when used as a link.',
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

      {/* API Reference */}
      <Section title="API Reference">
        <SubSection
          title="Badge"
          description="Single component — all props apply directly. Forwards all native span props."
        >
          <div className="overflow-x-auto mb-6">
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
                {[
                  [
                    'variant',
                    '"default" | "secondary" | "destructive" | "outline"',
                    '"default"',
                    'Controls the color and semantic meaning.',
                  ],
                  [
                    'size',
                    '"xs" | "sm" | "base" | "lg" | "xl"',
                    '"base"',
                    'Controls padding and font size.',
                  ],
                  [
                    'radius',
                    '"none" | "xs" | "sm" | "base" | "md" | "lg" | "full"',
                    '"full"',
                    'Controls the border-radius style.',
                  ],
                  ['asChild', 'boolean', 'false', 'Merges badge styles onto the child element.'],
                  [
                    'children',
                    'ReactNode',
                    '—',
                    'Badge label text and optional icons placed before or after.',
                  ],
                  ['className', 'string', '—', 'Additional CSS classes merged via cn().'],
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
                    <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">
                      {desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SubSection>
      </Section>
    </div>
  ),
}
