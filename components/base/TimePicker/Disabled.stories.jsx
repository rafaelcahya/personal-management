import TimePicker from './TimePicker'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/TimePicker/Disabled',
}

export default meta

export const Disabled = {
  name: 'Disabled',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Use the <code className="font-mono bg-gray-100 px-1 rounded text-xs">disabled</code> prop to
        prevent interaction. Works both standalone and inside{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> — the field
        inherits disabled state from context automatically.
      </p>

      <div className="flex flex-col gap-4 w-80">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-violet-700">disabled — no value</span>
          <TimePicker disabled placeholder="Pick a time" />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-violet-700">disabled — with value</span>
          <TimePicker disabled value="14:30:45" />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-violet-700">
            Via FieldContent disabled prop
          </span>
          <FieldContent size="base" disabled>
            <FieldLabel>Start time</FieldLabel>
            <TimePicker value="14:30:45" />
          </FieldContent>
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Standalone — disabled prop */}
<TimePicker disabled value={time} onChange={setTime} />

{/* Via FieldContent — all children inherit disabled */}
<FieldContent size="base" disabled>
  <FieldLabel>Start time</FieldLabel>
  <TimePicker value={time} onChange={setTime} />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
