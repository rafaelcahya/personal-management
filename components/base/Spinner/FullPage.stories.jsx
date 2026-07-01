import { Spinner } from './Spinner'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Spinner/Full Page' }
export default meta

export const FullPage = {
  name: 'Full Page',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-lg">
      <p className="text-sm text-gray-500 leading-relaxed">
        For full-page or full-section loading states, center the spinner with a flex container. Pair
        with a label for clarity.
      </p>

      <div className="flex flex-col gap-4">
        <span className="text-xs text-gray-400">Full-page overlay</span>
        <div className="relative h-64 border border-gray-200 rounded-xl overflow-hidden bg-white">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Spinner size="xl" />
            <span className="text-sm text-gray-500">Loading data...</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <span className="text-xs text-gray-400">Inside a card section</span>
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-800">Portfolio</span>
          </div>
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" variant="muted" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <span className="text-xs text-gray-400">Dark overlay</span>
        <div className="relative h-48 border border-gray-200 rounded-xl overflow-hidden bg-gray-900">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Spinner size="xl" variant="white" />
            <span className="text-sm text-gray-300">Uploading...</span>
          </div>
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`{/* centered in a container */}
<div className="flex items-center justify-center py-16">
  <Spinner size="xl" />
</div>

{/* with label */}
<div className="flex flex-col items-center gap-3">
  <Spinner size="xl" />
  <span className="text-sm text-gray-500">Loading data...</span>
</div>

{/* dark background */}
<Spinner size="xl" variant="white" />`}</code>
      </pre>
    </div>
  ),
}
