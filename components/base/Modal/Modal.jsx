'use client'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

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
  ...props
}) {
  const resolvedDuration = resolveDuration(duration)
  return (
    <DialogPrimitive.Portal>
      <ModalOverlay opacity={overlayOpacity} />
      {/* pointer-events-none so backdrop clicks pass through to the overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <DialogPrimitive.Content
          style={animation !== 'none' ? { animationDuration: `${resolvedDuration}ms` } : undefined}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={(e) => {
            if (!closeOnOverlayClick) e.preventDefault()
          }}
          className={cn(
            'pointer-events-auto relative',
            'w-full bg-background border shadow-xl',
            'flex flex-col gap-4 p-6 overflow-y-auto',
            animation !== 'none' && 'data-[state=open]:animate-in data-[state=closed]:animate-out',
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
  )
}

function ModalHeader({ className, ...props }) {
  return <div className={cn('flex flex-col gap-1.5', className)} {...props} />
}

function ModalTitle({ className, ...props }) {
  return (
    <DialogPrimitive.Title
      className={cn('text-lg font-semibold leading-none text-foreground', className)}
      {...props}
    />
  )
}

function ModalDescription({ className, ...props }) {
  return (
    <DialogPrimitive.Description
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

function ModalFooter({ className, ...props }) {
  return (
    <div
      className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  )
}

export {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalClose,
}
