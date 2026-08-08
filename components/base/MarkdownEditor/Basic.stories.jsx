import { useState } from 'react'
import MarkdownEditor from './MarkdownEditor'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldDescription from '../Field/FieldDescription'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'MarkdownEditor/Basic',
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

const SAMPLE = `# Marathon Training Plan 2025

A structured guide to breaking the **4-hour barrier** at the *Jakarta Marathon*.

---

## Phase 1 — Base Building

Build aerobic capacity over **12 weeks** before introducing speed work.

### Weekly Structure

1. Monday — Rest or easy cross-training
2. Tuesday — Tempo run *(6–8 km at lactate threshold)*
3. Wednesday — Easy recovery run
4. Thursday — Interval session
5. Friday — Rest
6. Saturday — Long run *(20–32 km)*
7. Sunday — Easy shakeout

### Key Metrics

- Weekly mileage: **60–80 km**
- Long run pace: ~5:45 /km
- Easy run effort: conversational

---

## Phase 2 — Speed Work

> "Speed is earned in training, not on race day." — Coach advice

Introduce intervals after week 8 of base building.

#### Sample Interval Session

\`\`\`
8 × 800m @ 3:45 /km
Recovery: 90 sec walk between reps
Total volume: ~10 km with warm-up/cool-down
\`\`\`

Use \`pace calculator\` to convert target finish time to per-km splits.

---

## Phase 3 — Race Preparation

Taper for **3 weeks** before race day. Reduce mileage by ~40% while keeping intensity.

##### Taper Checklist

- [ ] Reduce long run to 14 km by race week
- [ ] Sleep 8+ hours nightly
- [ ] Carb load 2 days before race
- [ ] Prepare race kit and nutrition strategy

###### Nutrition on Race Day

Aim for **60–90g of carbs per hour** using gels every 45 minutes. Stay hydrated — [Strava nutrition guide](https://strava.com) has detailed plans.

---

~~Old target: sub-4:30~~ — updated after fitness test result.`

export const Basic = {
  name: 'Basic',
  render: () => {
    const [value, setValue] = useState(SAMPLE)
    return (
      <div className="flex flex-col gap-6 w-full">
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
          The default state — two tabs (Write and Preview), formatting toolbar, and full markdown
          rendering. Wrap in{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> to wire
          up accessible label, description, and error automatically. Switch to the Preview tab to
          see the rendered output.
        </p>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">
            with FieldContent — label and description wired automatically
          </span>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-[680px]">
            <FieldContent required>
              <FieldLabel>Goal Description</FieldLabel>
              <FieldDescription>
                Supports **bold**, *italic*, lists, headings, links, and code.
              </FieldDescription>
              <MarkdownEditor value={value} onChange={setValue} minHeight="480px" />
            </FieldContent>
          </div>
        </div>

        <BestPractices
          items={[
            {
              heading: 'When to use',
              cards: [
                {
                  title: 'Use MarkdownEditor when the value will be rendered as formatted text',
                  body: 'Goal descriptions, race notes, trade journal entries, and AI coach prompts benefit from headings, bold, lists, and code blocks. Use plain Textarea for values that will never be rendered as markdown.',
                },
                {
                  title: 'Set minHeight to match expected content length',
                  body: 'A short notes field needs 120–160px; a full article or structured plan benefits from 400px+. Match the height to the expected amount of text to avoid the editor feeling cramped.',
                },
              ],
            },
            {
              heading: 'When not to use',
              cards: [
                {
                  title: "Don't use MarkdownEditor for single-line or plain-text values",
                  body: 'Names, tags, and short notes that will never be rendered as markdown should use Input or Textarea. MarkdownEditor adds a tab bar and toolbar that are unnecessary overhead for plain text.',
                },
              ],
            },
            {
              heading: 'Accessibility',
              cards: [
                {
                  title: 'Always wrap in FieldContent with a FieldLabel',
                  body: 'FieldContent generates the id and wires it to FieldLabel via htmlFor, and to FieldDescription via aria-describedby. Without this wiring the textarea inside has no accessible name for screen readers.',
                },
              ],
            },
            {
              heading: 'Advice',
              cards: [
                {
                  title: 'Use with react-hook-form via Controller',
                  body: 'Pass field.value to value and field.onChange to onChange. MarkdownEditor is a fully controlled component — it does not manage its own state.',
                },
              ],
            },
          ]}
        />

        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
          <code>{`{/* With FieldContent */}
<FieldContent required>
  <FieldLabel>Goal Description</FieldLabel>
  <FieldDescription>Supports markdown formatting.</FieldDescription>
  <MarkdownEditor value={value} onChange={setValue} minHeight="480px" />
</FieldContent>

{/* With react-hook-form */}
<Controller
  name="description"
  control={control}
  render={({ field }) => (
    <FieldContent>
      <FieldLabel>Description</FieldLabel>
      <MarkdownEditor
        value={field.value ?? ''}
        onChange={field.onChange}
        minHeight="240px"
      />
    </FieldContent>
  )}
/>`}</code>
        </pre>
      </div>
    )
  },
}
