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
  title: 'Sheet/Basic',
}

export default meta

const btnClass =
  'inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors'

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Click the trigger to open the sheet. The panel slides in from the right by default. Press{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">Escape</code>, click the
        overlay, or use{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">SheetClose</code> to dismiss.
      </p>

      <div className="flex flex-col gap-5 w-full max-w-2xl">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">default (right side)</span>
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <button type="button" className={btnClass}>
                  Open Sheet
                </button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <SheetTitle>Edit Profile</SheetTitle>
                      <SheetDescription className="mt-1">
                        Update your display name and bio.
                      </SheetDescription>
                    </div>
                    <SheetClose className="mt-0.5">
                      <X className="size-4" />
                    </SheetClose>
                  </div>
                </SheetHeader>
                <div className="flex-1 px-6 py-4">
                  <p className="text-sm text-gray-500">
                    Sheet body — put any content here: forms, lists, detail panels.
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">with close button inside content</span>
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <button type="button" className={btnClass}>
                  Open with Footer
                </button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Notifications</SheetTitle>
                  <SheetDescription>Your recent activity.</SheetDescription>
                </SheetHeader>
                <div className="flex-1 px-6 py-4 space-y-3">
                  {['Trade executed — BBCA', 'Stock low — Vitamin C', 'Goal updated — 5K run'].map(
                    (item) => (
                      <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="size-2 rounded-full bg-violet-400 shrink-0" />
                        {item}
                      </div>
                    )
                  )}
                </div>
                <div className="px-6 pb-6 pt-4 border-t border-gray-100">
                  <SheetClose asChild>
                    <button
                      type="button"
                      className="w-full px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                    >
                      Dismiss
                    </button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">defaultOpen</span>
          <div className="flex items-center gap-3">
            <Sheet defaultOpen>
              <SheetTrigger asChild>
                <button type="button" className={btnClass}>
                  Already open on load
                </button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Started open</SheetTitle>
                  <SheetDescription>defaultOpen=true</SheetDescription>
                </SheetHeader>
                <div className="flex-1 px-6 py-4">
                  <p className="text-sm text-gray-500">
                    Sheet is open immediately — no trigger needed.
                  </p>
                </div>
                <div className="px-6 pb-6 pt-4 border-t border-gray-100">
                  <SheetClose asChild>
                    <button
                      type="button"
                      className="w-full px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                    >
                      Close
                    </button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Sheet>
  <SheetTrigger asChild>
    <button type="button">Open Sheet</button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Edit Profile</SheetTitle>
      <SheetDescription>Update your profile.</SheetDescription>
    </SheetHeader>
    {/* body */}
    <SheetClose asChild>
      <button type="button">Close</button>
    </SheetClose>
  </SheetContent>
</Sheet>`}</code>
      </pre>
    </div>
  ),
}
