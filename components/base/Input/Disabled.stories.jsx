import Input from './Input'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Input Field/Disabled',
}

export default meta

export const Disabled = {
  name: 'Disabled',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant="disabled"</code>{' '}
        to render the input in a dimmed, non-interactive state.
      </p>

      <div className="flex flex-col gap-3 w-72">
        <Input size="xs" variant="disabled" placeholder="Extra Small" />
        <Input size="sm" variant="disabled" placeholder="Small" />
        <Input size="base" variant="disabled" placeholder="Base" />
        <Input size="md" variant="disabled" placeholder="Medium" />
        <Input size="lg" variant="disabled" placeholder="Large" />
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Input size="base" variant="disabled" placeholder="Base" />`}</code>
      </pre>
    </div>
  ),
}
