import { BarChart2, Home, Package, Settings, TrendingUp } from 'lucide-react'
import { Sidebar, SidebarContent, SidebarGroup, SidebarItem, SidebarProvider } from './Sidebar'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Sidebar/Size',
}

export default meta

const navItems = [
  { icon: Home, label: 'Dashboard', active: true },
  { icon: Package, label: 'Inventory', badge: 3 },
  { icon: TrendingUp, label: 'Trading' },
  { icon: BarChart2, label: 'Analytics' },
  { icon: Settings, label: 'Settings', disabled: true },
]

const sizes = [
  { value: 'sm', label: 'sm', desc: 'px-1.5 py-1 · min-h-[32px] · icon size-4' },
  { value: 'md', label: 'md (default)', desc: 'px-2 py-1.5 · min-h-[38px] · icon size-4' },
  { value: 'lg', label: 'lg', desc: 'px-2 py-2 · min-h-[44px] · icon size-5' },
]

export const Size = {
  name: 'Size',
  render: () => (
    <div className="flex flex-col gap-8 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">size</code> prop on{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">SidebarItem</code> controls
        padding, min-height, gap, and icon size. Mix sizes freely within the same sidebar — for
        example compact items in a footer vs standard items in the nav.
      </p>

      <div className="grid grid-cols-3 gap-4 w-full max-w-3xl">
        {sizes.map(({ value, label, desc }) => (
          <div key={value} className="flex flex-col gap-2">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-gray-700">
                size=&quot;{value}&quot;{value === 'md' ? ' (default)' : ''}
              </span>
              <span className="text-[11px] text-gray-400">{desc}</span>
            </div>
            <SidebarProvider defaultCollapsed={false}>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <Sidebar>
                  <SidebarContent>
                    <SidebarGroup>
                      {navItems.map(({ icon: Icon, label: itemLabel, active, badge, disabled }) => (
                        <SidebarItem
                          key={itemLabel}
                          size={value}
                          icon={<Icon />}
                          label={itemLabel}
                          badge={badge}
                          active={active}
                          disabled={disabled}
                        />
                      ))}
                    </SidebarGroup>
                  </SidebarContent>
                </Sidebar>
              </div>
            </SidebarProvider>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 w-full max-w-3xl">
        <span className="text-xs font-semibold text-gray-700">Mixed sizes in one sidebar</span>
        <SidebarProvider defaultCollapsed={false}>
          <div className="border border-gray-200 rounded-lg overflow-hidden w-60">
            <Sidebar>
              <SidebarContent>
                <SidebarGroup label="Navigation">
                  <SidebarItem size="lg" icon={<Home />} label="Dashboard" active />
                  <SidebarItem size="lg" icon={<Package />} label="Inventory" badge={3} />
                  <SidebarItem size="lg" icon={<TrendingUp />} label="Trading" />
                </SidebarGroup>
                <SidebarGroup label="Quick actions">
                  <SidebarItem size="sm" icon={<BarChart2 />} label="Analytics" />
                  <SidebarItem size="sm" icon={<Settings />} label="Settings" />
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
          </div>
        </SidebarProvider>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<SidebarItem size="sm" icon={<HomeIcon />} label="Dashboard" />
<SidebarItem size="md" icon={<HomeIcon />} label="Dashboard" />  {/* default */}
<SidebarItem size="lg" icon={<HomeIcon />} label="Dashboard" />

{/* size can be mixed within the same sidebar */}
<SidebarGroup label="Navigation">
  <SidebarItem size="lg" icon={<HomeIcon />} label="Dashboard" active />
</SidebarGroup>
<SidebarGroup label="Quick actions">
  <SidebarItem size="sm" icon={<SettingsIcon />} label="Settings" />
</SidebarGroup>`}</code>
      </pre>
    </div>
  ),
}
