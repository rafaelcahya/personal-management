import { useState } from 'react'
import {
  BarChart2,
  Home,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  TrendingUp,
  User,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarItemBadge,
  SidebarItemIcon,
  SidebarItemLabel,
  SidebarOverlay,
  SidebarProvider,
  SidebarSub,
  SidebarTrigger,
} from './Sidebar'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Sidebar',
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

const Preview = ({ children, className }) => (
  <div
    className={`flex gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg mb-3 ${className ?? ''}`}
  >
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function OverviewDemo() {
  return (
    <SidebarProvider>
      <div className="flex h-64 border border-gray-200 rounded-lg overflow-hidden w-full max-w-lg">
        <Sidebar>
          <SidebarHeader>
            <SidebarTrigger />
            <span className="ml-2 font-semibold text-gray-800 text-sm">My App</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup label="Main">
              <SidebarItem icon={<Home className="size-4" />} label="Dashboard" active />
              <SidebarItem icon={<Package className="size-4" />} label="Inventory" badge={3} />
              <SidebarItem icon={<TrendingUp className="size-4" />} label="Trading" />
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 p-4 bg-gray-50">
          <p className="text-sm text-gray-500">Main content area</p>
        </main>
      </div>
    </SidebarProvider>
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
          <h1 className="text-3xl font-bold text-gray-900">Sidebar</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A composable navigation sidebar that supports collapsible desktop mode, mobile drawer (via{' '}
          <code className="font-mono text-sm">@radix-ui/react-dialog</code>), nested items, and
          icon-only mode with tooltips.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          <code className="font-mono text-xs bg-gray-100 px-1 rounded">SidebarProvider</code>{' '}
          manages open/collapsed state and detects mobile breakpoint via{' '}
          <code className="font-mono text-xs bg-gray-100 px-1 rounded">matchMedia</code>. On desktop
          the sidebar is an in-document{' '}
          <code className="font-mono text-xs bg-gray-100 px-1 rounded">{'<aside>'}</code> that
          transitions between 56px (icon-only) and 240px (expanded). On mobile it renders as a
          dialog drawer with an overlay backdrop.
        </p>
        <OverviewDemo />
      </Section>

      {/* Anatomy */}
      <Section title="Anatomy">
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4">
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wide mb-1">
                Structure
              </span>

              <div className="relative p-4 border-2 border-dashed border-violet-400 rounded-xl inline-block">
                <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-[10px] font-mono font-semibold text-violet-600">
                  SidebarProvider
                </span>

                <div className="relative p-3 border border-dashed border-blue-300 rounded-lg mb-2">
                  <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-blue-500">
                    Sidebar
                  </span>
                  <div className="mt-1 flex flex-col gap-1.5">
                    <div className="relative p-2 border border-dashed border-slate-300 rounded">
                      <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-slate-400">
                        SidebarHeader
                      </span>
                      <div className="mt-0.5 text-[10px] text-gray-400 font-mono">
                        SidebarTrigger + logo/title
                      </div>
                    </div>
                    <div className="relative p-2 border border-dashed border-slate-300 rounded">
                      <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-slate-400">
                        SidebarContent
                      </span>
                      <div className="relative p-2 border border-dashed border-green-300 rounded mt-1">
                        <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-green-500">
                          SidebarGroup (label)
                        </span>
                        <div className="mt-0.5 text-[10px] text-gray-400 font-mono">
                          SidebarItem (icon, label, badge)
                        </div>
                        <div className="mt-0.5 text-[10px] text-gray-400 font-mono pl-3">
                          └ SidebarSub → SidebarItem...
                        </div>
                      </div>
                    </div>
                    <div className="relative p-2 border border-dashed border-slate-300 rounded">
                      <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-slate-400">
                        SidebarFooter
                      </span>
                      <div className="mt-0.5 text-[10px] text-gray-400 font-mono">
                        user info + logout
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative p-2 border border-dashed border-green-300 rounded">
                  <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-green-500">
                    SidebarOverlay (mobile only)
                  </span>
                  <div className="mt-0.5 text-[10px] text-gray-400 font-mono">backdrop</div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
                  'SidebarProvider',
                  'Context + Dialog Root',
                  'Required root. Manages open/collapsed/isMobile state. Activates Radix Dialog on mobile.',
                ],
                [
                  'Sidebar',
                  '<aside> / DialogContent',
                  'Main sidebar shell. Renders as drawer (Dialog) on mobile, aside on desktop. Accepts side="left|right".',
                ],
                [
                  'SidebarTrigger',
                  '<button>',
                  'Toggles collapsed on desktop, open on mobile. Shows Menu/X icon contextually.',
                ],
                [
                  'SidebarOverlay',
                  'DialogOverlay',
                  'Backdrop shown on mobile. Click to close the drawer.',
                ],
                ['SidebarHeader', '<header>', 'Slot for logo, title, or trigger. Pinned to top.'],
                [
                  'SidebarContent',
                  '<div>',
                  'Scrollable area for navigation groups. Takes all remaining vertical space.',
                ],
                [
                  'SidebarFooter',
                  '<footer>',
                  'Slot for user info or secondary actions. Pinned to bottom.',
                ],
                [
                  'SidebarGroup',
                  '<div>',
                  'Optional labeled group of items. Label hides in collapsed mode.',
                ],
                [
                  'SidebarItem',
                  '<button>',
                  'Nav item. Props shortcut: icon, label, badge, active, disabled. Auto-detects SidebarSub children.',
                ],
                [
                  'SidebarItemIcon',
                  '<span>',
                  'Icon slot inside SidebarItem. Gets active color when parent is active.',
                ],
                [
                  'SidebarItemLabel',
                  '<span>',
                  'Label text. Fades and collapses to zero-width in collapsed mode (still in DOM for a11y).',
                ],
                [
                  'SidebarItemBadge',
                  '<span>',
                  'Pill badge (e.g. unread count). Hides in collapsed mode.',
                ],
                [
                  'SidebarSub',
                  '<div>',
                  'Animated collapsible sub-menu. Uses CSS grid-rows trick for smooth height transition.',
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

        <Code>{`<SidebarProvider>
  <SidebarOverlay />
  <Sidebar side="left">
    <SidebarHeader>
      <SidebarTrigger />
      <span>My App</span>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup label="Main">
        <SidebarItem icon={<HomeIcon />} label="Dashboard" active />
        <SidebarItem icon={<PackageIcon />} label="Inventory" badge={3}>
          <SidebarSub>
            <SidebarItem label="Products" />
            <SidebarItem label="Categories" />
          </SidebarSub>
        </SidebarItem>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <SidebarItem icon={<LogOutIcon />} label="Logout" />
    </SidebarFooter>
  </Sidebar>
  <main>...</main>
</SidebarProvider>`}</Code>
      </Section>

      {/* Usage */}
      <Section title="Usage">
        <SubSection title="Import">
          <Code>{`import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarItem,
  SidebarItemIcon,
  SidebarItemLabel,
  SidebarItemBadge,
  SidebarSub,
  SidebarOverlay,
} from '@/components/base/Sidebar/Sidebar'`}</Code>
        </SubSection>

        <SubSection title="Basic nav">
          <Code>{`<SidebarProvider>
  <div className="flex h-screen">
    <Sidebar>
      <SidebarHeader>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup label="Navigation">
          <SidebarItem icon={<HomeIcon />} label="Home" active />
          <SidebarItem icon={<SettingsIcon />} label="Settings" />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
    <main className="flex-1">...</main>
  </div>
</SidebarProvider>`}</Code>
        </SubSection>

        <SubSection title="Collapsible (desktop icon-only mode)">
          <Code>{`<SidebarProvider defaultCollapsed={false}>
  {/* SidebarTrigger toggles collapsed state on desktop */}
  {/* Labels and badges fade out; tooltips appear on hover */}
  <Sidebar>
    <SidebarHeader>
      <SidebarTrigger />
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarItem icon={<HomeIcon />} label="Home" />
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</SidebarProvider>`}</Code>
        </SubSection>

        <SubSection title="Mobile drawer">
          <Code>{`{/* On screens <= 768px, Sidebar renders as a Dialog drawer */}
<SidebarProvider>
  <SidebarOverlay />   {/* backdrop — click to close */}
  <Sidebar>
    <SidebarHeader>
      <SidebarTrigger />  {/* shows X when drawer is open */}
    </SidebarHeader>
    ...
  </Sidebar>
  {/* Trigger outside the sidebar (e.g. in a top navbar) */}
  <main>
    <SidebarTrigger />
    ...
  </main>
</SidebarProvider>`}</Code>
        </SubSection>

        <SubSection title="Nested items">
          <Code>{`<SidebarItem icon={<PackageIcon />} label="Inventory">
  <SidebarSub>
    <SidebarItem label="Products" />
    <SidebarItem label="Categories" />
    <SidebarItem label="Stock Alerts" badge={2} />
  </SidebarSub>
</SidebarItem>
{/* Clicking the parent item toggles the sub-menu open/closed */}
{/* SidebarSub uses CSS grid-rows trick for smooth height animation */}`}</Code>
        </SubSection>
      </Section>

      {/* Collapse behavior */}
      <Section
        title="Collapse Behavior"
        description="On desktop, the sidebar transitions between 240px (expanded) and 56px (collapsed). Labels, badges, and group labels fade out. Collapsed items show a tooltip on hover."
      >
        <SubSection title="Width transitions">
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {['State', 'Width', 'Labels', 'Badges', 'Group labels', 'Tooltips'].map((h) => (
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
                  ['Expanded', '240px (w-60)', 'Visible', 'Visible', 'Visible', 'Off'],
                  [
                    'Collapsed',
                    '56px (w-14)',
                    'Hidden (opacity-0, w-0)',
                    'Hidden',
                    'Hidden',
                    'On (right side)',
                  ],
                ].map(([state, ...cols]) => (
                  <tr key={state} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs">
                      {state}
                    </td>
                    {cols.map((c, i) => (
                      <td
                        key={i}
                        className="px-3 py-2 border border-gray-200 text-xs text-gray-700"
                      >
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SubSection>

        <SubSection title="Labels in collapsed mode">
          <p className="text-xs text-gray-500 mb-3">
            Labels use{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">
              opacity-0 w-0 overflow-hidden
            </code>{' '}
            rather than <code className="font-mono bg-gray-100 px-1 rounded">display:none</code>, so
            screen readers still read them while they are visually hidden. This satisfies WCAG 2.1
            AA requirements.
          </p>
        </SubSection>
      </Section>

      {/* API Reference */}
      <Section title="API Reference">
        <SubSection title="SidebarProvider" description="Required root. Manages all sidebar state.">
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {['Prop', 'Type', 'Default', 'Description'].map((h) => (
                    <th
                      key={h}
                      className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['defaultOpen', 'boolean', 'true', 'Initial open state (used on mobile).'],
                  [
                    'defaultCollapsed',
                    'boolean',
                    'false',
                    'Initial collapsed state (used on desktop).',
                  ],
                  ['children', 'ReactNode', '—', 'All sidebar parts and page content.'],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
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
          title="Sidebar"
          description="The sidebar shell. Renders as aside on desktop, dialog content on mobile."
        >
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {['Prop', 'Type', 'Default', 'Description'].map((h) => (
                    <th
                      key={h}
                      className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    'side',
                    "'left' | 'right'",
                    "'left'",
                    'Which side the sidebar attaches to. Controls border and slide animation direction.',
                  ],
                  ['className', 'string', '—', 'Extra classes merged onto the sidebar.'],
                  ['children', 'ReactNode', '—', 'Header, Content, Footer slots.'],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
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
          title="SidebarItem"
          description="Navigation item. Use props shortcut or sub-components directly."
        >
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {['Prop', 'Type', 'Default', 'Description'].map((h) => (
                    <th
                      key={h}
                      className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    'icon',
                    'ReactNode',
                    '—',
                    'Icon element rendered in SidebarItemIcon slot. Gets active color when active.',
                  ],
                  [
                    'label',
                    'string',
                    '—',
                    'Text label. Hides with transition when collapsed. Powers tooltip text.',
                  ],
                  ['badge', 'ReactNode', '—', 'Badge content (e.g. number). Hides when collapsed.'],
                  [
                    'size',
                    "'sm' | 'md' | 'lg'",
                    "'md'",
                    'Controls button padding, min-height, gap, and icon size.',
                  ],
                  [
                    'active',
                    'boolean',
                    'false',
                    'Marks item as current page. Adds violet background + aria-current="page".',
                  ],
                  ['disabled', 'boolean', 'false', 'Disables click and reduces opacity.'],
                  [
                    'onClick',
                    '() => void',
                    '—',
                    'Click handler. Called in addition to sub-menu toggle.',
                  ],
                  ['children', 'ReactNode', '—', 'Optional SidebarSub component for nested items.'],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
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

        <SubSection title="SidebarGroup" description="Groups related items with an optional label.">
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {['Prop', 'Type', 'Default', 'Description'].map((h) => (
                    <th
                      key={h}
                      className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    'label',
                    'string',
                    '—',
                    'Group heading. Collapses to zero height in collapsed mode.',
                  ],
                  ['children', 'ReactNode', '—', 'SidebarItem elements.'],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
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
          title="SidebarSub"
          description="Animated collapsible sub-menu. Place as a child of SidebarItem."
        >
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {['Prop', 'Type', 'Default', 'Description'].map((h) => (
                    <th
                      key={h}
                      className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    'open',
                    'boolean',
                    'false',
                    'Controlled by parent SidebarItem automatically — no need to pass manually.',
                  ],
                  ['children', 'ReactNode', '—', 'Nested SidebarItem elements.'],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
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
    </div>
  ),
}
