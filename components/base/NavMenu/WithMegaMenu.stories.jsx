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
const meta = { title: 'NavMenu/With Mega Menu' }
export default meta

const Preview = ({ children }) => (
  <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg mb-3 overflow-visible">
    {children}
  </div>
)

const Code = ({ children }) => (
  <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto mb-4 leading-relaxed">
    <code>{children}</code>
  </pre>
)

export const WithMegaMenu = {
  name: 'With Mega Menu',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-4xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">columns</code> to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">NavMenuContent</code> for a
        multi-column mega menu. Use{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">NavMenuGroup</code>,{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">NavMenuGroupTitle</code>, and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">NavMenuGroupItem</code> to
        build the column layout.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">2 columns</span>
        <Preview>
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
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">3 columns</span>
        <Preview>
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
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">active item in mega menu</span>
        <Preview>
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
      </div>

      <Code>{`{/* 2-column mega menu */}
<NavMenuContent columns={2}>
  <NavMenuGroup>
    <NavMenuGroupTitle>Inventory</NavMenuGroupTitle>
    <NavMenuGroupItem
      href="/stock"
      icon={Package}
      label="Stock"
      description="Track and manage your items"
    />
    <NavMenuGroupItem
      href="/analytics"
      icon={BarChart2}
      label="Analytics"
      description="Usage patterns and trends"
      active
    />
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
