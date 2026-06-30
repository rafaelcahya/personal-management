import Textarea from './Textarea'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Textarea/Normal',
}

export default meta

export const Normal = {
  name: 'Normal',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Default textarea — use{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">rows</code> to control the
        visible height. Resize is disabled by default.
      </p>

      <div className="flex flex-col gap-4 w-80">
        <Textarea rows={2} placeholder="rows={2}" />
        <Textarea rows={4} placeholder="rows={4} (default)" />
        <Textarea rows={6} placeholder="rows={6}" />
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Textarea rows={4} placeholder="Write something..." />`}</code>
      </pre>
    </div>
  ),
}
