import { useState } from 'react'
import Pagination from './Pagination'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Pagination/Default' }
export default meta

export const Default = {
  name: 'Default',
  render: () => {
    const [page, setPage] = useState(3)
    const totalPages = 8
    const total = 75
    return (
      <div className="flex flex-col items-center gap-6 w-full">
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
          Standalone pagination bar — Prev / page info / Next. Renders{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">null</code> automatically
          when{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">totalPages &lt;= 1</code>.
        </p>

        <div className="w-full max-w-2xl border border-gray-200 rounded-lg overflow-hidden">
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          />
        </div>

        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
          <code>{`import Pagination from '@/components/base/Pagination/Pagination'

const [page, setPage] = useState(1)

<Pagination
  page={page}
  totalPages={8}
  total={75}
  onPrev={() => setPage((p) => Math.max(1, p - 1))}
  onNext={() => setPage((p) => Math.min(8, p + 1))}
/>`}</code>
        </pre>
      </div>
    )
  },
}
