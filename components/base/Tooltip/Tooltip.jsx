'use client'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '@/lib/utils'

const durationPresets = {
  fast: 100,
  default: 150,
  slow: 300,
  slower: 500,
}

function resolveDuration(duration) {
  if (typeof duration === 'string') return durationPresets[duration] ?? 150
  return duration
}

const variantClasses = {
  default: { content: 'bg-white border-slate-200 text-slate-900', arrow: 'fill-slate-200' },
  info: { content: 'bg-blue-50 border-blue-200 text-blue-900', arrow: 'fill-blue-200' },
  success: {
    content: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    arrow: 'fill-emerald-200',
  },
  warning: { content: 'bg-amber-50 border-amber-200 text-amber-900', arrow: 'fill-amber-200' },
  danger: { content: 'bg-red-50 border-red-200 text-red-900', arrow: 'fill-red-200' },
}

const animationClasses = {
  none: [],
  fade: [
    'data-[state=delayed-open]:fade-in-0 data-[state=instant-open]:fade-in-0 data-[state=closed]:fade-out-0',
  ],
  zoom: [
    'data-[state=delayed-open]:zoom-in-95 data-[state=instant-open]:zoom-in-95 data-[state=closed]:zoom-out-95',
    'data-[state=delayed-open]:fade-in-0 data-[state=instant-open]:fade-in-0 data-[state=closed]:fade-out-0',
  ],
  'slide-up': [
    'data-[state=delayed-open]:slide-in-from-bottom-2 data-[state=instant-open]:slide-in-from-bottom-2 data-[state=closed]:slide-out-to-bottom-2',
    'data-[state=delayed-open]:fade-in-0 data-[state=instant-open]:fade-in-0 data-[state=closed]:fade-out-0',
  ],
  'slide-down': [
    'data-[state=delayed-open]:slide-in-from-top-2 data-[state=instant-open]:slide-in-from-top-2 data-[state=closed]:slide-out-to-top-2',
    'data-[state=delayed-open]:fade-in-0 data-[state=instant-open]:fade-in-0 data-[state=closed]:fade-out-0',
  ],
}

function Tooltip({ delayDuration = 300, ...props }) {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root {...props} />
    </TooltipPrimitive.Provider>
  )
}

function TooltipTrigger(props) {
  return <TooltipPrimitive.Trigger {...props} />
}

function TooltipContent({
  className,
  children,
  side = 'top',
  align = 'center',
  sideOffset = 6,
  animation = 'fade',
  duration = 'default',
  showArrow = false,
  variant = 'default',
  ...props
}) {
  const resolvedDuration = resolveDuration(duration)
  const vc = variantClasses[variant] ?? variantClasses.default
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        side={side}
        align={align}
        sideOffset={sideOffset}
        style={animation !== 'none' ? { animationDuration: `${resolvedDuration}ms` } : undefined}
        className={cn(
          'z-50 px-3 py-1.5 text-xs rounded-lg border shadow-sm',
          vc.content,
          animation !== 'none' &&
            'data-[state=delayed-open]:animate-in data-[state=instant-open]:animate-in data-[state=closed]:animate-out',
          ...animationClasses[animation],
          className
        )}
        {...props}
      >
        {children}
        {showArrow && <TooltipPrimitive.Arrow width={12} height={6} className={vc.arrow} />}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent }
