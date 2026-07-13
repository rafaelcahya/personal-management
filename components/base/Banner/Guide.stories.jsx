import { Info, CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react'
import {
  Banner,
  BannerIcon,
  BannerContent,
  BannerTitle,
  BannerDescription,
  BannerAction,
} from './Banner'
import Button from '@/components/base/Button/Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Banner' }
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
          <h1 className="text-3xl font-bold text-gray-900">Banner</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A contextual notification strip used to surface system messages, warnings, or
          confirmations within a page. Supports four semantic variants, an optional dismiss button,
          and a slot for call-to-action buttons. All sub-components read{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant</code> from context —
          set it once on <code className="font-mono bg-gray-100 px-1 rounded text-xs">Banner</code>{' '}
          and the full color palette cascades automatically.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <div className="flex flex-col gap-3 p-6 border border-gray-200 rounded-xl mb-3">
          <Banner variant="info">
            <BannerIcon icon={Info} />
            <BannerContent>
              <BannerTitle>Update available</BannerTitle>
              <BannerDescription>Refresh to get the latest features and fixes.</BannerDescription>
            </BannerContent>
          </Banner>
          <Banner variant="success">
            <BannerIcon icon={CheckCircle} />
            <BannerContent>
              <BannerTitle>Trade executed successfully</BannerTitle>
              <BannerDescription>
                Your order for 100 shares of BBCA has been filled.
              </BannerDescription>
            </BannerContent>
          </Banner>
          <Banner variant="warning" dismissible>
            <BannerIcon icon={AlertTriangle} />
            <BannerContent>
              <BannerTitle>Stock below threshold</BannerTitle>
              <BannerDescription>BBCA has only 2 units remaining.</BannerDescription>
              <BannerAction>
                <Button size="sm" variant="outline">
                  Restock
                </Button>
              </BannerAction>
            </BannerContent>
          </Banner>
          <Banner variant="danger" dismissible>
            <BannerIcon icon={XCircle} />
            <BannerContent>
              <BannerTitle>Failed to save changes</BannerTitle>
              <BannerDescription>Check your connection and try again.</BannerDescription>
            </BannerContent>
          </Banner>
        </div>
        <Code>{`import { AlertTriangle } from 'lucide-react'
import {
  Banner, BannerIcon, BannerContent,
  BannerTitle, BannerDescription, BannerAction,
} from '@/components/base/Banner/Banner'

<Banner variant="warning" dismissible onDismiss={() => setShow(false)}>
  <BannerIcon icon={AlertTriangle} />
  <BannerContent>
    <BannerTitle>Stock below threshold</BannerTitle>
    <BannerDescription>BBCA has only 2 units remaining.</BannerDescription>
    <BannerAction>
      <Button size="sm" variant="outline">Restock</Button>
    </BannerAction>
  </BannerContent>
</Banner>`}</Code>
      </Section>

      {/* Anatomy */}
      <Section title="Anatomy">
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4 overflow-x-auto">
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wide mb-1">
                Full structure
              </span>

              {/* Root — Banner */}
              <div className="relative p-4 pt-7 border-2 border-dashed border-violet-400 rounded-xl inline-flex items-start gap-3 min-w-[520px]">
                <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-[10px] font-mono font-semibold text-violet-600">
                  Banner
                </span>

                {/* Optional — BannerIcon */}
                <div className="relative flex items-center justify-center border border-dashed border-green-300 rounded p-3 pt-6 min-w-[80px] self-stretch">
                  <span className="absolute top-1 left-1.5 text-[10px] font-mono text-green-500 whitespace-nowrap">
                    BannerIcon (opt)
                  </span>
                  <Info className="size-4 text-gray-400" />
                </div>

                {/* Core — BannerContent */}
                <div className="relative flex-1 border border-dashed border-blue-300 rounded p-3 pt-5">
                  <span className="absolute top-1 left-1.5 text-[10px] font-mono text-blue-500 whitespace-nowrap">
                    BannerContent
                  </span>
                  <div className="flex flex-col gap-2 mt-1">
                    {/* BannerTitle */}
                    <div className="relative border border-dashed border-slate-300 rounded px-2 py-1 pt-4">
                      <span className="absolute top-0.5 left-1.5 text-[10px] font-mono text-slate-400 whitespace-nowrap">
                        BannerTitle
                      </span>
                      <span className="text-xs font-semibold text-gray-700">
                        Stock below threshold
                      </span>
                    </div>
                    {/* BannerDescription */}
                    <div className="relative border border-dashed border-slate-300 rounded px-2 py-1 pt-4">
                      <span className="absolute top-0.5 left-1.5 text-[10px] font-mono text-slate-400 whitespace-nowrap">
                        BannerDescription
                      </span>
                      <span className="text-xs text-gray-500">
                        BBCA has only 2 units remaining.
                      </span>
                    </div>
                    {/* BannerAction — optional */}
                    <div className="relative border border-dashed border-green-300 rounded px-2 py-1 pt-4">
                      <span className="absolute top-0.5 left-1.5 text-[10px] font-mono text-green-500 whitespace-nowrap">
                        BannerAction (opt)
                      </span>
                      <span className="text-xs font-mono text-gray-400">{'<Button />'}</span>
                    </div>
                  </div>
                </div>

                {/* Optional — BannerClose */}
                <div className="relative flex items-center justify-center border border-dashed border-green-300 rounded p-2 pt-6 min-w-[72px] self-stretch">
                  <span className="absolute top-1 left-1.5 text-[10px] font-mono text-green-500 whitespace-nowrap">
                    BannerClose (opt)
                  </span>
                  <X className="size-3 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-4">
          {[
            { border: 'border-violet-400', text: 'text-violet-600', label: 'Root (Banner)' },
            { border: 'border-blue-300', text: 'text-blue-500', label: 'Core part' },
            { border: 'border-slate-300', text: 'text-slate-400', label: 'Internal part' },
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
                  'Banner',
                  '<div role="alert">',
                  'Root container. Flex row. Provides variant context to all children.',
                ],
                [
                  'BannerIcon',
                  '<span>',
                  'Optional shrink-0 icon slot on the left. Receives a Lucide icon via the icon prop.',
                ],
                [
                  'BannerContent',
                  '<div>',
                  'Flex-1 content area. Stacks BannerTitle, BannerDescription, and BannerAction vertically.',
                ],
                ['BannerTitle', '<p>', 'Bold title line. Reads variant color from Banner context.'],
                [
                  'BannerDescription',
                  '<p>',
                  'Body text below the title. Reads variant color from Banner context.',
                ],
                [
                  'BannerAction',
                  '<div>',
                  'Optional slot for CTA buttons. Renders below BannerDescription with mt-2 gap.',
                ],
                [
                  'BannerClose',
                  '<button>',
                  'Auto-rendered when dismissible=true. Calls onDismiss on click. Has aria-label="Dismiss".',
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

        <Code>{`{/* Minimal — icon + title + description */}
<Banner variant="info">
  <BannerIcon icon={Info} />
  <BannerContent>
    <BannerTitle>Update available</BannerTitle>
    <BannerDescription>Refresh to get the latest features.</BannerDescription>
  </BannerContent>
</Banner>

{/* Full — with action + dismissible */}
<Banner variant="warning" dismissible onDismiss={() => setShow(false)}>
  <BannerIcon icon={AlertTriangle} position="top" />
  <BannerContent>
    <BannerTitle>Stock below threshold</BannerTitle>
    <BannerDescription>BBCA has only 2 units remaining.</BannerDescription>
    <BannerAction>
      <Button size="sm" variant="outline">Restock</Button>
    </BannerAction>
  </BannerContent>
</Banner>`}</Code>
      </Section>

      {/* Variants */}
      <Section
        title="Variants"
        description="Four semantic variants map to different levels of urgency. The variant sets the full color palette — background, border, icon, title, description, and close button."
      >
        <div className="flex flex-col gap-3 mb-4">
          {[
            {
              variant: 'info',
              icon: Info,
              title: 'Update available',
              desc: 'A new version is ready. Refresh to get the latest features.',
            },
            {
              variant: 'success',
              icon: CheckCircle,
              title: 'Trade executed',
              desc: 'Your order for 100 shares of BBCA has been filled.',
            },
            {
              variant: 'warning',
              icon: AlertTriangle,
              title: 'Stock below threshold',
              desc: 'BBCA has only 2 units remaining. Consider restocking.',
            },
            {
              variant: 'danger',
              icon: XCircle,
              title: 'Failed to save changes',
              desc: 'Check your connection and try again.',
            },
          ].map(({ variant, icon, title, desc }) => (
            <Banner key={variant} variant={variant}>
              <BannerIcon icon={icon} />
              <BannerContent>
                <BannerTitle>{title}</BannerTitle>
                <BannerDescription>{desc}</BannerDescription>
              </BannerContent>
            </Banner>
          ))}
        </div>
        <Code>{`<Banner variant="info">...</Banner>
<Banner variant="success">...</Banner>
<Banner variant="warning">...</Banner>
<Banner variant="danger">...</Banner>`}</Code>
      </Section>

      {/* Best Practices */}
      <Section title="Best Practices">
        <div className="flex flex-col gap-8">
          {[
            {
              heading: 'When to use',
              items: [
                {
                  title: 'Persistent, page-relevant system messages',
                  body: 'Use Banner when the message stays visible until the user acts — a stock threshold warning, a maintenance notice, a sync status that affects the current workflow.',
                },
                {
                  title: 'Non-blocking status that requires awareness',
                  body: 'Banner keeps the page usable while surfacing important context. If the user needs to acknowledge before proceeding, use a Modal instead.',
                },
                {
                  title: 'Full-width contextual alerts at page or section level',
                  body: 'Banner is designed as a top-of-page or top-of-section strip. Its full-width layout gives it the visual hierarchy to be noticed without blocking the interface.',
                },
              ],
            },
            {
              heading: 'When not to use',
              items: [
                {
                  title: 'Transient feedback like "Saved" or "Copied"',
                  body: 'Use Toast for ephemeral confirmations that auto-dismiss. Banner is for messages that should stay visible until the situation is resolved.',
                },
                {
                  title: 'Blocking confirmations that require user acknowledgment',
                  body: 'Use Modal when the user must acknowledge before continuing — destructive actions, consent prompts. Banner does not block interaction.',
                },
                {
                  title: 'Inside a card, form, or modal',
                  body: 'Banner is a full-width strip — constraining it inside a smaller container breaks its visual hierarchy. Use an inline alert or a styled note div instead.',
                },
              ],
            },
            {
              heading: 'Accessibility',
              items: [
                {
                  title:
                    'Banner renders with role="alert" — use it for genuinely important messages',
                  body: 'Screen readers announce the content immediately on mount. Overusing Banner for low-priority messages will train users to ignore alerts.',
                },
                {
                  title: 'Never rely on color alone to convey severity',
                  body: 'Always pair the variant with a matching icon: Info → info, CheckCircle → success, AlertTriangle → warning, XCircle → danger. Color alone fails users with color blindness.',
                },
                {
                  title: 'Always pair dismissible with onDismiss',
                  body: 'BannerClose has aria-label="Dismiss" built in. A close button with no handler is a broken interaction for keyboard users — manage visibility in parent state.',
                },
              ],
            },
            {
              heading: 'Advice',
              items: [
                {
                  title: 'Use BannerAction with warning and danger variants',
                  body: 'Give users a direct path to resolve the issue. A warning or danger banner with no action is a dead end — always include a Retry, Restock, or Update button.',
                },
                {
                  title: 'Use position="top" on BannerIcon for tall banners',
                  body: 'When the banner has a description plus BannerAction (three or more lines), centering the icon makes it float awkwardly. Top-align it to stay anchored to the title row.',
                },
                {
                  title: 'Override padding via className for compact contexts',
                  body: 'Use className="py-2.5 px-3" when placing banners inside cards or forms where default p-4 adds too much visual weight. Compact is a layout concern, not a variant.',
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
          title="Banner"
          description="Root component. Provides variant context to all children."
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
                    '"info" | "success" | "warning" | "danger"',
                    '"info"',
                    'Controls the full color palette — background, border, icon, text, and close button.',
                  ],
                  [
                    'dismissible',
                    'boolean',
                    'false',
                    'When true, auto-renders BannerClose at the trailing edge.',
                  ],
                  [
                    'onDismiss',
                    '() => void',
                    '—',
                    'Called when BannerClose is clicked. Use to toggle visibility in parent state.',
                  ],
                  [
                    'children',
                    'ReactNode',
                    '—',
                    'BannerIcon, BannerContent, and optionally other Banner sub-components.',
                  ],
                  ['className', 'string', '—', 'Additional CSS classes merged onto the root div.'],
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

        <SubSection
          title="BannerIcon"
          description="Shrink-0 icon slot. Reads variant color from context."
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
                  ['icon', 'LucideIcon', 'required', 'Lucide icon component rendered at size-5.'],
                  [
                    'position',
                    '"center" | "top"',
                    '"center"',
                    '"center" vertically centers the icon with the full content area. "top" aligns it to the title row — use for tall banners.',
                  ],
                  ['className', 'string', '—', 'Additional CSS classes on the icon wrapper span.'],
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

        <SubSection
          title="BannerContent · BannerTitle · BannerDescription · BannerAction · BannerClose"
          description="All accept children and className only. Color tokens are inherited from Banner via context."
        >
          <div className="overflow-x-auto mb-4">
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
                  ['children', 'ReactNode', '—', 'Content to render inside this sub-component.'],
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
          <p className="text-xs text-gray-400">
            Note: <code className="font-mono bg-gray-100 px-1 rounded">BannerClose</code> also
            accepts an <code className="font-mono bg-gray-100 px-1 rounded">onDismiss</code> prop
            directly, but it is typically auto-rendered by{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">Banner</code> when{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">dismissible</code> is set.
          </p>
        </SubSection>
      </Section>
    </div>
  ),
}
