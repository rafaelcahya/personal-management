import { BarChart2, Home, Package, Settings, TrendingUp } from 'lucide-react'
import { Sidebar, SidebarContent, SidebarGroup, SidebarItem, SidebarProvider } from './Sidebar'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Sidebar/Size',
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

const navItems = [
  { icon: Home, label: 'Dashboard', active: true },
  { icon: Package, label: 'Inventory', badge: 3 },
  { icon: TrendingUp, label: 'Trading' },
  { icon: BarChart2, label: 'Analytics' },
  { icon: Settings, label: 'Settings', disabled: true },
]

const bpItemsXs = [
  {
    heading: 'When to use',
    cards: [
      {
        title: 'size="xs" for ultra-dense utility groups with minimal visual footprint',
        body: 'Use for supplementary quick-action groups, admin tools, or secondary menus where vertical space is at a premium and the items are rarely accessed.',
      },
    ],
  },
  {
    heading: 'When not to use',
    cards: [
      {
        title: 'Don\'t use size="xs" for primary navigation',
        body: '28px min-height is well below WCAG 44px touch target and even the 32px desktop minimum. Reserve xs for mouse-only desktop tools with dense, secondary content.',
      },
    ],
  },
  {
    heading: 'Accessibility',
    cards: [
      {
        title: '28px min-height — desktop mouse-only environments only',
        body: 'xs is the most restrictive size in the scale. Only use it when you can guarantee the sidebar will never be touch-navigated and all users are on precise pointing devices.',
      },
    ],
  },
  {
    heading: 'Advice',
    cards: [
      {
        title: 'Pair xs with a larger size in the primary group to emphasize hierarchy',
        body: 'xs items read as clearly subordinate next to base or lg items. This contrast makes the primary navigation feel prominent without needing color or weight changes.',
      },
    ],
  },
]

const bpItemsSm = [
  {
    heading: 'When to use',
    cards: [
      {
        title: 'size="sm" for secondary or supplementary items',
        body: 'Use for footer shortcuts, quick actions, or utility links that are less frequently accessed than primary nav. The compact 32px height works well for low-priority groups.',
      },
    ],
  },
  {
    heading: 'When not to use',
    cards: [
      {
        title: 'Don\'t use size="sm" for primary nav on touch devices',
        body: '32px min-height is below the WCAG 2.5.5 recommended 44px touch target. On tablet or hybrid layouts use size="base" or larger for the main navigation.',
      },
    ],
  },
  {
    heading: 'Accessibility',
    cards: [
      {
        title: '32px min-height is acceptable for desktop mouse use only',
        body: 'Reserve size="sm" for desktop-only secondary groups. Never use it as the only navigation on a touch device — users with motor impairments will struggle to hit the targets.',
      },
    ],
  },
  {
    heading: 'Advice',
    cards: [
      {
        title: 'Pair size="sm" with size="base" or larger for visual hierarchy',
        body: 'Using a smaller size for utility items makes the primary nav feel more prominent by contrast — two distinct densities signal importance more clearly than uniform sizing.',
      },
    ],
  },
]

const bpItemsBase = [
  {
    heading: 'When to use',
    cards: [
      {
        title: 'size="base" is the right default for most desktop sidebars',
        body: '38px min-height gives enough tap area without wasting vertical space. Start here and only deviate when you have a specific density or accessibility requirement.',
      },
    ],
  },
  {
    heading: 'When not to use',
    cards: [
      {
        title: 'Don\'t use size="base" as the only size on hybrid desktop + tablet layouts',
        body: '38px is borderline for touch targets on tablets. If the sidebar is the primary navigation on a hybrid layout, upgrade to size="lg" to meet the WCAG 44px target on tablet viewports.',
      },
    ],
  },
  {
    heading: 'Accessibility',
    cards: [
      {
        title: '38px min-height is sufficient for desktop, borderline for touch',
        body: 'Mouse and keyboard users are fine with 38px. For touch-primary or hybrid layouts consider size="lg" — the extra 6px prevents mis-taps on finger-navigated sidebars.',
      },
    ],
  },
  {
    heading: 'Advice',
    cards: [
      {
        title: 'Start with "base" and only deviate when you have a concrete reason',
        body: 'If you need more density, use size="sm" or "xs" for a specific group. If you need better touch targets, upgrade to size="lg" or "xl". Don\'t change the default speculatively.',
      },
    ],
  },
]

const bpItemsLg = [
  {
    heading: 'When to use',
    cards: [
      {
        title: 'size="lg" when the sidebar will be used on touch devices',
        body: '44px min-height meets the WCAG 2.5.5 minimum touch target recommendation. Use for mobile drawer sidebars, tablet-primary layouts, or any sidebar where touch interaction is expected.',
      },
    ],
  },
  {
    heading: 'When not to use',
    cards: [
      {
        title: 'Don\'t use size="lg" on desktop-only layouts with many nav items',
        body: 'With 10+ items at 44px each, items push below the fold even at 1080p. On desktop-only layouts with many items, size="base" uses vertical space more efficiently.',
      },
    ],
  },
  {
    heading: 'Accessibility',
    cards: [
      {
        title: 'The size-5 icon scales better on high-density screens and in collapsed mode',
        body: 'size="lg" uses a size-5 icon (vs size-4 in xs/sm/base). The larger icon is more readable on retina displays and remains legible when the sidebar collapses to 56px icon-only mode.',
      },
    ],
  },
  {
    heading: 'Advice',
    cards: [
      {
        title: '44px is the touch target, not just the visual height',
        body: 'WCAG 2.5.5 cares about the interactive area. size="lg" guarantees the full 44px is clickable/tappable — choose it whenever finger-accuracy matters.',
      },
    ],
  },
]

const bpItemsXl = [
  {
    heading: 'When to use',
    cards: [
      {
        title: 'size="xl" for touch-first layouts with prominent navigation',
        body: '52px min-height and text-base label give navigation items a bold, approachable presence. Use for kiosk-style interfaces, large-screen dashboards, or accessibility-focused layouts.',
      },
    ],
  },
  {
    heading: 'When not to use',
    cards: [
      {
        title: 'Don\'t use size="xl" on desktop apps with more than 6–7 nav items',
        body: 'At 52px per item, a sidebar with 8+ items will overflow the viewport on standard desktop heights. Use size="lg" or "base" when vertical space is constrained.',
      },
    ],
  },
  {
    heading: 'Accessibility',
    cards: [
      {
        title:
          '52px min-height and text-base label give the largest interactive surface in the scale',
        body: "xl exceeds the WCAG 44px touch target by a comfortable margin. The base-size label is also easier to read for users with low vision who haven't enabled full browser zoom.",
      },
    ],
  },
  {
    heading: 'Advice',
    cards: [
      {
        title: 'xl pairs well with a wide sidebar (w-72+) so the larger text has room to breathe',
        body: 'The default 240px (w-60) sidebar width can feel cramped with text-base labels and size-5 icons. Consider a wider sidebar when using xl across all items.',
      },
    ],
  },
]

export const Xs = {
  name: 'Xs',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">size=&quot;xs&quot;</code> —
        ultra-compact items with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">px-1 py-0.5</code>,{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">min-h-[28px]</code>, a size-3.5
        icon, and text-xs label. For dense secondary menus only.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          size=&quot;xs&quot; — px-1 py-0.5 · min-h-[28px] · icon size-3.5 · text-xs
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <SidebarProvider defaultCollapsed={false}>
            <div className="border border-gray-200 rounded-lg overflow-hidden w-60">
              <Sidebar>
                <SidebarContent>
                  <SidebarGroup>
                    {navItems.map(({ icon: Icon, label, active, badge, disabled }) => (
                      <SidebarItem
                        key={label}
                        size="xs"
                        icon={<Icon />}
                        label={label}
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
      </div>

      <BestPractices items={bpItemsXs} />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`<SidebarItem size="xs" icon={<HomeIcon />} label="Dashboard" active />
<SidebarItem size="xs" icon={<PackageIcon />} label="Inventory" badge={3} />
<SidebarItem size="xs" icon={<SettingsIcon />} label="Settings" disabled />`}</code>
      </pre>
    </div>
  ),
}

export const Sm = {
  name: 'Sm',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">size=&quot;sm&quot;</code> —
        compact items with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">px-1.5 py-1</code>,{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">min-h-[32px]</code>, a size-4
        icon, and text-xs label. Use for dense layouts or secondary action groups.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          size=&quot;sm&quot; — px-1.5 py-1 · min-h-[32px] · icon size-4 · text-xs
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <SidebarProvider defaultCollapsed={false}>
            <div className="border border-gray-200 rounded-lg overflow-hidden w-60">
              <Sidebar>
                <SidebarContent>
                  <SidebarGroup>
                    {navItems.map(({ icon: Icon, label, active, badge, disabled }) => (
                      <SidebarItem
                        key={label}
                        size="sm"
                        icon={<Icon />}
                        label={label}
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
      </div>

      <BestPractices items={bpItemsSm} />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`<SidebarItem size="sm" icon={<HomeIcon />} label="Dashboard" active />
<SidebarItem size="sm" icon={<PackageIcon />} label="Inventory" badge={3} />
<SidebarItem size="sm" icon={<SettingsIcon />} label="Settings" disabled />`}</code>
      </pre>
    </div>
  ),
}

export const Base = {
  name: 'Base',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">size=&quot;base&quot;</code> —
        the default. Items use{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">px-2 py-1.5</code>,{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">min-h-[38px]</code>, a size-4
        icon, and text-sm label. The right balance of density and tap target for most desktop
        navigation.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          size=&quot;base&quot; (default) — px-2 py-1.5 · min-h-[38px] · icon size-4 · text-sm
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <SidebarProvider defaultCollapsed={false}>
            <div className="border border-gray-200 rounded-lg overflow-hidden w-60">
              <Sidebar>
                <SidebarContent>
                  <SidebarGroup>
                    {navItems.map(({ icon: Icon, label, active, badge, disabled }) => (
                      <SidebarItem
                        key={label}
                        size="base"
                        icon={<Icon />}
                        label={label}
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
      </div>

      <BestPractices items={bpItemsBase} />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`<SidebarItem size="base" icon={<HomeIcon />} label="Dashboard" active />
{/* "base" is the default — size prop can be omitted */}
<SidebarItem icon={<HomeIcon />} label="Dashboard" active />`}</code>
      </pre>
    </div>
  ),
}

export const Lg = {
  name: 'Lg',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">size=&quot;lg&quot;</code> —
        larger items with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">px-2 py-2</code>,{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">min-h-[44px]</code>, a size-5
        icon, and text-sm label. Meets the WCAG 44px minimum touch target — preferred for
        mobile-first or touch-heavy layouts.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          size=&quot;lg&quot; — px-2 py-2 · min-h-[44px] · icon size-5 · text-sm
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <SidebarProvider defaultCollapsed={false}>
            <div className="border border-gray-200 rounded-lg overflow-hidden w-60">
              <Sidebar>
                <SidebarContent>
                  <SidebarGroup>
                    {navItems.map(({ icon: Icon, label, active, badge, disabled }) => (
                      <SidebarItem
                        key={label}
                        size="lg"
                        icon={<Icon />}
                        label={label}
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
      </div>

      <BestPractices items={bpItemsLg} />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`<SidebarItem size="lg" icon={<HomeIcon />} label="Dashboard" active />
<SidebarItem size="lg" icon={<PackageIcon />} label="Inventory" badge={3} />
<SidebarItem size="lg" icon={<SettingsIcon />} label="Settings" disabled />`}</code>
      </pre>
    </div>
  ),
}

export const Xl = {
  name: 'Xl',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">size=&quot;xl&quot;</code> —
        the largest size with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">px-3 py-2.5</code>,{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">min-h-[52px]</code>, a size-5
        icon, and text-base label. For touch-first, kiosk, or accessibility-focused layouts.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          size=&quot;xl&quot; — px-3 py-2.5 · min-h-[52px] · icon size-5 · text-base
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <SidebarProvider defaultCollapsed={false}>
            <div className="border border-gray-200 rounded-lg overflow-hidden w-60">
              <Sidebar>
                <SidebarContent>
                  <SidebarGroup>
                    {navItems.map(({ icon: Icon, label, active, badge, disabled }) => (
                      <SidebarItem
                        key={label}
                        size="xl"
                        icon={<Icon />}
                        label={label}
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
      </div>

      <BestPractices items={bpItemsXl} />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`<SidebarItem size="xl" icon={<HomeIcon />} label="Dashboard" active />
<SidebarItem size="xl" icon={<PackageIcon />} label="Inventory" badge={3} />
<SidebarItem size="xl" icon={<SettingsIcon />} label="Settings" disabled />`}</code>
      </pre>
    </div>
  ),
}
