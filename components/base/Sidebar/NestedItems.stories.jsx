import {
  BarChart2,
  FileText,
  FolderOpen,
  Home,
  Package,
  Settings,
  Shield,
  Tag,
  TrendingUp,
  Warehouse,
} from 'lucide-react'
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
  title: 'Sidebar/Nested Items',
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

export const TwoLevels = {
  name: '2 Levels',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Place a <code className="font-mono bg-gray-100 px-1 rounded text-xs">SidebarSub</code> as a
        direct child of{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">SidebarItem</code> to add one
        level of nested navigation. Clicking the parent toggles the sub-menu open or closed.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">parent item with collapsible sub-menu</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
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
                      <SidebarSub>
                        <SidebarItem icon={<Warehouse className="size-4" />} label="Products" />
                        <SidebarItem icon={<Tag className="size-4" />} label="Categories" />
                        <SidebarItem label="Stock Alerts" badge={2} />
                      </SidebarSub>
                    </SidebarItem>
                    <SidebarItem icon={<TrendingUp className="size-4" />} label="Trading">
                      <SidebarSub>
                        <SidebarItem label="Open Positions" />
                        <SidebarItem icon={<BarChart2 className="size-4" />} label="Analytics" />
                      </SidebarSub>
                    </SidebarItem>
                  </SidebarGroup>
                </SidebarContent>
              </Sidebar>
            </div>
          </SidebarProvider>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: '2 levels is the recommended depth for most apps',
                body: 'Parent → sub-items is easy to scan, clear in parent-child relationship, and works in collapsed mode. This depth covers the vast majority of real navigation structures.',
              },
              {
                title: 'Sub-items can have their own badge',
                body: 'Use sub-item badges for unread counts or status indicators on individual nested pages — e.g. "Stock Alerts" showing 2 unread alerts inside the Inventory sub-menu.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't nest beyond 2 levels unless the data hierarchy genuinely requires it",
                body: "Adding nesting levels to organize things that don't have a real parent-child relationship makes navigation harder, not easier — flatten the structure instead.",
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'The vertical guide line is rendered automatically at the sub-level',
                body: 'The guide line helps sighted users track which parent the sub-items belong to. It appears automatically — no extra markup needed.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  "Clicking the parent item toggles the sub-menu — don't use it for navigation",
                body: 'A parent SidebarItem with a SidebarSub child is a toggle, not a link. If the parent needs its own destination page, create a separate nav item for it inside the sub-menu.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`<SidebarItem icon={<PackageIcon />} label="Inventory">
  <SidebarSub>
    <SidebarItem icon={<WarehouseIcon />} label="Products" />
    <SidebarItem icon={<TagIcon />} label="Categories" />
    <SidebarItem label="Stock Alerts" badge={2} />
  </SidebarSub>
</SidebarItem>`}</code>
      </pre>
    </div>
  ),
}

export const ThreeLevels = {
  name: '3 Levels',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        A <code className="font-mono bg-gray-100 px-1 rounded text-xs">SidebarSub</code> nested
        inside another{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">SidebarSub</code> creates a
        third level. Each level adds its own indent and vertical guide line.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">SidebarSub nested inside SidebarSub</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <SidebarProvider>
            <div className="flex h-96 border border-gray-200 rounded-lg overflow-hidden w-full max-w-xs">
              <Sidebar>
                <SidebarHeader>
                  <SidebarTrigger />
                  <span className="ml-2 font-semibold text-gray-800 text-sm">App</span>
                </SidebarHeader>
                <SidebarContent>
                  <SidebarGroup>
                    <SidebarItem icon={<Home className="size-4" />} label="Dashboard" active />
                    <SidebarItem icon={<Package className="size-4" />} label="Inventory">
                      <SidebarSub>
                        <SidebarItem icon={<Warehouse className="size-4" />} label="Products">
                          <SidebarSub>
                            <SidebarItem icon={<Tag className="size-4" />} label="All Products" />
                            <SidebarItem label="Draft" />
                            <SidebarItem label="Archived" />
                          </SidebarSub>
                        </SidebarItem>
                        <SidebarItem label="Categories" />
                        <SidebarItem label="Stock Alerts" badge={2} />
                      </SidebarSub>
                    </SidebarItem>
                    <SidebarItem icon={<Settings className="size-4" />} label="Settings">
                      <SidebarSub>
                        <SidebarItem label="Profile" />
                        <SidebarItem label="Security" />
                      </SidebarSub>
                    </SidebarItem>
                  </SidebarGroup>
                </SidebarContent>
              </Sidebar>
            </div>
          </SidebarProvider>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title:
                  '3 levels for content-heavy apps where hierarchy genuinely exists in the data',
                body: 'Docs sites, file managers, and admin tools sometimes have real 3-level hierarchies. Use 3 levels only when the structure comes from the data — not as a way to organize unrelated items.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't add a level just to group things — flatten instead",
                body: "If you're adding a third level only to organize items, the grouping is artificial. Use a SidebarGroup label or a separate section instead of forcing a nesting level.",
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'At 3 levels, labels get tight in collapsed mode — keep them short',
                body: 'Collapsed tooltips at depth 3 appear over a narrow icon-only strip. Labels must be 1–2 short words to be readable. Test collapsed mode before shipping a 3-level structure.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Test with real content — if users must expand 3 items to reach a page, reconsider',
                body: 'Three clicks before reaching a destination is a UX warning sign. If this depth appears in real usage, consider promoting frequently used sub-items to a higher level or using a different navigation pattern.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`<SidebarItem icon={<PackageIcon />} label="Inventory">
  <SidebarSub>
    <SidebarItem icon={<WarehouseIcon />} label="Products">
      <SidebarSub>
        <SidebarItem icon={<TagIcon />} label="All Products" />
        <SidebarItem label="Draft" />
        <SidebarItem label="Archived" />
      </SidebarSub>
    </SidebarItem>
    <SidebarItem label="Categories" />
  </SidebarSub>
</SidebarItem>`}</code>
      </pre>
    </div>
  ),
}

export const FourLevels = {
  name: '4 Levels',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Four levels of nesting is the practical maximum. Beyond this, the indent becomes too narrow,
        guide lines overlap, and the hierarchy is impossible to scan at a glance.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">4 levels — maximum practical depth</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <SidebarProvider>
            <div className="flex h-[480px] border border-gray-200 rounded-lg overflow-hidden w-full max-w-xs">
              <Sidebar>
                <SidebarHeader>
                  <SidebarTrigger />
                  <span className="ml-2 font-semibold text-gray-800 text-sm">App</span>
                </SidebarHeader>
                <SidebarContent>
                  <SidebarGroup>
                    <SidebarItem icon={<Home className="size-4" />} label="Dashboard" active />
                    <SidebarItem icon={<FolderOpen className="size-4" />} label="Documents">
                      <SidebarSub>
                        <SidebarItem icon={<Package className="size-4" />} label="Projects">
                          <SidebarSub>
                            <SidebarItem icon={<FileText className="size-4" />} label="Reports">
                              <SidebarSub>
                                <SidebarItem label="Q1 2025" />
                                <SidebarItem label="Q2 2025" />
                                <SidebarItem label="Q3 2025" />
                              </SidebarSub>
                            </SidebarItem>
                            <SidebarItem label="Proposals" />
                          </SidebarSub>
                        </SidebarItem>
                        <SidebarItem label="Shared" />
                      </SidebarSub>
                    </SidebarItem>
                    <SidebarItem icon={<Shield className="size-4" />} label="Admin">
                      <SidebarSub>
                        <SidebarItem label="Users" />
                        <SidebarItem label="Roles" />
                      </SidebarSub>
                    </SidebarItem>
                  </SidebarGroup>
                </SidebarContent>
              </Sidebar>
            </div>
          </SidebarProvider>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: '4 levels is the hard limit — treat it as a ceiling, not a target',
                body: 'If your navigation reaches 4 levels, audit whether every level genuinely belongs in the sidebar. Some items at depth 3–4 likely belong in tabs, breadcrumbs, or a secondary nav within the page.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't go beyond 4 levels — the component breaks down past this depth",
                body: 'Beyond 4 levels the indent becomes too narrow, guide lines overlap, and the hierarchy is impossible to scan at a glance. This is not a supported use case.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Levels 3 and 4 are entirely unreachable in collapsed mode',
                body: 'Only root-level icons are visible in icon-only mode. Depth 3–4 items cannot be reached until the sidebar is expanded. Users who collapse the sidebar to save space lose access to these pages entirely.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Every label at depth 3–4 must be 1–2 words maximum',
                body: 'At 4 levels the deepest items have no icon space and very little label room. Long labels at this depth will truncate and become unreadable — plan the IA to fit this constraint.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`<SidebarItem icon={<FolderIcon />} label="Documents">
  <SidebarSub>
    <SidebarItem icon={<PackageIcon />} label="Projects">
      <SidebarSub>
        <SidebarItem icon={<FileIcon />} label="Reports">
          <SidebarSub>
            <SidebarItem label="Q1 2025" />
            <SidebarItem label="Q2 2025" />
          </SidebarSub>
        </SidebarItem>
      </SidebarSub>
    </SidebarItem>
  </SidebarSub>
</SidebarItem>`}</code>
      </pre>
    </div>
  ),
}
