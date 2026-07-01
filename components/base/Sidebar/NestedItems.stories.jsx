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

export const NestedItems = {
  name: 'Nested Items',
  render: () => (
    <div className="flex flex-col gap-10 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Place a <code className="font-mono bg-gray-100 px-1 rounded text-xs">SidebarSub</code> as a
        child of <code className="font-mono bg-gray-100 px-1 rounded text-xs">SidebarItem</code> to
        create nested navigation. Supports unlimited depth — each level adds its own indent and
        vertical line.
      </p>

      {/* 2 levels */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          2 levels
        </span>
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

      {/* 3 levels */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          3 levels
        </span>
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

      {/* 4 levels */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          4 levels
        </span>
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

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* 2 levels */}
<SidebarItem icon={<PackageIcon />} label="Inventory">
  <SidebarSub>
    <SidebarItem icon={<WarehouseIcon />} label="Products" />
    <SidebarItem label="Categories" />
  </SidebarSub>
</SidebarItem>

{/* 3 levels */}
<SidebarItem icon={<PackageIcon />} label="Inventory">
  <SidebarSub>
    <SidebarItem icon={<WarehouseIcon />} label="Products">
      <SidebarSub>
        <SidebarItem label="All Products" />
        <SidebarItem label="Draft" />
      </SidebarSub>
    </SidebarItem>
  </SidebarSub>
</SidebarItem>

{/* 4 levels */}
<SidebarItem icon={<FolderIcon />} label="Documents">
  <SidebarSub>
    <SidebarItem icon={<PackageIcon />} label="Projects">
      <SidebarSub>
        <SidebarItem icon={<FileIcon />} label="Reports">
          <SidebarSub>
            <SidebarItem label="Q1 2025" />
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
