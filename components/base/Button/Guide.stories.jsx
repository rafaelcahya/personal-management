import { Plus, Trash2, Download, Save, ArrowRight, X } from 'lucide-react'
import Button from './Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Button',
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
  <div className="flex flex-wrap gap-3 items-center p-4 bg-gray-50 border border-gray-200 rounded-lg mb-3">
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

// ─── Props table helper ───────────────────────────────────────────────────────
const ApiTable = ({ component, rows }) => (
  <div className="mb-6">
    {component && <p className="text-xs font-mono font-semibold text-gray-500 mb-2">{component}</p>}
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-50">
            {['Prop', 'Type', 'Default', 'Description'].map((h) => (
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
          {rows.map(([prop, type, def, desc]) => (
            <tr key={prop} className="even:bg-gray-50">
              <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                {prop}
              </td>
              <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500 max-w-xs">
                {type}
              </td>
              <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400">
                {def}
              </td>
              <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

// ─── Story ───────────────────────────────────────────────────────────────────

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="p-8 max-w-4xl font-sans text-gray-900">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Button</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A flexible, accessible button component with six visual variants, five sizes, icon support
          with configurable positioning, and built-in loading state. Built on top of CVA for
          type-safe variant management.
        </p>
      </div>

      {/* Overview */}
      <Section
        title="Overview"
        description="Use Button to trigger actions or navigate. Choose the variant that matches the action's importance in the current context."
      >
        <Preview>
          <Button variant="default">Save changes</Button>
          <Button variant="secondary">Cancel</Button>
          <Button variant="outline">Preview</Button>
          <Button variant="ghost">Learn more</Button>
          <Button variant="destructive" useIcon={<Trash2 />}>
            Delete
          </Button>
          <Button variant="link">View details</Button>
        </Preview>
      </Section>

      {/* Anatomy */}
      <Section
        title="Anatomy"
        description="A button is composed of up to three slots: leading icon, label, and trailing icon."
      >
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4">
          <div className="relative inline-flex p-5 border-2 border-dashed border-violet-400 rounded-xl gap-4">
            <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-[10px] font-mono font-semibold text-violet-600">
              Button
            </span>

            {/* Icon left */}
            <div className="relative px-3 py-2 border border-dashed border-green-300 rounded shrink-0">
              <span className="absolute -top-2 left-1 bg-gray-50 px-0.5 text-[10px] font-mono text-green-500">
                useIcon
              </span>
              <Plus className="size-4 text-slate-400" />
            </div>

            {/* Label */}
            <div className="relative px-5 py-2 border border-dashed border-blue-300 rounded">
              <span className="absolute -top-2 left-1.5 bg-gray-50 px-0.5 text-[10px] font-mono text-blue-500">
                children
              </span>
              <span className="text-sm text-slate-500 font-mono">Add Item</span>
            </div>

            {/* Icon right */}
            <div className="relative px-3 py-2 border border-dashed border-green-300 rounded shrink-0">
              <span className="absolute -top-2 left-1 bg-gray-50 px-0.5 text-[10px] font-mono text-green-500">
                useIcon
              </span>
              <ArrowRight className="size-4 text-slate-400" />
            </div>
          </div>

          <p className="mt-4 text-[10px] text-gray-400 font-mono">
            When isLoading=true, the icon slot is replaced by a Spinner regardless of useIcon.
          </p>
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
                ['children', '<span>', 'Button label text. Required.'],
                [
                  'Icon',
                  'ReactNode',
                  'Optional icon rendered before or after children. Pass via useIcon prop. Position via iconPosition ("left" | "right").',
                ],
                [
                  'Spinner',
                  '—',
                  'Auto-rendered in the icon slot when isLoading=true. Keeps button width stable.',
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

        <Code>{`import Button from '@/components/base/Button/Button'
import { Plus } from 'lucide-react'

{/* Default */}
<Button>Save</Button>

{/* With icon */}
<Button useIcon={<Plus />} iconPosition="left">Add Item</Button>

{/* Loading */}
<Button isLoading>Saving...</Button>`}</Code>
      </Section>

      {/* Variants */}
      <Section
        title="Variants"
        description="Six variants covering the full range of action importance."
      >
        {[
          {
            variant: 'default',
            label: 'Default',
            useCase: 'Primary CTA — the single most important action on a page. Use sparingly.',
          },
          {
            variant: 'secondary',
            label: 'Secondary',
            useCase: 'Secondary action — supporting the primary, such as Cancel or Back.',
          },
          {
            variant: 'outline',
            label: 'Outline',
            useCase: 'Tertiary action with primary-colored border — less prominent than Default.',
          },
          {
            variant: 'ghost',
            label: 'Ghost',
            useCase: 'Subtle action — toolbars, inline actions, or icon-only buttons.',
          },
          {
            variant: 'destructive',
            label: 'Destructive',
            useCase: 'Dangerous actions — delete, reset, or irreversible operations.',
          },
          {
            variant: 'link',
            label: 'Link',
            useCase: 'Inline navigation that looks like a hyperlink but behaves as a button.',
          },
        ].map(({ variant, label, useCase }) => (
          <div
            key={variant}
            className="flex items-start gap-4 mb-4 p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors"
          >
            <div className="w-36 shrink-0">
              <Button variant={variant}>{label}</Button>
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
      <Section
        title="Sizes"
        description="Five text sizes and five icon-only sizes. Choose based on context density."
      >
        <SubSection title="Text Sizes" description="For buttons with a label.">
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {['Size', 'Height', 'Padding', 'Text', 'Best for', 'Preview'].map((h) => (
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
                  ['xs', '24px', 'px-2', 'text-xs', 'Dense tables, compact toolbars', 'xs'],
                  ['sm', '28px', 'px-3', 'text-xs', 'Secondary actions in tight layouts', 'sm'],
                  ['md', '32px', 'px-3.5', 'text-sm', 'Default for most UI contexts', 'md'],
                  ['lg', '36px', 'px-4', 'text-sm', 'Forms, modals, standard dialogs', 'lg'],
                  ['xl', '40px', 'px-6', 'text-sm', 'Hero sections, prominent CTAs', 'xl'],
                ].map(([size, h, p, t, use, label]) => (
                  <tr key={size} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700">
                      {size}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-gray-600">{h}</td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-gray-600">
                      {p}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-gray-600">
                      {t}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-gray-500">{use}</td>
                    <td className="px-3 py-2 border border-gray-200">
                      <Button size={size}>{label}</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SubSection>

        <SubSection
          title="Icon Sizes"
          description="Square buttons for icon-only use. Always include aria-label."
        >
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {['Size', 'Dimension', 'Preview'].map((h) => (
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
                  ['icon-xs', '24×24px'],
                  ['icon-sm', '28×28px'],
                  ['icon-md', '32×32px'],
                  ['icon-lg', '36×36px'],
                  ['icon-xl', '40×40px'],
                ].map(([size, dim]) => (
                  <tr key={size} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700">
                      {size}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-gray-600">{dim}</td>
                    <td className="px-3 py-2 border border-gray-200">
                      <Button size={size} useIcon aria-label="action" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SubSection>
      </Section>

      {/* ── API Reference ──────────────────────────────────────────────────── */}
      <Section title="API Reference">
        <ApiTable
          component="Button"
          rows={[
            [
              'variant',
              "'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'",
              "'default'",
              'Visual style of the button.',
            ],
            [
              'size',
              "'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-md' | 'icon-lg' | 'icon-xl'",
              "'md'",
              'Button dimensions.',
            ],
            [
              'useIcon',
              'boolean | ReactElement',
              'false',
              'true renders the default Plus icon; pass a React element for a custom icon.',
            ],
            [
              'iconPosition',
              "'left' | 'right'",
              "'left'",
              'Position of the icon relative to the label.',
            ],
            ['isLoading', 'boolean', 'false', 'Shows a spinner and disables interaction.'],
            [
              'loadingText',
              'string',
              "'Loading'",
              'Screen-reader-only text announced during loading state.',
            ],
            ['disabled', 'boolean', 'false', 'Disables the button.'],
            ['fullWidth', 'boolean', 'false', 'Stretches the button to fill its container width.'],
            [
              'asChild',
              'boolean',
              'false',
              'Merge button props onto the single child element via Radix Slot.',
            ],
            [
              'as',
              'React.ElementType',
              "'button'",
              'Render as a different HTML element (e.g. "a", "div").',
            ],
            ['className', 'string', '—', 'Additional CSS classes merged via twMerge.'],
            ['children', 'ReactNode', '—', 'Button label content.'],
          ]}
        />
      </Section>

      {/* States */}
      <Section
        title="States"
        description="All variants support disabled and loading states out of the box."
      >
        <SubSection title="Normal vs Disabled vs Loading">
          {['default', 'secondary', 'outline', 'ghost', 'destructive'].map((variant) => (
            <div key={variant} className="flex items-center gap-4 mb-3">
              <span className="w-24 text-xs font-mono text-violet-700 shrink-0">{variant}</span>
              <div className="flex gap-3">
                <Button variant={variant}>Normal</Button>
                <Button variant={variant} disabled>
                  Disabled
                </Button>
                <Button variant={variant} isLoading>
                  Loading
                </Button>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-4 mb-3">
            <span className="w-24 text-xs font-mono text-violet-700 shrink-0">link</span>
            <div className="flex gap-3">
              <Button variant="link">Normal</Button>
              <Button variant="link" disabled>
                Disabled
              </Button>
            </div>
          </div>
        </SubSection>
      </Section>

      {/* Icon Usage */}
      <Section
        title="Icon Usage"
        description="Icons are managed via the useIcon prop — sizing is handled automatically based on the size prop."
      >
        <SubSection
          title="Icon Left"
          description="Default position. Pass useIcon={true} for the default Plus icon, or useIcon={<Icon />} for a custom icon."
        >
          <Preview>
            <Button useIcon>Add Item</Button>
            <Button variant="outline" useIcon={<Download />}>
              Export
            </Button>
            <Button variant="secondary" useIcon={<Save />}>
              Save Draft
            </Button>
          </Preview>
        </SubSection>

        <SubSection
          title="Icon Right"
          description='Use iconPosition="right" to place the icon after the label.'
        >
          <Preview>
            <Button useIcon={<ArrowRight />} iconPosition="right">
              Continue
            </Button>
            <Button variant="outline" useIcon={<Download />} iconPosition="right">
              Export
            </Button>
            <Button variant="ghost" useIcon={<ArrowRight />} iconPosition="right">
              Learn more
            </Button>
          </Preview>
        </SubSection>

        <SubSection
          title="Icon Only"
          description='Use size="icon-*" with useIcon. Always provide an aria-label for accessibility.'
        >
          <Preview>
            <Button size="icon-md" useIcon aria-label="Add" />
            <Button size="icon-md" variant="outline" useIcon aria-label="Add" />
            <Button size="icon-md" variant="ghost" useIcon aria-label="Add" />
            <Button size="icon-md" variant="destructive" useIcon={<Trash2 />} aria-label="Delete" />
            <Button size="icon-md" variant="secondary" useIcon={<X />} aria-label="Close" />
          </Preview>
        </SubSection>
      </Section>

      {/* Full Width */}
      <Section
        title="Full Width"
        description="Use fullWidth to stretch a button to fill its container. Useful for mobile forms, modal footers, and stacked action groups."
      >
        <SubSection title="Single Button">
          <div className="w-72">
            <Preview>
              <Button fullWidth>Save changes</Button>
            </Preview>
          </div>
        </SubSection>

        <SubSection title="Action Stack">
          <div className="w-72 flex flex-col gap-2">
            <Button fullWidth>Save changes</Button>
            <Button variant="secondary" fullWidth>
              Cancel
            </Button>
          </div>
        </SubSection>

        <SubSection title="With Icon and Loading">
          <div className="w-72 flex flex-col gap-2">
            <Button fullWidth useIcon={<Plus />}>
              Add item
            </Button>
            <Button variant="outline" fullWidth isLoading>
              Saving
            </Button>
          </div>
        </SubSection>
      </Section>

      {/* Render As */}
      <Section
        title="Render As"
        description="Button can render as any element. Use asChild for framework components like Next.js Link, or as for native HTML elements."
      >
        <SubSection
          title="asChild — component merging"
          description="Merges all button props (className, onClick, aria-*, ref) onto the single child element. Preferred for Next.js Link."
        >
          <Preview>
            <Button asChild>
              <a href="#">Go to Dashboard</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="#">View docs</a>
            </Button>
          </Preview>
        </SubSection>

        <SubSection
          title="as — polymorphic element"
          description='Renders the button as a different HTML element. rel="noopener noreferrer" is injected automatically when as="a" and target="_blank".'
        >
          <Preview>
            <Button as="a" href="#">
              Native anchor
            </Button>
            <Button variant="secondary" as="a" href="#" target="_blank">
              Open in new tab
            </Button>
          </Preview>
        </SubSection>
      </Section>

      {/* ── Best Practices ─────────────────────────────────────────────────── */}
      <Section title="Best Practices">
        <div className="flex flex-col gap-8">
          {[
            {
              heading: 'When to use',
              items: [
                {
                  title: 'Use Button when the action triggers a mutation or state change',
                  body: 'Save, Submit, Delete, Confirm — any action that writes data or changes app state belongs on a Button. Buttons imply a consequence; that is the right semantic when something will happen.',
                },
                {
                  title: 'Use isLoading when the action is async',
                  body: 'Form submits, API calls, and file uploads need a loading state to prevent double-submits and show users their action registered. The spinner renders in the icon slot so the button width stays stable.',
                },
                {
                  title: 'Use disabled when a required precondition is not yet met',
                  body: 'Required fields empty, terms not accepted, insufficient permissions. Always pair disabled with a tooltip or inline message that explains what the user needs to do.',
                },
              ],
            },
            {
              heading: 'When not to use',
              items: [
                {
                  title:
                    'Don\'t use Button for pure navigation — use variant="link" or asChild with Next.js Link',
                  body: 'Buttons imply an action with a consequence; navigation should use anchor semantics. Use variant="link" with asChild and Next.js Link, or a native <a> tag for links to routes or external URLs.',
                },
                {
                  title: 'Don\'t use variant="default" for multiple actions in the same view',
                  body: 'The filled default variant draws the most visual attention. Using it on more than one button per form, modal, or section dilutes the primary action. Pair with secondary, outline, or ghost for supporting actions.',
                },
              ],
            },
            {
              heading: 'Accessibility',
              items: [
                {
                  title: 'Icon-only buttons require aria-label — always',
                  body: 'Without aria-label, screen readers announce nothing meaningful for icon-only buttons. The component logs a console error in development when it is missing on any icon-* size.',
                },
                {
                  title: 'Customize loadingText to describe the in-progress action',
                  body: 'The default "Loading" is generic. Pass loadingText="Saving" on a save button, "Deleting" on a delete button so screen reader users hear what is happening instead of just "Loading".',
                },
              ],
            },
            {
              heading: 'Advice',
              items: [
                {
                  title: 'Use asChild with Next.js Link for in-app navigation',
                  body: 'asChild merges all button props — including className, aria-*, and ref — onto the Link child without creating a nested anchor. This is the preferred pattern for Next.js navigation.',
                },
                {
                  title: 'Use fullWidth inside a constrained container, not a wide desktop layout',
                  body: 'A full-width button that spans an entire desktop viewport looks unbalanced. Wrap the button group in a max-w-sm or w-72 container so fullWidth fills a natural column width, not the whole screen.',
                },
              ],
            },
          ].map(({ heading, items }) => (
            <div key={heading}>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                {heading}
              </p>
              <div className="flex flex-col gap-3">
                {items.map(({ title, body }) => (
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
      </Section>

      {/* Usage Examples */}
      <Section title="Usage Examples" description="Copy-ready code for common scenarios.">
        <SubSection title="Form Submit">
          <Code>{`<form onSubmit={handleSubmit}>
  {/* form fields */}
  <div className="flex gap-3">
    <Button type="submit" isLoading={isSubmitting}>
      Save changes
    </Button>
    <Button type="button" variant="secondary" onClick={onCancel}>
      Cancel
    </Button>
  </div>
</form>`}</Code>
        </SubSection>

        <SubSection title="Delete Confirmation">
          <Code>{`<Button
  variant="destructive"
  useIcon={<Trash2 />}
  isLoading={isDeleting}
  onClick={handleDelete}
>
  Delete account
</Button>`}</Code>
        </SubSection>

        <SubSection title="Toolbar Actions">
          <Code>{`<div className="flex gap-1">
  <Button size="icon-sm" variant="ghost" useIcon={<Download />} aria-label="Download" />
  <Button size="icon-sm" variant="ghost" useIcon={<Save />}     aria-label="Save" />
  <Button size="icon-sm" variant="ghost" useIcon={<X />}        aria-label="Close" />
</div>`}</Code>
        </SubSection>

        <SubSection title="Continue / Next Step">
          <Code>{`<Button useIcon={<ArrowRight />} iconPosition="right" size="lg">
  Continue to payment
</Button>`}</Code>
        </SubSection>

        <SubSection title="Next.js Link via asChild">
          <Code>{`import Link from 'next/link'

<Button asChild>
  <Link href="/dashboard">Go to Dashboard</Link>
</Button>

<Button variant="outline" asChild>
  <Link href="/settings">Settings</Link>
</Button>`}</Code>
        </SubSection>

        <SubSection title="Anchor with target blank">
          <Code>{`// rel="noopener noreferrer" is injected automatically
<Button as="a" href="/docs" target="_blank">
  Open docs
</Button>`}</Code>
        </SubSection>

        <SubSection title="Full Width — Modal Footer">
          <Code>{`<div className="flex flex-col gap-2 p-4">
  <Button fullWidth isLoading={isSubmitting}>
    Confirm
  </Button>
  <Button variant="secondary" fullWidth onClick={onClose}>
    Cancel
  </Button>
</div>`}</Code>
        </SubSection>
      </Section>
    </div>
  ),
}
