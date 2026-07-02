import { Skeleton, SkeletonCard } from './Skeleton'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Skeleton/Animation',
}

export default meta

const animations = [
  {
    value: 'pulse',
    label: 'pulse',
    desc: 'Opacity fades in and out. Subtle, works on any background.',
  },
  {
    value: 'wave',
    label: 'wave',
    desc: 'Shimmer sweeps left to right. More energetic; signals network activity.',
  },
  {
    value: 'none',
    label: 'none',
    desc: 'Static placeholder — no animation. Use when motion should be reduced.',
  },
]

export const Animation = {
  name: 'Animation',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">animation</code> prop
        accepts <code className="font-mono bg-gray-100 px-1 rounded text-xs">pulse</code>,{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">wave</code>, or{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">none</code>. All preset
        components inherit it.
      </p>

      {animations.map(({ value, label, desc }) => (
        <div key={value} className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">
            animation=&quot;{label}&quot; — {desc}
          </span>
          <div className="flex flex-col gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Skeleton animation={value} className="size-8 rounded-full shrink-0" />
              <div className="flex flex-col gap-2 flex-1">
                <Skeleton animation={value} className="h-3.5 w-40 rounded" />
                <Skeleton animation={value} className="h-3 w-28 rounded" />
              </div>
            </div>
            <Skeleton animation={value} className="h-3 w-full rounded" />
            <Skeleton animation={value} className="h-3 w-4/5 rounded" />
            <Skeleton animation={value} className="h-3 w-3/5 rounded" />
          </div>
        </div>
      ))}

      <div className="flex flex-col gap-4">
        <span className="text-xs text-gray-400">SkeletonCard — all three animations</span>
        <div className="grid grid-cols-1 gap-4">
          {animations.map(({ value, label }) => (
            <div key={value} className="flex flex-col gap-1.5">
              <span className="text-[10px] text-gray-400 font-mono">{label}</span>
              <SkeletonCard animation={value} lines={2} />
            </div>
          ))}
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`{/* pulse (default) */}
<Skeleton animation="pulse" className="h-4 w-48 rounded" />

{/* wave shimmer */}
<Skeleton animation="wave" className="h-4 w-48 rounded" />

{/* no animation */}
<Skeleton animation="none" className="h-4 w-48 rounded" />

{/* presets inherit animation */}
<SkeletonCard animation="wave" />`}</code>
      </pre>
    </div>
  ),
}
