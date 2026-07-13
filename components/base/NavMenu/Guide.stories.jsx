import {
  Package,
  BarChart2,
  TrendingUp,
  Wallet,
  Settings,
  Users,
  Home,
  Bell,
  HelpCircle,
} from 'lucide-react'
import {
  NavMenu,
  NavMenuList,
  NavMenuItem,
  NavMenuTrigger,
  NavMenuContent,
  NavMenuIndicator,
  NavMenuLink,
  NavMenuGroup,
  NavMenuGroupTitle,
  NavMenuGroupItem,
  NavMenuSeparator,
} from './NavMenu'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'NavMenu' }
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
  <div className="flex flex-col gap-3 p-6 bg-gray-50 border border-gray-200 rounded-lg mb-3 overflow-visible">
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
    blue: 'bg-blue-100 text-blue-700',
  }
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-medium ${colors[color]}`}
    >
      {children}
    </span>
  )
}

const ApiTable = ({ rows }) => (
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
            <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400">
              {def}
            </td>
            <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">{desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

// ─── Live demo ────────────────────────────────────────────────────────────────

function OverviewDemo() {
  return (
    <NavMenu trigger="hover">
      <NavMenuList>
        <NavMenuLink href="#" active>
          Home
        </NavMenuLink>
        <NavMenuItem>
          <NavMenuTrigger icon={Package}>Products</NavMenuTrigger>
          <NavMenuIndicator />
          <NavMenuContent columns={2}>
            <NavMenuGroup>
              <NavMenuGroupTitle>Inventory</NavMenuGroupTitle>
              <NavMenuGroupItem
                href="#"
                icon={Package}
                label="Stock"
                description="Track and manage items"
              />
              <NavMenuGroupItem
                href="#"
                icon={BarChart2}
                label="Analytics"
                description="Usage patterns and trends"
              />
            </NavMenuGroup>
            <NavMenuGroup>
              <NavMenuGroupTitle>Trading</NavMenuGroupTitle>
              <NavMenuGroupItem
                href="#"
                icon={TrendingUp}
                label="Trades"
                description="Open and closed positions"
              />
              <NavMenuGroupItem
                href="#"
                icon={Wallet}
                label="Portfolio"
                description="Holdings overview"
              />
            </NavMenuGroup>
          </NavMenuContent>
        </NavMenuItem>
        <NavMenuItem>
          <NavMenuTrigger icon={Settings}>Settings</NavMenuTrigger>
          <NavMenuIndicator />
          <NavMenuContent>
            <NavMenuLink href="#" icon={Users}>
              Account
            </NavMenuLink>
            <NavMenuLink href="#" icon={Bell}>
              Notifications
            </NavMenuLink>
            <NavMenuSeparator />
            <NavMenuLink href="#" icon={HelpCircle}>
              Help
            </NavMenuLink>
          </NavMenuContent>
        </NavMenuItem>
      </NavMenuList>
    </NavMenu>
  )
}

// ─── Story ────────────────────────────────────────────────────────────────────

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="p-8 max-w-4xl font-sans text-gray-900">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">NavMenu</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A horizontal navigation bar with support for single-level dropdowns and multi-column mega
          menus. Trigger mode (hover or click) is a prop. Links support the{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">as</code> prop for Next.js
          routing.
        </p>
      </div>

      {/* ── Overview ───────────────────────────────────────────────────────── */}
      <Section title="Overview">
        <Preview>
          <OverviewDemo />
        </Preview>
        <p className="text-xs text-gray-400 mb-4">
          Hover over Products or Settings to see the dropdown. Home link is marked active.
        </p>
      </Section>

      {/* ── Anatomy ────────────────────────────────────────────────────────── */}
      <Section title="Anatomy">
        {/* Visual box diagram */}
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4">
          <div className="flex flex-wrap gap-10">
            {/* Panel: nav bar (closed) */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wide mb-1">
                Nav bar
              </span>
              <div className="relative p-4 border-2 border-dashed border-violet-400 rounded-xl inline-block">
                <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-[10px] font-mono font-semibold text-violet-600">
                  NavMenu
                </span>
                <div className="relative p-3 border border-dashed border-blue-300 rounded-lg">
                  <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-blue-500">
                    NavMenuList
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="relative px-2 py-1 border border-dashed border-green-300 rounded">
                      <span className="absolute -top-2 left-1 bg-gray-50 px-0.5 text-[10px] font-mono text-green-500">
                        NavMenuLink
                      </span>
                      <span className="text-[10px] text-gray-400 mt-0.5 block">Home</span>
                    </div>
                    <div className="relative px-2 py-1 border border-dashed border-slate-300 rounded">
                      <span className="absolute -top-2 left-1 bg-gray-50 px-0.5 text-[10px] font-mono text-slate-400">
                        NavMenuItem
                      </span>
                      <div className="relative px-2 py-1 border border-dashed border-violet-300 rounded mt-0.5">
                        <span className="absolute -top-2 left-1 bg-gray-50 px-0.5 text-[10px] font-mono text-violet-500">
                          NavMenuTrigger
                        </span>
                        <span className="text-[10px] text-gray-400 mt-0.5 block">Products ∨</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel: open dropdown */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wide mb-1">
                Open dropdown
              </span>
              <div className="relative p-3 border-2 border-dashed border-blue-300 rounded-xl inline-block">
                <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-[10px] font-mono font-semibold text-blue-500">
                  NavMenuContent (columns=2)
                </span>
                <div className="mt-1 flex gap-3">
                  <div className="relative p-2 border border-dashed border-slate-300 rounded-lg">
                    <span className="absolute -top-2 left-1 bg-gray-50 px-0.5 text-[10px] font-mono text-slate-400">
                      NavMenuGroup
                    </span>
                    <div className="mt-1 flex flex-col gap-1">
                      <div className="relative px-2 py-0.5 border border-dashed border-slate-300 rounded">
                        <span className="text-[10px] font-mono text-slate-400">
                          NavMenuGroupTitle
                        </span>
                      </div>
                      <div className="relative px-2 py-0.5 border border-dashed border-slate-300 rounded">
                        <span className="text-[10px] font-mono text-slate-400">
                          NavMenuGroupItem
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="relative p-2 border border-dashed border-slate-300 rounded-lg">
                    <span className="absolute -top-2 left-1 bg-gray-50 px-0.5 text-[10px] font-mono text-slate-400">
                      NavMenuGroup
                    </span>
                    <div className="mt-1 flex flex-col gap-1">
                      <div className="relative px-2 py-0.5 border border-dashed border-slate-300 rounded">
                        <span className="text-[10px] font-mono text-slate-400">
                          NavMenuGroupTitle
                        </span>
                      </div>
                      <div className="relative px-2 py-0.5 border border-dashed border-slate-300 rounded">
                        <span className="text-[10px] font-mono text-slate-400">
                          NavMenuGroupItem
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex flex-col gap-1">
                  <div className="relative px-2 py-0.5 border border-dashed border-green-300 rounded">
                    <span className="text-[10px] font-mono text-green-500">
                      NavMenuSeparator (optional)
                    </span>
                  </div>
                  <div className="relative px-2 py-0.5 border border-dashed border-green-300 rounded">
                    <span className="text-[10px] font-mono text-green-500">
                      NavMenuLink (optional)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Code tree */}
        <SubSection title="Component Tree">
          <Code>{`<NavMenu trigger="hover">            ← root: manages open state
  <NavMenuList>                       ← flex row + animated underline
    <NavMenuLink href="/">Home</NavMenuLink>  ← standalone link

    <NavMenuItem>                     ← item with dropdown
      <NavMenuTrigger icon={Icon}>    ← label + chevron
        Products
      </NavMenuTrigger>
      <NavMenuIndicator />            ← animated caret below trigger
      <NavMenuContent columns={2}>   ← dropdown panel (mega: 2 cols)
        <NavMenuGroup>               ← mega menu column
          <NavMenuGroupTitle>        ← column heading
            Inventory
          </NavMenuGroupTitle>
          <NavMenuGroupItem          ← rich link: icon + label + desc
            href="/inventory"
            icon={Package}
            label="Stock"
            description="Track items"
          />
        </NavMenuGroup>
        <NavMenuSeparator />         ← <hr> divider
        <NavMenuLink href="/help">   ← plain link inside dropdown
          Help
        </NavMenuLink>
      </NavMenuContent>
    </NavMenuItem>
  </NavMenuList>
</NavMenu>`}</Code>
        </SubSection>

        {/* Parts table */}
        <SubSection title="Parts">
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {['Part', 'Element', 'Role'].map((h) => (
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
                    'NavMenu',
                    '<nav>',
                    'Root. Provides context: activeMenu, trigger mode, closeDelay.',
                  ],
                  [
                    'NavMenuList',
                    '<div>',
                    'Horizontal flex row. Renders the animated sliding underline.',
                  ],
                  [
                    'NavMenuItem',
                    '<div>',
                    'Wrapper for one item with a dropdown. Owns hover/click logic.',
                  ],
                  [
                    'NavMenuTrigger',
                    '<button>',
                    'Hoverable/clickable label with chevron. Stamped with data-active for underline tracking.',
                  ],
                  [
                    'NavMenuIndicator',
                    '<div>',
                    'Animated diamond caret that points into the open dropdown.',
                  ],
                  [
                    'NavMenuContent',
                    '<div>',
                    'Dropdown panel. columns=1 is a regular menu; 2–4 is a mega menu grid.',
                  ],
                  [
                    'NavMenuLink',
                    '<a>',
                    'Standalone link (in list) or plain row (in dropdown). Supports as prop.',
                  ],
                  ['NavMenuGroup', '<div>', 'Column container inside a mega menu (columns ≥ 2).'],
                  ['NavMenuGroupTitle', '<p>', 'Column heading inside NavMenuGroup.'],
                  [
                    'NavMenuGroupItem',
                    '<a>',
                    'Rich link row: icon box + label + description. Supports as prop.',
                  ],
                  ['NavMenuSeparator', '<hr>', 'Divider inside NavMenuContent.'],
                ].map(([part, el, role]) => (
                  <tr key={part} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                      {part}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400 whitespace-nowrap">
                      {el}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">
                      {role}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SubSection>
      </Section>

      {/* ── Keyboard Behavior ──────────────────────────────────────────────── */}
      <Section title="Keyboard Behavior">
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {['Key', 'Action'].map((h) => (
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
                ['Escape', 'Closes the active dropdown'],
                [
                  'Click (trigger="click" mode)',
                  'Click NavMenuTrigger to open; click again or outside to close',
                ],
                ['Tab', 'Moves focus through focusable elements inside the open dropdown'],
              ].map(([key, action]) => (
                <tr key={key} className="even:bg-gray-50">
                  <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                    {key}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">
                    {action}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ── Best Practices ─────────────────────────────────────────────────── */}
      <Section title="Best Practices">
        <div className="flex flex-col gap-8">
          {[
            {
              heading: 'When to use',
              items: [
                {
                  title: 'Desktop/tablet apps with 3–7 top-level sections',
                  body: 'Use NavMenu when some sections have sub-pages that benefit from grouped dropdowns or mega menu panels. Best when the layout is wide and a persistent horizontal nav fits above the main content.',
                },
                {
                  title: 'Keep trigger labels short — 1 to 2 words',
                  body: 'Short labels like "Products" or "Settings" scan faster and keep the sliding underline animation crisp. Long labels crowd the nav bar.',
                },
                {
                  title: 'Use NavMenuGroupTitle to label mega menu columns',
                  body: 'Column headings give users a clear mental model of how sub-pages are organised before they scan individual items.',
                },
              ],
            },
            {
              heading: 'When not to use',
              items: [
                {
                  title: 'Mobile-first apps',
                  body: "Don't use for mobile-first apps — use bottom navigation instead. Horizontal nav bars don't adapt well to small screens.",
                },
                {
                  title: '8+ sections or deeply nested hierarchies',
                  body: "Don't use for 8+ sections or deeply nested hierarchies — use a Sidebar instead. NavMenu only supports one level of dropdowns.",
                },
                {
                  title: 'In-page content switching without a route change',
                  body: "Don't use for in-page content switching — use the Tabs component. NavMenu is designed for route-level navigation only.",
                },
              ],
            },
            {
              heading: 'Accessibility',
              items: [
                {
                  title: 'Always pass the active prop',
                  body: 'Pass active to NavMenuLink and NavMenuGroupItem to reflect the current route. The sliding underline and highlighted state both depend on it.',
                },
                {
                  title: 'Escape closes open dropdowns',
                  body: 'Tab moves focus through focusable elements inside the open panel. NavMenuLink renders as <a>, which is screen-reader-friendly by default.',
                },
              ],
            },
            {
              heading: 'Advice',
              items: [
                {
                  title: 'trigger="hover" for desktop, trigger="click" for touch/accessibility',
                  body: 'Hover mode rewards experienced users who know the layout. Click mode is safer for touch-friendly devices and accessibility-focused contexts where mouseenter is unreliable.',
                },
                {
                  title: 'Pair with usePathname() to derive the active prop',
                  body: "Use pathname.startsWith('/inventory') for section roots with child routes — an exact match misses active state on sub-pages. Pass a stable id to NavMenuItem when using controlled mode.",
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
        <SubSection
          title="NavMenu"
          description="Root component. Manages open state and trigger mode."
        >
          <ApiTable
            rows={[
              ['trigger', "'hover' | 'click'", "'hover'", 'How dropdowns open and close.'],
              ['closeDelay', 'number', '150', 'Ms before hover-close fires (hover mode only).'],
              ['value', 'string | null', '—', 'Controlled: id of the open NavMenuItem.'],
              [
                'onValueChange',
                '(id: string | null) => void',
                '—',
                'Controlled: called when active item changes.',
              ],
              ['className', 'string', '—', 'Extra classes on the <nav> element.'],
            ]}
          />
        </SubSection>

        <SubSection title="NavMenuItem" description="Wrapper for one item with a dropdown.">
          <ApiTable
            rows={[
              [
                'id',
                'string',
                'useId()',
                'Override the auto-generated id. Required for controlled mode.',
              ],
              ['className', 'string', '—', 'Extra classes on the wrapper div.'],
            ]}
          />
        </SubSection>

        <SubSection
          title="NavMenuContent"
          description="The dropdown panel. columns controls mega menu layout."
        >
          <ApiTable
            rows={[
              [
                'columns',
                '1 | 2 | 3 | 4',
                '1',
                'Number of mega menu columns. 1 = regular dropdown.',
              ],
              [
                'align',
                "'start' | 'center' | 'end'",
                "'start'",
                'Horizontal alignment relative to NavMenuItem.',
              ],
              ['className', 'string', '—', 'Extra classes on the dropdown panel.'],
            ]}
          />
        </SubSection>

        <SubSection
          title="NavMenuLink"
          description="Standalone link in the list or a plain row inside a dropdown. Supports as prop for Next.js routing."
        >
          <ApiTable
            rows={[
              [
                'as',
                'ElementType',
                "'a'",
                'Polymorphic — pass Next.js Link for client-side routing.',
              ],
              ['href', 'string', '—', 'The link destination.'],
              ['active', 'boolean', 'false', 'Highlights the link as the current route.'],
              ['icon', 'LucideIcon', '—', 'Optional icon rendered before the label.'],
              ['className', 'string', '—', 'Extra classes.'],
            ]}
          />
        </SubSection>

        <SubSection
          title="NavMenuGroupItem"
          description="Rich link row with an icon box, label, and optional description. Supports as prop."
        >
          <ApiTable
            rows={[
              [
                'as',
                'ElementType',
                "'a'",
                'Polymorphic — pass Next.js Link for client-side routing.',
              ],
              ['href', 'string', '—', 'The link destination.'],
              ['active', 'boolean', 'false', 'Highlights as the current route.'],
              ['icon', 'LucideIcon', '—', 'Icon rendered in a rounded square.'],
              ['label', 'string', '—', 'Primary text.'],
              ['description', 'string', '—', 'Secondary text below the label.'],
              ['className', 'string', '—', 'Extra classes.'],
            ]}
          />
        </SubSection>
      </Section>
    </div>
  ),
}
