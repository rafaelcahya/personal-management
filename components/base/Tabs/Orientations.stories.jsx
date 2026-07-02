import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Tabs/Orientations',
}

export default meta

function Panel({ title, body }) {
  return (
    <div className="p-4">
      <p className="text-sm font-medium text-gray-800 mb-1">{title}</p>
      <p className="text-sm text-gray-500">{body}</p>
    </div>
  )
}

export const Orientations = {
  name: 'Orientations',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-2xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">orientation</code> prop on{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">Tabs</code> controls the layout
        direction. Arrow keys adapt: horizontal uses ← →, vertical uses ↑ ↓.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          orientation=&quot;horizontal&quot; (default) — underline
        </span>
        <Tabs defaultValue="overview" orientation="horizontal">
          <TabsList variant="underline">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Panel title="Overview" body="Use ← → to navigate." />
          </TabsContent>
          <TabsContent value="trades">
            <Panel title="Trades" body="Trades panel." />
          </TabsContent>
          <TabsContent value="inventory">
            <Panel title="Inventory" body="Inventory panel." />
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">orientation=&quot;vertical&quot; — underline</span>
        <Tabs defaultValue="overview" orientation="vertical">
          <TabsList variant="underline" className="w-40">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Panel
              title="Overview"
              body="Use ↑ ↓ to navigate. Indicator slides vertically along the right border."
            />
          </TabsContent>
          <TabsContent value="trades">
            <Panel title="Trades" body="Trades panel." />
          </TabsContent>
          <TabsContent value="inventory">
            <Panel title="Inventory" body="Inventory panel." />
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">orientation=&quot;vertical&quot; — pill</span>
        <Tabs defaultValue="overview" orientation="vertical">
          <TabsList variant="pill" className="w-44 flex-col">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Panel title="Overview" body="Pill variant in vertical orientation." />
          </TabsContent>
          <TabsContent value="trades">
            <Panel title="Trades" body="Trades panel." />
          </TabsContent>
          <TabsContent value="inventory">
            <Panel title="Inventory" body="Inventory panel." />
          </TabsContent>
        </Tabs>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`{/* horizontal (default) */}
<Tabs defaultValue="overview" orientation="horizontal">
  <TabsList variant="underline">...</TabsList>
  ...
</Tabs>

{/* vertical */}
<Tabs defaultValue="overview" orientation="vertical">
  <TabsList variant="underline" className="w-40">...</TabsList>
  ...
</Tabs>`}</code>
      </pre>
    </div>
  ),
}
