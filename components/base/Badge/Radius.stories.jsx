import { Badge } from './Badge'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Badge/Radius',
}

export default meta

export const Radius = {
  name: 'Radius',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">radius</code> prop controls
        the border-radius of the badge. Ranges from{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">none</code> to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">full</code>. Default is{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">full</code> (pill shape).
      </p>

      <div className="flex flex-col gap-5 w-full max-w-2xl">
        {[
          { radius: 'none', label: 'none — rounded-none' },
          { radius: 'xs', label: 'xs — rounded-sm (2px)' },
          { radius: 'sm', label: 'sm — rounded (4px)' },
          { radius: 'base', label: 'base — rounded-md (6px)' },
          { radius: 'md', label: 'md — rounded-lg (8px)' },
          { radius: 'lg', label: 'lg — rounded-xl (12px)' },
          { radius: 'full', label: 'full — rounded-full (default)' },
        ].map(({ radius, label }) => (
          <div key={radius} className="flex flex-col gap-1.5">
            <span className="text-xs text-gray-400">{label}</span>
            <div className="flex flex-wrap items-center gap-2">
              <Badge radius={radius} variant="default">
                Active
              </Badge>
              <Badge radius={radius} variant="secondary">
                Draft
              </Badge>
              <Badge radius={radius} variant="destructive">
                Error
              </Badge>
              <Badge radius={radius} variant="outline">
                Pending
              </Badge>
            </div>
          </div>
        ))}
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Badge radius="none">Active</Badge>
<Badge radius="xs">Active</Badge>
<Badge radius="sm">Active</Badge>
<Badge radius="base">Active</Badge>
<Badge radius="md">Active</Badge>
<Badge radius="lg">Active</Badge>
<Badge radius="full">Active</Badge>  {/* default */}`}</code>
      </pre>
    </div>
  ),
}
