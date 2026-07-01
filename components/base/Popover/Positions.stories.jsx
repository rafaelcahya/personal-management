import { Popover, PopoverTrigger, PopoverContent } from './Popover'
import Button from '@/components/base/Button/Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Popover/Positions' }
export default meta

const sides = ['top', 'right', 'bottom', 'left']
const aligns = ['start', 'center', 'end']

export const Positions = {
  name: 'Positions',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-2xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">side</code> controls which side
        of the trigger the panel appears on.{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">align</code> controls how it is
        aligned along that axis. The panel flips automatically when it would overflow the viewport.
      </p>

      <div className="flex flex-col gap-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Side</p>
        <div className="flex gap-3 flex-wrap justify-center py-8">
          {sides.map((side) => (
            <Popover key={side}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  {side}
                </Button>
              </PopoverTrigger>
              <PopoverContent side={side} className="px-3 py-2">
                <p className="text-xs text-gray-600 whitespace-nowrap">side=&quot;{side}&quot;</p>
              </PopoverContent>
            </Popover>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Align (side=&quot;bottom&quot;)
        </p>
        <div className="flex gap-3 flex-wrap py-8">
          {aligns.map((align) => (
            <Popover key={align}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  {align}
                </Button>
              </PopoverTrigger>
              <PopoverContent align={align} className="w-40 px-3 py-2">
                <p className="text-xs text-gray-600">align=&quot;{align}&quot;</p>
              </PopoverContent>
            </Popover>
          ))}
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`{/* side: top | right | bottom (default) | left */}
<PopoverContent side="top" align="start" sideOffset={6}>
  ...
</PopoverContent>`}</code>
      </pre>
    </div>
  ),
}
