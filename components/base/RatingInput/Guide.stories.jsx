import { useState } from 'react'
import RatingInput from './RatingInput'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldDescription from '../Field/FieldDescription'
import FieldError from '../Field/FieldError'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/RatingInput',
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

const SubSection = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
    {children}
  </div>
)

const Preview = ({ children, wide }) => (
  <div
    className={`flex flex-col gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg mb-3 ${wide ? 'max-w-lg' : 'w-fit'}`}
  >
    {children}
  </div>
)

const Code = ({ children }) => (
  <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto mb-4 leading-relaxed">
    <code>{children}</code>
  </pre>
)

const Tag = ({ children, color = 'gray' }) => {
  const colors = { gray: 'bg-gray-100 text-gray-600', violet: 'bg-violet-100 text-violet-700' }
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-medium ${colors[color]}`}
    >
      {children}
    </span>
  )
}

const cellClass = (j, len) => {
  const base = 'px-3 py-2 border border-gray-200 text-xs'
  if (j === 0) return `${base} font-mono text-violet-700 whitespace-nowrap`
  if (j === len - 1) return `${base} text-gray-700`
  return `${base} font-mono text-gray-500 whitespace-nowrap`
}

const ApiTable = ({ headers, rows }) => (
  <div className="overflow-x-auto mb-4">
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="bg-gray-50">
          {headers.map((h) => (
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
        {rows.map((row, i) => (
          <tr key={i} className="even:bg-gray-50">
            {row.map((cell, j) => (
              <td key={j} className={cellClass(j, row.length)}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const BestPractices = ({ items }) => (
  <div className="flex flex-col gap-8">
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

function FieldDemo({ label = 'Run effort', required = false, error, description, ...props }) {
  const [val, setVal] = useState(null)
  return (
    <FieldContent size="base" error={error}>
      <FieldLabel required={required}>{label}</FieldLabel>
      <RatingInput value={val} onChange={setVal} {...props} />
      {description && (
        <FieldDescription className="text-xs text-slate-400">{description}</FieldDescription>
      )}
      {error && <FieldError />}
    </FieldContent>
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
          <h1 className="text-3xl font-bold text-gray-900">RatingInput</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A rating selector with two styles:{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">star</code> (filled stars
          with optional half-step) and{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">number</code> (numbered
          buttons). Value is a{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">number</code> or{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">null</code> when nothing is
          selected. Pairs with{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">FieldContent</code> for
          accessible labels.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <Preview wide>
          <Demo style="star" />
          <Demo style="star" allowHalf />
          <Demo style="number" />
          <FieldDemo
            label="Run effort (RPE)"
            required
            description="Rate your perceived exertion."
          />
        </Preview>
      </Section>

      {/* Anatomy */}
      <Section
        title="Anatomy"
        description="RatingInput renders a row of StarItems (star style) or NumberItems (number style). Each item reacts to hover and click independently."
      >
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4 overflow-x-auto">
          <div className="flex gap-14">
            {/* Star style */}
            <div className="flex flex-col gap-3 shrink-0">
              <span className="text-xs font-mono text-gray-400 uppercase tracking-wide">
                style=&quot;star&quot;
              </span>
              <div className="relative px-4 pt-6 pb-4 border-2 border-dashed border-violet-400 rounded-xl">
                <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-xs font-mono font-semibold text-violet-600">
                  RatingInput
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div key={n} className="relative size-7">
                      <div
                        className={`size-full rounded ${n <= 3 ? 'bg-amber-100 border border-amber-300' : 'bg-gray-100 border border-gray-200'}`}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-[8px] font-mono text-gray-400">
                        {n}
                      </span>
                      {n === 2 && (
                        <div className="absolute -top-6 left-0 w-fit whitespace-nowrap">
                          <span className="text-[9px] font-mono text-orange-400">StarItem</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-3 text-[9px] font-mono">
                  <span className="text-amber-500">█ filled</span>
                  <span className="text-gray-400">█ empty</span>
                  <span className="text-amber-500">▌ half (allowHalf)</span>
                </div>
              </div>
            </div>

            {/* Number style */}
            <div className="flex flex-col gap-3 shrink-0">
              <span className="text-xs font-mono text-gray-400 uppercase tracking-wide">
                style=&quot;number&quot;
              </span>
              <div className="relative px-4 pt-6 pb-4 border-2 border-dashed border-violet-400 rounded-xl">
                <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-xs font-mono font-semibold text-violet-600">
                  RatingInput
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div
                      key={n}
                      className={`size-8 rounded flex items-center justify-center text-xs font-medium ${n <= 3 ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-500'}`}
                    >
                      {n}
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-3 text-[9px] font-mono">
                  <span className="text-violet-500">█ active</span>
                  <span className="text-gray-400">█ inactive</span>
                </div>
              </div>
            </div>

            {/* Parts */}
            <div className="flex flex-col gap-2 shrink-0">
              <span className="text-xs font-mono text-gray-400 uppercase tracking-wide">Parts</span>
              <ApiTable
                headers={['Part', 'Used when']}
                rows={[
                  ['StarItem', 'style="star"'],
                  ['NumberItem', 'style="number"'],
                ]}
              />
            </div>
          </div>
        </div>

        <Code>{`import RatingInput from '@/components/base/RatingInput/RatingInput'

const [val, setVal] = useState(null)

<RatingInput value={val} onChange={setVal} />`}</Code>
      </Section>

      {/* Style */}
      <Section
        title="Style"
        description='Two styles via the style prop. "star" uses filled star icons. "number" uses numbered buttons up to max.'
      >
        <Preview>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-violet-700">
              style=&quot;star&quot; (default)
            </span>
            <Demo style="star" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-violet-700">style=&quot;number&quot;</span>
            <Demo style="number" />
          </div>
        </Preview>
        <Code>{`<RatingInput style="star"   value={val} onChange={setVal} />
<RatingInput style="number" value={val} onChange={setVal} />`}</Code>
      </Section>

      {/* Allow Half */}
      <Section
        title="Allow Half"
        description='allowHalf enables 0.5-step selection on star style. Hover or click the left half of a star to select x.5. Has no effect on style="number".'
      >
        <Preview>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-violet-700">allowHalf=false (default)</span>
            <Demo style="star" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-violet-700">allowHalf=true</span>
            <Demo style="star" allowHalf />
          </div>
        </Preview>
        <Code>{`{/* Integer steps only */}
<RatingInput value={val} onChange={setVal} />

{/* Half steps — hover left half of a star for x.5 */}
<RatingInput allowHalf value={val} onChange={setVal} />`}</Code>
      </Section>

      {/* Max */}
      <Section
        title="Max"
        description="Controls the number of stars or the highest number button. Default 5."
      >
        <Preview>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-violet-700">max=5 (default)</span>
            <Demo max={5} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-violet-700">max=10</span>
            <Demo max={10} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-violet-700">max=3</span>
            <Demo max={3} />
          </div>
        </Preview>
        <Code>{`<RatingInput max={5}  value={val} onChange={setVal} />  {/* default */}
<RatingInput max={10} value={val} onChange={setVal} />
<RatingInput max={3}  value={val} onChange={setVal} />`}</Code>
      </Section>

      {/* Clearable */}
      <Section
        title="Clearable"
        description="clearable=true (default) allows the user to reset the value to null by clicking the currently selected rating again."
      >
        <Preview>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-violet-700">
              clearable=true (default) — click selected again to clear
            </span>
            <Demo />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-violet-700">
              clearable=false — selection is permanent
            </span>
            <Demo clearable={false} />
          </div>
        </Preview>
        <Code>{`<RatingInput clearable value={val} onChange={setVal} />           {/* default */}
<RatingInput clearable={false} value={val} onChange={setVal} />`}</Code>
      </Section>

      {/* Read Only */}
      <Section
        title="Read Only"
        description="readOnly renders the rating as a display-only element. No hover or click interaction."
      >
        <Preview>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-violet-700">readOnly — star</span>
            <RatingInput readOnly value={3.5} allowHalf />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-violet-700">readOnly — number</span>
            <RatingInput readOnly style="number" value={7} max={10} />
          </div>
        </Preview>
        <Code>{`{/* Display only — no interaction */}
<RatingInput readOnly value={3.5} allowHalf />
<RatingInput readOnly style="number" value={7} max={10} />`}</Code>
      </Section>

      {/* Disabled */}
      <Section
        title="Disabled"
        description="Muted and non-interactive. Also inherits from FieldContent context."
      >
        <Preview>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-violet-700">disabled — no value</span>
            <RatingInput disabled />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-violet-700">disabled — with value</span>
            <RatingInput disabled value={3} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-violet-700">Via FieldContent disabled</span>
            <FieldContent size="base" disabled>
              <FieldLabel>Run effort</FieldLabel>
              <RatingInput value={3} />
            </FieldContent>
          </div>
        </Preview>
        <Code>{`<RatingInput disabled value={val} onChange={setVal} />

<FieldContent size="base" disabled>
  <FieldLabel>Run effort</FieldLabel>
  <RatingInput value={val} onChange={setVal} />
</FieldContent>`}</Code>
      </Section>

      {/* With FieldContent */}
      <Section
        title="With FieldContent"
        description="Pair with FieldLabel, FieldDescription, and FieldError for accessible form fields."
      >
        <SubSection title="Import">
          <Code>{`import FieldContent from '@/components/base/Field/FieldContent'
import FieldLabel from '@/components/base/Field/FieldLabel'
import FieldDescription from '@/components/base/Field/FieldDescription'
import FieldError from '@/components/base/Field/FieldError'`}</Code>
        </SubSection>

        <SubSection title="Controlled with FieldContent">
          <Preview wide>
            <FieldDemo
              label="Run effort (RPE)"
              required
              description="Rate your perceived exertion from 1–5."
            />
            <FieldDemo
              label="Trade confidence"
              style="number"
              max={10}
              description="How confident are you in this trade?"
            />
            <FieldDemo label="Required rating" required error="Please provide a rating." />
          </Preview>
          <Code>{`<FieldContent size="base">
  <FieldLabel required>Run effort (RPE)</FieldLabel>
  <RatingInput value={val} onChange={setVal} />
  <FieldDescription className="text-xs text-slate-400">Rate your perceived exertion from 1–5.</FieldDescription>
</FieldContent>

<FieldContent size="base" error="Please provide a rating.">
  <FieldLabel required>Required rating</FieldLabel>
  <RatingInput value={val} onChange={setVal} />
  <FieldError />
</FieldContent>`}</Code>
        </SubSection>
      </Section>

      {/* react-hook-form */}
      <Section
        title="With react-hook-form"
        description="Use Controller. RatingInput's onChange passes a number or null, not a native event."
      >
        <Code>{`import { Controller } from 'react-hook-form'

<Controller
  name="effort"
  control={control}
  rules={{
    validate: (v) => v !== null || 'Please provide a rating.',
  }}
  render={({ field }) => (
    <FieldContent size="base" error={errors.effort?.message}>
      <FieldLabel required>Run effort (RPE)</FieldLabel>
      <RatingInput
        value={field.value ?? null}
        onChange={field.onChange}
      />
      <FieldError />
    </FieldContent>
  )}
/>`}</Code>
      </Section>

      {/* Props */}
      <Section title="Props">
        <ApiTable
          headers={['Prop', 'Type', 'Default', 'Description']}
          rows={[
            ['value', 'number | null', 'null', 'Controlled value. null means nothing is selected.'],
            [
              'onChange',
              '(val: number | null) => void',
              '—',
              'Fires with the selected rating, or null when cleared.',
            ],
            ['style', '"star" | "number"', '"star"', 'Visual style of the rating items.'],
            ['max', 'number', '5', 'Number of stars or highest number button.'],
            ['allowHalf', 'boolean', 'false', 'Enable 0.5-step selection. Star style only.'],
            ['readOnly', 'boolean', 'false', 'Render as display-only. No hover or click.'],
            [
              'clearable',
              'boolean',
              'true',
              'Allow clicking the active rating again to reset value to null.',
            ],
            [
              'disabled',
              'boolean',
              'false',
              'Muted and non-interactive. Also inherits from FieldContent.',
            ],
            ['className', 'string', '—', 'Additional classes on the wrapper.'],
          ]}
        />
      </Section>

      {/* Best Practices */}
      <Section title="Best Practices">
        <BestPractices
          items={[
            {
              heading: 'Value handling',
              cards: [
                {
                  title: 'Value is null when nothing is selected — not 0',
                  body: 'An empty rating returns null, not 0. If the field is required, validate that val !== null in your validation rules. Checking val > 0 also works but be explicit.',
                },
                {
                  title: 'Use Controller from react-hook-form — not register',
                  body: 'onChange fires a number or null, not a native DOM event. register cannot capture it. Wrap with Controller and pass value={field.value ?? null}.',
                },
              ],
            },
            {
              heading: 'Style choice',
              cards: [
                {
                  title: 'Use star for subjective quality or effort ratings',
                  body: 'Stars are universally understood as a rating scale — good for run effort, food quality, satisfaction. Keep max at 5 for star style.',
                },
                {
                  title: 'Use number for precise scores with a known scale',
                  body: 'Trade confidence 1–10, pain scale, RPE — any case where the specific number matters and users need to read it clearly. Keep number max at 10 or below.',
                },
              ],
            },
            {
              heading: 'Display vs interaction',
              cards: [
                {
                  title: 'Use readOnly for display — not disabled',
                  body: 'disabled implies the field was interactive and is now locked. readOnly means it was never meant to be interactive. Use the semantically correct one.',
                },
              ],
            },
          ]}
        />
      </Section>
    </div>
  ),
}
