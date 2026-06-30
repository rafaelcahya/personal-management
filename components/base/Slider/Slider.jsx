'use client'

import { createContext, useContext, useState, Children, isValidElement } from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { cva } from 'class-variance-authority'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { useFieldContentContext } from '../Field/FieldContent'

// ─── Contexts ─────────────────────────────────────────────────────────────────

export const SliderContext = createContext({
  values: [0],
  size: 'base',
  variant: 'default',
  min: 0,
  max: 100,
})
export const SliderThumbContext = createContext({ value: 0, index: 0 })

export const useSliderContext = () => useContext(SliderContext)
export const useSliderThumbContext = () => useContext(SliderThumbContext)

// ─── CVA ─────────────────────────────────────────────────────────────────────

const trackRootVariants = cva('relative flex w-full touch-none select-none items-center', {
  variants: {
    size: {
      xs: 'py-2',
      sm: 'py-2.5',
      base: 'py-3',
      md: 'py-3.5',
      lg: 'py-4',
      xl: 'py-5',
    },
  },
  defaultVariants: { size: 'base' },
})

const trackBarVariants = cva('relative w-full grow overflow-hidden rounded-full bg-input', {
  variants: {
    size: {
      xs: 'h-[2px]',
      sm: 'h-[3px]',
      base: 'h-1',
      md: 'h-1.5',
      lg: 'h-2',
      xl: 'h-2.5',
    },
  },
  defaultVariants: { size: 'base' },
})

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
    'relative block',
    'bg-white rounded-full border border-slate-200 shadow-sm',
    'transition-[box-shadow,border-color] duration-150',
    'outline-none',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      size: {
        xs: 'size-3',
        sm: 'size-3.5',
        base: 'size-4',
        md: 'size-[18px]',
        lg: 'size-5',
        xl: 'size-6',
      },
      variant: {
        default:
          'border-slate-200 focus-visible:border-violet-500 focus-visible:ring-2 focus-visible:ring-violet-200',
        error: 'border-destructive/50 focus-visible:ring-2 focus-visible:ring-destructive/20',
        disabled: 'border-slate-100 shadow-none cursor-not-allowed opacity-60',
      },
    },
    defaultVariants: { size: 'base', variant: 'default' },
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

const labelSizeMap = {
  xs: 'text-[10px]',
  sm: 'text-xs',
  base: 'text-xs',
  md: 'text-sm',
  lg: 'text-sm',
  xl: 'text-sm',
}

// ─── Inline tooltip (used when showTooltip prop is set) ───────────────────────

const InlineTooltip = ({ content }) => (
  <div className="absolute bottom-full left-1/2 mb-2.5 -translate-x-1/2" role="tooltip">
    <div className="rounded-xl bg-white border border-slate-200 shadow-sm px-2.5 py-1 text-xs font-medium text-slate-700 whitespace-nowrap">
      {content}
    </div>
    <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-200" />
  </div>
)

// ─── Slider ───────────────────────────────────────────────────────────────────

const Slider = ({
  variant: variantProp,
  size: sizeProp,
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
  children,
  ...props
}) => {
  const {
    id,
    descriptionId,
    errorId,
    hasError,
    disabled: ctxDisabled,
    size: ctxSize,
  } = useFieldContentContext()

  const resolvedSize = sizeProp ?? ctxSize ?? 'base'
  const isDisabled = ctxDisabled || props.disabled
  const resolvedVariant = variantProp ?? (hasError ? 'error' : isDisabled ? 'disabled' : 'default')
  const isControlled = value !== undefined

  // Track current values to feed into context (for tooltip sub-component)
  const [trackedValues, setTrackedValues] = useState(isControlled ? value : defaultValue)

  const handleValueChange = (newValues) => {
    setTrackedValues(newValues)
    onValueChange?.(newValues)
  }

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

  const currentValues = isControlled ? value : trackedValues

  return (
    <SliderContext.Provider
      value={{ values: currentValues, size: resolvedSize, variant: resolvedVariant, min, max }}
    >
      <div className={twMerge(clsx('flex flex-col gap-1', className))}>
        <div className="flex items-center gap-2">
          {/* Start label */}
          {(startLabelChild || startLabel != null) && (
            <span className={clsx('shrink-0 text-muted-foreground', labelSizeMap[resolvedSize])}>
              {startLabelChild ?? startLabel}
            </span>
          )}

          <SliderPrimitive.Root
            id={id}
            className={trackRootVariants({ size: resolvedSize })}
            value={isControlled ? value : undefined}
            defaultValue={!isControlled ? defaultValue : undefined}
            min={min}
            max={max}
            disabled={isDisabled}
            onValueChange={handleValueChange}
            aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ') || undefined}
            aria-invalid={hasError || undefined}
            {...props}
          >
            <SliderPrimitive.Track className={trackBarVariants({ size: resolvedSize })}>
              <SliderPrimitive.Range className={rangeVariants({ variant: resolvedVariant })} />
            </SliderPrimitive.Track>

            {currentValues.map((thumbVal, idx) => (
              <SliderThumbContext.Provider key={idx} value={{ value: thumbVal, index: idx }}>
                <SliderPrimitive.Thumb
                  className={twMerge(
                    thumbVariants({ size: resolvedSize, variant: resolvedVariant }),
                    thumbConnectClasses(thumbConnect, resolvedVariant)
                  )}
                >
                  {/* Sub-component tooltip takes priority over props */}
                  {tooltipChild ??
                    (showTooltip && (
                      <InlineTooltip
                        content={tooltipFormat ? tooltipFormat(thumbVal) : String(thumbVal)}
                      />
                    ))}
                </SliderPrimitive.Thumb>
              </SliderThumbContext.Provider>
            ))}
          </SliderPrimitive.Root>

          {/* End label */}
          {(endLabelChild || endLabel != null) && (
            <span className={clsx('shrink-0 text-muted-foreground', labelSizeMap[resolvedSize])}>
              {endLabelChild ?? endLabel}
            </span>
          )}
        </div>

        {/* Marks row */}
        {(markChildren.length > 0 || marks?.length > 0) && (
          <div className="relative w-full" style={{ paddingLeft: '8px', paddingRight: '8px' }}>
            {marks?.map((mark) => (
              <span
                key={mark.value}
                className={clsx(
                  'absolute -translate-x-1/2 text-muted-foreground',
                  labelSizeMap[resolvedSize]
                )}
                style={{ left: `${((mark.value - min) / (max - min)) * 100}%` }}
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
