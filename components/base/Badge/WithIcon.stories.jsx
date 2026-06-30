import { Star, X, Bell, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { Badge } from './Badge'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Badge/With Icon',
}

export default meta

export const WithIcon = {
  name: 'With Icon',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Place an icon inside the badge alongside the label. The badge base styles automatically set{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">[&gt;svg]:size-3</code> and a{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">gap-1</code> between elements.
      </p>

      <div className="flex flex-col gap-5 w-full max-w-2xl">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">icon left</span>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default">
              <CheckCircle2 />
              Active
            </Badge>
            <Badge variant="secondary">
              <Clock />
              Pending
            </Badge>
            <Badge variant="destructive">
              <AlertCircle />
              Failed
            </Badge>
            <Badge variant="outline">
              <Bell />
              Subscribed
            </Badge>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">icon right</span>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default">
              Active
              <CheckCircle2 />
            </Badge>
            <Badge variant="secondary">
              Saved
              <Star />
            </Badge>
            <Badge variant="destructive">
              Remove
              <X />
            </Badge>
            <Badge variant="outline">
              Close
              <X />
            </Badge>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">icon left — larger sizes</span>
          <div className="flex flex-wrap items-center gap-2">
            <Badge size="lg" variant="default">
              <CheckCircle2 />
              Active
            </Badge>
            <Badge size="lg" variant="secondary">
              <Clock />
              Pending
            </Badge>
            <Badge size="xl" variant="default">
              <CheckCircle2 />
              Active
            </Badge>
            <Badge size="xl" variant="secondary">
              <Clock />
              Pending
            </Badge>
          </div>
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Icon left */}
<Badge variant="default">
  <CheckCircle2 />
  Active
</Badge>

{/* Icon right */}
<Badge variant="secondary">
  Saved
  <Star />
</Badge>`}</code>
      </pre>
    </div>
  ),
}
