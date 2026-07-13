import FieldContainer from './FieldContainer'
import FieldContent from './FieldContent'
import FieldControl from './FieldControl'
import FieldLabel from './FieldLabel'
import FieldDescription from './FieldDescription'
import FieldGroup from './FieldGroup'
import Input from '../Input/Input'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Field/FieldContainer',
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
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContainer</code> is a{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">flex flex-col</code> wrapper
        that stacks form fields vertically with consistent spacing. The default{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">gap="base"</code> applies{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">gap-4</code> between children.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          default — gap="base" (gap-4) stacking fields vertically
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <FieldContainer>
            <FieldContent required>
              <FieldLabel>Email</FieldLabel>
              <FieldControl>
                <Input type="email" placeholder="you@example.com" />
              </FieldControl>
            </FieldContent>
            <FieldContent required>
              <FieldLabel>Password</FieldLabel>
              <FieldControl>
                <Input type="password" placeholder="••••••••" />
              </FieldControl>
            </FieldContent>
            <FieldContent>
              <FieldLabel>Display name</FieldLabel>
              <FieldControl>
                <Input placeholder="John Doe" />
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
                  'Use FieldContainer as the outer wrapper for every column of stacked form fields',
                body: 'FieldContainer gives a consistent vertical rhythm to stacked fields. Use it instead of adding margin or gap classes directly to a wrapper div — it keeps spacing consistent across all forms in the app.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't mix manual margin or gap classes with FieldContainer",
                body: 'Adding mt-*, mb-*, or gap-* directly to children of FieldContainer conflicts with the container-level gap. Let FieldContainer own all vertical spacing between fields.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'FieldContainer has no semantic role — it is a pure layout element',
                body: 'FieldContainer renders a plain <div> with flex-col styling. For form grouping semantics that screen readers can navigate, use a <fieldset> with a <legend> around related fields.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Use gap="base" for most forms — it is the most readable at standard desktop sizes',
                body: 'gap="base" (gap-4 = 16px) gives fields enough breathing room to scan individually without feeling spaced out. Use gap="sm" for compact sidebars and gap="lg" between form sections.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContainer>
  <FieldContent required>
    <FieldLabel>Email</FieldLabel>
    <FieldControl><Input type="email" /></FieldControl>
  </FieldContent>
  <FieldContent required>
    <FieldLabel>Password</FieldLabel>
    <FieldControl><Input type="password" /></FieldControl>
  </FieldContent>
</FieldContainer>`}</code>
      </pre>
    </div>
  ),
}

export const GapVariants = {
  name: 'Gap Variants',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">gap</code> prop controls
        vertical spacing between children.{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">"sm"</code> is for compact
        sidebars, <code className="font-mono bg-gray-100 px-1 rounded text-xs">"base"</code> for
        standard forms, <code className="font-mono bg-gray-100 px-1 rounded text-xs">"md"</code> and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">"lg"</code> for more spacious
        layouts or between distinct form sections.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">gap="sm" — compact vertical spacing</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <FieldContainer gap="sm">
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
          </FieldContainer>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-2xl">
        {[
          {
            title: 'gap="sm" gives compact spacing — use it for sidebars and dense filter panels',
            body: 'gap="sm" (gap-3 = 12px) tightens the field stack for compact contexts like sidebars, filter drawers, or data-dense forms where screen space is limited.',
          },
        ].map(({ title, body }) => (
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

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          gap="lg" — spacious vertical spacing for distinct sections
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <FieldContainer gap="lg">
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
          </FieldContainer>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-2xl">
        {[
          {
            title: 'gap="lg" creates clear visual separation between distinct form sections',
            body: 'gap="lg" (gap-6 = 24px) gives each field a lot of breathing room. Use it between conceptually distinct sections of a long form, or when nesting a FieldGroup inside a FieldContainer.',
          },
        ].map(({ title, body }) => (
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

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* compact sidebar */}
<FieldContainer gap="sm">...</FieldContainer>

{/* standard form */}
<FieldContainer>...</FieldContainer>

{/* spacious section layout */}
<FieldContainer gap="lg">...</FieldContainer>`}</code>
      </pre>
    </div>
  ),
}

export const WithContent = {
  name: 'With Content',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Nest a <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldGroup</code> inside{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContainer</code> for forms
        that mix single-column fields and multi-column rows. FieldContainer owns the outer vertical
        spacing; FieldGroup owns the inner horizontal grid.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          FieldContainer wrapping both single fields and a FieldGroup row
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg max-w-lg">
          <FieldContainer>
            <FieldContent required>
              <FieldLabel>Display name</FieldLabel>
              <FieldDescription>This is what others will see on your profile.</FieldDescription>
              <FieldControl>
                <Input placeholder="John Doe" />
              </FieldControl>
            </FieldContent>
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
            <FieldContent>
              <FieldLabel>Bio</FieldLabel>
              <FieldControl>
                <Input placeholder="Tell us about yourself..." />
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
                  'Nest FieldGroup inside FieldContainer to mix single-column and multi-column rows',
                body: 'FieldContainer is the outermost vertical stack. Drop a FieldGroup inside it for any row that needs multiple columns. The gap between FieldGroup and adjacent FieldContent is handled by FieldContainer consistently.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title:
                  "Don't nest FieldContainer inside FieldContainer — only one level of stacking",
                body: 'Nesting containers doubles the gap and makes the spacing irregular. If you need sections with different gaps, use a single FieldContainer with gap="lg" and add FieldSeparator between sections.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'FieldContainer and FieldGroup are layout-only — each FieldContent manages its own a11y',
                body: 'Neither FieldContainer nor FieldGroup adds ARIA attributes. All accessibility wiring (label, description, error) is handled at the FieldContent level regardless of the nesting structure.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Use the same gap on FieldContainer for all forms in a feature to keep vertical rhythm consistent',
                body: 'Picking one gap value for all forms in a section (e.g. gap="base" everywhere in Settings) creates a uniform feel. Switching gaps between forms on the same page makes the layout feel inconsistent.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContainer>
  <FieldContent required>
    <FieldLabel>Display name</FieldLabel>
    <FieldControl><Input placeholder="John Doe" /></FieldControl>
  </FieldContent>
  <FieldGroup cols={2}>
    <FieldContent required>
      <FieldLabel>First Name</FieldLabel>
      <FieldControl><Input placeholder="John" /></FieldControl>
    </FieldContent>
    <FieldContent required>
      <FieldLabel>Last Name</FieldLabel>
      <FieldControl><Input placeholder="Doe" /></FieldControl>
    </FieldContent>
  </FieldGroup>
</FieldContainer>`}</code>
      </pre>
    </div>
  ),
}
