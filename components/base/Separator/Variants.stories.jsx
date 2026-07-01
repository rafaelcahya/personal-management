import { Separator } from './Separator'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Separator/Variants' }
export default meta

export const Variants = {
  name: 'Variants',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-lg">
      <p className="text-sm text-gray-500 leading-relaxed">
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant</code> prop
        controls the line style. Works for both horizontal and vertical orientations.
      </p>

      <div className="flex flex-col gap-6">
        {[
          { variant: 'solid', label: 'solid (default)', desc: 'A continuous line.' },
          { variant: 'dashed', label: 'dashed', desc: 'Evenly spaced dashes.' },
          { variant: 'dotted', label: 'dotted', desc: 'Evenly spaced dots.' },
        ].map(({ variant, label, desc }) => (
          <div key={variant} className="flex flex-col gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-medium text-gray-700">{label}</span>
              <span className="text-xs text-gray-400">{desc}</span>
            </div>
            <Separator variant={variant} />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs text-gray-400">Vertical variants</span>
        <div className="flex items-center gap-6 h-10">
          <Separator orientation="vertical" variant="solid" className="h-full" />
          <Separator orientation="vertical" variant="dashed" className="h-full" />
          <Separator orientation="vertical" variant="dotted" className="h-full" />
        </div>
        <div className="flex items-center gap-6">
          {['solid', 'dashed', 'dotted'].map((v) => (
            <span
              key={v}
              className="text-xs text-gray-400 w-px text-center"
              style={{ minWidth: '40px' }}
            >
              {v}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs text-gray-400">Custom color — pass any text color class</span>
        <Separator className="text-violet-300" />
        <Separator variant="dashed" className="text-blue-300" />
        <Separator variant="dotted" className="text-rose-300" />
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`<Separator variant="solid" />   {/* default — gray-200 */}
<Separator variant="dashed" />
<Separator variant="dotted" />

{/* custom color via className */}
<Separator className="text-violet-300" />
<Separator variant="dashed" className="text-blue-300" />

{/* vertical */}
<Separator orientation="vertical" variant="dashed" className="h-5" />`}</code>
      </pre>
    </div>
  ),
}
