import { useState } from 'react'
import Slider from './Slider'
import SliderTooltip from './SliderTooltip'
import { SliderStartLabel, SliderEndLabel, SliderMark } from './SliderParts'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldDescription from '../Field/FieldDescription'
import FieldError from '../Field/FieldError'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Slider',
}

export default meta

// ─── Primitives ───────────────────────────────────────────────────────────────

const Section = ({ title, description, children }) => (
  <div className="mb-12">
    <h2 className="text-xl font-semibold text-gray-900 mb-1">{title}</h2>
    {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
    <hr className="mb-5 border-gray-200" />
    {children}
  </div>
)

const SubSection = ({ title, description, children }) => (
  <div className="mb-8">
    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">{title}</h3>
    {description && <p className="text-xs text-gray-500 mb-3">{description}</p>}
    {children}
  </div>
)

const Preview = ({ children }) => (
  <div className="flex flex-col gap-6 p-6 bg-gray-50 border border-gray-200 rounded-lg mb-3 w-96">
    {children}
  </div>
)

const Code = ({ children }) => (
  <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto mb-4 leading-relaxed">
    <code>{children}</code>
  </pre>
)

const Tag = ({ children, color = 'gray' }) => {
  const colors = {
    gray: 'bg-gray-100 text-gray-600',
    violet: 'bg-violet-100 text-violet-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
  }
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-medium ${colors[color]}`}
    >
      {children}
    </span>
  )
}

const ControlledDemo = () => {
  const [value, setValue] = useState([40])
  return (
    <div className="flex flex-col gap-2">
      <Slider value={value} onValueChange={setValue} showTooltip tooltipFormat={(v) => `${v}%`} />
      <p className="text-xs text-gray-500">
        Current value: <code className="font-mono">{value[0]}</code>
      </p>
    </div>
  )
}

const RangeDemo = () => {
  const [value, setValue] = useState([20, 75])
  return (
    <div className="flex flex-col gap-2">
      <Slider value={value} onValueChange={setValue} showTooltip tooltipFormat={(v) => `${v}%`} />
      <p className="text-xs text-gray-500">
        Range:{' '}
        <code className="font-mono">
          {value[0]} – {value[1]}
        </code>
      </p>
    </div>
  )
}

// ─── Story ────────────────────────────────────────────────────────────────────

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="p-8 max-w-4xl font-sans text-gray-900">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Slider</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A range input. Supports single value and range (two thumbs), three variants, six sizes,
          tooltips (props shortcut or{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">SliderTooltip</code>{' '}
          sub-component), start/end labels, tick marks, thumb connect behavior — all composable with{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">FieldContent</code>.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <Preview>
          <ControlledDemo />
          <RangeDemo />
          <Slider
            defaultValue={[50]}
            startLabel="0%"
            endLabel="100%"
            showTooltip
            tooltipFormat={(v) => `${v}%`}
          />
        </Preview>
      </Section>

      {/* Anatomy */}
      <Section
        title="Anatomy"
        description="All parts of the Slider component — each part can be composed independently."
      >
        {/* Box diagram */}
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4">
          {/* Slider root */}
          <div className="flex flex-col gap-2 p-4 border-2 border-dashed border-violet-400 rounded-xl">
            <span className="text-[10px] font-mono font-semibold text-violet-600">Slider</span>

            {/* Tooltip row */}
            <div className="flex flex-col gap-1 px-3 py-2 border border-dashed border-green-300 rounded self-center w-24">
              <span className="text-[10px] font-mono text-green-500">SliderTooltip</span>
              <div className="bg-white border border-slate-200 shadow-sm rounded-lg px-2 py-0.5 self-start">
                <span className="text-[10px] text-slate-500 font-mono">50</span>
              </div>
            </div>

            {/* Track row */}
            <div className="flex items-stretch gap-2">
              {/* StartLabel */}
              <div className="flex flex-col gap-1 px-3 py-2 border border-dashed border-green-300 rounded shrink-0 justify-center">
                <span className="text-[10px] font-mono text-green-500">SliderStartLabel</span>
                <span className="text-xs text-slate-400 font-mono">0</span>
              </div>

              {/* Track */}
              <div className="flex flex-col gap-1 flex-1 p-3 border border-dashed border-slate-300 rounded">
                <span className="text-[10px] font-mono text-slate-400">Track</span>
                <div className="flex items-stretch gap-1 mt-1">
                  {/* Range */}
                  <div className="flex flex-col gap-1 flex-1 px-2 py-2 border border-dashed border-blue-300 rounded">
                    <span className="text-[10px] font-mono text-blue-500">Range</span>
                  </div>
                  {/* Thumb */}
                  <div className="flex flex-col items-center gap-1.5 px-3 py-2 border border-dashed border-blue-300 rounded shrink-0">
                    <span className="text-[10px] font-mono text-blue-500">Thumb</span>
                    <div className="size-4 rounded-full bg-white border-2 border-violet-500 shadow-sm" />
                  </div>
                  {/* Remaining track space */}
                  <div className="flex-1 border border-dashed border-transparent rounded" />
                </div>
              </div>

              {/* EndLabel */}
              <div className="flex flex-col gap-1 px-3 py-2 border border-dashed border-green-300 rounded shrink-0 justify-center">
                <span className="text-[10px] font-mono text-green-500">SliderEndLabel</span>
                <span className="text-xs text-slate-400 font-mono">100</span>
              </div>
            </div>

            {/* Marks row */}
            <div className="flex flex-col gap-1.5 px-3 py-2 border border-dashed border-green-300 rounded">
              <span className="text-[10px] font-mono text-green-500">SliderMark</span>
              <div className="flex justify-between px-1">
                {['0', '25', '50', '75', '100'].map((m) => (
                  <span key={m} className="text-[10px] text-slate-400 font-mono">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {['Part', 'Element', 'Description'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700 text-xs uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                [
                  'Slider',
                  '<span>',
                  'Root component. Manages value, range, keyboard interaction, and context.',
                ],
                ['Track', '<span>', 'Full horizontal bar. Height scales with size prop.'],
                [
                  'Range',
                  '<span>',
                  'Filled portion of the track. Color follows the variant (violet / destructive / muted).',
                ],
                ['Thumb', '<span>', 'Draggable handle. Styled via thumbConnect prop.'],
                [
                  'SliderTooltip',
                  '<div>',
                  'Shows current value above the thumb. Props shortcut: showTooltip + tooltipFormat.',
                ],
                [
                  'SliderStartLabel',
                  '<span>',
                  'Optional label at the left end of the track. Props shortcut: startLabel.',
                ],
                [
                  'SliderEndLabel',
                  '<span>',
                  'Optional label at the right end of the track. Props shortcut: endLabel.',
                ],
                [
                  'SliderMark',
                  '<span>',
                  'Tick label at a specific value. Reads min/max from context. Props shortcut: marks array.',
                ],
              ].map(([part, el, desc]) => (
                <tr key={part} className="even:bg-gray-50">
                  <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                    {part}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400 whitespace-nowrap">
                    {el}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Code>{`import Slider from '@/components/base/Slider/Slider'
import SliderTooltip from '@/components/base/Slider/SliderTooltip'
import { SliderStartLabel, SliderEndLabel, SliderMark } from '@/components/base/Slider/SliderParts'

{/* Props shortcut */}
<Slider
  defaultValue={[55]}
  thumbConnect="both"
  showTooltip
  tooltipFormat={(v) => \`\${v}\`}
  startLabel="0"
  endLabel="100"
  marks={[{ value: 25, label: '25' }, { value: 50, label: '50' }, { value: 75, label: '75' }]}
/>

{/* Sub-components */}
<Slider defaultValue={[55]} thumbConnect="both">
  <SliderTooltip>{(v) => v}</SliderTooltip>
  <SliderStartLabel>0</SliderStartLabel>
  <SliderEndLabel>100</SliderEndLabel>
  <SliderMark value={25}>25</SliderMark>
  <SliderMark value={50}>50</SliderMark>
  <SliderMark value={75}>75</SliderMark>
</Slider>`}</Code>
      </Section>

      {/* Variants */}
      <Section
        title="Variants"
        description="Three variants covering normal, error, and disabled states."
      >
        {[
          {
            variant: 'default',
            label: 'Default',
            useCase: 'Normal interactive slider — the standard state for all form fields.',
            defaultValue: [50],
          },
          {
            variant: 'error',
            label: 'Error',
            useCase:
              'Invalid value — triggered by validation failure. Auto-applied when FieldContent has an error prop.',
            defaultValue: [20],
          },
          {
            variant: 'disabled',
            label: 'Disabled',
            useCase:
              'Non-interactive slider — user cannot move the thumb. Auto-applied when FieldContent has disabled prop.',
            defaultValue: [60],
          },
        ].map(({ variant, label, useCase, defaultValue }) => (
          <div
            key={variant}
            className="flex items-start gap-4 mb-4 p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors"
          >
            <div className="w-48 shrink-0 pt-2">
              <Slider variant={variant} defaultValue={defaultValue} />
            </div>
            <div>
              <p className="text-xs font-mono font-medium text-violet-700 mb-1">
                variant="{variant}"
              </p>
              <p className="text-xs text-gray-500 leading-relaxed">{useCase}</p>
            </div>
          </div>
        ))}
      </Section>

      {/* Sizes */}
      <Section title="Sizes" description="Six sizes — controls track height and thumb size.">
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {['Size', 'Track', 'Thumb', 'Preview'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-600"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['xs', '2px', '12px'],
                ['sm', '3px', '14px'],
                ['base', '4px', '16px'],
                ['md', '6px', '18px'],
                ['lg', '8px', '20px'],
                ['xl', '10px', '24px'],
              ].map(([size, track, thumb]) => (
                <tr key={size} className="even:bg-gray-50">
                  <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700">
                    {size}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-gray-600">{track}</td>
                  <td className="px-3 py-2 border border-gray-200 text-gray-600">{thumb}</td>
                  <td className="px-3 py-3 border border-gray-200 w-48">
                    <Slider size={size} defaultValue={[50]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Thumb Connect */}
      <Section
        title="Thumb Connect"
        description="Controls when the thumb border adopts the track's accent color — creating a visual connection between thumb and filled range."
      >
        {[
          {
            value: 'both',
            isDefault: true,
            trigger: 'Always',
            description:
              'Thumb border is always violet — permanently connected to the filled range. Default behavior.',
          },
          {
            value: 'hover',
            trigger: 'Hover only',
            description:
              'Border is neutral when idle. Turns violet only when mouse is over the thumb.',
          },
          {
            value: 'drag',
            trigger: 'Drag only',
            description:
              'Border is neutral when idle and on hover. Turns violet only while the thumb is being moved.',
          },
          {
            value: 'none',
            trigger: 'Never',
            description:
              'Thumb border is always neutral (slate-200). No visual connection with the track at any time.',
          },
        ].map(({ value, isDefault, trigger, description }) => (
          <div
            key={value}
            className="flex items-start gap-4 mb-4 p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors"
          >
            <div className="w-48 shrink-0 pt-1">
              <Slider defaultValue={[55]} thumbConnect={value} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs font-mono font-medium text-violet-700">
                  thumbConnect="{value}"
                </p>
                {isDefault && <Tag color="gray">default</Tag>}
              </div>
              <p className="text-xs font-semibold text-gray-600 mb-0.5">{trigger}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
            </div>
          </div>
        ))}

        <SubSection title="Usage">
          <Code>{`{/* Default — connects on hover and drag */}
<Slider defaultValue={[50]} />

{/* Connect on hover only */}
<Slider defaultValue={[50]} thumbConnect="hover" />

{/* Connect on drag only */}
<Slider defaultValue={[50]} thumbConnect="drag" />

{/* Never connect */}
<Slider defaultValue={[50]} thumbConnect="none" />`}</Code>
        </SubSection>

        <SubSection
          title="Error variant"
          description="When variant is error, the connect color follows destructive instead of violet."
        >
          <Preview>
            <Slider defaultValue={[30]} variant="error" thumbConnect="both" />
          </Preview>
          <Code>{`<Slider defaultValue={[30]} variant="error" thumbConnect="both" />`}</Code>
        </SubSection>
      </Section>

      {/* Tooltip */}
      <Section
        title="Tooltip"
        description="Two ways to add a tooltip — props shortcut for simple cases, sub-component for custom render."
      >
        <SubSection title="Props shortcut">
          <Preview>
            <Slider defaultValue={[60]} showTooltip tooltipFormat={(v) => `${v}%`} />
          </Preview>
          <Code>{`<Slider
  defaultValue={[60]}
  showTooltip
  tooltipFormat={(v) => \`\${v}%\`}
/>`}</Code>
        </SubSection>

        <SubSection title="SliderTooltip sub-component (custom render)">
          <Preview>
            <Slider defaultValue={[40]}>
              <SliderTooltip>{(v) => `${v} km/h`}</SliderTooltip>
            </Slider>
          </Preview>
          <Code>{`<Slider defaultValue={[40]}>
  <SliderTooltip>{(v) => \`\${v} km/h\`}</SliderTooltip>
</Slider>`}</Code>
        </SubSection>

        <SubSection title="Range slider with tooltip (each thumb gets its value)">
          <Preview>
            <Slider defaultValue={[25, 70]} showTooltip tooltipFormat={(v) => `${v}%`} />
          </Preview>
          <Code>{`<Slider
  defaultValue={[25, 70]}
  showTooltip
  tooltipFormat={(v) => \`\${v}%\`}
/>`}</Code>
        </SubSection>
      </Section>

      {/* Labels */}
      <Section
        title="Labels"
        description="Start/end labels anchor the scale. Marks label specific points along the track."
      >
        <SubSection title="Start & End labels — props">
          <Preview>
            <Slider defaultValue={[50]} startLabel="Min" endLabel="Max" />
            <Slider defaultValue={[50]} startLabel="0%" endLabel="100%" />
          </Preview>
          <Code>{`<Slider defaultValue={[50]} startLabel="Min" endLabel="Max" />
<Slider defaultValue={[50]} startLabel="0%" endLabel="100%" />`}</Code>
        </SubSection>

        <SubSection title="Start & End labels — sub-components">
          <Preview>
            <Slider defaultValue={[50]}>
              <SliderStartLabel>Slow</SliderStartLabel>
              <SliderEndLabel>Fast</SliderEndLabel>
            </Slider>
          </Preview>
          <Code>{`<Slider defaultValue={[50]}>
  <SliderStartLabel>Slow</SliderStartLabel>
  <SliderEndLabel>Fast</SliderEndLabel>
</Slider>`}</Code>
        </SubSection>

        <SubSection title="Marks — props">
          <Preview>
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
          </Preview>
          <Code>{`<Slider
  defaultValue={[50]}
  marks={[
    { value: 0, label: '0' },
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 75, label: '75' },
    { value: 100, label: '100' },
  ]}
/>`}</Code>
        </SubSection>

        <SubSection title="Marks — sub-components (SliderMark reads min/max from context)">
          <Preview>
            <Slider defaultValue={[50]} className="mb-4">
              <SliderMark value={0}>Low</SliderMark>
              <SliderMark value={50}>Mid</SliderMark>
              <SliderMark value={100}>High</SliderMark>
            </Slider>
          </Preview>
          <Code>{`<Slider defaultValue={[50]}>
  <SliderMark value={0}>Low</SliderMark>
  <SliderMark value={50}>Mid</SliderMark>
  <SliderMark value={100}>High</SliderMark>
</Slider>`}</Code>
        </SubSection>
      </Section>

      {/* Field integration */}
      <Section
        title="Field Integration"
        description="Wrap in FieldContent to get label, description, and error — same pattern as Input, Select, etc."
      >
        <SubSection title="With label and description">
          <Preview>
            <FieldContent size="base">
              <FieldLabel>Confidence level</FieldLabel>
              <Slider defaultValue={[70]} showTooltip tooltipFormat={(v) => `${v}%`} />
              <FieldDescription>How confident are you in this estimate?</FieldDescription>
            </FieldContent>
          </Preview>
          <Code>{`<FieldContent size="base">
  <FieldLabel>Confidence level</FieldLabel>
  <Slider defaultValue={[70]} showTooltip tooltipFormat={(v) => \`\${v}%\`} />
  <FieldDescription>How confident are you in this estimate?</FieldDescription>
</FieldContent>`}</Code>
        </SubSection>

        <SubSection title="Error state via FieldContent">
          <Preview>
            <FieldContent size="base" error="Value must be at least 50%.">
              <FieldLabel>Minimum threshold</FieldLabel>
              <Slider defaultValue={[20]} showTooltip tooltipFormat={(v) => `${v}%`} />
              <FieldError />
            </FieldContent>
          </Preview>
          <Code>{`<FieldContent size="base" error="Value must be at least 50%.">
  <FieldLabel>Minimum threshold</FieldLabel>
  <Slider defaultValue={[20]} showTooltip tooltipFormat={(v) => \`\${v}%\`} />
  <FieldError />
</FieldContent>`}</Code>
        </SubSection>

        <SubSection title="Disabled via FieldContent">
          <Preview>
            <FieldContent size="base" disabled>
              <FieldLabel>Budget allocation</FieldLabel>
              <Slider defaultValue={[60]} />
              <FieldDescription>Cannot be changed after submission.</FieldDescription>
            </FieldContent>
          </Preview>
          <Code>{`<FieldContent size="base" disabled>
  <FieldLabel>Budget allocation</FieldLabel>
  <Slider defaultValue={[60]} />
  <FieldDescription>Cannot be changed after submission.</FieldDescription>
</FieldContent>`}</Code>
        </SubSection>
      </Section>

      {/* Props table */}
      <Section title="Slider Props">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {['Prop', 'Type', 'Default', 'Description'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                [
                  'variant',
                  '"default" | "error" | "disabled"',
                  'auto',
                  'Visual state — auto-derived from FieldContent context. Override explicitly when used standalone.',
                ],
                [
                  'size',
                  '"xs" | "sm" | "base" | "md" | "lg" | "xl"',
                  'ctx or "base"',
                  'Controls track height and thumb size. Inherits FieldContent context size.',
                ],
                [
                  'thumbConnect',
                  '"both" | "hover" | "drag" | "none"',
                  '"both"',
                  'Controls when the thumb border matches the track accent color. "both" = always connected, "hover" = on hover only, "drag" = on drag only, "none" = never.',
                ],
                [
                  'showTooltip',
                  'boolean',
                  'false',
                  'Props shortcut to show a tooltip above the thumb. Use tooltipFormat to format the value.',
                ],
                [
                  'tooltipFormat',
                  '(value: number) => string',
                  '—',
                  'Format function for the tooltip content when using showTooltip.',
                ],
                ['startLabel', 'string', '—', 'Text label at the start (left) of the track.'],
                ['endLabel', 'string', '—', 'Text label at the end (right) of the track.'],
                [
                  'marks',
                  '{ value: number, label: string }[]',
                  '—',
                  'Array of tick marks with labels positioned along the track.',
                ],
                ['min', 'number', '0', 'Minimum value.'],
                ['max', 'number', '100', 'Maximum value.'],
                ['step', 'number', '1', 'Step increment.'],
                [
                  'defaultValue',
                  'number[]',
                  '[50]',
                  'Initial value(s) for uncontrolled usage. Array length determines number of thumbs.',
                ],
                ['value', 'number[]', '—', 'Controlled value. Must match length of defaultValue.'],
                [
                  'onValueChange',
                  '(values: number[]) => void',
                  '—',
                  'Callback fired on every value change.',
                ],
              ].map(([prop, type, def, desc]) => (
                <tr key={prop} className="even:bg-gray-50">
                  <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                    {prop}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500 max-w-xs">
                    {type}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400 whitespace-nowrap">
                    {def}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Sub-components table */}
      <Section title="Sub-components">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {['Component', 'Props', 'Description'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                [
                  'SliderTooltip',
                  'children: (value) => ReactNode',
                  'Custom tooltip rendered above each thumb. Reads current thumb value via context.',
                ],
                [
                  'SliderStartLabel',
                  'children: ReactNode',
                  'Label placed to the left of the track. Reads size from context.',
                ],
                [
                  'SliderEndLabel',
                  'children: ReactNode',
                  'Label placed to the right of the track. Reads size from context.',
                ],
                [
                  'SliderMark',
                  'value: number, children: ReactNode',
                  'Tick mark label positioned at a specific value. Reads min/max from context for positioning.',
                ],
              ].map(([comp, propss, desc]) => (
                <tr key={comp} className="even:bg-gray-50">
                  <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                    {comp}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500 max-w-xs">
                    {propss}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  ),
}
