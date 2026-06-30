import Slider from './Slider'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Slider/Disabled',
}

export default meta

export const Disabled = {
  name: 'Disabled',
  render: () => (
    <div className="flex flex-col gap-8 p-8 max-w-sm">
      <div className="flex flex-col gap-3">
        <p className="text-xs text-gray-500 font-mono">variant="disabled" (explicit)</p>
        <Slider defaultValue={[40]} variant="disabled" />
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-xs text-gray-500 font-mono">disabled prop</p>
        <Slider defaultValue={[60]} disabled />
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-xs text-gray-500 font-mono">Disabled with tooltip</p>
        <Slider defaultValue={[50]} disabled showTooltip tooltipFormat={(v) => `${v}%`} />
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-xs text-gray-500 font-mono">Disabled range</p>
        <Slider defaultValue={[20, 70]} disabled />
      </div>
    </div>
  ),
}
