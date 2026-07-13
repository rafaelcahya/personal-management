import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Tabs/Disabled Tabs',
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

export const Underline = {
  name: 'Underline',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        Add <code className="font-mono bg-gray-100 px-1 rounded text-xs">disabled</code> to any{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">TabsTrigger</code> with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          variant=&quot;underline&quot;
        </code>
        . Disabled tabs cannot be clicked and are skipped during keyboard navigation (← → jump over
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

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Disable tabs for locked or unavailable features, not empty content',
                body: "A disabled tab communicates 'you can't access this yet — it exists but is locked'. An empty tab should either be removed or show an empty state inside its panel instead.",
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Never disable the default tab',
                body: 'Users land on a tab strip with no accessible active panel. The default tab must always be enabled — disabling it is a silent UX failure.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Disabled tabs are skipped during keyboard navigation',
                body: 'Arrow keys automatically jump over disabled triggers. Users never get stuck — the navigation wraps cleanly from the last enabled tab back to the first.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Pair disabled tabs with a Tooltip explaining why',
                body: "Without context, users don't know if a dimmed tab is broken, locked, or coming soon. A tooltip like 'Upgrade to Pro to unlock' gives a clear reason and a path forward.",
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

export const Pill = {
  name: 'Pill',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        Add <code className="font-mono bg-gray-100 px-1 rounded text-xs">disabled</code> to any{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">TabsTrigger</code> with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant=&quot;pill&quot;</code>
        . Disabled triggers are visually dimmed inside the pill container and skipped during
        keyboard navigation.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">pill — last tab disabled</span>
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

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">pill — middle tab disabled</span>
        <Tabs defaultValue="overview">
          <TabsList variant="pill">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Panel title="Overview" body="Pressing → skips Analytics and goes to Settings." />
          </TabsContent>
          <TabsContent value="settings">
            <Panel title="Settings" body="Settings panel." />
          </TabsContent>
        </Tabs>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Disable pill triggers for locked features, not empty content',
                body: "Disabled communicates 'this exists but is unavailable right now'. If a panel has no content yet, remove the tab entirely or show an empty state inside the panel.",
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Never disable the default tab',
                body: 'Users land on a pill container with no accessible active trigger. The default tab must always be enabled — disabling it is a silent layout failure.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Disabled pill triggers stay inside the container layout',
                body: 'Unlike underline, the pill container has a fixed background. A disabled trigger still occupies its slot — the layout does not collapse around it, maintaining visual consistency.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Pair disabled tabs with a Tooltip explaining why',
                body: "Without context, a dimmed pill trigger looks like a bug. A tooltip like 'Upgrade to Pro to unlock' gives users a reason and a clear next step.",
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`<Tabs defaultValue="overview">
  <TabsList variant="pill">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="trades">Trades</TabsTrigger>
    {/* disabled — skipped during keyboard nav */}
    <TabsTrigger value="premium" disabled>Premium</TabsTrigger>
  </TabsList>
  <TabsContent value="overview"><p>Overview</p></TabsContent>
  <TabsContent value="trades"><p>Trades</p></TabsContent>
</Tabs>`}</code>
      </pre>
    </div>
  ),
}
