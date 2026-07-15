import { Switch } from './Switch'
import FieldDescription from '../Field/FieldDescription'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Switch/With Label',
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

export const WithLabel = {
  name: 'With Label',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Link a label via <code className="font-mono bg-gray-100 px-1 rounded text-xs">htmlFor</code>{' '}
        so clicking the label text toggles the switch. Place the switch on the trailing edge so the
        label is read first. Add{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldDescription</code> below
        the label for supporting copy.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">label only — settings row</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80 flex flex-col gap-3">
          {[
            { id: 'wl-notif', label: 'Push notifications', checked: true },
            { id: 'wl-email', label: 'Email digest', checked: false },
          ].map(({ id, label, checked }) => (
            <div key={id} className="flex items-center justify-between gap-4">
              <label htmlFor={id} className="text-sm font-medium cursor-pointer select-none">
                {label}
              </label>
              <Switch id={id} defaultChecked={checked} />
            </div>
          ))}
          <div className="flex items-center justify-between gap-4 opacity-50">
            <label htmlFor="wl-sms" className="text-sm font-medium cursor-not-allowed select-none">
              SMS alerts
            </label>
            <Switch id="wl-sms" disabled />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">with description — settings panel</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80 flex flex-col gap-4">
          {[
            {
              id: 'desc-notif',
              label: 'Push notifications',
              desc: 'Receive alerts for new messages and activity.',
              checked: true,
            },
            {
              id: 'desc-dark',
              label: 'Dark mode',
              desc: 'Use a dark background across the app.',
              checked: false,
            },
          ].map(({ id, label, desc, checked }) => (
            <div key={id} className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-0.5">
                <label htmlFor={id} className="text-sm font-medium cursor-pointer select-none">
                  {label}
                </label>
                <FieldDescription className="text-xs text-slate-400">{desc}</FieldDescription>
              </div>
              <Switch id={id} defaultChecked={checked} className="mt-0.5 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Place the switch on the trailing edge of the label row',
                body: 'The label should be read before the control. Left-align the label and right-align the switch so the eye flows naturally from description to toggle.',
              },
              {
                title: 'Add FieldDescription for settings that need supporting context',
                body: 'A brief description below the label ("Receive alerts for new messages") prevents ambiguity when the label alone is not self-explanatory.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'Always link a visible label via htmlFor so the label click toggles the switch',
                body: 'A Switch with no label is inaccessible. The htmlFor association also enlarges the click target — users can click the label text instead of the small switch element.',
              },
              {
                title: 'Use descriptive labels — never just "Enable" without context',
                body: 'Screen readers announce the label when the switch receives focus. "Enable" alone gives no context. Write "Enable push notifications" or use a visible label that makes the setting clear.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Apply opacity-50 to the wrapper row when disabled, not just the Switch',
                body: 'Switch already applies opacity internally, but the label must also dim. Wrap both the label and Switch in a div and apply opacity-50 to the wrapper for the full row effect.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Label only */}
<div className="flex items-center justify-between gap-4">
  <label htmlFor="notif" className="text-sm font-medium cursor-pointer select-none">
    Push notifications
  </label>
  <Switch id="notif" defaultChecked />
</div>

{/* With description */}
<div className="flex items-start justify-between gap-4">
  <div className="flex flex-col gap-0.5">
    <label htmlFor="dark" className="text-sm font-medium cursor-pointer select-none">
      Dark mode
    </label>
    <FieldDescription className="text-xs text-slate-400">
      Use a dark background across the app.
    </FieldDescription>
  </div>
  <Switch id="dark" className="mt-0.5 shrink-0" />
</div>`}</code>
      </pre>
    </div>
  ),
}
