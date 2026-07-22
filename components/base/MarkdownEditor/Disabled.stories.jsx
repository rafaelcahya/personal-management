import MarkdownEditor from './MarkdownEditor'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldDescription from '../Field/FieldDescription'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'MarkdownEditor/Disabled',
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

const CONTENT = `## Auto-generated Summary\n\nThis race note was created by the AI coach and **cannot be edited** manually.\n\n- Distance: 42.2 km\n- Finish time: 3:58:12\n- Avg pace: 5:38 /km`

export const Disabled = {
  name: 'Disabled',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        The disabled state dims the editor and blocks all interaction — both tabs and the formatting
        toolbar are non-interactive. Prefer setting{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">disabled</code> on{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> so the
        label is also dimmed. Use{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant="disabled"</code>{' '}
        directly only for standalone usage without FieldContent.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          via FieldContent disabled — label and description also dimmed
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-[680px]">
          <FieldContent disabled>
            <FieldLabel>Race Notes</FieldLabel>
            <FieldDescription>Auto-generated — cannot be edited manually.</FieldDescription>
            <MarkdownEditor value={CONTENT} minHeight="200px" />
          </FieldContent>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          standalone variant="disabled" — no FieldContent
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-[680px]">
          <MarkdownEditor variant="disabled" value={CONTENT} minHeight="200px" />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title:
                  'Disable the editor when content is system-generated or read-only in context',
                body: 'AI-generated summaries, auto-filled race notes, or coach-created plans should be visible but non-editable. Disabling makes the read-only state explicit rather than hiding the field entirely.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't disable an editor the user needs to fill",
                body: 'A disabled editor implies it exists but cannot be used right now, which is confusing if the user must write content to proceed. If the field is conditionally editable, show it enabled only when the condition is met.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'Prefer FieldContent disabled over variant="disabled" for full a11y coverage',
                body: 'Setting disabled on FieldContent flows the disabled attribute to the textarea and dims the FieldLabel. Screen readers then correctly announce the field as disabled without extra manual wiring.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Add a FieldDescription explaining why the editor is disabled',
                body: 'Users seeing a dimmed editor often wonder if it is a bug. A short FieldDescription like "Auto-generated — cannot be edited manually" removes that confusion and builds trust in the UI.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Via FieldContent — recommended */}
<FieldContent disabled>
  <FieldLabel>Race Notes</FieldLabel>
  <FieldDescription>Auto-generated — cannot be edited manually.</FieldDescription>
  <MarkdownEditor value={content} minHeight="160px" />
</FieldContent>

{/* Standalone */}
<MarkdownEditor variant="disabled" value={content} minHeight="160px" />`}</code>
      </pre>
    </div>
  ),
}
