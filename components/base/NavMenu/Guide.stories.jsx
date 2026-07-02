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

// ─── Live demo ────────────────────────────────────────────────────────────────

function AnatomyDemo() {
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
      {/* Header */}
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

      {/* Overview */}
      <Section title="Overview">
        <Preview>
          <AnatomyDemo />
        </Preview>
        <p className="text-xs text-gray-400 mb-4">
          Hover over Products or Settings to see the dropdown. Home link is marked active.
        </p>
      </Section>

      {/* Anatomy */}
      <Section title="Anatomy">
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
        <NavMenuGroup>
          ...
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

        <SubSection title="Parts">
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {['Part', 'Role'].map((h) => (
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
                  ['NavMenu', 'Root. Provides context: activeMenu, trigger mode, closeDelay.'],
                  ['NavMenuList', 'Horizontal flex row. Renders the animated sliding underline.'],
                  ['NavMenuItem', 'Wrapper for one item with a dropdown. Owns hover/click logic.'],
                  [
                    'NavMenuTrigger',
                    'Clickable/hoverable label. Stamped with data-active for underline tracking.',
                  ],
                  [
                    'NavMenuIndicator',
                    'Animated diamond caret that points into the open dropdown.',
                  ],
                  [
                    'NavMenuContent',
                    'Dropdown panel. columns=1 is a regular menu; 2–4 is a mega menu grid.',
                  ],
                  [
                    'NavMenuLink',
                    'Standalone link (in list) or plain row (in dropdown). Supports as prop.',
                  ],
                  ['NavMenuGroup', 'Column container inside a mega menu (columns ≥ 2).'],
                  ['NavMenuGroupTitle', 'Column heading inside NavMenuGroup.'],
                  [
                    'NavMenuGroupItem',
                    'Rich link row: icon box + label + description. Supports as prop.',
                  ],
                  ['NavMenuSeparator', '<hr> divider inside NavMenuContent.'],
                ].map(([part, role]) => (
                  <tr key={part} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                      {part}
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

      {/* Usage */}
      <Section title="Usage">
        <SubSection title="Import">
          <Code>{`import {
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
} from '@/components/base/NavMenu/NavMenu'`}</Code>
        </SubSection>

        <SubSection title="Simple dropdown">
          <Code>{`<NavMenu trigger="hover">
  <NavMenuList>
    <NavMenuLink href="/" active>Home</NavMenuLink>
    <NavMenuItem>
      <NavMenuTrigger icon={Settings}>Settings</NavMenuTrigger>
      <NavMenuIndicator />
      <NavMenuContent>
        <NavMenuLink href="/account" icon={Users}>Account</NavMenuLink>
        <NavMenuLink href="/notifications" icon={Bell}>Notifications</NavMenuLink>
        <NavMenuSeparator />
        <NavMenuLink href="/help" icon={HelpCircle}>Help</NavMenuLink>
      </NavMenuContent>
    </NavMenuItem>
  </NavMenuList>
</NavMenu>`}</Code>
        </SubSection>

        <SubSection title="Mega menu (2 columns)">
          <Code>{`<NavMenu trigger="hover">
  <NavMenuList>
    <NavMenuItem>
      <NavMenuTrigger icon={Package}>Products</NavMenuTrigger>
      <NavMenuIndicator />
      <NavMenuContent columns={2}>
        <NavMenuGroup>
          <NavMenuGroupTitle>Inventory</NavMenuGroupTitle>
          <NavMenuGroupItem href="/inventory" icon={Package} label="Stock" description="Track items" />
          <NavMenuGroupItem href="/analytics" icon={BarChart2} label="Analytics" description="Usage trends" />
        </NavMenuGroup>
        <NavMenuGroup>
          <NavMenuGroupTitle>Trading</NavMenuGroupTitle>
          <NavMenuGroupItem href="/trades" icon={TrendingUp} label="Trades" description="Open positions" />
          <NavMenuGroupItem href="/portfolio" icon={Wallet} label="Portfolio" description="Holdings" />
        </NavMenuGroup>
      </NavMenuContent>
    </NavMenuItem>
  </NavMenuList>
</NavMenu>`}</Code>
        </SubSection>

        <SubSection title="Next.js routing via as prop">
          <Code>{`import Link from 'next/link'
import { usePathname } from 'next/navigation'

const pathname = usePathname()

<NavMenuLink as={Link} href="/inventory" active={pathname === '/inventory'}>
  Inventory
</NavMenuLink>

<NavMenuGroupItem
  as={Link}
  href="/inventory"
  icon={Package}
  label="Stock"
  description="Track and manage items"
  active={pathname === '/inventory'}
/>`}</Code>
        </SubSection>
      </Section>

      {/* Keyboard */}
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
                  'Click (trigger mode)',
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

      {/* API */}
      <Section title="API Reference">
        <SubSection title="NavMenu">
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

        <SubSection title="NavMenuItem">
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
                    'id',
                    'string',
                    'useId()',
                    'Override the auto-generated id. Required for controlled mode.',
                  ],
                  ['className', 'string', '—', 'Extra classes on the wrapper div.'],
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

        <SubSection title="NavMenuContent">
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

        <SubSection title="NavMenuLink">
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
                  ['as', 'ElementType', "'a'", 'Polymorphic — pass Next.js Link for routing.'],
                  ['href', 'string', '—', 'The link destination.'],
                  ['active', 'boolean', 'false', 'Highlights the link as the current route.'],
                  ['icon', 'LucideIcon', '—', 'Optional icon rendered before the label.'],
                  ['className', 'string', '—', 'Extra classes.'],
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

        <SubSection title="NavMenuGroupItem">
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
                  ['as', 'ElementType', "'a'", 'Polymorphic — pass Next.js Link for routing.'],
                  ['href', 'string', '—', 'The link destination.'],
                  ['active', 'boolean', 'false', 'Highlights as the current route.'],
                  ['icon', 'LucideIcon', '—', 'Icon rendered in a rounded square.'],
                  ['label', 'string', '—', 'Primary text.'],
                  ['description', 'string', '—', 'Secondary text below the label.'],
                  ['className', 'string', '—', 'Extra classes.'],
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
                {['Use NavMenu when…', 'Consider an alternative when…'].map((h) => (
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
                      The app has 3–7 top-level sections that benefit from horizontal grouping in a
                      persistent nav bar
                    </li>
                    <li>
                      Some sections have sub-pages that are easier to discover in a grouped dropdown
                      or mega menu panel
                    </li>
                    <li>
                      The layout is wide (desktop/tablet) and a horizontal nav bar fits naturally
                      above the main content area
                    </li>
                    <li>
                      You need hover-triggered or click-triggered dropdowns with a brief close delay
                      for fluid mouse movement
                    </li>
                  </ul>
                </td>
                <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700 align-top">
                  <ul className="flex flex-col gap-1.5">
                    <li>
                      Use <strong>Sidebar</strong> when the app has many sections (8+), deep
                      nesting, or needs to stay visible at all times for quick jumps between areas
                    </li>
                    <li>
                      Use <strong>Tabs</strong> when switching between views within the same page —
                      NavMenu is for global app navigation, not in-page content switching
                    </li>
                    <li>
                      Use a simple <strong>anchor link list</strong> when the page is a single long
                      document and navigation is scroll-based rather than route-based
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
                  Keep top-level trigger labels short — 1 to 2 words (e.g. "Products", "Settings").
                  Long labels crowd the nav bar and make the sliding underline animation feel off.
                </p>
              </div>
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <p className="text-xs text-green-800">
                  Use{' '}
                  <code className="font-mono bg-green-100 px-0.5 rounded">NavMenuGroupTitle</code>{' '}
                  to label each column in a mega menu. It gives users a clear mental model of how
                  the sub-pages are organised before they scan the items.
                </p>
              </div>
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <p className="text-xs text-green-800">
                  Always pass the{' '}
                  <code className="font-mono bg-green-100 px-0.5 rounded">active</code> prop to{' '}
                  <code className="font-mono bg-green-100 px-0.5 rounded">NavMenuLink</code> and{' '}
                  <code className="font-mono bg-green-100 px-0.5 rounded">NavMenuGroupItem</code> so
                  the sliding underline and highlighted state reflect the current route.
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
                  Don't nest a second dropdown inside{' '}
                  <code className="font-mono bg-red-100 px-0.5 rounded">NavMenuContent</code>.
                  NavMenu only supports one level of dropdowns — deeper hierarchies should be
                  handled by a Sidebar or a dedicated sub-navigation pattern.
                </p>
              </div>
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <p className="text-xs text-red-800">
                  Don't place more than 5–6 items in{' '}
                  <code className="font-mono bg-red-100 px-0.5 rounded">NavMenuList</code>. Too many
                  triggers crowd the bar and collapse awkwardly on narrower screens — move
                  lower-priority sections behind a "More" menu instead.
                </p>
              </div>
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <p className="text-xs text-red-800">
                  Don't use NavMenu as in-page tab navigation. If the content below changes without
                  a route change, use the <strong>Tabs</strong> component — NavMenu is designed for
                  route-level navigation only.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  ),
}
