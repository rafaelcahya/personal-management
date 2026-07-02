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
const meta = { title: 'NavMenu/Trigger Modes' }
export default meta

const Preview = ({ label, children }) => (
  <div className="flex flex-col gap-2">
    {label && <span className="text-xs text-gray-400">{label}</span>}
    <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg overflow-visible">
      {children}
    </div>
  </div>
)

const Code = ({ children }) => (
  <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto mb-4 leading-relaxed">
    <code>{children}</code>
  </pre>
)

function SampleNav({ trigger }) {
  return (
    <NavMenu trigger={trigger}>
      <NavMenuList>
        <NavMenuLink href="#" active>
          Home
        </NavMenuLink>

        <NavMenuItem>
          <NavMenuTrigger icon={Package}>Inventory</NavMenuTrigger>
          <NavMenuIndicator />
          <NavMenuContent>
            <NavMenuLink href="#" icon={Package}>
              Stock
            </NavMenuLink>
            <NavMenuLink href="#" icon={BarChart2}>
              Analytics
            </NavMenuLink>
            <NavMenuLink href="#" icon={TrendingUp}>
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
            <NavMenuLink href="#" icon={Bell}>
              Notifications
            </NavMenuLink>
            <NavMenuSeparator />
            <NavMenuLink href="#" icon={HelpCircle}>
              Help
            </NavMenuLink>
          </NavMenuContent>
        </NavMenuItem>

        <NavMenuLink href="#">Activity</NavMenuLink>
      </NavMenuList>
    </NavMenu>
  )
}

export const TriggerModes = {
  name: 'Trigger Modes',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-3xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">trigger</code> prop on{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">NavMenu</code> controls how
        dropdowns open. Both modes close on Escape and support the animated underline indicator.
      </p>

      <div className="flex flex-col gap-6">
        <Preview label='trigger="hover" (default) — open on mouseenter, close on mouseleave with 150ms delay'>
          <SampleNav trigger="hover" />
        </Preview>

        <Preview label='trigger="click" — click to open, click again or outside to close'>
          <SampleNav trigger="click" />
        </Preview>
      </div>

      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              {['Mode', 'Opens', 'Closes'].map((h) => (
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
                'hover',
                'onMouseEnter the trigger',
                'onMouseLeave trigger or content (after closeDelay)',
              ],
              [
                'click',
                'onClick the trigger',
                'Click trigger again, click outside, or press Escape',
              ],
            ].map(([mode, opens, closes]) => (
              <tr key={mode} className="even:bg-gray-50">
                <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs">
                  {mode}
                </td>
                <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">{opens}</td>
                <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">{closes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Code>{`{/* Hover mode (default) */}
<NavMenu trigger="hover" closeDelay={150}>
  ...
</NavMenu>

{/* Click mode */}
<NavMenu trigger="click">
  ...
</NavMenu>`}</Code>
    </div>
  ),
}
