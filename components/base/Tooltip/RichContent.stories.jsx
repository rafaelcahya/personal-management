import { Info, TrendingUp, AlertTriangle } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent } from './Tooltip'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Tooltip/Rich Content',
}

export default meta

const BestPractices = ({ items }) => (
  <div className="flex flex-col gap-8 w-full max-w-2xl">
    {items.map(({ heading, cards }) => (
      <div key={heading}>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          {heading}
        </p>
        <div className="flex flex-col gap-3">
          {cards.map(({ title, body }) => (
            <div
              key={title}
              className="flex gap-3 p-4 rounded-lg border border-violet-100 bg-violet-50"
            >
              <span className="mt-0.5 shrink-0 size-4 rounded-full bg-violet-500 flex items-center justify-center text-white text-[10px] font-bold">
                ✓
              </span>
              <div>
                <p className="text-xs font-semibold text-violet-800 mb-0.5">{title}</p>
                <p className="text-xs text-violet-700 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
)

const btnClass =
  'inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors cursor-default'

export const RichContent = {
  name: 'Rich Content',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">TooltipContent</code> accepts
        any ReactNode — icon + text, multi-line paragraphs, or structured key-value layouts. Hover
        each button to preview.
      </p>

      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">icon + text</span>
          <div>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button type="button" className={btnClass}>
                  <Info className="size-4 mr-2" />
                  Help
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex items-center gap-1.5">
                  <Info className="size-3 shrink-0" />
                  Click to open the help center
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">multi-line</span>
          <div>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button type="button" className={btnClass}>
                  Portfolio Value
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-56">
                <div className="flex flex-col gap-1">
                  <span className="font-medium">Total Portfolio Value</span>
                  <span className="opacity-75">
                    Sum of all open positions at current market price, excluding cash balance.
                  </span>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">key-value pairs</span>
          <div>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button type="button" className={btnClass}>
                  <TrendingUp className="size-4 mr-2 text-green-600" />
                  BBCA +2.4%
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex flex-col gap-1 min-w-36">
                  <div className="flex justify-between gap-4">
                    <span className="opacity-60">Open</span>
                    <span>9.250</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="opacity-60">Current</span>
                    <span>9.472</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="opacity-60">Change</span>
                    <span className="text-green-600">+2.4%</span>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">warning variant with icon</span>
          <div>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button type="button" className={btnClass}>
                  <AlertTriangle className="size-4 mr-2 text-amber-500" />
                  Low Stock
                </button>
              </TooltipTrigger>
              <TooltipContent variant="warning">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="size-3 shrink-0" />
                  Only 2 units remaining — restock soon
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use rich content for quick-scan data like key-value pairs or icon + text',
                body: 'Structured content such as stat breakdowns, currency amounts, or icon-labeled context is appropriate inside a tooltip when the user needs a quick glance without navigating away.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title:
                  "Don't use tooltips for content longer than 3 lines or with interactive elements",
                body: "Users can't reliably interact with content inside a tooltip — it closes when the cursor moves. For paragraphs, links, or buttons use HoverCard (hover-persistent) or Popover (click-persistent).",
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Use opacity instead of a specific text color for secondary text',
                body: 'Tooltips use light backgrounds (bg-white, bg-*-50). Hard-coding text-slate-300 or similar light color classes may look fine on dark backgrounds but become unreadable on light ones. Use opacity-60 or opacity-75 for muted secondary text.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: "Use HoverCard or Popover when content exceeds tooltip's scope",
                body: "Tooltip is designed for quick, non-interactive context. The moment you need a link, a button, or more than a few lines of text, you have exceeded the tooltip's design intent — reach for a richer component.",
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* icon + text */}
<TooltipContent>
  <div className="flex items-center gap-1.5">
    <Info className="size-3 shrink-0" />
    Click to open the help center
  </div>
</TooltipContent>

{/* key-value layout */}
<TooltipContent>
  <div className="flex flex-col gap-1 min-w-36">
    <div className="flex justify-between gap-4">
      <span className="opacity-60">Open</span>
      <span>9.250</span>
    </div>
    <div className="flex justify-between gap-4">
      <span className="opacity-60">Current</span>
      <span>9.472</span>
    </div>
  </div>
</TooltipContent>`}</code>
      </pre>
    </div>
  ),
}
