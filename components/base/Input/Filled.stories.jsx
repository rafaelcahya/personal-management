import Input from './Input'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Input Field/Filled',
}

export default meta

export const Filled = {
  name: 'Filled',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Input with <code className="font-mono bg-gray-100 px-1 rounded text-xs">defaultValue</code>{' '}
        — shows how each size looks when content is present.
      </p>

      <div className="flex flex-col gap-3 w-72">
        <Input size="xs" defaultValue="Extra Small" />
        <Input size="sm" defaultValue="Small" />
        <Input size="base" defaultValue="Base" />
        <Input size="md" defaultValue="Medium" />
        <Input size="lg" defaultValue="Large" />
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Input size="base" defaultValue="Base" />`}</code>
      </pre>
    </div>
  ),
}
