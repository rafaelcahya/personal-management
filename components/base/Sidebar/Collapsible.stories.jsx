import { BarChart2, Home, Package, Settings, TrendingUp } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarProvider,
  SidebarTrigger,
} from './Sidebar'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Sidebar/Collapsible',
}

export default meta

export const Collapsible = {
  name: 'Collapsible',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Click the menu button to toggle between expanded (240px) and icon-only (56px) modes. In
        collapsed mode, labels and badges fade out and each item shows a tooltip on hover with its
        label. Group labels collapse to zero height. Start collapsed:{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">defaultCollapsed=true</code>.
      </p>

      <SidebarProvider defaultCollapsed>
        <div className="flex h-80 border border-gray-200 rounded-lg overflow-hidden w-full max-w-lg">
          <Sidebar>
            <SidebarHeader>
              <SidebarTrigger />
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup label="Main">
                <SidebarItem icon={<Home className="size-4" />} label="Dashboard" active />
                <SidebarItem icon={<Package className="size-4" />} label="Inventory" badge={5} />
                <SidebarItem icon={<TrendingUp className="size-4" />} label="Trading" />
                <SidebarItem icon={<BarChart2 className="size-4" />} label="Analytics" />
              </SidebarGroup>
              <SidebarGroup label="Account">
                <SidebarItem icon={<Settings className="size-4" />} label="Settings" />
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex-1 p-4 bg-gray-50">
            <p className="text-sm text-gray-500">Hover over icons to see tooltips</p>
          </main>
        </div>
      </SidebarProvider>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Start in collapsed (icon-only) state */}
<SidebarProvider defaultCollapsed>
  <div className="flex h-screen">
    <Sidebar>
      <SidebarHeader>
        <SidebarTrigger />   {/* toggles collapsed */}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup label="Main">
          {/* label fades out when collapsed, tooltip appears on hover */}
          <SidebarItem icon={<HomeIcon />} label="Dashboard" active />
          <SidebarItem icon={<PackageIcon />} label="Inventory" badge={5} />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
    <main className="flex-1">...</main>
  </div>
</SidebarProvider>`}</code>
      </pre>
    </div>
  ),
}
