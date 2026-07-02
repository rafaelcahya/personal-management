import { ChevronRight, Slash } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './Breadcrumb'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Breadcrumb',
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
  <div className="flex flex-col gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg mb-3">
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

// ─── Story ────────────────────────────────────────────────────────────────────

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="p-8 max-w-4xl font-sans text-gray-900">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Breadcrumb</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A composite navigation component for showing the user's location within a page hierarchy.
          Built from seven composable sub-components — each maps to a semantic HTML element with
          correct ARIA attributes baked in.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <Preview>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Inventory</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Products</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Product Detail</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Preview>
      </Section>

      {/* Anatomy */}
      <Section
        title="Anatomy"
        description="Breadcrumb is a composite of seven sub-components. Each piece renders a specific semantic element."
      >
        {/* Diagram */}
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4 overflow-x-auto">
          {/* Breadcrumb */}
          <div className="relative pt-6 p-4 border-2 border-dashed border-violet-400 rounded-xl inline-block min-w-max">
            <span className="absolute top-2 left-3 text-[10px] font-mono font-semibold text-violet-600">
              Breadcrumb
            </span>

            {/* BreadcrumbList */}
            <div className="relative pt-6 p-3 border border-dashed border-blue-300 rounded-lg">
              <span className="absolute top-1.5 left-3 text-[10px] font-mono text-blue-500">
                BreadcrumbList
              </span>

              <div className="flex items-center gap-4">
                {/* BreadcrumbItem + BreadcrumbLink */}
                <div className="relative pt-6 px-3 pb-3 border border-dashed border-green-300 rounded-lg">
                  <span className="absolute top-1.5 left-2 text-[10px] font-mono text-green-500">
                    BreadcrumbItem
                  </span>
                  <div className="relative pt-5 px-3 pb-2 border border-dashed border-orange-300 rounded-md">
                    <span className="absolute top-1.5 left-2 text-[10px] font-mono text-orange-500">
                      BreadcrumbLink
                    </span>
                    <span className="text-xs text-blue-500 underline font-mono">Home</span>
                  </div>
                </div>

                {/* BreadcrumbSeparator */}
                <div className="relative pt-6 px-4 pb-3 border border-dashed border-gray-300 rounded-lg">
                  <span className="absolute top-1.5 left-2 text-[10px] font-mono text-gray-400">
                    BreadcrumbSeparator
                  </span>
                  <ChevronRight className="size-3.5 text-slate-400" />
                </div>

                {/* BreadcrumbItem + BreadcrumbEllipsis */}
                <div className="relative pt-6 px-3 pb-3 border border-dashed border-green-300 rounded-lg">
                  <span className="absolute top-1.5 left-2 text-[10px] font-mono text-green-500">
                    BreadcrumbItem
                  </span>
                  <div className="relative pt-5 px-3 pb-2 border border-dashed border-yellow-400 rounded-md">
                    <span className="absolute top-1.5 left-2 text-[10px] font-mono text-yellow-500">
                      BreadcrumbEllipsis
                    </span>
                    <span className="text-xs text-slate-400 font-mono">···</span>
                  </div>
                </div>

                {/* BreadcrumbSeparator */}
                <div className="relative pt-6 px-4 pb-3 border border-dashed border-gray-300 rounded-lg">
                  <span className="absolute top-1.5 left-2 text-[10px] font-mono text-gray-400">
                    BreadcrumbSeparator
                  </span>
                  <ChevronRight className="size-3.5 text-slate-400" />
                </div>

                {/* BreadcrumbItem + BreadcrumbPage */}
                <div className="relative pt-6 px-3 pb-3 border border-dashed border-green-300 rounded-lg">
                  <span className="absolute top-1.5 left-2 text-[10px] font-mono text-green-500">
                    BreadcrumbItem
                  </span>
                  <div className="relative pt-5 px-3 pb-2 border border-dashed border-pink-300 rounded-md">
                    <span className="absolute top-1.5 left-2 text-[10px] font-mono text-pink-500">
                      BreadcrumbPage
                    </span>
                    <span className="text-xs text-slate-700 font-mono font-medium">Detail</span>
                  </div>
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
                [
                  'Breadcrumb',
                  '<nav>',
                  'Root wrapper. Renders a <nav> with aria-label="breadcrumb".',
                ],
                ['BreadcrumbList', '<ol>', 'Ordered list container with flex layout and gap.'],
                [
                  'BreadcrumbItem',
                  '<li>',
                  'Wrapper for each item in the trail — link, page, or ellipsis.',
                ],
                [
                  'BreadcrumbLink',
                  '<a>',
                  'Clickable link for non-current pages. Supports ref via forwardRef.',
                ],
                [
                  'BreadcrumbPage',
                  '<span>',
                  'Current page indicator — non-clickable, aria-current="page" auto-applied.',
                ],
                [
                  'BreadcrumbSeparator',
                  '<li>',
                  'Separator between items. Defaults to ChevronRight; pass children to override.',
                ],
                [
                  'BreadcrumbEllipsis',
                  '<span>',
                  'Collapsed trail indicator using MoreHorizontal icon. Expand logic is consumer-owned.',
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

        <Code>{`import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from '@/components/base/Breadcrumb/Breadcrumb'`}</Code>
      </Section>

      {/* Separator */}
      <Section
        title="Separator"
        description="BreadcrumbSeparator defaults to a ChevronRight icon. Pass children to replace it with any icon or text character."
      >
        {[
          {
            label: 'default — ChevronRight',
            sep: undefined,
          },
          {
            label: 'Slash icon',
            sep: <Slash />,
          },
          {
            label: 'text "/"',
            sep: '/',
          },
          {
            label: 'dot "·"',
            sep: '·',
          },
        ].map(({ label, sep }) => (
          <div
            key={label}
            className="flex items-center gap-4 mb-3 p-3 border border-gray-100 rounded-lg"
          >
            <span className="w-36 shrink-0 text-xs font-mono text-gray-400">{label}</span>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>{sep}</BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>Activities</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        ))}

        <Code>{`{/* Default */}
<BreadcrumbSeparator />

{/* Custom icon */}
<BreadcrumbSeparator>
  <Slash />
</BreadcrumbSeparator>

{/* Text character */}
<BreadcrumbSeparator>/</BreadcrumbSeparator>`}</Code>
      </Section>

      {/* Collapsed */}
      <Section
        title="Collapsed Path"
        description="Use BreadcrumbEllipsis inside a BreadcrumbItem to indicate hidden trail segments. The expand logic is left to the consumer — typically a DropdownMenu or an onClick toggle."
      >
        <SubSection title="Keep first + last">
          <Preview>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbEllipsis />
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Product Detail</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </Preview>
          <Code>{`<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/home">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbEllipsis />
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Product Detail</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`}</Code>
        </SubSection>

        <SubSection title="Keep first + last 2">
          <Preview>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbEllipsis />
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Products</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Product Detail</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </Preview>
        </SubSection>
      </Section>

      {/* Props */}
      <Section
        title="Props"
        description="Each sub-component accepts className and spreads remaining props to its underlying element."
      >
        {[
          {
            name: 'BreadcrumbLink',
            rows: [
              ['href', 'string', '—', 'URL the link navigates to.'],
              ['ref', 'React.Ref', '—', 'Forwarded to the underlying <a> element.'],
              ['className', 'string', '—', 'Additional Tailwind classes.'],
            ],
          },
          {
            name: 'BreadcrumbSeparator',
            rows: [
              [
                'children',
                'ReactNode',
                '<ChevronRight />',
                'Custom separator content — icon or text character.',
              ],
              ['className', 'string', '—', 'Additional Tailwind classes.'],
            ],
          },
          {
            name: 'BreadcrumbEllipsis',
            rows: [['className', 'string', '—', 'Additional Tailwind classes.']],
          },
        ].map(({ name, rows }) => (
          <SubSection key={name} title={name}>
            <div className="overflow-x-auto mb-2">
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
                      <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500">
                        {type}
                      </td>
                      <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400 whitespace-nowrap">
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
        ))}
      </Section>

      {/* Usage Examples */}
      <Section title="Usage Examples" description="Copy-ready code for common scenarios.">
        <SubSection title="Page Header">
          <Code>{`<header className="flex flex-col gap-1">
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href="/home">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink href="/inventory">Inventory</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Products</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
  <h1 className="text-2xl font-bold">Products</h1>
</header>`}</Code>
        </SubSection>

        <SubSection title="With Next.js Link">
          <Code>{`import Link from 'next/link'

<BreadcrumbLink asChild>
  <Link href="/inventory">Inventory</Link>
</BreadcrumbLink>`}</Code>
        </SubSection>

        <SubSection title="Dynamic trail from route">
          <Code>{`const crumbs = [
  { label: 'Home',      href: '/' },
  { label: 'Inventory', href: '/inventory' },
  { label: 'Products',  href: '/inventory/products' },
  { label: 'Detail',    href: null },  // null = current page
]

<Breadcrumb>
  <BreadcrumbList>
    {crumbs.map((crumb, i) => (
      <Fragment key={crumb.label}>
        {i > 0 && <BreadcrumbSeparator />}
        <BreadcrumbItem>
          {crumb.href ? (
            <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
          ) : (
            <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
          )}
        </BreadcrumbItem>
      </Fragment>
    ))}
  </BreadcrumbList>
</Breadcrumb>`}</Code>
        </SubSection>
      </Section>

      {/* When to Use */}
      <Section title="When to Use">
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {['Use Breadcrumb when…', 'Consider an alternative when…'].map((h) => (
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
                      The page hierarchy is 3 or more levels deep (e.g. Home → Inventory → Products
                      → Detail).
                    </li>
                    <li>
                      Users navigate between deeply nested pages and need a quick way to jump back
                      up the tree.
                    </li>
                    <li>
                      The URL structure mirrors a clear parent–child relationship that benefits from
                      visual reinforcement.
                    </li>
                  </ul>
                </td>
                <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700 align-top">
                  <ul className="flex flex-col gap-1.5">
                    <li>
                      Use a <strong>Back button</strong> when navigation is linear (1–2 levels) and
                      users always return to the previous screen.
                    </li>
                    <li>
                      Use <strong>Tabs</strong> when the user switches between sibling views at the
                      same level — not up and down a hierarchy.
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
            <div className="space-y-4">
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <div className="mb-3">
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="#">Home</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>Dashboard</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
                <p className="text-xs text-green-800">
                  Always use{' '}
                  <code className="font-mono bg-green-100 px-1 rounded">BreadcrumbPage</code> for
                  the last item — it marks the current page with{' '}
                  <code className="font-mono bg-green-100 px-1 rounded">aria-current="page"</code>.
                </p>
              </div>

              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <div className="mb-3">
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="#">Home</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbEllipsis />
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>Detail</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
                <p className="text-xs text-green-800">
                  Use{' '}
                  <code className="font-mono bg-green-100 px-1 rounded">BreadcrumbEllipsis</code> to
                  collapse trails longer than 4 levels.
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
            <div className="space-y-4">
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <div className="mb-3">
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="#">Home</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <Breadcrumb>
                        <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                      </Breadcrumb>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
                <p className="text-xs text-red-800">
                  Don't use{' '}
                  <code className="font-mono bg-red-100 px-1 rounded">BreadcrumbLink</code> as the
                  last item — it's misleading because the current page isn't a navigation target.
                </p>
              </div>

              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <div className="mb-3">
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="#">Home</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>Products</BreadcrumbPage>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink href="#">Detail</BreadcrumbLink>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
                <p className="text-xs text-red-800">
                  Don't place{' '}
                  <code className="font-mono bg-red-100 px-1 rounded">BreadcrumbPage</code> in the
                  middle of the trail — it must always be the final item.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  ),
}
