import Slider from './Slider'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Slider/Basic',
}

export default meta

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col gap-10 p-8 max-w-sm">
      <div className="flex flex-col gap-6">
        <p className="text-xs text-gray-500 font-mono">Uncontrolled (defaultValue)</p>
        <Slider defaultValue={[40]} />
      </div>

      <div className="flex flex-col gap-6">
        <p className="text-xs text-gray-500 font-mono">With tooltip (props shortcut)</p>
        <Slider defaultValue={[60]} showTooltip tooltipFormat={(v) => `${v}%`} />
      </div>

      <div className="flex flex-col gap-6">
        <p className="text-xs text-gray-500 font-mono">Range slider (two thumbs)</p>
        <Slider defaultValue={[20, 75]} showTooltip tooltipFormat={(v) => `${v}%`} />
      </div>

      <div className="flex flex-col gap-6">
        <p className="text-xs text-gray-500 font-mono">With start/end labels</p>
        <Slider defaultValue={[50]} startLabel="0" endLabel="100" />
      </div>

      <div className="flex flex-col gap-6">
        <p className="text-xs text-gray-500 font-mono">With marks (props)</p>
        <Slider
          defaultValue={[50]}
          marks={[
            { value: 0, label: '0' },
            { value: 25, label: '25' },
            { value: 50, label: '50' },
            { value: 75, label: '75' },
            { value: 100, label: '100' },
          ]}
          className="mb-4"
        />
      </div>
    </div>
  ),
}
