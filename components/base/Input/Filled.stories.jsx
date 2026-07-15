import FieldContent from '../Field/FieldContent'
import FieldControl from '../Field/FieldControl'
import FieldLabel from '../Field/FieldLabel'
import Input from './Input'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Input Field/Filled',
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
        How the input looks with a value already entered. Use{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">defaultValue</code> for
        uncontrolled inputs with an initial value (e.g. edit forms pre-populated from server data).
        Use <code className="font-mono bg-gray-100 px-1 rounded text-xs">value</code> +{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">onChange</code> for controlled
        inputs that track state.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          edit form pattern — pre-populated with defaultValue
        </span>
        <div className="flex flex-col gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg w-72">
          <FieldContent required>
            <FieldLabel>Full Name</FieldLabel>
            <FieldControl>
              <Input defaultValue="John Doe" />
            </FieldControl>
          </FieldContent>
          <FieldContent required>
            <FieldLabel>Email</FieldLabel>
            <FieldControl>
              <Input type="email" defaultValue="john@example.com" />
            </FieldControl>
          </FieldContent>
          <FieldContent>
            <FieldLabel>Website</FieldLabel>
            <FieldControl>
              <Input defaultValue="https://johndoe.dev" />
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
                title: 'Use defaultValue to pre-populate an edit form with server data',
                body: 'When the user is editing an existing record, populate each Input with defaultValue from the fetched data. This gives them a starting point without requiring you to manage controlled state for every field.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use defaultValue in controlled forms where state must stay in sync",
                body: 'defaultValue is uncontrolled — React does not track the value after initial render. For forms that derive validation from live state or that submit controlled data, use value + onChange instead.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'A filled input still requires a FieldLabel — the placeholder is gone',
                body: 'When an input has a value, the placeholder is hidden. If the only accessible name was the placeholder, the field is now unlabelled. Always include FieldLabel regardless of whether the input has a value.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Show a "Last saved" hint in FieldDescription for pre-populated values',
                body: 'Users filling an edit form often want to know where the pre-filled data came from. A short FieldDescription like "From your profile" or "Last updated 12 Jul 2026" builds confidence that the value is correct.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Uncontrolled — pre-populated edit form */}
<FieldContent required>
  <FieldLabel>Full Name</FieldLabel>
  <FieldControl>
    <Input defaultValue="John Doe" />
  </FieldControl>
</FieldContent>

{/* Controlled — tracks live state */}
<FieldContent required>
  <FieldLabel>Email</FieldLabel>
  <FieldControl>
    <Input
      type="email"
      value={email}
      onChange={e => setEmail(e.target.value)}
    />
  </FieldControl>
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
