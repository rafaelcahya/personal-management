import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Tabs/Basic',
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

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        Default tabs with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          variant=&quot;underline&quot;
        </code>{' '}
        and <code className="font-mono bg-gray-100 px-1 rounded text-xs">defaultValue</code>. Active
        tab has an animated underline indicator. Click or use arrow keys to switch tabs.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">underline — 3 tabs</span>
        <Tabs defaultValue="overview">
          <TabsList variant="underline">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Panel title="Overview" body="Summary of your portfolio and inventory." />
          </TabsContent>
          <TabsContent value="trades">
            <Panel title="Trades" body="All buy and sell transactions are listed here." />
          </TabsContent>
          <TabsContent value="settings">
            <Panel title="Settings" body="Adjust your preferences and notifications." />
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">underline — starts on second tab</span>
        <Tabs defaultValue="trades">
          <TabsList variant="underline">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Panel title="Overview" body="Overview panel." />
          </TabsContent>
          <TabsContent value="trades">
            <Panel title="Trades" body="Trades panel — this is the initial active tab." />
          </TabsContent>
          <TabsContent value="portfolio">
            <Panel title="Portfolio" body="Portfolio panel." />
          </TabsContent>
        </Tabs>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`<Tabs defaultValue="overview">
  <TabsList variant="underline">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="trades">Trades</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">
    <p>Overview panel</p>
  </TabsContent>
  <TabsContent value="trades">
    <p>Trades panel</p>
  </TabsContent>
  <TabsContent value="settings">
    <p>Settings panel</p>
  </TabsContent>
</Tabs>`}</code>
      </pre>
    </div>
  ),
}
