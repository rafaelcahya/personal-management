import { BarChart2, Home, Package, Settings, Tag, TrendingUp, Warehouse } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarProvider,
  SidebarSub,
  SidebarTrigger,
} from './Sidebar'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Sidebar/Animation',
}

export default meta

const subVariants = [
  {
    value: 'slide',
    label: 'slide (default)',
    desc: 'Smooth expand/collapse using CSS grid-rows transition (200ms)',
  },
  {
    value: 'none',
    label: 'none',
    desc: 'Instant show/hide — no transition, children unmounted when closed',
  },
]

const collapseVariants = [
  {
    value: 'slide',
    label: 'slide (default)',
    desc: 'Width animates from w-60 → w-14 over 200ms',
  },
  {
    value: 'none',
    label: 'none',
    desc: 'Width snaps instantly — no transition on width, label, or badge',
  },
]

function SubDemo({ animation }) {
  return (
    <SidebarProvider>
      <div className="flex h-72 border border-gray-200 rounded-lg overflow-hidden w-full max-w-xs">
        <Sidebar>
          <SidebarHeader>
            <SidebarTrigger />
            <span className="ml-2 font-semibold text-gray-800 text-sm">App</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarItem icon={<Home className="size-4" />} label="Dashboard" active />
              <SidebarItem icon={<Package className="size-4" />} label="Inventory">
                <SidebarSub animation={animation}>
                  <SidebarItem icon={<Warehouse className="size-4" />} label="Products" />
                  <SidebarItem icon={<Tag className="size-4" />} label="Categories" />
                  <SidebarItem label="Stock Alerts" badge={2} />
                </SidebarSub>
              </SidebarItem>
              <SidebarItem icon={<TrendingUp className="size-4" />} label="Trading">
                <SidebarSub animation={animation}>
                  <SidebarItem label="Open Positions" />
                  <SidebarItem icon={<BarChart2 className="size-4" />} label="Analytics" />
                </SidebarSub>
              </SidebarItem>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </div>
    </SidebarProvider>
  )
}

function CollapseDemo({ collapseAnimation }) {
  return (
    <SidebarProvider collapseAnimation={collapseAnimation}>
      <div className="flex h-56 border border-gray-200 rounded-lg overflow-hidden w-full max-w-xs">
        <Sidebar>
          <SidebarHeader>
            <SidebarTrigger />
            <span className="ml-2 font-semibold text-gray-800 text-sm">App</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup label="Navigation">
              <SidebarItem icon={<Home className="size-4" />} label="Dashboard" active />
              <SidebarItem icon={<Package className="size-4" />} label="Inventory" badge={3} />
              <SidebarItem icon={<TrendingUp className="size-4" />} label="Trading" />
              <SidebarItem icon={<Settings className="size-4" />} label="Settings" />
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </div>
    </SidebarProvider>
  )
}

export const Animation = {
  name: 'Animation',
  render: () => (
    <div className="flex flex-col gap-12 w-full">
      {/* SidebarSub animation */}
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-800">
            SidebarSub —{' '}
            <code className="font-mono bg-gray-100 px-1 rounded text-xs">animation</code>
          </p>
          <p className="text-sm text-gray-500 mt-0.5">
            Controls how nested items expand and collapse. Click a parent item to compare.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
          {subVariants.map(({ value, label, desc }) => (
            <div key={value} className="flex flex-col gap-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-gray-700">
                  animation=&quot;{value}&quot;{value === 'slide' ? ' (default)' : ''}
                </span>
                <span className="text-[11px] text-gray-400">{desc}</span>
              </div>
              <SubDemo animation={value} />
            </div>
          ))}
        </div>
        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
          <code>{`<SidebarItem label="Inventory">
  <SidebarSub animation="slide">   {/* default */}
    <SidebarItem label="Products" />
  </SidebarSub>
</SidebarItem>

<SidebarItem label="Inventory">
  <SidebarSub animation="none">
    <SidebarItem label="Products" />
  </SidebarSub>
</SidebarItem>`}</code>
        </pre>
      </div>

      <div className="w-full max-w-2xl border-t border-gray-100" />

      {/* Sidebar collapse animation */}
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-800">
            SidebarProvider —{' '}
            <code className="font-mono bg-gray-100 px-1 rounded text-xs">collapseAnimation</code>
          </p>
          <p className="text-sm text-gray-500 mt-0.5">
            Controls how the sidebar itself collapses and expands. Click the trigger button to
            compare.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
          {collapseVariants.map(({ value, label, desc }) => (
            <div key={value} className="flex flex-col gap-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-gray-700">
                  collapseAnimation=&quot;{value}&quot;{value === 'slide' ? ' (default)' : ''}
                </span>
                <span className="text-[11px] text-gray-400">{desc}</span>
              </div>
              <CollapseDemo collapseAnimation={value} />
            </div>
          ))}
        </div>
        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
          <code>{`{/* smooth collapse — default */}
<SidebarProvider collapseAnimation="slide">
  <Sidebar>...</Sidebar>
</SidebarProvider>

{/* instant collapse */}
<SidebarProvider collapseAnimation="none">
  <Sidebar>...</Sidebar>
</SidebarProvider>`}</code>
        </pre>
      </div>
    </div>
  ),
}
