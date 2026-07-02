import { RadioGroup, RadioGroupItem } from './RadioGroup'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Radio Group/Basic',
}

export default meta

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        A set of mutually exclusive options — selecting one deselects the others. Pass{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">defaultValue</code> for
        uncontrolled or <code className="font-mono bg-gray-100 px-1 rounded text-xs">value</code> +{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">onValueChange</code> for
        controlled.
      </p>

      <RadioGroup defaultValue="standard">
        {[
          { value: 'standard', label: 'Standard — free, 5–7 business days' },
          { value: 'express', label: 'Express — Rp 25.000, 2–3 business days' },
          { value: 'overnight', label: 'Overnight — Rp 75.000, next day' },
        ].map(({ value, label }) => (
          <div key={value} className="flex items-center gap-2">
            <RadioGroupItem value={value} id={`basic-${value}`} />
            <label
              htmlFor={`basic-${value}`}
              className="text-sm font-medium cursor-pointer select-none"
            >
              {label}
            </label>
          </div>
        ))}
      </RadioGroup>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<RadioGroup defaultValue="standard">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="standard" id="standard" />
    <label htmlFor="standard" className="text-sm font-medium cursor-pointer select-none">
      Standard — free, 5–7 business days
    </label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="express" id="express" />
    <label htmlFor="express" className="text-sm font-medium cursor-pointer select-none">
      Express — Rp 25.000, 2–3 business days
    </label>
  </div>
</RadioGroup>`}</code>
      </pre>
    </div>
  ),
}
