import { Checkbox } from './Checkbox'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Checkbox/Group',
}

export default meta

export const Group = {
  name: 'Group',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Render multiple checkboxes in a{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">fieldset</code> with a{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">legend</code> for semantic
        grouping. Each checkbox manages its own state independently.
      </p>

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

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<fieldset className="flex flex-col gap-2.5">
  <legend className="text-sm font-medium mb-3">Notification preferences</legend>
  <div className="flex items-center gap-3">
    <Checkbox id="email" defaultChecked />
    <label htmlFor="email" className="text-sm font-medium cursor-pointer select-none">Email</label>
  </div>
  <div className="flex items-center gap-3">
    <Checkbox id="sms" />
    <label htmlFor="sms" className="text-sm font-medium cursor-pointer select-none">SMS</label>
  </div>
</fieldset>`}</code>
      </pre>
    </div>
  ),
}
