import { RadioGroup, RadioGroupItem } from './RadioGroup'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Radio Group/Disabled',
}

export default meta

export const Disabled = {
  name: 'Disabled',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">disabled</code> to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">RadioGroup</code> to disable
        all items, or to individual{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">RadioGroupItem</code> for
        specific options.
      </p>

      <div className="flex gap-12">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-mono text-violet-700 mb-1">entire group disabled</p>
          <RadioGroup defaultValue="a" disabled>
            {['Option A', 'Option B', 'Option C'].map((label, i) => {
              const val = String.fromCharCode(97 + i)
              return (
                <div key={val} className="flex items-center gap-2">
                  <RadioGroupItem value={val} id={`dis-all-${val}`} />
                  <label
                    htmlFor={`dis-all-${val}`}
                    className="text-sm font-medium cursor-not-allowed select-none opacity-50"
                  >
                    {label}
                  </label>
                </div>
              )
            })}
          </RadioGroup>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-mono text-violet-700 mb-1">individual items disabled</p>
          <RadioGroup defaultValue="a">
            {[
              { val: 'a', label: 'Option A', disabled: false },
              { val: 'b', label: 'Option B (unavailable)', disabled: true },
              { val: 'c', label: 'Option C', disabled: false },
            ].map(({ val, label, disabled }) => (
              <div key={val} className="flex items-center gap-2">
                <RadioGroupItem value={val} id={`dis-item-${val}`} disabled={disabled} />
                <label
                  htmlFor={`dis-item-${val}`}
                  className={`text-sm font-medium select-none ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                >
                  {label}
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Disable entire group */}
<RadioGroup disabled>...</RadioGroup>

{/* Disable individual item */}
<RadioGroupItem value="b" id="b" disabled />`}</code>
      </pre>
    </div>
  ),
}
