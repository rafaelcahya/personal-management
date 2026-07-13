import FieldContainer from './FieldContainer'
import FieldContent from './FieldContent'
import FieldControl from './FieldControl'
import FieldLabel from './FieldLabel'
import FieldSeparator from './FieldSeparator'
import Input from '../Input/Input'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Field/FieldSeparator',
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
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldSeparator</code> renders a
        horizontal rule using the design system border color. Use it to visually divide sections
        inside a form without introducing a heading.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">standalone separator</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <FieldSeparator />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title:
                  'Use FieldSeparator to divide tightly related form sections without a heading',
                body: 'When two groups of fields belong together conceptually but need a visual break, a separator gives breathing room without the hierarchy of a FieldTitle. Prefer it for compact forms where a heading would feel too heavy.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title:
                  "Don't use FieldSeparator between every field — use FieldContainer gap instead",
                body: 'Vertical spacing between individual fields belongs in FieldContainer gap, not in a separator. A separator divides sections, not individual items. Overusing it fragments the form and makes every field look like its own group.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'FieldSeparator is decorative — it does not create a form section boundary',
                body: 'The rendered <hr> has no semantic relationship to the fields around it. For meaningful form grouping that screen readers can navigate, use a <fieldset> with a <legend>. FieldSeparator is purely visual punctuation.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Pair FieldSeparator with a section label above it for clearer context',
                body: 'A bare separator rarely communicates why a break exists. Placing a short FieldTitle or paragraph immediately above tells users what the next section is about.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldSeparator />`}</code>
      </pre>
    </div>
  ),
}

export const InForm = {
  name: 'In Form',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Place <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldSeparator</code>{' '}
        inside a <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContainer</code>{' '}
        to create a visual break between field groups while keeping consistent vertical spacing.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">separator dividing two field groups in a form</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <FieldContainer>
            <FieldContent>
              <FieldLabel>First Name</FieldLabel>
              <FieldControl>
                <Input placeholder="John" />
              </FieldControl>
            </FieldContent>
            <FieldContent>
              <FieldLabel>Last Name</FieldLabel>
              <FieldControl>
                <Input placeholder="Doe" />
              </FieldControl>
            </FieldContent>
            <FieldSeparator />
            <FieldContent>
              <FieldLabel>Email</FieldLabel>
              <FieldControl>
                <Input type="email" placeholder="john@example.com" />
              </FieldControl>
            </FieldContent>
            <FieldContent>
              <FieldLabel>Phone</FieldLabel>
              <FieldControl>
                <Input type="tel" placeholder="+62 812 3456 7890" />
              </FieldControl>
            </FieldContent>
          </FieldContainer>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title:
                  'Use FieldSeparator inside FieldContainer to divide groups of related fields',
                body: 'FieldSeparator fits naturally inside FieldContainer because it participates in the flex-col gap layout. It spans the full width and adds a visible boundary while keeping the gap rhythm consistent.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title:
                  "Don't add a separator when FieldContainer gap already creates enough breathing room",
                body: 'If fields are well-spaced via gap="lg", a separator on top creates visual noise. Choose one or the other to create distance between sections.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Add a FieldTitle above the separator for screen reader navigation',
                body: 'Screen readers cannot perceive a visual separator. Adding a FieldTitle or heading before it creates a navigable landmark that tells users a new section starts here.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Use gap="lg" on FieldContainer around a separator for more visual breathing room',
                body: 'Combining a larger gap with a separator makes the section break feel intentional. The extra whitespace before and after the line reinforces that these groups are meaningfully distinct.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContainer>
  <FieldContent>...</FieldContent>
  <FieldContent>...</FieldContent>
  <FieldSeparator />
  <FieldContent>...</FieldContent>
</FieldContainer>`}</code>
      </pre>
    </div>
  ),
}
