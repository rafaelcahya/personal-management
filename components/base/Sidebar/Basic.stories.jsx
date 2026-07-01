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
  title: 'Sidebar/Basic',
}

export default meta

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        A simple sidebar with navigation items and no collapse behavior. The{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">active</code> prop marks the
        current page with a violet background and sets{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">aria-current="page"</code>.
      </p>

      <SidebarProvider>
        <div className="flex h-80 border border-gray-200 rounded-lg overflow-hidden w-full max-w-lg">
          <Sidebar>
            <SidebarHeader>
              <SidebarTrigger />
              <span className="ml-2 font-semibold text-gray-800 text-sm">My App</span>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup label="Main">
                <SidebarItem icon={<Home className="size-4" />} label="Dashboard" active />
                <SidebarItem icon={<Package className="size-4" />} label="Inventory" />
                <SidebarItem icon={<TrendingUp className="size-4" />} label="Trading" />
                <SidebarItem icon={<BarChart2 className="size-4" />} label="Analytics" />
              </SidebarGroup>
              <SidebarGroup label="Settings">
                <SidebarItem icon={<Settings className="size-4" />} label="Preferences" />
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex-1 p-4 bg-gray-50">
            <p className="text-sm text-gray-500">Main content area</p>
          </main>
        </div>
      </SidebarProvider>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<SidebarProvider>
  <div className="flex h-screen">
    <Sidebar>
      <SidebarHeader>
        <SidebarTrigger />
        <span>My App</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup label="Main">
          <SidebarItem icon={<HomeIcon />} label="Dashboard" active />
          <SidebarItem icon={<PackageIcon />} label="Inventory" />
          <SidebarItem icon={<TrendingUpIcon />} label="Trading" />
        </SidebarGroup>
        <SidebarGroup label="Settings">
          <SidebarItem icon={<SettingsIcon />} label="Preferences" />
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
