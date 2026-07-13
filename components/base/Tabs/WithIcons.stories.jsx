import { LayoutDashboard, BarChart2, Package, Settings, TrendingUp, User } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Tabs/With Icons',
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
        Pass any Lucide icon to the{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">icon</code> prop on{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">TabsTrigger</code> with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          variant=&quot;underline&quot;
        </code>
        . The icon renders before the label at a size matching the{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">size</code> prop.
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

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use icons when they help users scan or distinguish tabs at a glance',
                body: 'Icons are most useful when tab labels are similar (Overview / Summary) or when the tab strip is wide and users need a quick visual anchor to navigate.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Never use icon-only triggers — always keep the text label',
                body: 'Icon-only triggers break accessibility and hurt scannability. Screen readers rely on the label text; sighted users may not recognize an icon without context.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Apply icons consistently — all or none in the same TabsList',
                body: 'Mixed icon/no-icon triggers create uneven spacing and draw unintended visual attention to the icon-less items, making the tab strip feel broken.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Choose icons that reinforce meaning, not just decorate',
                body: 'Pick recognizable icons: LayoutDashboard for overview, Settings for settings, BarChart2 for trades. Avoid icons that look similar to each other or add no semantic value.',
              },
            ],
          },
        ]}
      />

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

export const Pill = {
  name: 'Pill',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        Pass any Lucide icon to the{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">icon</code> prop on{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">TabsTrigger</code> with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant=&quot;pill&quot;</code>
        . Icons work the same across both variants — size and placement are controlled by the{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">size</code> prop on{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">TabsList</code>.
      </p>

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

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title:
                  'Use icons in pill triggers when the tab strip needs stronger visual identity',
                body: 'Icons add recognition value to pill triggers, especially in dashboard or app-shell contexts where the tabs represent distinct feature areas.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't add icons to pill triggers when space is tight",
                body: 'Icons increase the width of each trigger. On narrow containers, pill triggers with icons can overflow or wrap. Prefer labels-only for compact pill sizes (xs, sm).',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Apply icons consistently — all or none in the same TabsList',
                body: 'If one pill trigger has an icon, every trigger in the same list should have one. Mixed icon/no-icon triggers break the visual rhythm of the pill group.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Icons work identically across underline and pill variants',
                body: 'Size and placement are controlled by the size prop on TabsList — the icon scales with the tab size automatically regardless of which variant is used.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`import { TrendingUp, User, Settings } from 'lucide-react'

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
  ...
</Tabs>`}</code>
      </pre>
    </div>
  ),
}
