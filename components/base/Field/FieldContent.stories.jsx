import FieldContent from './FieldContent'
import FieldControl from './FieldControl'
import FieldLabel from './FieldLabel'
import FieldDescription from './FieldDescription'
import FieldError from './FieldError'
import FieldPrefix from './FieldPrefix'
import FieldSuffix from './FieldSuffix'
import Input from '../Input/Input'
import { Mail } from 'lucide-react'
import { Switch } from '@/components/base/Switch/Switch'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Field/FieldContent',
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
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> is the root
        wrapper for a labelled form field. It generates a unique id and distributes it via context
        so FieldLabel, FieldDescription, FieldError, and Input are all correctly linked — no manual{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">htmlFor</code> or{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">aria-*</code> needed.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          default — vertical orientation, all field parts wired automatically
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <FieldContent>
            <FieldLabel>Email</FieldLabel>
            <FieldDescription>We will never share your email.</FieldDescription>
            <FieldControl>
              <FieldPrefix>
                <Mail />
              </FieldPrefix>
              <Input type="email" placeholder="you@example.com" />
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
                title: 'Use FieldContent as the root wrapper for every labelled form field',
                body: 'FieldContent manages the id, aria-describedby, aria-errormessage, required, and disabled state for the entire field. Wrapping every labelled input in FieldContent gives you correct accessibility wiring with zero manual configuration.',
              },
              {
                title: 'Always include FieldError inside FieldContent to show validation messages',
                body: 'Even when there is no error yet, include <FieldError /> so that when you set the error prop on FieldContent, the message appears immediately without a component tree change.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use FieldContent when you don't need a label, description, or error",
                body: 'For bare search inputs or filter bars that only need a prefix icon, FieldControl standalone is lighter. FieldContent adds context overhead that is only useful when you have label/description/error wiring.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'FieldContent wires all aria attributes automatically — never add them manually',
                body: 'FieldContent generates unique ids for the field, description, and error, then passes them to Input via context. Manually adding aria-describedby or aria-errormessage on the Input duplicates or conflicts with this automatic wiring.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use name prop to identify the field in form debugging and test selectors',
                body: 'The name prop on FieldContent is informational only — it does not wire to Input automatically. Use it as a readable identifier when you need to locate fields by name in tests or debugging tools.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent>
  <FieldLabel>Email</FieldLabel>
  <FieldDescription>We will never share your email.</FieldDescription>
  <FieldControl>
    <Input type="email" placeholder="you@example.com" />
  </FieldControl>
  <FieldError />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}

export const Horizontal = {
  name: 'Horizontal',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">orientation="horizontal"</code>{' '}
        places the label and description on the left and the control on the right — the classic
        settings-page row layout. Use it for toggle switches, checkboxes, and preference rows.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          horizontal orientation — label left, control right
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg max-w-sm">
          <FieldContent orientation="horizontal">
            <FieldLabel>Email notifications</FieldLabel>
            <FieldDescription>Receive emails for new activity.</FieldDescription>
            <FieldControl>
              <Switch />
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
                title:
                  'Use horizontal orientation for settings-style rows with a small control on the right',
                body: 'Horizontal layout is the standard for settings pages. The label and description stack on the left while the switch, checkbox, or select sits on the right. The layout is driven by CSS grid areas defined in FieldContent.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use horizontal orientation for text inputs in data-entry forms",
                body: 'Horizontal layout expects the control to be compact (switch, checkbox). A full-width text input in horizontal mode will be pushed into the auto-width right column, making it too narrow to use comfortably.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'All aria connections work the same way regardless of orientation',
                body: 'Switching to horizontal orientation does not change the label/input/description/error linkage. The aria-describedby and htmlFor connections are context-driven and orientation-agnostic.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Keep descriptions short in horizontal mode — one line is ideal',
                body: 'In horizontal layout the description shares column space with the label. A one-line description keeps the row height consistent and the layout clean across multiple settings rows.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent orientation="horizontal">
  <FieldLabel>Email notifications</FieldLabel>
  <FieldDescription>Receive emails for new activity.</FieldDescription>
  <FieldControl>
    <Switch />
  </FieldControl>
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}

export const Row = {
  name: 'Row',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">orientation="row"</code>{' '}
        arranges children in a horizontal flex row — ideal for inline checkbox or radio button
        patterns where the control sits to the left of the label on the same line.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          row orientation — control and label inline on one line
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <FieldContent orientation="row">
            <FieldControl>
              <Switch />
            </FieldControl>
            <FieldLabel>Agree to terms</FieldLabel>
          </FieldContent>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use row orientation for checkboxes, radios, and inline toggle-label pairs',
                body: 'Row orientation is the right layout when the control is a checkbox or radio button that should sit on the same line as its label. The flex-row layout handles this without any custom className.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title:
                  "Don't use row orientation for text inputs or controls that need descriptions or errors",
                body: 'Row orientation has no grid areas. FieldDescription and FieldError will appear inline in the row rather than below, which breaks the expected visual hierarchy. Use vertical or horizontal orientation for those cases.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Label linking works the same way in row orientation',
                body: 'FieldContent context still wires FieldLabel (htmlFor) and Input (id) correctly regardless of orientation. Clicking the label in row orientation will still focus the paired input.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Place the control before the label in row orientation for the natural reading order',
                body: 'In most UI conventions, the checkbox or radio sits to the left of the label text. In row orientation, render FieldControl before FieldLabel so the DOM order matches the visual order.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent orientation="row">
  <FieldControl>
    <Switch />
  </FieldControl>
  <FieldLabel>Agree to terms</FieldLabel>
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}

export const Required = {
  name: 'Required',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">required</code> prop
        propagates via context: FieldLabel shows a red asterisk and Input receives{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">aria-required="true"</code>{' '}
        automatically. Set it once on FieldContent — never on child components individually.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          required field — asterisk on label, aria-required on input
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <FieldContent required>
            <FieldLabel>Full name</FieldLabel>
            <FieldControl>
              <Input placeholder="John Doe" />
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
                title:
                  'Set required on FieldContent — it propagates to FieldLabel and Input automatically',
                body: 'required on FieldContent distributes via context to show the asterisk in FieldLabel and add aria-required to the Input. You never need to pass required to child components individually.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't mark every field as required — only fields that are truly mandatory",
                body: 'If most fields are required, consider reversing the pattern: mark optional fields as "(optional)" in the label instead. Too many asterisks create noise and users start ignoring them.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'The asterisk is aria-hidden — required is communicated via aria-required on the Input',
                body: 'FieldLabel renders the asterisk with aria-hidden="true" so screen readers skip the visual symbol. The Input receives aria-required="true", which is the semantically correct way to communicate required status.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Add a note at the top of the form explaining what the asterisk means',
                body: 'Not all users know an asterisk means required. A short note like "* Required field" at the top of the form clarifies the convention, especially for less frequent form users.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent required>
  <FieldLabel>Full name</FieldLabel>
  <FieldControl>
    <Input placeholder="John Doe" />
  </FieldControl>
  <FieldError />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}

export const Disabled = {
  name: 'Disabled',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">disabled</code> prop
        propagates via context to the Input, which becomes non-interactive and visually muted. Set
        it once on FieldContent.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          disabled field — input non-interactive, muted appearance
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <FieldContent disabled>
            <FieldLabel>Account ID</FieldLabel>
            <FieldDescription>Set automatically after account creation.</FieldDescription>
            <FieldControl>
              <Input placeholder="auto-generated" />
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
                title: 'Set disabled on FieldContent to disable the entire field at once',
                body: 'FieldContent propagates disabled via context to Input. This ensures the visual and functional disabled state is consistent across the field without touching each child.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title:
                  "Don't use disabled as a substitute for read-only — use Input's readOnly prop instead",
                body: 'A disabled input is excluded from form submission and cannot be focused by keyboard. If you want to show a value the user can read and copy but not change, use readOnly on the Input instead.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'Disabled inputs are skipped in tab order — explain why the field is disabled',
                body: 'A disabled field is not reachable by keyboard. Use FieldDescription to explain why the field is disabled so users understand the state and what will enable it.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Add a FieldDescription explaining why the field is disabled',
                body: 'A muted input without context can confuse users who expect to interact with it. A short note like "Set automatically after saving" makes the disabled state self-explanatory.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent disabled>
  <FieldLabel>Account ID</FieldLabel>
  <FieldDescription>Set automatically after account creation.</FieldDescription>
  <FieldControl>
    <Input placeholder="auto-generated" />
  </FieldControl>
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}

export const Error = {
  name: 'Error',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Pass an <code className="font-mono bg-gray-100 px-1 rounded text-xs">error</code> string to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> — it flows
        via context to the Input (error variant + aria-invalid) and to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldError</code> which
        displays the message automatically.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          error state — input red, message shown, aria-invalid set
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <FieldContent required error="Enter a valid email address.">
            <FieldLabel>Email</FieldLabel>
            <FieldControl>
              <FieldPrefix>
                <Mail />
              </FieldPrefix>
              <Input type="email" defaultValue="not-an-email" />
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
                title:
                  'Pass error to FieldContent — Input, FieldError, and aria attributes all update together',
                body: 'Setting error on FieldContent propagates to Input (error variant + aria-invalid + aria-errormessage) and to FieldError (displays the message). Everything stays in sync from a single prop.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't set error on FieldContent when there is no FieldError child",
                body: 'The error prop styles the Input and sets aria-invalid, but the message is only visible when a FieldError component exists in the tree. Always include <FieldError /> when you use the error prop.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'FieldError has role="alert" — screen readers announce the message on mount',
                body: 'When FieldError mounts with a message (because error was just set), screen readers announce it as an alert. The user is immediately told what went wrong without having to re-focus the input.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Write specific, actionable error messages',
                body: '"Enter a valid email address" tells users exactly what to fix. "Invalid input" does not. Always write error messages from the user\'s perspective: what went wrong and what they should do next.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent required error="Enter a valid email address.">
  <FieldLabel>Email</FieldLabel>
  <FieldControl>
    <Input type="email" />
  </FieldControl>
  <FieldError />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
