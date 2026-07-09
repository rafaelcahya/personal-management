import { useState } from 'react'
import Pagination from './Pagination'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Pagination' }
export default meta

export const Docs = {
  name: 'Docs',
  render: () => {
    return (
      <div className="flex flex-col gap-10 w-full max-w-3xl py-6 px-2">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-900">Pagination</h1>
          <p className="text-base text-gray-500 leading-relaxed">
            A standalone pagination bar — Prev / page info / Next — extracted from the table
            pattern. Use it beneath any list or table that paginates server-side.
          </p>
        </div>

        {/* Overview */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Overview</h2>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <PaginationDemo />
          </div>
          <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
            <code>{`import Pagination from '@/components/base/Pagination/Pagination'

const [page, setPage] = useState(1)
const totalPages = 8
const total = 75

<Pagination
  page={page}
  totalPages={totalPages}
  total={total}
  onPrev={() => setPage((p) => Math.max(1, p - 1))}
  onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
/>`}</code>
          </pre>
        </section>

        {/* Variants */}
        <section className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Variants</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            The <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant</code> prop
            controls the layout of the controls. Default is{' '}
            <code className="font-mono bg-gray-100 px-1 rounded text-xs">full</code>.
          </p>

          {[
            {
              variant: 'full',
              label: 'full',
              desc: 'Prev far left · page info centered · Next far right (default)',
            },
            { variant: 'center', label: 'center', desc: 'All controls centered' },
            { variant: 'left', label: 'left', desc: 'All controls left-aligned' },
            { variant: 'right', label: 'right', desc: 'All controls right-aligned' },
          ].map(({ variant, label, desc }) => (
            <div key={variant} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <code className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">{label}</code>
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

          <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
            <code>{`{/* full — Prev far left, page info centered, Next far right (default) */}
<Pagination ... variant="full" />

{/* center — all controls centered */}
<Pagination ... variant="center" />

{/* left — all controls left-aligned */}
<Pagination ... variant="left" />

{/* right — all controls right-aligned */}
<Pagination ... variant="right" />`}</code>
          </pre>
        </section>

        {/* Icon Only */}
        <section className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Icon Only</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Add <code className="font-mono bg-gray-100 px-1 rounded text-xs">iconOnly</code> to show
            chevron-only buttons — useful in compact layouts or narrow containers.
          </p>

          {[
            { variant: 'full', label: 'full + iconOnly' },
            { variant: 'center', label: 'center + iconOnly' },
            { variant: 'right', label: 'right + iconOnly' },
          ].map(({ variant, label }) => (
            <div key={variant} className="flex flex-col gap-2">
              <code className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded w-fit">
                {label}
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

          <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
            <code>{`<Pagination
  page={page}
  totalPages={totalPages}
  total={total}
  iconOnly
  onPrev={handlePrev}
  onNext={handleNext}
/>`}</code>
          </pre>
        </section>

        {/* States */}
        <section className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">States</h2>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <code className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                Default (mid-page)
              </code>
              <span className="text-xs text-gray-400">both Prev and Next enabled</span>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Pagination page={4} totalPages={8} total={75} onPrev={() => {}} onNext={() => {}} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <code className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                First page
              </code>
              <span className="text-xs text-gray-400">Prev disabled</span>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Pagination page={1} totalPages={8} total={75} onPrev={() => {}} onNext={() => {}} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <code className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">Last page</code>
              <span className="text-xs text-gray-400">Next disabled</span>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Pagination page={8} totalPages={8} total={75} onPrev={() => {}} onNext={() => {}} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <code className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                Single page
              </code>
              <span className="text-xs text-gray-400">totalPages &lt;= 1 → renders nothing</span>
            </div>
            <div className="border border-dashed border-gray-200 rounded-lg px-4 py-3 bg-gray-50">
              <p className="text-xs text-gray-400 italic">
                Nothing renders below this line when totalPages = 1
              </p>
              <Pagination page={1} totalPages={1} total={6} onPrev={() => {}} onNext={() => {}} />
            </div>
            <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
              <code>{`{/* Returns null when totalPages <= 1 — safe to always render */}
<Pagination page={1} totalPages={1} total={6} onPrev={...} onNext={...} />
{/* → renders nothing */}`}</code>
            </pre>
          </div>
        </section>

        {/* Usage */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Usage</h2>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">With a server-side table</span>
            <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
              <code>{`const [page, setPage] = useState(1)
const { data, total, totalPages } = useFetch({ page })

return (
  <>
    <Table>...</Table>
    <Pagination
      page={page}
      totalPages={totalPages}
      total={total}
      onPrev={() => setPage((p) => Math.max(1, p - 1))}
      onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
    />
  </>
)`}</code>
            </pre>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">
              Shared between desktop table and mobile card list
            </span>
            <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
              <code>{`{/* Mobile cards */}
<div className="sm:hidden">
  {items.map(...)}
</div>

{/* Desktop table */}
<div className="hidden sm:block">
  <Table>...</Table>
</div>

{/* Pagination — outside both wrappers, always visible */}
<Pagination
  page={page}
  totalPages={totalPages}
  total={total}
  onPrev={handlePrev}
  onNext={handleNext}
/>`}</code>
            </pre>
          </div>
        </section>

        {/* When to use */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">When to use</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3 p-4 rounded-xl border border-violet-200 bg-violet-50">
              <p className="text-sm font-semibold text-gray-800">Use Pagination when…</p>
              <ul className="flex flex-col gap-1.5 text-xs text-gray-600 leading-relaxed list-none">
                {[
                  'Data is fetched page-by-page from a server (server-side pagination).',
                  'The table switches to a card layout on mobile — place Pagination outside both wrappers so it appears on all viewports.',
                  'You need a touch-friendly prev/next bar with a 44px minimum tap target.',
                ].map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-violet-500 shrink-0">·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50">
              <p className="text-sm font-semibold text-gray-800">Consider an alternative when…</p>
              <ul className="flex flex-col gap-1.5 text-xs text-gray-600 leading-relaxed list-none">
                {[
                  'All data is already in memory — use DataTable with the pagination prop instead.',
                  'The list is short enough to show all items at once (< 20 rows).',
                  'You need page-number buttons or jump-to-page input — this component only supports prev/next.',
                ].map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-slate-400 shrink-0">·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Dos & Don'ts */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Dos & Don'ts</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="size-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                  ✓
                </span>
                <span className="text-sm font-semibold text-green-700">Do</span>
              </div>
              <div className="space-y-3">
                <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-800">
                    Place <code className="font-mono bg-green-100 px-1 rounded">Pagination</code>{' '}
                    outside any{' '}
                    <code className="font-mono bg-green-100 px-1 rounded">hidden sm:block</code> or{' '}
                    <code className="font-mono bg-green-100 px-1 rounded">sm:hidden</code> wrappers
                    so it renders on all screen sizes.
                  </p>
                </div>
                <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-800">
                    Pass all five required props every time:{' '}
                    <code className="font-mono bg-green-100 px-1 rounded">page</code>,{' '}
                    <code className="font-mono bg-green-100 px-1 rounded">totalPages</code>,{' '}
                    <code className="font-mono bg-green-100 px-1 rounded">total</code>,{' '}
                    <code className="font-mono bg-green-100 px-1 rounded">onPrev</code>, and{' '}
                    <code className="font-mono bg-green-100 px-1 rounded">onNext</code>.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="size-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
                  ✕
                </span>
                <span className="text-sm font-semibold text-red-700">Don't</span>
              </div>
              <div className="space-y-3">
                <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                  <p className="text-xs text-red-800">
                    Don't add a guard like{' '}
                    <code className="font-mono bg-red-100 px-1 rounded">
                      {'{totalPages > 1 && <Pagination />}'}
                    </code>{' '}
                    — the component already returns{' '}
                    <code className="font-mono bg-red-100 px-1 rounded">null</code> when{' '}
                    <code className="font-mono bg-red-100 px-1 rounded">totalPages &lt;= 1</code>.
                  </p>
                </div>
                <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                  <p className="text-xs text-red-800">
                    Don't manage disabled state yourself — pass the real{' '}
                    <code className="font-mono bg-red-100 px-1 rounded">page</code> and{' '}
                    <code className="font-mono bg-red-100 px-1 rounded">totalPages</code> values and
                    the component handles it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* API Reference */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">API Reference</h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-32">
                  Prop
                </th>
                <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-36">
                  Type
                </th>
                <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-16">
                  Default
                </th>
                <th className="text-left py-2 text-xs uppercase tracking-wide text-gray-500 font-medium">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                ['page', 'number', '—', 'Current page number (1-based).'],
                ['totalPages', 'number', '—', 'Total pages. Returns null when <= 1.'],
                ['total', 'number', '—', 'Total record count shown in the label.'],
                ['onPrev', '() => void', '—', 'Called when Prev button is clicked.'],
                ['onNext', '() => void', '—', 'Called when Next button is clicked.'],
                [
                  'iconOnly',
                  'boolean',
                  'false',
                  'Show chevron-only buttons — hides Prev/Next text.',
                ],
                [
                  'variant',
                  '"full" | "center" | "left" | "right"',
                  '"full"',
                  'Layout of controls. full = Prev far left, page info centered, Next far right. center/left/right = all controls grouped together.',
                ],
                ['id', 'string', '—', 'Optional id on the container div.'],
                ['className', 'string', '—', 'Extra classes merged onto the container.'],
              ].map(([prop, type, def, desc]) => (
                <tr key={prop}>
                  <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">{prop}</td>
                  <td className="py-2.5 pr-4 font-mono text-xs text-gray-500">{type}</td>
                  <td className="py-2.5 pr-4 font-mono text-xs text-gray-400">{def}</td>
                  <td className="py-2.5 text-xs text-gray-600">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    )
  },
}

function PaginationDemo() {
  const [page, setPage] = useState(3)
  const totalPages = 8
  const total = 75
  return (
    <Pagination
      page={page}
      totalPages={totalPages}
      total={total}
      onPrev={() => setPage((p) => Math.max(1, p - 1))}
      onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
    />
  )
}
