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
  FileText,
  Database,
  Globe,
  Zap,
  PieChart,
  Tag,
  Layers,
  Archive,
  Filter,
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
  NavMenuSubItem,
  NavMenuSubTrigger,
  NavMenuSubContent,
} from './NavMenu'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'NavMenu/Nested Submenu' }
export default meta

const Preview = ({ label, children }) => (
  <div className="flex flex-col gap-2">
    {label && <span className="text-xs text-gray-400">{label}</span>}
    <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg overflow-visible min-h-[200px]">
      {children}
    </div>
  </div>
)

const Code = ({ children }) => (
  <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto mb-4 leading-relaxed">
    <code>{children}</code>
  </pre>
)

// ─── Demos ────────────────────────────────────────────────────────────────────

function SimpleNestedDemo() {
  return (
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
  )
}

function MegaWithNestedDemo() {
  return (
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
              <NavMenuGroupItem href="#" icon={Package} label="Stock" description="Track items" />

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
              <NavMenuGroupItem href="#" icon={Wallet} label="Portfolio" description="Holdings" />

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
  )
}

// ─── Story ────────────────────────────────────────────────────────────────────

export const NestedSubmenu = {
  name: 'Nested Submenu',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-4xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        Use <code className="font-mono bg-gray-100 px-1 rounded text-xs">NavMenuSubItem</code>,{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">NavMenuSubTrigger</code>, and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">NavMenuSubContent</code> inside
        any <code className="font-mono bg-gray-100 px-1 rounded text-xs">NavMenuContent</code> to
        add a flyout submenu. Hover the row with a <strong>›</strong> chevron to reveal the nested
        panel to the right. Works inside regular dropdowns and mega menu columns.
      </p>

      <Preview label="simple dropdown with nested submenu — hover 'Filter by Category' or 'Notifications'">
        <SimpleNestedDemo />
      </Preview>

      <Preview label="mega menu with nested submenu inside a column group — hover 'Analytics' or 'P&L Analysis'">
        <MegaWithNestedDemo />
      </Preview>

      <Code>{`import {
  NavMenuSubItem,
  NavMenuSubTrigger,
  NavMenuSubContent,
} from '@/components/base/NavMenu/NavMenu'

{/* Inside any NavMenuContent */}
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
</NavMenuContent>

{/* Inside a mega menu column (NavMenuGroup) */}
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
  </NavMenuGroup>
</NavMenuContent>`}</Code>
    </div>
  ),
}
