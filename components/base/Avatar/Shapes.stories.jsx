import { Avatar, AvatarImage, AvatarFallback } from './Avatar'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Avatar/Shapes',
}

export default meta

export const Shapes = {
  name: 'Shapes',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">shape</code> prop controls
        the border radius. <strong>circle</strong> — fully rounded (default).{' '}
        <strong>square</strong> — rounded-lg, good for brand logos or app avatars.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">shape=&quot;circle&quot; (default)</span>
        <div className="flex items-center gap-4 p-5 bg-gray-50 border border-gray-200 rounded-lg">
          <Avatar size="lg" shape="circle">
            <AvatarImage src="https://i.pravatar.cc/150?img=8" alt="User" />
            <AvatarFallback>RC</AvatarFallback>
          </Avatar>
          <Avatar size="lg" shape="circle">
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <Avatar size="lg" shape="circle">
            <AvatarFallback>CD</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">shape=&quot;square&quot;</span>
        <div className="flex items-center gap-4 p-5 bg-gray-50 border border-gray-200 rounded-lg">
          <Avatar size="lg" shape="square">
            <AvatarImage src="https://i.pravatar.cc/150?img=8" alt="User" />
            <AvatarFallback>RC</AvatarFallback>
          </Avatar>
          <Avatar size="lg" shape="square">
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <Avatar size="lg" shape="square">
            <AvatarFallback>CD</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">both shapes — all sizes</span>
        <div className="flex flex-col gap-4 p-5 bg-gray-50 border border-gray-200 rounded-lg">
          {['circle', 'square'].map((shape) => (
            <div key={shape} className="flex items-end gap-3 flex-wrap">
              <span className="text-[10px] text-gray-400 w-12 shrink-0 font-mono">{shape}</span>
              {['xs', 'sm', 'default', 'lg', 'xl', '2xl'].map((size, i) => (
                <Avatar key={size} size={size} shape={shape}>
                  <AvatarImage src={`https://i.pravatar.cc/150?img=${i + 10}`} alt={size} />
                  <AvatarFallback>RC</AvatarFallback>
                </Avatar>
              ))}
            </div>
          ))}
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`{/* circle (default) */}
<Avatar size="lg" shape="circle">
  <AvatarFallback>RC</AvatarFallback>
</Avatar>

{/* square */}
<Avatar size="lg" shape="square">
  <AvatarFallback>RC</AvatarFallback>
</Avatar>`}</code>
      </pre>
    </div>
  ),
}
