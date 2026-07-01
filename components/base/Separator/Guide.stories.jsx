import { Separator } from './Separator'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Separator' }
export default meta

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-3xl py-6 px-2">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Separator</h1>
        <p className="text-base text-gray-500 leading-relaxed">
          A lightweight visual divider built from scratch. Supports horizontal and vertical
          orientations, three line styles, and an optional centered label.
        </p>
      </div>

      {/* Overview */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Overview</h2>
        <div className="flex flex-col gap-4 p-6 border border-gray-200 rounded-xl">
          <p className="text-sm text-gray-600">Section A</p>
          <Separator />
          <p className="text-sm text-gray-600">Section B</p>
          <Separator label="or" variant="dashed" />
          <p className="text-sm text-gray-600">Section C</p>
          <div className="flex items-center gap-4 pt-1">
            <span className="text-sm text-gray-600">Left</span>
            <Separator orientation="vertical" className="h-5" />
            <span className="text-sm text-gray-600">Right</span>
          </div>
        </div>
        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
          <code>{`import { Separator } from '@/components/base/Separator/Separator'

<Separator />
<Separator label="or" variant="dashed" />
<Separator orientation="vertical" className="h-5" />`}</code>
        </pre>
      </section>

      {/* Anatomy */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Anatomy</h2>
        <pre className="bg-gray-50 border border-gray-200 rounded-lg px-5 py-4 text-xs text-gray-700 leading-relaxed">
          <code>{`{/* without label */}
<div role="separator" aria-orientation="horizontal" />

{/* with label */}
<div role="separator" aria-orientation="horizontal">
  <div />              ← left line (flex-1)
  <span>{label}</span> ← centered text
  <div />              ← right line (flex-1)
</div>`}</code>
        </pre>
      </section>

      {/* Variants */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Variants</h2>
        <div className="flex flex-col gap-5">
          {[
            { variant: 'solid', desc: 'Continuous line. Default.' },
            { variant: 'dashed', desc: 'Evenly spaced dashes.' },
            { variant: 'dotted', desc: 'Evenly spaced dots.' },
          ].map(({ variant, desc }) => (
            <div key={variant} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <code className="text-xs font-mono text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded">
                  {variant}
                </code>
                <span className="text-xs text-gray-400">{desc}</span>
              </div>
              <Separator variant={variant} />
            </div>
          ))}
        </div>
      </section>

      {/* API Reference */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">API Reference</h2>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-32">
                Prop
              </th>
              <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-48">
                Type
              </th>
              <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-32">
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
                'orientation',
                '"horizontal" | "vertical"',
                '"horizontal"',
                'Direction of the divider.',
              ],
              ['variant', '"solid" | "dashed" | "dotted"', '"solid"', 'Visual style of the line.'],
              ['label', 'string', '—', 'Text centered on the line. Horizontal only.'],
              [
                'className',
                'string',
                '—',
                'Extra classes. Pass a text color (e.g. text-violet-400) to change line color. Required for height on vertical separators.',
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

        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-700 leading-relaxed">
          <strong>Vertical height:</strong> A vertical separator has no intrinsic height. Always
          pass a height class like <code className="font-mono">className="h-4"</code> or{' '}
          <code className="font-mono">className="h-full"</code>.
        </div>
      </section>
    </div>
  ),
}
