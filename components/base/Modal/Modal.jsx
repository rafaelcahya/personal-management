'use client'
import { createElement, createContext, useContext } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const ModalVariantContext = createContext({ variant: 'default', borderColor: undefined })

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[calc(100vw-2rem)] h-[calc(100vh-2rem)]',
}

const radiusClasses = {
  none: 'rounded-none',
  xs: 'rounded-sm',
  sm: 'rounded',
  base: 'rounded-md',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  xl: 'rounded-2xl',
  full: 'rounded-3xl',
}

const pxClasses = {
  0: 'px-0',
  1: 'px-1',
  2: 'px-2',
  3: 'px-3',
  4: 'px-4',
  5: 'px-5',
  6: 'px-6',
  7: 'px-7',
  8: 'px-8',
  10: 'px-10',
  12: 'px-12',
}
const pyClasses = {
  0: 'py-0',
  1: 'py-1',
  2: 'py-2',
  3: 'py-3',
  4: 'py-4',
  5: 'py-5',
  6: 'py-6',
  7: 'py-7',
  8: 'py-8',
  10: 'py-10',
  12: 'py-12',
}

function resolvePadding(padding) {
  if (!padding) return []
  return [
    padding.x != null ? pxClasses[padding.x] : null,
    padding.y != null ? pyClasses[padding.y] : null,
  ].filter(Boolean)
}

const durationPresets = {
  fast: 100,
  default: 200,
  slow: 400,
  slower: 700,
}

function resolveDuration(duration) {
  if (typeof duration === 'string') return durationPresets[duration] ?? 200
  return duration
}

const animationClasses = {
  none: [],
  zoom: [
    'data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95',
    'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
  ],
  fade: ['data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0'],
  'slide-up': [
    'data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:slide-out-to-bottom-4',
    'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
  ],
  'slide-down': [
    'data-[state=open]:slide-in-from-top-4 data-[state=closed]:slide-out-to-top-4',
    'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
  ],
}

function Modal(props) {
  return <DialogPrimitive.Root {...props} />
}

function ModalTrigger(props) {
  return <DialogPrimitive.Trigger {...props} />
}

function ModalClose(props) {
  return <DialogPrimitive.Close {...props} />
}

function ModalOverlay({ className, opacity = 50, ...props }) {
  return (
    <DialogPrimitive.Overlay
      style={{ backgroundColor: `rgba(0,0,0,${opacity / 100})` }}
      className={cn(
        'fixed inset-0 z-50 backdrop-blur-sm',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'duration-200',
        className
      )}
      {...props}
    />
  )
}

function ModalContent({
  className,
  children,
  size = 'md',
  radius = 'lg',
  animation = 'zoom',
  duration = 'default',
  showCloseButton = true,
  closeOnOverlayClick = true,
  overlayOpacity = 50,
  variant = 'default',
  borderColor,
  ...props
}) {
  const resolvedDuration = resolveDuration(duration)
  return (
    <ModalVariantContext.Provider value={{ variant, borderColor }}>
      <DialogPrimitive.Portal>
        <ModalOverlay opacity={overlayOpacity} />
        {/* pointer-events-none so backdrop clicks pass through to the overlay */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <DialogPrimitive.Content
            style={
              animation !== 'none' ? { animationDuration: `${resolvedDuration}ms` } : undefined
            }
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
              if (!closeOnOverlayClick) e.preventDefault()
            }}
            className={cn(
              'pointer-events-auto relative',
              'w-full bg-background border shadow-xl',
              'flex flex-col',
              variant === 'default' && 'gap-4 p-6 overflow-y-auto',
              variant === 'bordered' && 'gap-0 p-0 overflow-hidden',
              animation !== 'none' &&
                'data-[state=open]:animate-in data-[state=closed]:animate-out',
              ...animationClasses[animation],
              sizeClasses[size],
              radiusClasses[radius],
              className
            )}
            {...props}
          >
            {showCloseButton && (
              <DialogPrimitive.Close className="absolute top-4 right-4 z-10 flex items-center justify-center w-7 h-7 rounded-md opacity-60 hover:opacity-100 hover:bg-accent transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
                <X size={15} />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            )}
            {children}
          </DialogPrimitive.Content>
        </div>
      </DialogPrimitive.Portal>
    </ModalVariantContext.Provider>
  )
}

function ModalIcon({ icon, className, iconClassName }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center size-9 rounded-lg shrink-0 bg-violet-50',
        className
      )}
    >
      {createElement(icon, {
        className: cn('size-4 text-violet-600', iconClassName),
        'aria-hidden': 'true',
      })}
    </div>
  )
}

function ModalHeader({ className, layout = 'default', padding, ...props }) {
  const { variant, borderColor } = useContext(ModalVariantContext)
  return (
    <div
      className={cn(
        layout === 'beside' ? 'flex flex-row items-center gap-3' : 'flex flex-col gap-1.5',
        variant === 'bordered' && 'px-6 py-4 border-b shrink-0',
        variant === 'bordered' && borderColor,
        ...resolvePadding(padding),
        className
      )}
      {...props}
    />
  )
}

function ModalHeaderContent({ className, ...props }) {
  return <div className={cn('flex flex-col gap-0.5 min-w-0 flex-1', className)} {...props} />
}

function ModalBody({ className, padding, ...props }) {
  return (
    <div
      className={cn('flex-1 overflow-y-auto px-6 py-4', ...resolvePadding(padding), className)}
      {...props}
    />
  )
}

function ModalTitle({ className, ...props }) {
  return (
    <DialogPrimitive.Title
      className={cn('text-base font-semibold text-slate-800', className)}
      {...props}
    />
  )
}

function ModalDescription({ className, ...props }) {
  return (
    <DialogPrimitive.Description className={cn('text-xs text-slate-500', className)} {...props} />
  )
}

function ModalFooter({ className, ...props }) {
  const { variant, borderColor } = useContext(ModalVariantContext)
  return (
    <div
      className={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        variant === 'bordered' && 'px-6 py-4 border-t shrink-0',
        variant === 'bordered' && borderColor,
        className
      )}
      {...props}
    />
  )
}

export {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalHeaderContent,
  ModalIcon,
  ModalBody,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalClose,
}
