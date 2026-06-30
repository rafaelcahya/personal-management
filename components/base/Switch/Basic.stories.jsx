import { Switch } from '@/components/ui/switch'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Switch/Basic',
}

export default meta

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col items-center gap-8 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Switch has two themes:{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">pill</code> (classic container)
        and <code className="font-mono bg-gray-100 px-1 rounded text-xs">track</code> (thin track,
        floating thumb). Both have off and on states.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        {['pill', 'track'].map((theme) => (
          <div key={theme} className="flex flex-col gap-3">
            <p className="text-xs font-mono text-violet-700">theme="{theme}"</p>
            <div className="flex items-center gap-10 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex flex-col items-center gap-2">
                <Switch theme={theme} />
                <span className="text-xs text-gray-400 font-mono">off</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Switch theme={theme} defaultChecked />
                <span className="text-xs text-gray-400 font-mono">on</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Pill (default) */}
<Switch />
<Switch defaultChecked />

{/* Track */}
<Switch theme="track" />
<Switch theme="track" defaultChecked />

{/* Controlled */}
<Switch theme="track" checked={checked} onCheckedChange={setChecked} />`}</code>
      </pre>
    </div>
  ),
}
