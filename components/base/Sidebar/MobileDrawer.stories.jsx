import { useState } from 'react'
import { Home, Package, Settings, TrendingUp, X } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarOverlay,
  SidebarProvider,
  SidebarTrigger,
} from './Sidebar'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Sidebar/Mobile Drawer',
}

export default meta

function MobileDrawerDemo() {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="relative flex flex-col h-[500px] w-full max-w-sm border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
        <header className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 shrink-0">
          <SidebarTrigger />
          <span className="font-semibold text-gray-800 text-sm">My App</span>
        </header>

        <SidebarOverlay />

        <Sidebar>
          <SidebarHeader>
            <SidebarTrigger />
            <span className="ml-2 font-semibold text-gray-800 text-sm">Navigation</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup label="Main">
              <SidebarItem icon={<Home className="size-4" />} label="Dashboard" active />
              <SidebarItem icon={<Package className="size-4" />} label="Inventory" badge={3} />
              <SidebarItem icon={<TrendingUp className="size-4" />} label="Trading" />
            </SidebarGroup>
            <SidebarGroup label="Account">
              <SidebarItem icon={<Settings className="size-4" />} label="Settings" />
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 p-4">
          <p className="text-sm text-gray-500">
            Tap the menu icon in the header to open the drawer.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            On mobile the sidebar renders as a Dialog drawer. The overlay closes it on backdrop
            click.
          </p>
        </main>
      </div>
    </SidebarProvider>
  )
}

export const MobileDrawer = {
  name: 'Mobile Drawer',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        On screens <code className="font-mono bg-gray-100 px-1 rounded text-xs">{'<='} 768px</code>,
        the sidebar renders as a Radix Dialog drawer sliding in from the left.{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">SidebarOverlay</code> renders
        the backdrop — clicking it closes the drawer.{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">SidebarTrigger</code> shows a
        Menu icon when closed and an X icon when open.
      </p>

      <MobileDrawerDemo />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<SidebarProvider defaultOpen={false}>
  {/* Overlay — click backdrop to close */}
  <SidebarOverlay />

  {/* Drawer slides in from the left on mobile */}
  <Sidebar>
    <SidebarHeader>
      <SidebarTrigger />  {/* shows X when open */}
    </SidebarHeader>
    <SidebarContent>...</SidebarContent>
  </Sidebar>

  <main>
    {/* Trigger in top navbar */}
    <SidebarTrigger />
    ...
  </main>
</SidebarProvider>`}</code>
      </pre>
    </div>
  ),
}
