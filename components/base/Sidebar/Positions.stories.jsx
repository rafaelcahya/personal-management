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

const BestPractices = ({ items }) => (
  <div className="flex flex-col gap-8 w-full max-w-2xl">
    {items.map(({ heading, cards }) => (
      <div key={heading}>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          {heading}
        </p>
        <div className="flex flex-col gap-3">
          {cards.map(({ title, body }) => (
            <div
              key={title}
              className="flex gap-3 p-4 rounded-lg border border-violet-100 bg-violet-50"
            >
              <span className="mt-0.5 shrink-0 size-4 rounded-full bg-violet-500 flex items-center justify-center text-white text-[10px] font-bold">
                ✓
              </span>
              <div>
                <p className="text-xs font-semibold text-violet-800 mb-0.5">{title}</p>
                <p className="text-xs text-violet-700 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
)

function SidebarDemo({ side }) {
  return (
    <SidebarProvider>
      <div className="flex h-64 border border-gray-200 rounded-lg overflow-hidden w-full">
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
  )
}

export const Left = {
  name: 'Left',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">side=&quot;left&quot;</code> —
        the default. Sidebar attaches to the left edge with a right border. On mobile, the drawer
        slides in from the left.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">side=&quot;left&quot; (default)</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <SidebarDemo side="left" />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'side="left" for all primary navigation sidebars',
                body: 'Left is the universal default for app navigation — it matches the reading direction and is where users look first. On mobile the left drawer slides in from the left edge.',
              },
              {
                title: 'Left sidebar pairs naturally with a top header',
                body: 'Users expect the logo and nav to be on the left, with main content filling the right. This spatial convention is consistent across nearly every major app.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Don\'t use side="left" for supplementary inspector panels',
                body: "Inspector panes and property editors belong on the right — they provide context for what's selected in the main content area. Reserve left for primary navigation only.",
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'Left drawer dismisses with Escape and overlay tap — both expected behaviors',
                body: 'Keyboard users press Escape; pointer users tap the overlay. The left-side entry point is spatially consistent with standard OS and browser navigation — no mental remapping needed.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'side="left" is the default — the prop can be omitted',
                body: 'You only need to pass side="right" explicitly. Omitting side is the same as side="left" — keep your JSX clean by relying on the default.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`{/* Left is the default — side prop can be omitted */}
<div className="flex h-screen">
  <Sidebar side="left">...</Sidebar>
  <main className="flex-1">...</main>
</div>`}</code>
      </pre>
    </div>
  ),
}

export const Right = {
  name: 'Right',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">side=&quot;right&quot;</code> —
        sidebar attaches to the right edge with a left border. On mobile, the drawer slides in from
        the right.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">side=&quot;right&quot;</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <SidebarDemo side="right" />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title:
                  'side="right" for supplementary panels — inspector panes, property editors, detail views',
                body: "The right side is where users expect contextual panels that react to what's selected in the main content area. Right-side panels provide context without replacing navigation.",
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Don\'t use side="right" for primary navigation',
                body: 'Users expect primary nav on the left. A right-side nav breaks the spatial convention of every major app and will consistently confuse first-time users.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'On mobile, the right drawer slides in from the right edge',
                body: 'The mobile behavior mirrors the side prop. A right sidebar drawer entering from the right is spatially consistent — users understand where to swipe to dismiss it.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: "Don't let two sidebars compete for attention simultaneously",
                body: 'When using a right sidebar alongside a left nav, give one clearly subordinate visual weight — less width, lower elevation, or a different background tone. Two equally dominant panels overwhelm the main content.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`{/* Right sidebar — place main content before the sidebar */}
<div className="flex h-screen">
  <main className="flex-1">...</main>
  <Sidebar side="right">...</Sidebar>
</div>`}</code>
      </pre>
    </div>
  ),
}
