import { useState } from 'react'
import { Tooltip, TooltipTrigger, TooltipContent } from './Tooltip'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Tooltip/Animation',
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

const btnClass =
  'inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors cursor-default w-full justify-center'

function AnimDemo({ animValue, description }) {
  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <button type="button" className={btnClass}>
            Hover to preview — animation=&quot;{animValue}&quot;
          </button>
        </TooltipTrigger>
        <TooltipContent animation={animValue} duration="slow">
          {description}
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

export const Fade = {
  name: 'Fade',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          animation=&quot;fade&quot;
        </code>{' '}
        fades the tooltip in and out with no positional movement. The tooltip appears and disappears
        in place at its fixed position. This is the default animation.
      </p>

      <AnimDemo animValue="fade" description="Fades in and out — no motion" />

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: "Use fade for most tooltips — it's the default and most versatile",
                body: 'The fade animation is subtle and unobtrusive. It draws the eye without being distracting, making it appropriate for tooltips in all types of interfaces.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use fade when spatial context about the trigger origin matters",
                body: 'Fade gives no directional cue about where the tooltip is anchored. If users need to feel the connection to a specific element, zoom creates a sense of origin that fade cannot.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'fade works best for obvious, single-element triggers',
                body: 'Without directional motion, users rely on position alone to associate the tooltip with its trigger. For grouped or dense layouts, a zoom or showArrow gives clearer visual ownership.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'No need to pass animation="fade" explicitly — it\'s the default',
                body: 'Omitting the animation prop gives the same result. Only specify it when deviating from fade.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* fade is the default — no prop needed */}
<TooltipContent>...</TooltipContent>

{/* or explicit */}
<TooltipContent animation="fade">...</TooltipContent>`}</code>
      </pre>
    </div>
  ),
}

export const Zoom = {
  name: 'Zoom',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          animation=&quot;zoom&quot;
        </code>{' '}
        scales the tooltip from 95% to 100% while fading in, and reverses on exit. The scale-in
        creates a sense that the tooltip emerged from the trigger element.
      </p>

      <AnimDemo animValue="zoom" description="Scales in from 95% while fading" />

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use zoom when you want the tooltip to feel like it pops out of the trigger',
                body: 'The scale animation subtly communicates that the tooltip is connected to the specific element being hovered. It is more expressive than fade while remaining tasteful.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use zoom in dense toolbars — use fade there instead",
                body: 'When tooltips appear rapidly in sequence (e.g. hovering across a toolbar), the zoom animation can feel busy or repetitive. Fade is less noticeable in quick succession.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Zoom is more expressive — only use it where the emphasis adds value',
                body: 'Overusing zoom across all tooltips makes it feel like default noise. Reserve it for high-value tooltips where the animation reinforces that this is a meaningful interaction.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'zoom pairs well with stat breakdowns and rich content tooltips',
                body: 'The scale-in communicates "something opened here", which fits naturally when the tooltip contains non-trivial content like key-value data or an explanatory definition.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<TooltipContent animation="zoom">...</TooltipContent>`}</code>
      </pre>
    </div>
  ),
}

export const SlideUp = {
  name: 'Slide Up',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          animation=&quot;slide-up&quot;
        </code>{' '}
        slides the tooltip in from below while fading in, and slides back down on exit. Use it when
        the tooltip appears above the trigger (side=&quot;top&quot;) for a natural bottom-to-top
        reveal.
      </p>

      <AnimDemo animValue="slide-up" description="Slides in from below while fading" />

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Pair slide-up with side="top" for natural directional flow',
                body: 'slide-up slides the tooltip upward from below — matching the tooltip appearing above the trigger. The motion direction aligns with the final position, making the animation feel intentional.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Don\'t pair slide-up with side="bottom" — the direction conflicts',
                body: 'If the tooltip appears below the trigger, slide-up creates a confusing reverse motion. The tooltip slides away from the trigger direction rather than toward its final position.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: "The motion direction should match the tooltip's final position",
                body: 'Directional animations create spatial expectations. When the motion direction contradicts the tooltip placement, users experience a brief moment of confusion that undermines trust in the UI.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use slide animations only when you can guarantee the side is consistent',
                body: 'If the tooltip side is conditional or unpredictable, use fade or zoom instead — those are directionless and always feel correct regardless of where the tooltip ends up.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* natural pairing: tooltip above trigger */}
<TooltipContent side="top" animation="slide-up">...</TooltipContent>`}</code>
      </pre>
    </div>
  ),
}

export const SlideDown = {
  name: 'Slide Down',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          animation=&quot;slide-down&quot;
        </code>{' '}
        slides the tooltip in from above while fading in, and slides back up on exit. Use it when
        the tooltip appears below the trigger (side=&quot;bottom&quot;) for a natural top-to-bottom
        reveal.
      </p>

      <AnimDemo animValue="slide-down" description="Slides in from above while fading" />

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Pair slide-down with side="bottom" for natural directional flow',
                body: 'slide-down slides the tooltip downward from above — matching the tooltip appearing below the trigger. The motion direction aligns with the final position.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Don\'t pair slide-down with side="top" — the direction conflicts',
                body: 'If the tooltip appears above the trigger, slide-down creates a confusing reverse motion — the tooltip slides down but the target position is up. Use slide-up for top-positioned tooltips.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Conflicting direction (slide-down + tooltip above) creates disorientation',
                body: 'Motion that opposes the final position briefly makes the element look like it is going the wrong way before settling. This is jarring for users sensitive to motion.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: "Use fade when you can't guarantee consistent tooltip side placement",
                body: 'fade and zoom are directionless — they always feel correct regardless of where the tooltip appears. Only use slide-down when side="bottom" is guaranteed.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* natural pairing: tooltip below trigger */}
<TooltipContent side="bottom" animation="slide-down">...</TooltipContent>`}</code>
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
        disables all enter/exit transitions. The tooltip appears and disappears instantly with no
        motion or opacity change. Use this when respecting the user&apos;s reduced-motion
        preference.
      </p>

      <AnimDemo animValue="none" description="Appears instantly — no animation" />

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
                body: 'Without animation, a tooltip appearing in peripheral vision may startle the user. Animation draws the eye gradually, making the tooltip feel like a natural response rather than an abrupt appearance.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Detect prefers-reduced-motion and apply none automatically',
                body: 'Check the OS setting via a CSS media query or useReducedMotion hook and pass animation="none" when it is active. This makes reduced-motion support automatic rather than something users must configure manually.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Apply animation="none" system-wide when reduced-motion is active — not just on individual tooltips',
                body: 'A single tooltip with none while others still animate is inconsistent. When reduced-motion is enabled, apply it globally across all Tooltip instances so the experience is uniform.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* use none when prefers-reduced-motion is active */}
<TooltipContent animation="none">...</TooltipContent>`}</code>
      </pre>
    </div>
  ),
}

// ─── Duration ─────────────────────────────────────────────────────────────────

const presets = ['fast', 'default', 'slow', 'slower']
const presetMs = { fast: 100, default: 150, slow: 300, slower: 500 }

function DurationDemo() {
  const [preset, setPreset] = useState('default')
  const [customMs, setCustomMs] = useState('')
  const [inputMs, setInputMs] = useState('')

  const activeDuration = customMs ? Number(customMs) : preset

  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        {presets.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => {
              setPreset(p)
              setCustomMs('')
              setInputMs('')
            }}
            className={[
              'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
              preset === p && !customMs
                ? 'bg-slate-900 text-white border-slate-900'
                : 'border-slate-200 hover:bg-accent',
            ].join(' ')}
          >
            {p} · {presetMs[p]}ms
          </button>
        ))}
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            min={0}
            max={2000}
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
                setPreset('')
              }
            }}
            className="px-3 py-1.5 rounded-lg border text-xs font-medium hover:bg-accent transition-colors"
          >
            Apply
          </button>
        </div>
      </div>

      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <button type="button" className={btnClass}>
            Hover to preview — duration:{' '}
            {customMs ? `${customMs}ms (custom)` : `${preset} (${presetMs[preset]}ms)`}
          </button>
        </TooltipTrigger>
        <TooltipContent animation="zoom" duration={activeDuration}>
          Animation duration demo
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

export const Duration = {
  name: 'Duration',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Control animation speed with the{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">duration</code> prop. Use named
        presets (<code className="font-mono bg-gray-100 px-1 rounded text-xs">fast</code>,{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">default</code>,{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">slow</code>,{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">slower</code>) or pass a raw
        integer in milliseconds. Select a preset then hover the button to preview.
      </p>

      <DurationDemo />

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Keep duration at the default (150ms) for most tooltips',
                body: 'The default 150ms is fast enough to feel responsive but slow enough for the animation to register. It is the right choice unless there is a specific reason to deviate.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use slow or slower for tooltips in toolbars or dense UIs",
                body: 'A 300–500ms animation on a quick label makes the tooltip feel sluggish, especially when users scan across many triggers rapidly. Reserve slower durations for high-value standalone tooltips.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Use fast (100ms) in toolbars and dense icon-heavy UIs',
                body: 'When users hover through many triggers quickly, the animation should get out of the way. fast reduces perceived latency in toolbar-like contexts where the tooltip is just a quick label.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Raw ms values let you fine-tune to match specific page transition speeds',
                body: 'If the page has a consistent 200ms transition timing, passing duration={200} on tooltips aligns them with the rest of the animation system — keeping the feel cohesive.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* named presets */}
<TooltipContent animation="zoom" duration="fast">...</TooltipContent>
<TooltipContent animation="zoom" duration="default">...</TooltipContent>
<TooltipContent animation="zoom" duration="slow">...</TooltipContent>
<TooltipContent animation="zoom" duration="slower">...</TooltipContent>

{/* raw milliseconds */}
<TooltipContent animation="fade" duration={250}>...</TooltipContent>`}</code>
      </pre>
    </div>
  ),
}
