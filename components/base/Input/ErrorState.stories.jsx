import FieldContent from '../Field/FieldContent'
import FieldControl from '../Field/FieldControl'
import FieldLabel from '../Field/FieldLabel'
import FieldDescription from '../Field/FieldDescription'
import FieldError from '../Field/FieldError'
import Input from './Input'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Input Field/Error State',
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

export const Error = {
  name: 'Error',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        The error state applies a red border and focus ring. Set{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">error</code> on{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> — Input
        picks up the error variant automatically via context and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldError</code> renders the
        message with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">role="alert"</code>.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          error via FieldContent — variant and message auto-applied
        </span>
        <div className="flex flex-col gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg w-72">
          <FieldContent required error="Enter a valid email address.">
            <FieldLabel>Email</FieldLabel>
            <FieldControl>
              <Input type="email" defaultValue="not-an-email" />
            </FieldControl>
            <FieldError />
          </FieldContent>
          <FieldContent required error="This field is required.">
            <FieldLabel>Full Name</FieldLabel>
            <FieldDescription>Enter your legal name as it appears on your ID.</FieldDescription>
            <FieldControl>
              <Input placeholder="Your name" />
            </FieldControl>
            <FieldError />
          </FieldContent>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Show the error state only after the user has interacted with the field',
                body: 'Validate on blur or on form submit — not on every keystroke. Showing an error on an untouched field is startling and counterproductive. Wait until the user has had a chance to enter a value before flagging it as invalid.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title:
                  "Don't set variant=error on Input without also providing a FieldError message",
                body: 'A red border alone does not explain what went wrong. The error variant is a visual cue; FieldError is the explanation. Always include both so the user knows what to fix and why.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'Always include <FieldError /> in the field tree when validation is possible',
                body: 'FieldError renders with role="alert" and is linked to the Input via aria-errormessage from FieldContent context. This triggers an immediate announcement for screen reader users when the error message appears.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Write specific, actionable error messages — never just "Invalid" or "Required"',
                body: '"Enter a valid email address" tells the user exactly what to fix. "Invalid input" does not. Always write from the user\'s perspective: what the value should look like and what format is expected.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent required error="Enter a valid email address.">
  <FieldLabel>Email</FieldLabel>
  <FieldControl>
    <Input type="email" defaultValue="not-an-email" />
  </FieldControl>
  <FieldError />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
