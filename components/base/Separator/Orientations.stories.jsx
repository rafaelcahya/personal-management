import { Separator } from './Separator'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Separator/Orientations' }
export default meta

export const Orientations = {
  name: 'Orientations',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-lg">
      <p className="text-sm text-gray-500 leading-relaxed">
        Use{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">orientation="horizontal"</code>{' '}
        (default) for row dividers and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">orientation="vertical"</code>{' '}
        for column dividers. Vertical separators require an explicit height via{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">className</code>.
      </p>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">Horizontal (default)</span>
          <div className="flex flex-col gap-3 p-4 border border-gray-100 rounded-lg">
            <p className="text-sm text-gray-700">Above</p>
            <Separator />
            <p className="text-sm text-gray-700">Below</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">Vertical</span>
          <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
            <span className="text-sm text-gray-700">Left</span>
            <Separator orientation="vertical" className="h-5" />
            <span className="text-sm text-gray-700">Middle</span>
            <Separator orientation="vertical" className="h-5" />
            <span className="text-sm text-gray-700">Right</span>
          </div>
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`{/* horizontal */}
<Separator />
<Separator orientation="horizontal" />

{/* vertical — must provide height */}
<Separator orientation="vertical" className="h-5" />`}</code>
      </pre>
    </div>
  ),
}
