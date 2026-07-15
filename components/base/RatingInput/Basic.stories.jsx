import { useState } from 'react'
import RatingInput from './RatingInput'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/RatingInput/Basic',
}

export default meta

// ─── Demo helpers ─────────────────────────────────────────────────────────────

function Demo(props) {
  const [val, setVal] = useState(null)
  return (
    <div className="flex flex-col gap-1">
      <RatingInput value={val} onChange={setVal} {...props} />
      <span className="text-[10px] font-mono text-gray-400">
        value: <span className="text-gray-700">{val === null ? 'null' : val}</span>
      </span>
    </div>
  )
}

// ─── BestPractices ────────────────────────────────────────────────────────────

const BestPractices = ({ items }) => (
  <div className="flex flex-col gap-8 w-full">
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

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        Default star rating. Click a star to select. Click the same star again to clear back to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">null</code>. Value is a{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">number</code> or{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">null</code>.
      </span>

      <div className="flex flex-col gap-4">
        <Demo />
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use RatingInput for subjective numerical feedback',
                body: 'Run effort (RPE), trade confidence, food quality, product satisfaction — any context where a user rates something on a 1–N scale.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Value is null when nothing is selected — validate accordingly',
                body: 'An empty rating returns null, not 0. If the field is required, validate that val !== null in your validation rules.',
              },
              {
                title: 'Use Controller from react-hook-form — not register',
                body: 'onChange fires a number or null, not a native event. register cannot capture it. Wrap with Controller and pass value={field.value ?? null}.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`const [val, setVal] = useState(null)

<RatingInput value={val} onChange={setVal} />`}</code>
      </pre>
    </div>
  ),
}

export const Style = {
  name: 'Style',
  render: () => (
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        <code className="font-mono bg-gray-100 px-1 rounded">style="star"</code> renders filled star
        icons. <code className="font-mono bg-gray-100 px-1 rounded">style="number"</code> renders
        numbered buttons up to <code className="font-mono bg-gray-100 px-1 rounded">max</code>.
        Default is <code className="font-mono bg-gray-100 px-1 rounded">"star"</code>.
      </span>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">style="star" (default)</span>
          <Demo style="star" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">style="number"</span>
          <Demo style="number" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">style="number" max=10</span>
          <Demo style="number" max={10} />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use each',
            cards: [
              {
                title: 'Use star for quality, effort, or sentiment ratings',
                body: 'Stars are universally understood as a rating scale. Good for run effort, food quality, product satisfaction, or any 1–5 subjective score.',
              },
              {
                title: 'Use number for precise scores or RPE-style scales',
                body: 'Number buttons are clearer when the exact value matters — trade confidence 1–10, pain scale 0–10, or any scale where reading a specific number is important.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Keep number max at 10 or below',
                body: 'More than 10 number buttons wraps or overflows on small screens. For higher scales, use a Slider instead.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`<RatingInput style="star"   value={val} onChange={setVal} />
<RatingInput style="number" value={val} onChange={setVal} />
<RatingInput style="number" max={10} value={val} onChange={setVal} />`}</code>
      </pre>
    </div>
  ),
}

export const AllowHalf = {
  name: 'Allow Half',
  render: () => (
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        <code className="font-mono bg-gray-100 px-1 rounded">allowHalf</code> enables 0.5-step
        selection. Hover or click the <strong>left half</strong> of a star to select x.5, the{' '}
        <strong>right half</strong> for the full value. Has no effect on{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">style="number"</code>.
      </span>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">allowHalf=false (default)</span>
          <Demo />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">allowHalf=true</span>
          <Demo allowHalf />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use allowHalf when half-step granularity is meaningful',
                body: 'Average ratings (e.g. 3.5 stars from an aggregate) or effort scales where 0.5 differences matter. Avoid for simple 1–5 subjective ratings where integer steps are precise enough.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'allowHalf only works with style="star"',
                body: 'Number buttons are always integer values. Passing allowHalf with style="number" has no effect.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`{/* Integer steps only */}
<RatingInput value={val} onChange={setVal} />

{/* Half steps — hover left half of a star for x.5 */}
<RatingInput allowHalf value={val} onChange={setVal} />`}</code>
      </pre>
    </div>
  ),
}

export const ReadOnly = {
  name: 'Read Only',
  render: () => (
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        <code className="font-mono bg-gray-100 px-1 rounded">readOnly</code> renders the rating as a
        display-only element — no hover effect, no click interaction. Useful for showing a score in
        a list or card.
      </span>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">readOnly — star integer</span>
          <RatingInput readOnly value={4} />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">readOnly — star half</span>
          <RatingInput readOnly value={3.5} allowHalf />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">readOnly — number</span>
          <RatingInput readOnly style="number" value={7} max={10} />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use readOnly for displaying aggregated or historical ratings',
                body: 'Average scores in a list, submitted effort values in a run log, or a trading journal — anywhere the rating is informational, not editable.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use readOnly for display — not disabled',
                body: 'disabled implies the field was interactive and is now locked. readOnly makes clear from the start that the field is display-only. Use the semantically correct one.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`<RatingInput readOnly value={4} />
<RatingInput readOnly value={3.5} allowHalf />
<RatingInput readOnly style="number" value={7} max={10} />`}</code>
      </pre>
    </div>
  ),
}
