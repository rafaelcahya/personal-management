'use client'
import {
  Children,
  cloneElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

const DURATION_MAP = { fast: 100, default: 150, slow: 300, slower: 500 }

const variantClasses = {
  default: 'bg-popover text-popover-foreground border-border',
  info: 'bg-info/10 text-foreground border-info/20',
  success: 'bg-success-subtle text-foreground border-success/20',
  warning: 'bg-warning-subtle text-foreground border-warning/30',
  danger: 'bg-destructive-subtle text-foreground border-destructive/20',
}

const arrowFill = {
  default: 'hsl(var(--popover))',
  info: 'var(--color-info-subtle)',
  success: 'var(--color-success-subtle)',
  warning: 'var(--color-warning-subtle)',
  danger: 'var(--color-destructive-subtle)',
}

function computeFixedPosition(side, align, sideOffset, rect) {
  const { top, right, bottom, left, width, height } = rect
  const vw = window.innerWidth
  const vh = window.innerHeight

  const sidePos = {
    top: { bottom: vh - top + sideOffset },
    bottom: { top: bottom + sideOffset },
    left: { right: vw - left + sideOffset },
    right: { left: right + sideOffset },
  }[side] ?? { bottom: vh - top + sideOffset }

  const alignPos = {
    top: {
      start: { left },
      center: { left: left + width / 2, transform: 'translateX(-50%)' },
      end: { right: vw - right },
    },
    bottom: {
      start: { left },
      center: { left: left + width / 2, transform: 'translateX(-50%)' },
      end: { right: vw - right },
    },
    left: {
      start: { top },
      center: { top: top + height / 2, transform: 'translateY(-50%)' },
      end: { bottom: vh - bottom },
    },
    right: {
      start: { top },
      center: { top: top + height / 2, transform: 'translateY(-50%)' },
      end: { bottom: vh - bottom },
    },
  }[side]?.[align] ?? { left: left + width / 2, transform: 'translateX(-50%)' }

  return { ...sidePos, ...alignPos }
}

function getAnimClasses(animation, phase) {
  if (animation === 'none') return ''
  const map = {
    fade: ['animate-in fade-in-0', 'animate-out fade-out-0'],
    zoom: ['animate-in zoom-in-95 fade-in-0', 'animate-out zoom-out-95 fade-out-0'],
    'slide-up': [
      'animate-in slide-in-from-bottom-1 fade-in-0',
      'animate-out slide-out-to-bottom-1 fade-out-0',
    ],
    'slide-down': [
      'animate-in slide-in-from-top-1 fade-in-0',
      'animate-out slide-out-to-top-1 fade-out-0',
    ],
  }
  const [enter, exit] = map[animation] ?? map.fade
  return phase === 'open' ? enter : exit
}

const TooltipCtx = createContext({
  isOpen: false,
  show: () => {},
  hide: () => {},
  cancelHide: () => {},
  wrapperEl: null,
  setWrapperEl: () => {},
})

function Tooltip({ children, open, onOpenChange, defaultOpen = false, delayDuration = 700 }) {
  const isControlled = open !== undefined
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isOpen = isControlled ? open : internalOpen
  const openTimer = useRef(null)
  const closeTimer = useRef(null)
  const [wrapperEl, setWrapperEl] = useState(null)

  const applyOpen = (v) => {
    if (!isControlled) setInternalOpen(v)
    onOpenChange?.(v)
  }

  const show = () => {
    clearTimeout(closeTimer.current)
    openTimer.current = setTimeout(() => applyOpen(true), delayDuration)
  }

  const hide = () => {
    clearTimeout(openTimer.current)
    closeTimer.current = setTimeout(() => applyOpen(false), 100)
  }

  const cancelHide = () => clearTimeout(closeTimer.current)

  return (
    <TooltipCtx.Provider value={{ isOpen, show, hide, cancelHide, wrapperEl, setWrapperEl }}>
      {children}
    </TooltipCtx.Provider>
  )
}

function TooltipTrigger({ asChild, children, ...props }) {
  const { show, hide, setWrapperEl } = useContext(TooltipCtx)

  let trigger
  if (asChild) {
    const child = Children.only(children)
    trigger = cloneElement(child, {
      onMouseEnter: (e) => {
        show()
        child.props.onMouseEnter?.(e)
      },
      onMouseLeave: (e) => {
        hide()
        child.props.onMouseLeave?.(e)
      },
      onFocus: (e) => {
        show()
        child.props.onFocus?.(e)
      },
      onBlur: (e) => {
        hide()
        child.props.onBlur?.(e)
      },
    })
  } else {
    trigger = (
      <span onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
        {children}
      </span>
    )
  }

  return (
    <span ref={setWrapperEl} className="relative inline-block" {...props}>
      {trigger}
    </span>
  )
}

function TooltipContent({
  side = 'top',
  align = 'center',
  sideOffset = 6,
  animation = 'fade',
  duration = 'default',
  showArrow = false,
  variant = 'default',
  className,
  children,
  ...props
}) {
  const { isOpen, hide, cancelHide, wrapperEl } = useContext(TooltipCtx)
  const animMs = typeof duration === 'number' ? duration : (DURATION_MAP[duration] ?? 150)
  const [phase, setPhase] = useState('open')
  const [alive, setAlive] = useState(false)
  const aliveRef = useRef(false)
  const closeTimer = useRef(null)
  const [posStyle, setPosStyle] = useState({})

  const updatePosition = useCallback(() => {
    if (!wrapperEl) return
    const rect = wrapperEl.getBoundingClientRect()
    setPosStyle(computeFixedPosition(side, align, sideOffset, rect))
  }, [wrapperEl, side, align, sideOffset])

  useEffect(() => {
    if (isOpen && wrapperEl) {
      clearTimeout(closeTimer.current)
      setPhase('open')
      setAlive(true)
      aliveRef.current = true
      updatePosition()
    } else if (!isOpen && aliveRef.current) {
      setPhase('closing')
      closeTimer.current = setTimeout(() => {
        setAlive(false)
        aliveRef.current = false
      }, animMs)
    }
    return () => clearTimeout(closeTimer.current)
  }, [isOpen, wrapperEl, animMs, updatePosition])

  useEffect(() => {
    if (!alive) return
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [alive, updatePosition])

  if (!alive || !wrapperEl) return null

  const animClass = getAnimClasses(animation, phase)
  const durationStyle = animation !== 'none' ? { animationDuration: `${animMs}ms` } : undefined

  return createPortal(
    <div style={{ position: 'fixed', zIndex: 9999, pointerEvents: 'none', ...posStyle }}>
      <div
        role="tooltip"
        style={durationStyle}
        className={cn(
          'relative w-max max-w-xs rounded-md border px-3 py-1.5 text-xs leading-relaxed shadow-md pointer-events-auto',
          animClass,
          variantClasses[variant] ?? variantClasses.default,
          className
        )}
        onMouseEnter={cancelHide}
        onMouseLeave={hide}
        {...props}
      >
        {children}
        {showArrow && <TooltipArrow side={side} variant={variant} />}
      </div>
    </div>,
    document.body
  )
}

function TooltipArrow({ side, variant = 'default' }) {
  const fill = arrowFill[variant] ?? arrowFill.default
  const isHorizontal = side === 'top' || side === 'bottom'
  const [w, h] = isHorizontal ? [10, 5] : [5, 10]

  const path =
    {
      top: 'M0,0 L10,0 L5,5Z',
      bottom: 'M0,5 L10,5 L5,0Z',
      left: 'M0,0 L5,5 L0,10Z',
      right: 'M5,0 L0,5 L5,10Z',
    }[side] ?? 'M0,0 L10,0 L5,5Z'

  const pos =
    {
      top: 'absolute top-full left-1/2 -translate-x-1/2',
      bottom: 'absolute bottom-full left-1/2 -translate-x-1/2',
      left: 'absolute top-1/2 left-full -translate-y-1/2',
      right: 'absolute top-1/2 right-full -translate-y-1/2',
    }[side] ?? 'absolute top-full left-1/2 -translate-x-1/2'

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className={pos} aria-hidden="true">
      <path d={path} fill={fill} />
    </svg>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent }
