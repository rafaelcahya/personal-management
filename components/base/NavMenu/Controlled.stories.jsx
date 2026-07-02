import { useState } from 'react'
import { Package, BarChart2, TrendingUp, Wallet, Settings, Users, Bell } from 'lucide-react'
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
} from './NavMenu'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'NavMenu/Controlled' }
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

function ControlledDemo() {
  const [activeMenu, setActiveMenu] = useState(null)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-500">Open programmatically:</span>
        <button
          onClick={() => setActiveMenu(activeMenu === 'inventory' ? null : 'inventory')}
          className="px-3 py-1.5 text-xs font-medium rounded-md border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
        >
          Toggle Inventory
        </button>
        <button
          onClick={() => setActiveMenu(activeMenu === 'trading' ? null : 'trading')}
          className="px-3 py-1.5 text-xs font-medium rounded-md border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
        >
          Toggle Trading
        </button>
        <button
          onClick={() => setActiveMenu(null)}
          className="px-3 py-1.5 text-xs font-medium rounded-md border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
        >
          Close All
        </button>
        <span className="text-xs text-gray-400 ml-2">
          active: <span className="font-mono text-violet-600">{activeMenu ?? 'null'}</span>
        </span>
      </div>

      <NavMenu trigger="click" value={activeMenu} onValueChange={setActiveMenu}>
        <NavMenuList>
          <NavMenuLink href="#" active>
            Home
          </NavMenuLink>

          <NavMenuItem id="inventory">
            <NavMenuTrigger icon={Package}>Inventory</NavMenuTrigger>
            <NavMenuIndicator />
            <NavMenuContent columns={2}>
              <NavMenuGroup>
                <NavMenuGroupTitle>Stock</NavMenuGroupTitle>
                <NavMenuGroupItem
                  href="#"
                  icon={Package}
                  label="Items"
                  description="Manage stock"
                />
                <NavMenuGroupItem
                  href="#"
                  icon={BarChart2}
                  label="Analytics"
                  description="Usage trends"
                />
              </NavMenuGroup>
              <NavMenuGroup>
                <NavMenuGroupTitle>Reports</NavMenuGroupTitle>
                <NavMenuGroupItem
                  href="#"
                  icon={TrendingUp}
                  label="Monthly"
                  description="Monthly summaries"
                />
                <NavMenuGroupItem
                  href="#"
                  icon={Wallet}
                  label="Costs"
                  description="Expense breakdown"
                />
              </NavMenuGroup>
            </NavMenuContent>
          </NavMenuItem>

          <NavMenuItem id="trading">
            <NavMenuTrigger icon={TrendingUp}>Trading</NavMenuTrigger>
            <NavMenuIndicator />
            <NavMenuContent columns={2}>
              <NavMenuGroup>
                <NavMenuGroupTitle>Positions</NavMenuGroupTitle>
                <NavMenuGroupItem
                  href="#"
                  icon={TrendingUp}
                  label="Trades"
                  description="Open and closed"
                />
                <NavMenuGroupItem href="#" icon={Wallet} label="Portfolio" description="Holdings" />
              </NavMenuGroup>
              <NavMenuGroup>
                <NavMenuGroupTitle>Analysis</NavMenuGroupTitle>
                <NavMenuGroupItem
                  href="#"
                  icon={BarChart2}
                  label="P&L"
                  description="Profit and loss"
                />
                <NavMenuGroupItem
                  href="#"
                  icon={Package}
                  label="Reports"
                  description="Performance summary"
                />
              </NavMenuGroup>
            </NavMenuContent>
          </NavMenuItem>

          <NavMenuItem id="settings">
            <NavMenuTrigger icon={Settings}>Settings</NavMenuTrigger>
            <NavMenuIndicator />
            <NavMenuContent>
              <NavMenuLink href="#" icon={Users}>
                Account
              </NavMenuLink>
              <NavMenuLink href="#" icon={Bell}>
                Notifications
              </NavMenuLink>
            </NavMenuContent>
          </NavMenuItem>
        </NavMenuList>
      </NavMenu>
    </div>
  )
}

export const Controlled = {
  name: 'Controlled',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-3xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">value</code> and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">onValueChange</code> to take
        control of which dropdown is open. Give each{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">NavMenuItem</code> a stable{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">id</code> so you can reference
        it from external code.
      </p>

      <Preview>
        <ControlledDemo />
      </Preview>

      <Code>{`const [activeMenu, setActiveMenu] = useState(null)

<NavMenu trigger="click" value={activeMenu} onValueChange={setActiveMenu}>
  <NavMenuList>
    <NavMenuItem id="inventory">
      <NavMenuTrigger icon={Package}>Inventory</NavMenuTrigger>
      <NavMenuIndicator />
      <NavMenuContent columns={2}>
        ...
      </NavMenuContent>
    </NavMenuItem>

    <NavMenuItem id="trading">
      <NavMenuTrigger icon={TrendingUp}>Trading</NavMenuTrigger>
      <NavMenuIndicator />
      <NavMenuContent>
        ...
      </NavMenuContent>
    </NavMenuItem>
  </NavMenuList>
</NavMenu>

{/* Open programmatically */}
<button onClick={() => setActiveMenu('inventory')}>Open Inventory</button>
<button onClick={() => setActiveMenu(null)}>Close All</button>`}</Code>
    </div>
  ),
}
