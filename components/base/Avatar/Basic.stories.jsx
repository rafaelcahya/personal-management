import { User } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback, AvatarStatus } from './Avatar'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Avatar/Basic',
}

export default meta

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        Compose <code className="font-mono bg-gray-100 px-1 rounded text-xs">Avatar</code>,{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">AvatarImage</code>,{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">AvatarFallback</code>, and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">AvatarStatus</code> together.
        AvatarFallback shows when the image is absent or fails to load.
      </p>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">image — loads from URL</span>
          <div className="flex items-center gap-4">
            <Avatar size="default">
              <AvatarImage src="https://i.pravatar.cc/150?img=12" alt="User" />
              <AvatarFallback>RC</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">initials fallback (no image)</span>
          <div className="flex items-center gap-4">
            <Avatar size="default">
              <AvatarFallback>CA</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">icon fallback</span>
          <div className="flex items-center gap-4">
            <Avatar size="default">
              <AvatarFallback>
                <User className="size-5" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">broken image → falls back to initials</span>
          <div className="flex items-center gap-4">
            <Avatar size="default">
              <AvatarImage src="https://broken-url.example/avatar.jpg" alt="Broken" />
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">with status dot</span>
          <div className="flex items-center gap-4">
            <Avatar size="default">
              <AvatarImage src="https://i.pravatar.cc/150?img=5" alt="User" />
              <AvatarFallback>RC</AvatarFallback>
              <AvatarStatus status="online" />
            </Avatar>
          </div>
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`{/* Image with initials fallback */}
<Avatar size="default">
  <AvatarImage src="/avatar.jpg" alt="Cahya" />
  <AvatarFallback>CA</AvatarFallback>
</Avatar>

{/* Initials only */}
<Avatar size="default">
  <AvatarFallback>CA</AvatarFallback>
</Avatar>

{/* Icon fallback */}
<Avatar size="default">
  <AvatarFallback><User className="size-5" /></AvatarFallback>
</Avatar>

{/* With status */}
<Avatar size="default">
  <AvatarFallback>CA</AvatarFallback>
  <AvatarStatus status="online" />
</Avatar>`}</code>
      </pre>
    </div>
  ),
}
