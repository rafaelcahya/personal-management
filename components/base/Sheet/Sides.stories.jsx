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

const btnClass =
  'inline-flex items-center justify-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors min-w-24'

const BestPractices = ({ items }) => (
  <div className="flex flex-col gap-8 w-full max-w-2xl">
    {items.map(({ heading, cards }) => (
      <div key={heading}>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          {heading}
        </p>
        <div className="flex flex-col gap-3">
          {cards.map(({ title, body }) => (
            <div
              key={title}
              className="flex gap-3 p-4 rounded-lg border border-violet-100 bg-violet-50"
            >
              <span className="mt-0.5 shrink-0 size-4 rounded-full bg-violet-500 flex items-center justify-center text-white text-[10px] font-bold">
                ✓
              </span>
              <div>
                <p className="text-xs font-semibold text-violet-800 mb-0.5">{title}</p>
                <p className="text-xs text-violet-700 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
)

const bpItems = [
  {
    heading: 'When to use',
    cards: [
      {
        title: 'side="right" for detail panels and edit forms',
        body: 'The default — matches the natural left-to-right read direction and feels least intrusive. Use for settings, edit forms, and detail views.',
      },
      {
        title: 'side="bottom" for mobile-style action sheets',
        body: 'Use for confirmations or action lists that reference content below the fold — this side feels natural on touch devices and for sheet-style patterns.',
      },
    ],
  },
  {
    heading: 'When not to use',
    cards: [
      {
        title: "Don't use top/bottom for content-heavy panels",
        body: 'Top and bottom sheets give significantly less vertical space than left/right. Avoid them for multi-field forms or long lists — use right or left side instead.',
      },
    ],
  },
  {
    heading: 'Accessibility',
    cards: [
      {
        title: 'Focus trap, scroll lock, and Escape work identically on all sides',
        body: 'The side prop is purely visual. Keyboard navigation, focus management, and Escape-to-close all behave the same regardless of which edge the panel slides in from.',
      },
    ],
  },
  {
    heading: 'Advice',
    cards: [
      {
        title: 'Combine side with size to control the exact panel footprint',
        body: 'size controls width for left/right sheets and height for top/bottom sheets. Pair them — e.g. side="bottom" size="sm" — to get a compact action sheet without full-height coverage.',
      },
    ],
  },
]

export const Right = {
  name: 'Right',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">side=&quot;right&quot;</code> —
        the default. Panel slides in from the right edge.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">side=&quot;right&quot; (default)</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <Sheet>
            <SheetTrigger asChild>
              <button type="button" className={btnClass}>
                Right
              </button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <SheetTitle>side=&quot;right&quot;</SheetTitle>
                    <SheetDescription className="mt-1">
                      Slides in from the right edge (default).
                    </SheetDescription>
                  </div>
                  <SheetClose className="mt-0.5">
                    <X className="size-4" />
                  </SheetClose>
                </div>
              </SheetHeader>
              <div className="flex-1 px-6 py-4">
                <p className="text-sm text-gray-500">This sheet slides in from the right.</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <BestPractices items={bpItems} />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`<SheetContent side="right">...</SheetContent>
{/* "right" is the default — side prop can be omitted */}
<SheetContent>...</SheetContent>`}</code>
      </pre>
    </div>
  ),
}

export const Left = {
  name: 'Left',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">side=&quot;left&quot;</code> —
        panel slides in from the left edge. Use for navigation drawers or sidebar menus.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">side=&quot;left&quot;</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <Sheet>
            <SheetTrigger asChild>
              <button type="button" className={btnClass}>
                Left
              </button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <SheetTitle>side=&quot;left&quot;</SheetTitle>
                    <SheetDescription className="mt-1">
                      Slides in from the left edge.
                    </SheetDescription>
                  </div>
                  <SheetClose className="mt-0.5">
                    <X className="size-4" />
                  </SheetClose>
                </div>
              </SheetHeader>
              <div className="flex-1 px-6 py-4">
                <p className="text-sm text-gray-500">This sheet slides in from the left.</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <BestPractices items={bpItems} />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`<SheetContent side="left">...</SheetContent>`}</code>
      </pre>
    </div>
  ),
}

export const Top = {
  name: 'Top',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">side=&quot;top&quot;</code> —
        panel slides in from the top edge. The{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">size</code> prop controls
        height instead of width.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">side=&quot;top&quot;</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <Sheet>
            <SheetTrigger asChild>
              <button type="button" className={btnClass}>
                Top
              </button>
            </SheetTrigger>
            <SheetContent side="top">
              <SheetHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <SheetTitle>side=&quot;top&quot;</SheetTitle>
                    <SheetDescription className="mt-1">
                      Slides in from the top edge.
                    </SheetDescription>
                  </div>
                  <SheetClose className="mt-0.5">
                    <X className="size-4" />
                  </SheetClose>
                </div>
              </SheetHeader>
              <div className="flex-1 px-6 py-4">
                <p className="text-sm text-gray-500">This sheet slides in from the top.</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <BestPractices items={bpItems} />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`<SheetContent side="top">...</SheetContent>
{/* size controls height for top/bottom sheets */}
<SheetContent side="top" size="sm">...</SheetContent>`}</code>
      </pre>
    </div>
  ),
}

export const Bottom = {
  name: 'Bottom',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">side=&quot;bottom&quot;</code>{' '}
        — panel slides in from the bottom edge. Common for mobile-style action sheets and
        confirmations. The <code className="font-mono bg-gray-100 px-1 rounded text-xs">size</code>{' '}
        prop controls height instead of width.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">side=&quot;bottom&quot;</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <Sheet>
            <SheetTrigger asChild>
              <button type="button" className={btnClass}>
                Bottom
              </button>
            </SheetTrigger>
            <SheetContent side="bottom">
              <SheetHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <SheetTitle>side=&quot;bottom&quot;</SheetTitle>
                    <SheetDescription className="mt-1">
                      Slides in from the bottom edge.
                    </SheetDescription>
                  </div>
                  <SheetClose className="mt-0.5">
                    <X className="size-4" />
                  </SheetClose>
                </div>
              </SheetHeader>
              <div className="flex-1 px-6 py-4">
                <p className="text-sm text-gray-500">This sheet slides in from the bottom.</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <BestPractices items={bpItems} />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`<SheetContent side="bottom">...</SheetContent>
{/* size controls height for top/bottom sheets */}
<SheetContent side="bottom" size="sm">...</SheetContent>`}</code>
      </pre>
    </div>
  ),
}
