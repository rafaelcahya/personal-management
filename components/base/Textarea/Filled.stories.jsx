import Textarea from './Textarea'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Textarea/Filled',
}

export default meta

export const Filled = {
  name: 'Filled',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Textarea with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">defaultValue</code> — shows how
        it looks when content is present.
      </p>

      <div className="w-80">
        <Textarea
          rows={4}
          defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        />
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Textarea rows={4} defaultValue="Your content here..." />`}</code>
      </pre>
    </div>
  ),
}
