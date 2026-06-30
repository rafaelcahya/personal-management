'use client'

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { useFieldContentContext } from './FieldContent'

const FieldDescription = ({
  as: Comp = 'p',
  variant = 'default',
  className,
  children,
  ...props
}) => {
  const { descriptionId, orientation } = useFieldContentContext()

  return (
    <Comp
      id={descriptionId || undefined}
      className={twMerge(
        clsx(
          'text-xs leading-snug',
          variant === 'error' ? 'text-destructive' : 'text-muted-foreground',
          orientation === 'horizontal' && '[grid-area:desc]',
          className
        )
      )}
      {...props}
    >
      {children}
    </Comp>
  )
}

FieldDescription.displayName = 'FieldDescription'

export default FieldDescription
