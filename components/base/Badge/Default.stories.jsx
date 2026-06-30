import { Badge } from './Badge'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Badge/Default',
}

export default meta

export const Default = {
  name: 'Default',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Badge has four variants:{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">default</code>,{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">secondary</code>,{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">destructive</code>, and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">outline</code>. Each conveys a
        different level of emphasis.
      </p>

      <div className="flex flex-col gap-5 w-full max-w-2xl">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">default</span>
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">Active</Badge>
            <Badge variant="default">Published</Badge>
            <Badge variant="default">New</Badge>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">secondary</span>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Draft</Badge>
            <Badge variant="secondary">Archived</Badge>
            <Badge variant="secondary">Beta</Badge>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">destructive</span>
          <div className="flex flex-wrap gap-2">
            <Badge variant="destructive">Error</Badge>
            <Badge variant="destructive">Failed</Badge>
            <Badge variant="destructive">Expired</Badge>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">outline</span>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Pending</Badge>
            <Badge variant="outline">Review</Badge>
            <Badge variant="outline">Optional</Badge>
          </div>
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Badge variant="default">Active</Badge>
<Badge variant="secondary">Draft</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Pending</Badge>`}</code>
      </pre>
    </div>
  ),
}
