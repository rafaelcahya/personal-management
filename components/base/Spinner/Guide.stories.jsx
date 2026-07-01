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
