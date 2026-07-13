import { Checkbox } from './Checkbox'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Checkbox/Group',
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

export const Group = {
  name: 'Group',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Wrap multiple checkboxes in a{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">fieldset</code> with a{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">legend</code> for semantic
        grouping. Each checkbox manages its own state independently. Use a parent{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          checked=&quot;indeterminate&quot;
        </code>{' '}
        checkbox for "select all" controls.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">basic group — fieldset + legend</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <fieldset className="flex flex-col gap-2.5">
            <legend className="text-sm font-medium mb-3">Notification preferences</legend>
            {[
              { id: 'grp-email', label: 'Email', checked: true },
              { id: 'grp-push', label: 'Push notification', checked: true },
              { id: 'grp-sms', label: 'SMS', checked: false },
              { id: 'grp-app', label: 'In-app', checked: false },
            ].map(({ id, label, checked }) => (
              <div key={id} className="flex items-center gap-3">
                <Checkbox id={id} defaultChecked={checked} />
                <label htmlFor={id} className="text-sm font-medium cursor-pointer select-none">
                  {label}
                </label>
              </div>
            ))}
          </fieldset>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">with "select all" — parent indeterminate</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <fieldset className="flex flex-col gap-2.5">
            <div className="flex items-center gap-3 pb-2 border-b border-gray-200 mb-1">
              <Checkbox id="grp2-all" checked="indeterminate" />
              <label
                htmlFor="grp2-all"
                className="text-sm font-semibold cursor-pointer select-none"
              >
                Select all
              </label>
            </div>
            {[
              { id: 'grp2-read', label: 'Read access', checked: true },
              { id: 'grp2-write', label: 'Write access', checked: false },
              { id: 'grp2-delete', label: 'Delete access', checked: false },
            ].map(({ id, label, checked }) => (
              <div key={id} className="flex items-center gap-3 pl-2">
                <Checkbox id={id} defaultChecked={checked} />
                <label htmlFor={id} className="text-sm font-medium cursor-pointer select-none">
                  {label}
                </label>
              </div>
            ))}
          </fieldset>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use fieldset + legend for any group of related checkboxes',
                body: 'fieldset semantically groups form controls and legend provides the group label. Screen readers announce the legend before each checkbox inside — users know what the group is about without you having to repeat it in every label.',
              },
              {
                title:
                  'Use indeterminate state for "select all" when only some children are checked',
                body: 'checked="indeterminate" clearly communicates partial selection. Toggling an indeterminate checkbox from unchecked should move to checked (all selected), not unchecked.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use a Checkbox group for mutually exclusive choices — use RadioGroup",
                body: 'If selecting one option should deselect others, RadioGroup is the correct component. Checkbox groups always allow multiple simultaneous selections.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Always use fieldset + legend — never just a heading or div',
                body: 'A div with a heading does not create a semantic association between the heading and the checkboxes inside. Without fieldset, screen readers cannot tell the user which group the checkbox belongs to.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Keep group legends short and descriptive',
                body: 'The legend is announced before every individual checkbox label — e.g. "Notification preferences, Email". Verbose legends become noise when read repeatedly.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<fieldset className="flex flex-col gap-2.5">
  <legend className="text-sm font-medium mb-3">Notification preferences</legend>
  <div className="flex items-center gap-3">
    <Checkbox id="email" defaultChecked />
    <label htmlFor="email" className="text-sm font-medium cursor-pointer select-none">
      Email
    </label>
  </div>
  <div className="flex items-center gap-3">
    <Checkbox id="sms" />
    <label htmlFor="sms" className="text-sm font-medium cursor-pointer select-none">
      SMS
    </label>
  </div>
</fieldset>

{/* Select all — indeterminate parent */}
<Checkbox id="select-all" checked="indeterminate" />`}</code>
      </pre>
    </div>
  ),
}
