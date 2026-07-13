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
        title: '"default" (400px) for standard edit forms and settings panels',
        body: 'Wide enough for labels and inputs without dominating the page. The right default for most form-based sheets.',
      },
      {
        title: '"sm" (320px) for compact panels with 2–3 fields',
        body: 'Use for quick-edit panels, short action sheets, or mobile-width previews where "default" feels too wide.',
      },
      {
        title: '"lg" (540px) for wider layouts',
        body: 'Use when the content has multiple columns, data tables, or rich media that needs the extra horizontal space.',
      },
      {
        title: '"full" for immersive flows only',
        body: 'Reserve for multi-step wizards or full data views where intentional full-viewport coverage is the goal. For most forms, "default" or "lg" is sufficient.',
      },
    ],
  },
  {
    heading: 'When not to use',
    cards: [
      {
        title: 'Don\'t use "full" for simple single-purpose forms',
        body: '"full" covers the entire viewport and carries the visual weight of a page — use "default" or "lg" unless the content genuinely needs full coverage.',
      },
    ],
  },
  {
    heading: 'Accessibility',
    cards: [
      {
        title: 'Size is purely visual — all keyboard behaviors are unchanged',
        body: 'Focus trap, Escape key, and scroll lock work identically across all sizes. Size only affects the panel dimensions.',
      },
    ],
  },
  {
    heading: 'Advice',
    cards: [
      {
        title: 'size controls width for left/right and height for top/bottom',
        body: 'The same size values apply to all sides, but the dimension they affect differs. size="lg" on a bottom sheet means 400px tall — not 540px wide.',
      },
    ],
  },
]

export const Sm = {
  name: 'Sm',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">size=&quot;sm&quot;</code> —
        320px wide (left/right) or 200px tall (top/bottom). Use for compact panels with few fields.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">size=&quot;sm&quot; — 320px wide</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <Sheet>
            <SheetTrigger asChild>
              <button type="button" className={btnClass}>
                sm
              </button>
            </SheetTrigger>
            <SheetContent side="right" size="sm">
              <SheetHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <SheetTitle>size=&quot;sm&quot;</SheetTitle>
                    <SheetDescription className="mt-1">
                      Width: 320px — use for compact panels.
                    </SheetDescription>
                  </div>
                  <SheetClose className="mt-0.5">
                    <X className="size-4" />
                  </SheetClose>
                </div>
              </SheetHeader>
              <div className="flex-1 px-6 py-4">
                <p className="text-sm text-gray-500">Panel width: 320px</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <BestPractices items={bpItems} />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`<SheetContent side="right" size="sm">...</SheetContent>`}</code>
      </pre>
    </div>
  ),
}

export const Default = {
  name: 'Default',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">size=&quot;default&quot;</code>{' '}
        — 400px wide (left/right) or 300px tall (top/bottom). The standard size for most forms and
        settings panels.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">size=&quot;default&quot; — 400px wide</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <Sheet>
            <SheetTrigger asChild>
              <button type="button" className={btnClass}>
                default
              </button>
            </SheetTrigger>
            <SheetContent side="right" size="default">
              <SheetHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <SheetTitle>size=&quot;default&quot;</SheetTitle>
                    <SheetDescription className="mt-1">
                      Width: 400px — use for standard forms.
                    </SheetDescription>
                  </div>
                  <SheetClose className="mt-0.5">
                    <X className="size-4" />
                  </SheetClose>
                </div>
              </SheetHeader>
              <div className="flex-1 px-6 py-4">
                <p className="text-sm text-gray-500">Panel width: 400px</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <BestPractices items={bpItems} />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`<SheetContent side="right" size="default">...</SheetContent>
{/* "default" is the default — size prop can be omitted */}
<SheetContent side="right">...</SheetContent>`}</code>
      </pre>
    </div>
  ),
}

export const Lg = {
  name: 'Lg',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">size=&quot;lg&quot;</code> —
        540px wide (left/right) or 400px tall (top/bottom). Use for wider content like data tables
        or multi-column form layouts.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">size=&quot;lg&quot; — 540px wide</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <Sheet>
            <SheetTrigger asChild>
              <button type="button" className={btnClass}>
                lg
              </button>
            </SheetTrigger>
            <SheetContent side="right" size="lg">
              <SheetHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <SheetTitle>size=&quot;lg&quot;</SheetTitle>
                    <SheetDescription className="mt-1">
                      Width: 540px — use for wider content.
                    </SheetDescription>
                  </div>
                  <SheetClose className="mt-0.5">
                    <X className="size-4" />
                  </SheetClose>
                </div>
              </SheetHeader>
              <div className="flex-1 px-6 py-4">
                <p className="text-sm text-gray-500">Panel width: 540px</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <BestPractices items={bpItems} />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`<SheetContent side="right" size="lg">...</SheetContent>`}</code>
      </pre>
    </div>
  ),
}

export const Full = {
  name: 'Full',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">size=&quot;full&quot;</code> —
        100vw wide (left/right) or 100vh tall (top/bottom). Covers the entire viewport. Reserve for
        immersive flows like multi-step wizards or full data views.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">size=&quot;full&quot; — 100vw wide</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <Sheet>
            <SheetTrigger asChild>
              <button type="button" className={btnClass}>
                full
              </button>
            </SheetTrigger>
            <SheetContent side="right" size="full">
              <SheetHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <SheetTitle>size=&quot;full&quot;</SheetTitle>
                    <SheetDescription className="mt-1">
                      Width: 100vw — use for full-screen overlays.
                    </SheetDescription>
                  </div>
                  <SheetClose className="mt-0.5">
                    <X className="size-4" />
                  </SheetClose>
                </div>
              </SheetHeader>
              <div className="flex-1 px-6 py-4">
                <p className="text-sm text-gray-500">Panel width: 100vw</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <BestPractices items={bpItems} />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`<SheetContent side="right" size="full">...</SheetContent>
{/* top/bottom — size controls height */}
<SheetContent side="bottom" size="full">...</SheetContent>`}</code>
      </pre>
    </div>
  ),
}
