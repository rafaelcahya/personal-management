import FieldGroup from './FieldGroup'
import FieldContent from './FieldContent'
import FieldControl from './FieldControl'
import FieldLabel from './FieldLabel'
import FieldTitle from './FieldTitle'
import Input from '../Input/Input'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Field/FieldTitle',
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
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldTitle</code> renders a
        small uppercase section heading. It is designed for use inside{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldGroup</code> where it
        spans all columns automatically via{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">col-span-full</code>.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">standalone FieldTitle</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <FieldTitle>Personal Info</FieldTitle>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use FieldTitle inside FieldGroup to label groups of related fields',
                body: 'FieldTitle spans all columns in a FieldGroup grid (col-span-full) and acts as a section label. Use it when you have multiple distinct groups within the same FieldGroup and need a visible header to separate them.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title:
                  "Don't use FieldTitle outside FieldGroup — use a plain heading element instead",
                body: 'FieldTitle is designed for use inside FieldGroup grids where col-span-full is meaningful. Outside a grid, use a semantic heading element with appropriate styling instead.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'FieldTitle is a <p> element — add a <fieldset> + <legend> for true group semantics',
                body: 'FieldTitle provides a visual label but has no semantic relationship to the fields below it. For proper form grouping that screen readers can navigate, wrap related fields in a <fieldset> with a <legend>.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Use short noun-based titles — "Personal Info", not "Enter your personal information"',
                body: 'FieldTitle is displayed in small uppercase styling that works best with 1–3 words. Keep them concise and noun-based. Avoid verb phrases or instructional copy.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldTitle>Personal Info</FieldTitle>`}</code>
      </pre>
    </div>
  ),
}

export const InGroup = {
  name: 'In Group',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Place <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldTitle</code> inside{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldGroup</code> — it spans
        all columns automatically to act as a visual section break between field groups.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          FieldTitle as section break inside a 2-column FieldGroup
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg max-w-lg">
          <FieldGroup cols={2}>
            <FieldTitle>Personal Info</FieldTitle>
            <FieldContent required>
              <FieldLabel>First Name</FieldLabel>
              <FieldControl>
                <Input placeholder="John" />
              </FieldControl>
            </FieldContent>
            <FieldContent required>
              <FieldLabel>Last Name</FieldLabel>
              <FieldControl>
                <Input placeholder="Doe" />
              </FieldControl>
            </FieldContent>

            <FieldTitle>Address</FieldTitle>
            <FieldContent>
              <FieldLabel>City</FieldLabel>
              <FieldControl>
                <Input placeholder="Jakarta" />
              </FieldControl>
            </FieldContent>
            <FieldContent>
              <FieldLabel>Postal Code</FieldLabel>
              <FieldControl>
                <Input placeholder="12345" />
              </FieldControl>
            </FieldContent>
          </FieldGroup>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use FieldTitle to separate sections within a single FieldGroup grid',
                body: 'When a multi-column form has multiple conceptual groups, FieldTitle spans all columns and acts as a visible section break without breaking the grid flow.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title:
                  "Don't add FieldTitle before every single field — only between distinct groups",
                body: 'FieldTitle is for group labels, not individual field labels. If each field already has a FieldLabel, adding a FieldTitle above each one creates visual noise. Reserve it for meaningful section separations.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'FieldTitle inside FieldGroup has col-span-full — it always breaks to a new row',
                body: 'Because FieldTitle spans all columns, it always appears on its own row regardless of column count. This makes section boundaries visually consistent across all breakpoints.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Place FieldTitle immediately before the first field of its section',
                body: 'FieldTitle should be the first element of a new group, not the last element of the previous one. Placing it immediately before the related fields makes the association clear and the DOM order logical.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldGroup cols={2}>
  <FieldTitle>Personal Info</FieldTitle>
  <FieldContent required>
    <FieldLabel>First Name</FieldLabel>
    <FieldControl><Input placeholder="John" /></FieldControl>
  </FieldContent>
  <FieldTitle>Address</FieldTitle>
  <FieldContent>
    <FieldLabel>City</FieldLabel>
    <FieldControl><Input placeholder="Jakarta" /></FieldControl>
  </FieldContent>
</FieldGroup>`}</code>
      </pre>
    </div>
  ),
}
