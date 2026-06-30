import Combobox from './Combobox'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Combobox/Disabled',
}

export default meta

const FRUITS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

export const Disabled = {
  name: 'Disabled',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Use the <code className="font-mono bg-gray-100 px-1 rounded text-xs">disabled</code> prop to
        prevent interaction. Works both standalone and inside{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> — the
        Combobox inherits disabled state from context automatically.
      </p>

      <div className="flex flex-col gap-4 w-80">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-violet-700">disabled — no value</span>
          <Combobox disabled options={FRUITS} placeholder="Select..." />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-violet-700">disabled — with value</span>
          <Combobox disabled options={FRUITS} value={{ value: 'apple', label: 'Apple' }} />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-violet-700">
            disabled — multiple with tags
          </span>
          <Combobox
            disabled
            multiple
            options={FRUITS}
            value={[
              { value: 'apple', label: 'Apple' },
              { value: 'banana', label: 'Banana' },
            ]}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-violet-700">
            Via FieldContent disabled prop
          </span>
          <FieldContent size="base" disabled>
            <FieldLabel>Favourite fruit</FieldLabel>
            <Combobox options={FRUITS} value={{ value: 'apple', label: 'Apple' }} />
          </FieldContent>
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Standalone — disabled prop */}
<Combobox disabled value={val} onChange={setVal} options={options} />

{/* Via FieldContent — all children inherit disabled */}
<FieldContent size="base" disabled>
  <FieldLabel>Favourite fruit</FieldLabel>
  <Combobox value={val} onChange={setVal} options={options} />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
