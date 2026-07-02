import {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonBadge,
  SkeletonButton,
  SkeletonCard,
} from './Skeleton'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Skeleton',
}

export default meta

// ─── Primitives ───────────────────────────────────────────────────────────────

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
  <div className="flex flex-col gap-3 p-5 bg-gray-50 border border-gray-200 rounded-lg mb-3">
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
  }
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-medium ${colors[color]}`}
    >
      {children}
    </span>
  )
}

// ─── Story ────────────────────────────────────────────────────────────────────

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="p-8 max-w-4xl font-sans text-gray-900">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Skeleton</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          Loading placeholder components. A hybrid API: a flexible base{' '}
          <code className="font-mono text-sm">Skeleton</code> controlled entirely via{' '}
          <code className="font-mono text-sm">className</code>, plus preset helpers for common
          shapes (text, avatar, badge, button, card). Supports pulse, wave, and no animation.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          Use the base <code className="font-mono text-xs bg-gray-100 px-1 rounded">Skeleton</code>{' '}
          when you need a freeform placeholder — pass any Tailwind classes for size and shape. Use
          presets (<code className="font-mono text-xs bg-gray-100 px-1 rounded">SkeletonCard</code>,{' '}
          <code className="font-mono text-xs bg-gray-100 px-1 rounded">SkeletonText</code>, etc.) to
          drop in ready-made shapes without building them each time.
        </p>
        <Preview>
          <div className="flex flex-col gap-5">
            <SkeletonCard animation="pulse" />
            <div className="flex items-center gap-3">
              <SkeletonAvatar size="default" animation="pulse" />
              <div className="flex flex-col gap-2 flex-1">
                <Skeleton animation="pulse" className="h-3.5 w-36 rounded" />
                <Skeleton animation="pulse" className="h-3 w-24 rounded" />
              </div>
              <SkeletonBadge animation="pulse" />
            </div>
          </div>
        </Preview>
      </Section>

      {/* Anatomy */}
      <Section title="Anatomy">
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4">
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wide block mb-3">
            Structure
          </span>
          <div className="flex flex-col gap-3">
            {/* Base */}
            <div className="relative p-3 border-2 border-dashed border-violet-400 rounded-xl">
              <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-[10px] font-mono font-semibold text-violet-600">
                Skeleton (base)
              </span>
              <p className="text-[10px] font-mono text-gray-400 mt-1">
                shape via className — h-*, w-*, rounded-*
              </p>
            </div>

            {/* Presets */}
            <div className="relative p-3 border border-dashed border-violet-300 rounded-xl">
              <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-violet-500">
                Presets — built on Skeleton
              </span>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {[
                  ['SkeletonText', 'Skeleton × lines'],
                  ['SkeletonAvatar', 'Skeleton rounded-full'],
                  ['SkeletonBadge', 'Skeleton rounded-full narrow'],
                  ['SkeletonButton', 'Skeleton rounded-lg button proportions'],
                  ['SkeletonCard', 'avatar + title + SkeletonText'],
                ].map(([name, desc]) => (
                  <div
                    key={name}
                    className="flex flex-col gap-0.5 px-2 py-1.5 bg-white border border-gray-200 rounded-lg"
                  >
                    <span className="text-[10px] font-mono text-violet-700">{name}</span>
                    <span className="text-[10px] text-gray-400">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Parts table */}
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {['Export', 'Element', 'Description'].map((h) => (
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
                ['Skeleton', '<div aria-hidden>', 'Base. Shape fully controlled by className.'],
                [
                  'SkeletonText',
                  '<div> + Skeleton × lines',
                  'Stacked text line placeholders. Last line narrower.',
                ],
                [
                  'SkeletonAvatar',
                  'Skeleton rounded-full',
                  'Circular avatar placeholder. 4 sizes.',
                ],
                ['SkeletonBadge', 'Skeleton rounded-full', 'Narrow badge-shaped placeholder.'],
                [
                  'SkeletonButton',
                  'Skeleton rounded-lg',
                  'Button-proportioned placeholder. 3 sizes.',
                ],
                [
                  'SkeletonCard',
                  'Skeleton composition',
                  'Ready-made card: avatar + title + body lines.',
                ],
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

        <Code>{`{/* Base — freestyle */}
<Skeleton className="h-4 w-48 rounded" animation="wave" />
<Skeleton className="size-10 rounded-full" animation="pulse" />

{/* Presets */}
<SkeletonText lines={3} width="75%" animation="wave" />
<SkeletonAvatar size="lg" />
<SkeletonButton size="default" />
<SkeletonBadge />
<SkeletonCard />`}</Code>
      </Section>

      {/* Usage */}
      <Section title="Usage">
        <SubSection title="Import">
          <Code>{`import {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonBadge,
  SkeletonButton,
  SkeletonCard,
} from '@/components/base/Skeleton/Skeleton'`}</Code>
        </SubSection>

        <SubSection title="Base — freestyle shapes">
          <Code>{`{/* Any shape via className */}
<Skeleton className="h-4 w-48 rounded" />
<Skeleton className="h-32 w-full rounded-xl" />
<Skeleton className="size-10 rounded-full" />
<Skeleton className="h-4 w-48 rounded" animation="wave" />`}</Code>
        </SubSection>

        <SubSection title="Presets">
          <Code>{`<SkeletonText lines={3} width="75%" />
<SkeletonAvatar size="lg" />
<SkeletonButton size="default" />
<SkeletonBadge />
<SkeletonCard lines={3} />`}</Code>
        </SubSection>

        <SubSection title="Composing — list item">
          <Code>{`<div className="flex items-center gap-3">
  <SkeletonAvatar size="default" />
  <div className="flex flex-col gap-2 flex-1">
    <Skeleton className="h-3.5 w-32 rounded" />
    <Skeleton className="h-3 w-48 rounded" />
  </div>
</div>`}</Code>
        </SubSection>

        <SubSection title="With conditional loading">
          <Code>{`{isLoading ? (
  <SkeletonCard animation="wave" />
) : (
  <TradeCard trade={trade} />
)}`}</Code>
        </SubSection>
      </Section>

      {/* Animation */}
      <Section title="Animation">
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {['Value', 'Effect', 'Implementation'].map((h) => (
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
                ['pulse', 'Opacity fades in and out', 'Tailwind animate-pulse'],
                [
                  'wave',
                  'Shimmer sweeps left to right',
                  'CSS gradient background-position animation',
                ],
                ['none', 'Static — no animation', 'No animation class applied'],
              ].map(([val, effect, impl]) => (
                <tr key={val} className="even:bg-gray-50">
                  <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs">
                    {val}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">
                    {effect}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-xs text-gray-500">{impl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* API Reference */}
      <Section title="API Reference">
        <SubSection
          title="Skeleton"
          description="Base component. Shape fully controlled by className."
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
                  ['animation', "'pulse' | 'wave' | 'none'", "'pulse'", 'Loading animation style.'],
                  ['className', 'string', '—', 'Controls shape — h-*, w-*, rounded-*, etc.'],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs">
                      {prop}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500">
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

        <SubSection
          title="SkeletonText"
          description="Stacked text-line placeholders. Last line is 60% of width."
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
                  ['lines', 'number', '3', 'Number of text line placeholders to render.'],
                  [
                    'width',
                    'string',
                    "'100%'",
                    'Width of all lines except the last. Last line = 60% of this.',
                  ],
                  [
                    'animation',
                    "'pulse' | 'wave' | 'none'",
                    "'pulse'",
                    'Animation passed down to each Skeleton.',
                  ],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs">
                      {prop}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500">
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

        <SubSection title="SkeletonAvatar" description="Circular avatar placeholder.">
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
                    'size',
                    "'sm' | 'default' | 'lg' | 'xl'",
                    "'default'",
                    'Avatar size: sm=24px, default=32px, lg=40px, xl=56px.',
                  ],
                  ['animation', "'pulse' | 'wave' | 'none'", "'pulse'", 'Animation.'],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs">
                      {prop}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500">
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

        <SubSection title="SkeletonButton" description="Button-proportioned placeholder.">
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
                    'size',
                    "'sm' | 'default' | 'lg'",
                    "'default'",
                    'Button size: sm=h-8, default=h-9, lg=h-10.',
                  ],
                  ['animation', "'pulse' | 'wave' | 'none'", "'pulse'", 'Animation.'],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs">
                      {prop}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500">
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

        <SubSection title="SkeletonCard" description="Ready-made card skeleton.">
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
                  ['lines', 'number', '3', 'Number of body text lines below the header.'],
                  [
                    'animation',
                    "'pulse' | 'wave' | 'none'",
                    "'pulse'",
                    'Animation passed to all internal Skeleton elements.',
                  ],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs">
                      {prop}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500">
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

      {/* When to Use */}
      <Section title="When to Use">
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {['Use Skeleton when…', 'Consider an alternative when…'].map((h) => (
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
              <tr>
                <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700 align-top">
                  <ul className="flex flex-col gap-1.5">
                    <li>
                      The content has a known, predictable shape (card, list row, text block) that
                      can be mirrored as a placeholder
                    </li>
                    <li>
                      The data fetch takes 200 ms or longer — skeleton prevents layout shift and
                      gives users a sense of progress
                    </li>
                    <li>
                      You are loading a list of items and want to reserve the correct amount of
                      space before data arrives
                    </li>
                  </ul>
                </td>
                <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700 align-top">
                  <ul className="flex flex-col gap-1.5">
                    <li>
                      Use <strong>Spinner</strong> when the load time is indeterminate or the
                      content shape is unknown (e.g. a file upload, a background job)
                    </li>
                    <li>
                      Use <strong>nothing</strong> (no placeholder at all) when the operation
                      consistently resolves in under 200 ms — flashing a skeleton for that duration
                      is worse than showing nothing
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Dos & Don'ts */}
      <Section title="Dos & Don'ts">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="size-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                ✓
              </span>
              <span className="text-sm font-semibold text-green-700">Do</span>
            </div>
            <div className="space-y-3">
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <p className="text-xs text-green-800">
                  Match the skeleton shape to the real content — use the same width, height, and
                  border-radius as the element it replaces so there is no layout shift when data
                  loads.
                </p>
              </div>
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <p className="text-xs text-green-800">
                  Use a preset (SkeletonCard, SkeletonText, SkeletonAvatar) for common shapes and
                  only reach for the base Skeleton when you need a freeform size that no preset
                  covers.
                </p>
              </div>
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <p className="text-xs text-green-800">
                  Keep animation consistent within a single loading state — pick either pulse or
                  wave for all skeletons on the same surface so they feel like one cohesive
                  placeholder.
                </p>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="size-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
                ✕
              </span>
              <span className="text-sm font-semibold text-red-700">Don't</span>
            </div>
            <div className="space-y-3">
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <p className="text-xs text-red-800">
                  Don't use Skeleton for operations under 200 ms — showing a brief flash of
                  placeholder before immediately replacing it with content is more disorienting than
                  simply waiting for the data.
                </p>
              </div>
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <p className="text-xs text-red-800">
                  Don't place interactive elements (buttons, links) inside a skeleton block —
                  skeletons are purely decorative placeholders and must be aria-hidden; users should
                  never be able to interact with them.
                </p>
              </div>
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <p className="text-xs text-red-800">
                  Don't mix pulse and wave on the same screen — inconsistent animation styles within
                  a single loading state look unpolished and suggest multiple unrelated loading
                  phases.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  ),
}
