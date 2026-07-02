import {
  Package,
  BarChart2,
  TrendingUp,
  Wallet,
  Settings,
  Users,
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
  NavMenuSeparator,
} from './NavMenu'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'NavMenu/Basic' }
export default meta

const Preview = ({ children, className = '' }) => (
  <div
    className={`p-6 bg-gray-50 border border-gray-200 rounded-lg mb-3 overflow-visible ${className}`}
  >
    {children}
  </div>
)

const Code = ({ children }) => (
  <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto mb-4 leading-relaxed">
    <code>{children}</code>
  </pre>
)

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-3xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        A minimal nav with a standalone link and two simple dropdowns. Hover over{' '}
        <strong>Products</strong> or <strong>Settings</strong> to open the dropdown. The{' '}
        <strong>Home</strong> link is marked active.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">hover trigger (default)</span>
        <Preview>
          <NavMenu trigger="hover">
            <NavMenuList>
              <NavMenuLink href="#" active>
                Home
              </NavMenuLink>

              <NavMenuItem>
                <NavMenuTrigger icon={Package}>Products</NavMenuTrigger>
                <NavMenuIndicator />
                <NavMenuContent>
                  <NavMenuLink href="#" icon={Package}>
                    Stock
                  </NavMenuLink>
                  <NavMenuLink href="#" icon={BarChart2}>
                    Analytics
                  </NavMenuLink>
                  <NavMenuLink href="#" icon={TrendingUp}>
                    Trades
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
        <span className="text-xs text-gray-400">without icons on triggers</span>
        <Preview>
          <NavMenu trigger="hover">
            <NavMenuList>
              <NavMenuLink href="#" active>
                Dashboard
              </NavMenuLink>
              <NavMenuItem>
                <NavMenuTrigger>Inventory</NavMenuTrigger>
                <NavMenuIndicator />
                <NavMenuContent>
                  <NavMenuLink href="#">Stock</NavMenuLink>
                  <NavMenuLink href="#">Analytics</NavMenuLink>
                  <NavMenuLink href="#">Reports</NavMenuLink>
                </NavMenuContent>
              </NavMenuItem>
              <NavMenuItem>
                <NavMenuTrigger>Trading</NavMenuTrigger>
                <NavMenuIndicator />
                <NavMenuContent>
                  <NavMenuLink href="#">Trades</NavMenuLink>
                  <NavMenuLink href="#">Portfolio</NavMenuLink>
                  <NavMenuSeparator />
                  <NavMenuLink href="#">P&amp;L Report</NavMenuLink>
                </NavMenuContent>
              </NavMenuItem>
              <NavMenuLink href="#">Activity</NavMenuLink>
            </NavMenuList>
          </NavMenu>
        </Preview>
      </div>

      <Code>{`import {
  NavMenu, NavMenuList, NavMenuItem,
  NavMenuTrigger, NavMenuContent, NavMenuIndicator,
  NavMenuLink, NavMenuSeparator,
} from '@/components/base/NavMenu/NavMenu'

<NavMenu trigger="hover">
  <NavMenuList>
    <NavMenuLink href="/" active>Home</NavMenuLink>

    <NavMenuItem>
      <NavMenuTrigger icon={Package}>Products</NavMenuTrigger>
      <NavMenuIndicator />
      <NavMenuContent>
        <NavMenuLink href="/stock" icon={Package}>Stock</NavMenuLink>
        <NavMenuLink href="/analytics" icon={BarChart2}>Analytics</NavMenuLink>
      </NavMenuContent>
    </NavMenuItem>

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
    </div>
  ),
}
