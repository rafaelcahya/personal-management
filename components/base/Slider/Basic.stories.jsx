import { useState } from 'react'
import Slider from './Slider'
import SliderTooltip from './SliderTooltip'
import { SliderStartLabel, SliderEndLabel, SliderMark } from './SliderParts'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Slider/Basic',
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

const ControlledDemo = () => {
  const [value, setValue] = useState([40])
  return (
    <div className="flex flex-col gap-2">
      <Slider value={value} onValueChange={setValue} showTooltip tooltipFormat={(v) => `${v}%`} />
      <p className="text-xs text-gray-400">
        Current: <code className="font-mono">{value[0]}</code>
      </p>
    </div>
  )
}

const RangeDemo = () => {
  const [value, setValue] = useState([20, 75])
  return (
    <div className="flex flex-col gap-2">
      <Slider value={value} onValueChange={setValue} showTooltip tooltipFormat={(v) => `${v}%`} />
      <p className="text-xs text-gray-400">
        Range:{' '}
        <code className="font-mono">
          {value[0]} – {value[1]}
        </code>
      </p>
    </div>
  )
}

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col gap-10 p-8 w-80">
      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">uncontrolled — defaultValue</span>
        <Slider defaultValue={[40]} />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">controlled with tooltip</span>
        <ControlledDemo />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">range slider — two thumbs</span>
        <RangeDemo />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">start / end labels (props)</span>
        <Slider defaultValue={[50]} startLabel="0" endLabel="100" />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">start / end labels (sub-components)</span>
        <Slider defaultValue={[50]}>
          <SliderStartLabel>Slow</SliderStartLabel>
          <SliderEndLabel>Fast</SliderEndLabel>
        </Slider>
      </div>

      <div className="flex flex-col gap-4">
        <span className="text-xs text-gray-400">marks (props)</span>
        <Slider
          defaultValue={[50]}
          marks={[
            { value: 0, label: '0' },
            { value: 25, label: '25' },
            { value: 50, label: '50' },
            { value: 75, label: '75' },
            { value: 100, label: '100' },
          ]}
          className="mb-4"
        />
      </div>

      <div className="flex flex-col gap-4">
        <span className="text-xs text-gray-400">marks (sub-components)</span>
        <Slider defaultValue={[50]} className="mb-4">
          <SliderMark value={0}>Low</SliderMark>
          <SliderMark value={50}>Mid</SliderMark>
          <SliderMark value={100}>High</SliderMark>
        </Slider>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">custom tooltip via sub-component</span>
        <Slider defaultValue={[60]}>
          <SliderTooltip>{(v) => `${v} km/h`}</SliderTooltip>
        </Slider>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use showTooltip to show the current value while dragging',
                body: 'A slider with no visible value leaves the user guessing. Always pair with showTooltip or a nearby readout so the selected number is clear.',
              },
              {
                title: 'Anchor the scale with startLabel and endLabel',
                body: 'Labels like "0" and "100" or "Slow" and "Fast" tell the user what the extremes mean — critical when the min/max are not obvious from context.',
              },
            ],
          },
          {
            heading: 'Range slider',
            cards: [
              {
                title: 'Use defaultValue={[lo, hi]} for price or date range filters',
                body: 'Passing an array with two values creates a range slider. Each thumb drags independently and cannot cross the other.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`{/* Uncontrolled */}
<Slider defaultValue={[40]} />

{/* Controlled with tooltip */}
const [value, setValue] = useState([40])
<Slider value={value} onValueChange={setValue}
  showTooltip tooltipFormat={(v) => \`\${v}%\`} />

{/* Range slider */}
<Slider defaultValue={[20, 75]}
  showTooltip tooltipFormat={(v) => \`\${v}%\`} />

{/* With labels */}
<Slider defaultValue={[50]} startLabel="0" endLabel="100" />

{/* With marks */}
<Slider
  defaultValue={[50]}
  marks={[
    { value: 0, label: '0' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
  ]}
/>

{/* Custom tooltip */}
<Slider defaultValue={[60]}>
  <SliderTooltip>{(v) => \`\${v} km/h\`}</SliderTooltip>
</Slider>`}</code>
      </pre>
    </div>
  ),
}
