import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldDescription from '../Field/FieldDescription'
import Textarea from './Textarea'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Textarea/Normal',
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

export const Default = {
  name: 'Default',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        The default state — empty, resizable, no error. Use the{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">rows</code> prop to set the
        initial visible height. Wrap in{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> to wire up
        accessible label, description, and error automatically.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">rows variants — 2, 4 (default), 6</span>
        <div className="flex flex-col gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <Textarea rows={2} placeholder="rows={2} — short note" />
          <Textarea rows={4} placeholder="rows={4} — standard (default)" />
          <Textarea rows={6} placeholder="rows={6} — long description" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          with FieldContent — label and description wired automatically
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <FieldContent required>
            <FieldLabel>Notes</FieldLabel>
            <FieldDescription>Max 500 characters.</FieldDescription>
            <Textarea rows={4} placeholder="Write something..." />
          </FieldContent>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use Textarea when the value spans multiple lines',
                body: 'Notes, descriptions, comments, and feedback are natural multi-line values. Textarea grows vertically with content and lets users resize it if needed — unlike Input which is always a single line.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use Textarea for single-line values — use Input instead",
                body: 'Names, emails, URLs, and amounts are single-line by nature. A tall textarea for a name field looks oversized and confuses users about how much to write.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Always wrap in FieldContent with a FieldLabel',
                body: 'FieldContent auto-generates the id and wires it to FieldLabel via htmlFor, and to FieldDescription via aria-describedby. Without this wiring the textarea has no accessible name for screen readers.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Set rows to match the expected content length',
                body: 'rows={2} for quick notes, rows={4} for standard form fields, rows={6} for longer descriptions. A textarea that is too short forces unnecessary scrolling; one that is too tall feels empty and intimidating.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Standalone */}
<Textarea rows={4} placeholder="Write something..." />

{/* With FieldContent */}
<FieldContent required>
  <FieldLabel>Notes</FieldLabel>
  <FieldDescription>Max 500 characters.</FieldDescription>
  <Textarea rows={4} placeholder="Write something..." />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
