import Pagination from './Pagination'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Pagination/Variants' }
export default meta

const VARIANTS = [
  { variant: 'full', desc: 'Prev far left · page info centered · Next far right (default)' },
  { variant: 'center', desc: 'All controls centered' },
  { variant: 'left', desc: 'All controls left-aligned' },
  { variant: 'right', desc: 'All controls right-aligned' },
]

export const Variants = {
  name: 'Variants',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant</code> prop
        controls the alignment of the controls. Default is{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">full</code>.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-2xl">
        {VARIANTS.map(({ variant, desc }) => (
          <div key={variant} className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <code className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">{variant}</code>
              <span className="text-xs text-gray-400">{desc}</span>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Pagination
                page={4}
                totalPages={8}
                total={75}
                variant={variant}
                onPrev={() => {}}
                onNext={() => {}}
              />
            </div>
          </div>
        ))}
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Pagination ... variant="full" />    {/* default */}
<Pagination ... variant="center" />
<Pagination ... variant="left" />
<Pagination ... variant="right" />`}</code>
      </pre>
    </div>
  ),
}
