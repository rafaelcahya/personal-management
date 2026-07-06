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

const Section = ({ title, children }) => (
  <div className="mb-14">
    <h2 className="text-2xl font-bold text-gray-900 mb-1">{title}</h2>
    <hr className="mb-6 border-gray-200" />
    {children}
  </div>
)

const SubSection = ({ title, description, children }) => (
  <div className="mb-8">
    <h3 className="text-base font-semibold text-gray-800 mb-1">{title}</h3>
    {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
    {children}
  </div>
)

const Code = ({ children }) => (
  <pre className="bg-gray-950 rounded-lg px-5 py-4 text-xs text-gray-300 overflow-x-auto leading-relaxed">
    <code>{children}</code>
  </pre>
)

const PropsTable = ({ rows }) => (
  <div className="overflow-x-auto mb-2">
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="bg-gray-50 border-b border-gray-200">
          {['Prop', 'Type', 'Default', 'Description'].map((h) => (
            <th
              key={h}
              className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wide"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(([prop, type, def, desc]) => (
          <tr key={prop} className="border-b border-gray-100 last:border-0">
            <td className="px-4 py-2.5 font-mono text-violet-700 text-xs whitespace-nowrap">
              {prop}
            </td>
            <td className="px-4 py-2.5 font-mono text-xs text-blue-600 whitespace-nowrap">
              {type}
            </td>
            <td className="px-4 py-2.5 font-mono text-xs text-gray-400 whitespace-nowrap">
              {def || '—'}
            </td>
            <td className="px-4 py-2.5 text-xs text-gray-600">{desc}</td>
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
      {/* Title */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Card</h1>
        <p className="text-base text-gray-500 leading-relaxed max-w-2xl">
          Displays a card with header, content, and footer.
        </p>
      </div>

      {/* 1. Overview */}
      <Section title="Overview">
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          Card is the primary container for grouping related information into a single visual unit.
          It has seven variants: <strong>shell</strong> (default white card),{' '}
          <strong>transparent</strong> (no background — page-level wrapper), <strong>info</strong>,{' '}
          <strong>success</strong>, <strong>warning</strong>, <strong>danger</strong>, and{' '}
          <strong>muted</strong>. Status variants automatically tint the background, border, and{' '}
          <code className="font-mono">CardIcon</code> color to match.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          Use Card to display data in any form — tables, forms, stats, alerts, or empty/error
          states. The <strong>card-in-card</strong> pattern is common: a transparent Card as a
          section header wrapping shell Cards inside, creating a clear page hierarchy.
        </p>
        <div className="p-4 bg-violet-50 border border-violet-100 rounded-lg">
          <p className="text-xs text-violet-800 leading-relaxed">
            <strong>Card vs SectionCard?</strong> Use <code className="font-mono">Card</code> with
            sub-components when you need full layout control. Use{' '}
            <code className="font-mono">SectionCard</code> when you only need a standard section
            header (icon + title + description + action) without extra customization.
          </p>
        </div>
      </Section>

      {/* 2. Variants */}
      <Section title="Variants">
        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          Pass <code className="font-mono bg-gray-100 px-1 rounded">variant</code> to{' '}
          <code className="font-mono bg-gray-100 px-1 rounded">Card</code>. Sub-components{' '}
          <code className="font-mono bg-gray-100 px-1 rounded">CardHeader</code>,{' '}
          <code className="font-mono bg-gray-100 px-1 rounded">CardIcon</code>,{' '}
          <code className="font-mono bg-gray-100 px-1 rounded">CardContent</code>, and{' '}
          <code className="font-mono bg-gray-100 px-1 rounded">CardFooter</code> automatically adapt
          their background tint, border color, and icon color — no extra props needed.
        </p>

        {/* Visual grid */}
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
            {
              variant: 'info',
              icon: Info,
              title: 'Info',
              desc: 'Neutral guidance or tips',
            },
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

        {/* Variant table */}
        <div className="overflow-x-auto mb-6 border border-gray-200 rounded-lg">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['Variant', 'Background', 'Icon color', 'When to use'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide"
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
                <tr key={variant} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-2.5 font-mono text-violet-700 text-xs whitespace-nowrap">
                    {variant}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-gray-400 whitespace-nowrap">
                    {bg}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-gray-400 whitespace-nowrap">
                    {iconColor}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-gray-600">{when}</td>
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

      {/* 3. Usage */}
      <Section title="Usage">
        <SubSection title="Import">
          <Code>{`import Card, {
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardHeaderContent,
  CardIcon,
  CardTitle,
} from '@/components/base/Card'`}</Code>
        </SubSection>

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
                  Don't have an account?{' '}
                  <span className="text-violet-600 font-medium cursor-pointer">Register</span>
                </p>
              </CardFooter>
            </Card>
          </div>
          <Code>{`import Card, {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardHeaderContent,
  CardTitle,
} from '@/components/base/Card'
import { Lock, Mail } from 'lucide-react'

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
    <Button className="w-full bg-violet-600 hover:bg-violet-700" size="md">Sign in</Button>
  </CardContent>
  <CardFooter align="center">
    <p className="text-xs text-slate-500">
      Don't have an account?{' '}
      <span className="text-violet-600 font-medium cursor-pointer">Register</span>
    </p>
  </CardFooter>
</Card>`}</Code>
        </SubSection>
      </Section>

      {/* 4. Composition */}
      <Section title="Composition">
        <p className="text-sm text-gray-600 mb-6">
          Card is made up of the sub-components below. <strong>CardHeader</strong> automatically
          adapts its padding and border based on the parent variant via React Context.{' '}
          <strong>CardContent</strong> and <strong>CardFooter</strong> also adapt — shell cards get{' '}
          <code className="font-mono">px-5 py-4</code> by default; transparent cards get top-only
          spacing (<code className="font-mono">pt-3</code>) with no horizontal padding. You can
          always override with the <code className="font-mono">padding</code> prop or{' '}
          <code className="font-mono">className</code>.
        </p>
        <div className="overflow-x-auto mb-6 border border-gray-200 rounded-lg">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['Component', 'Role', 'Default style'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide"
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
                  'Root container',
                  'shell: bg-white rounded-xl border shadow-sm · transparent: no bg/border',
                ],
                [
                  'CardHeader',
                  'Top section — icon + text + action',
                  'shell: px-5 py-4 border-b border-slate-100 · transparent: pb-3',
                ],
                [
                  'CardIcon',
                  'Icon badge inside CardHeader — auto-adapts color per variant',
                  'size-9 rounded-lg · shell/transparent: bg-violet-50 icon-violet-600 · status variants: matching tint',
                ],
                [
                  'CardHeaderContent',
                  'Flex column wrapper for CardTitle + CardDescription inside CardHeader',
                  'flex flex-col gap-0.5 min-w-0 flex-1',
                ],
                [
                  'CardTitle',
                  'Primary heading in CardHeader',
                  'text-sm font-semibold text-slate-900 · renders as h3',
                ],
                ['CardDescription', 'Subtitle below CardTitle', 'text-xs text-slate-500 mt-0.5'],
                [
                  'CardAction',
                  'Right-aligned slot in CardHeader',
                  'shrink-0 — place buttons or controls here',
                ],
                [
                  'CardContent',
                  'Main body area',
                  'shell: px-5 py-4 flex-1 · transparent: px-5 pt-3 flex-1',
                ],
                [
                  'CardFooter',
                  'Bottom section',
                  'shell: px-5 py-4 border-t border-slate-100 · transparent: px-5 pt-3 (no border-t)',
                ],
              ].map(([comp, role, style]) => (
                <tr key={comp} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3 font-mono text-violet-700 text-xs whitespace-nowrap">
                    {comp}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-700">{role}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{style}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Code>{`<Card>                          {/* root */}
  <CardHeader>                  {/* top band */}
    <CardIcon icon={Icon} />    {/* violet badge */}
    <CardHeaderContent>         {/* flex-col wrapper — min-w-0 flex-1 */}
      <CardTitle />             {/* h3 heading */}
      <CardDescription />      {/* subtitle */}
    </CardHeaderContent>
    <CardAction />              {/* right slot */}
  </CardHeader>
  <CardContent />               {/* body */}
  <CardFooter />                {/* bottom band */}
</Card>`}</Code>
      </Section>

      {/* 5. API Reference */}
      <Section title="API Reference">
        <SubSection
          title="Card"
          description="Root container. All other sub-components must be direct or indirect children of Card. Forwards extra props (data-*, aria-*, onClick, etc.) to the root div."
        >
          <PropsTable
            rows={[
              [
                'variant',
                "'shell' | 'transparent' | 'info' | 'success' | 'warning' | 'danger' | 'muted'",
                "'shell'",
                'Controls background, border, and CardIcon color. shell — white card. transparent — no bg/border. Status variants (info/success/warning/danger/muted) auto-tint all sub-components.',
              ],
              [
                'as',
                'ElementType',
                "'div'",
                'Renders the card as any HTML element — e.g. as="article" or as="section".',
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
          description="Top section rendered as a flex row. Automatically applies border-b and padding based on the parent variant. Status variants use matching border colors."
        >
          <PropsTable
            rows={[
              [
                'children',
                'ReactNode',
                '—',
                'Recommended: CardIcon, then CardHeaderContent (with CardTitle + CardDescription inside), then CardAction.',
              ],
              [
                'padding',
                "'none' | 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl'",
                '—',
                'Override the default padding. When omitted, shell/status use px-5 py-4; transparent uses pb-3 (bottom-only).',
              ],
              ['as', 'ElementType', "'div'", 'Renders as any HTML element — e.g. as="header".'],
              ['className', 'string', "''", 'Extra classes merged with the base layout classes.'],
              ['id', 'string', '—', 'Sets id on the header element.'],
            ]}
          />
        </SubSection>

        <SubSection
          title="CardIcon"
          description="Violet icon badge. Always rendered inside CardHeader. Pass the Lucide component type — not a rendered element."
        >
          <PropsTable
            rows={[
              [
                'icon',
                'ComponentType',
                '—',
                'Lucide icon component type. E.g. icon={ShoppingCart}. Do not pass icon={<ShoppingCart />}.',
              ],
              [
                'className',
                'string',
                '—',
                'Extra classes on the wrapper div — e.g. bg-red-50 to change the badge color.',
              ],
              [
                'iconClassName',
                'string',
                '—',
                'Extra classes on the inner SVG — e.g. text-red-500 to change the icon color.',
              ],
            ]}
          />
        </SubSection>

        <SubSection
          title="CardHeaderContent"
          description="Flex column wrapper for CardTitle and CardDescription inside CardHeader. Handles min-width truncation and flex-grow so the text area fills available space between CardIcon and CardAction. Always use this instead of a raw div."
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
          <Code>{`{/* always wrap CardTitle + CardDescription in CardHeaderContent */}
<CardHeader>
  <CardIcon icon={ShoppingCart} />
  <CardHeaderContent>
    <CardTitle>Inventory</CardTitle>
    <CardDescription>All active products</CardDescription>
  </CardHeaderContent>
  <CardAction>
    <Button>Add</Button>
  </CardAction>
</CardHeader>

{/* without CardAction — CardHeaderContent still required */}
<CardHeader>
  <CardIcon icon={Package} />
  <CardHeaderContent>
    <CardTitle>Overview</CardTitle>
    <CardDescription>Summary of your portfolio</CardDescription>
  </CardHeaderContent>
</CardHeader>`}</Code>
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
          description="Right-aligned slot inside CardHeader. Use for action buttons or controls."
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
          description="Main body area. Adapts padding to the parent variant and fills available height (flex-1) in equal-height grid layouts."
        >
          <PropsTable
            rows={[
              ['children', 'ReactNode', '—', 'Any body content — tables, forms, text, lists.'],
              [
                'padding',
                "'none' | 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl'",
                '—',
                'Override the default padding. Shell default: px-5 py-4. Transparent default: px-5 pt-3. Use padding="none" or className="p-0" for flush content like tables.',
              ],
              ['className', 'string', "''", 'Extra classes merged with padding and flex-1.'],
              ['id', 'string', '—', 'Sets id on the content div.'],
            ]}
          />
        </SubSection>

        <SubSection
          title="CardFooter"
          description="Bottom section. Shell adds top border and horizontal padding; transparent uses top-only spacing. Use for summary rows, pagination, or action buttons."
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
                'padding',
                "'none' | 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl'",
                '—',
                'Override the default padding. Shell default: px-5 py-4. Transparent default: px-5 pt-3 (no border-t).',
              ],
              [
                'className',
                'string',
                "''",
                'Extra classes — e.g. gap-2 for button spacing, justify-between for desc + button layout.',
              ],
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
