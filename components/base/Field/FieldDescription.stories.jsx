import FieldContent from './FieldContent'
import FieldControl from './FieldControl'
import FieldLabel from './FieldLabel'
import FieldDescription from './FieldDescription'
import Input from '../Input/Input'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Field/FieldDescription',
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
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldDescription</code> renders
        muted hint text below the field label. When used inside{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code>, it is
        automatically linked to the input via{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">aria-describedby</code>.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          description below label — aria-linked to the input
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <FieldContent>
            <FieldLabel>Username</FieldLabel>
            <FieldDescription>3–20 characters, letters and numbers only.</FieldDescription>
            <FieldControl>
              <Input placeholder="your_username" />
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
                  'Use FieldDescription for hint text that helps users complete the field correctly',
                body: 'FieldDescription is ideal for format hints, constraints, or examples. Since it is aria-linked to the input, screen readers announce it when the user focuses the field — making it more useful than a standalone paragraph.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use FieldDescription for error messages — use FieldError instead",
                body: 'FieldError has role="alert" and the correct error styling. Using FieldDescription to display errors bypasses this semantic and loses the immediate announcement behavior that FieldError provides.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'FieldDescription is auto-linked via aria-describedby — never link it manually',
                body: 'FieldContent assigns descriptionId automatically and passes it to both FieldDescription and the Input. Adding aria-describedby manually duplicates or breaks this link. Let FieldContent handle it.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Keep FieldDescription to one or two short sentences',
                body: 'Long descriptions push the input out of view and overwhelm users. If the hint is longer than two sentences, consider a tooltip or a collapsible help section instead.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent>
  <FieldLabel>Username</FieldLabel>
  <FieldDescription>3–20 characters, letters and numbers only.</FieldDescription>
  <FieldControl>
    <Input placeholder="your_username" />
  </FieldControl>
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
        In{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">orientation="horizontal"</code>{' '}
        mode, <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldDescription</code>{' '}
        sits below the label on the left side of the row, giving the control more vertical space on
        the right.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          description in horizontal layout — label+description on left, control on right
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg max-w-lg">
          <FieldContent orientation="horizontal">
            <FieldLabel>Email notifications</FieldLabel>
            <FieldDescription>Receive emails about activity on your account.</FieldDescription>
            <FieldControl>
              <Input placeholder="email@example.com" />
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
                title: 'Use horizontal orientation with FieldDescription for settings-style rows',
                body: 'Horizontal layout with a description is the standard pattern for settings pages where each row needs a label, a short explanation, and a control on the right. The label and description stack on the left, keeping the layout scannable.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title:
                  "Don't use horizontal orientation in data-entry forms — use vertical instead",
                body: 'Horizontal layout works for settings rows where the control is small (switch, checkbox). For regular text inputs in a form, vertical layout is easier to read and fill out.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Description stays aria-linked to the input regardless of orientation',
                body: 'The aria-describedby connection is set by FieldContent context, not by visual position. Switching to horizontal orientation does not break or change the accessible description.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Keep descriptions short in horizontal layout — one line is ideal',
                body: 'In horizontal mode the description shares column space with the label. A one-line description keeps the row height predictable and the layout clean. For longer hints, switch to vertical orientation.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent orientation="horizontal">
  <FieldLabel>Email notifications</FieldLabel>
  <FieldDescription>Receive emails about activity on your account.</FieldDescription>
  <FieldControl>
    <Input placeholder="email@example.com" />
  </FieldControl>
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
