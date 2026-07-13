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

export const Uncontrolled = {
  name: 'Uncontrolled',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        The default uncontrolled pattern — no{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">open</code> prop needed. Sheet
        manages its own open state internally. Press{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">Escape</code>, click the
        overlay, or use{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">SheetClose</code> to dismiss.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">uncontrolled — right side (default)</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
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

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Uncontrolled mode for simple trigger → open → close flows',
                body: 'No open prop needed — Sheet manages its own state internally. Use this when there is no external state coordination required.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use uncontrolled when you need to reset form state on open",
                body: 'If the sheet contains a form that must reset each time it opens, use controlled mode (open + onOpenChange) so the parent can trigger the reset.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Always include SheetTitle inside SheetHeader',
                body: 'SheetTitle sets the accessible name of the dialog for screen readers. Omitting it leaves the panel unlabeled — which is a WCAG failure.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Switch to controlled mode when you need programmatic close',
                body: 'Use open + onOpenChange when the sheet must close after a save, prevent close on validation errors, or be triggered from a sibling component.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
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
  </SheetContent>
</Sheet>`}</code>
      </pre>
    </div>
  ),
}

export const WithFooterClose = {
  name: 'With Footer Close',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Use <code className="font-mono bg-gray-100 px-1 rounded text-xs">SheetClose asChild</code>{' '}
        inside a footer area to add a dismiss button at the bottom of the panel. This is separate
        from the X icon in the header — both can coexist.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">SheetClose in footer — dismiss button</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
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

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Footer close button for read-only panels',
                body: 'Notification lists, detail views, and info panels — where the only action is to dismiss. A single close button at the bottom is sufficient.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use a bare close button when there's a primary action",
                body: 'For panels with Save or Submit, use SheetFooter with both a Cancel (SheetClose) and a primary button — see the With Footer Actions story.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'SheetClose asChild merges close onto the child — no extra wrapper needed',
                body: 'Using asChild merges the close handler directly onto your button element. No extra div wrapper is added to the DOM.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'A header X icon and a footer close button can coexist',
                body: 'Both are SheetClose triggers. Header X is always visible; footer button appears at the bottom of content. Use both when you want a prominent dismiss CTA at the end of a long list.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`<SheetContent>
  <SheetHeader>
    <SheetTitle>Notifications</SheetTitle>
  </SheetHeader>
  <div className="flex-1 px-6 py-4">
    {/* content */}
  </div>
  <div className="px-6 pb-6 pt-4 border-t border-gray-100">
    <SheetClose asChild>
      <button type="button" className="w-full ...">Dismiss</button>
    </SheetClose>
  </div>
</SheetContent>`}</code>
      </pre>
    </div>
  ),
}

export const DefaultOpen = {
  name: 'Default Open',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">defaultOpen</code> to
        render the sheet already open on mount — no trigger click required. Still uncontrolled; the
        user can close it normally.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">defaultOpen — opens immediately on mount</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
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

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'defaultOpen for onboarding and first-run experiences',
                body: 'Use when the sheet should greet the user immediately on page load — no trigger click needed. Common for setup wizards or contextual welcome panels.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use defaultOpen for programmatic control",
                body: "defaultOpen only sets the initial state — you can't re-open or close it programmatically. For that, use controlled mode (open + onOpenChange).",
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Focus moves into the sheet automatically on open',
                body: "Whether opened by defaultOpen or a trigger click, Radix's Sheet moves keyboard focus into the panel — no manual tabIndex management needed.",
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'defaultOpen stays uncontrolled — the user can still close it normally',
                body: 'It only sets the initial open value. Once open, Escape, overlay click, and SheetClose all work exactly as in the standard uncontrolled pattern.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`{/* opens on mount, user can close normally */}
<Sheet defaultOpen>
  <SheetTrigger asChild>
    <button type="button">Already open on load</button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Started open</SheetTitle>
    </SheetHeader>
    {/* body */}
  </SheetContent>
</Sheet>`}</code>
      </pre>
    </div>
  ),
}
