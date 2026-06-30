import { Badge } from './Badge'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Badge/As Child',
}

export default meta

export const AsChild = {
  name: 'As Child',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">asChild</code> to render
        the badge as a different element — useful for making a badge behave as a link or button
        while keeping badge styling. Uses Radix UI's{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">Slot</code> under the hood.
      </p>

      <div className="flex flex-col gap-5 w-full max-w-2xl">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">as anchor link</span>
          <div className="flex flex-wrap items-center gap-2">
            <Badge asChild variant="default">
              <a href="#">View Details</a>
            </Badge>
            <Badge asChild variant="secondary">
              <a href="#">Learn More</a>
            </Badge>
            <Badge asChild variant="outline">
              <a href="#">See All</a>
            </Badge>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">as button</span>
          <div className="flex flex-wrap items-center gap-2">
            <Badge asChild variant="default">
              <button type="button" onClick={() => alert('clicked')}>
                Click Me
              </button>
            </Badge>
            <Badge asChild variant="destructive">
              <button type="button" onClick={() => alert('removed')}>
                Remove
              </button>
            </Badge>
          </div>
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Renders as <a> tag with badge styling */}
<Badge asChild variant="default">
  <a href="/details">View Details</a>
</Badge>

{/* Renders as <button> with badge styling */}
<Badge asChild variant="destructive">
  <button type="button" onClick={handleRemove}>Remove</button>
</Badge>`}</code>
      </pre>
    </div>
  ),
}
