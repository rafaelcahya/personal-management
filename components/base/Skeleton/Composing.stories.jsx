import { Skeleton, SkeletonAvatar, SkeletonBadge, SkeletonButton, SkeletonText } from './Skeleton'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Skeleton/Composing',
}

export default meta

export const Composing = {
  name: 'Composing',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        Mix base <code className="font-mono bg-gray-100 px-1 rounded text-xs">Skeleton</code> and
        presets to replicate real UI layouts. Replace the skeleton with the real component once data
        loads.
      </p>

      {/* List item */}
      <div className="flex flex-col gap-3">
        <span className="text-xs text-gray-400">list item</span>
        <div className="flex flex-col gap-2 p-4 bg-white border border-gray-200 rounded-xl">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <SkeletonAvatar size="default" animation="pulse" />
              <div className="flex flex-col gap-1.5 flex-1">
                <Skeleton animation="pulse" className="h-3.5 rounded w-32" />
                <Skeleton animation="pulse" className="h-3 rounded w-48" />
              </div>
              <SkeletonBadge animation="pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Table rows */}
      <div className="flex flex-col gap-3">
        <span className="text-xs text-gray-400">table rows</span>
        <div className="flex flex-col gap-0 overflow-hidden border border-gray-200 rounded-xl bg-white">
          <div className="grid grid-cols-4 gap-4 px-4 py-2 border-b border-gray-100 bg-gray-50">
            {['Ticker', 'Price', 'Shares', 'P&L'].map((h) => (
              <span
                key={h}
                className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide"
              >
                {h}
              </span>
            ))}
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="grid grid-cols-4 gap-4 px-4 py-3 border-b border-gray-100 last:border-0"
            >
              <Skeleton animation="wave" className="h-3.5 w-12 rounded" />
              <Skeleton animation="wave" className="h-3.5 w-16 rounded" />
              <Skeleton animation="wave" className="h-3.5 w-10 rounded" />
              <Skeleton animation="wave" className="h-3.5 w-14 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Profile header */}
      <div className="flex flex-col gap-3">
        <span className="text-xs text-gray-400">profile header</span>
        <div className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-xl">
          <SkeletonAvatar size="xl" animation="pulse" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton animation="pulse" className="h-5 w-40 rounded" />
            <Skeleton animation="pulse" className="h-3.5 w-56 rounded" />
            <div className="flex gap-2 mt-1">
              <SkeletonBadge animation="pulse" />
              <SkeletonBadge animation="pulse" />
            </div>
          </div>
          <SkeletonButton size="sm" animation="pulse" />
        </div>
      </div>

      {/* Stats row */}
      <div className="flex flex-col gap-3">
        <span className="text-xs text-gray-400">stats row</span>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex flex-col gap-2 p-4 bg-white border border-gray-200 rounded-xl"
            >
              <Skeleton animation="wave" className="h-3 w-20 rounded" />
              <Skeleton animation="wave" className="h-7 w-28 rounded" />
              <Skeleton animation="wave" className="h-3 w-16 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-3">
        <span className="text-xs text-gray-400">form fields</span>
        <div className="flex flex-col gap-4 p-5 bg-white border border-gray-200 rounded-xl">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <Skeleton animation="pulse" className="h-3.5 w-24 rounded" />
              <Skeleton animation="pulse" className="h-9 w-full rounded-lg" />
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <SkeletonButton size="default" animation="pulse" />
          </div>
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`{/* List item */}
<div className="flex items-center gap-3">
  <SkeletonAvatar size="default" />
  <div className="flex flex-col gap-1.5 flex-1">
    <Skeleton className="h-3.5 rounded w-32" />
    <Skeleton className="h-3 rounded w-48" />
  </div>
  <SkeletonBadge />
</div>

{/* Table row */}
<div className="grid grid-cols-4 gap-4">
  <Skeleton className="h-3.5 w-12 rounded" animation="wave" />
  <Skeleton className="h-3.5 w-16 rounded" animation="wave" />
  <Skeleton className="h-3.5 w-10 rounded" animation="wave" />
  <Skeleton className="h-3.5 w-14 rounded" animation="wave" />
</div>

{/* Stats card */}
<div className="flex flex-col gap-2 p-4 border rounded-xl">
  <Skeleton className="h-3 w-20 rounded" />
  <Skeleton className="h-7 w-28 rounded" />
  <Skeleton className="h-3 w-16 rounded" />
</div>`}</code>
      </pre>
    </div>
  ),
}
