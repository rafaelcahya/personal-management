'use client'

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { useFieldContentContext } from './FieldContent'

const FieldLabel = ({
  as: Comp = 'label',
  required: requiredProp,
  htmlFor: htmlForProp,
  className,
  children,
  ...props
}) => {
  const ctx = useFieldContentContext()
  const required = requiredProp ?? ctx.required
  const htmlFor = htmlForProp ?? ctx.id

  return (
    <Comp
      htmlFor={Comp === 'label' ? htmlFor : undefined}
      className={twMerge(
        clsx(
          'text-sm font-medium leading-none text-foreground',
          ctx.orientation === 'horizontal' && '[grid-area:label] pt-0.5',
          className
        )
      )}
      {...props}
    >
      {children}
      {required && (
        <span aria-hidden="true" className="ml-0.5 text-destructive">
          *
        </span>
      )}
    </Comp>
  )
}

FieldLabel.displayName = 'FieldLabel'

export default FieldLabel
