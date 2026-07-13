import {
  Package,
  BarChart2,
  TrendingUp,
  Wallet,
  Settings,
  Users,
  Bell,
  HelpCircle,
  Activity,
  ShoppingCart,
  PieChart,
  FileText,
  Database,
  Zap,
  Shield,
  Globe,
  Filter,
  Tag,
  Layers,
  Archive,
} from 'lucide-react'
import Link from 'next/link'
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
  NavMenuSubItem,
  NavMenuSubTrigger,
  NavMenuSubContent,
} from './NavMenu'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'NavMenu/Menu' }
export default meta

const BestPractices = ({ items }) => (
  <div className="flex flex-col gap-8 w-full max-w-2xl">
    {items.map(({ heading, cards }) => (
      <div key={heading}>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          {heading}
        </p>
        <div className="flex flex-col gap-3">
          {cards.map(({ title, body }) => (
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
)

const Preview = ({ label, children }) => (
  <div className="flex flex-col gap-2">
    {label && <span className="text-xs text-gray-400">{label}</span>}
    <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg mb-3 overflow-visible">
      {children}
    </div>
  </div>
)

const Code = ({ children }) => (
  <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto mb-4 leading-relaxed">
    <code>{children}</code>
  </pre>
)

// ─── 2 Columns ────────────────────────────────────────────────────────────────

export const TwoColumns = {
  name: '2 Columns',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">columns={'{2}'}</code> to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">NavMenuContent</code> to split
        the dropdown into two side-by-side groups. Each group uses{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">NavMenuGroup</code> with a{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">NavMenuGroupTitle</code>{' '}
        heading and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">NavMenuGroupItem</code> rows.
      </p>

      <Preview label="columns={2} — 2 side-by-side groups">
        <NavMenu trigger="hover">
          <NavMenuList>
            <NavMenuLink href="#" active>
              Home
            </NavMenuLink>
            <NavMenuItem>
              <NavMenuTrigger icon={Package}>Platform</NavMenuTrigger>
              <NavMenuIndicator />
              <NavMenuContent columns={2}>
                <NavMenuGroup>
                  <NavMenuGroupTitle>Inventory</NavMenuGroupTitle>
                  <NavMenuGroupItem
                    href="#"
                    icon={Package}
                    label="Stock"
                    description="Track and manage your items"
                  />
                  <NavMenuGroupItem
                    href="#"
                    icon={BarChart2}
                    label="Analytics"
                    description="Usage patterns and trends"
                  />
                  <NavMenuGroupItem
                    href="#"
                    icon={ShoppingCart}
                    label="Orders"
                    description="Purchase history"
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
                  <NavMenuGroupItem
                    href="#"
                    icon={PieChart}
                    label="P&L Report"
                    description="Realized and unrealized gains"
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
      </Preview>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Two distinct categories with roughly equal item counts',
                body: '2 columns is the most common mega menu layout — use it when the section covers exactly 2 sub-domains that deserve equal visual weight.',
              },
              {
                title: 'Keep item counts balanced — 3 to 5 per group',
                body: 'A column with 1 item next to one with 5 creates visual imbalance and wastes the layout. Aim for ±1 item difference across groups.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't force items into 2 columns if one group is sparse",
                body: 'A near-empty column next to a full one signals poor information architecture. If item counts are very uneven, use 1 column with a separator instead.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Always add NavMenuGroupTitle to each group',
                body: "Without column headings, users don't know how the items relate before scanning individual rows — especially important in wide panels where visual scanning starts at the top.",
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Two columns implies two equal sub-domains',
                body: 'If one category is significantly more important, consider a single column with a separator or a 1-column layout with group titles — columns imply parity.',
              },
            ],
          },
        ]}
      />

      <Code>{`<NavMenuContent columns={2}>
  <NavMenuGroup>
    <NavMenuGroupTitle>Inventory</NavMenuGroupTitle>
    <NavMenuGroupItem href="/stock" icon={Package} label="Stock" description="Track items" />
    <NavMenuGroupItem href="/analytics" icon={BarChart2} label="Analytics" description="Usage trends" />
  </NavMenuGroup>
  <NavMenuGroup>
    <NavMenuGroupTitle>Trading</NavMenuGroupTitle>
    <NavMenuGroupItem href="/trades" icon={TrendingUp} label="Trades" description="Open positions" />
    <NavMenuGroupItem href="/portfolio" icon={Wallet} label="Portfolio" description="Holdings" />
  </NavMenuGroup>
</NavMenuContent>`}</Code>
    </div>
  ),
}

// ─── 3 Columns ────────────────────────────────────────────────────────────────

export const ThreeColumns = {
  name: '3 Columns',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">columns={'{3}'}</code> for
        a wider mega menu with three groups. Use this when the section covers three distinct
        sub-domains that are equally important and need equal visual weight.
      </p>

      <Preview label="columns={3} — 3 side-by-side groups">
        <NavMenu trigger="hover">
          <NavMenuList>
            <NavMenuItem>
              <NavMenuTrigger>Solutions</NavMenuTrigger>
              <NavMenuIndicator />
              <NavMenuContent columns={3}>
                <NavMenuGroup>
                  <NavMenuGroupTitle>Analytics</NavMenuGroupTitle>
                  <NavMenuGroupItem
                    href="#"
                    icon={Activity}
                    label="Running Tracker"
                    description="Training data and AI coaching"
                  />
                  <NavMenuGroupItem
                    href="#"
                    icon={BarChart2}
                    label="Inventory Analytics"
                    description="Usage and stock patterns"
                  />
                  <NavMenuGroupItem
                    href="#"
                    icon={PieChart}
                    label="Portfolio Stats"
                    description="Performance overview"
                  />
                </NavMenuGroup>
                <NavMenuGroup>
                  <NavMenuGroupTitle>Data</NavMenuGroupTitle>
                  <NavMenuGroupItem
                    href="#"
                    icon={Database}
                    label="Supabase"
                    description="PostgreSQL backend"
                  />
                  <NavMenuGroupItem
                    href="#"
                    icon={FileText}
                    label="Reports"
                    description="Export and schedule reports"
                  />
                  <NavMenuGroupItem
                    href="#"
                    icon={Zap}
                    label="Automations"
                    description="Trigger-based workflows"
                  />
                </NavMenuGroup>
                <NavMenuGroup>
                  <NavMenuGroupTitle>Platform</NavMenuGroupTitle>
                  <NavMenuGroupItem
                    href="#"
                    icon={Shield}
                    label="Security"
                    description="Auth and permissions"
                  />
                  <NavMenuGroupItem
                    href="#"
                    icon={Globe}
                    label="API"
                    description="REST endpoints reference"
                  />
                  <NavMenuGroupItem
                    href="#"
                    icon={Users}
                    label="Team"
                    description="Members and roles"
                  />
                </NavMenuGroup>
              </NavMenuContent>
            </NavMenuItem>
          </NavMenuList>
        </NavMenu>
      </Preview>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Exactly 3 distinct and equally important sub-domains',
                body: 'Use 3 columns when the section genuinely covers three parallel categories with balanced item counts — not just to fill the available panel width.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't add a third column just to use the space",
                body: 'An empty or sparse third column reads as incomplete. If one group has fewer items, merge it with a related group or use 2 columns instead.',
              },
              {
                title: 'Avoid when the trigger is near the nav bar edge',
                body: '3-column panels are wide — a trigger near the left or right edge may cause the panel to clip on narrower viewports.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Keep item counts consistent across all three groups',
                body: '3 columns with uneven item counts (5 / 2 / 1) signals a design that was not reviewed. Aim for ±1 item difference so no column feels incomplete.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Let the align prop handle edge alignment automatically',
                body: 'Use align="center" or align="end" when the trigger is not centered in the nav bar — NavMenuContent aligns itself relative to the NavMenuItem so the panel stays within the viewport.',
              },
            ],
          },
        ]}
      />

      <Code>{`<NavMenuContent columns={3}>
  <NavMenuGroup>
    <NavMenuGroupTitle>Analytics</NavMenuGroupTitle>
    <NavMenuGroupItem href="/running" icon={Activity} label="Running Tracker" description="Training data" />
    <NavMenuGroupItem href="/inventory" icon={BarChart2} label="Inventory Analytics" description="Stock patterns" />
  </NavMenuGroup>
  <NavMenuGroup>
    <NavMenuGroupTitle>Data</NavMenuGroupTitle>
    <NavMenuGroupItem href="/db" icon={Database} label="Supabase" description="PostgreSQL backend" />
    <NavMenuGroupItem href="/reports" icon={FileText} label="Reports" description="Export and schedule" />
  </NavMenuGroup>
  <NavMenuGroup>
    <NavMenuGroupTitle>Platform</NavMenuGroupTitle>
    <NavMenuGroupItem href="/security" icon={Shield} label="Security" description="Auth and permissions" />
    <NavMenuGroupItem href="/api" icon={Globe} label="API" description="REST endpoints reference" />
  </NavMenuGroup>
</NavMenuContent>`}</Code>
    </div>
  ),
}

// ─── Active Item ──────────────────────────────────────────────────────────────

export const ActiveItem = {
  name: 'Active Item',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">active</code> to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">NavMenuGroupItem</code> to mark
        the current route. The active item renders with a violet left border and background
        highlight so users know where they are even when the dropdown is open.
      </p>

      <Preview label="active prop on NavMenuGroupItem — Stock is the current route">
        <NavMenu trigger="hover">
          <NavMenuList>
            <NavMenuItem>
              <NavMenuTrigger icon={Package}>Platform</NavMenuTrigger>
              <NavMenuIndicator />
              <NavMenuContent columns={2}>
                <NavMenuGroup>
                  <NavMenuGroupTitle>Inventory</NavMenuGroupTitle>
                  <NavMenuGroupItem
                    href="#"
                    icon={Package}
                    label="Stock"
                    description="Track and manage your items"
                    active
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
          </NavMenuList>
        </NavMenu>
      </Preview>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Always mark the current route with active',
                body: 'Users should never need to close the dropdown and check the URL bar to know where they are. Pass active to both NavMenuLink (in the list) and NavMenuGroupItem (in dropdowns).',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't mark multiple items active simultaneously",
                body: 'If the current route matches both a section root and a child, prefer the more specific match — only one item should be active at a time.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'The active state changes color and background for visual orientation',
                body: 'Screen readers announce active links the same as normal links — the visual highlight aids sighted users in understanding where they are within the nav hierarchy.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use pathname.startsWith() for section roots with child routes',
                body: "Derive active from usePathname() — use pathname.startsWith('/inventory') so the active state persists on sub-pages like /inventory/detail. An exact === check misses child routes.",
              },
            ],
          },
        ]}
      />

      <Code>{`import { usePathname } from 'next/navigation'

const pathname = usePathname()

<NavMenuGroupItem
  href="/inventory"
  icon={Package}
  label="Stock"
  description="Track and manage your items"
  active={pathname.startsWith('/inventory')}
/>`}</Code>
    </div>
  ),
}

// ─── Simple Nested Submenu ────────────────────────────────────────────────────

export const SimpleNestedSubmenu = {
  name: 'Simple Nested Submenu',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Place <code className="font-mono bg-gray-100 px-1 rounded text-xs">NavMenuSubItem</code>,{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">NavMenuSubTrigger</code>, and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">NavMenuSubContent</code> inside
        a regular <code className="font-mono bg-gray-100 px-1 rounded text-xs">NavMenuContent</code>{' '}
        to add a flyout submenu. Hover the row with a <strong>›</strong> chevron to reveal the
        nested panel to the right.
      </p>

      <Preview label="hover 'Filter by Category' or 'Notifications' to open the submenu">
        <NavMenu trigger="hover">
          <NavMenuList>
            <NavMenuLink href="#" active>
              Home
            </NavMenuLink>

            <NavMenuItem>
              <NavMenuTrigger icon={Package}>Inventory</NavMenuTrigger>
              <NavMenuIndicator />
              <NavMenuContent>
                <NavMenuLink href="#" icon={Package}>
                  Stock Overview
                </NavMenuLink>
                <NavMenuSubItem>
                  <NavMenuSubTrigger icon={Filter}>Filter by Category</NavMenuSubTrigger>
                  <NavMenuSubContent>
                    <NavMenuLink href="#" icon={Tag}>
                      Electronics
                    </NavMenuLink>
                    <NavMenuLink href="#" icon={Archive}>
                      Storage
                    </NavMenuLink>
                    <NavMenuLink href="#" icon={Layers}>
                      Components
                    </NavMenuLink>
                    <NavMenuSeparator />
                    <NavMenuLink href="#">All Categories</NavMenuLink>
                  </NavMenuSubContent>
                </NavMenuSubItem>
                <NavMenuLink href="#" icon={BarChart2}>
                  Analytics
                </NavMenuLink>
                <NavMenuLink href="#" icon={FileText}>
                  Reports
                </NavMenuLink>
              </NavMenuContent>
            </NavMenuItem>

            <NavMenuItem>
              <NavMenuTrigger icon={Settings}>Settings</NavMenuTrigger>
              <NavMenuIndicator />
              <NavMenuContent>
                <NavMenuLink href="#" icon={Users}>
                  Account
                </NavMenuLink>
                <NavMenuSubItem>
                  <NavMenuSubTrigger icon={Bell}>Notifications</NavMenuSubTrigger>
                  <NavMenuSubContent>
                    <NavMenuLink href="#">Email</NavMenuLink>
                    <NavMenuLink href="#">Push</NavMenuLink>
                    <NavMenuLink href="#">In-App</NavMenuLink>
                  </NavMenuSubContent>
                </NavMenuSubItem>
                <NavMenuSeparator />
                <NavMenuLink href="#" icon={HelpCircle}>
                  Help
                </NavMenuLink>
              </NavMenuContent>
            </NavMenuItem>
          </NavMenuList>
        </NavMenu>
      </Preview>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'When a dropdown item has sub-choices too many to list flat',
                body: 'Use a nested submenu when one row has 3–6 sub-options that belong together — enough to warrant a flyout but not enough to justify a full mega menu column.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Restructure as a mega menu if more than 2 items need submenus',
                body: 'Multiple sub-triggers in the same dropdown are hard to scan. If more than 2 rows need their own flyout, use columns instead.',
              },
              {
                title: "Don't use submenus for items reachable by their own top-level trigger",
                body: 'Deep nesting adds cognitive load. If a submenu item is important enough, promote it to a top-level NavMenuItem with its own dropdown.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'NavMenuSubTrigger renders a › chevron automatically',
                body: "The icon prop adds a leading icon to the row but does not replace the chevron. The chevron is the affordance that signals 'this opens a flyout'.",
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Keep the submenu panel short — 3 to 6 items',
                body: 'Long flyout panels are hard to scan and may clip outside the viewport on narrower screens. If the list grows beyond 6 items, promote to a dedicated dropdown.',
              },
            ],
          },
        ]}
      />

      <Code>{`import {
  NavMenuSubItem, NavMenuSubTrigger, NavMenuSubContent,
} from '@/components/base/NavMenu/NavMenu'

<NavMenuContent>
  <NavMenuLink href="/stock" icon={Package}>Stock Overview</NavMenuLink>

  <NavMenuSubItem>
    <NavMenuSubTrigger icon={Filter}>Filter by Category</NavMenuSubTrigger>
    <NavMenuSubContent>
      <NavMenuLink href="/electronics" icon={Tag}>Electronics</NavMenuLink>
      <NavMenuLink href="/storage" icon={Archive}>Storage</NavMenuLink>
      <NavMenuSeparator />
      <NavMenuLink href="/categories">All Categories</NavMenuLink>
    </NavMenuSubContent>
  </NavMenuSubItem>

  <NavMenuLink href="/analytics" icon={BarChart2}>Analytics</NavMenuLink>
</NavMenuContent>`}</Code>
    </div>
  ),
}

// ─── Mega Menu Nested Submenu ─────────────────────────────────────────────────

export const MegaMenuNestedSubmenu = {
  name: 'Mega Menu Nested Submenu',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">NavMenuSubItem</code> can be
        placed directly inside a{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">NavMenuGroup</code>, alongside{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">NavMenuGroupItem</code> rows.
        This adds a flyout submenu within a mega menu column.
      </p>

      <Preview label="hover 'Analytics' or 'P&L Analysis' to open the submenu inside a mega menu column">
        <NavMenu trigger="hover">
          <NavMenuList>
            <NavMenuLink href="#" active>
              Dashboard
            </NavMenuLink>

            <NavMenuItem>
              <NavMenuTrigger icon={Package}>Platform</NavMenuTrigger>
              <NavMenuIndicator />
              <NavMenuContent columns={2}>
                <NavMenuGroup>
                  <NavMenuGroupTitle>Inventory</NavMenuGroupTitle>
                  <NavMenuGroupItem
                    href="#"
                    icon={Package}
                    label="Stock"
                    description="Track items"
                  />
                  <NavMenuSubItem>
                    <NavMenuSubTrigger icon={BarChart2}>Analytics</NavMenuSubTrigger>
                    <NavMenuSubContent>
                      <NavMenuLink href="#" icon={Activity}>
                        Usage Trends
                      </NavMenuLink>
                      <NavMenuLink href="#" icon={PieChart}>
                        Category Breakdown
                      </NavMenuLink>
                      <NavMenuLink href="#" icon={ShoppingCart}>
                        Purchase History
                      </NavMenuLink>
                    </NavMenuSubContent>
                  </NavMenuSubItem>
                  <NavMenuGroupItem
                    href="#"
                    icon={FileText}
                    label="Reports"
                    description="Export data"
                  />
                </NavMenuGroup>
                <NavMenuGroup>
                  <NavMenuGroupTitle>Trading</NavMenuGroupTitle>
                  <NavMenuGroupItem
                    href="#"
                    icon={TrendingUp}
                    label="Trades"
                    description="Open positions"
                  />
                  <NavMenuGroupItem
                    href="#"
                    icon={Wallet}
                    label="Portfolio"
                    description="Holdings"
                  />
                  <NavMenuSubItem>
                    <NavMenuSubTrigger icon={PieChart}>P&L Analysis</NavMenuSubTrigger>
                    <NavMenuSubContent>
                      <NavMenuLink href="#">Realized Gains</NavMenuLink>
                      <NavMenuLink href="#">Unrealized Gains</NavMenuLink>
                      <NavMenuLink href="#">Tax Summary</NavMenuLink>
                    </NavMenuSubContent>
                  </NavMenuSubItem>
                </NavMenuGroup>
              </NavMenuContent>
            </NavMenuItem>

            <NavMenuItem>
              <NavMenuTrigger icon={Globe}>Integrations</NavMenuTrigger>
              <NavMenuIndicator />
              <NavMenuContent>
                <NavMenuLink href="#" icon={Database}>
                  Supabase
                </NavMenuLink>
                <NavMenuSubItem>
                  <NavMenuSubTrigger icon={Zap}>Automations</NavMenuSubTrigger>
                  <NavMenuSubContent>
                    <NavMenuLink href="#">Stock Alerts</NavMenuLink>
                    <NavMenuLink href="#">Price Triggers</NavMenuLink>
                    <NavMenuLink href="#">Report Schedule</NavMenuLink>
                    <NavMenuSeparator />
                    <NavMenuLink href="#">Manage All</NavMenuLink>
                  </NavMenuSubContent>
                </NavMenuSubItem>
                <NavMenuLink href="#" icon={Activity}>
                  Webhooks
                </NavMenuLink>
              </NavMenuContent>
            </NavMenuItem>
          </NavMenuList>
        </NavMenu>
      </Preview>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'When one mega menu column item has its own sub-choices',
                body: 'Place NavMenuSubItem inside NavMenuGroup when a single column item needs a flyout — it fits naturally alongside NavMenuGroupItem rows without breaking the column layout.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Limit to 1 sub-trigger per column group',
                body: 'Multiple NavMenuSubItem rows in the same group make the column hard to scan and the flyout behavior hard to predict. One sub-trigger per group is the maximum.',
              },
              {
                title: 'Promote to a top-level trigger if the submenu grows beyond 5–6 items',
                body: 'A long flyout nested inside a mega menu column is too deep to navigate comfortably. Give it its own NavMenuItem at the top level instead.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'NavMenuSubItem inherits the same hover and focus styles as regular rows',
                body: 'No extra accessibility configuration is needed — the component applies the correct styles and keyboard behavior automatically.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Place the sub-trigger where it fits contextually, not always at the end',
                body: 'Position NavMenuSubItem between the items most related to its flyout content. A sub-trigger at the end of a group often feels like an afterthought.',
              },
            ],
          },
        ]}
      />

      <Code>{`{/* NavMenuSubItem inside a NavMenuGroup (mega menu column) */}
<NavMenuContent columns={2}>
  <NavMenuGroup>
    <NavMenuGroupTitle>Inventory</NavMenuGroupTitle>
    <NavMenuGroupItem href="/stock" icon={Package} label="Stock" description="Track items" />

    <NavMenuSubItem>
      <NavMenuSubTrigger icon={BarChart2}>Analytics</NavMenuSubTrigger>
      <NavMenuSubContent>
        <NavMenuLink href="/usage" icon={Activity}>Usage Trends</NavMenuLink>
        <NavMenuLink href="/breakdown" icon={PieChart}>Category Breakdown</NavMenuLink>
      </NavMenuSubContent>
    </NavMenuSubItem>

    <NavMenuGroupItem href="/reports" icon={FileText} label="Reports" description="Export data" />
  </NavMenuGroup>
</NavMenuContent>`}</Code>
    </div>
  ),
}

// ─── With Routing ─────────────────────────────────────────────────────────────

export const WithRouting = {
  name: 'With Routing',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">as={'{Link}'}</code> from{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">next/link</code> to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">NavMenuLink</code> or{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">NavMenuGroupItem</code> for
        Next.js client-side navigation. Use{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">usePathname()</code> to derive
        the <code className="font-mono bg-gray-100 px-1 rounded text-xs">active</code> prop.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          NavMenuLink + NavMenuGroupItem — both with as=Link (links don&apos;t navigate in
          Storybook)
        </span>
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg mb-3 overflow-visible">
          <NavMenu trigger="hover">
            <NavMenuList>
              <NavMenuLink as={Link} href="/" active>
                Home
              </NavMenuLink>

              <NavMenuItem>
                <NavMenuTrigger icon={Package}>Platform</NavMenuTrigger>
                <NavMenuIndicator />
                <NavMenuContent columns={2}>
                  <NavMenuGroup>
                    <NavMenuGroupTitle>Inventory</NavMenuGroupTitle>
                    <NavMenuGroupItem
                      as={Link}
                      href="/inventory"
                      icon={Package}
                      label="Stock"
                      description="Track and manage items"
                      active
                    />
                    <NavMenuGroupItem
                      as={Link}
                      href="/inventory/analytics"
                      icon={BarChart2}
                      label="Analytics"
                      description="Usage patterns and trends"
                    />
                  </NavMenuGroup>
                  <NavMenuGroup>
                    <NavMenuGroupTitle>Trading</NavMenuGroupTitle>
                    <NavMenuGroupItem
                      as={Link}
                      href="/trades"
                      icon={TrendingUp}
                      label="Trades"
                      description="Open and closed positions"
                    />
                    <NavMenuGroupItem
                      as={Link}
                      href="/portfolio"
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
                  <NavMenuLink as={Link} href="/account" icon={Users}>
                    Account
                  </NavMenuLink>
                  <NavMenuLink as={Link} href="/notifications" icon={Bell}>
                    Notifications
                  </NavMenuLink>
                  <NavMenuSeparator />
                  <NavMenuLink as={Link} href="/running">
                    Running Tracker
                  </NavMenuLink>
                </NavMenuContent>
              </NavMenuItem>
            </NavMenuList>
          </NavMenu>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Pass as={Link} for Next.js client-side navigation',
                body: "The as prop accepts any component with an href prop — next/link, react-router's Link, or a custom wrapper all work without extra wrapping.",
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't call usePathname() inside each individual link render",
                body: 'Compute active once at the layout level and pass it down — calling usePathname() inside every NavMenuLink or NavMenuGroupItem is wasteful and harder to reason about.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Next.js Link preserves all native link semantics',
                body: 'Screen readers announce as={Link} links the same as native anchor elements — no extra aria attributes are needed when using the polymorphic as prop.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use pathname.startsWith() for section roots with child routes',
                body: "An exact pathname === '/inventory' check misses active state on sub-pages like /inventory/detail. Use pathname.startsWith('/inventory') so the active state persists across the full section.",
              },
            ],
          },
        ]}
      />

      <Code>{`import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AppNav() {
  const pathname = usePathname()

  return (
    <NavMenu trigger="hover">
      <NavMenuList>
        <NavMenuLink as={Link} href="/" active={pathname === '/'}>
          Home
        </NavMenuLink>

        <NavMenuItem>
          <NavMenuTrigger icon={Package}>Platform</NavMenuTrigger>
          <NavMenuIndicator />
          <NavMenuContent columns={2}>
            <NavMenuGroup>
              <NavMenuGroupTitle>Inventory</NavMenuGroupTitle>
              <NavMenuGroupItem
                as={Link}
                href="/inventory"
                icon={Package}
                label="Stock"
                description="Track and manage items"
                active={pathname.startsWith('/inventory')}
              />
            </NavMenuGroup>
            <NavMenuGroup>
              <NavMenuGroupTitle>Trading</NavMenuGroupTitle>
              <NavMenuGroupItem
                as={Link}
                href="/trades"
                icon={TrendingUp}
                label="Trades"
                description="Open positions"
                active={pathname === '/trades'}
              />
            </NavMenuGroup>
          </NavMenuContent>
        </NavMenuItem>
      </NavMenuList>
    </NavMenu>
  )
}`}</Code>
    </div>
  ),
}
