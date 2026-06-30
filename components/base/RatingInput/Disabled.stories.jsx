import RatingInput from './RatingInput'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/RatingInput/Disabled',
}

export default meta

export const Disabled = {
  name: 'Disabled',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Use <code className="font-mono bg-gray-100 px-1 rounded text-xs">disabled</code> to prevent
        interaction. The component is muted and non-clickable. Also inherits from{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> context
        automatically.
      </p>

      <div className="flex flex-col gap-4 w-80">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-violet-700">disabled — no value</span>
          <RatingInput disabled />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-violet-700">disabled — with value</span>
          <RatingInput disabled value={3} />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-violet-700">disabled — number style</span>
          <RatingInput disabled style="number" value={4} />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-violet-700">
            Via FieldContent disabled prop
          </span>
          <FieldContent size="base" disabled>
            <FieldLabel>Run effort</FieldLabel>
            <RatingInput value={3} />
          </FieldContent>
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<RatingInput disabled value={val} onChange={setVal} />

<FieldContent size="base" disabled>
  <FieldLabel>Run effort</FieldLabel>
  <RatingInput value={val} onChange={setVal} />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
