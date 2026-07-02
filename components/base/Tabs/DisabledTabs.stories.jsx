import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Tabs/Disabled Tabs',
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

export const DisabledTabs = {
  name: 'Disabled Tabs',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        Add <code className="font-mono bg-gray-100 px-1 rounded text-xs">disabled</code> to any{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">TabsTrigger</code>. Disabled
        tabs cannot be clicked and are skipped during keyboard navigation (← → / ↑ ↓ jump over
        them).
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">underline — last tab disabled</span>
        <Tabs defaultValue="overview">
          <TabsList variant="underline">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
            <TabsTrigger value="settings" disabled>
              Settings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Panel
              title="Overview"
              body="Try pressing → to navigate. Arrow keys skip the disabled Settings tab."
            />
          </TabsContent>
          <TabsContent value="trades">
            <Panel title="Trades" body="Trades panel." />
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">underline — middle tab disabled</span>
        <Tabs defaultValue="overview">
          <TabsList variant="underline">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="reports" disabled>
              Reports
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Panel title="Overview" body="Pressing → skips Analytics and goes to Inventory." />
          </TabsContent>
          <TabsContent value="inventory">
            <Panel title="Inventory" body="Pressing → skips Reports and wraps back to Overview." />
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">pill — disabled tab</span>
        <Tabs defaultValue="overview">
          <TabsList variant="pill">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
            <TabsTrigger value="premium" disabled>
              Premium
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Panel title="Overview" body="Overview panel." />
          </TabsContent>
          <TabsContent value="trades">
            <Panel title="Trades" body="Trades panel." />
          </TabsContent>
        </Tabs>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`<Tabs defaultValue="overview">
  <TabsList variant="underline">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="trades">Trades</TabsTrigger>
    {/* disabled — skipped during keyboard nav */}
    <TabsTrigger value="settings" disabled>Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="overview"><p>Overview</p></TabsContent>
  <TabsContent value="trades"><p>Trades</p></TabsContent>
</Tabs>`}</code>
      </pre>
    </div>
  ),
}
