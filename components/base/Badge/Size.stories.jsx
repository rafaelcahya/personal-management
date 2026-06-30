import { Badge } from './Badge'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Badge/Size',
}

export default meta

export const Size = {
  name: 'Size',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">size</code> prop controls
        padding and font size. Ranges from{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">xs</code> to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">xl</code>. Default is{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">md</code>.
      </p>

      <div className="flex flex-col gap-5 w-full max-w-2xl">
        {[
          { size: 'xs', label: 'xs — px-1.5 py-0 text-[10px]' },
          { size: 'sm', label: 'sm — px-2 py-px text-xs' },
          { size: 'md', label: 'md — px-2 py-0.5 text-xs (default)' },
          { size: 'lg', label: 'lg — px-2.5 py-0.5 text-sm' },
          { size: 'xl', label: 'xl — px-3 py-1 text-sm' },
        ].map(({ size, label }) => (
          <div key={size} className="flex flex-col gap-1.5">
            <span className="text-xs text-gray-400">{label}</span>
            <div className="flex flex-wrap items-center gap-2">
              <Badge size={size} variant="default">
                Active
              </Badge>
              <Badge size={size} variant="secondary">
                Draft
              </Badge>
              <Badge size={size} variant="destructive">
                Error
              </Badge>
              <Badge size={size} variant="outline">
                Pending
              </Badge>
            </div>
          </div>
        ))}
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Badge size="xs">Active</Badge>
<Badge size="sm">Active</Badge>
<Badge size="md">Active</Badge>
<Badge size="lg">Active</Badge>
<Badge size="xl">Active</Badge>`}</code>
      </pre>
    </div>
  ),
}
