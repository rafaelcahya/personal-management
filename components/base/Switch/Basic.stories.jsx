import { Switch } from './Switch'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Switch/Basic',
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

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Switch has two visual themes:{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">pill</code> (classic filled
        container) and <code className="font-mono bg-gray-100 px-1 rounded text-xs">track</code>{' '}
        (thin track with a floating thumb). Use{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">defaultChecked</code> for
        uncontrolled or <code className="font-mono bg-gray-100 px-1 rounded text-xs">checked</code>{' '}
        + <code className="font-mono bg-gray-100 px-1 rounded text-xs">onCheckedChange</code> for
        controlled.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">theme="pill" — off and on</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80 flex items-center gap-10">
          <div className="flex flex-col items-center gap-2">
            <Switch />
            <span className="text-xs text-gray-400 font-mono">off</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Switch defaultChecked />
            <span className="text-xs text-gray-400 font-mono">on</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">theme="track" — off and on</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80 flex items-center gap-10">
          <div className="flex flex-col items-center gap-2">
            <Switch theme="track" />
            <span className="text-xs text-gray-400 font-mono">off</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Switch theme="track" defaultChecked />
            <span className="text-xs text-gray-400 font-mono">on</span>
          </div>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use Switch for settings that take immediate effect without a submit button',
                body: 'Dark mode, push notifications, and similar persistent app settings are correct Switch use cases. The user expects the change to apply the moment they toggle.',
              },
              {
                title: 'Use pill theme as the default — track for a lighter, more modern feel',
                body: 'Pill is higher-contrast and more universally recognized. Track fits well in dense settings panels where a lighter visual weight is preferred.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title:
                  "Don't use Switch when the value must be submitted with a form — use Checkbox",
                body: 'If the user must click a Save button for the change to apply, Switch sends the wrong signal. Users expect the change to be instant.',
              },
              {
                title: "Don't use Switch for more than two states — use RadioGroup or Select",
                body: 'Switch is binary — on or off. If the user chooses between three or more options (Off / Low / High), use RadioGroup or Select instead.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Use Controller from react-hook-form — onCheckedChange returns a boolean, not a native event',
                body: 'register() cannot capture the value from onCheckedChange. Use Controller to bridge Switch with react-hook-form when the value needs to be collected in a form.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Pill (default) */}
<Switch />
<Switch defaultChecked />

{/* Track */}
<Switch theme="track" />
<Switch theme="track" defaultChecked />

{/* Controlled */}
<Switch checked={checked} onCheckedChange={setChecked} />`}</code>
      </pre>
    </div>
  ),
}
