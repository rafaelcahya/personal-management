'use client'
import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Tabs/Controlled',
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

const tabs = ['overview', 'trades', 'inventory', 'settings']

function ForceButtons({ active, onSelect }) {
  return (
    <div className="flex items-center gap-2 pt-2">
      <span className="text-xs text-gray-400 shrink-0">Force active:</span>
      <div className="flex gap-1.5 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onSelect(t)}
            className={[
              'px-2.5 py-1 rounded text-xs font-medium border transition-colors',
              active === t
                ? 'bg-violet-600 text-white border-violet-600'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50',
            ].join(' ')}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  )
}

function ActiveLabel({ active }) {
  return (
    <p className="text-xs text-gray-400">
      Active: <code className="font-mono bg-gray-100 px-1 rounded">{active}</code>
    </p>
  )
}

function UnderlineDemo() {
  const [active, setActive] = useState('overview')
  return (
    <div className="flex flex-col gap-4 w-full max-w-xl">
      <Tabs value={active} onValueChange={setActive}>
        <TabsList variant="underline">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trades">Trades</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Panel
            title="Overview"
            body="Externally controlled — the parent owns the active value."
          />
        </TabsContent>
        <TabsContent value="trades">
          <Panel title="Trades" body="Trades panel." />
        </TabsContent>
        <TabsContent value="inventory">
          <Panel title="Inventory" body="Inventory panel." />
        </TabsContent>
        <TabsContent value="settings">
          <Panel title="Settings" body="Settings panel." />
        </TabsContent>
      </Tabs>
      <ForceButtons active={active} onSelect={setActive} />
      <ActiveLabel active={active} />
    </div>
  )
}

function PillDemo() {
  const [active, setActive] = useState('overview')
  return (
    <div className="flex flex-col gap-4 w-full max-w-xl">
      <Tabs value={active} onValueChange={setActive}>
        <TabsList variant="pill">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trades">Trades</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Panel
            title="Overview"
            body="Externally controlled — the parent owns the active value."
          />
        </TabsContent>
        <TabsContent value="trades">
          <Panel title="Trades" body="Trades panel." />
        </TabsContent>
        <TabsContent value="inventory">
          <Panel title="Inventory" body="Inventory panel." />
        </TabsContent>
        <TabsContent value="settings">
          <Panel title="Settings" body="Settings panel." />
        </TabsContent>
      </Tabs>
      <ForceButtons active={active} onSelect={setActive} />
      <ActiveLabel active={active} />
    </div>
  )
}

const controlledBestPracticesItems = [
  {
    heading: 'When to use',
    cards: [
      {
        title: 'Use controlled mode when an external action drives the active tab',
        body: 'URL params, sidebar links, breadcrumbs, or buttons outside the tab strip — any case where something other than the tabs themselves needs to set the active panel.',
      },
    ],
  },
  {
    heading: 'When not to use',
    cards: [
      {
        title: "Don't use controlled mode for self-contained tab groups",
        body: 'If no external component needs to read or set the active tab, defaultValue is simpler and avoids unnecessary state management.',
      },
    ],
  },
  {
    heading: 'Accessibility',
    cards: [
      {
        title: 'Always pair value with onValueChange',
        body: 'Providing value alone creates a read-only tab strip that ignores clicks. Both props are required for a fully controlled component — one without the other silently breaks user interaction.',
      },
    ],
  },
  {
    heading: 'Advice',
    cards: [
      {
        title: 'Keep state in the closest common ancestor',
        body: "Don't lift tab state to global state (Zustand, Redux, Context) unless the active tab value is genuinely needed by distant components. Local useState is almost always enough.",
      },
    ],
  },
]

export const Underline = {
  name: 'Underline',
  render: () => (
    <div className="flex flex-col gap-8 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        Use <code className="font-mono bg-gray-100 px-1 rounded text-xs">value</code> +{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">onValueChange</code> to let the
        parent control the active tab with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          variant=&quot;underline&quot;
        </code>
        . Click the force buttons below to switch tabs externally.
      </p>

      <UnderlineDemo />

      <BestPractices items={controlledBestPracticesItems} />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`const [tab, setTab] = useState('overview')

<Tabs value={tab} onValueChange={setTab}>
  <TabsList variant="underline">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="trades">Trades</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">...</TabsContent>
  <TabsContent value="trades">...</TabsContent>
</Tabs>

{/* Force from outside */}
<button onClick={() => setTab('trades')}>Go to Trades</button>`}</code>
      </pre>
    </div>
  ),
}

export const Pill = {
  name: 'Pill',
  render: () => (
    <div className="flex flex-col gap-8 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        Use <code className="font-mono bg-gray-100 px-1 rounded text-xs">value</code> +{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">onValueChange</code> to let the
        parent control the active tab with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant=&quot;pill&quot;</code>
        . Click the force buttons below to switch tabs externally.
      </p>

      <PillDemo />

      <BestPractices items={controlledBestPracticesItems} />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`const [tab, setTab] = useState('overview')

<Tabs value={tab} onValueChange={setTab}>
  <TabsList variant="pill">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="trades">Trades</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">...</TabsContent>
  <TabsContent value="trades">...</TabsContent>
</Tabs>

{/* Force from outside */}
<button onClick={() => setTab('trades')}>Go to Trades</button>`}</code>
      </pre>
    </div>
  ),
}
