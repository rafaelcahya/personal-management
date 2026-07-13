import { useState } from 'react'
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalClose,
} from './Modal'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Modal/Animation',
}

export default meta

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

export const AnimationNone = {
  name: 'none',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">animation="none"</code> —
          disables all enter/exit transitions. The modal appears and disappears instantly with no
          movement or fade.
        </p>
      </div>
      <div>
        <Modal>
          <ModalTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
            >
              Open
            </button>
          </ModalTrigger>
          <ModalContent animation="none">
            <ModalHeader>
              <ModalTitle>animation="none"</ModalTitle>
              <ModalDescription>No transition — appears and disappears instantly.</ModalDescription>
            </ModalHeader>
            <ModalFooter>
              <ModalClose asChild>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                >
                  Close
                </button>
              </ModalClose>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use when prefers-reduced-motion is active',
                body: 'Detect the OS-level "reduce motion" setting with the prefers-reduced-motion media query and pass animation="none" to honor it.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Do not use in production without an accessibility reason',
                body: 'Abrupt appearance without any transition can feel jarring to most users. Only disable animation when there is a specific accessibility or technical reason.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'animation="none" is the correct way to honor prefers-reduced-motion',
                body: 'Detecting this system setting and passing animation="none" is the right pattern — it disables the animation without rebuilding the modal or adding CSS overrides.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Useful in Cypress/E2E tests to prevent flaky assertions',
                body: 'Animation timing can cause race conditions in tests. Pass animation="none" in test environments to make assertions deterministic.',
              },
            ],
          },
        ]}
      />
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<ModalContent animation="none">...</ModalContent>`}</code>
      </pre>
    </div>
  ),
}

export const AnimationZoom = {
  name: 'zoom (default)',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">animation="zoom"</code> — the
          default animation. The panel scales from 95% to 100% combined with a fade-in on enter, and
          reverses on exit. Feels natural and grounded — the modal appears to "pop" into focus.
        </p>
      </div>
      <div>
        <Modal>
          <ModalTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
            >
              Open
            </button>
          </ModalTrigger>
          <ModalContent animation="zoom">
            <ModalHeader>
              <ModalTitle>animation="zoom"</ModalTitle>
              <ModalDescription>Scale 95%→100% + fade — default.</ModalDescription>
            </ModalHeader>
            <ModalFooter>
              <ModalClose asChild>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                >
                  Close
                </button>
              </ModalClose>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'The right default for most product modals',
                body: 'Forms, settings, confirmations. Feels standard across desktop web apps — familiar enough to not distract users.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'For modals that drop from the top, use slide-down instead',
                body: 'System alerts and async error messages feel more natural with slide-down. The top-down motion implies the message came from the system, not the user.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'The subtle scale is below the vestibular discomfort threshold for most users',
                body: '95%→100% is minor enough that most users with motion sensitivity tolerate it. Still honor prefers-reduced-motion by falling back to animation="none".',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'You can omit animation entirely',
                body: 'zoom is the default — no need to write animation="zoom" explicitly. Only set animation when you need a different value.',
              },
            ],
          },
        ]}
      />
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<ModalContent animation="zoom">...</ModalContent>   {/* default — can be omitted */}`}</code>
      </pre>
    </div>
  ),
}

export const AnimationFade = {
  name: 'fade',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">animation="fade"</code> —
          opacity only, no scale or position change. The modal crossfades in and out with zero
          movement. The most minimal of the animated options.
        </p>
      </div>
      <div>
        <Modal>
          <ModalTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
            >
              Open
            </button>
          </ModalTrigger>
          <ModalContent animation="fade">
            <ModalHeader>
              <ModalTitle>animation="fade"</ModalTitle>
              <ModalDescription>Opacity only — no movement.</ModalDescription>
            </ModalHeader>
            <ModalFooter>
              <ModalClose asChild>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                >
                  Close
                </button>
              </ModalClose>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use when the design language is minimal or flat',
                body: 'When zoom or slide would feel out of place — e.g. a flat, document-style UI where any movement is jarring.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Avoid for modals that need a strong directional cue',
                body: 'Action sheets and slide-in panels read better with slide-up or slide-down. A pure fade removes the spatial signal entirely.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'A reasonable fallback for vestibular motion sensitivity',
                body: 'Users sensitive to scale and movement may tolerate opacity-only transitions. fade is a good middle ground between animation="none" and zoom.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Good for modals over text-heavy pages',
                body: 'On reading-focused pages, a movement-based transition pulls attention away from the text. Fading in keeps the disruption minimal.',
              },
            ],
          },
        ]}
      />
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<ModalContent animation="fade">...</ModalContent>`}</code>
      </pre>
    </div>
  ),
}

export const AnimationSlideUp = {
  name: 'slide-up',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">animation="slide-up"</code> —
          the panel slides in from below and fades simultaneously on enter, then reverses on exit.
          Mimics the native mobile bottom sheet gesture — feels natural on touch devices.
        </p>
      </div>
      <div>
        <Modal>
          <ModalTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
            >
              Open
            </button>
          </ModalTrigger>
          <ModalContent animation="slide-up">
            <ModalHeader>
              <ModalTitle>animation="slide-up"</ModalTitle>
              <ModalDescription>Slides in from below + fade.</ModalDescription>
            </ModalHeader>
            <ModalFooter>
              <ModalClose asChild>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                >
                  Close
                </button>
              </ModalClose>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use for confirmation dialogs and action sheets',
                body: 'The upward motion signals "this came from a button below" — matches mobile bottom-sheet conventions and feels natural for user-initiated actions.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Avoid for system alerts or error messages',
                body: 'System-level alerts feel more natural sliding in from above (slide-down). The top-down motion implies the message came from the system, not the user.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Directional animations can be stronger motion sensitivity triggers',
                body: 'Slide animations involve more displacement than zoom. Always honor prefers-reduced-motion by falling back to animation="none".',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Good for mobile-first apps where the modal behaves like a bottom sheet',
                body: 'On small screens, slide-up reinforces the mental model of content rising from the bottom, consistent with native mobile UX patterns.',
              },
            ],
          },
        ]}
      />
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<ModalContent animation="slide-up">...</ModalContent>`}</code>
      </pre>
    </div>
  ),
}

export const AnimationSlideDown = {
  name: 'slide-down',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">animation="slide-down"</code>{' '}
          — the panel slides in from above and fades simultaneously on enter, then reverses on exit.
          Signals that content is "dropping in" from the top — feels like a system notification or
          alert.
        </p>
      </div>
      <div>
        <Modal>
          <ModalTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
            >
              Open
            </button>
          </ModalTrigger>
          <ModalContent animation="slide-down">
            <ModalHeader>
              <ModalTitle>animation="slide-down"</ModalTitle>
              <ModalDescription>Slides in from above + fade.</ModalDescription>
            </ModalHeader>
            <ModalFooter>
              <ModalClose asChild>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                >
                  Close
                </button>
              </ModalClose>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use for system alerts and async-triggered modals',
                body: 'System alerts, error messages, and notifications that surface independently of user action — the top-down motion implies the message came from the system.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Avoid for forms and settings modals',
                body: 'Users associate downward motion with notifications, not interactive dialogs. Forms and settings should use zoom (the default) for a more neutral entry.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Directional animations can trigger vestibular discomfort',
                body: 'Slide animations involve visible displacement. Honor prefers-reduced-motion by falling back to animation="none".',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Good for modals triggered after an API response',
                body: 'When the modal opens after a success confirmation or blocking error — not from a button below the modal — slide-down reinforces that the system initiated it.',
              },
            ],
          },
        ]}
      />
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<ModalContent animation="slide-down">...</ModalContent>`}</code>
      </pre>
    </div>
  ),
}

export const Duration = {
  name: 'duration',
  render: () => {
    const [customMs, setCustomMs] = useState(300)
    const [customOpen, setCustomOpen] = useState(false)

    return (
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-col gap-2 max-w-2xl">
          <p className="text-sm text-gray-500 leading-relaxed">
            <code className="font-mono bg-gray-100 px-1 rounded text-xs">duration</code> controls
            how long the enter/exit animation takes. Accepts four named presets or a custom integer
            in milliseconds. The default preset resolves to 200ms.
          </p>
        </div>

        <div className="flex flex-col gap-5 w-full max-w-2xl">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-gray-400">named presets</span>
            <div className="flex flex-wrap gap-2">
              {[
                { duration: 'fast', label: 'fast — 100ms' },
                { duration: 'default', label: 'default — 200ms' },
                { duration: 'slow', label: 'slow — 400ms' },
                { duration: 'slower', label: 'slower — 700ms' },
              ].map(({ duration, label }) => (
                <Modal key={duration}>
                  <ModalTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1.5 rounded-lg border text-xs font-medium hover:bg-accent transition-colors"
                    >
                      {label}
                    </button>
                  </ModalTrigger>
                  <ModalContent duration={duration}>
                    <ModalHeader>
                      <ModalTitle>duration="{duration}"</ModalTitle>
                      <ModalDescription>
                        {duration === 'fast' && 'Resolves to 100ms.'}
                        {duration === 'default' && 'Resolves to 200ms.'}
                        {duration === 'slow' && 'Resolves to 400ms.'}
                        {duration === 'slower' && 'Resolves to 700ms.'}
                      </ModalDescription>
                    </ModalHeader>
                    <ModalFooter>
                      <ModalClose asChild>
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                        >
                          Close
                        </button>
                      </ModalClose>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-gray-400">custom integer (ms)</span>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={50}
                max={2000}
                step={50}
                value={customMs}
                onChange={(e) => setCustomMs(Number(e.target.value))}
                className="w-24 rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <span className="text-xs text-gray-400">ms</span>
              <button
                type="button"
                onClick={() => setCustomOpen(true)}
                className="inline-flex items-center px-3 py-1.5 rounded-lg border text-xs font-medium hover:bg-accent transition-colors"
              >
                Open
              </button>
            </div>
            <Modal open={customOpen} onOpenChange={setCustomOpen}>
              <ModalContent duration={customMs}>
                <ModalHeader>
                  <ModalTitle>Custom duration: {customMs}ms</ModalTitle>
                  <ModalDescription>Animation takes exactly {customMs}ms.</ModalDescription>
                </ModalHeader>
                <ModalFooter>
                  <button
                    type="button"
                    onClick={() => setCustomOpen(false)}
                    className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                  >
                    Close
                  </button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        </div>

        <BestPractices
          items={[
            {
              heading: 'When to use',
              cards: [
                {
                  title: 'Stick to default (200ms) for most modals',
                  body: 'Fast enough to feel snappy, slow enough to feel smooth. Use fast (100ms) for modals triggered very frequently (inline edit, row actions) where animation overhead feels repetitive.',
                },
              ],
            },
            {
              heading: 'When not to use',
              cards: [
                {
                  title: 'Use slow or slower sparingly',
                  body: 'Reserve slow (400ms) and slower (700ms) for dramatic moments like onboarding reveals or celebration dialogs. Slow animations on frequent interactions feel sluggish.',
                },
              ],
            },
            {
              heading: 'Accessibility',
              cards: [
                {
                  title: 'Longer durations increase animation exposure time',
                  body: 'Any duration above 300ms should be paired with a prefers-reduced-motion check — the longer the animation plays, the more discomfort it can cause.',
                },
              ],
            },
            {
              heading: 'Advice',
              cards: [
                {
                  title: 'Custom integers are useful for brand motion systems',
                  body: 'When the design system specifies exact animation durations, pass a number directly. Keep below 500ms for any interactive dialog.',
                },
              ],
            },
          ]}
        />

        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
          <code>{`{/* named presets */}
<ModalContent duration="fast">...</ModalContent>      {/* 100ms */}
<ModalContent duration="default">...</ModalContent>   {/* 200ms */}
<ModalContent duration="slow">...</ModalContent>      {/* 400ms */}
<ModalContent duration="slower">...</ModalContent>    {/* 700ms */}

{/* custom integer */}
<ModalContent duration={350}>...</ModalContent>`}</code>
        </pre>
      </div>
    )
  },
}
