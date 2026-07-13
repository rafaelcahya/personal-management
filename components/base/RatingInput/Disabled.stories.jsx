import RatingInput from './RatingInput'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/RatingInput/Disabled',
}

export default meta

const BestPractices = ({ items }) => (
  <div className="flex flex-col gap-8 w-full">
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
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        Pass <code className="font-mono bg-gray-100 px-1 rounded">disabled</code> to prevent
        interaction. The component is muted and non-clickable. Also inherits from{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">FieldContent</code> context
        automatically.
      </span>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">disabled — no value</span>
          <RatingInput disabled />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">disabled — with value</span>
          <RatingInput disabled value={3} />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">disabled — number style</span>
          <RatingInput disabled style="number" value={4} />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">Via FieldContent disabled</span>
          <FieldContent size="base" disabled>
            <FieldLabel>Run effort</FieldLabel>
            <RatingInput value={3} />
          </FieldContent>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Disable when the rating is locked for the current context',
                body: 'A rating submitted in a past session, locked by a form state, or frozen after the review window closes should be disabled — the value stays visible but cannot be changed.',
              },
              {
                title: 'Use FieldContent disabled for full field suppression',
                body: 'Wrapping in FieldContent with disabled automatically dims the label and locks the rating — no need to pass disabled directly to RatingInput.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use readOnly instead if the field was never meant to be interactive',
                body: 'disabled implies the field was interactive and is now locked. readOnly means it was always display-only. Use the semantically correct one for clarity.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`<RatingInput disabled value={val} onChange={setVal} />

<FieldContent size="base" disabled>
  <FieldLabel>Run effort</FieldLabel>
  <RatingInput value={val} onChange={setVal} />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
