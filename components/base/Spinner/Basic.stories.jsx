import { Spinner } from './Spinner'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Spinner/Basic' }
export default meta

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-lg">
      <p className="text-sm text-gray-500 leading-relaxed">
        Drop <code className="font-mono bg-gray-100 px-1 rounded text-xs">{'<Spinner />'}</code>{' '}
        anywhere to show an inline loading indicator. No props required.
      </p>

      <Spinner />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`import { Spinner } from '@/components/base/Spinner/Spinner'

<Spinner />`}</code>
      </pre>
    </div>
  ),
}
