import { Skeleton } from './Skeleton'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Skeleton/Basic',
}

export default meta

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        The base <code className="font-mono bg-gray-100 px-1 rounded text-xs">Skeleton</code> is a
        plain <code className="font-mono bg-gray-100 px-1 rounded text-xs">div</code> with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">bg-gray-200</code> and
        animation. Shape is controlled entirely via{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">className</code>.
      </p>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">text lines</span>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3.5 w-full rounded" />
            <Skeleton className="h-3.5 w-4/5 rounded" />
            <Skeleton className="h-3.5 w-3/5 rounded" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">heading</span>
          <Skeleton className="h-6 w-48 rounded" />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">avatar</span>
          <Skeleton className="size-10 rounded-full" />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">image / card block</span>
          <Skeleton className="h-36 w-full rounded-xl" />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">table row</span>
          <div className="flex gap-4">
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-4 w-16 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">badge</span>
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">button</span>
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`{/* Text lines */}
<Skeleton className="h-3.5 w-full rounded" />
<Skeleton className="h-3.5 w-4/5 rounded" />

{/* Avatar */}
<Skeleton className="size-10 rounded-full" />

{/* Image block */}
<Skeleton className="h-36 w-full rounded-xl" />

{/* Badge */}
<Skeleton className="h-5 w-14 rounded-full" />

{/* Button */}
<Skeleton className="h-9 w-28 rounded-lg" />`}</code>
      </pre>
    </div>
  ),
}
