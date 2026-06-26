import { Plus, Trash2, Download, Save, ArrowRight, X } from 'lucide-react'
import Button from '../Button'

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
          A flexible, accessible button component with six visual variants, six sizes, icon support
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
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg mb-4">
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 h-9 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium">
              <Plus className="size-4" aria-hidden />
              <span>Add Item</span>
              <ArrowRight className="size-4" aria-hidden />
            </div>
          </div>
          <div className="flex justify-center gap-8 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <Tag color="violet">useIcon</Tag>
              <span>— boolean or ReactElement</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Tag color="violet">children</Tag>
              <span>— label text</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Tag color="violet">iconPosition</Tag>
              <span>— "left" | "right"</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400">
          When <code className="font-mono bg-gray-100 px-1 rounded">isLoading</code> is true, the
          icon slot is replaced by a spinner regardless of{' '}
          <code className="font-mono bg-gray-100 px-1 rounded">useIcon</code>.
        </p>
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
        description="Six text sizes and six icon-only sizes. Choose based on context density."
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
                  ['base', '32px', 'px-3.5', 'text-sm', 'Default for most UI contexts', 'base'],
                  ['md', '36px', 'px-4', 'text-sm', 'Forms, modals, standard dialogs', 'md'],
                  ['lg', '40px', 'px-6', 'text-sm', 'Hero sections, prominent CTAs', 'lg'],
                  ['xl', '48px', 'px-8', 'text-base', 'Landing pages, marketing', 'xl'],
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
                  ['icon-base', '32×32px'],
                  ['icon-md', '36×36px'],
                  ['icon-lg', '40×40px'],
                  ['icon-xl', '48×48px'],
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
                  "'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'",
                  "'default'",
                  'Visual style of the button',
                ],
                [
                  'size',
                  "'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | 'icon' | 'icon-xs' … 'icon-xl'",
                  "'base'",
                  'Button dimensions',
                ],
                [
                  'useIcon',
                  'boolean | ReactElement',
                  'false',
                  'true renders default Plus icon; pass an element for a custom icon',
                ],
                [
                  'iconPosition',
                  "'left' | 'right'",
                  "'left'",
                  'Position of the icon relative to the label',
                ],
                ['isLoading', 'boolean', 'false', 'Shows a spinner and disables interaction'],
                [
                  'loadingText',
                  'string',
                  "'Loading'",
                  'Screen-reader-only text announced during loading state',
                ],
                ['disabled', 'boolean', 'false', 'Disables the button'],
                [
                  'fullWidth',
                  'boolean',
                  'false',
                  'Stretches the button to fill its container width',
                ],
                [
                  'asChild',
                  'boolean',
                  'false',
                  'Merge button props onto the single child element via Radix Slot',
                ],
                [
                  'as',
                  'React.ElementType',
                  "'button'",
                  'Render as a different element (e.g. "a", Link)',
                ],
                ['className', 'string', '—', 'Additional CSS classes merged via twMerge'],
                ['children', 'ReactNode', '—', 'Button label content'],
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
          title="asChild — Radix Slot pattern"
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

      {/* Dos & Don'ts */}
      <Section title="Dos & Don'ts">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="size-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                ✓
              </span>
              <span className="text-sm font-semibold text-green-700">Do</span>
            </div>
            <div className="space-y-4">
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <Preview>
                  <Button variant="default">Save changes</Button>
                  <Button variant="secondary">Cancel</Button>
                </Preview>
                <p className="text-xs text-green-800">
                  Use Default + Secondary together for primary and secondary actions in the same
                  context.
                </p>
              </div>
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <Preview>
                  <Button variant="destructive" useIcon={<Trash2 />}>
                    Delete account
                  </Button>
                </Preview>
                <p className="text-xs text-green-800">
                  Use Destructive variant for irreversible actions like delete or reset.
                </p>
              </div>
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <Preview>
                  <Button
                    size="icon-md"
                    variant="ghost"
                    useIcon={<Download />}
                    aria-label="Download file"
                  />
                </Preview>
                <p className="text-xs text-green-800">
                  Always include aria-label on icon-only buttons.
                </p>
              </div>
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <Preview>
                  <Button isLoading>Saving...</Button>
                </Preview>
                <p className="text-xs text-green-800">
                  Use isLoading during async operations to prevent double-submits.
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="size-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
                ✕
              </span>
              <span className="text-sm font-semibold text-red-700">Don't</span>
            </div>
            <div className="space-y-4">
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <Preview>
                  <Button variant="default">Save</Button>
                  <Button variant="default">Submit</Button>
                  <Button variant="default">Confirm</Button>
                </Preview>
                <p className="text-xs text-red-800">
                  Don't use multiple Default buttons in the same view — it dilutes the primary
                  action.
                </p>
              </div>
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <Preview>
                  <Button variant="ghost">Delete account</Button>
                </Preview>
                <p className="text-xs text-red-800">
                  Don't use Ghost or Link for destructive actions — they appear too safe.
                </p>
              </div>
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <Preview>
                  <Button size="icon-md" useIcon />
                </Preview>
                <p className="text-xs text-red-800">
                  Don't omit aria-label on icon-only buttons — screen readers will have nothing to
                  announce.
                </p>
              </div>
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <Preview>
                  <Button variant="default" size="xl">
                    Ok
                  </Button>
                </Preview>
                <p className="text-xs text-red-800">
                  Don't use XL size for short labels — reserve large sizes for prominent CTAs with
                  meaningful copy.
                </p>
              </div>
            </div>
          </div>
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
