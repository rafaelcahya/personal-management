import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './Select'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Select/Basic',
}

export default meta

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        A flat list of options inside{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">SelectContent</code>. Each{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">SelectItem</code> requires a
        unique <code className="font-mono bg-gray-100 px-1 rounded text-xs">value</code> prop.
      </p>

      <div className="w-80">
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Select>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Select a status" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="active">Active</SelectItem>
    <SelectItem value="pending">Pending</SelectItem>
    <SelectItem value="draft">Draft</SelectItem>
    <SelectItem value="archived">Archived</SelectItem>
  </SelectContent>
</Select>`}</code>
      </pre>
    </div>
  ),
}
