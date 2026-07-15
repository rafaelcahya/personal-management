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

function SubDemo({ animation }) {
  return (
    <SidebarProvider>
      <div className="flex h-72 border border-gray-200 rounded-lg overflow-hidden w-full">
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
      <div className="flex h-56 border border-gray-200 rounded-lg overflow-hidden w-full">
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

export const SubSlide = {
  name: 'Sub — Slide',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          {'<SidebarSub animation="slide">'}
        </code>{' '}
        — the default. Nested items expand and collapse with a smooth 200ms CSS{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">grid-rows</code> transition.
        Click a parent item to toggle.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          animation=&quot;slide&quot; (default) — smooth grid-rows transition (200ms)
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <SubDemo animation="slide" />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'animation="slide" as the default for all sub-menus',
                body: 'The transition gives users spatial context — they see where the items came from and that the expand/collapse actually happened. Keep this as the default.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't change the 200ms duration without a design system reason",
                body: '200ms is short enough to feel responsive and long enough to be perceived as intentional. Changing it without a design system easing definition creates inconsistency.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'The grid-rows trick animates height without knowing the exact pixel value',
                body: "The sub-menu uses a CSS grid-rows transition — it works regardless of how many sub-items are inside. No JS height measurement needed, so it's always accurate.",
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'animation="slide" is the default — the prop can be omitted',
                body: 'You only need to pass animation="none" explicitly when suppressing the animation. Omitting the prop is the same as animation="slide".',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`<SidebarItem icon={<PackageIcon />} label="Inventory">
  <SidebarSub animation="slide">   {/* default — prop can be omitted */}
    <SidebarItem label="Products" />
    <SidebarItem label="Categories" />
  </SidebarSub>
</SidebarItem>`}</code>
      </pre>
    </div>
  ),
}

export const SubNone = {
  name: 'Sub — None',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          {'<SidebarSub animation="none">'}
        </code>{' '}
        — nested items appear and disappear instantly with no transition. Children are unmounted
        from the DOM when the sub-menu is closed.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          animation=&quot;none&quot; — instant show/hide, children unmounted when closed
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <SubDemo animation="none" />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'animation="none" when honouring prefers-reduced-motion',
                body: 'Detect the media query in JS and pass animation="none" conditionally — so users who prefer motion still get the slide animation, while motion-sensitive users get instant show/hide.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Don\'t hardcode animation="none" for all users',
                body: 'Most users benefit from the spatial context the slide transition provides. Reserve "none" for reduced-motion detection or when a parent transition already covers the visual change.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Children are unmounted when closed — internal state resets on reopen',
                body: 'With animation="none", the sub-menu children unmount when closed. Any scroll position or focus inside the sub-menu resets each time it reopens — account for this if sub-items have their own stateful behavior.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Prefer animation="slide" — only switch to "none" for a concrete reason',
                body: 'The slide animation is intentional UX. Only suppress it when: (1) prefers-reduced-motion is detected, (2) a parent transition already handles the layout change, or (3) performance requires it.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`<SidebarItem icon={<PackageIcon />} label="Inventory">
  <SidebarSub animation="none">
    <SidebarItem label="Products" />
    <SidebarItem label="Categories" />
  </SidebarSub>
</SidebarItem>`}</code>
      </pre>
    </div>
  ),
}

export const CollapseSlide = {
  name: 'Collapse — Slide',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          {'<SidebarProvider collapseAnimation="slide">'}
        </code>{' '}
        — the default. The sidebar width animates from 240px to 56px over 200ms when toggled. Labels
        and badges fade out simultaneously. Click the trigger to toggle.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          collapseAnimation=&quot;slide&quot; (default) — width animates w-60 → w-14 (200ms)
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <CollapseDemo collapseAnimation="slide" />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'collapseAnimation="slide" as the default for all sidebars',
                body: 'The slide clearly communicates that the sidebar shrank rather than disappeared — users can see the trigger icon at 56px and know they can expand it again.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Don\'t hardcode collapseAnimation="none" for all users',
                body: 'The slide animation is load-bearing UX — it prevents a jarring layout reflow that could disorient users mid-task. Only suppress it for reduced-motion or when a route transition already handles it.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'The width transition smoothly moves main content — no jarring reflow',
                body: 'Without the animation, the main content area snaps to its new width instantly. For users sensitive to sudden layout shifts, this can cause disorientation — the slide transition prevents it.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'transition-[width] is applied only when collapseAnimation="slide"',
                body: 'Switching to "none" removes all collapse/expand transitions without overriding other styles. No cleanup needed — the prop cleanly controls exactly what transitions.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`{/* "slide" is the default — prop can be omitted */}
<SidebarProvider collapseAnimation="slide">
  <Sidebar>...</Sidebar>
</SidebarProvider>`}</code>
      </pre>
    </div>
  ),
}

export const CollapseNone = {
  name: 'Collapse — None',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          {'<SidebarProvider collapseAnimation="none">'}
        </code>{' '}
        — the sidebar width, labels, and badges snap instantly with no CSS transition. Click the
        trigger to toggle.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          collapseAnimation=&quot;none&quot; — width snaps instantly, no transition
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <CollapseDemo collapseAnimation="none" />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title:
                  'collapseAnimation="none" for prefers-reduced-motion or when a route transition already handles it',
                body: 'Use when the page-level route transition already covers the layout change and a simultaneous sidebar animation would create visual noise. Or detect prefers-reduced-motion and pass it conditionally.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Don\'t hardcode collapseAnimation="none" for all users',
                body: 'Users who prefer motion benefit from the spatial context of the slide. Detect prefers-reduced-motion in JS and pass "none" only when the user has requested reduced motion.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'The instant snap means the main content area reflows immediately',
                body: 'Ensure no absolute-positioned elements depend on the sidebar width. An instant reflow can shift content unexpectedly — verify the page layout handles it gracefully before shipping.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Detect prefers-reduced-motion and pass it conditionally',
                body: 'const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches — pass collapseAnimation={prefersReduced ? "none" : "slide"} so motion-sensitive users get instant snap and everyone else gets the slide.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`<SidebarProvider collapseAnimation="none">
  <Sidebar>...</Sidebar>
</SidebarProvider>

{/* Detect prefers-reduced-motion and pass conditionally */}
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
<SidebarProvider collapseAnimation={prefersReduced ? 'none' : 'slide'}>
  <Sidebar>...</Sidebar>
</SidebarProvider>`}</code>
      </pre>
    </div>
  ),
}
