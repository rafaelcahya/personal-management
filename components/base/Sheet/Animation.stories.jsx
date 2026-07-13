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
        title: 'animation="slide" for most cases',
        body: 'The default — the slide transition gives users spatial context: they understand where the panel came from and where it returns when dismissed.',
      },
      {
        title: 'animation="none" when a parent already handles the transition',
        body: 'Use when a route transition or container animation already covers the visual change, or when instant appearance is preferred for performance.',
      },
    ],
  },
  {
    heading: 'When not to use',
    cards: [
      {
        title: 'Don\'t layer animation="slide" on a parent that\'s already animating',
        body: 'Double animation — a parent route transition plus a sliding sheet — compounds movement and feels jarring. Use animation="none" to opt out when the parent handles motion.',
      },
    ],
  },
  {
    heading: 'Accessibility',
    cards: [
      {
        title: 'Consider animation="none" for prefers-reduced-motion',
        body: 'CSS slide transitions can cause discomfort for motion-sensitive users. Detect the prefers-reduced-motion media query and set animation="none" accordingly.',
      },
    ],
  },
  {
    heading: 'Advice',
    cards: [
      {
        title: 'Keep "slide" as the default — only override for a specific reason',
        body: 'The slide animation is intentional UX, not decoration. Only switch to "none" when there is a concrete reason: reduced motion, double-animation, or performance.',
      },
    ],
  },
]

export const Slide = {
  name: 'Slide',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          animation=&quot;slide&quot;
        </code>{' '}
        — the default. Panel and overlay animate in with a 300ms ease CSS transition from the
        configured side.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">animation=&quot;slide&quot; (default)</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
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

      <BestPractices items={bpItems} />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`<SheetContent animation="slide">...</SheetContent>
{/* "slide" is the default — animation prop can be omitted */}
<SheetContent>...</SheetContent>`}</code>
      </pre>
    </div>
  ),
}

export const None = {
  name: 'None',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          animation=&quot;none&quot;
        </code>{' '}
        — panel and overlay appear and disappear instantly with no CSS transition. Use when a parent
        is already animating or when reduced motion is preferred.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">animation=&quot;none&quot;</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
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

      <BestPractices items={bpItems} />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`<SheetContent animation="none">...</SheetContent>`}</code>
      </pre>
    </div>
  ),
}
