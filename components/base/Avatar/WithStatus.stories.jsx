import { Avatar, AvatarImage, AvatarFallback, AvatarStatus } from './Avatar'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Avatar/With Status',
}

export default meta

const statuses = [
  { value: 'online', label: 'Online', color: 'green' },
  { value: 'offline', label: 'Offline', color: 'gray' },
  { value: 'busy', label: 'Busy', color: 'red' },
  { value: 'away', label: 'Away', color: 'amber' },
]

export const WithStatus = {
  name: 'With Status',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        Add <code className="font-mono bg-gray-100 px-1 rounded text-xs">AvatarStatus</code> as a
        child of <code className="font-mono bg-gray-100 px-1 rounded text-xs">Avatar</code>. The dot
        positions itself at bottom-right and scales with the avatar size.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">all statuses</span>
        <div className="flex items-end gap-6 p-5 bg-gray-50 border border-gray-200 rounded-lg flex-wrap">
          {statuses.map(({ value, label }, i) => (
            <div key={value} className="flex flex-col items-center gap-2">
              <Avatar size="lg">
                <AvatarImage src={`https://i.pravatar.cc/150?img=${i + 3}`} alt={label} />
                <AvatarFallback>{label.slice(0, 2).toUpperCase()}</AvatarFallback>
                <AvatarStatus status={value} />
              </Avatar>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">status scales with avatar size</span>
        <div className="flex items-end gap-5 p-5 bg-gray-50 border border-gray-200 rounded-lg flex-wrap">
          {['xs', 'sm', 'default', 'lg', 'xl', '2xl'].map((size) => (
            <Avatar key={size} size={size}>
              <AvatarFallback>RC</AvatarFallback>
              <AvatarStatus status="online" />
            </Avatar>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">status with square shape</span>
        <div className="flex items-center gap-4 p-5 bg-gray-50 border border-gray-200 rounded-lg">
          {statuses.map(({ value, label }) => (
            <Avatar key={value} size="lg" shape="square">
              <AvatarFallback>{label.slice(0, 2).toUpperCase()}</AvatarFallback>
              <AvatarStatus status={value} />
            </Avatar>
          ))}
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`{/* status: "online" | "offline" | "busy" | "away" */}
<Avatar size="default">
  <AvatarImage src="/avatar.jpg" alt="User" />
  <AvatarFallback>RC</AvatarFallback>
  <AvatarStatus status="online" />
</Avatar>

<Avatar size="default">
  <AvatarFallback>RC</AvatarFallback>
  <AvatarStatus status="busy" />
</Avatar>`}</code>
      </pre>
    </div>
  ),
}
