'use client'

import { createContext, useContext, useId } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const FieldContentContext = createContext({
  id: undefined,
  descriptionId: undefined,
  errorId: undefined,
  hasError: false,
  required: false,
  disabled: false,
  name: undefined,
  size: 'base',
  error: undefined,
  orientation: 'vertical',
})

export const useFieldContentContext = () => useContext(FieldContentContext)

const FieldContent = ({
  as: Comp = 'div',
  size = 'base',
  required = false,
  disabled = false,
  error,
  name,
  orientation = 'vertical',
  className,
  children,
}) => {
  const uid = useId()
  const id = `field-${uid}`
  const descriptionId = `${id}-description`
  const errorId = `${id}-error`
  const hasError = !!error

  return (
    <FieldContentContext.Provider
      value={{
        id,
        descriptionId,
        errorId,
        hasError,
        required,
        disabled,
        name,
        size,
        error,
        orientation,
      }}
    >
      <Comp
        className={twMerge(
          clsx(
            orientation === 'horizontal'
              ? "[grid-template-areas:'label_control'_'desc_control'_'error_error'] grid grid-cols-[1fr_auto] items-start gap-x-6 gap-y-0.5"
              : 'flex flex-col gap-1.5',
            className
          )
        )}
      >
        {children}
      </Comp>
    </FieldContentContext.Provider>
  )
}

FieldContent.displayName = 'FieldContent'

export default FieldContent
