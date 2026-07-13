import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Tabs/Basic',
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

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Set defaultValue to the most important panel',
                body: 'The first panel users see sets their mental model of the feature. Default to the highest-value or most-used panel — not just the first item in the list.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use defaultValue for a panel that's rarely needed",
                body: 'If users almost never visit the first tab, reconsider the panel order. The default tab should reflect the most common entry point.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Make sure defaultValue matches a real TabsTrigger value',
                body: 'A mismatch silently renders the tab strip with no active indicator and no visible panel. Double-check that every defaultValue corresponds to an existing trigger.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use uncontrolled mode for self-contained tab groups',
                body: 'Switch to value + onValueChange only when an external action — a URL param, sidebar link, or button outside the tabs — needs to drive the active tab.',
              },
            ],
          },
        ]}
      />

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
