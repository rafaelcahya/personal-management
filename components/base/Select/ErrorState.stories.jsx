import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './Select'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldDescription from '../Field/FieldDescription'
import FieldError from '../Field/FieldError'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Select/Error State',
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
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        The error state applies a red border and focus ring to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">SelectTrigger</code>. Set{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">error</code> on{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> — the
        trigger picks up the error variant automatically via context and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldError</code> renders the
        message with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">role=&quot;alert&quot;</code>.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          error via FieldContent — variant and message auto-applied
        </span>
        <div className="flex flex-col gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <FieldContent required error="Please select a category.">
            <FieldLabel>Category</FieldLabel>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="health">Health</SelectItem>
              </SelectContent>
            </Select>
            <FieldError />
          </FieldContent>
          <FieldContent required error="This field is required.">
            <FieldLabel>Status</FieldLabel>
            <FieldDescription>Select the current status of this item.</FieldDescription>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
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
                title:
                  'Show the error state only after the user has attempted to submit or left the field',
                body: 'Validate on blur or on form submit — not before the user has had a chance to make a choice. Showing an error on an untouched field is startling and counterproductive.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't show error styling without also providing a FieldError message",
                body: 'A red border alone does not explain what went wrong. The error variant is a visual cue; FieldError is the explanation. Always include both so the user knows what to fix.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Always include FieldError in the field tree when validation is possible',
                body: 'FieldError renders with role="alert" and is linked to SelectTrigger via aria-errormessage from FieldContent context. This triggers an immediate screen reader announcement when the error appears.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Write specific, actionable error messages',
                body: '"Please select a category" tells the user exactly what to do. "Invalid selection" does not. Always write from the user\'s perspective: what they need to choose and why it matters.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent required error={errors.category?.message}>
  <FieldLabel>Category</FieldLabel>
  <Select>
    <SelectTrigger>
      <SelectValue placeholder="Select a category" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="food">Food</SelectItem>
      <SelectItem value="transport">Transport</SelectItem>
    </SelectContent>
  </Select>
  <FieldError />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
