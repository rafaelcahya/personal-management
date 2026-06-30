'use client'

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { useFieldContentContext } from './FieldContent'

const FieldError = ({ as: Comp = 'p', className, children, ...props }) => {
  const { errorId, error, orientation } = useFieldContentContext()
  const message = children ?? error
  if (!message) return null

  return (
    <Comp
      id={errorId}
      role="alert"
      className={twMerge(
        clsx(
          'text-xs leading-snug text-destructive',
          orientation === 'horizontal' && '[grid-area:error] mt-0.5',
          className
        )
      )}
      {...props}
    >
      {message}
    </Comp>
  )
}

FieldError.displayName = 'FieldError'

export default FieldError
