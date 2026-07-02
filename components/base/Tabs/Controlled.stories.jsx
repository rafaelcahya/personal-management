'use client'
import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Tabs/Controlled',
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

const tabs = ['overview', 'trades', 'inventory', 'settings']

function ControlledDemo() {
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

      <div className="flex items-center gap-2 pt-2">
        <span className="text-xs text-gray-400 shrink-0">Force active:</span>
        <div className="flex gap-1.5 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActive(t)}
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

      <p className="text-xs text-gray-400">
        Active: <code className="font-mono bg-gray-100 px-1 rounded">{active}</code>
      </p>
    </div>
  )
}

export const Controlled = {
  name: 'Controlled',
  render: () => (
    <div className="flex flex-col gap-8 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        Use <code className="font-mono bg-gray-100 px-1 rounded text-xs">value</code> +{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">onValueChange</code> to let the
        parent control the active tab. Click the force buttons below to switch tabs externally.
      </p>

      <ControlledDemo />

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
