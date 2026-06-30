'use client'

import { useSliderThumbContext } from './Slider'

const SliderTooltip = ({ children }) => {
  const { value } = useSliderThumbContext()
  const content = typeof children === 'function' ? children(value) : children

  return (
    <div className="absolute bottom-full left-1/2 mb-2.5 -translate-x-1/2" role="tooltip">
      <div className="rounded-xl bg-white border border-slate-200 shadow-sm px-2.5 py-1 text-xs font-medium text-slate-700 whitespace-nowrap">
        {content}
      </div>
      <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-200" />
    </div>
  )
}

SliderTooltip.displayName = 'SliderTooltip'

export default SliderTooltip
