import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Lock,
  Mail,
  Package,
  ShoppingCart,
  XCircle,
} from 'lucide-react'
import Button from '../Button/Button'
import Card, {
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardHeaderContent,
  CardIcon,
  CardTitle,
} from './Card'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Card',
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

const PropsTable = ({ rows }) => (
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
        {rows.map(([prop, type, def, desc]) => (
          <tr key={prop} className="even:bg-gray-50">
            <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
              {prop}
            </td>
            <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500 max-w-xs">
              {type}
            </td>
            <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400 whitespace-nowrap">
              {def || '—'}
            </td>
            <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">{desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
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
          <h1 className="text-3xl font-bold text-gray-900">Card</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          Container for grouping related information into a single visual unit. Supports seven
          variants, composable sub-components, and a card-in-card layout pattern.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <div className="max-w-sm mb-4">
          <Card>
            <CardHeader>
              <CardIcon icon={ShoppingCart} />
              <CardHeaderContent>
                <CardTitle>Products</CardTitle>
                <CardDescription>All active items in your inventory</CardDescription>
              </CardHeaderContent>
              <CardAction>
                <Button size="md" className="bg-violet-600 hover:bg-violet-700">
                  Add
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-2">
              {['Moisturizer Cetaphil', 'Vitamin C Serum', 'Shampoo Dove'].map((name) => (
                <div
                  key={name}
                  className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0"
                >
                  <span className="text-sm text-slate-700">{name}</span>
                  <span className="text-xs text-slate-400">In stock</span>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <p className="text-xs text-slate-500">3 items · last updated today</p>
            </CardFooter>
          </Card>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          Use <code className="font-mono text-xs bg-gray-100 px-1 rounded">Card</code> to display
          data in any form — tables, forms, stats, alerts, or empty/error states. The{' '}
          <strong>card-in-card</strong> pattern is common: a{' '}
          <code className="font-mono text-xs bg-gray-100 px-1 rounded">transparent</code> Card as a
          section wrapper with{' '}
          <code className="font-mono text-xs bg-gray-100 px-1 rounded">shell</code> Cards inside,
          creating a clear page hierarchy.
        </p>
      </Section>

      {/* Anatomy */}
      <Section title="Anatomy">
        {/* Box diagram */}
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4">
          <div className="relative p-4 border-2 border-dashed border-violet-400 rounded-xl inline-block min-w-[340px]">
            <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-[10px] font-mono font-semibold text-violet-600">
              Card
            </span>

            {/* CardHeader */}
            <div className="relative p-3 border border-dashed border-blue-300 rounded-lg mb-2">
              <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-blue-500">
                CardHeader
              </span>
              <div className="flex items-center gap-2 mt-1">
                {/* CardIcon */}
                <div className="relative px-3 py-1 border border-dashed border-slate-300 rounded text-[10px] font-mono text-slate-400">
                  CardIcon
                </div>
                {/* CardHeaderContent */}
                <div className="relative px-3 py-1 border border-dashed border-slate-300 rounded text-[10px] font-mono text-slate-400 flex-1">
                  <div>CardTitle</div>
                  <div>CardDescription</div>
                </div>
                {/* CardAction */}
                <div className="relative px-3 py-1 border border-dashed border-green-300 rounded text-[10px] font-mono text-green-500">
                  CardAction
                </div>
              </div>
            </div>

            {/* CardContent */}
            <div className="relative p-3 border border-dashed border-blue-300 rounded-lg mb-2">
              <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-blue-500">
                CardContent
              </span>
              <div className="mt-1 text-[10px] text-slate-400 font-mono">body content</div>
            </div>

            {/* CardFooter */}
            <div className="relative p-3 border border-dashed border-green-300 rounded-lg">
              <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-green-500">
                CardFooter
              </span>
              <div className="mt-1 text-[10px] text-slate-400 font-mono">footer content</div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-[10px] font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-3 border-t-2 border-dashed border-violet-400 inline-block" />
              <span className="text-violet-600">Root</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 border-t border-dashed border-blue-300 inline-block" />
              <span className="text-blue-500">Core part</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 border-t border-dashed border-slate-300 inline-block" />
              <span className="text-slate-400">Internal part</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 border-t border-dashed border-green-300 inline-block" />
              <span className="text-green-500">Optional part</span>
            </span>
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
                [
                  'Card',
                  '<div>',
                  'Root container. Provides variant context to all sub-components via React Context.',
                ],
                [
                  'CardHeader',
                  '<div>',
                  'Top section — flex row containing icon, content, and optional action. Adds border-b per variant.',
                ],
                [
                  'CardIcon',
                  '<div>',
                  'Icon badge inside CardHeader. Color adapts automatically per variant.',
                ],
                [
                  'CardHeaderContent',
                  '<div>',
                  'Flex-col wrapper for CardTitle and CardDescription. Handles min-width truncation.',
                ],
                [
                  'CardTitle',
                  '<h3>',
                  'Primary heading. Renders as h3 by default, overridable with as prop.',
                ],
                ['CardDescription', '<p>', 'Subtitle rendered below CardTitle.'],
                [
                  'CardAction',
                  '<div>',
                  'Optional right-aligned slot in CardHeader for buttons or controls.',
                ],
                [
                  'CardContent',
                  '<div>',
                  'Main body area. Defaults to p-4. Fills available height (flex-1).',
                ],
                [
                  'CardFooter',
                  '<div>',
                  'Optional bottom section. Defaults to p-4. Adds border-t per variant.',
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

        {/* Source code */}
        <Code>{`import Card, {
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardHeaderContent,
  CardIcon,
  CardTitle,
} from '@/components/base/Card'

<Card variant="shell">
  <CardHeader>
    <CardIcon icon={ShoppingCart} />
    <CardHeaderContent>
      <CardTitle>Products</CardTitle>
      <CardDescription>All active items</CardDescription>
    </CardHeaderContent>
    <CardAction>             {/* optional */}
      <Button>Add</Button>
    </CardAction>
  </CardHeader>
  <CardContent>
    {/* body */}
  </CardContent>
  <CardFooter>              {/* optional */}
    <p>Footer text</p>
  </CardFooter>
</Card>`}</Code>
      </Section>

      {/* Variants */}
      <Section
        title="Variants"
        description="Pass variant to Card. Sub-components adapt their background tint, border color, and icon color automatically — no extra props needed."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {[
            {
              variant: 'shell',
              icon: Package,
              title: 'Shell',
              desc: 'Default — white bg, slate border',
            },
            {
              variant: 'transparent',
              icon: Package,
              title: 'Transparent',
              desc: 'No bg or border — page wrapper',
            },
            { variant: 'info', icon: Info, title: 'Info', desc: 'Neutral guidance or tips' },
            {
              variant: 'success',
              icon: CheckCircle2,
              title: 'Success',
              desc: 'Operation completed',
            },
            {
              variant: 'warning',
              icon: AlertTriangle,
              title: 'Warning',
              desc: 'Recoverable issue — low stock',
            },
            {
              variant: 'danger',
              icon: XCircle,
              title: 'Danger',
              desc: 'Blocking state — action required',
            },
            {
              variant: 'muted',
              icon: Package,
              title: 'Muted',
              desc: 'De-emphasized — archived, inactive',
            },
          ].map(({ variant, icon, title, desc }) => (
            <Card key={variant} variant={variant}>
              <CardHeader>
                <CardIcon icon={icon} />
                <CardHeaderContent>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{desc}</CardDescription>
                </CardHeaderContent>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-500">variant=&quot;{variant}&quot;</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {['Variant', 'Background', 'Icon color', 'When to use'].map((h) => (
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
                  'shell',
                  'bg-white',
                  'violet-600',
                  'Default — data tables, forms, any neutral container',
                ],
                [
                  'transparent',
                  'none',
                  'violet-600',
                  'Page-level section wrapper, card-in-card outer',
                ],
                [
                  'info',
                  'blue-50',
                  'blue-600',
                  'Informational tips, sync status, neutral guidance',
                ],
                [
                  'success',
                  'emerald-50',
                  'emerald-600',
                  'Completed operations, approvals, exported files',
                ],
                [
                  'warning',
                  'amber-50',
                  'amber-700',
                  'Recoverable issues — low stock, approaching limits',
                ],
                ['danger', 'red-50', 'red-600', 'Blocking errors, payment failures, missing data'],
                [
                  'muted',
                  'muted/40',
                  'muted-foreground',
                  'Archived items, read-only or inactive sections',
                ],
              ].map(([variant, bg, iconColor, when]) => (
                <tr key={variant} className="even:bg-gray-50">
                  <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                    {variant}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400 whitespace-nowrap">
                    {bg}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400 whitespace-nowrap">
                    {iconColor}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">{when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Code>{`{/* default — shell */}
<Card>...</Card>

{/* status variants */}
<Card variant="info">...</Card>
<Card variant="success">...</Card>
<Card variant="warning">...</Card>
<Card variant="danger">...</Card>
<Card variant="muted">...</Card>

{/* page-level wrapper — no bg/border */}
<Card variant="transparent">...</Card>`}</Code>
      </Section>

      {/* Usage */}
      <Section title="Usage">
        <SubSection title="Full example">
          <div className="mb-4 max-w-sm">
            <Card>
              <CardHeader>
                <CardHeaderContent>
                  <CardTitle>Welcome back</CardTitle>
                  <CardDescription>Sign in to your account to continue</CardDescription>
                </CardHeaderContent>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Email</label>
                  <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2">
                    <Mail className="size-4 text-slate-400 shrink-0" />
                    <span className="text-sm text-slate-400">you@example.com</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Password</label>
                  <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2">
                    <Lock className="size-4 text-slate-400 shrink-0" />
                    <span className="text-sm text-slate-300">••••••••</span>
                  </div>
                </div>
                <Button className="w-full bg-violet-600 hover:bg-violet-700" size="md">
                  Sign in
                </Button>
              </CardContent>
              <CardFooter align="center">
                <p className="text-xs text-slate-500">
                  Don&apos;t have an account?{' '}
                  <span className="text-violet-600 font-medium cursor-pointer">Register</span>
                </p>
              </CardFooter>
            </Card>
          </div>
          <Code>{`<Card>
  <CardHeader>
    <CardHeaderContent>
      <CardTitle>Welcome back</CardTitle>
      <CardDescription>Sign in to your account</CardDescription>
    </CardHeaderContent>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* form fields */}
    <Button className="w-full bg-violet-600 hover:bg-violet-700">Sign in</Button>
  </CardContent>
  <CardFooter align="center">
    <p className="text-xs text-slate-500">Don't have an account?</p>
  </CardFooter>
</Card>`}</Code>
        </SubSection>

        <SubSection title="Table card — flush content">
          <Code>{`<Card>
  <CardHeader>
    <CardIcon icon={ShoppingCart} />
    <CardHeaderContent>
      <CardTitle>Products</CardTitle>
      <CardDescription>All active items</CardDescription>
    </CardHeaderContent>
    <CardAction>
      <Button>Add Item</Button>
    </CardAction>
  </CardHeader>
  <CardContent className="p-0">   {/* flush — remove default p-4 */}
    <table>...</table>
  </CardContent>
  <CardFooter>
    <p className="text-xs text-slate-500">3 items</p>
  </CardFooter>
</Card>`}</Code>
        </SubSection>

        <SubSection title="Card-in-card pattern">
          <Code>{`{/* transparent outer — no box, just layout + section title */}
<Card variant="transparent">
  <CardHeader>
    <CardIcon icon={Package} />
    <CardHeaderContent>
      <CardTitle>Overview</CardTitle>
      <CardDescription>Stock summary at a glance</CardDescription>
    </CardHeaderContent>
  </CardHeader>
  <CardContent className="p-0">
    <div className="grid grid-cols-3 gap-3">

      {/* shell inner — white box for each stat */}
      <Card>
        <CardContent>
          <p className="text-2xl font-semibold">48</p>
        </CardContent>
      </Card>

    </div>
  </CardContent>
</Card>`}</Code>
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
                  title: 'Use Card to group any distinct content',
                  body: "Tables, forms, stat tiles, alerts, empty/error states all benefit from Card's visual boundary and built-in sub-components (CardHeader, CardContent, CardFooter).",
                },
                {
                  title: 'Use transparent + shell for the page-level card-in-card layout',
                  body: 'transparent outer provides the section header without a visual box; shell inner cards provide the content boundaries. This is the standard page structure in this app.',
                },
              ],
            },
            {
              heading: 'When not to use',
              items: [
                {
                  title: "Don't wrap inline text in a Card just for padding",
                  body: 'Cards are for grouped, distinct content sections — not single paragraphs or isolated labels. Use a plain div with padding for that.',
                },
                {
                  title: "Don't use status variants for decoration",
                  body: 'info, success, warning, danger communicate real semantic states. Use shell for any neutral container — color is never just visual style.',
                },
              ],
            },
            {
              heading: 'Accessibility',
              items: [
                {
                  title: 'Use CardHeaderContent to wrap CardTitle and CardDescription',
                  body: 'CardHeaderContent handles min-w-0 flex-1 so long titles truncate correctly when CardAction is present. Never use a raw div as the wrapper.',
                },
                {
                  title: 'Set the correct heading level on CardTitle',
                  body: 'Use as="h1" or as="h2" on CardTitle to match the page heading hierarchy — don\'t let all cards default to h3 if one is the page\'s primary heading.',
                },
              ],
            },
            {
              heading: 'Advice',
              items: [
                {
                  title: 'Pick variant at design time, not at runtime',
                  body: "Switching variants based on data state causes jarring layout shifts. Decide the card's semantic role when building the component — variant is a structural decision.",
                },
                {
                  title: 'Use className to override CardContent padding',
                  body: 'Pass className="p-0" for flush tables and charts, className="p-3" for compact layouts. The default p-4 works for most content — no override needed.',
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
          title="Card"
          description="Root container. All other sub-components must be children of Card. Forwards extra props (data-*, aria-*, onClick, etc.) to the root div."
        >
          <PropsTable
            rows={[
              [
                'variant',
                "'shell' | 'transparent' | 'info' | 'success' | 'warning' | 'danger' | 'muted'",
                "'shell'",
                'Controls background, border, and CardIcon color. Passed via React Context to all sub-components.',
              ],
              [
                'bordered',
                'boolean',
                'true (false for transparent)',
                'Controls the outer border independently of variant. Background and radius are always preserved.',
              ],
              [
                'as',
                'ElementType',
                "'div'",
                'Renders as any HTML element — e.g. as="article" or as="section".',
              ],
              [
                'children',
                'ReactNode',
                '—',
                'Card body. Use sub-components for structured layouts.',
              ],
              ['className', 'string', "''", 'Extra CSS classes — e.g. col-span-2, max-w-sm.'],
              [
                'id',
                'string',
                '—',
                'Sets id on the card element. Convention: id="{componentName}_{pageName}".',
              ],
            ]}
          />
        </SubSection>

        <SubSection
          title="CardHeader"
          description="Top section rendered as a flex row. Automatically applies border-b based on the parent variant."
        >
          <PropsTable
            rows={[
              [
                'layout',
                "'beside' | 'below'",
                "'beside'",
                'beside — CardAction sits in the same row as icon and title. below — CardAction wraps to a second full-width row. Use below for filter tab bars or toolbars.',
              ],
              [
                'children',
                'ReactNode',
                '—',
                'Recommended: CardIcon → CardHeaderContent → CardAction.',
              ],
              ['as', 'ElementType', "'div'", 'Renders as any HTML element — e.g. as="header".'],
              [
                'className',
                'string',
                "''",
                'Extra classes — e.g. className="p-0" to remove default p-4.',
              ],
              ['id', 'string', '—', 'Sets id on the header element.'],
            ]}
          />
        </SubSection>

        <SubSection
          title="CardIcon"
          description="Violet icon badge. Always rendered inside CardHeader. Color adapts automatically per variant."
        >
          <PropsTable
            rows={[
              [
                'icon',
                'ComponentType',
                '—',
                'Lucide icon component type. Pass icon={ShoppingCart}, not icon={<ShoppingCart />}.',
              ],
              [
                'className',
                'string',
                '—',
                'Extra classes on the wrapper div — e.g. bg-red-50 to override badge color.',
              ],
              [
                'iconClassName',
                'string',
                '—',
                'Extra classes on the inner SVG — e.g. text-red-500 to override icon color.',
              ],
            ]}
          />
        </SubSection>

        <SubSection
          title="CardHeaderContent"
          description="Flex-col wrapper for CardTitle and CardDescription inside CardHeader. Handles min-width truncation (min-w-0 flex-1). Always use this instead of a raw div."
        >
          <PropsTable
            rows={[
              [
                'children',
                'ReactNode',
                '—',
                'CardTitle and optionally CardDescription. Do not put other elements here.',
              ],
              ['className', 'string', "''", 'Extra classes — rarely needed.'],
            ]}
          />
        </SubSection>

        <SubSection
          title="CardTitle"
          description="Primary heading inside CardHeader. Renders as h3 by default."
        >
          <PropsTable
            rows={[
              ['children', 'ReactNode', '—', 'Heading text.'],
              [
                'as',
                "'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'",
                "'h3'",
                'Override the rendered HTML tag for correct heading hierarchy.',
              ],
              [
                'id',
                'string',
                '—',
                'Sets id — pair with aria-labelledby on Card for screen reader support.',
              ],
              ['className', 'string', "''", 'Extra classes.'],
            ]}
          />
        </SubSection>

        <SubSection title="CardDescription" description="Subtitle rendered below CardTitle.">
          <PropsTable
            rows={[
              ['children', 'ReactNode', '—', 'Subtitle text.'],
              ['className', 'string', "''", 'Extra classes.'],
            ]}
          />
        </SubSection>

        <SubSection
          title="CardAction"
          description="Optional right-aligned slot inside CardHeader. Use for action buttons or controls."
        >
          <PropsTable
            rows={[
              [
                'children',
                'ReactNode',
                '—',
                'Buttons or controls. Wrap multiple buttons in a flex div with gap-2.',
              ],
              ['className', 'string', "''", 'Extra classes.'],
            ]}
          />
          <Code>{`{/* single button */}
<CardAction>
  <Button>Add</Button>
</CardAction>

{/* multiple buttons */}
<CardAction>
  <div className="flex items-center gap-2">
    <Button variant="outline">Export</Button>
    <Button>Add</Button>
  </div>
</CardAction>`}</Code>
        </SubSection>

        <SubSection
          title="CardContent"
          description="Main body area. Defaults to p-4. Fills available height (flex-1) in equal-height grid layouts."
        >
          <PropsTable
            rows={[
              ['children', 'ReactNode', '—', 'Any body content — tables, forms, text, lists.'],
              [
                'className',
                'string',
                "''",
                'Extra classes — e.g. className="p-0" for flush tables/charts, className="p-6" for spacious layouts.',
              ],
              ['as', 'ElementType', "'div'", 'Renders as any HTML element.'],
              ['id', 'string', '—', 'Sets id on the content div.'],
            ]}
          />
        </SubSection>

        <SubSection
          title="CardFooter"
          description="Optional bottom section. Defaults to p-4. Shell and status variants add a top border; transparent has no border."
        >
          <PropsTable
            rows={[
              ['children', 'ReactNode', '—', 'Footer content — typically text or buttons.'],
              [
                'align',
                "'start' | 'center' | 'end'",
                "'start'",
                'Controls horizontal alignment of footer content via justify-start/center/end.',
              ],
              [
                'className',
                'string',
                "''",
                'Extra classes — e.g. gap-2 for button spacing, justify-between for desc + button layout.',
              ],
              ['as', 'ElementType', "'div'", 'Renders as any HTML element.'],
              ['id', 'string', '—', 'Sets id on the footer div.'],
            ]}
          />
          <Code>{`{/* buttons left-aligned (default) */}
<CardFooter align="start" className="gap-2">
  <Button variant="outline">Cancel</Button>
  <Button>Save</Button>
</CardFooter>

{/* buttons centered */}
<CardFooter align="center">
  <Button>Confirm</Button>
</CardFooter>

{/* buttons right-aligned */}
<CardFooter align="end" className="gap-2">
  <Button variant="outline">Cancel</Button>
  <Button className="bg-red-500">Delete</Button>
</CardFooter>

{/* description + button */}
<CardFooter className="justify-between gap-3">
  <p className="text-xs text-slate-500 min-w-0">This action cannot be undone</p>
  <Button className="shrink-0">Confirm</Button>
</CardFooter>`}</Code>
        </SubSection>
      </Section>
    </div>
  ),
}
