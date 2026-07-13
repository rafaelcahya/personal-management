import FieldContent from '../Field/FieldContent'
import FieldControl from '../Field/FieldControl'
import FieldLabel from '../Field/FieldLabel'
import FieldDescription from '../Field/FieldDescription'
import Input from './Input'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Input Field/Disabled',
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

export const Disabled = {
  name: 'Disabled',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        The disabled state renders the input dimmed and non-interactive. Prefer setting{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">disabled</code> on{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> so the
        variant is applied automatically via context. Use{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant="disabled"</code>{' '}
        directly on Input only for standalone usage outside FieldContent.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">via FieldContent disabled — label also dimmed</span>
        <div className="flex flex-col gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg w-72">
          <FieldContent disabled>
            <FieldLabel>Account ID</FieldLabel>
            <FieldDescription>Set automatically after account creation.</FieldDescription>
            <FieldControl>
              <Input placeholder="auto-generated" />
            </FieldControl>
          </FieldContent>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          standalone variant="disabled" — no FieldContent
        </span>
        <div className="flex flex-col gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg w-72">
          <Input variant="disabled" defaultValue="Read-only value" />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title:
                  'Disable a field when its value is system-generated or cannot be edited in the current context',
                body: 'Account IDs, creation timestamps, and auto-calculated values should be visible but non-editable. Disabling makes the read-only state explicit rather than hiding the field entirely.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title:
                  "Don't disable a field the user needs to complete — hide it or show a different control instead",
                body: 'A disabled field suggests it exists but cannot be used right now, which is confusing if the user must fill it to proceed. If a field is conditionally required, show it enabled when the condition is met, or hide it entirely.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'Prefer FieldContent disabled over variant="disabled" for full a11y coverage',
                body: 'Setting disabled on FieldContent flows the disabled attribute to the Input and also dims the FieldLabel. This gives screen readers the correct disabled state via aria attributes without any extra wiring.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Show a FieldDescription explaining why the field is disabled',
                body: 'Users seeing a dimmed field often wonder if it is a bug. A short FieldDescription like "Set automatically after account creation" removes that confusion and builds trust in the UI.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Via FieldContent — recommended */}
<FieldContent disabled>
  <FieldLabel>Account ID</FieldLabel>
  <FieldDescription>Set automatically after account creation.</FieldDescription>
  <FieldControl>
    <Input placeholder="auto-generated" />
  </FieldControl>
</FieldContent>

{/* Standalone — no FieldContent */}
<Input variant="disabled" defaultValue="Read-only value" />`}</code>
      </pre>
    </div>
  ),
}
