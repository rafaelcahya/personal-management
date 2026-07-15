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
        <Code>{`import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem,
  BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator,
} from '@/components/base/Breadcrumb/Breadcrumb'

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/home">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Product Detail</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`}</Code>
      </Section>

      {/* Anatomy */}
      <Section
        title="Anatomy"
        description="Breadcrumb is a composite of seven sub-components. Each piece renders a specific semantic element."
      >
        {/* Diagram */}
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4">
          {/* Breadcrumb — Root */}
          <div className="relative pt-8 p-4 border-2 border-dashed border-violet-400 rounded-xl">
            <span className="absolute -top-3 left-3 bg-gray-50 px-1 text-[10px] font-mono font-semibold text-violet-600">
              Breadcrumb
            </span>

            {/* BreadcrumbList — Core */}
            <div className="relative pt-8 p-4 border border-dashed border-blue-300 rounded-lg">
              <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-[10px] font-mono text-blue-500">
                BreadcrumbList
              </span>

              {/* Vertical rows — no nested absolute labels */}
              <div className="flex flex-col gap-3">
                {/* Row: BreadcrumbItem > BreadcrumbLink */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-1 border border-dashed border-slate-300 rounded text-[10px] font-mono text-slate-500 whitespace-nowrap">
                    BreadcrumbItem
                  </span>
                  <span className="text-slate-300 text-xs">›</span>
                  <span className="px-2 py-1 border border-dashed border-violet-300 rounded text-[10px] font-mono text-violet-600 whitespace-nowrap">
                    BreadcrumbLink
                  </span>
                  <span className="text-xs text-blue-500 underline font-mono ml-1">Home</span>
                </div>

                {/* Row: BreadcrumbSeparator */}
                <div className="flex items-center gap-2 pl-1">
                  <span className="px-2 py-1 border border-dashed border-slate-300 rounded text-[10px] font-mono text-slate-500 whitespace-nowrap">
                    BreadcrumbSeparator
                  </span>
                  <ChevronRight className="size-3 text-slate-300" />
                </div>

                {/* Row: BreadcrumbItem > BreadcrumbEllipsis (optional) */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-1 border border-dashed border-slate-300 rounded text-[10px] font-mono text-slate-500 whitespace-nowrap">
                    BreadcrumbItem
                  </span>
                  <span className="text-slate-300 text-xs">›</span>
                  <span className="px-2 py-1 border border-dashed border-green-300 rounded text-[10px] font-mono text-green-600 whitespace-nowrap">
                    BreadcrumbEllipsis
                  </span>
                  <span className="text-[10px] font-mono text-green-500 bg-green-50 px-1 rounded ml-0.5">
                    opt
                  </span>
                  <span className="text-xs text-slate-400 font-mono ml-1">···</span>
                </div>

                {/* Row: BreadcrumbSeparator */}
                <div className="flex items-center gap-2 pl-1">
                  <span className="px-2 py-1 border border-dashed border-slate-300 rounded text-[10px] font-mono text-slate-500 whitespace-nowrap">
                    BreadcrumbSeparator
                  </span>
                  <ChevronRight className="size-3 text-slate-300" />
                </div>

                {/* Row: BreadcrumbItem > BreadcrumbPage */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-1 border border-dashed border-slate-300 rounded text-[10px] font-mono text-slate-500 whitespace-nowrap">
                    BreadcrumbItem
                  </span>
                  <span className="text-slate-300 text-xs">›</span>
                  <span className="px-2 py-1 border border-dashed border-slate-300 rounded text-[10px] font-mono text-slate-500 whitespace-nowrap">
                    BreadcrumbPage
                  </span>
                  <span className="text-xs text-slate-700 font-mono font-medium ml-1">
                    Product Detail
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-4">
          {[
            { border: 'border-violet-400', text: 'text-violet-600', label: 'Root (Breadcrumb)' },
            {
              border: 'border-blue-300',
              text: 'text-blue-500',
              label: 'Core part (BreadcrumbList)',
            },
            {
              border: 'border-violet-300',
              text: 'text-violet-500',
              label: 'Interactive part (BreadcrumbLink)',
            },
            { border: 'border-slate-300', text: 'text-slate-400', label: 'Internal part' },
            {
              border: 'border-green-300',
              text: 'text-green-500',
              label: 'Optional part (BreadcrumbEllipsis)',
            },
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
                  'Breadcrumb',
                  '<nav>',
                  'Root wrapper. Renders a <nav> with aria-label="breadcrumb".',
                ],
                ['BreadcrumbList', '<ol>', 'Ordered list container with flex layout and gap-1.5.'],
                [
                  'BreadcrumbItem',
                  '<li>',
                  'Wrapper for each trail item — link, page, or ellipsis.',
                ],
                [
                  'BreadcrumbLink',
                  '<a>',
                  'Clickable link for non-current pages. Supports ref via forwardRef.',
                ],
                [
                  'BreadcrumbPage',
                  '<span>',
                  'Current page indicator — non-clickable. aria-current="page" is auto-applied.',
                ],
                [
                  'BreadcrumbSeparator',
                  '<li>',
                  'Separator between items. Defaults to ChevronRight; pass children to override. aria-hidden="true" is auto-applied.',
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

      {/* Custom Separator */}
      <Section
        title="Custom Separator"
        description="BreadcrumbSeparator defaults to a ChevronRight icon. Pass children to replace it with any icon or text character."
      >
        {[
          { label: 'default — ChevronRight', sep: undefined },
          { label: 'Slash icon', sep: <Slash /> },
          { label: 'text "/"', sep: '/' },
          { label: 'dot "·"', sep: '·' },
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
        description="Use BreadcrumbEllipsis inside a BreadcrumbItem to indicate hidden trail segments. The expand logic is left to the consumer."
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

      {/* Best Practices */}
      <Section title="Best Practices">
        <div className="flex flex-col gap-8">
          {[
            {
              heading: 'When to use',
              items: [
                {
                  title: 'Page hierarchy is 3 or more levels deep',
                  body: 'Home → Inventory → Products → Detail. Breadcrumb earns its space when there are real parent pages to navigate back to. Fewer than 3 levels is better served by a Back button.',
                },
                {
                  title: 'Users navigate frequently between deeply nested pages',
                  body: 'If the workflow involves moving up and down a hierarchy — e.g. reviewing product details then returning to the product list — breadcrumb shortens that journey.',
                },
                {
                  title: 'The URL structure mirrors a clear parent–child relationship',
                  body: 'Breadcrumb reinforces a hierarchy that already exists in the routing. If the URL structure is flat or inconsistent, breadcrumb adds confusion rather than clarity.',
                },
              ],
            },
            {
              heading: 'When not to use',
              items: [
                {
                  title: "Don't use for 1–2 level navigation",
                  body: "A single parent level doesn't justify a breadcrumb strip. A Back link or a heading with a parent label is simpler, less visual noise, and just as navigable.",
                },
                {
                  title: "Don't use for switching between sibling views",
                  body: 'Breadcrumb is for navigating up a hierarchy, not across it. If users need to switch between Products, Orders, and Reports at the same level, use Tabs instead.',
                },
                {
                  title: "Don't collapse trails shorter than 5 items",
                  body: 'BreadcrumbEllipsis on a 3-item trail removes navigational value without solving a real space problem. Only collapse when the trail is long enough to justify it.',
                },
              ],
            },
            {
              heading: 'Accessibility',
              items: [
                {
                  title:
                    'Breadcrumb renders as <nav aria-label="breadcrumb"> — use it once per page',
                  body: 'Screen readers announce it as a navigation landmark. Having multiple breadcrumb navs on a page creates duplicate landmark confusion — render only one.',
                },
                {
                  title: 'Always use BreadcrumbPage for the last item, never BreadcrumbLink',
                  body: 'BreadcrumbPage auto-applies aria-current="page" so screen readers announce the current location. The last item is not a navigation target — making it a link is semantically wrong.',
                },
                {
                  title: 'BreadcrumbSeparator is aria-hidden="true" by default',
                  body: 'Screen readers skip separators automatically. Don\'t add aria-hidden manually — it\'s already applied. When using BreadcrumbEllipsis, the sr-only "More" text preserves meaning for screen readers.',
                },
              ],
            },
            {
              heading: 'Advice',
              items: [
                {
                  title: 'Place breadcrumb directly above the page title in the page header',
                  body: 'This is the expected position — users look for breadcrumb above the heading, not in the sidebar or footer. It gives hierarchy context before they read the page title.',
                },
                {
                  title: 'Keep separator style consistent across the entire app',
                  body: 'Pick ChevronRight (default) or "/" and use it everywhere. Mixing styles on different pages breaks visual consistency. ChevronRight implies direction; "/" is better for file path–style navigation.',
                },
                {
                  title: 'Use BreadcrumbLink asChild with Next.js Link for client-side navigation',
                  body: 'Wrap BreadcrumbLink in <Link href="..."> via asChild to get client-side routing without sacrificing breadcrumb styling or aria semantics.',
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
      <Section
        title="API Reference"
        description="Each sub-component accepts className and spreads remaining props to its underlying element."
      >
        {[
          {
            name: 'Breadcrumb',
            rows: [
              ['children', 'ReactNode', '—', 'Should contain a BreadcrumbList.'],
              ['className', 'string', '—', 'Additional Tailwind classes on the <nav> element.'],
            ],
          },
          {
            name: 'BreadcrumbList · BreadcrumbItem · BreadcrumbContent',
            rows: [
              ['children', 'ReactNode', '—', 'Content to render inside this sub-component.'],
              ['className', 'string', '—', 'Additional Tailwind classes merged via cn().'],
            ],
          },
          {
            name: 'BreadcrumbLink',
            rows: [
              ['href', 'string', '—', 'URL the link navigates to.'],
              ['ref', 'React.Ref', '—', 'Forwarded to the underlying <a> element.'],
              ['children', 'ReactNode', '—', 'Link label text.'],
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
                'Custom separator — any icon or text character.',
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

<BreadcrumbItem>
  <BreadcrumbLink asChild>
    <Link href="/inventory">Inventory</Link>
  </BreadcrumbLink>
</BreadcrumbItem>`}</Code>
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
    </div>
  ),
}
