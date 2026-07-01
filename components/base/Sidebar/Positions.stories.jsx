import { Home, Package, Settings, TrendingUp } from 'lucide-react'
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
  title: 'Sidebar/Positions',
}

export default meta

function SidebarDemo({ side, label }) {
  return (
    <div className="flex flex-col gap-2 flex-1 min-w-0">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
      <SidebarProvider>
        <div className="flex h-64 border border-gray-200 rounded-lg overflow-hidden">
          {side === 'right' && (
            <main className="flex-1 p-4 bg-gray-50">
              <p className="text-sm text-gray-400">Content</p>
            </main>
          )}
          <Sidebar side={side}>
            <SidebarHeader>
              <SidebarTrigger />
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarItem icon={<Home className="size-4" />} label="Home" active />
                <SidebarItem icon={<Package className="size-4" />} label="Inventory" />
                <SidebarItem icon={<TrendingUp className="size-4" />} label="Trading" />
                <SidebarItem icon={<Settings className="size-4" />} label="Settings" />
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          {side === 'left' && (
            <main className="flex-1 p-4 bg-gray-50">
              <p className="text-sm text-gray-400">Content</p>
            </main>
          )}
        </div>
      </SidebarProvider>
    </div>
  )
}

export const Positions = {
  name: 'Positions',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">side</code> prop controls
        which edge the sidebar attaches to. On mobile it also controls which direction the drawer
        slides in from.
      </p>

      <div className="flex gap-6 flex-wrap">
        <SidebarDemo side="left" label='side="left" (default)' />
        <SidebarDemo side="right" label='side="right"' />
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Left sidebar (default) */}
<Sidebar side="left">...</Sidebar>

{/* Right sidebar */}
<div className="flex h-screen">
  <main className="flex-1">...</main>
  <Sidebar side="right">...</Sidebar>
</div>`}</code>
      </pre>
    </div>
  ),
}
