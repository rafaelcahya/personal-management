import Textarea from './Textarea'
import FieldContent from '../Field/FieldContent'
import FieldControl from '../Field/FieldControl'
import FieldError from '../Field/FieldError'
import FieldLabel from '../Field/FieldLabel'
import FieldDescription from '../Field/FieldDescription'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Textarea',
}

export default meta

// ─── Primitives ──────────────────────────────────────────────────────────────

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
  <div className="flex flex-col gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg mb-3 w-80">
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

// ─── Story ───────────────────────────────────────────────────────────────────

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="p-8 max-w-4xl font-sans text-gray-900">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Textarea</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A multi-line text input with the same variant system as{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">Input</code>. Reads context
          from <code className="font-mono bg-gray-100 px-1 rounded text-sm">FieldContent</code> for
          error state and disabled state — works standalone too.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <Preview>
          <FieldContent size="base" required>
            <FieldLabel>Notes</FieldLabel>
            <Textarea rows={4} placeholder="Write something..." />
            <FieldDescription>Max 500 characters.</FieldDescription>
          </FieldContent>
        </Preview>
      </Section>

      {/* Anatomy */}
      <Section
        title="Anatomy"
        description="Textarea composes with the Field system — same as Input but without prefix/suffix overlays."
      >
        {/* Box diagram */}
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4">
          <div className="relative p-4 border-2 border-dashed border-violet-400 rounded-xl">
            <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-[10px] font-mono font-semibold text-violet-600">
              FieldContent
            </span>

            <div className="relative px-3 py-1.5 border border-dashed border-slate-300 rounded mb-2">
              <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-slate-400">
                FieldLabel
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Notes</span>
            </div>

            <div className="relative p-2 border border-dashed border-blue-300 rounded mb-2">
              <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-blue-500">
                Textarea
              </span>
              <div className="h-8 flex items-start pt-1">
                <span className="text-[10px] text-slate-300 font-mono">Write something...</span>
              </div>
            </div>

            <div className="relative px-3 py-1.5 border border-dashed border-green-300 rounded mb-2">
              <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-green-500">
                FieldDescription
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Max 500 characters.</span>
            </div>

            <div className="relative px-3 py-1.5 border border-dashed border-green-300 rounded">
              <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-green-500">
                FieldError
              </span>
              <span className="text-[10px] text-slate-400 font-mono">This field is required.</span>
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
                  'FieldContent',
                  '<div>',
                  'Root wrapper. Provides accessible IDs, error state, disabled, and size via context.',
                ],
                [
                  'FieldLabel',
                  '<label>',
                  'Accessible label linked to the textarea via context ID.',
                ],
                [
                  'Textarea',
                  '<textarea>',
                  'Core textarea element. Reads variant, size, error, and disabled from FieldContent context.',
                ],
                [
                  'FieldDescription',
                  '<p>',
                  'Helper text shown below the textarea. Linked via aria-describedby.',
                ],
                [
                  'FieldError',
                  '<p>',
                  'Renders the error message from FieldContent. Only visible when error prop is set.',
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

        <Code>{`<FieldContent size="base" required error={errors.notes?.message}>
  <FieldLabel>Notes</FieldLabel>
  <Textarea placeholder="Write something..." rows={4} />
  <FieldDescription>Max 500 characters.</FieldDescription>
  <FieldError />
</FieldContent>`}</Code>
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
            useCase: 'Normal editable textarea — the standard state for all form fields.',
            value: 'Lorem ipsum dolor sit amet.',
          },
          {
            variant: 'error',
            label: 'Error',
            useCase:
              'Invalid input — triggered by validation failure. Auto-applied when FieldContent has an error prop.',
            value: 'too short',
          },
          {
            variant: 'disabled',
            label: 'Disabled',
            useCase:
              'Non-interactive field — user cannot focus or edit. Auto-applied when FieldContent has disabled prop.',
            value: 'Cannot be edited.',
          },
        ].map(({ variant, label, useCase, value }) => (
          <div
            key={variant}
            className="flex items-start gap-4 mb-4 p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors"
          >
            <div className="w-52 shrink-0">
              <Textarea variant={variant} rows={3} defaultValue={value} />
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

      {/* Rows */}
      <Section
        title="Rows"
        description="Use the rows prop to control the initial visible height of the textarea."
      >
        <div className="flex flex-col gap-4 w-80 mb-4">
          {[2, 4, 6].map((rows) => (
            <div key={rows} className="flex flex-col gap-1">
              <p className="text-xs font-mono text-violet-700">rows={`{${rows}}`}</p>
              <Textarea rows={rows} placeholder={`rows=${rows}`} />
            </div>
          ))}
        </div>
        <Code>{`<Textarea rows={2} placeholder="Short note" />
<Textarea rows={4} placeholder="Standard note (default)" />
<Textarea rows={6} placeholder="Long description" />`}</Code>
      </Section>

      {/* Props */}
      <Section title="Props">
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
                  'Auto-derived from FieldContent context. Override explicitly when used standalone.',
                ],
                [
                  'rows',
                  'number',
                  '4',
                  'Number of visible text rows — controls the initial height.',
                ],
                ['className', 'string', '—', 'CSS classes applied to the <textarea> element.'],
                [
                  '...props',
                  'HTMLTextareaProps',
                  '—',
                  'All native textarea attributes (maxLength, placeholder, etc.)',
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

      {/* Usage Examples */}
      <Section title="Usage Examples" description="Copy-ready code for common scenarios.">
        <SubSection title="With Label & Description">
          <Code>{`<FieldContent size="base" required>
  <FieldLabel>Notes</FieldLabel>
  <Textarea rows={4} placeholder="Write something..." />
  <FieldDescription>Max 500 characters.</FieldDescription>
</FieldContent>`}</Code>
        </SubSection>

        <SubSection title="Error State">
          <Preview>
            <FieldContent size="base" required error="Notes must be at least 20 characters.">
              <FieldLabel>Notes</FieldLabel>
              <FieldControl>
                <Textarea rows={4} defaultValue="too short" />
              </FieldControl>
              <FieldError />
            </FieldContent>
          </Preview>
          <Code>{`<FieldContent size="base" required error="Notes must be at least 20 characters.">
  <FieldLabel>Notes</FieldLabel>
  <FieldControl>
    <Textarea rows={4} defaultValue="too short" />
  </FieldControl>
  <FieldError />
</FieldContent>`}</Code>
        </SubSection>

        <SubSection title="Disabled">
          <Code>{`{/* Via variant prop */}
<Textarea rows={3} variant="disabled" placeholder="..." />

{/* Via FieldContent context */}
<FieldContent size="base" disabled>
  <FieldLabel>Notes</FieldLabel>
  <FieldControl>
    <Textarea rows={3} defaultValue="Cannot be edited." />
  </FieldControl>
</FieldContent>`}</Code>
        </SubSection>

        <SubSection title="Standalone (no FieldContent)">
          <Code>{`<Textarea rows={6} placeholder="Write your message..." />`}</Code>
        </SubSection>
      </Section>
    </div>
  ),
}
