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
          <ApiTable
            rows={[
              ['animation', "'pulse' | 'wave' | 'none'", "'pulse'", 'Loading animation style.'],
              ['className', 'string', '—', 'Controls shape — h-*, w-*, rounded-*, etc.'],
            ]}
          />
        </SubSection>

        <SubSection
          title="SkeletonText"
          description="Stacked text-line placeholders. Last line is 60% of width."
        >
          <ApiTable
            rows={[
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
            ]}
          />
        </SubSection>

        <SubSection title="SkeletonAvatar" description="Circular avatar placeholder.">
          <ApiTable
            rows={[
              [
                'size',
                "'sm' | 'default' | 'lg' | 'xl'",
                "'default'",
                'Avatar size: sm=24px, default=32px, lg=40px, xl=56px.',
              ],
              ['animation', "'pulse' | 'wave' | 'none'", "'pulse'", 'Animation.'],
            ]}
          />
        </SubSection>

        <SubSection title="SkeletonButton" description="Button-proportioned placeholder.">
          <ApiTable
            rows={[
              [
                'size',
                "'sm' | 'default' | 'lg'",
                "'default'",
                'Button size: sm=h-8, default=h-9, lg=h-10.',
              ],
              ['animation', "'pulse' | 'wave' | 'none'", "'pulse'", 'Animation.'],
            ]}
          />
        </SubSection>

        <SubSection title="SkeletonCard" description="Ready-made card skeleton.">
          <ApiTable
            rows={[
              ['lines', 'number', '3', 'Number of body text lines below the header.'],
              [
                'animation',
                "'pulse' | 'wave' | 'none'",
                "'pulse'",
                'Animation passed to all internal Skeleton elements.',
              ],
            ]}
          />
        </SubSection>
      </Section>

      {/* Best Practices */}
      <Section title="Best Practices">
        <div className="flex flex-col gap-8">
          {[
            {
              heading: 'When to use',
              items: [
                {
                  title: 'Content has a known, predictable shape',
                  body: 'Use Skeleton when the content shape (card, list row, text block) can be mirrored as a placeholder and the fetch takes 200ms or longer — it prevents layout shift and gives users a sense of progress.',
                },
                {
                  title: 'Match the skeleton shape to the real element',
                  body: 'Pass the same h-*, w-*, and rounded-* classes as the real element so there is no layout shift when data loads. Even small mismatches cause a jarring reflow.',
                },
                {
                  title: 'Prefer presets over freeform shapes',
                  body: 'Use SkeletonCard, SkeletonText, SkeletonAvatar for common shapes. Only reach for the base Skeleton when no preset covers the exact shape you need.',
                },
              ],
            },
            {
              heading: 'When not to use',
              items: [
                {
                  title: 'Use Spinner when content shape is unknown',
                  body: 'If the content shape is unpredictable (file upload, background job), use a Spinner instead. Skeleton requires a known layout to mirror.',
                },
                {
                  title: 'Skip Skeleton for sub-200ms operations',
                  body: 'A skeleton that flashes and immediately disappears is more disorienting than waiting. Only show a skeleton when the fetch reliably takes 200ms or longer.',
                },
              ],
            },
            {
              heading: 'Accessibility',
              items: [
                {
                  title: 'All Skeleton divs are aria-hidden',
                  body: 'Never place interactive elements (buttons, links) inside a skeleton block. Skeletons are purely decorative placeholders — users must never be able to interact with them.',
                },
              ],
            },
            {
              heading: 'Advice',
              items: [
                {
                  title: 'Always pair with a conditional render',
                  body: '{isLoading ? <SkeletonCard /> : <RealCard />}. The skeleton shape should match the real component exactly — same h-*, w-*, and rounded-* — to avoid layout shift.',
                },
                {
                  title: 'Keep animation consistent on one surface',
                  body: 'Pick either pulse or wave for all skeletons in the same loading state. Mixing them looks unpolished and suggests multiple unrelated load phases.',
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
    </div>
  ),
}
