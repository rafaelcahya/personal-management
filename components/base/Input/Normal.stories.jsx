import FieldContent from '../Field/FieldContent'
import FieldControl from '../Field/FieldControl'
import FieldLabel from '../Field/FieldLabel'
import FieldDescription from '../Field/FieldDescription'
import Input from './Input'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Input Field/Normal',
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
        The default state — no value entered, no error. Works standalone or inside{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> for
        accessible label and description wiring. Use{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">type</code> to set the
        appropriate keyboard and browser autofill behavior.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">standalone — different input types</span>
        <div className="flex flex-col gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg w-72">
          <Input placeholder="Text (default)" />
          <Input type="email" placeholder="Email" />
          <Input type="password" placeholder="Password" />
          <Input type="number" placeholder="Number" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          with FieldContent — label and description wired automatically
        </span>
        <div className="flex flex-col gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg w-72">
          <FieldContent required>
            <FieldLabel>Email</FieldLabel>
            <FieldDescription>We will never share your email.</FieldDescription>
            <FieldControl>
              <Input type="email" placeholder="you@example.com" />
            </FieldControl>
          </FieldContent>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use Input for short, free-form single-line text values',
                body: 'Names, emails, URLs, amounts, and usernames — any value the user types freely on one line. Input is the default choice for form fields without a fixed set of options.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use placeholder text as a substitute for a visible label",
                body: 'Placeholder text disappears as soon as the user starts typing. Always pair Input with FieldLabel inside FieldContent so the field has a persistent, accessible name.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Always wrap Input in FieldContent with a FieldLabel',
                body: 'FieldContent auto-generates the id and wires it to FieldLabel via htmlFor, and to FieldDescription via aria-describedby. Without this wiring the input has no accessible name for screen readers.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Set input type to match the expected value for better mobile UX and autofill',
                body: 'type="email" triggers the @ keyboard on mobile and enables browser autofill for email fields. type="tel" shows a numeric keypad. type="password" hides the value. Always set type to match the expected input.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Standalone */}
<Input type="email" placeholder="you@example.com" />

{/* With FieldContent — label auto-wired */}
<FieldContent required>
  <FieldLabel>Email</FieldLabel>
  <FieldDescription>We will never share your email.</FieldDescription>
  <FieldControl>
    <Input type="email" placeholder="you@example.com" />
  </FieldControl>
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
