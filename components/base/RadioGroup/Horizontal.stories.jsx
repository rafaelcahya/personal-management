import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Radio Group/Horizontal',
}

export default meta

export const Horizontal = {
  name: 'Horizontal',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Override the default vertical layout by passing{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          className="flex flex-row gap-6"
        </code>{' '}
        to <code className="font-mono bg-gray-100 px-1 rounded text-xs">RadioGroup</code>. Best for
        short labels like sizes or ratings.
      </p>

      <RadioGroup defaultValue="m" className="flex flex-row gap-6">
        {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
          <div key={size} className="flex items-center gap-2">
            <RadioGroupItem value={size.toLowerCase()} id={`size-${size}`} />
            <label
              htmlFor={`size-${size}`}
              className="text-sm font-medium cursor-pointer select-none"
            >
              {size}
            </label>
          </div>
        ))}
      </RadioGroup>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<RadioGroup defaultValue="m" className="flex flex-row gap-6">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="s" id="s" />
    <label htmlFor="s" className="text-sm font-medium cursor-pointer select-none">S</label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="m" id="m" />
    <label htmlFor="m" className="text-sm font-medium cursor-pointer select-none">M</label>
  </div>
</RadioGroup>`}</code>
      </pre>
    </div>
  ),
}
