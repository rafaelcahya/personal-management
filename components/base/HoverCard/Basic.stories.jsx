import { HoverCard, HoverCardTrigger, HoverCardContent } from './HoverCard'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'HoverCard/Basic',
}

export default meta

const triggerClass =
  'inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors cursor-default'

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Hover over the trigger to open the card. The panel stays open when the mouse moves into it —
        use <code className="font-mono bg-gray-100 px-1 rounded text-xs">openDelay</code> and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">closeDelay</code> to control
        timing.
      </p>

      <div className="flex flex-col gap-5 w-full max-w-2xl">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">button trigger</span>
          <div className="flex items-center gap-3 py-6">
            <HoverCard>
              <HoverCardTrigger asChild>
                <button type="button" className={triggerClass}>
                  Hover me
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="p-3 w-48">
                <p className="text-sm text-gray-700">
                  This is a HoverCard with default 300ms open delay.
                </p>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">text trigger (span)</span>
          <div className="flex items-center gap-3 py-6">
            <HoverCard>
              <HoverCardTrigger asChild>
                <span className="text-sm underline decoration-dotted cursor-default text-slate-700">
                  BBCA
                </span>
              </HoverCardTrigger>
              <HoverCardContent side="bottom" align="start" className="p-3 w-48">
                <p className="text-sm font-medium text-gray-900">Bank BCA</p>
                <p className="text-xs text-gray-500 mt-1">Ticker preview on hover</p>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">no delay (instant)</span>
          <div className="flex items-center gap-3 py-6">
            <HoverCard openDelay={0}>
              <HoverCardTrigger asChild>
                <button type="button" className={triggerClass}>
                  Instant
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="p-3 w-48">
                <p className="text-sm text-gray-700">Opens immediately — openDelay=0</p>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">long delay (700ms open, 400ms close)</span>
          <div className="flex items-center gap-3 py-6">
            <HoverCard openDelay={700} closeDelay={400}>
              <HoverCardTrigger asChild>
                <button type="button" className={triggerClass}>
                  Slow
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="p-3 w-48">
                <p className="text-sm text-gray-700">openDelay=700 — closeDelay=400</p>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">interactive content (link + button inside)</span>
          <div className="flex items-center gap-3 py-6">
            <HoverCard openDelay={0}>
              <HoverCardTrigger asChild>
                <button type="button" className={triggerClass}>
                  Interactive
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="p-3 w-52">
                <p className="text-sm text-gray-700 mb-2">
                  Move mouse into the panel — it stays open.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="text-xs px-2 py-1 rounded border border-slate-200 hover:bg-gray-50 transition-colors"
                  >
                    Action
                  </button>
                  <a
                    href="#"
                    className="text-xs px-2 py-1 rounded text-violet-600 hover:underline"
                    onClick={(e) => e.preventDefault()}
                  >
                    Link
                  </a>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<HoverCard openDelay={300} closeDelay={150}>
  <HoverCardTrigger asChild>
    <button type="button">Hover me</button>
  </HoverCardTrigger>
  <HoverCardContent className="p-3 w-48">
    <p>Card content</p>
  </HoverCardContent>
</HoverCard>`}</code>
      </pre>
    </div>
  ),
}
