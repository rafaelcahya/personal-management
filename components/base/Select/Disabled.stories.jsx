import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './Select'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldDescription from '../Field/FieldDescription'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Select/Disabled',
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

export const Disabled = {
  name: 'Disabled',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        The disabled state dims the trigger and blocks all interaction. Prefer setting{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">disabled</code> on{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> so the
        label is also dimmed. Pass{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">disabled</code> directly to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">Select</code> for standalone
        usage. Individual{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">SelectItem</code> can also be
        disabled independently.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          via FieldContent disabled — label and description also dimmed
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <FieldContent disabled>
            <FieldLabel>Brand status</FieldLabel>
            <FieldDescription>Auto-assigned — cannot be changed manually.</FieldDescription>
            <Select defaultValue="active">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </FieldContent>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">standalone — Select disabled prop</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <Select defaultValue="active" disabled>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          disabled individual items — whole select stays interactive
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending" disabled>
                Pending (unavailable)
              </SelectItem>
              <SelectItem value="archived" disabled>
                Archived (unavailable)
              </SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title:
                  'Disable a select when the field exists but is not editable in the current context',
                body: 'Auto-assigned statuses, read-only review forms, or values locked by permissions should be visible but non-interactive. Disabling makes the read-only state explicit.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title:
                  "Don't disable a select the user is expected to fill — use conditional visibility instead",
                body: 'A disabled field implies it exists but cannot be used right now. If the user must select a value to proceed, show the select enabled only when the condition is met.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Prefer FieldContent disabled over Select disabled for full a11y coverage',
                body: 'Setting disabled on FieldContent flows the disabled state to SelectTrigger and dims FieldLabel. Screen readers then correctly announce the field as disabled without extra manual wiring.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Add a FieldDescription explaining why the field is disabled',
                body: 'Users seeing a dimmed select often wonder if it is a bug. A short FieldDescription like "Auto-assigned — cannot be changed manually" removes that confusion.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Via FieldContent — recommended */}
<FieldContent disabled>
  <FieldLabel>Brand status</FieldLabel>
  <FieldDescription>Auto-assigned — cannot be changed manually.</FieldDescription>
  <Select defaultValue="active">
    <SelectTrigger>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="active">Active</SelectItem>
      <SelectItem value="inactive">Inactive</SelectItem>
    </SelectContent>
  </Select>
</FieldContent>

{/* Standalone */}
<Select defaultValue="active" disabled>
  <SelectTrigger>
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="active">Active</SelectItem>
  </SelectContent>
</Select>

{/* Disabled individual items */}
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select a status" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="active">Active</SelectItem>
    <SelectItem value="pending" disabled>Pending (unavailable)</SelectItem>
    <SelectItem value="draft">Draft</SelectItem>
  </SelectContent>
</Select>`}</code>
      </pre>
    </div>
  ),
}
