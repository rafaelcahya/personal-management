import { Avatar, AvatarImage, AvatarFallback } from './Avatar'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Avatar/Sizes',
}

export default meta

const sizes = ['xs', 'sm', 'default', 'lg', 'xl', '2xl']
const pxMap = { xs: '24px', sm: '32px', default: '40px', lg: '48px', xl: '64px', '2xl': '80px' }

export const Sizes = {
  name: 'Sizes',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        Six sizes controlled by the{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">size</code> prop on{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">Avatar</code>. AvatarFallback
        text and status dot scale automatically.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">initials — all sizes</span>
        <div className="flex items-end gap-4 p-5 bg-gray-50 border border-gray-200 rounded-lg flex-wrap">
          {sizes.map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <Avatar size={size}>
                <AvatarFallback>RC</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="text-[10px] font-mono text-gray-500">{size}</p>
                <p className="text-[10px] text-gray-400">{pxMap[size]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">with image — all sizes</span>
        <div className="flex items-end gap-4 p-5 bg-gray-50 border border-gray-200 rounded-lg flex-wrap">
          {sizes.map((size, i) => (
            <Avatar key={size} size={size}>
              <AvatarImage src={`https://i.pravatar.cc/150?img=${i + 1}`} alt={size} />
              <AvatarFallback>RC</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`{/* size: "xs" (24px) | "sm" (32px) | "default" (40px) */}
{/* size: "lg" (48px) | "xl" (64px) | "2xl" (80px) */}

<Avatar size="xs"><AvatarFallback>RC</AvatarFallback></Avatar>
<Avatar size="sm"><AvatarFallback>RC</AvatarFallback></Avatar>
<Avatar size="default"><AvatarFallback>RC</AvatarFallback></Avatar>
<Avatar size="lg"><AvatarFallback>RC</AvatarFallback></Avatar>
<Avatar size="xl"><AvatarFallback>RC</AvatarFallback></Avatar>
<Avatar size="2xl"><AvatarFallback>RC</AvatarFallback></Avatar>`}</code>
      </pre>
    </div>
  ),
}
