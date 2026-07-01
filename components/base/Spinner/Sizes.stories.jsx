import { Spinner } from './Spinner'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Spinner/Sizes' }
export default meta

export const Sizes = {
  name: 'Sizes',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-lg">
      <p className="text-sm text-gray-500 leading-relaxed">
        Five sizes available via the{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">size</code> prop.
      </p>

      <div className="flex items-center gap-6">
        {[
          { size: 'xs', label: 'xs', dim: '12px' },
          { size: 'sm', label: 'sm', dim: '16px' },
          { size: 'default', label: 'default', dim: '20px' },
          { size: 'lg', label: 'lg', dim: '28px' },
          { size: 'xl', label: 'xl', dim: '40px' },
        ].map(({ size, label, dim }) => (
          <div key={size} className="flex flex-col items-center gap-3">
            <Spinner size={size} />
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-xs font-medium text-gray-700">{label}</span>
              <span className="text-[10px] text-gray-400">{dim}</span>
            </div>
          </div>
        ))}
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`<Spinner size="xs" />
<Spinner size="sm" />
<Spinner size="default" />  {/* default */}
<Spinner size="lg" />
<Spinner size="xl" />`}</code>
      </pre>
    </div>
  ),
}
