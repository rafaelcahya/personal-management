import { LayoutDashboard, BarChart2, Package, Settings, TrendingUp, User } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Tabs/With Icons',
}

export default meta

function Panel({ title, body }) {
  return (
    <div className="pt-4">
      <p className="text-sm font-medium text-gray-800 mb-1">{title}</p>
      <p className="text-sm text-gray-500">{body}</p>
    </div>
  )
}

export const WithIcons = {
  name: 'With Icons',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        Pass any Lucide icon to the{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">icon</code> prop on{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">TabsTrigger</code>. The icon
        renders at <code className="font-mono bg-gray-100 px-1 rounded text-xs">size-4</code> before
        the label.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">underline — icons + labels</span>
        <Tabs defaultValue="overview">
          <TabsList variant="underline">
            <TabsTrigger value="overview" icon={LayoutDashboard}>
              Overview
            </TabsTrigger>
            <TabsTrigger value="trades" icon={BarChart2}>
              Trades
            </TabsTrigger>
            <TabsTrigger value="inventory" icon={Package}>
              Inventory
            </TabsTrigger>
            <TabsTrigger value="settings" icon={Settings}>
              Settings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Panel title="Overview" body="Portfolio summary across all modules." />
          </TabsContent>
          <TabsContent value="trades">
            <Panel title="Trades" body="All buy and sell transactions." />
          </TabsContent>
          <TabsContent value="inventory">
            <Panel title="Inventory" body="Stock levels and item tracking." />
          </TabsContent>
          <TabsContent value="settings">
            <Panel title="Settings" body="Account preferences and notifications." />
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">pill — icons + labels</span>
        <Tabs defaultValue="performance">
          <TabsList variant="pill">
            <TabsTrigger value="performance" icon={TrendingUp}>
              Performance
            </TabsTrigger>
            <TabsTrigger value="profile" icon={User}>
              Profile
            </TabsTrigger>
            <TabsTrigger value="settings" icon={Settings}>
              Settings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="performance">
            <Panel title="Performance" body="Running metrics and P&L trends." />
          </TabsContent>
          <TabsContent value="profile">
            <Panel title="Profile" body="Your personal details and goals." />
          </TabsContent>
          <TabsContent value="settings">
            <Panel title="Settings" body="Notification and display preferences." />
          </TabsContent>
        </Tabs>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`import { LayoutDashboard, BarChart2, Settings } from 'lucide-react'

<Tabs defaultValue="overview">
  <TabsList variant="underline">
    <TabsTrigger value="overview" icon={LayoutDashboard}>
      Overview
    </TabsTrigger>
    <TabsTrigger value="trades" icon={BarChart2}>
      Trades
    </TabsTrigger>
    <TabsTrigger value="settings" icon={Settings}>
      Settings
    </TabsTrigger>
  </TabsList>
  ...
</Tabs>`}</code>
      </pre>
    </div>
  ),
}
