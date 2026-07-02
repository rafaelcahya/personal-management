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
  title: 'Sheet/Sizes',
}

export default meta

const sizes = [
  { size: 'sm', lr: '320px', tb: '200px' },
  { size: 'default', lr: '400px', tb: '300px' },
  { size: 'lg', lr: '540px', tb: '400px' },
  { size: 'full', lr: '100vw', tb: '100vh' },
]

const btnClass =
  'inline-flex items-center justify-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors min-w-24'

export const Sizes = {
  name: 'Sizes',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">size</code> controls width for
        left/right sheets and height for top/bottom sheets. All examples below use{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">side=&quot;right&quot;</code>.
      </p>

      <div className="flex flex-col gap-5 w-full max-w-2xl">
        {sizes.map(({ size, lr, tb }) => (
          <div key={size} className="flex flex-col gap-1.5">
            <span className="text-xs text-gray-400">
              size=&quot;{size}&quot; — {lr} wide / {tb} tall
            </span>
            <div className="flex items-center gap-3">
              <Sheet>
                <SheetTrigger asChild>
                  <button type="button" className={btnClass}>
                    {size}
                  </button>
                </SheetTrigger>
                <SheetContent side="right" size={size}>
                  <SheetHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <SheetTitle>size=&quot;{size}&quot;</SheetTitle>
                        <SheetDescription className="mt-1">
                          Width: {lr} — use for{' '}
                          {size === 'sm'
                            ? 'compact panels'
                            : size === 'default'
                              ? 'standard forms'
                              : size === 'lg'
                                ? 'wider content'
                                : 'full-screen overlays'}
                        </SheetDescription>
                      </div>
                      <SheetClose className="mt-0.5">
                        <X className="size-4" />
                      </SheetClose>
                    </div>
                  </SheetHeader>
                  <div className="flex-1 px-6 py-4">
                    <p className="text-sm text-gray-500">Panel width: {lr}</p>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        ))}
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* size: "sm" (320px) | "default" (400px) | "lg" (540px) | "full" (100vw) */}
<SheetContent side="right" size="sm">...</SheetContent>
<SheetContent side="right" size="lg">...</SheetContent>
<SheetContent side="right" size="full">...</SheetContent>

{/* top/bottom — size controls height instead */}
<SheetContent side="bottom" size="lg">...</SheetContent>`}</code>
      </pre>
    </div>
  ),
}
