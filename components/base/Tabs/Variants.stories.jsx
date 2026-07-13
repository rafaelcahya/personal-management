import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Tabs/Variants',
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
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          variant=&quot;underline&quot;
        </code>{' '}
        — transparent background with an animated indicator line that slides to the active tab.
        Default variant for primary page-level navigation.
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

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use underline for primary page-level navigation',
                body: 'Underline works on white or light backgrounds where a transparent tab strip feels natural — product detail pages, settings pages, and top-of-section navigation.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use underline inside cards or colored containers",
                body: 'The transparent background and bottom border blend poorly against non-white surfaces. Use pill instead when the container has a background color.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'The animated indicator moves to communicate the active tab',
                body: 'The sliding underline is a visual affordance that reinforces which tab is active. It is purely decorative — the active state is also communicated via aria-selected.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Underline is the default variant — omitting variant gives the same result',
                body: 'variant="underline" is the default. You only need to specify it explicitly if your codebase\'s style guide requires it for clarity.',
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
  </TabsList>
  <TabsContent value="overview">...</TabsContent>
  <TabsContent value="trades">...</TabsContent>
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
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant=&quot;pill&quot;</code>{' '}
        — active tab gets a white rounded background with a subtle shadow, set against a gray
        container. Best for compact or nested contexts.
      </p>

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

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use pill inside cards, sidebars, or contained surfaces',
                body: "The rounded white background reads clearly against the pill container's gray background. Best for compact or nested contexts like card headers or dashboard widgets.",
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use pill on white or transparent surfaces",
                body: "The active tab's white background disappears on a white page — the active state becomes invisible. Use underline for page-level navigation instead.",
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'The gray pill container is required for pill to be readable',
                body: 'Pill relies on contrast between the white active background and the gray container. Without the container background, the active state disappears entirely.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Pill works well as an in-page view toggle',
                body: 'Chart / Table / Summary, List / Grid, Day / Week / Month — anywhere users need a compact binary or ternary switch that stays inside a contained section.',
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
  </TabsList>
  <TabsContent value="overview">...</TabsContent>
  <TabsContent value="trades">...</TabsContent>
</Tabs>`}</code>
      </pre>
    </div>
  ),
}
