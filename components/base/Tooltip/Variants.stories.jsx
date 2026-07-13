import { Tooltip, TooltipTrigger, TooltipContent } from './Tooltip'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Tooltip/Variants',
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
  'inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors cursor-default'

function VariantDemo({ variant, desc, label }) {
  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-3">
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <button type="button" className={btnClass}>
            {label}
          </button>
        </TooltipTrigger>
        <TooltipContent variant={variant} showArrow>
          {desc}
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

export const Default = {
  name: 'Default',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          variant=&quot;default&quot;
        </code>{' '}
        uses a dark slate background — the standard tooltip style. Use it for neutral labels,
        keyboard shortcuts, and supplemental info that doesn&apos;t carry a semantic tone.
      </p>

      <VariantDemo variant="default" label="Hover me" desc="Neutral label or keyboard shortcut" />

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use default for neutral supplemental info',
                body: 'Default is the right choice for icon button labels, shortcut hints, and any tooltip that does not convey a status or alert. It is the most visually subtle variant.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use default when the tooltip message has semantic weight",
                body: "If the tooltip warns about a destructive action, flags a caution, or confirms a positive state, use the corresponding semantic variant — default implies neutrality and won't reinforce the tone.",
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Default works in both light and dark themes',
                body: 'The slate-900 background has strong contrast against both white and dark page backgrounds. You do not need to switch variants for theme compatibility.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Use default for the majority of tooltips — only reach for semantic variants when tone matters',
                body: 'Overusing colored variants dilutes their meaning. Reserve info, success, warning, and danger for cases where the tooltip message genuinely carries that semantic signal.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* default — no variant prop needed */}
<TooltipContent>Label text</TooltipContent>

{/* or explicit */}
<TooltipContent variant="default">Label text</TooltipContent>`}</code>
      </pre>
    </div>
  ),
}

export const Info = {
  name: 'Info',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant=&quot;info&quot;</code>{' '}
        uses a dark blue background. Use it for contextual definitions, field descriptions, or any
        tooltip that answers a &quot;what is this?&quot; question.
      </p>

      <VariantDemo
        variant="info"
        label="What is P/E ratio?"
        desc="Price-to-Earnings ratio — current share price divided by earnings per share"
      />

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use info to explain concepts or fields the user may not recognize',
                body: 'Info is a strong signal that the tooltip is educational. Use it on abbreviations, financial terms, or field labels that may be unfamiliar to new users.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use info for tooltip text that is obvious from context",
                body: 'Info implies the user needs to learn something. If the label is already self-explanatory (e.g. "Click to submit"), using info variant over-signals importance and adds visual noise.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'Keep info tooltip content concise — link to documentation if more is needed',
                body: "If the explanation is longer than two lines, don't force it into a tooltip. Consider a HoverCard with a link to the full docs, or inline help text below the field.",
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Pair info with an Info icon (ℹ) on the trigger',
                body: 'An info icon tells the user there is supplemental context available before they hover. It sets the expectation and makes the tooltip feel intentional rather than accidental.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<TooltipContent variant="info">
  Price-to-Earnings ratio — current share price divided by earnings per share
</TooltipContent>`}</code>
      </pre>
    </div>
  ),
}

export const Success = {
  name: 'Success',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          variant=&quot;success&quot;
        </code>{' '}
        uses a dark emerald background. Use it to confirm a positive state or that a condition has
        been met — e.g. a checkmark icon button that confirms a trade was executed.
      </p>

      <VariantDemo
        variant="success"
        label="✓ Trade executed"
        desc="Order filled at 9,250 — settlement in T+2"
      />

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use success to confirm a positive state, not as decoration',
                body: 'Success tooltips carry a strong semantic signal. Reserve them for genuinely positive outcomes — completed steps, validated inputs, or confirmed operations.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use success for the default state of a neutral element",
                body: 'Seeing green on hover for a neutral button creates a false signal that something just succeeded. Save success for elements that visually represent a completed or approved state.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'Success carries a strong semantic signal — only use it for genuinely positive states',
                body: 'Using success on non-positive elements trains users to ignore the color. When a real success state appears elsewhere, the variant loses its communicative power.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Match the trigger element visual state to the variant',
                body: 'A success tooltip on a neutral-looking button sends mixed signals. The trigger itself should already look successful (green icon, checkmark) — the tooltip confirms and elaborates.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<TooltipContent variant="success">
  Order filled at 9,250 — settlement in T+2
</TooltipContent>`}</code>
      </pre>
    </div>
  ),
}

export const Warning = {
  name: 'Warning',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          variant=&quot;warning&quot;
        </code>{' '}
        uses a dark amber background. Use it to flag something the user should be cautious about
        before proceeding — low stock, approaching limits, or potentially slow operations.
      </p>

      <VariantDemo
        variant="warning"
        label="⚠ Low stock"
        desc="Only 2 units remaining — consider restocking soon"
      />

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use warning for things that need attention — not for errors',
                body: "Warning is a signal to be careful, not a signal that something broke. Use it for preventive caution — low stock, approaching limits, or risky operations the user hasn't triggered yet.",
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use warning where the situation is already an error",
                body: 'If the user already triggered a problem — failed save, invalid input, exceeded limit — use danger. Warning is for things that could go wrong, not things that already did.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Pair warning with a visible indicator on the trigger',
                body: 'A warning tooltip on a normal-looking button is easy to miss. The trigger element itself should communicate caution — amber text, a ⚠ icon, or a badge — so the tooltip reinforces rather than surprises.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Warning tooltips work best when the trigger already signals caution',
                body: "The tooltip's job is to explain the warning, not announce it. If the trigger looks neutral, users may never hover to find the warning — make the trigger visually cautionary first.",
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<TooltipContent variant="warning">
  Only 2 units remaining — consider restocking soon
</TooltipContent>`}</code>
      </pre>
    </div>
  ),
}

export const Danger = {
  name: 'Danger',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          variant=&quot;danger&quot;
        </code>{' '}
        uses a dark red background. Use it on destructive or irreversible actions — delete buttons,
        permanent overwrites, or anything the user cannot undo after confirming.
      </p>

      <VariantDemo
        variant="danger"
        label="🗑 Delete account"
        desc="This will permanently delete your account and all data. Cannot be undone."
      />

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use danger to reinforce the destructive nature of an action',
                body: 'Danger tooltips work best on already-red or destructive-looking triggers. They serve as a second signal — the trigger communicates danger visually, and the tooltip explains why.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't rely on a tooltip as the only safety gate for a destructive action",
                body: 'Tooltips are hover-only and invisible on touch devices. For truly destructive operations (delete, purge, overwrite), use a confirmation dialog as the primary safety gate — not a tooltip.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'On touch devices, tooltips are invisible — add a confirmation dialog for destructive ops',
                body: 'Mobile users will never see a danger tooltip. If the action is irreversible, a confirmation dialog is the only reliable way to prevent accidental execution on touch.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Danger tooltips work best when the trigger already looks dangerous',
                body: 'A red button with a danger tooltip is a strong double signal. A neutral-looking button with a danger tooltip is likely to be clicked before the user ever hovers — the tooltip arrives too late.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<TooltipContent variant="danger">
  This will permanently delete your account and all data. Cannot be undone.
</TooltipContent>`}</code>
      </pre>
    </div>
  ),
}
