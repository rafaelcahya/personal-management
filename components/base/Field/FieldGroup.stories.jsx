import FieldGroup from './FieldGroup'
import FieldContainer from './FieldContainer'
import FieldContent from './FieldContent'
import FieldControl from './FieldControl'
import FieldLabel from './FieldLabel'
import FieldTitle from './FieldTitle'
import Input from '../Input/Input'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Field/FieldGroup',
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
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldGroup</code> renders a CSS
        grid that lays out multiple{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> components
        side by side. Pass a number to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">cols</code> for a fixed column
        count.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          2-column grid — first name and last name side by side
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg max-w-lg">
          <FieldGroup cols={2}>
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
          </FieldGroup>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use FieldGroup when multiple fields logically belong in one row',
                body: 'First name + last name, city + zip code, start date + end date — these are natural pairs that benefit from side-by-side layout. FieldGroup gives you a consistent grid without writing custom CSS.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title:
                  "Don't use FieldGroup for a single column of fields — use FieldContainer instead",
                body: 'FieldContainer with flex-col is the right wrapper for a single column of stacked fields. FieldGroup is for multi-column layouts. Using FieldGroup with cols={1} works but adds grid overhead with no visual benefit.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'Each FieldContent in a FieldGroup is independent — labels link to their own input only',
                body: 'The id-based wiring happens at the FieldContent level. Each FieldContent generates its own unique id set, so label/input pairing is always correct regardless of how many fields share the same row.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Use cols={2} as the default for most multi-field rows — it is the most readable',
                body: 'Two columns is the most natural layout for paired fields. Three or more columns can feel cramped on smaller screens. Reserve 3+ columns for short fields like zip codes, phone extensions, or date parts.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldGroup cols={2}>
  <FieldContent required>
    <FieldLabel>First Name</FieldLabel>
    <FieldControl><Input placeholder="John" /></FieldControl>
  </FieldContent>
  <FieldContent required>
    <FieldLabel>Last Name</FieldLabel>
    <FieldControl><Input placeholder="Doe" /></FieldControl>
  </FieldContent>
</FieldGroup>`}</code>
      </pre>
    </div>
  ),
}

export const ThreeCol = {
  name: 'Three Column',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Use <code className="font-mono bg-gray-100 px-1 rounded text-xs">cols={3}</code> for three
        short fields in one row, and the{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">gap</code> prop to control
        spacing between columns.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">3 columns — city, state, and zip</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg max-w-xl">
          <FieldGroup cols={3} gap="sm">
            <FieldContent required>
              <FieldLabel>City</FieldLabel>
              <FieldControl>
                <Input placeholder="Jakarta" />
              </FieldControl>
            </FieldContent>
            <FieldContent>
              <FieldLabel>Province</FieldLabel>
              <FieldControl>
                <Input placeholder="DKI Jakarta" />
              </FieldControl>
            </FieldContent>
            <FieldContent required>
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
                title:
                  'Use 3 columns for address-style groups with short fields that belong together',
                body: 'City, province, and postal code are a natural three-column group. Each field is short enough that three columns remain readable. Use gap="sm" to keep the columns compact when all fields are narrow.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title:
                  "Don't use 3 or 4 columns for long text inputs — the columns become too narrow",
                body: "Three or more columns shrinks each field's width significantly. Long labels truncate and inputs become difficult to type in. Reserve multi-column layouts for short fields (codes, dates, initials).",
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Use a responsive cols object to restack on small screens',
                body: 'Three columns side by side on mobile is too cramped. Pass a responsive object like cols={{ xs: 1, md: 3 }} to stack fields on small screens and expand to three columns on medium and larger viewports.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Use gap="sm" for compact address rows and gap="base" for standard form rows',
                body: 'The default gap="base" (gap-4) is the right spacing for standard forms. For dense address-style rows where all fields are short, gap="sm" (gap-3) keeps the layout tighter without feeling cramped.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldGroup cols={3} gap="sm">
  <FieldContent required>
    <FieldLabel>City</FieldLabel>
    <FieldControl><Input placeholder="Jakarta" /></FieldControl>
  </FieldContent>
  <FieldContent>
    <FieldLabel>Province</FieldLabel>
    <FieldControl><Input placeholder="DKI Jakarta" /></FieldControl>
  </FieldContent>
  <FieldContent required>
    <FieldLabel>Postal Code</FieldLabel>
    <FieldControl><Input placeholder="12345" /></FieldControl>
  </FieldContent>
</FieldGroup>`}</code>
      </pre>
    </div>
  ),
}

export const WithTitle = {
  name: 'With Title',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Drop a <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldTitle</code> inside{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldGroup</code> to create
        labeled section breaks. FieldTitle uses{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">col-span-full</code> to span
        all columns and always starts a new row.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          FieldTitle spanning all columns as section labels
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

            <FieldTitle>Contact</FieldTitle>
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
          </FieldGroup>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title:
                  'Use FieldTitle to divide a single FieldGroup into multiple labeled sections',
                body: 'When a form has multiple conceptual groups (personal info, address, contact) inside one FieldGroup grid, FieldTitle acts as a visible row-spanning section header. It always breaks to a new row, keeping section boundaries clean.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use FieldTitle before every field — only between distinct groups",
                body: 'FieldTitle is for group labels, not per-field labels. Every field already has a FieldLabel. Reserve FieldTitle for meaningful section boundaries where 2+ fields belong to the same concept.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'FieldTitle is a visual element — wrap sections in a fieldset + legend for full semantics',
                body: 'FieldTitle has no semantic grouping relationship to the fields below it. For forms where group navigation matters for screen reader users, wrap each group in a <fieldset> with a <legend>.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Wrap the entire FieldGroup with multiple sections in FieldContainer for consistent outer gap',
                body: 'FieldContainer provides the vertical rhythm above and below the FieldGroup. Use it as the outermost wrapper so the form section integrates cleanly with surrounding page content.',
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
  <FieldTitle>Contact</FieldTitle>
  <FieldContent>
    <FieldLabel>Email</FieldLabel>
    <FieldControl><Input type="email" placeholder="john@example.com" /></FieldControl>
  </FieldContent>
</FieldGroup>`}</code>
      </pre>
    </div>
  ),
}
