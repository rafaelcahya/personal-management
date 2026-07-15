import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Tabs/Orientations',
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
    <div className="p-4">
      <p className="text-sm font-medium text-gray-800 mb-1">{title}</p>
      <p className="text-sm text-gray-500">{body}</p>
    </div>
  )
}

export const HorizontalUnderline = {
  name: 'Horizontal / Underline',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-2xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        Default orientation with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          orientation=&quot;horizontal&quot;
        </code>{' '}
        and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          variant=&quot;underline&quot;
        </code>
        . Tab list flows left to right, arrow keys navigate with ← →.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          orientation=&quot;horizontal&quot; — underline
        </span>
        <Tabs defaultValue="overview" orientation="horizontal">
          <TabsList variant="underline">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Panel title="Overview" body="Use ← → to navigate between tabs." />
          </TabsContent>
          <TabsContent value="trades">
            <Panel title="Trades" body="Trades panel." />
          </TabsContent>
          <TabsContent value="inventory">
            <Panel title="Inventory" body="Inventory panel." />
          </TabsContent>
        </Tabs>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use horizontal underline for primary page-level navigation',
                body: 'The horizontal underline combination is the most common tab pattern — best for detail pages, settings pages, and any top-of-section navigation.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use horizontal when vertical would better match the layout",
                body: 'If the content area sits to the right of the navigation (e.g. a settings sidebar), vertical orientation makes better use of space and reduces visual jumping.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Arrow keys navigate horizontally — ← moves left, → moves right',
                body: 'Disabled tabs are skipped automatically. Home moves to the first enabled tab, End moves to the last. This behavior is built in and requires no extra code.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'This is the default — no orientation prop needed',
                body: 'horizontal is the default value. Omitting orientation gives the same result and keeps the code cleaner.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`{/* orientation="horizontal" is the default */}
<Tabs defaultValue="overview">
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

export const HorizontalPill = {
  name: 'Horizontal / Pill',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-2xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          orientation=&quot;horizontal&quot;
        </code>{' '}
        with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant=&quot;pill&quot;</code>
        . Tab list flows left to right with a gray pill container. Arrow keys navigate with ← →.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">orientation=&quot;horizontal&quot; — pill</span>
        <Tabs defaultValue="overview" orientation="horizontal">
          <TabsList variant="pill">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Panel
              title="Overview"
              body="Horizontal pill — active tab gets a white rounded background."
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

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use horizontal pill inside cards or sections with a background',
                body: 'Pill reads best on a gray or colored background. Horizontal pill works well as a view toggle inside a card header or dashboard widget.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use horizontal pill on a white page background",
                body: "The active tab's white background disappears on white. Place pill tabs inside a container that provides contrast — a card, section, or colored surface.",
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Arrow keys navigate horizontally regardless of variant',
                body: 'Both underline and pill use ← → for horizontal orientation. The variant only changes visual style — keyboard behavior is identical across variants.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Horizontal pill is ideal for compact view toggles',
                body: 'Chart / Table, List / Grid, Day / Week — short binary or ternary switches inside a contained section benefit from the pill container giving them a defined bounding box.',
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

export const VerticalUnderline = {
  name: 'Vertical / Underline',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-2xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          orientation=&quot;vertical&quot;
        </code>{' '}
        with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          variant=&quot;underline&quot;
        </code>
        . Tab list flows top to bottom. The indicator slides vertically along the right border.
        Arrow keys navigate with ↑ ↓.
      </p>

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

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use vertical underline for settings or sidebar-style layouts',
                body: 'Vertical underline works when the content area sits to the right of the tab list — common in settings panels, admin views, and multi-step forms.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use vertical when horizontal fits the layout better",
                body: 'A vertical tab list takes up horizontal space. On narrow screens or inside cards, horizontal orientation is usually a better fit.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Arrow keys navigate vertically — ↑ moves up, ↓ moves down',
                body: 'Setting orientation="vertical" switches keyboard navigation from ← → to ↑ ↓ automatically. Always match orientation to the visual layout so keyboard nav matches user expectation.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Always set an explicit width on a vertical TabsList',
                body: "Without a width the list collapses to the widest trigger label and can shift layout on tab change. Use className='w-40' or similar to give it a stable, readable width.",
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`<Tabs defaultValue="overview" orientation="vertical">
  <TabsList variant="underline" className="w-40">
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

export const VerticalPill = {
  name: 'Vertical / Pill',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-2xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          orientation=&quot;vertical&quot;
        </code>{' '}
        with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant=&quot;pill&quot;</code>
        . Tab list flows top to bottom inside a gray pill container.{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">flex-col</code> is applied
        automatically — no need to add it manually.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">orientation=&quot;vertical&quot; — pill</span>
        <Tabs defaultValue="overview" orientation="vertical">
          <TabsList variant="pill" className="w-44">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Panel
              title="Overview"
              body="Vertical pill — flex-col is applied automatically by the component."
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

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use vertical pill for sidebar navigation inside a panel or drawer',
                body: 'Vertical pill is well-suited for settings sidebars, filter panels, and any layout where the tab list sits in a narrow column with a contained background.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use vertical pill when the list is very long",
                body: 'Many tabs in a vertical pill container create a tall gray block that dominates the layout. Cap at 5–6 items or switch to a sidebar nav for longer lists.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Arrow keys navigate vertically — ↑ and ↓ move between triggers',
                body: 'The vertical orientation switches keyboard nav from ← → to ↑ ↓ automatically. Disabled tabs are still skipped; Home/End still jump to first/last.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Do not add flex-col manually — it is applied automatically',
                body: 'When orientation="vertical", the component applies flex-col to TabsList internally. Adding it yourself via className is redundant and may cause double-stacking.',
              },
              {
                title: 'Set an explicit width so the pill container does not collapse',
                body: "Use className='w-44' or similar. Without it the gray container shrinks to the widest trigger label and the layout shifts as the user switches tabs.",
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`{/* flex-col applied automatically — no need to add it */}
<Tabs defaultValue="overview" orientation="vertical">
  <TabsList variant="pill" className="w-44">
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
