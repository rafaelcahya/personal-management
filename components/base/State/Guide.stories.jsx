import { AlertCircle, Inbox, RefreshCw, ServerCrash } from 'lucide-react'
import State from './State'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'State',
}

export default meta

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-3xl py-6 px-2">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">State</h1>
        <p className="text-base text-gray-500 leading-relaxed">
          A flat-props component for section-level error, empty, and loading states. Covers the most
          common inline state pattern without copy-pasting markup.
        </p>
      </div>

      {/* Overview */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Overview</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              variant: 'error',
              title: 'Failed to load data',
              description: 'Check your connection and retry.',
              action: { label: 'Try again', onClick: () => {} },
            },
            {
              variant: 'empty',
              title: 'No items yet',
              description: 'Add your first item to get started.',
            },
            {
              variant: 'loading',
            },
          ].map(({ variant, ...rest }) => (
            <div key={variant} className="flex flex-col gap-2">
              <code className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded w-fit">
                {variant}
              </code>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <State variant={variant} {...rest} />
              </div>
            </div>
          ))}
        </div>

        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
          <code>{`import State from '@/components/base/State/State'

// Error — with retry button
<State
  variant="error"
  title="Failed to load data"
  description="Check your connection and retry."
  action={{ label: 'Try again', onClick: handleRetry }}
/>

// Empty — with optional CTA
<State
  variant="empty"
  title="No items yet"
  description="Add your first item to get started."
/>

// Loading — skeleton rows
<State variant="loading" skeletonRows={3} />`}</code>
        </pre>
      </section>

      {/* Variants */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Variants</h2>

        <div className="flex flex-col gap-6">
          {/* error */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <code className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">error</code>
              <span className="text-xs text-gray-500">
                role=&quot;alert&quot; aria-live=&quot;assertive&quot;
              </span>
            </div>
            <div className="border border-gray-200 rounded-xl">
              <State
                variant="error"
                title="Failed to load valuation data"
                description="BBCA — check your connection and retry."
                action={{ label: 'Try again', onClick: () => {} }}
              />
            </div>
          </div>

          {/* empty */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <code className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">empty</code>
              <span className="text-xs text-gray-500">role=&quot;status&quot;</span>
            </div>
            <div className="border border-gray-200 rounded-xl">
              <State
                variant="empty"
                title="No tickers yet"
                description="Add tickers to your watchlist to start comparing valuations."
                action={{ label: 'Add ticker', onClick: () => {} }}
              />
            </div>
          </div>

          {/* loading */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <code className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">loading</code>
              <span className="text-xs text-gray-500">aria-busy=&quot;true&quot;</span>
            </div>
            <div className="border border-gray-200 rounded-xl">
              <State variant="loading" skeletonRows={3} />
            </div>
          </div>
        </div>
      </section>

      {/* Custom icon */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Custom Icon</h2>
        <p className="text-sm text-gray-500">
          Pass a Lucide icon component via the{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">icon</code> prop to override
          the default. Defaults: error → AlertCircle, empty → Inbox.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-xl">
            <State
              variant="error"
              icon={ServerCrash}
              title="Server unavailable"
              description="The service is temporarily down."
              action={{ label: 'Retry', onClick: () => {} }}
            />
          </div>
          <div className="border border-gray-200 rounded-xl">
            <State
              variant="empty"
              icon={RefreshCw}
              title="Nothing synced yet"
              description="Connect your account to start syncing."
            />
          </div>
        </div>
        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
          <code>{`import { ServerCrash } from 'lucide-react'

<State
  variant="error"
  icon={ServerCrash}
  title="Server unavailable"
  description="The service is temporarily down."
  action={{ label: 'Retry', onClick: handleRetry }}
/>`}</code>
        </pre>
      </section>

      {/* API Reference */}
      <section className="flex flex-col gap-6">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">API Reference</h2>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              {['Prop', 'Type', 'Default', 'Description'].map((h) => (
                <th
                  key={h}
                  className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              {
                prop: 'variant',
                type: '"error" | "empty" | "loading"',
                def: '"empty"',
                desc: 'Controls icon, ARIA role, and layout.',
              },
              {
                prop: 'icon',
                type: 'LucideIcon',
                def: 'AlertCircle / Inbox',
                desc: 'Override the default icon. Pass the component reference, not JSX.',
              },
              {
                prop: 'title',
                type: 'string',
                def: '—',
                desc: 'Primary message shown below the icon.',
              },
              {
                prop: 'description',
                type: 'string',
                def: '—',
                desc: 'Supporting text shown below the title.',
              },
              {
                prop: 'action',
                type: '{ label: string, onClick: fn }',
                def: '—',
                desc: 'Renders an outline Button below the description.',
              },
              {
                prop: 'skeletonRows',
                type: 'number',
                def: '3',
                desc: 'Number of skeleton rows — loading variant only.',
              },
              {
                prop: 'className',
                type: 'string',
                def: '—',
                desc: 'Additional classes merged via cn().',
              },
            ].map(({ prop, type, def, desc }) => (
              <tr key={prop}>
                <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">{prop}</td>
                <td className="py-2.5 pr-4 font-mono text-xs text-gray-500">{type}</td>
                <td className="py-2.5 pr-4 font-mono text-xs text-gray-400">{def}</td>
                <td className="py-2.5 text-xs text-gray-600">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  ),
}
