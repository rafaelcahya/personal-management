import FieldContent from './FieldContent'
import FieldControl from './FieldControl'
import FieldLabel from './FieldLabel'
import Input from '../Input/Input'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Field/FieldLabel',
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
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldLabel</code> renders a{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">&lt;label&gt;</code> element
        automatically wired to its paired input via{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> context —
        no manual <code className="font-mono bg-gray-100 px-1 rounded text-xs">htmlFor</code>{' '}
        needed.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          label auto-wired to input via FieldContent context
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <FieldContent>
            <FieldLabel>Email address</FieldLabel>
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
                title:
                  'Use FieldLabel inside FieldContent for zero-config accessible label linking',
                body: 'FieldContent generates a unique id and passes it to both FieldLabel (as htmlFor) and Input (as id). You get a correctly linked label/input pair without any manual wiring.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use FieldLabel standalone for decorative text headings",
                body: 'FieldLabel renders a <label> element that is semantically linked to an input. Using it without a paired input creates orphaned label elements that confuse screen readers. Use a <p> or heading element for non-form text.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'Every input needs a label — never omit FieldLabel from a visible form field',
                body: 'A label is required for screen reader users to understand what each input is for. Even for visually obvious fields like a search bar, provide a label (visible or sr-only) so assistive technology can identify it.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use sentence case for label text — not all caps or title case',
                body: 'Sentence case ("Email address") is easier to scan than title case ("Email Address") or all caps ("EMAIL ADDRESS"). Keep labels short and noun-based.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent>
  <FieldLabel>Email address</FieldLabel>
  <FieldControl>
    <Input type="email" placeholder="you@example.com" />
  </FieldControl>
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
        When <code className="font-mono bg-gray-100 px-1 rounded text-xs">required</code> is set on{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code>,{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldLabel</code> shows a red
        asterisk automatically. The asterisk is{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">aria-hidden</code> so screen
        readers instead rely on the{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">aria-required</code> attribute
        on the input.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">required field — asterisk shown on label</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <FieldContent required>
            <FieldLabel>Full name</FieldLabel>
            <FieldControl>
              <Input placeholder="John Doe" />
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
                  'Set required on FieldContent — both FieldLabel and Input receive it automatically',
                body: 'Setting required on FieldContent propagates it via context to FieldLabel (asterisk) and Input (aria-required). You only need to set it once.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't mark every field as required — only fields that are truly mandatory",
                body: 'If most fields are required, consider reversing the pattern: mark optional fields as "(optional)" in the label instead of marking every required field with an asterisk.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'The asterisk is aria-hidden — screen readers rely on aria-required on the input',
                body: 'FieldLabel renders the asterisk with aria-hidden="true" so screen readers skip it. The Input receives aria-required="true" from context, which is the correct way to communicate required status programmatically.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Add a note at the top of the form explaining what the asterisk means',
                body: 'Not all users know that an asterisk means required. A short note like "* Required field" at the top of the form clarifies the convention and helps users complete the form without errors.',
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
        When <code className="font-mono bg-gray-100 px-1 rounded text-xs">disabled</code> is set on{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code>, the{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">Input</code> becomes disabled
        and the entire field row appears muted. FieldLabel itself has no visual disabled state — the
        context-driven input opacity communicates the disabled status.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          disabled field — input is non-interactive and muted
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <FieldContent disabled>
            <FieldLabel>Account ID</FieldLabel>
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
                title: 'Set disabled on FieldContent to disable the entire field row at once',
                body: 'FieldContent propagates disabled via context to Input. This ensures the visual and functional disabled state is consistent across the entire field without touching each child component.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title:
                  "Don't use disabled as a substitute for read-only — use the Input's readOnly prop instead",
                body: 'A disabled input is excluded from form submission and cannot be focused by keyboard. If you want to show a value that users cannot change but should still be able to read and copy, use readOnly on the Input instead.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'Disabled inputs are skipped in tab order — warn users if this affects form flow',
                body: 'A disabled field is not reachable by keyboard. If the disabled state depends on another field value, make sure users understand why the field is disabled and what will enable it.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Add a FieldDescription explaining why the field is disabled',
                body: 'A muted input without explanation can confuse users who expect to interact with it. A short FieldDescription like "Set automatically after saving" tells users why the field is read-only.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent disabled>
  <FieldLabel>Account ID</FieldLabel>
  <FieldControl>
    <Input placeholder="auto-generated" />
  </FieldControl>
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
