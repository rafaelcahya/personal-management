import { Checkbox } from '@/components/ui/checkbox'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Checkbox/Disabled',
}

export default meta

export const Disabled = {
  name: 'Disabled',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">disabled</code> to prevent
        interaction. Apply{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          opacity-50 cursor-not-allowed
        </code>{' '}
        to the label as well so the whole row reads as disabled.
      </p>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 opacity-50">
          <Checkbox id="dis-unchecked" disabled />
          <label
            htmlFor="dis-unchecked"
            className="text-sm font-medium cursor-not-allowed select-none"
          >
            Disabled unchecked
          </label>
        </div>
        <div className="flex items-center gap-3 opacity-50">
          <Checkbox id="dis-checked" disabled defaultChecked />
          <label
            htmlFor="dis-checked"
            className="text-sm font-medium cursor-not-allowed select-none"
          >
            Disabled checked
          </label>
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<div className="flex items-center gap-3 opacity-50">
  <Checkbox id="option" disabled />
  <label htmlFor="option" className="text-sm font-medium cursor-not-allowed select-none">
    Disabled option
  </label>
</div>`}</code>
      </pre>
    </div>
  ),
}
