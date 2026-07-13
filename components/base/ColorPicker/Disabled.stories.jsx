import { ColorPicker } from './ColorPicker'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/ColorPicker/Disabled',
}

export default meta

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

export const Disabled = {
  name: 'Disabled',
  render: () => (
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        Pass <code className="font-mono bg-gray-100 px-1 rounded">disabled</code> to prevent
        interaction. The trigger becomes non-clickable and visually dimmed. Also propagates from{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">FieldContent</code> context.
      </span>

      <div className="w-64 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">disabled prop</span>
          <ColorPicker defaultValue="#7c3aed" disabled />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">Via FieldContent disabled</span>
          <FieldContent disabled>
            <FieldLabel>Brand color</FieldLabel>
            <ColorPicker defaultValue="#3b82f6" />
          </FieldContent>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Disable when the color is locked for the current context',
                body: 'A color set by system config, inherited from a theme, or frozen after submission should be disabled — the value stays visible but cannot be changed.',
              },
              {
                title: 'Use FieldContent disabled for full field suppression',
                body: 'Wrapping in FieldContent with disabled automatically dims the label and locks the picker — no need to pass disabled separately to ColorPicker.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Add a FieldDescription explaining why the field is locked',
                body: 'A dimmed field with no explanation confuses users. Use FieldDescription to say "Set by theme — contact your admin to change" so users know why they cannot interact.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`{/* Direct prop */}
<ColorPicker defaultValue="#7c3aed" disabled />

{/* Via FieldContent context */}
<FieldContent disabled>
  <FieldLabel>Brand color</FieldLabel>
  <ColorPicker defaultValue="#3b82f6" />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
