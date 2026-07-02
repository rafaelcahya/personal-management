import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Tabs/Variants',
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

export const Variants = {
  name: 'Variants',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        Two visual variants. <strong>underline</strong> — transparent background with an animated
        indicator line that slides to the active tab. <strong>pill</strong> — active tab gets a
        white rounded background with a subtle shadow.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">variant=&quot;underline&quot;</span>
        <Tabs defaultValue="overview">
          <TabsList variant="underline">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Panel title="Overview" body="Animated underline slides to the active tab." />
          </TabsContent>
          <TabsContent value="trades">
            <Panel title="Trades" body="Trades panel." />
          </TabsContent>
          <TabsContent value="settings">
            <Panel title="Settings" body="Settings panel." />
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">variant=&quot;pill&quot;</span>
        <Tabs defaultValue="overview">
          <TabsList variant="pill">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Panel title="Overview" body="Active tab has a white pill background." />
          </TabsContent>
          <TabsContent value="trades">
            <Panel title="Trades" body="Trades panel." />
          </TabsContent>
          <TabsContent value="settings">
            <Panel title="Settings" body="Settings panel." />
          </TabsContent>
        </Tabs>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`{/* underline: animated sliding indicator */}
<Tabs defaultValue="overview">
  <TabsList variant="underline">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="trades">Trades</TabsTrigger>
  </TabsList>
  ...
</Tabs>

{/* pill: rounded white background on active */}
<Tabs defaultValue="overview">
  <TabsList variant="pill">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="trades">Trades</TabsTrigger>
  </TabsList>
  ...
</Tabs>`}</code>
      </pre>
    </div>
  ),
}
