import Slider from './Slider'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldError from '../Field/FieldError'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Slider/Error State',
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

export const ErrorState = {
  name: 'Error State',
  render: () => (
    <div className="flex flex-col gap-10 p-8 w-80">
      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">variant="error" (explicit)</span>
        <Slider defaultValue={[30]} variant="error" />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">error via FieldContent</span>
        <FieldContent error="Value must be at least 50%.">
          <FieldLabel>Minimum threshold</FieldLabel>
          <Slider defaultValue={[30]} showTooltip tooltipFormat={(v) => `${v}%`} />
          <FieldError />
        </FieldContent>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">error range slider</span>
        <Slider
          defaultValue={[10, 40]}
          variant="error"
          showTooltip
          tooltipFormat={(v) => `${v}%`}
        />
      </div>

      <BestPractices
        items={[
          {
            heading: 'How to trigger error state',
            cards: [
              {
                title: 'Pass error to FieldContent — the slider inherits it automatically',
                body: 'FieldContent broadcasts the error to all child field components via context. The slider track and thumb turn destructive, and FieldError renders the message below.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Always pair error state with a FieldError message',
                body: 'The red track and thumb signal something is wrong, but without a message the user cannot know what to fix. Always include a FieldError explaining the constraint.',
              },
              {
                title: 'Show the current value with showTooltip when validation is active',
                body: 'The user needs to see the current value to understand why it failed validation. showTooltip makes the value visible while dragging toward the valid range.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`{/* Explicit variant */}
<Slider defaultValue={[30]} variant="error" />

{/* Via FieldContent */}
<FieldContent error="Value must be at least 50%.">
  <FieldLabel>Minimum threshold</FieldLabel>
  <Slider defaultValue={[30]} showTooltip tooltipFormat={(v) => \`\${v}%\`} />
  <FieldError />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
