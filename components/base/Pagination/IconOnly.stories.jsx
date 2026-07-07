import Pagination from './Pagination'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Pagination/Icon Only' }
export default meta

const VARIANTS = ['full', 'center', 'left', 'right']

export const IconOnly = {
  name: 'Icon Only',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Add <code className="font-mono bg-gray-100 px-1 rounded text-xs">iconOnly</code> to show
        chevron-only buttons — useful in compact layouts or narrow containers. Works with all
        variants.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-2xl">
        {VARIANTS.map((variant) => (
          <div key={variant} className="flex flex-col gap-1.5">
            <code className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded w-fit">
              {variant}
            </code>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Pagination
                page={4}
                totalPages={8}
                total={75}
                variant={variant}
                iconOnly
                onPrev={() => {}}
                onNext={() => {}}
              />
            </div>
          </div>
        ))}
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Pagination
  page={page}
  totalPages={totalPages}
  total={total}
  iconOnly
  onPrev={handlePrev}
  onNext={handleNext}
/>`}</code>
      </pre>
    </div>
  ),
}
