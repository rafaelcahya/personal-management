import PasswordInput from './PasswordInput'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldDescription from '../Field/FieldDescription'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Input/Password Input/Disabled' }
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
        The disabled state dims the field and blocks all interaction including the show/hide toggle.
        Prefer setting <code className="font-mono bg-gray-100 px-1 rounded text-xs">disabled</code>{' '}
        on <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> so the
        label is also dimmed. Use the{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">disabled</code> prop directly
        only for standalone usage outside FieldContent.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">via FieldContent disabled — label also dimmed</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-72">
          <FieldContent disabled>
            <FieldLabel>Password</FieldLabel>
            <FieldDescription>Account locked — contact support to reset.</FieldDescription>
            <PasswordInput defaultValue="secret123" />
          </FieldContent>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">standalone disabled prop — no FieldContent</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-72">
          <PasswordInput disabled defaultValue="secret123" aria-label="Password" />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title:
                  'Disable a password field when the action is not available in the current context',
                body: 'A locked account, a read-only profile view, or a multi-step form where a previous step is complete are good reasons to disable the field while keeping it visible.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title:
                  "Don't disable a field the user needs to fill — hide it or show a different state",
                body: 'A disabled field implies it exists but cannot be used right now, which is confusing if the user must fill it to proceed. If the field is conditionally required, show it enabled when the condition is met.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Prefer FieldContent disabled over the disabled prop for full a11y coverage',
                body: 'Setting disabled on FieldContent flows the disabled attribute to the underlying Input and dims the FieldLabel. This gives screen readers the correct disabled state without extra wiring.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Show a FieldDescription explaining why the field is disabled',
                body: 'Users seeing a dimmed password field often wonder if it is a bug. A short FieldDescription like "Account locked — contact support to reset" removes that confusion.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Via FieldContent — recommended */}
<FieldContent disabled>
  <FieldLabel>Password</FieldLabel>
  <FieldDescription>Account locked — contact support to reset.</FieldDescription>
  <PasswordInput defaultValue="secret123" />
</FieldContent>

{/* Standalone */}
<PasswordInput disabled defaultValue="secret123" aria-label="Password" />`}</code>
      </pre>
    </div>
  ),
}
