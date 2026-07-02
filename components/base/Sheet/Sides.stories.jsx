import { X } from 'lucide-react'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from './Sheet'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Sheet/Sides',
}

export default meta

const sides = [
  { side: 'right', label: 'Right', desc: 'Slides in from the right edge (default).' },
  { side: 'left', label: 'Left', desc: 'Slides in from the left edge.' },
  { side: 'top', label: 'Top', desc: 'Slides in from the top edge.' },
  { side: 'bottom', label: 'Bottom', desc: 'Slides in from the bottom edge.' },
]

const btnClass =
  'inline-flex items-center justify-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors min-w-24'

export const Sides = {
  name: 'Sides',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">side</code> prop controls
        which edge the panel slides in from.{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">size</code> controls width
        (left/right) or height (top/bottom).
      </p>

      <div className="flex flex-col gap-5 w-full max-w-2xl">
        {sides.map(({ side, label, desc }) => (
          <div key={side} className="flex flex-col gap-1.5">
            <span className="text-xs text-gray-400">{side}</span>
            <div className="flex items-center gap-3">
              <Sheet>
                <SheetTrigger asChild>
                  <button type="button" className={btnClass}>
                    {label}
                  </button>
                </SheetTrigger>
                <SheetContent side={side}>
                  <SheetHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <SheetTitle>side=&quot;{side}&quot;</SheetTitle>
                        <SheetDescription className="mt-1">{desc}</SheetDescription>
                      </div>
                      <SheetClose className="mt-0.5">
                        <X className="size-4" />
                      </SheetClose>
                    </div>
                  </SheetHeader>
                  <div className="flex-1 px-6 py-4">
                    <p className="text-sm text-gray-500">
                      This sheet slides in from the <strong>{side}</strong>.
                    </p>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        ))}
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* side: "right" (default) | "left" | "top" | "bottom" */}
<SheetContent side="left">...</SheetContent>
<SheetContent side="top">...</SheetContent>
<SheetContent side="bottom">...</SheetContent>`}</code>
      </pre>
    </div>
  ),
}
