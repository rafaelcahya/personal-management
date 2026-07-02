import { Switch } from './Switch'
import FieldDescription from '../Field/FieldDescription'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Switch/With Label',
}

export default meta

const items = [
  {
    id: 'notif',
    label: 'Push notifications',
    desc: 'Receive alerts for new messages and activity.',
    checked: true,
  },
  { id: 'dark', label: 'Dark mode', desc: 'Use a dark background across the app.', checked: false },
  {
    id: 'sms',
    label: 'SMS alerts',
    desc: 'Disabled — not available in your region.',
    checked: false,
    disabled: true,
  },
]

export const WithLabel = {
  name: 'With Label',
  render: () => (
    <div className="flex flex-col items-center gap-8 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Link a label via <code className="font-mono bg-gray-100 px-1 rounded text-xs">htmlFor</code>{' '}
        so clicking it toggles the switch. Both themes work with the same label pattern.
      </p>

      <div className="flex flex-col gap-6 w-full max-w-sm">
        {['pill', 'track'].map((theme) => (
          <div key={theme} className="flex flex-col gap-3">
            <p className="text-xs font-mono text-violet-700">theme="{theme}"</p>
            <div className="flex flex-col gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              {items.map(({ id, label, desc, checked, disabled }) => (
                <div
                  key={`${theme}-${id}`}
                  className={`flex items-start justify-between gap-4 ${disabled ? 'opacity-50' : ''}`}
                >
                  <div className="flex flex-col gap-0.5">
                    <label
                      htmlFor={`${theme}-${id}`}
                      className={`text-sm font-medium select-none ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {label}
                    </label>
                    <FieldDescription>{desc}</FieldDescription>
                  </div>
                  <Switch
                    id={`${theme}-${id}`}
                    theme={theme}
                    defaultChecked={checked}
                    disabled={disabled}
                    className="mt-0.5 shrink-0"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<div className="flex items-start justify-between gap-4">
  <div className="flex flex-col gap-0.5">
    <label htmlFor="notif" className="text-sm font-medium cursor-pointer select-none">
      Push notifications
    </label>
    <FieldDescription>Receive alerts for new messages.</FieldDescription>
  </div>
  <Switch id="notif" theme="track" defaultChecked className="mt-0.5 shrink-0" />
</div>`}</code>
      </pre>
    </div>
  ),
}
