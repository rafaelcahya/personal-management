import Slider from './Slider'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldError from '../Field/FieldError'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Slider/Error State',
}

export default meta

export const ErrorState = {
  name: 'Error State',
  render: () => (
    <div className="flex flex-col gap-8 p-8 max-w-sm">
      <div className="flex flex-col gap-3">
        <p className="text-xs text-gray-500 font-mono">variant="error" (explicit)</p>
        <Slider defaultValue={[30]} variant="error" />
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-xs text-gray-500 font-mono">Via FieldContent error prop</p>
        <FieldContent error="Value must be at least 50.">
          <FieldLabel>Minimum threshold</FieldLabel>
          <Slider defaultValue={[30]} showTooltip tooltipFormat={(v) => `${v}%`} />
          <FieldError />
        </FieldContent>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-xs text-gray-500 font-mono">Error range slider</p>
        <Slider
          defaultValue={[10, 40]}
          variant="error"
          showTooltip
          tooltipFormat={(v) => `${v}%`}
        />
      </div>
    </div>
  ),
}
