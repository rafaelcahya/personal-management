import { Checkbox } from '@/components/ui/checkbox'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Checkbox/Basic',
}

export default meta

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Checkbox supports three visual states: unchecked (default), checked, and indeterminate.
        Always pair with a label via{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">id</code> /{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">htmlFor</code> for
        accessibility.
      </p>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Checkbox id="basic-unchecked" />
          <label
            htmlFor="basic-unchecked"
            className="text-sm font-medium cursor-pointer select-none"
          >
            Unchecked
          </label>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox id="basic-checked" defaultChecked />
          <label htmlFor="basic-checked" className="text-sm font-medium cursor-pointer select-none">
            Checked
          </label>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox id="basic-indeterminate" checked="indeterminate" />
          <label
            htmlFor="basic-indeterminate"
            className="text-sm font-medium cursor-pointer select-none"
          >
            Indeterminate
          </label>
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<div className="flex items-center gap-3">
  <Checkbox id="terms" defaultChecked />
  <label htmlFor="terms" className="text-sm font-medium cursor-pointer select-none">
    I agree to the terms
  </label>
</div>

{/* Indeterminate — useful for "select all" controls */}
<Checkbox checked="indeterminate" />`}</code>
      </pre>
    </div>
  ),
}
