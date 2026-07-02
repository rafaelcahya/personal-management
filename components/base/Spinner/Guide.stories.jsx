import { Spinner } from './Spinner'
import Button from '@/components/base/Button/Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Spinner' }
export default meta

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-3xl py-6 px-2">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Spinner</h1>
        <p className="text-base text-gray-500 leading-relaxed">
          A lightweight inline loading indicator built from scratch using a CSS border animation. No
          SVG, no library — just a spinning circle that inherits color via{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">border-current</code>.
        </p>
      </div>

      {/* Overview */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Overview</h2>
        <div className="flex items-center gap-6 p-6 border border-gray-200 rounded-xl">
          <Spinner size="xs" />
          <Spinner size="sm" />
          <Spinner size="default" />
          <Spinner size="lg" />
          <Spinner size="xl" />
          <Spinner variant="muted" />
          <div className="bg-violet-600 rounded-lg p-2 flex">
            <Spinner variant="white" />
          </div>
          <Button disabled>
            <Spinner size="xs" variant="white" />
            Saving...
          </Button>
        </div>
        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
          <code>{`import { Spinner } from '@/components/base/Spinner/Spinner'

<Spinner />
<Spinner size="lg" />
<Spinner variant="muted" />
<Spinner variant="white" />

<Button disabled>
  <Spinner size="xs" variant="white" />
  Saving...
</Button>`}</code>
        </pre>
      </section>

      {/* Anatomy */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Anatomy</h2>
        <pre className="bg-gray-50 border border-gray-200 rounded-lg px-5 py-4 text-xs text-gray-700 leading-relaxed">
          <code>{`<span
  role="status"
  aria-label="Loading"
  className="inline-block rounded-full border-current border-t-transparent animate-spin"
/>`}</code>
        </pre>
        <p className="text-sm text-gray-500 leading-relaxed">
          A single <code className="font-mono bg-gray-100 px-1 rounded text-xs">span</code> with{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">border-current</code> on
          three sides and{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">border-t-transparent</code>{' '}
          on the top, rotated continuously via Tailwind's{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">animate-spin</code>. Color is
          set via <code className="font-mono bg-gray-100 px-1 rounded text-xs">text-*</code> classes
          since <code className="font-mono bg-gray-100 px-1 rounded text-xs">border-current</code>{' '}
          uses <code className="font-mono bg-gray-100 px-1 rounded text-xs">currentColor</code>.
        </p>
      </section>

      {/* Sizes */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Sizes</h2>
        <div className="flex items-end gap-8">
          {[
            { size: 'xs', dim: '12px' },
            { size: 'sm', dim: '16px' },
            { size: 'default', dim: '20px' },
            { size: 'lg', dim: '28px' },
            { size: 'xl', dim: '40px' },
          ].map(({ size, dim }) => (
            <div key={size} className="flex flex-col items-center gap-3">
              <Spinner size={size} />
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-xs font-medium text-gray-700">{size}</span>
                <span className="text-[10px] text-gray-400">{dim}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* When to Use */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">When to Use</h2>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {['Use Spinner when…', 'Consider an alternative when…'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700 text-xs uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700 align-top">
                  <ul className="flex flex-col gap-1.5">
                    <li>
                      The content shape is unknown ahead of time (e.g. fetching a dynamic value or
                      API response)
                    </li>
                    <li>
                      A background action is in progress and you need to block further interaction
                      (e.g. form submit, delete confirmation)
                    </li>
                    <li>
                      The loading duration is short and unpredictable — you just need to signal
                      "something is happening"
                    </li>
                  </ul>
                </td>
                <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700 align-top">
                  <ul className="flex flex-col gap-1.5">
                    <li>
                      Use <strong>Skeleton</strong> when the layout of the incoming content is
                      already known — it reduces layout shift and feels faster
                    </li>
                    <li>
                      Use a <strong>progress bar</strong> when the operation has a measurable
                      percentage (e.g. file upload, multi-step wizard)
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Dos & Don'ts */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Dos & Don'ts</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="size-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                ✓
              </span>
              <span className="text-sm font-semibold text-green-700">Do</span>
            </div>
            <div className="space-y-3">
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <p className="text-xs text-green-800">
                  Pair the Spinner with a short descriptive label (e.g. "Saving…") when placed
                  inside a button so screen readers and sighted users both understand the action in
                  progress.
                </p>
              </div>
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <p className="text-xs text-green-800">
                  Use <code className="font-mono bg-green-100 px-0.5 rounded">variant="white"</code>{' '}
                  on dark or colored backgrounds (e.g. inside a filled button) so the spinner
                  remains visible with sufficient contrast.
                </p>
              </div>
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <p className="text-xs text-green-800">
                  Keep the spinner size proportional to the surrounding context — use{' '}
                  <code className="font-mono bg-green-100 px-0.5 rounded">xs</code> or{' '}
                  <code className="font-mono bg-green-100 px-0.5 rounded">sm</code> inside buttons
                  and badges, reserve{' '}
                  <code className="font-mono bg-green-100 px-0.5 rounded">lg</code> /{' '}
                  <code className="font-mono bg-green-100 px-0.5 rounded">xl</code> for full-page or
                  section-level loading states.
                </p>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="size-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
                ✕
              </span>
              <span className="text-sm font-semibold text-red-700">Don't</span>
            </div>
            <div className="space-y-3">
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <p className="text-xs text-red-800">
                  Don't leave the spinner running indefinitely without a timeout or error fallback —
                  always show an error state if the request fails so the user isn't stuck watching a
                  spinner forever.
                </p>
              </div>
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <p className="text-xs text-red-800">
                  Don't use a Spinner for content that has a predictable layout — a Skeleton loader
                  is less jarring because the page doesn't reflow when content arrives.
                </p>
              </div>
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <p className="text-xs text-red-800">
                  Don't place multiple large spinners on the same screen simultaneously — it
                  overwhelms the user and makes it impossible to tell which area is actually
                  loading.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API Reference */}
      <section className="flex flex-col gap-6">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">API Reference</h2>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-28">
                Prop
              </th>
              <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-56">
                Type
              </th>
              <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-28">
                Default
              </th>
              <th className="text-left py-2 text-xs uppercase tracking-wide text-gray-500 font-medium">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              [
                'size',
                '"xs" | "sm" | "default" | "lg" | "xl"',
                '"default"',
                'Controls the diameter and border width.',
              ],
              [
                'variant',
                '"default" | "muted" | "white"',
                '"default"',
                'Preset color. default = violet-600, muted = gray-400, white = white.',
              ],
              [
                'className',
                'string',
                '—',
                'Override or extend styles. Use text-* to set a custom color.',
              ],
            ].map(([prop, type, def, desc]) => (
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
