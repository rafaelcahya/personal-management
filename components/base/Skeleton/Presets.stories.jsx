import {
  SkeletonText,
  SkeletonAvatar,
  SkeletonBadge,
  SkeletonButton,
  SkeletonCard,
} from './Skeleton'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Skeleton/Presets',
}

export default meta

export const Presets = {
  name: 'Presets',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        Ready-made preset helpers built on top of the base{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">Skeleton</code>. All accept an{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">animation</code> prop.
      </p>

      {/* SkeletonText */}
      <div className="flex flex-col gap-3">
        <span className="text-xs text-gray-400 font-mono">SkeletonText</span>
        <p className="text-xs text-gray-500">
          Stacked text lines. Last line is 60% of{' '}
          <code className="font-mono bg-gray-100 px-1 rounded">width</code> to mimic natural
          paragraph endings.
        </p>
        <div className="flex flex-col gap-5 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-gray-400">lines=3 (default)</span>
            <SkeletonText lines={3} />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-gray-400">lines=2 width=&quot;75%&quot;</span>
            <SkeletonText lines={2} width="75%" />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-gray-400">lines=1 (single line — no narrowing)</span>
            <SkeletonText lines={1} width="60%" />
          </div>
        </div>
      </div>

      {/* SkeletonAvatar */}
      <div className="flex flex-col gap-3">
        <span className="text-xs text-gray-400 font-mono">SkeletonAvatar</span>
        <p className="text-xs text-gray-500">
          Circular avatar. Four sizes: sm / default / lg / xl.
        </p>
        <div className="flex items-end gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          {['sm', 'default', 'lg', 'xl'].map((size) => (
            <div key={size} className="flex flex-col items-center gap-1.5">
              <SkeletonAvatar size={size} />
              <span className="text-[10px] text-gray-400">{size}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SkeletonBadge */}
      <div className="flex flex-col gap-3">
        <span className="text-xs text-gray-400 font-mono">SkeletonBadge</span>
        <p className="text-xs text-gray-500">Narrow pill-shaped placeholder for badges and tags.</p>
        <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <SkeletonBadge />
          <SkeletonBadge />
          <SkeletonBadge />
        </div>
      </div>

      {/* SkeletonButton */}
      <div className="flex flex-col gap-3">
        <span className="text-xs text-gray-400 font-mono">SkeletonButton</span>
        <p className="text-xs text-gray-500">
          Button-proportioned placeholder. Three sizes matching Button.
        </p>
        <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          {['sm', 'default', 'lg'].map((size) => (
            <div key={size} className="flex flex-col items-center gap-1.5">
              <SkeletonButton size={size} />
              <span className="text-[10px] text-gray-400">{size}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SkeletonCard */}
      <div className="flex flex-col gap-3">
        <span className="text-xs text-gray-400 font-mono">SkeletonCard</span>
        <p className="text-xs text-gray-500">
          Ready-made card: avatar + two header lines + body text. Configure body line count via{' '}
          <code className="font-mono bg-gray-100 px-1 rounded">lines</code>.
        </p>
        <div className="flex flex-col gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-gray-400">lines=3 (default)</span>
            <SkeletonCard lines={3} />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-gray-400">lines=2</span>
            <SkeletonCard lines={2} />
          </div>
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`<SkeletonText lines={3} width="75%" animation="wave" />

<SkeletonAvatar size="lg" />

<SkeletonBadge />

<SkeletonButton size="default" />

<SkeletonCard lines={3} animation="pulse" />`}</code>
      </pre>
    </div>
  ),
}
