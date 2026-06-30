import { Switch } from '@/components/ui/switch'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Switch/Disabled',
}

export default meta

export const Disabled = {
  name: 'Disabled',
  render: () => (
    <div className="flex flex-col items-center gap-8 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">disabled</code> to prevent
        interaction. Apply{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">opacity-50</code> to the
        wrapping row so the entire item reads as disabled.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        {['pill', 'track'].map((theme) => (
          <div key={theme} className="flex flex-col gap-3">
            <p className="text-xs font-mono text-violet-700">theme="{theme}"</p>
            <div className="flex items-center gap-10 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex flex-col items-center gap-2 opacity-50">
                <Switch theme={theme} disabled />
                <span className="text-xs text-gray-400 font-mono">disabled off</span>
              </div>
              <div className="flex flex-col items-center gap-2 opacity-50">
                <Switch theme={theme} disabled defaultChecked />
                <span className="text-xs text-gray-400 font-mono">disabled on</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<div className="flex items-center justify-between gap-4 opacity-50">
  <label htmlFor="feature" className="text-sm font-medium cursor-not-allowed select-none">
    Feature unavailable
  </label>
  <Switch id="feature" theme="track" disabled />
</div>`}</code>
      </pre>
    </div>
  ),
}
