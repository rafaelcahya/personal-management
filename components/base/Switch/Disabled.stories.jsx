import { Switch } from './Switch'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Switch/Disabled',
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

export const Disabled = {
  name: 'Disabled',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">disabled</code> to prevent
        interaction. Switch already applies internal opacity, but apply{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">opacity-50</code> to the
        wrapping row so the label also dims.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">disabled — pill and track, off and on</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80 flex flex-col gap-4">
          {['pill', 'track'].map((theme) => (
            <div key={theme} className="flex items-center gap-10">
              <div className="flex flex-col items-center gap-2">
                <Switch theme={theme} disabled />
                <span className="text-xs text-gray-400 font-mono">{theme} off</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Switch theme={theme} disabled defaultChecked />
                <span className="text-xs text-gray-400 font-mono">{theme} on</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">disabled settings row — label also dims</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <div className="flex items-center justify-between gap-4 opacity-50">
            <label
              htmlFor="dis-feature"
              className="text-sm font-medium cursor-not-allowed select-none"
            >
              Feature unavailable
            </label>
            <Switch id="dis-feature" disabled />
          </div>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Disable a switch when the setting cannot be changed in the current context',
                body: "A feature locked by the user's plan, a region restriction, or a setting controlled by an admin should be visible but non-interactive. Disabling communicates the read-only state without hiding the option.",
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't disable a switch the user needs to interact with to proceed",
                body: 'If toggling the switch is required to complete a workflow, show it enabled. Disabling a required action traps users with no path forward.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'Apply opacity-50 to the wrapper row — not just the Switch — when the entire setting is disabled',
                body: 'Switch internally applies opacity to itself. But the label also needs to visually dim. Wrap both in a div and apply opacity-50 to the wrapper so the full row reads as disabled.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Explain why the setting is disabled if it may surprise the user',
                body: 'A tooltip or nearby helper text ("Not available on your plan") prevents confusion when users see a grayed-out switch they cannot interact with.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Disabled switch — apply opacity to wrapper row so label dims too */}
<div className="flex items-center justify-between gap-4 opacity-50">
  <label htmlFor="feature" className="text-sm font-medium cursor-not-allowed select-none">
    Feature unavailable
  </label>
  <Switch id="feature" disabled />
</div>`}</code>
      </pre>
    </div>
  ),
}
