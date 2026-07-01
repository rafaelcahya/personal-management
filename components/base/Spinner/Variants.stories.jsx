import { Spinner } from './Spinner'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Spinner/Variants' }
export default meta

export const Variants = {
  name: 'Variants',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-lg">
      <p className="text-sm text-gray-500 leading-relaxed">
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant</code> prop
        controls color. Use{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">white</code> on dark or colored
        backgrounds.
      </p>

      <div className="flex items-center gap-8">
        <div className="flex flex-col items-center gap-3">
          <Spinner variant="default" size="lg" />
          <span className="text-xs font-medium text-gray-700">default</span>
          <span className="text-[10px] text-gray-400">violet-600</span>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Spinner variant="muted" size="lg" />
          <span className="text-xs font-medium text-gray-700">muted</span>
          <span className="text-[10px] text-gray-400">gray-400</span>
        </div>

        <div className="flex flex-col items-center gap-3 bg-violet-600 rounded-xl p-4">
          <Spinner variant="white" size="lg" />
          <span className="text-xs font-medium text-white">white</span>
          <span className="text-[10px] text-violet-200">on dark bg</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">Custom color via className</span>
        <div className="flex items-center gap-6">
          <Spinner className="text-rose-500" />
          <Spinner className="text-amber-500" />
          <Spinner className="text-emerald-500" />
          <Spinner className="text-sky-500" />
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`<Spinner variant="default" />  {/* violet-600, default */}
<Spinner variant="muted" />   {/* gray-400 */}
<Spinner variant="white" />   {/* white — for dark backgrounds */}

{/* custom color */}
<Spinner className="text-rose-500" />`}</code>
      </pre>
    </div>
  ),
}
