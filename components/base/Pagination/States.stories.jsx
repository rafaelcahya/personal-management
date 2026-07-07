import Pagination from './Pagination'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Pagination/States' }
export default meta

export const States = {
  name: 'States',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Pagination automatically disables Prev on the first page, Next on the last page, and renders
        nothing when there is only one page.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-2xl">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">mid-page — both buttons enabled</span>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Pagination page={4} totalPages={8} total={75} onPrev={() => {}} onNext={() => {}} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">first page — Prev disabled</span>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Pagination page={1} totalPages={8} total={75} onPrev={() => {}} onNext={() => {}} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">last page — Next disabled</span>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Pagination page={8} totalPages={8} total={75} onPrev={() => {}} onNext={() => {}} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">
            single page — renders nothing (totalPages = 1)
          </span>
          <div className="border border-dashed border-gray-200 rounded-lg px-4 py-3 bg-gray-50">
            <p className="text-xs text-gray-400 italic mb-1">Nothing renders below:</p>
            <Pagination page={1} totalPages={1} total={6} onPrev={() => {}} onNext={() => {}} />
          </div>
        </div>
      </div>
    </div>
  ),
}
