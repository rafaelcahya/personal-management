import State from './State'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'State/WithAction',
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

export const WithAction = {
  name: 'With Action',
  render: () => (
    <div className="flex flex-col gap-10 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">action</code> to render an
        outline Button below the description. Use it to give users a clear next step — retry, add,
        or connect.
      </p>

      <div className="flex flex-col gap-6 w-full max-w-2xl">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold text-gray-700">Error — retry action</span>
            <span className="text-[11px] text-gray-400">
              Most common use case — always include retry for error variant
            </span>
          </div>
          <div className="border border-gray-200 rounded-xl">
            <State
              variant="error"
              title="Failed to load valuation data"
              description="BBCA — check your connection and retry."
              action={{ label: 'Try again', onClick: () => {} }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold text-gray-700">Error — without action</span>
            <span className="text-[11px] text-gray-400">
              Only omit action when there is no meaningful recovery step
            </span>
          </div>
          <div className="border border-gray-200 rounded-xl">
            <State
              variant="error"
              title="Something went wrong"
              description="Please refresh the page."
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold text-gray-700">Empty — CTA action</span>
            <span className="text-[11px] text-gray-400">
              Guide the user toward adding their first item
            </span>
          </div>
          <div className="border border-gray-200 rounded-xl">
            <State
              variant="empty"
              title="No tickers yet"
              description="Add tickers to your watchlist to start comparing valuations."
              action={{ label: 'Add ticker', onClick: () => {} }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold text-gray-700">Empty — without action</span>
            <span className="text-[11px] text-gray-400">
              Acceptable when no direct action is available from this view
            </span>
          </div>
          <div className="border border-gray-200 rounded-xl">
            <State
              variant="empty"
              title="No activity this week"
              description="Log a run to see your weekly stats here."
            />
          </div>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Always add action on error variant',
                body: 'A retry path is essential for error states. Users expect to be able to recover — pass action={{ label: "Try again", onClick: handleRetry }} every time.',
              },
              {
                title: 'Add action on empty when there is a clear next step from this view',
                body: 'If the user can directly add, import, or connect from the current page, provide the action. If the action lives elsewhere, omit it rather than navigating away unexpectedly.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Never add action on loading variant',
                body: 'Loading is a transient state — no action is meaningful while content is being fetched.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Keep action labels short and verb-first',
                body: 'Try again, Retry, Add item, Connect — short imperative labels scan faster. Avoid long phrases like "Click here to add your first item."',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* error — with retry */}
<State
  variant="error"
  title="Failed to load data"
  description="Check your connection and retry."
  action={{ label: 'Try again', onClick: handleRetry }}
/>

{/* empty — with CTA */}
<State
  variant="empty"
  title="No tickers yet"
  description="Add tickers to start comparing valuations."
  action={{ label: 'Add ticker', onClick: handleOpen }}
/>`}</code>
      </pre>
    </div>
  ),
}
