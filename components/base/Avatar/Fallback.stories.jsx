import { User, Bot, Building2 } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from './Avatar'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Avatar/Fallback',
}

export default meta

export const Fallback = {
  name: 'Fallback',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">AvatarFallback</code> renders
        when the image is absent or fails to load. Pass 1–2 character initials, a Lucide icon, or
        any ReactNode. The background and text color can be customized via{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">className</code>.
      </p>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">initials — 1 or 2 chars</span>
          <div className="flex items-center gap-4 p-5 bg-gray-50 border border-gray-200 rounded-lg">
            <Avatar size="lg">
              <AvatarFallback>R</AvatarFallback>
            </Avatar>
            <Avatar size="lg">
              <AvatarFallback>RC</AvatarFallback>
            </Avatar>
            <Avatar size="lg">
              <AvatarFallback>CA</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">icon fallback</span>
          <div className="flex items-center gap-4 p-5 bg-gray-50 border border-gray-200 rounded-lg">
            <Avatar size="lg">
              <AvatarFallback>
                <User className="size-5" />
              </AvatarFallback>
            </Avatar>
            <Avatar size="lg">
              <AvatarFallback>
                <Bot className="size-5" />
              </AvatarFallback>
            </Avatar>
            <Avatar size="lg" shape="square">
              <AvatarFallback>
                <Building2 className="size-5" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">custom colors via className</span>
          <div className="flex items-center gap-4 p-5 bg-gray-50 border border-gray-200 rounded-lg">
            <Avatar size="lg">
              <AvatarFallback className="bg-violet-100 text-violet-700">RC</AvatarFallback>
            </Avatar>
            <Avatar size="lg">
              <AvatarFallback className="bg-blue-100 text-blue-700">AB</AvatarFallback>
            </Avatar>
            <Avatar size="lg">
              <AvatarFallback className="bg-emerald-100 text-emerald-700">CD</AvatarFallback>
            </Avatar>
            <Avatar size="lg">
              <AvatarFallback className="bg-amber-100 text-amber-700">EF</AvatarFallback>
            </Avatar>
            <Avatar size="lg">
              <AvatarFallback className="bg-rose-100 text-rose-700">GH</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">broken image → falls back automatically</span>
          <div className="flex items-center gap-4 p-5 bg-gray-50 border border-gray-200 rounded-lg">
            <Avatar size="lg">
              <AvatarImage src="https://broken.example/avatar.jpg" alt="Broken" />
              <AvatarFallback>RC</AvatarFallback>
            </Avatar>
            <Avatar size="lg">
              <AvatarImage src="https://broken.example/avatar2.jpg" alt="Broken" />
              <AvatarFallback className="bg-violet-100 text-violet-700">AB</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`{/* Initials */}
<Avatar size="lg">
  <AvatarFallback>RC</AvatarFallback>
</Avatar>

{/* Icon */}
<Avatar size="lg">
  <AvatarFallback><User className="size-5" /></AvatarFallback>
</Avatar>

{/* Custom color */}
<Avatar size="lg">
  <AvatarFallback className="bg-violet-100 text-violet-700">
    RC
  </AvatarFallback>
</Avatar>

{/* Auto-fallback on broken image */}
<Avatar size="lg">
  <AvatarImage src="/broken.jpg" alt="User" />
  <AvatarFallback>RC</AvatarFallback>
</Avatar>`}</code>
      </pre>
    </div>
  ),
}
