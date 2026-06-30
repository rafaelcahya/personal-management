'use client'

import { Children, createContext, useContext } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { useFieldContentContext } from './FieldContent'

export const FieldControlContext = createContext({
  hasPrefix: false,
  hasSuffix: false,
})

export const useFieldControlContext = () => useContext(FieldControlContext)

const FieldControl = ({ as: Comp = 'div', className, children }) => {
  const childArray = Children.toArray(children)
  const hasPrefix = childArray.some((child) => child.type?.displayName === 'FieldPrefix')
  const hasSuffix = childArray.some((child) => child.type?.displayName === 'FieldSuffix')
  const { orientation } = useFieldContentContext()

  return (
    <FieldControlContext.Provider value={{ hasPrefix, hasSuffix }}>
      <Comp
        className={twMerge(
          clsx(
            'relative flex items-center',
            orientation === 'horizontal' && '[grid-area:control] self-center',
            className
          )
        )}
      >
        {children}
      </Comp>
    </FieldControlContext.Provider>
  )
}

FieldControl.displayName = 'FieldControl'

export default FieldControl
