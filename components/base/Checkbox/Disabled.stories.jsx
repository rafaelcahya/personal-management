import { Checkbox } from './Checkbox'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Checkbox/Disabled',
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
        interaction. Apply{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          opacity-50 cursor-not-allowed
        </code>{' '}
        to the label wrapper as well so the entire row reads as disabled.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">disabled — unchecked and checked</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col gap-3 w-80">
          <div className="flex items-center gap-3 opacity-50">
            <Checkbox id="dis-unchecked" disabled />
            <label
              htmlFor="dis-unchecked"
              className="text-sm font-medium cursor-not-allowed select-none"
            >
              Disabled unchecked
            </label>
          </div>
          <div className="flex items-center gap-3 opacity-50">
            <Checkbox id="dis-checked" disabled defaultChecked />
            <label
              htmlFor="dis-checked"
              className="text-sm font-medium cursor-not-allowed select-none"
            >
              Disabled checked
            </label>
          </div>
          <div className="flex items-center gap-3 opacity-50">
            <Checkbox id="dis-indeterminate" disabled checked="indeterminate" />
            <label
              htmlFor="dis-indeterminate"
              className="text-sm font-medium cursor-not-allowed select-none"
            >
              Disabled indeterminate
            </label>
          </div>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title:
                  'Disable a checkbox when the field exists but cannot be changed in the current context',
                body: 'Read-only review forms, locked permissions, or values auto-set by the system should be visible but non-interactive. Disabling makes the read-only state explicit rather than hiding the field.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't disable a checkbox the user is expected to interact with",
                body: 'If the user must check the box to proceed (e.g. terms acceptance), show it enabled. Disabling a required field traps users with no path forward.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'Apply opacity-50 and cursor-not-allowed to the label wrapper, not just the checkbox',
                body: 'Screen readers announce the checkbox as disabled via aria-disabled. For sighted users, the entire row (checkbox + label) must visually dim — apply opacity to the wrapping div, not just the Checkbox element.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Consider explaining why the field is disabled if it may surprise the user',
                body: 'A tooltip or nearby helper text like "Set automatically based on your plan" prevents confusion when users see a checkbox they cannot interact with.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Apply opacity to the wrapper so both checkbox and label dim */}
<div className="flex items-center gap-3 opacity-50">
  <Checkbox id="option" disabled />
  <label htmlFor="option" className="text-sm font-medium cursor-not-allowed select-none">
    Disabled option
  </label>
</div>`}</code>
      </pre>
    </div>
  ),
}
