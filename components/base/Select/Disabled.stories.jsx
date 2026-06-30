import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './Select'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Select/Disabled',
}

export default meta

export const Disabled = {
  name: 'Disabled',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">disabled</code> to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">Select</code> to disable the
        entire trigger, or to individual{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">SelectItem</code> to make
        specific options unselectable.
      </p>

      <div className="flex flex-col gap-4 w-80">
        <div>
          <p className="text-xs font-mono text-violet-700 mb-2">disabled trigger</p>
          <Select disabled>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Entire select is disabled" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">Option A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <p className="text-xs font-mono text-violet-700 mb-2">disabled items</p>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Some options are disabled" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending" disabled>
                Pending (unavailable)
              </SelectItem>
              <SelectItem value="archived" disabled>
                Archived (unavailable)
              </SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Disable the entire select */}
<Select disabled>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Disabled" />
  </SelectTrigger>
  <SelectContent>...</SelectContent>
</Select>

{/* Disable individual items */}
<SelectItem value="pending" disabled>Pending (unavailable)</SelectItem>`}</code>
      </pre>
    </div>
  ),
}
