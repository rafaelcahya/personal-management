import { useState } from 'react'
import RatingInput from './RatingInput'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/RatingInput/Basic',
}

export default meta

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

// ─── Basic ────────────────────────────────────────────────────────────────────

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Default star rating. Click a star to select, click the same star again to clear back to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">null</code>.
      </p>

      <div className="flex flex-col gap-4 w-80">
        <Demo />
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`const [val, setVal] = useState(null)

<RatingInput value={val} onChange={setVal} />`}</code>
      </pre>
    </div>
  ),
}

// ─── Style ────────────────────────────────────────────────────────────────────

export const Style = {
  name: 'Style',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">style="star"</code> renders
        filled star icons.{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">style="number"</code> renders
        numbered buttons up to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">max</code>.
      </p>

      <div className="flex flex-col gap-5 w-80">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-violet-700">style="star" (default)</span>
          <Demo style="star" />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-violet-700">style="number"</span>
          <Demo style="number" />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-violet-700">style="number" max=10</span>
          <Demo style="number" max={10} />
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<RatingInput style="star"   value={val} onChange={setVal} />
<RatingInput style="number" value={val} onChange={setVal} />
<RatingInput style="number" max={10} value={val} onChange={setVal} />`}</code>
      </pre>
    </div>
  ),
}

// ─── AllowHalf ────────────────────────────────────────────────────────────────

export const AllowHalf = {
  name: 'Allow Half',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">allowHalf</code> enables
        0.5-step selection. Hover or click the <strong>left half</strong> of a star to select x.5,
        the <strong>right half</strong> for the full value.
      </p>

      <div className="flex flex-col gap-5 w-80">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-violet-700">allowHalf=false (default)</span>
          <Demo />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-violet-700">allowHalf=true</span>
          <Demo allowHalf />
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<RatingInput value={val} onChange={setVal} />
<RatingInput allowHalf value={val} onChange={setVal} />`}</code>
      </pre>
    </div>
  ),
}

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const Sizes = {
  name: 'Sizes',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Three sizes. Works for both star and number style.
      </p>

      <div className="flex flex-col gap-4">
        {['sm', 'base', 'md'].map((size) => {
          const [valStar, setValStar] = useState(null)
          const [valNum, setValNum] = useState(null)
          return (
            <div key={size} className="flex items-center gap-6">
              <span className="text-xs font-mono text-gray-400 w-8 shrink-0">{size}</span>
              <RatingInput size={size} value={valStar} onChange={setValStar} />
              <RatingInput size={size} style="number" value={valNum} onChange={setValNum} />
            </div>
          )
        })}
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<RatingInput size="sm"   value={val} onChange={setVal} />
<RatingInput size="base" value={val} onChange={setVal} />  {/* default */}
<RatingInput size="md"   value={val} onChange={setVal} />`}</code>
      </pre>
    </div>
  ),
}

// ─── ReadOnly ─────────────────────────────────────────────────────────────────

export const ReadOnly = {
  name: 'Read Only',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">readOnly</code> renders the
        rating as a display-only element — no hover effect, no click interaction. Useful for showing
        a score in a list or card.
      </p>

      <div className="flex flex-col gap-4 w-80">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-violet-700">readOnly — star integer</span>
          <RatingInput readOnly value={4} />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-violet-700">readOnly — star half</span>
          <RatingInput readOnly value={3.5} allowHalf />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-violet-700">readOnly — number</span>
          <RatingInput readOnly style="number" value={7} max={10} />
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<RatingInput readOnly value={4} />
<RatingInput readOnly value={3.5} allowHalf />
<RatingInput readOnly style="number" value={7} max={10} />`}</code>
      </pre>
    </div>
  ),
}
