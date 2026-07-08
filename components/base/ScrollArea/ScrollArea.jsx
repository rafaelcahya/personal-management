'use client'

import { cn } from '@/lib/utils'

const scrollbarY =
  '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border'

const scrollbarX =
  '[&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border'

const viewportVariants = {
  vertical: `h-full w-full overflow-y-auto ${scrollbarY}`,
  horizontal: `h-full w-full overflow-x-auto ${scrollbarX}`,
  both: `h-full w-full overflow-auto ${scrollbarY} ${scrollbarX}`,
}

function ScrollArea({ orientation = 'vertical', className, children, ...props }) {
  return (
    <div data-slot="scroll-area" className={cn('relative overflow-hidden', className)} {...props}>
      <div data-slot="scroll-area-viewport" className={viewportVariants[orientation]}>
        {children}
      </div>
    </div>
  )
}

export { ScrollArea }
