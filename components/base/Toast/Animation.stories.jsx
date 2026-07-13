import { useState } from 'react'
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from './Toast'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Toast/Animation',
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

// ─── Shared demo ─────────────────────────────────────────────────────────────

function AnimationDemo({ animValue, description }) {
  const [open, setOpen] = useState(false)
  const trigger = () => {
    setOpen(false)
    setTimeout(() => setOpen(true), 50)
  }
  return (
    <ToastProvider position="bottom-right">
      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">animation=&quot;{animValue}&quot;</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <button
            type="button"
            onClick={trigger}
            className="inline-flex items-center justify-center w-full px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
          >
            Show toast
          </button>
        </div>
      </div>

      {open && (
        <Toast onOpenChange={(o) => !o && setOpen(false)} animation={animValue} duration={3000}>
          <div className="flex-1 min-w-0">
            <ToastTitle>animation=&quot;{animValue}&quot;</ToastTitle>
            <ToastDescription>{description}</ToastDescription>
          </div>
          <ToastClose />
        </Toast>
      )}

      <ToastViewport />
    </ToastProvider>
  )
}

// ─── Stories ─────────────────────────────────────────────────────────────────

export const SlideFade = {
  name: 'Slide Fade',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          animation=&quot;slide-fade&quot;
        </code>{' '}
        is the default. The toast slides in from the direction of the viewport position and fades in
        simultaneously. On exit, it slides out and fades out. Click Show then ✕ to see both
        directions.
      </p>

      <AnimationDemo
        animValue="slide-fade"
        description="Slides in + fades in. Click ✕ to see the exit."
      />

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: "Use slide-fade for most toasts — it's the default and most polished",
                body: "Combining motion and opacity gives the toast a natural pop-in feel. The slide communicates where the toast came from; the fade softens the appearance so it doesn't startle the user.",
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't override to slide-only or fade-only without a specific design reason",
                body: 'slide-fade is the right default for almost every context. Only deviate when the combined animation causes a specific visual problem — like ghosting on dark backgrounds.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'The slide direction matches the viewport position automatically',
                body: "bottom-right slides in from the right, top-center from the top. You don't need to configure this manually — position on ToastProvider controls both placement and animation direction.",
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'No need to pass animation="slide-fade" explicitly',
                body: 'slide-fade is the default. Omitting the animation prop gives the same result and keeps the code cleaner — only specify it when deviating from the default.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* slide-fade is the default — no prop needed */}
<Toast>...</Toast>

{/* or explicit */}
<Toast animation="slide-fade">...</Toast>`}</code>
      </pre>
    </div>
  ),
}

export const Slide = {
  name: 'Slide',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          animation=&quot;slide&quot;
        </code>{' '}
        slides the toast in and out without any opacity change. The motion direction matches the
        viewport position. Click Show then ✕ to see both directions.
      </p>

      <AnimationDemo
        animValue="slide"
        description="Slides in only — no fade. Click ✕ to see the exit."
      />

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use slide when the design calls for motion without opacity shift',
                body: 'On dark backgrounds, fading can create a ghosting effect as the toast transitions between transparent and opaque. Slide-only keeps the visual weight consistent throughout the animation.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use slide as a shortcut to avoid slide-fade — they cost the same",
                body: 'slide-fade is not more expensive than slide. Only choose slide-only when you have a specific visual reason — otherwise slide-fade is the better default.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'slide appears at full opacity immediately — more noticeable in peripheral vision',
                body: 'Without the fade, the toast pops in at full weight. This is more likely to grab attention in the peripheral vision, which can be jarring for users sensitive to sudden movement.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Test slide-only on dark backgrounds where fade causes ghosting',
                body: 'If your app has a dark theme or dark toast container, fade can make the toast appear semi-transparent during entry. Slide-only sidesteps this entirely.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Toast animation="slide">...</Toast>`}</code>
      </pre>
    </div>
  ),
}

export const Fade = {
  name: 'Fade',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          animation=&quot;fade&quot;
        </code>{' '}
        fades the toast in and out with no positional movement. The toast appears and disappears in
        place at its fixed viewport position. Click Show then ✕ to see both directions.
      </p>

      <AnimationDemo
        animValue="fade"
        description="Fades in only — no slide. Click ✕ to see the exit."
      />

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title:
                  'Use fade in calm, minimal UIs where directional motion would be distracting',
                body: 'Fade is less attention-grabbing than slide. It suits dashboards or reading-focused layouts where the toast should appear quietly without pulling focus from the main content.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use fade when spatial context matters",
                body: 'Without a slide, the user gets no visual cue about where the toast lives on screen. If you want users to know "check the bottom-right corner", slide-fade communicates that better.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'fade gives no directional cue — users get no visual hint about toast position',
                body: 'The toast appears in place at its fixed position. Users who look at the wrong corner of the screen will miss it entirely — pair fade with a generous duration to compensate.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'fade is the safest choice when multiple page animations run simultaneously',
                body: 'Slide animations on a toast can visually compete with page transitions or chart updates. Fade-only is less likely to clash because it has no directional component.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Toast animation="fade">...</Toast>`}</code>
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
        disables all enter/exit transitions. The toast appears and disappears instantly with no
        motion or opacity change. Use this when respecting the user's reduced-motion preference.
      </p>

      <AnimationDemo
        animValue="none"
        description="Appears instantly — no animation. Click ✕ to see instant exit."
      />

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use none to respect prefers-reduced-motion',
                body: 'Some users have vestibular disorders or motion sensitivity. When the OS reduced-motion setting is enabled, switch to animation="none" to avoid triggering discomfort.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use none as a default — it hurts discoverability",
                body: "Without animation, toasts that appear in peripheral vision are easy to miss. Animation draws the eye to a new notification even when the user isn't looking at that corner of the screen.",
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Detect prefers-reduced-motion and switch to none automatically',
                body: 'Check the OS setting with a media query or the useReducedMotion hook and pass animation="none" when it is active. This makes the behavior automatic rather than requiring a manual user setting in your UI.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Always pair animation="none" with a ToastClose button',
                body: 'Without animation, the toast is easy to miss — there is no motion to draw the eye. A close button ensures the user can still dismiss it manually if they notice it later.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* use none when prefers-reduced-motion is active */}
<Toast animation="none">...</Toast>`}</code>
      </pre>
    </div>
  ),
}

// ─── Duration ─────────────────────────────────────────────────────────────────

const durationPresets = [
  { label: '1s', value: 1000 },
  { label: '3s', value: 3000 },
  { label: '5s', value: 5000 },
  { label: '∞', value: Infinity },
]

function DurationDemo() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(3000)
  const [inputMs, setInputMs] = useState('')
  const [customMs, setCustomMs] = useState('')

  const activeDuration = customMs ? Number(customMs) : selected

  const trigger = () => {
    setOpen(false)
    setTimeout(() => setOpen(true), 50)
  }

  return (
    <ToastProvider position="bottom-right">
      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">select duration then trigger</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {durationPresets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setSelected(p.value)
                  setCustomMs('')
                  setInputMs('')
                }}
                className={[
                  'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                  selected === p.value && !customMs
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'border-slate-200 hover:bg-accent',
                ].join(' ')}
              >
                {p.label}
              </button>
            ))}
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min={500}
                max={10000}
                placeholder="ms"
                value={inputMs}
                onChange={(e) => setInputMs(e.target.value)}
                className="w-20 px-2.5 py-1.5 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="button"
                onClick={() => {
                  if (inputMs) {
                    setCustomMs(inputMs)
                    setSelected(null)
                  }
                }}
                className="px-3 py-1.5 rounded-lg border text-xs font-medium hover:bg-accent transition-colors"
              >
                Apply
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={trigger}
            className="inline-flex items-center justify-center w-full px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
          >
            Show toast —{' '}
            {activeDuration === Infinity
              ? 'no auto-dismiss'
              : `dismisses after ${activeDuration / 1000}s`}
          </button>
        </div>
      </div>

      {open && (
        <Toast onOpenChange={(o) => !o && setOpen(false)} duration={activeDuration}>
          <div className="flex-1 min-w-0">
            <ToastTitle>Duration demo</ToastTitle>
            <ToastDescription>
              {activeDuration === Infinity
                ? 'Stays until dismissed manually.'
                : `Auto-dismisses after ${activeDuration}ms.`}
            </ToastDescription>
          </div>
          <ToastClose />
        </Toast>
      )}

      <ToastViewport />
    </ToastProvider>
  )
}

export const Duration = {
  name: 'Duration',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Pass a number in milliseconds to the{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">duration</code> prop to control
        when the toast auto-dismisses. Default is 5000ms. Pass{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">Infinity</code> to keep it open
        until the user manually dismisses it.
      </p>

      <DurationDemo />

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Keep duration between 3s and 7s for most toasts',
                body: "Too short (under 2s) and users can't read the message. Too long (over 10s) and the toast starts to feel like a permanent notification. 5s is a sensible default for one-line messages.",
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use a very short duration for messages with meaningful content",
                body: 'A 1-second toast with a multi-line message or an action button gives the user no time to read or respond. Match the duration to how long it takes to read the message plus act on it.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'Use duration={Infinity} only for toasts that require action — always pair with ToastClose',
                body: 'Persistent toasts overlap page content and can feel intrusive. Only use Infinity when the user must take an action (e.g., confirm, install, undo). Without a close button, the user has no escape.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  '5s is a sensible default — long enough to read, short enough to feel transient',
                body: 'Most one-line confirmation messages are readable in under 2 seconds. 5s gives comfortable reading time with a cushion for users who read slowly or miss the first appearance.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Toast duration={3000}>...</Toast>    {/* 3 seconds */}
<Toast duration={5000}>...</Toast>    {/* 5 seconds — default */}
<Toast duration={Infinity}>...</Toast> {/* stays until dismissed */}`}</code>
      </pre>
    </div>
  ),
}
