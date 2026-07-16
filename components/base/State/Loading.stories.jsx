import State from './State'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'State',
}

export default meta

export const Loading = {
  name: 'Loading',
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-xl py-6 px-2">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-gray-800">Loading variant</h2>
        <p className="text-xs text-gray-500">
          Renders animated skeleton rows while content is being fetched. Use{' '}
          <code className="font-mono bg-gray-100 px-1 rounded">skeletonRows</code> to match the
          number of rows the content will have.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-600">3 rows (default)</span>
          <div className="border border-gray-200 rounded-xl">
            <State variant="loading" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-600">5 rows</span>
          <div className="border border-gray-200 rounded-xl">
            <State variant="loading" skeletonRows={5} />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-600">1 row</span>
          <div className="border border-gray-200 rounded-xl">
            <State variant="loading" skeletonRows={1} />
          </div>
        </div>
      </div>
    </div>
  ),
}
