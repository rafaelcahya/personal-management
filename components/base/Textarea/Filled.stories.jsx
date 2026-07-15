import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldDescription from '../Field/FieldDescription'
import Textarea from './Textarea'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Textarea/Filled',
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

export const Filled = {
  name: 'Filled',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        How the textarea looks with content already present. Use{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">defaultValue</code> for
        uncontrolled edit forms pre-populated from server data. Use{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">value</code> +{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">onChange</code> for controlled
        forms that track live state.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          edit form pattern — pre-populated with defaultValue
        </span>
        <div className="flex flex-col gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <FieldContent required>
            <FieldLabel>Product description</FieldLabel>
            <FieldDescription>Describe the product for customers.</FieldDescription>
            <Textarea
              rows={4}
              defaultValue="A durable stainless steel water bottle with double-wall vacuum insulation. Keeps drinks cold for 24 hours and hot for 12 hours."
            />
          </FieldContent>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          short and long content — rows adjusts height to fit initial display
        </span>
        <div className="flex flex-col gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <Textarea rows={2} defaultValue="Short note." />
          <Textarea
            rows={5}
            defaultValue={`Line one of a longer note.\nLine two with more context.\nLine three wrapping up the thought.`}
          />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use defaultValue to pre-populate an edit form with server data',
                body: 'When editing an existing record, populate Textarea with defaultValue from the fetched data. This gives users a starting point without requiring controlled state for every field.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use defaultValue in controlled forms where state must stay in sync",
                body: 'defaultValue is uncontrolled — React does not track the value after initial render. For forms that derive character counts, validation, or other live feedback from the current value, use value + onChange.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'A filled textarea still requires a FieldLabel — the placeholder is gone',
                body: 'When a textarea has a value, the placeholder is hidden. If the only accessible name was the placeholder, the field is now unlabelled. Always include FieldLabel regardless of whether the field has a value.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Set rows to match the expected content size for a natural editing experience',
                body: 'If the pre-populated value is typically 2–3 lines, set rows={3}. If it is a long description that spans many lines, use rows={6}. A textarea that shows only 2 lines of a 10-line value forces immediate scrolling.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Uncontrolled — pre-populated edit form */}
<FieldContent required>
  <FieldLabel>Product description</FieldLabel>
  <Textarea rows={4} defaultValue="A durable stainless steel water bottle..." />
</FieldContent>

{/* Controlled — tracks live state */}
<FieldContent required>
  <FieldLabel>Notes</FieldLabel>
  <Textarea
    rows={4}
    value={notes}
    onChange={e => setNotes(e.target.value)}
  />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
