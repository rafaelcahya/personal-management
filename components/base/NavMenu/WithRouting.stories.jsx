import { Package, BarChart2, TrendingUp, Wallet, Settings, Users, Bell } from 'lucide-react'
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
} from './NavMenu'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'NavMenu/With Routing' }
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

export const WithRouting = {
  name: 'With Routing',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-3xl">
      <p className="text-sm text-gray-500 leading-relaxed">
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
          NavMenuLink + NavMenuGroupItem — both with as=Link (links don't navigate in Storybook)
        </span>
        <Preview>
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
        </Preview>
      </div>

      <Code>{`import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AppNav() {
  const pathname = usePathname()

  return (
    <NavMenu trigger="hover">
      <NavMenuList>
        {/* Standalone link */}
        <NavMenuLink as={Link} href="/" active={pathname === '/'}>
          Home
        </NavMenuLink>

        {/* Dropdown with mega menu */}
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
                active={pathname === '/inventory'}
              />
              <NavMenuGroupItem
                as={Link}
                href="/inventory/analytics"
                icon={BarChart2}
                label="Analytics"
                description="Usage patterns"
                active={pathname === '/inventory/analytics'}
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
