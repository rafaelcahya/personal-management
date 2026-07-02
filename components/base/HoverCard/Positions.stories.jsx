import { HoverCard, HoverCardTrigger, HoverCardContent } from './HoverCard'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'HoverCard/Positions',
}

export default meta

const sides = ['top', 'right', 'bottom', 'left']
const aligns = ['start', 'center', 'end']

const btnClass =
  'inline-flex items-center justify-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors cursor-default min-w-28'

export const Positions = {
  name: 'Positions',
  render: () => (
    <div className="flex flex-col items-center gap-10 w-full max-w-2xl">
      <p className="text-sm text-gray-500 leading-relaxed text-center">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">side</code> controls which side
        the panel appears on.{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">align</code> controls alignment
        along that axis. The panel flips automatically when it would overflow the viewport.
      </p>

      <div className="flex flex-col gap-4 w-full">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Side</p>
        <div className="flex gap-3 flex-wrap justify-center py-10">
          {sides.map((side) => (
            <HoverCard key={side} openDelay={0}>
              <HoverCardTrigger asChild>
                <button type="button" className={btnClass}>
                  {side}
                </button>
              </HoverCardTrigger>
              <HoverCardContent side={side} className="px-3 py-2">
                <p className="text-xs text-gray-600 whitespace-nowrap">side=&quot;{side}&quot;</p>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Align (side=&quot;bottom&quot;)
        </p>
        <div className="flex gap-3 flex-wrap py-10">
          {aligns.map((align) => (
            <HoverCard key={align} openDelay={0}>
              <HoverCardTrigger asChild>
                <button type="button" className={btnClass}>
                  {align}
                </button>
              </HoverCardTrigger>
              <HoverCardContent align={align} className="w-40 px-3 py-2">
                <p className="text-xs text-gray-600">align=&quot;{align}&quot;</p>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`{/* side: top | right | bottom (default) | left */}
{/* align: start | center (default) | end */}
<HoverCardContent side="top" align="start" sideOffset={8}>
  ...
</HoverCardContent>`}</code>
      </pre>
    </div>
  ),
}
