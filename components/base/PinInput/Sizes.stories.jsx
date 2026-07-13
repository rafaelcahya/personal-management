import PinInput from './PinInput'
import FieldContent from '../Field/FieldContent'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Pin Input/Sizes',
}

export default meta

export const Sizes = {
  name: 'Sizes',
  render: () => (
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        Cell size is controlled via the{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">size</code> prop or inherited from{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">FieldContent</code> context. Available
        sizes: <code className="font-mono bg-gray-100 px-1 rounded">xs</code>,{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">sm</code>,{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">base</code> (default),{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">md</code>,{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">lg</code>.
      </span>

      <div className="flex flex-col gap-3">
        {['xs', 'sm', 'base', 'md', 'lg'].map((size) => (
          <div key={size} className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-violet-700 w-8 shrink-0">{size}</span>
            <FieldContent size={size}>
              <PinInput length={4} value="" onChange={() => {}} />
            </FieldContent>
          </div>
        ))}
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`{/* Via FieldContent context — preferred in forms */}
<FieldContent size="lg">
  <FieldLabel>PIN</FieldLabel>
  <PinInput length={4} value={pin} onChange={setPin} />
</FieldContent>

{/* Via prop — standalone */}
<PinInput size="lg" length={4} value={pin} onChange={setPin} />`}</code>
      </pre>
    </div>
  ),
}
