import { useState } from 'react'
import { Search, Mail, Globe, Eye, EyeOff } from 'lucide-react'
import { Switch } from '@/components/base/Switch/Switch'
import FieldContent from './FieldContent'
import FieldControl from './FieldControl'
import FieldError from './FieldError'
import FieldSeparator from './FieldSeparator'
import FieldContainer from './FieldContainer'
import FieldPrefix from './FieldPrefix'
import FieldSuffix from './FieldSuffix'
import FieldGroup from './FieldGroup'
import FieldTitle from './FieldTitle'
import FieldLabel from './FieldLabel'
import FieldDescription from './FieldDescription'
import Input from '../Input/Input'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Field',
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

// ─── Story ────────────────────────────────────────────────────────────────────

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="p-8 max-w-4xl font-sans text-gray-900">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Field</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A set of composable layout and context primitives for building accessible form fields.
          Wrap inputs with{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">FieldContent</code> to wire
          up a11y context automatically, organize multiple fields with{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">FieldContainer</code> and{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">FieldGroup</code>, and use{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">FieldLabel</code>,{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">FieldDescription</code>, and{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">FieldError</code> for the
          complete field anatomy.
        </p>
      </div>

      {/* ── Overview ───────────────────────────────────────────────────────── */}
      <Section title="Overview">
        <Preview>
          <FieldContent required>
            <FieldLabel>Email</FieldLabel>
            <FieldDescription>We will never share your email.</FieldDescription>
            <FieldControl>
              <FieldPrefix>
                <Mail />
              </FieldPrefix>
              <Input type="email" placeholder="you@example.com" />
            </FieldControl>
            <FieldError />
          </FieldContent>
          <FieldContent>
            <FieldLabel>Website</FieldLabel>
            <FieldControl>
              <FieldPrefix>
                <Globe />
              </FieldPrefix>
              <Input placeholder="yoursite" />
              <FieldSuffix>.com</FieldSuffix>
            </FieldControl>
          </FieldContent>
          <FieldContent required error="Enter a valid email address.">
            <FieldLabel>Confirm email</FieldLabel>
            <FieldControl>
              <Input type="email" defaultValue="not-an-email" />
            </FieldControl>
            <FieldError />
          </FieldContent>
        </Preview>
        <Code>{`<FieldContent required>
  <FieldLabel>Email</FieldLabel>
  <FieldDescription>We will never share your email.</FieldDescription>
  <FieldControl>
    <FieldPrefix><Mail /></FieldPrefix>
    <Input type="email" placeholder="you@example.com" />
  </FieldControl>
  <FieldError />
</FieldContent>`}</Code>
      </Section>

      {/* ── Anatomy ────────────────────────────────────────────────────────── */}
      <Section
        title="Anatomy"
        description="Full component hierarchy from the outermost wrapper down to the input row."
      >
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4 w-full max-w-3xl overflow-x-auto">
          {/* FieldContainer */}
          <div className="border-2 border-dashed border-slate-400 rounded-md p-3 bg-white min-w-[500px]">
            <span className="text-[10px] font-mono text-slate-500 block mb-2">FieldContainer</span>
            {/* FieldGroup */}
            <div className="border-2 border-dashed border-teal-300 rounded-md p-2 bg-teal-50/40 mb-2">
              <span className="text-[10px] font-mono text-teal-600 block mb-2">
                FieldGroup (grid cols=2)
              </span>
              <div className="grid grid-cols-2 gap-2">
                {/* FieldTitle */}
                <div className="col-span-2 border border-dashed border-amber-300 rounded px-2 py-1 bg-amber-50">
                  <span className="text-[10px] font-mono text-amber-600">FieldTitle</span>
                </div>
                {/* FieldContent (×2) */}
                {[0, 1].map((i) => (
                  <div
                    key={i}
                    className="border-2 border-dashed border-blue-300 rounded p-2 bg-blue-50/40"
                  >
                    <span className="text-[10px] font-mono text-blue-500 block mb-1">
                      FieldContent
                    </span>
                    <div className="border border-dashed border-green-400 rounded px-1.5 py-0.5 bg-green-50 text-[10px] font-mono text-green-600 mb-1 w-fit">
                      FieldLabel
                    </div>
                    <div className="border border-dashed border-purple-300 rounded px-1.5 py-0.5 bg-purple-50 text-[10px] font-mono text-purple-500 mb-1 w-fit">
                      FieldDescription
                    </div>
                    {/* FieldControl */}
                    <div className="border border-dashed border-violet-400 rounded p-1.5 bg-violet-50/40 mb-1">
                      <span className="text-[10px] font-mono text-violet-500 block mb-1">
                        FieldControl
                      </span>
                      <div className="flex items-center gap-1">
                        <div className="border border-dashed border-orange-300 rounded px-1 py-0.5 bg-orange-50 text-[10px] font-mono text-orange-500">
                          FieldPrefix
                        </div>
                        <div className="border border-dashed border-gray-300 rounded px-2 py-0.5 bg-white text-[10px] font-mono text-gray-400 flex-1 text-center">
                          Input
                        </div>
                        <div className="border border-dashed border-orange-300 rounded px-1 py-0.5 bg-orange-50 text-[10px] font-mono text-orange-500">
                          FieldSuffix
                        </div>
                      </div>
                    </div>
                    <div className="border border-dashed border-red-300 rounded px-1.5 py-0.5 bg-red-50 text-[10px] font-mono text-red-400 w-fit">
                      FieldError
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* FieldSeparator */}
            <div className="border border-dashed border-gray-300 rounded px-2 py-1 bg-gray-50 mb-2">
              <span className="text-[10px] font-mono text-gray-400">FieldSeparator</span>
            </div>
            <div className="border-2 border-dashed border-blue-300 rounded p-2 bg-blue-50/40">
              <span className="text-[10px] font-mono text-blue-500 block mb-1">FieldContent</span>
              <div className="text-[10px] font-mono text-gray-400 italic">…</div>
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
                  'FieldContainer',
                  '<div>',
                  'Outer flex-col stack. Controls vertical gap between all children.',
                ],
                [
                  'FieldGroup',
                  '<div>',
                  'CSS grid for multi-column field rows. Accepts cols (number or responsive object) and gap.',
                ],
                [
                  'FieldTitle',
                  '<p>',
                  'Section heading inside FieldGroup. Spans all columns via col-span-full.',
                ],
                [
                  'FieldSeparator',
                  '<hr>',
                  'Visual horizontal rule between sections inside FieldContainer.',
                ],
                [
                  'FieldContent',
                  '<div>',
                  'Root per-field wrapper. Generates ids and distributes a11y context to all children.',
                ],
                [
                  'FieldLabel',
                  '<label>',
                  'Auto-linked to the input via htmlFor from context. Shows asterisk when required.',
                ],
                [
                  'FieldDescription',
                  '<p>',
                  'Hint text auto-linked to the input via aria-describedby from context.',
                ],
                [
                  'FieldControl',
                  '<div>',
                  'Relative flex row for the input. Detects FieldPrefix/FieldSuffix and tells Input to pad.',
                ],
                [
                  'FieldPrefix',
                  '<span>',
                  'Absolute left affix (icon or text). pointer-events-none by default.',
                ],
                [
                  'FieldSuffix',
                  '<span>',
                  'Absolute right affix (icon or text). Add pointer-events-auto for interactive suffixes.',
                ],
                [
                  'FieldError',
                  '<p>',
                  'Error message with role="alert". Reads error from context or from children.',
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
      </Section>

      {/* ── FieldContent ───────────────────────────────────────────────────── */}
      <Section
        title="FieldContent"
        description="Root wrapper for a single labelled field. Generates a unique id and distributes it via context to every child component."
      >
        <SubSection title="Vertical (Default)">
          <Preview>
            <FieldContent>
              <FieldLabel>Username</FieldLabel>
              <FieldDescription>3–20 characters, letters and numbers only.</FieldDescription>
              <FieldControl>
                <Input placeholder="your_username" />
              </FieldControl>
              <FieldError />
            </FieldContent>
          </Preview>
          <Code>{`<FieldContent>
  <FieldLabel>Username</FieldLabel>
  <FieldDescription>3–20 characters, letters and numbers only.</FieldDescription>
  <FieldControl>
    <Input placeholder="your_username" />
  </FieldControl>
  <FieldError />
</FieldContent>`}</Code>
        </SubSection>

        <SubSection
          title="Horizontal"
          description="Label and description on the left, control on the right. For settings-style rows."
        >
          <Preview>
            <FieldContent orientation="horizontal">
              <FieldLabel>Email notifications</FieldLabel>
              <FieldDescription>Receive emails for new activity.</FieldDescription>
              <FieldControl>
                <Switch />
              </FieldControl>
            </FieldContent>
          </Preview>
          <Code>{`<FieldContent orientation="horizontal">
  <FieldLabel>Email notifications</FieldLabel>
  <FieldDescription>Receive emails for new activity.</FieldDescription>
  <FieldControl>
    <Switch />
  </FieldControl>
</FieldContent>`}</Code>
        </SubSection>

        <SubSection
          title="Row"
          description="Inline flex row — control and label on the same line. For checkbox and radio button patterns."
        >
          <Preview>
            <FieldContent orientation="row">
              <FieldControl>
                <Switch />
              </FieldControl>
              <FieldLabel>Agree to terms</FieldLabel>
            </FieldContent>
          </Preview>
          <Code>{`<FieldContent orientation="row">
  <FieldControl>
    <Switch />
  </FieldControl>
  <FieldLabel>Agree to terms</FieldLabel>
</FieldContent>`}</Code>
        </SubSection>

        <SubSection title="Required">
          <Preview>
            <FieldContent required>
              <FieldLabel>Full name</FieldLabel>
              <FieldControl>
                <Input placeholder="John Doe" />
              </FieldControl>
              <FieldError />
            </FieldContent>
          </Preview>
          <Code>{`<FieldContent required>
  <FieldLabel>Full name</FieldLabel>
  <FieldControl>
    <Input placeholder="John Doe" />
  </FieldControl>
  <FieldError />
</FieldContent>`}</Code>
        </SubSection>

        <SubSection title="Disabled">
          <Preview>
            <FieldContent disabled>
              <FieldLabel>Account ID</FieldLabel>
              <FieldDescription>Set automatically after account creation.</FieldDescription>
              <FieldControl>
                <Input placeholder="auto-generated" />
              </FieldControl>
            </FieldContent>
          </Preview>
          <Code>{`<FieldContent disabled>
  <FieldLabel>Account ID</FieldLabel>
  <FieldDescription>Set automatically after account creation.</FieldDescription>
  <FieldControl>
    <Input placeholder="auto-generated" />
  </FieldControl>
</FieldContent>`}</Code>
        </SubSection>

        <SubSection title="Error">
          <Preview>
            <FieldContent required error="Enter a valid email address.">
              <FieldLabel>Email</FieldLabel>
              <FieldControl>
                <Input type="email" defaultValue="not-an-email" />
              </FieldControl>
              <FieldError />
            </FieldContent>
          </Preview>
          <Code>{`<FieldContent required error="Enter a valid email address.">
  <FieldLabel>Email</FieldLabel>
  <FieldControl>
    <Input type="email" />
  </FieldControl>
  <FieldError />
</FieldContent>`}</Code>
        </SubSection>

        <SubSection title="API Reference — FieldContent">
          <ApiTable
            component="FieldContent"
            rows={[
              [
                'orientation',
                '"vertical" | "horizontal" | "row"',
                '"vertical"',
                'Layout mode. Vertical stacks label above control; horizontal puts label+description left and control right; row places all children in a flex row.',
              ],
              [
                'required',
                'boolean',
                'false',
                'Flows to FieldLabel (shows red asterisk) and Input (aria-required).',
              ],
              [
                'disabled',
                'boolean',
                'false',
                'Flows to Input (disabled + disabled variant) and FieldLabel.',
              ],
              [
                'error',
                'string',
                '—',
                'Error message — flows to FieldError and Input (error variant + aria-invalid).',
              ],
              ['name', 'string', '—', 'Informational only, does not wire to Input automatically.'],
              ['as', 'React.ElementType', '"div"', 'Rendered HTML element for the outer wrapper.'],
              ['className', 'string', '—', 'Additional CSS classes on the outer wrapper.'],
            ]}
          />
        </SubSection>
      </Section>

      {/* ── FieldControl ───────────────────────────────────────────────────── */}
      <Section
        title="FieldControl"
        description="The input row wrapper. Renders as relative flex items-center and detects FieldPrefix/FieldSuffix children — telling Input to add left or right padding automatically."
      >
        <SubSection title="With Prefix and Suffix">
          <Preview>
            <FieldContent>
              <FieldLabel>Amount</FieldLabel>
              <FieldControl>
                <FieldPrefix>Rp</FieldPrefix>
                <Input type="number" placeholder="0" />
                <FieldSuffix>IDR</FieldSuffix>
              </FieldControl>
            </FieldContent>
          </Preview>
          <Code>{`<FieldControl>
  <FieldPrefix>Rp</FieldPrefix>
  <Input type="number" placeholder="0" />
  <FieldSuffix>IDR</FieldSuffix>
</FieldControl>`}</Code>
        </SubSection>

        <SubSection
          title="Standalone"
          description="FieldControl works without FieldContent for bare input rows like search bars."
        >
          <Preview>
            <FieldControl>
              <FieldPrefix>
                <Search />
              </FieldPrefix>
              <Input placeholder="Search..." aria-label="Search" />
            </FieldControl>
          </Preview>
          <Code>{`<FieldControl>
  <FieldPrefix><Search /></FieldPrefix>
  <Input placeholder="Search..." aria-label="Search" />
</FieldControl>`}</Code>
        </SubSection>

        <SubSection title="API Reference — FieldControl">
          <ApiTable
            component="FieldControl"
            rows={[
              [
                'as',
                'React.ElementType',
                '"div"',
                'Rendered HTML element for the input row wrapper.',
              ],
              ['className', 'string', '—', 'Additional CSS classes.'],
            ]}
          />
        </SubSection>
      </Section>

      {/* ── FieldLabel ─────────────────────────────────────────────────────── */}
      <Section
        title="FieldLabel"
        description="Renders a <label> element automatically wired to its paired Input via FieldContent context. No manual htmlFor needed."
      >
        <SubSection title="Auto-Wired">
          <Preview>
            <FieldContent>
              <FieldLabel>Email address</FieldLabel>
              <FieldControl>
                <Input type="email" placeholder="you@example.com" />
              </FieldControl>
            </FieldContent>
          </Preview>
          <Code>{`<FieldContent>
  <FieldLabel>Email address</FieldLabel>
  <FieldControl>
    <Input type="email" placeholder="you@example.com" />
  </FieldControl>
</FieldContent>`}</Code>
        </SubSection>

        <SubSection title="API Reference — FieldLabel">
          <ApiTable
            component="FieldLabel"
            rows={[
              [
                'required',
                'boolean',
                'ctx.required',
                'Override context required. Shows red asterisk when true.',
              ],
              ['htmlFor', 'string', 'ctx.id', 'Override context id for the htmlFor attribute.'],
              ['as', 'React.ElementType', '"label"', 'Rendered HTML element.'],
              ['className', 'string', '—', 'Additional CSS classes.'],
            ]}
          />
        </SubSection>
      </Section>

      {/* ── FieldDescription ───────────────────────────────────────────────── */}
      <Section
        title="FieldDescription"
        description="Muted hint text rendered below the label. Auto-linked to the Input via aria-describedby through FieldContent context."
      >
        <SubSection title="Default">
          <Preview>
            <FieldContent>
              <FieldLabel>Password</FieldLabel>
              <FieldDescription>At least 8 characters with one uppercase letter.</FieldDescription>
              <FieldControl>
                <Input type="password" placeholder="••••••••" />
              </FieldControl>
            </FieldContent>
          </Preview>
          <Code>{`<FieldContent>
  <FieldLabel>Password</FieldLabel>
  <FieldDescription>At least 8 characters with one uppercase letter.</FieldDescription>
  <FieldControl>
    <Input type="password" placeholder="••••••••" />
  </FieldControl>
</FieldContent>`}</Code>
        </SubSection>

        <SubSection title="API Reference — FieldDescription">
          <ApiTable
            component="FieldDescription"
            rows={[
              [
                'variant',
                '"default" | "error"',
                '"default"',
                'Color style. "default" is muted; "error" is destructive red.',
              ],
              ['as', 'React.ElementType', '"p"', 'Rendered HTML element.'],
              ['className', 'string', '—', 'Additional CSS classes.'],
            ]}
          />
        </SubSection>
      </Section>

      {/* ── FieldError ─────────────────────────────────────────────────────── */}
      <Section
        title="FieldError"
        description="Error message with role=alert. Reads from FieldContent context (error prop) or from children. Renders nothing when neither source has a message."
      >
        <SubSection title="Via Context">
          <Preview>
            <FieldContent required error="Enter a valid email address.">
              <FieldLabel>Email</FieldLabel>
              <FieldControl>
                <Input type="email" defaultValue="not-an-email" />
              </FieldControl>
              <FieldError />
            </FieldContent>
          </Preview>
          <Code>{`<FieldContent required error="Enter a valid email address.">
  <FieldLabel>Email</FieldLabel>
  <FieldControl>
    <Input type="email" />
  </FieldControl>
  <FieldError />
</FieldContent>`}</Code>
        </SubSection>

        <SubSection
          title="Inline Children"
          description="Pass a message directly as children to override the context error."
        >
          <Preview>
            <FieldContent required error="Required">
              <FieldLabel>Password</FieldLabel>
              <FieldControl>
                <Input type="password" defaultValue="short" />
              </FieldControl>
              <FieldError>Must be at least 8 characters with one uppercase letter.</FieldError>
            </FieldContent>
          </Preview>
          <Code>{`<FieldContent required error="Required">
  <FieldLabel>Password</FieldLabel>
  <FieldControl>
    <Input type="password" />
  </FieldControl>
  <FieldError>Must be at least 8 characters with one uppercase letter.</FieldError>
</FieldContent>`}</Code>
        </SubSection>

        <SubSection title="API Reference — FieldError">
          <ApiTable
            component="FieldError"
            rows={[
              [
                'children',
                'ReactNode',
                '—',
                'Custom message. Takes precedence over the context error message.',
              ],
              ['as', 'React.ElementType', '"p"', 'Rendered HTML element.'],
              ['className', 'string', '—', 'Additional CSS classes.'],
            ]}
          />
        </SubSection>
      </Section>

      {/* ── FieldPrefix & FieldSuffix ──────────────────────────────────────── */}
      <Section
        title="FieldPrefix &amp; FieldSuffix"
        description="Absolute-positioned affixes inside FieldControl. FieldControl detects them and tells Input to add matching left/right padding automatically."
      >
        <SubSection
          title="Text Affix"
          description="Short strings like currency symbols, URL schemes, or unit labels."
        >
          <Preview>
            <FieldContent>
              <FieldLabel>Website</FieldLabel>
              <FieldControl>
                <FieldPrefix>https://</FieldPrefix>
                <Input placeholder="yoursite.com" />
              </FieldControl>
            </FieldContent>
            <FieldContent>
              <FieldLabel>Interest rate</FieldLabel>
              <FieldControl>
                <Input type="number" placeholder="0" />
                <FieldSuffix>%</FieldSuffix>
              </FieldControl>
            </FieldContent>
          </Preview>
          <Code>{`<FieldControl>
  <FieldPrefix>https://</FieldPrefix>
  <Input placeholder="yoursite.com" />
</FieldControl>

<FieldControl>
  <Input type="number" placeholder="0" />
  <FieldSuffix>%</FieldSuffix>
</FieldControl>`}</Code>
        </SubSection>

        <SubSection
          title="Icon Affix"
          description="Lucide icons or any ReactNode. Sized and centered automatically."
        >
          <Preview>
            <FieldContent>
              <FieldLabel>Email</FieldLabel>
              <FieldControl>
                <FieldPrefix>
                  <Mail />
                </FieldPrefix>
                <Input type="email" placeholder="you@example.com" />
              </FieldControl>
            </FieldContent>
          </Preview>
          <Code>{`<FieldControl>
  <FieldPrefix><Mail /></FieldPrefix>
  <Input type="email" placeholder="you@example.com" />
</FieldControl>`}</Code>
        </SubSection>

        <SubSection
          title="Interactive Suffix"
          description="Add pointer-events-auto for clickable suffixes like password toggle."
        >
          {(() => {
            const [show, setShow] = useState(false)
            return (
              <Preview>
                <FieldContent>
                  <FieldLabel>Password</FieldLabel>
                  <FieldControl>
                    <Input type={show ? 'text' : 'password'} placeholder="••••••••" />
                    <FieldSuffix
                      className="pointer-events-auto cursor-pointer hover:text-foreground transition-colors"
                      onClick={() => setShow((s) => !s)}
                      aria-label={show ? 'Hide password' : 'Show password'}
                    >
                      {show ? <EyeOff /> : <Eye />}
                    </FieldSuffix>
                  </FieldControl>
                </FieldContent>
              </Preview>
            )
          })()}
          <Code>{`const [show, setShow] = useState(false)

<FieldControl>
  <Input type={show ? 'text' : 'password'} />
  <FieldSuffix
    className="pointer-events-auto cursor-pointer hover:text-foreground transition-colors"
    onClick={() => setShow(s => !s)}
    aria-label={show ? 'Hide password' : 'Show password'}
  >
    {show ? <EyeOff /> : <Eye />}
  </FieldSuffix>
</FieldControl>`}</Code>
        </SubSection>

        <SubSection title="API Reference — FieldPrefix &amp; FieldSuffix">
          <ApiTable
            component="FieldPrefix / FieldSuffix"
            rows={[
              [
                'className',
                'string',
                '—',
                'Additional CSS classes. Add pointer-events-auto to make interactive.',
              ],
              ['children', 'ReactNode', '—', 'Text string or icon component.'],
            ]}
          />
        </SubSection>
      </Section>

      {/* ── FieldContainer ─────────────────────────────────────────────────── */}
      <Section
        title="FieldContainer"
        description="Outer flex-col wrapper that stacks fields with consistent vertical gap."
      >
        <SubSection
          title="Gap Variants"
          description="Use gap to control vertical spacing between children."
        >
          <div className="flex gap-6 mb-3 flex-wrap">
            {[
              { gap: 'sm', label: 'gap="sm" — gap-3' },
              { gap: 'base', label: 'gap="base" — gap-4 (default)' },
              { gap: 'lg', label: 'gap="lg" — gap-6' },
            ].map(({ gap, label }) => (
              <div key={gap} className="flex flex-col gap-2">
                <span className="text-xs text-gray-400">{label}</span>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-64">
                  <FieldContainer gap={gap}>
                    <FieldContent>
                      <FieldLabel>First Name</FieldLabel>
                      <FieldControl>
                        <Input placeholder="John" />
                      </FieldControl>
                    </FieldContent>
                    <FieldContent>
                      <FieldLabel>Last Name</FieldLabel>
                      <FieldControl>
                        <Input placeholder="Doe" />
                      </FieldControl>
                    </FieldContent>
                  </FieldContainer>
                </div>
              </div>
            ))}
          </div>
          <Code>{`<FieldContainer gap="sm">...</FieldContainer>
<FieldContainer>...</FieldContainer>
<FieldContainer gap="lg">...</FieldContainer>`}</Code>
        </SubSection>

        <SubSection title="API Reference — FieldContainer">
          <ApiTable
            component="FieldContainer"
            rows={[
              [
                'gap',
                '"sm" | "base" | "md" | "lg"',
                '"base"',
                'Vertical gap between children. sm=gap-3, base=gap-4, md=gap-5, lg=gap-6.',
              ],
              ['className', 'string', '—', 'Additional CSS classes.'],
            ]}
          />
        </SubSection>
      </Section>

      {/* ── FieldGroup ─────────────────────────────────────────────────────── */}
      <Section
        title="FieldGroup"
        description="CSS grid for multi-column field layouts. Accepts a fixed number or a responsive breakpoint object for cols."
      >
        <SubSection title="Fixed Columns">
          <div className="flex flex-col gap-2 mb-3">
            <span className="text-xs text-gray-400">cols={2} — first name and last name</span>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg max-w-lg">
              <FieldGroup cols={2}>
                <FieldContent required>
                  <FieldLabel>First Name</FieldLabel>
                  <FieldControl>
                    <Input placeholder="John" />
                  </FieldControl>
                </FieldContent>
                <FieldContent required>
                  <FieldLabel>Last Name</FieldLabel>
                  <FieldControl>
                    <Input placeholder="Doe" />
                  </FieldControl>
                </FieldContent>
              </FieldGroup>
            </div>
          </div>
          <Code>{`<FieldGroup cols={2}>
  <FieldContent required>
    <FieldLabel>First Name</FieldLabel>
    <FieldControl><Input placeholder="John" /></FieldControl>
  </FieldContent>
  <FieldContent required>
    <FieldLabel>Last Name</FieldLabel>
    <FieldControl><Input placeholder="Doe" /></FieldControl>
  </FieldContent>
</FieldGroup>`}</Code>
        </SubSection>

        <SubSection
          title="Responsive Columns"
          description="Pass a breakpoint object to stack on small screens and expand on larger ones."
        >
          <div className="flex flex-col gap-2 mb-3">
            <span className="text-xs text-gray-400">
              cols={'{ xs: 1, md: 3 }'} — stacks on mobile, 3 columns on md+
            </span>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg max-w-xl">
              <FieldGroup cols={{ xs: 1, md: 3 }}>
                <FieldContent>
                  <FieldLabel>City</FieldLabel>
                  <FieldControl>
                    <Input placeholder="Jakarta" />
                  </FieldControl>
                </FieldContent>
                <FieldContent>
                  <FieldLabel>Province</FieldLabel>
                  <FieldControl>
                    <Input placeholder="DKI Jakarta" />
                  </FieldControl>
                </FieldContent>
                <FieldContent>
                  <FieldLabel>Postal Code</FieldLabel>
                  <FieldControl>
                    <Input placeholder="12345" />
                  </FieldControl>
                </FieldContent>
              </FieldGroup>
            </div>
          </div>
          <Code>{`<FieldGroup cols={{ xs: 1, md: 3 }}>
  <FieldContent>
    <FieldLabel>City</FieldLabel>
    <FieldControl><Input placeholder="Jakarta" /></FieldControl>
  </FieldContent>
  ...
</FieldGroup>`}</Code>
        </SubSection>

        <SubSection
          title="With FieldTitle"
          description="FieldTitle spans all columns and acts as a section label inside the grid."
        >
          <div className="flex flex-col gap-2 mb-3">
            <span className="text-xs text-gray-400">
              FieldTitle breaks to a new row and spans all columns
            </span>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg max-w-lg">
              <FieldGroup cols={2}>
                <FieldTitle>Personal Info</FieldTitle>
                <FieldContent required>
                  <FieldLabel>First Name</FieldLabel>
                  <FieldControl>
                    <Input placeholder="John" />
                  </FieldControl>
                </FieldContent>
                <FieldContent required>
                  <FieldLabel>Last Name</FieldLabel>
                  <FieldControl>
                    <Input placeholder="Doe" />
                  </FieldControl>
                </FieldContent>
                <FieldTitle>Contact</FieldTitle>
                <FieldContent>
                  <FieldLabel>Email</FieldLabel>
                  <FieldControl>
                    <Input type="email" placeholder="john@example.com" />
                  </FieldControl>
                </FieldContent>
                <FieldContent>
                  <FieldLabel>Phone</FieldLabel>
                  <FieldControl>
                    <Input type="tel" placeholder="+62 812 3456 7890" />
                  </FieldControl>
                </FieldContent>
              </FieldGroup>
            </div>
          </div>
          <Code>{`<FieldGroup cols={2}>
  <FieldTitle>Personal Info</FieldTitle>
  <FieldContent required>...</FieldContent>
  <FieldTitle>Contact</FieldTitle>
  <FieldContent>...</FieldContent>
</FieldGroup>`}</Code>
        </SubSection>

        <SubSection title="API Reference — FieldGroup">
          <ApiTable
            component="FieldGroup"
            rows={[
              [
                'cols',
                'number | { xs?, sm?, md?, lg?, xl?, xxl? }',
                '1',
                'Column count. Pass a number for fixed cols or a breakpoint object for responsive.',
              ],
              [
                'gap',
                '"sm" | "base" | "lg"',
                '"base"',
                'Gap between grid cells. sm=gap-3, base=gap-4, lg=gap-6.',
              ],
              ['className', 'string', '—', 'Additional CSS classes.'],
            ]}
          />
        </SubSection>
      </Section>

      {/* ── FieldTitle ─────────────────────────────────────────────────────── */}
      <Section
        title="FieldTitle"
        description="Small uppercase section heading designed for use inside FieldGroup. Spans all columns via col-span-full."
      >
        <SubSection title="Inside FieldGroup">
          <Preview>
            <FieldTitle>Personal Info</FieldTitle>
          </Preview>
          <Code>{`<FieldGroup cols={2}>
  <FieldTitle>Personal Info</FieldTitle>
  {/* fields ... */}
</FieldGroup>`}</Code>
        </SubSection>

        <SubSection title="API Reference — FieldTitle">
          <ApiTable
            component="FieldTitle"
            rows={[
              ['className', 'string', '—', 'Additional CSS classes.'],
              ['children', 'ReactNode', '—', 'Section label text.'],
            ]}
          />
        </SubSection>
      </Section>

      {/* ── FieldSeparator ─────────────────────────────────────────────────── */}
      <Section
        title="FieldSeparator"
        description="A decorative horizontal rule that divides sections inside FieldContainer."
      >
        <SubSection title="In Form">
          <div className="flex flex-col gap-2 mb-3">
            <span className="text-xs text-gray-400">separator dividing two field groups</span>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
              <FieldContainer>
                <FieldContent>
                  <FieldLabel>First Name</FieldLabel>
                  <FieldControl>
                    <Input placeholder="John" />
                  </FieldControl>
                </FieldContent>
                <FieldContent>
                  <FieldLabel>Last Name</FieldLabel>
                  <FieldControl>
                    <Input placeholder="Doe" />
                  </FieldControl>
                </FieldContent>
                <FieldSeparator />
                <FieldContent>
                  <FieldLabel>Email</FieldLabel>
                  <FieldControl>
                    <Input type="email" placeholder="john@example.com" />
                  </FieldControl>
                </FieldContent>
              </FieldContainer>
            </div>
          </div>
          <Code>{`<FieldContainer>
  <FieldContent>...</FieldContent>
  <FieldSeparator />
  <FieldContent>...</FieldContent>
</FieldContainer>`}</Code>
        </SubSection>

        <SubSection title="API Reference — FieldSeparator">
          <ApiTable
            component="FieldSeparator"
            rows={[['className', 'string', '—', 'Additional CSS classes on the <hr> element.']]}
          />
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
                  title: 'Use FieldContent as the root wrapper for every labelled form field',
                  body: 'FieldContent manages id, aria-describedby, aria-errormessage, required, and disabled context for the entire field. You get correct accessibility wiring with zero manual configuration.',
                },
                {
                  title: 'Use FieldContainer + FieldGroup for multi-column form layouts',
                  body: 'FieldContainer owns vertical spacing between rows. FieldGroup owns horizontal column layout inside a row. Composing them gives you consistent rhythm across the entire form without custom CSS.',
                },
                {
                  title: 'Use orientation="horizontal" for settings-style rows',
                  body: 'Horizontal layout with label+description on the left and a compact control (switch, checkbox) on the right is the standard pattern for settings pages. It keeps the layout scannable and the control easily reachable.',
                },
              ],
            },
            {
              heading: 'When not to use',
              items: [
                {
                  title:
                    "Don't use FieldContent for inputs that need no label, description, or error",
                  body: 'For bare search bars or filter inputs that only need a prefix icon, FieldControl standalone is lighter. FieldContent adds context overhead that is only useful when you have label/description/error wiring.',
                },
                {
                  title: "Don't nest FieldContainer inside FieldContainer",
                  body: 'Nesting containers doubles the gap and creates inconsistent spacing. Use a single FieldContainer and add FieldSeparator or FieldTitle between sections instead.',
                },
              ],
            },
            {
              heading: 'Accessibility',
              items: [
                {
                  title:
                    'Never add aria-describedby, aria-errormessage, or htmlFor manually inside FieldContent',
                  body: 'FieldContent generates all a11y ids and distributes them via context. Adding them manually duplicates or conflicts with the automatic wiring. Trust the context.',
                },
                {
                  title:
                    'Always include <FieldError /> in the field tree when validation is possible',
                  body: 'Even when there is no error yet, include <FieldError /> so that when error is set, the role="alert" announcement fires immediately when the component mounts with content.',
                },
                {
                  title: 'Use aria-label on standalone inputs outside FieldContent',
                  body: 'When using FieldControl without FieldContent and FieldLabel, the input has no accessible name. Add aria-label directly to the Input.',
                },
              ],
            },
            {
              heading: 'Advice',
              items: [
                {
                  title: 'Write specific, actionable error messages',
                  body: '"Enter a valid email address" tells users exactly what to fix. "Invalid input" does not. Always write error messages from the user\'s perspective: what happened and what they should do next.',
                },
                {
                  title: 'Use gap="base" for most forms, gap="lg" between sections',
                  body: 'gap="base" (gap-4) is the standard for individual field rows. When nesting a FieldGroup or FieldSeparator inside FieldContainer, use gap="lg" to create a clear visual break between sections.',
                },
                {
                  title: 'Use responsive cols for FieldGroup to ensure mobile readability',
                  body: 'Three columns side by side on mobile is too cramped. Pass cols={{ xs: 1, md: 2 }} or cols={{ xs: 1, md: 3 }} to stack fields on small screens and expand the grid at wider breakpoints.',
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
    </div>
  ),
}
