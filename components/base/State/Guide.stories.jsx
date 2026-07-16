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
          A flat-props component for section-level error, empty, and loading states. Replaces inline
          markup with a consistent, accessible pattern across all modules.
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
            { variant: 'loading' },
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

<State
  variant="error"
  title="Failed to load data"
  description="Check your connection and retry."
  action={{ label: 'Try again', onClick: handleRetry }}
/>

<State variant="empty" title="No items yet" />

<State variant="loading" skeletonRows={3} />`}</code>
        </pre>
      </section>

      {/* Anatomy */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Anatomy</h2>
        <div className="overflow-x-auto w-full">
          <div className="min-w-max py-4">
            <div className="relative inline-flex flex-col items-center gap-3 border-2 border-dashed border-gray-400 rounded px-8 py-5 pt-9">
              <span className="absolute top-1.5 left-2.5 text-[10px] font-mono text-gray-500">
                State
              </span>

              <div className="relative border-2 border-dashed border-violet-400 rounded px-4 py-2 pt-6 min-w-[120px] flex justify-center">
                <span className="absolute top-1 left-1.5 text-[10px] font-mono text-violet-500 whitespace-nowrap">
                  icon (opt)
                </span>
                <AlertCircle className="size-8 text-slate-400" />
              </div>

              <div className="relative border-2 border-dashed border-blue-400 rounded px-4 py-2 pt-6 min-w-[200px] flex flex-col items-center gap-1">
                <span className="absolute top-1 left-1.5 text-[10px] font-mono text-blue-500 whitespace-nowrap">
                  title + description (opt)
                </span>
                <span className="text-sm font-medium text-slate-700">Failed to load data</span>
                <span className="text-xs text-slate-500">Check your connection.</span>
              </div>

              <div className="relative border-2 border-dashed border-orange-400 rounded px-4 py-2 pt-6 min-w-[160px] flex justify-center">
                <span className="absolute top-1 left-1.5 text-[10px] font-mono text-orange-500 whitespace-nowrap">
                  action (opt)
                </span>
                <div className="h-7 w-20 rounded-md border border-gray-300 bg-white" />
              </div>
            </div>
          </div>
        </div>

        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-36">
                Prop
              </th>
              <th className="text-left py-2 text-xs uppercase tracking-wide text-gray-500 font-medium">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              {
                prop: 'variant',
                desc: 'Controls layout and ARIA role. "error" → alert; "empty" → status; "loading" → skeleton rows.',
              },
              {
                prop: 'icon',
                desc: 'Override default icon. Pass the component reference (not JSX). Defaults: error → AlertCircle, empty → Inbox.',
              },
              {
                prop: 'title',
                desc: 'Primary message rendered as <p>. Minimum required signal for error and empty variants.',
              },
              {
                prop: 'description',
                desc: 'Supporting text rendered below the title.',
              },
              {
                prop: 'action',
                desc: '{ label, onClick } — renders an outline Button. Use for retry or CTA.',
              },
              {
                prop: 'skeletonRows',
                desc: 'Number of skeleton rows for loading variant. Defaults to 3.',
              },
            ].map(({ prop, desc }) => (
              <tr key={prop}>
                <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">{prop}</td>
                <td className="py-2.5 text-xs text-gray-600">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ARIA */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Accessibility</h2>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              {['Variant', 'ARIA attributes'].map((h) => (
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
              { variant: 'error', aria: 'role="alert" aria-live="assertive"' },
              { variant: 'empty', aria: 'role="status"' },
              { variant: 'loading', aria: 'aria-busy="true" aria-label="Loading…"' },
            ].map(({ variant, aria }) => (
              <tr key={variant}>
                <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">{variant}</td>
                <td className="py-2.5 font-mono text-xs text-gray-500">{aria}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Custom icon */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Custom Icon</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-xl">
            <State
              variant="error"
              icon={ServerCrash}
              title="Server unavailable"
              description="Service is temporarily down."
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
  icon={ServerCrash}   // component ref, not JSX
  title="Server unavailable"
  description="Service is temporarily down."
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
                desc: 'Controls icon defaults, ARIA role, and layout.',
              },
              {
                prop: 'icon',
                type: 'LucideIcon',
                def: 'AlertCircle / Inbox',
                desc: 'Override the default icon. Pass the component reference.',
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
