'use client'

import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  Children,
  isValidElement,
} from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { useFieldContentContext } from '../Field/FieldContent'

// ─── Contexts ─────────────────────────────────────────────────────────────────

export const SliderContext = createContext({
  values: [0],
  variant: 'default',
  min: 0,
  max: 100,
})
export const SliderThumbContext = createContext({ value: 0, index: 0 })

export const useSliderContext = () => useContext(SliderContext)
export const useSliderThumbContext = () => useContext(SliderThumbContext)

// ─── Helpers ──────────────────────────────────────────────────────────────────

const snapToStep = (val, min, step) => Math.round((val - min) / step) * step + min
const clampVal = (val, min, max) => Math.max(min, Math.min(max, val))
const toPct = (val, min, max) => ((val - min) / (max - min)) * 100

// ─── CVA ──────────────────────────────────────────────────────────────────────

const trackRootClass = 'relative flex w-full touch-none select-none items-center py-3'

const trackBarClass = 'relative w-full grow overflow-hidden rounded-full bg-input h-1'

const rangeVariants = cva('absolute h-full', {
  variants: {
    variant: {
      default: 'bg-violet-600',
      error: 'bg-destructive',
      disabled: 'bg-muted-foreground/40',
    },
  },
  defaultVariants: { variant: 'default' },
})

const thumbVariants = cva(
  [
    'absolute top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 size-4',
    'block bg-white rounded-full border border-slate-200 shadow-sm',
    'transition-[box-shadow,border-color] duration-150 outline-none',
  ],
  {
    variants: {
      variant: {
        default:
          'border-slate-200 focus-visible:border-violet-500 focus-visible:ring-2 focus-visible:ring-violet-200',
        error: 'border-destructive/50 focus-visible:ring-2 focus-visible:ring-destructive/20',
        disabled: 'border-slate-100 shadow-none cursor-not-allowed opacity-60',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

const thumbConnectClasses = (thumbConnect, variant) => {
  if (variant === 'disabled') return ''
  const always = variant === 'error' ? 'border-destructive/70' : 'border-violet-500'
  const hover = variant === 'error' ? 'hover:border-destructive' : 'hover:border-violet-500'
  const active = variant === 'error' ? 'active:border-destructive' : 'active:border-violet-500'
  if (thumbConnect === 'both') return always
  if (thumbConnect === 'hover') return hover
  if (thumbConnect === 'drag') return active
  return ''
}

// ─── Inline tooltip ───────────────────────────────────────────────────────────

const InlineTooltip = ({ content }) => (
  <div
    className="absolute bottom-full left-1/2 mb-2.5 -translate-x-1/2 pointer-events-none"
    role="tooltip"
  >
    <div className="rounded-xl bg-white border border-slate-200 shadow-sm px-2.5 py-1 text-xs font-medium text-slate-700 whitespace-nowrap">
      {content}
    </div>
    <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-200" />
  </div>
)

// ─── Slider ───────────────────────────────────────────────────────────────────

const Slider = ({
  variant: variantProp,
  className,
  thumbConnect = 'both',
  showTooltip = false,
  tooltipFormat,
  startLabel,
  endLabel,
  marks,
  value,
  defaultValue = [50],
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled: disabledProp,
  children,
  ...props
}) => {
  const { id, descriptionId, errorId, hasError, disabled: ctxDisabled } = useFieldContentContext()

  const isDisabled = ctxDisabled || disabledProp
  const resolvedVariant = variantProp ?? (hasError ? 'error' : isDisabled ? 'disabled' : 'default')
  const isControlled = value !== undefined

  const [internalValues, setInternalValues] = useState(defaultValue)
  const currentValues = isControlled ? value : internalValues
  const valuesRef = useRef(currentValues)
  valuesRef.current = currentValues

  const rootRef = useRef(null)

  const updateValues = useCallback(
    (newVals) => {
      if (!isControlled) setInternalValues(newVals)
      onValueChange?.(newVals)
    },
    [isControlled, onValueChange]
  )

  const getValueFromClientX = useCallback(
    (clientX) => {
      const rect = rootRef.current?.getBoundingClientRect()
      if (!rect) return min
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      const raw = min + pct * (max - min)
      return clampVal(snapToStep(raw, min, step), min, max)
    },
    [min, max, step]
  )

  const startDrag = useCallback(
    (idx, e) => {
      if (isDisabled) return
      e.preventDefault()
      document.body.style.cursor = 'grabbing'

      const onMove = (moveEvent) => {
        const clientX = moveEvent.touches ? moveEvent.touches[0].clientX : moveEvent.clientX
        const newVal = getValueFromClientX(clientX)
        const newVals = [...valuesRef.current]
        newVals[idx] = newVal
        if (idx > 0) newVals[idx] = Math.max(newVals[idx], newVals[idx - 1])
        if (idx < newVals.length - 1) newVals[idx] = Math.min(newVals[idx], newVals[idx + 1])
        updateValues(newVals)
      }

      const onUp = () => {
        document.body.style.cursor = ''
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onUp)
        document.removeEventListener('touchmove', onMove)
        document.removeEventListener('touchend', onUp)
      }

      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onUp)
      document.addEventListener('touchmove', onMove, { passive: false })
      document.addEventListener('touchend', onUp)
    },
    [isDisabled, getValueFromClientX, updateValues]
  )

  const handleKeyDown = useCallback(
    (idx, e) => {
      if (isDisabled) return
      const cur = valuesRef.current[idx]
      let next = cur
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = cur - step
      else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = cur + step
      else if (e.key === 'PageDown') next = cur - step * 10
      else if (e.key === 'PageUp') next = cur + step * 10
      else if (e.key === 'Home') next = min
      else if (e.key === 'End') next = max
      else return
      e.preventDefault()
      const newVals = [...valuesRef.current]
      newVals[idx] = clampVal(snapToStep(next, min, step), min, max)
      if (idx > 0) newVals[idx] = Math.max(newVals[idx], newVals[idx - 1])
      if (idx < newVals.length - 1) newVals[idx] = Math.min(newVals[idx], newVals[idx + 1])
      updateValues(newVals)
    },
    [isDisabled, step, min, max, updateValues]
  )

  // Scan children for sub-components
  let tooltipChild = null
  let startLabelChild = null
  let endLabelChild = null
  const markChildren = []

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return
    const name = child.type?.displayName
    if (name === 'SliderTooltip') tooltipChild = child
    else if (name === 'SliderStartLabel') startLabelChild = child
    else if (name === 'SliderEndLabel') endLabelChild = child
    else if (name === 'SliderMark') markChildren.push(child)
  })

  const rangeStyle =
    currentValues.length === 1
      ? { left: '0%', width: `${toPct(currentValues[0], min, max)}%` }
      : {
          left: `${toPct(currentValues[0], min, max)}%`,
          width: `${toPct(currentValues[currentValues.length - 1], min, max) - toPct(currentValues[0], min, max)}%`,
        }

  return (
    <SliderContext.Provider value={{ values: currentValues, variant: resolvedVariant, min, max }}>
      <div className={cn('flex flex-col gap-1', className)}>
        <div className="flex items-center gap-2">
          {(startLabelChild || startLabel != null) && (
            <span className="shrink-0 text-muted-foreground text-xs">
              {startLabelChild ?? startLabel}
            </span>
          )}

          <div
            ref={rootRef}
            id={id}
            className={trackRootClass}
            aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ') || undefined}
            aria-invalid={hasError || undefined}
            {...props}
          >
            <div className={trackBarClass}>
              <div className={rangeVariants({ variant: resolvedVariant })} style={rangeStyle} />
            </div>

            {currentValues.map((thumbVal, idx) => (
              <SliderThumbContext.Provider key={idx} value={{ value: thumbVal, index: idx }}>
                <div
                  role="slider"
                  aria-valuemin={min}
                  aria-valuemax={max}
                  aria-valuenow={thumbVal}
                  aria-orientation="horizontal"
                  aria-disabled={isDisabled || undefined}
                  tabIndex={isDisabled ? -1 : 0}
                  className={cn(
                    thumbVariants({ variant: resolvedVariant }),
                    thumbConnectClasses(thumbConnect, resolvedVariant),
                    !isDisabled && 'cursor-grab'
                  )}
                  style={{ left: `${toPct(thumbVal, min, max)}%` }}
                  onMouseDown={!isDisabled ? (e) => startDrag(idx, e) : undefined}
                  onTouchStart={!isDisabled ? (e) => startDrag(idx, e) : undefined}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                >
                  {tooltipChild ??
                    (showTooltip && (
                      <InlineTooltip
                        content={tooltipFormat ? tooltipFormat(thumbVal) : String(thumbVal)}
                      />
                    ))}
                </div>
              </SliderThumbContext.Provider>
            ))}
          </div>

          {(endLabelChild || endLabel != null) && (
            <span className="shrink-0 text-muted-foreground text-xs">
              {endLabelChild ?? endLabel}
            </span>
          )}
        </div>

        {(markChildren.length > 0 || marks?.length > 0) && (
          <div className="relative w-full" style={{ paddingLeft: '8px', paddingRight: '8px' }}>
            {marks?.map((mark) => (
              <span
                key={mark.value}
                className="absolute -translate-x-1/2 text-muted-foreground text-xs"
                style={{ left: `${toPct(mark.value, min, max)}%` }}
              >
                {mark.label}
              </span>
            ))}
            {markChildren}
          </div>
        )}
      </div>
    </SliderContext.Provider>
  )
}

Slider.displayName = 'Slider'

export default Slider
