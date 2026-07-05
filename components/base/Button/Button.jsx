'use client'

import { cloneElement, forwardRef, isValidElement, useMemo } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Loader2, Plus } from 'lucide-react'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium',
    'transition-all duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:border-violet-600 focus-visible:ring-offset-1',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70',
        outline:
          'border border-violet-200 text-primary bg-background hover:bg-primary/10 active:bg-primary/15',
        ghost: 'text-primary hover:bg-primary/10 active:bg-primary/15',
        destructive: 'bg-destructive text-white hover:bg-destructive/90 active:bg-destructive/80',
        link: 'text-primary underline-offset-4 hover:underline focus-visible:underline focus-visible:ring-offset-2 active:opacity-70',
      },
      size: {
        xs: 'h-6 rounded px-2 text-xs gap-1',
        sm: 'h-7 rounded-md px-3 text-xs gap-1.5',
        base: 'h-8 rounded-md px-3.5 text-sm gap-1.5',
        md: 'h-9 px-4 py-2 gap-2',
        lg: 'h-10 rounded-md px-6 text-sm gap-2',
        xl: 'h-12 rounded-md px-8 text-base gap-3',
        icon: 'size-9',
        'icon-xs': 'size-6',
        'icon-sm': 'size-7',
        'icon-base': 'size-8',
        'icon-md': 'size-9',
        'icon-lg': 'size-10',
        'icon-xl': 'size-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'base',
    },
  }
)

const iconSizeMap = {
  xs: 'size-3',
  sm: 'size-3',
  base: 'size-3.5',
  md: 'size-4',
  lg: 'size-4',
  xl: 'size-5',
  icon: 'size-4',
  'icon-xs': 'size-3',
  'icon-sm': 'size-3.5',
  'icon-base': 'size-4',
  'icon-md': 'size-4',
  'icon-lg': 'size-5',
  'icon-xl': 'size-6',
}

const isIconOnlySize = (size) => size === 'icon' || size?.startsWith('icon-')

/**
 * @param {object} props
 * @param {'default'|'secondary'|'outline'|'ghost'|'destructive'|'link'} [props.variant='default']
 * @param {'xs'|'sm'|'base'|'md'|'lg'|'xl'|'icon'|'icon-xs'|'icon-sm'|'icon-base'|'icon-md'|'icon-lg'|'icon-xl'} [props.size='base']
 * @param {boolean|React.ReactElement} [props.useIcon=false] - true uses default Plus icon; pass a React element for a custom icon
 * @param {'left'|'right'} [props.iconPosition='left']
 * @param {boolean} [props.isLoading=false]
 * @param {string} [props.loadingText='Loading'] - Visually-hidden text announced by screen readers during loading
 * @param {boolean} [props.fullWidth=false] - Stretch button to fill its container width
 * @param {boolean} [props.asChild=false] - Merge button props onto the single child element via Radix Slot
 * @param {React.ElementType} [props.as='button']
 * @param {string} [props.className]
 * @param {React.ReactNode} [props.children]
 */
const Button = forwardRef(function Button(
  {
    variant,
    size = 'base',
    isLoading = false,
    loadingText = 'Loading',
    useIcon = false,
    iconPosition = 'left',
    fullWidth = false,
    asChild = false,
    as: Component = 'button',
    type,
    className,
    children,
    disabled,
    onClick,
    onKeyDown,
    ...props
  },
  ref
) {
  const Comp = asChild ? Slot : Component
  const isNativeButton = !asChild && Component === 'button'
  const isDisabled = disabled || isLoading
  // div/span etc. need role, tabIndex, and keyboard handling added manually
  const isNonInteractiveElement = !asChild && Component !== 'button' && Component !== 'a'

  if (process.env.NODE_ENV !== 'production' && isIconOnlySize(size)) {
    const hasLabel = props['aria-label'] || props['aria-labelledby']
    if (!hasLabel) {
      console.error(
        '[Button] Icon-only buttons (size="icon-*") must have an aria-label or aria-labelledby for accessibility.'
      )
    }
  }

  const iconElement = useMemo(() => {
    const rawIcon = useIcon === true ? <Plus /> : isValidElement(useIcon) ? useIcon : null
    if (!rawIcon) return null
    return cloneElement(rawIcon, {
      className: twMerge(clsx(iconSizeMap[size] ?? 'size-4', rawIcon.props.className)),
      'aria-hidden': true,
    })
  }, [useIcon, size])

  const spinnerEl = (
    <Loader2 className={clsx(iconSizeMap[size] ?? 'size-4', 'animate-spin')} aria-hidden="true" />
  )

  // Spinner renders in the same slot as the icon to prevent layout shift.
  // When no icon is present, spinner defaults to the left slot.
  const leftSlot =
    iconPosition === 'left'
      ? isLoading
        ? spinnerEl
        : iconElement
      : isLoading && !iconElement
        ? spinnerEl
        : null

  const rightSlot =
    iconPosition === 'right' ? (isLoading ? (iconElement ? spinnerEl : null) : iconElement) : null

  // Non-button elements don't support the disabled attribute — use aria-disabled + click intercept.
  const nonButtonDisabledProps =
    !isNativeButton && isDisabled
      ? {
          'aria-disabled': true,
          onClick: (e) => {
            e.preventDefault()
          },
        }
      : { onClick }

  // Space + Enter activation for non-interactive elements (div, span, etc.) that carry role="button".
  // Native <button> and <a> handle keyboard activation themselves.
  const handleKeyDown = isNonInteractiveElement
    ? (e) => {
        if (!isDisabled && (e.key === ' ' || e.key === 'Enter')) {
          e.preventDefault()
          e.currentTarget.click()
        }
        onKeyDown?.(e)
      }
    : onKeyDown

  // Inject rel for security when rendering as a native anchor with target="_blank".
  const autoRelProps =
    !asChild && Component === 'a' && props.target === '_blank' && !props.rel
      ? { rel: 'noopener noreferrer' }
      : {}

  return (
    <Comp
      ref={ref}
      type={isNativeButton ? (type ?? 'button') : type}
      {...(isNativeButton ? { disabled: isDisabled } : {})}
      {...(isNonInteractiveElement && !props.role ? { role: 'button' } : {})}
      {...(isNonInteractiveElement && props.tabIndex === undefined ? { tabIndex: 0 } : {})}
      onKeyDown={handleKeyDown}
      className={twMerge(
        clsx(
          buttonVariants({ variant, size }),
          fullWidth && 'w-full',
          !isNativeButton && isDisabled && 'pointer-events-none opacity-50',
          className
        )
      )}
      aria-busy={isLoading || undefined}
      {...nonButtonDisabledProps}
      {...props}
      {...autoRelProps}
    >
      {asChild ? (
        children
      ) : (
        <>
          {leftSlot}
          {children}
          {rightSlot}
          {isLoading && <span className="sr-only">{loadingText}</span>}
        </>
      )}
    </Comp>
  )
})

Button.displayName = 'Button'

export default Button
