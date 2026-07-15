import { TrendingUp, TrendingDown, User, Package, ExternalLink } from 'lucide-react'
import { HoverCard, HoverCardTrigger, HoverCardContent } from './HoverCard'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'HoverCard/Rich Content',
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

const dotted = 'underline decoration-dotted cursor-default text-slate-700'

export const RichContent = {
  name: 'Rich Content',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">HoverCardContent</code> accepts
        any ReactNode — buttons, links, structured data, icons. The panel stays open when the mouse
        is inside so users can interact with the content.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          ticker preview — key-value data + action button
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-6 py-4">
            <HoverCard openDelay={0}>
              <HoverCardTrigger asChild>
                <span className={`text-sm font-medium ${dotted}`}>BBCA</span>
              </HoverCardTrigger>
              <HoverCardContent side="bottom" align="start" className="p-3 min-w-52">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Bank BCA</p>
                      <p className="text-xs text-gray-400">IDX · BBCA</p>
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="size-3" />
                      <span className="text-xs font-medium">+2.4%</span>
                    </div>
                  </div>
                  <hr className="border-gray-100" />
                  <div className="flex flex-col gap-1 text-xs">
                    {[
                      ['Open', '9.250'],
                      ['Current', '9.472'],
                      ['High', '9.500'],
                      ['Volume', '142.3M'],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between">
                        <span className="text-gray-400">{label}</span>
                        <span className="text-gray-700 font-mono">{value}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-1.5 text-xs border border-slate-200 rounded-lg px-2 py-1 hover:bg-gray-50 transition-colors mt-1"
                  >
                    <ExternalLink className="size-3" />
                    View trades
                  </button>
                </div>
              </HoverCardContent>
            </HoverCard>

            <HoverCard openDelay={0}>
              <HoverCardTrigger asChild>
                <span className={`text-sm font-medium ${dotted}`}>TLKM</span>
              </HoverCardTrigger>
              <HoverCardContent side="bottom" align="start" className="p-3 min-w-52">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Telkom Indonesia</p>
                      <p className="text-xs text-gray-400">IDX · TLKM</p>
                    </div>
                    <div className="flex items-center gap-1 text-red-500">
                      <TrendingDown className="size-3" />
                      <span className="text-xs font-medium">-1.2%</span>
                    </div>
                  </div>
                  <hr className="border-gray-100" />
                  <div className="flex flex-col gap-1 text-xs">
                    {[
                      ['Open', '3.720'],
                      ['Current', '3.676'],
                      ['High', '3.730'],
                      ['Volume', '87.1M'],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between">
                        <span className="text-gray-400">{label}</span>
                        <span className="text-gray-700 font-mono">{value}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-1.5 text-xs border border-slate-200 rounded-lg px-2 py-1 hover:bg-gray-50 transition-colors mt-1"
                  >
                    <ExternalLink className="size-3" />
                    View trades
                  </button>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">user profile — avatar + bio + stats</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3 py-4">
            <HoverCard openDelay={0}>
              <HoverCardTrigger asChild>
                <span className={`text-sm ${dotted}`}>@cahya</span>
              </HoverCardTrigger>
              <HoverCardContent side="bottom" align="start" className="p-3 w-56">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-full bg-violet-100 flex items-center justify-center">
                      <User className="size-4 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Cahya Putra</p>
                      <p className="text-xs text-gray-400">@cahya</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Personal trading & inventory dashboard. Tracking since 2023.
                  </p>
                  <div className="flex gap-3 text-xs text-gray-500">
                    <span>
                      <strong className="text-gray-900">12</strong> watchlist
                    </span>
                    <span>
                      <strong className="text-gray-900">5</strong> active trades
                    </span>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">inventory item — icon + specs + status badge</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3 py-4">
            <HoverCard openDelay={0}>
              <HoverCardTrigger asChild>
                <span className={`text-sm ${dotted}`}>Vitamin C 500mg</span>
              </HoverCardTrigger>
              <HoverCardContent side="right" align="start" className="p-3 w-56">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-lg bg-amber-50 flex items-center justify-center">
                      <Package className="size-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Vitamin C 500mg</p>
                      <p className="text-xs text-gray-400">Supplement</p>
                    </div>
                  </div>
                  <hr className="border-gray-100" />
                  <div className="flex flex-col gap-1 text-xs">
                    {[
                      ['Stock', '24 tablets'],
                      ['Min stock', '10 tablets'],
                      ['Last used', '2 days ago'],
                      ['Expires', 'Dec 2025'],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between">
                        <span className="text-gray-400">{label}</span>
                        <span className="text-gray-700">{value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="size-2 rounded-full bg-emerald-500" />
                    <span className="text-xs text-emerald-600">In stock</span>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use rich content when the trigger needs a structured data preview',
                body: 'Ticker details, inventory specs, user profile snapshots — these benefit from a key-value layout with a header and one action button. HoverCardContent accepts any ReactNode so the structure is entirely up to you.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't replace a full detail page or drawer with a HoverCard",
                body: 'Keep the panel to a card header, 3–5 key-value rows, and one optional action. If the user needs more than that, the action button should navigate to the detail page — the card supplements the trigger, not replaces it.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Ensure interactive panel content is reachable another way',
                body: 'HoverCard is hover-only — never put critical actions exclusively behind it. The "View trades" button should also exist on a detail page. Hover is unavailable on touch devices.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use consistent structure across all HoverCard types in the app',
                body: 'Same header layout, same key-value row pattern, same action button placement. When every card looks the same structurally, users can scan any card instantly without relearning the layout.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<HoverCard>
  <HoverCardTrigger asChild>
    <span className="underline decoration-dotted cursor-default">BBCA</span>
  </HoverCardTrigger>
  <HoverCardContent side="bottom" align="start" className="p-3 min-w-52">
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <span className="font-semibold">Bank BCA</span>
        <span className="text-green-600 text-xs">+2.4%</span>
      </div>
      {/* key-value rows */}
      {rows.map(([label, value]) => (
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">{label}</span>
          <span className="text-gray-700 font-mono">{value}</span>
        </div>
      ))}
      <button type="button">View trades</button>
    </div>
  </HoverCardContent>
</HoverCard>`}</code>
      </pre>
    </div>
  ),
}
