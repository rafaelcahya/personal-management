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
  title: 'Sheet/Animation',
}

export default meta

const btnClass =
  'inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors'

export const Animation = {
  name: 'Animation',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">animation</code> prop on{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">SheetContent</code> controls
        whether the panel animates.{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">slide</code> (default) slides
        in from the configured side.{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">none</code> appears and
        disappears instantly — useful when a parent is already animating or when reduced motion is
        preferred.
      </p>

      <div className="flex flex-col gap-5 w-full max-w-2xl">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">animation=&quot;slide&quot; (default)</span>
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <button type="button" className={btnClass}>
                  Slide in
                </button>
              </SheetTrigger>
              <SheetContent side="right" animation="slide">
                <SheetHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <SheetTitle>animation=&quot;slide&quot;</SheetTitle>
                      <SheetDescription className="mt-1">
                        Panel and overlay animate with CSS transitions.
                      </SheetDescription>
                    </div>
                    <SheetClose className="mt-0.5">
                      <X className="size-4" />
                    </SheetClose>
                  </div>
                </SheetHeader>
                <div className="flex-1 px-6 py-4">
                  <p className="text-sm text-gray-500">
                    Slides in from the right with a 300ms ease transition. Overlay fades in
                    simultaneously.
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">animation=&quot;none&quot;</span>
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <button type="button" className={btnClass}>
                  No animation
                </button>
              </SheetTrigger>
              <SheetContent side="right" animation="none">
                <SheetHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <SheetTitle>animation=&quot;none&quot;</SheetTitle>
                      <SheetDescription className="mt-1">
                        Panel appears and disappears instantly — no transition.
                      </SheetDescription>
                    </div>
                    <SheetClose className="mt-0.5">
                      <X className="size-4" />
                    </SheetClose>
                  </div>
                </SheetHeader>
                <div className="flex-1 px-6 py-4">
                  <p className="text-sm text-gray-500">
                    No CSS transition applied. Use this when a parent container already handles the
                    animation, or for reduced-motion accessibility.
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">all sides — slide</span>
          <div className="flex items-center gap-3 flex-wrap py-2">
            {['right', 'left', 'top', 'bottom'].map((side) => (
              <Sheet key={side}>
                <SheetTrigger asChild>
                  <button type="button" className={btnClass}>
                    {side}
                  </button>
                </SheetTrigger>
                <SheetContent side={side} animation="slide">
                  <SheetHeader>
                    <div className="flex items-start justify-between">
                      <SheetTitle>side=&quot;{side}&quot;</SheetTitle>
                      <SheetClose className="mt-0.5">
                        <X className="size-4" />
                      </SheetClose>
                    </div>
                  </SheetHeader>
                  <div className="flex-1 px-6 py-4">
                    <p className="text-sm text-gray-500">Slides in from the {side}.</p>
                  </div>
                </SheetContent>
              </Sheet>
            ))}
          </div>
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* animation: "slide" (default) | "none" */}

<SheetContent animation="slide">
  {/* slides in from side with 300ms ease transition */}
</SheetContent>

<SheetContent animation="none">
  {/* appears instantly — no transition */}
</SheetContent>`}</code>
      </pre>
    </div>
  ),
}
