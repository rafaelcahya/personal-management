import { Separator } from './Separator'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Separator/Basic' }
export default meta

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-lg">
      <p className="text-sm text-gray-500 leading-relaxed">
        Drop <code className="font-mono bg-gray-100 px-1 rounded text-xs">{'<Separator />'}</code>{' '}
        between any two elements to add a horizontal dividing line. No props required.
      </p>

      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-700">Section A</p>
        <Separator />
        <p className="text-sm text-gray-700">Section B</p>
        <Separator />
        <p className="text-sm text-gray-700">Section C</p>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`import { Separator } from '@/components/base/Separator/Separator'

<p>Section A</p>
<Separator />
<p>Section B</p>`}</code>
      </pre>
    </div>
  ),
}
