import Input from './Input'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Input Field/Normal',
}

export default meta

export const Normal = {
  name: 'Normal',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">size</code> prop controls
        the height and padding of the input. All five sizes are shown below in their default (empty)
        state.
      </p>

      <div className="flex flex-col gap-3 w-72">
        <Input size="xs" placeholder="Extra Small" />
        <Input size="sm" placeholder="Small" />
        <Input size="base" placeholder="Base" />
        <Input size="md" placeholder="Medium" />
        <Input size="lg" placeholder="Large" />
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Input size="xs" placeholder="Extra Small" />
<Input size="sm" placeholder="Small" />
<Input size="base" placeholder="Base" />
<Input size="md" placeholder="Medium" />
<Input size="lg" placeholder="Large" />`}</code>
      </pre>
    </div>
  ),
}
