import { useState } from 'react'
import { Search, Mail, Globe, Lock, Eye, EyeOff } from 'lucide-react'
import FieldContent from '../Field/FieldContent'
import FieldControl from '../Field/FieldControl'
import FieldError from '../Field/FieldError'
import FieldPrefix from '../Field/FieldPrefix'
import FieldSuffix from '../Field/FieldSuffix'
import FieldLabel from '../Field/FieldLabel'
import FieldDescription from '../Field/FieldDescription'
import Input from './Input'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Input Field',
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

const PasswordDemo = () => {
  const [show, setShow] = useState(false)
  return (
    <FieldControl>
      <FieldPrefix>
        <Lock />
      </FieldPrefix>
      <Input type={show ? 'text' : 'password'} placeholder="Password" />
      <FieldSuffix
        className="pointer-events-auto cursor-pointer hover:text-foreground transition-colors"
        onClick={() => setShow((s) => !s)}
      >
        {show ? <EyeOff /> : <Eye />}
      </FieldSuffix>
    </FieldControl>
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
          <h1 className="text-3xl font-bold text-gray-900">Input</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A flexible text input with three variants and five sizes. Reads context from{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">FieldContent</code> for
          accessible IDs, error state, and size — works standalone too.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <Preview>
          <FieldContent size="base" required>
            <FieldLabel>Email</FieldLabel>
            <FieldControl>
              <FieldPrefix>
                <Mail />
              </FieldPrefix>
              <Input placeholder="you@example.com" />
            </FieldControl>
            <FieldDescription>We'll never share your email.</FieldDescription>
          </FieldContent>
          <FieldContent size="base">
            <FieldLabel>Website</FieldLabel>
            <FieldControl>
              <FieldPrefix>
                <Globe />
              </FieldPrefix>
              <Input placeholder="yoursite" />
              <FieldSuffix>.com</FieldSuffix>
            </FieldControl>
          </FieldContent>
          <FieldContent size="base" required error="Enter a valid email address.">
            <FieldLabel>Password</FieldLabel>
            <FieldControl>
              <Input defaultValue="123" />
            </FieldControl>
            <FieldError />
          </FieldContent>
        </Preview>
      </Section>

      {/* Anatomy */}
      <Section
        title="Anatomy"
        description="Input composes with the Field system. FieldControl handles prefix/suffix positioning; FieldContent wires up accessible IDs, error state, and size."
      >
        {/* Box diagram */}
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4">
          <div className="relative p-4 border-2 border-dashed border-violet-400 rounded-xl">
            <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-[10px] font-mono font-semibold text-violet-600">
              FieldContent
            </span>

            {/* FieldLabel */}
            <div className="relative px-3 py-1.5 border border-dashed border-slate-300 rounded mb-2">
              <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-slate-400">
                FieldLabel
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Email</span>
            </div>

            {/* FieldControl */}
            <div className="relative pt-4 pb-2 px-2 border border-dashed border-blue-300 rounded mb-2">
              <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-blue-500">
                FieldControl
              </span>
              <div className="flex items-stretch gap-1">
                <div className="flex flex-col gap-0.5 px-2 pt-1 pb-1.5 border border-dashed border-green-300 rounded shrink-0">
                  <span className="text-[10px] font-mono text-green-500">FieldPrefix</span>
                  <span className="text-[10px] text-slate-400 font-mono">@</span>
                </div>
                <div className="flex flex-col gap-0.5 flex-1 px-2 pt-1 pb-1.5 border border-dashed border-blue-300 rounded">
                  <span className="text-[10px] font-mono text-blue-500">Input</span>
                  <span className="text-[10px] text-slate-300 font-mono">you@example.com</span>
                </div>
                <div className="flex flex-col gap-0.5 px-2 pt-1 pb-1.5 border border-dashed border-green-300 rounded shrink-0">
                  <span className="text-[10px] font-mono text-green-500">FieldSuffix</span>
                  <span className="text-[10px] text-slate-400 font-mono">.com</span>
                </div>
              </div>
            </div>

            {/* FieldDescription */}
            <div className="relative px-3 py-1.5 border border-dashed border-green-300 rounded mb-2">
              <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-green-500">
                FieldDescription
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                We'll never share your email.
              </span>
            </div>

            {/* FieldError */}
            <div className="relative px-3 py-1.5 border border-dashed border-green-300 rounded">
              <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-green-500">
                FieldError
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Enter a valid email.</span>
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
                ['FieldLabel', '<label>', 'Accessible label linked to the input via context ID.'],
                [
                  'FieldControl',
                  '<div>',
                  'Positioning wrapper for prefix/suffix overlays. Required when using FieldPrefix or FieldSuffix.',
                ],
                [
                  'Input',
                  '<input>',
                  'Core input element. Reads variant, size, error, and disabled from FieldContent context.',
                ],
                [
                  'FieldPrefix',
                  '<div>',
                  'Optional overlay anchored to the left edge of the input. Icon or short text.',
                ],
                [
                  'FieldSuffix',
                  '<div>',
                  'Optional overlay anchored to the right edge of the input. Icon, unit, or action.',
                ],
                [
                  'FieldDescription',
                  '<p>',
                  'Helper text shown below the input. Linked via aria-describedby.',
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

        <Code>{`<FieldContent size="base" required error={errors.email?.message}>
  <FieldLabel>Email</FieldLabel>
  <FieldControl>
    <FieldPrefix>@</FieldPrefix>
    <Input placeholder="you@example.com" />
    <FieldSuffix>.com</FieldSuffix>
  </FieldControl>
  <FieldDescription>We'll never share your email.</FieldDescription>
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
            useCase: 'Normal editable input — the standard state for all form fields.',
            value: 'john@example.com',
          },
          {
            variant: 'error',
            label: 'Error',
            useCase:
              'Invalid input — triggered by validation failure. Auto-applied when FieldContent has an error prop.',
            value: 'wrong@',
          },
          {
            variant: 'disabled',
            label: 'Disabled',
            useCase:
              'Non-interactive field — user cannot focus or edit. Auto-applied when FieldContent has disabled prop.',
            value: 'john@example.com',
          },
        ].map(({ variant, label, useCase, value }) => (
          <div
            key={variant}
            className="flex items-start gap-4 mb-4 p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors"
          >
            <div className="w-52 shrink-0">
              <Input variant={variant} size="base" defaultValue={value} />
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
      <Section title="Sizes" description="Five sizes to match context density.">
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {['Size', 'Height', 'Padding', 'Best for', 'Preview'].map((h) => (
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
                ['xs', '24px', 'px-2', 'Dense tables, compact filters'],
                ['sm', '28px', 'px-2.5', 'Secondary fields in tight layouts'],
                ['base', '32px', 'px-3', 'Default for most form fields'],
                ['md', '36px', 'px-3.5', 'Prominent fields, modals'],
                ['lg', '40px', 'px-4', 'Hero fields, search bars'],
              ].map(([size, h, p, use]) => (
                <tr key={size} className="even:bg-gray-50">
                  <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700">
                    {size}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-gray-600">{h}</td>
                  <td className="px-3 py-2 border border-gray-200 font-mono text-gray-600">{p}</td>
                  <td className="px-3 py-2 border border-gray-200 text-gray-500">{use}</td>
                  <td className="px-3 py-2 border border-gray-200">
                    <Input size={size} placeholder={size} className="w-32" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Input Props */}
      <Section title="Input Props">
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
                  'Visual state — auto-derived from FieldContent (error prop → "error", disabled prop → "disabled"). Override explicitly when used standalone.',
                ],
                [
                  'size',
                  '"xs" | "sm" | "base" | "md" | "lg"',
                  'ctx or "base"',
                  'Overrides FieldContent context size when set explicitly',
                ],
                ['className', 'string', '—', 'CSS classes applied to the <input> element'],
                [
                  '...props',
                  'HTMLInputProps',
                  '—',
                  'All native input attributes (type, placeholder, etc.)',
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
  <FieldLabel>Email</FieldLabel>
  <FieldControl>
    <Input type="email" placeholder="you@example.com" />
  </FieldControl>
  <FieldDescription>We'll never share your email.</FieldDescription>
</FieldContent>`}</Code>
        </SubSection>

        <SubSection title="Error State">
          <Code>{`<FieldContent size="base" required error="Enter a valid email address.">
  <FieldLabel>Email</FieldLabel>
  <FieldControl>
    <Input defaultValue="wrong@" />
  </FieldControl>
  <FieldError />
</FieldContent>`}</Code>
        </SubSection>

        <SubSection title="Currency Field (with affix)">
          <Code>{`<FieldContent size="base">
  <FieldLabel>Amount</FieldLabel>
  <FieldControl>
    <FieldPrefix>Rp</FieldPrefix>
    <Input type="number" placeholder="0" />
    <FieldSuffix>IDR</FieldSuffix>
  </FieldControl>
</FieldContent>`}</Code>
        </SubSection>

        <SubSection title="Search Field (standalone — no label)">
          <Code>{`<FieldControl className="w-72">
  <FieldPrefix><Search /></FieldPrefix>
  <Input size="md" placeholder="Search items..." />
</FieldControl>`}</Code>
        </SubSection>

        <SubSection title="Password Toggle">
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80 mb-3">
            <FieldContent size="base">
              <PasswordDemo />
            </FieldContent>
          </div>
          <Code>{`const [show, setShow] = useState(false)

<FieldContent size="base">
  <FieldControl>
    <FieldPrefix><Lock /></FieldPrefix>
    <Input type={show ? 'text' : 'password'} placeholder="Password" />
    <FieldSuffix
      className="pointer-events-auto cursor-pointer hover:text-foreground"
      onClick={() => setShow(s => !s)}
    >
      {show ? <EyeOff /> : <Eye />}
    </FieldSuffix>
  </FieldControl>
</FieldContent>`}</Code>
        </SubSection>
      </Section>

      {/* When to Use */}
      <Section title="When to Use">
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {['Use Input Field when…', 'Consider an alternative when…'].map((h) => (
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
              <tr>
                <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700 align-top">
                  <ul className="flex flex-col gap-1.5">
                    <li>
                      The user needs to type a short, free-form value — name, email, URL, or amount
                    </li>
                    <li>
                      The input is a single line and the expected value has no fixed set of options
                    </li>
                    <li>You need a search field, filter box, or inline lookup</li>
                    <li>
                      The field requires a prefix or suffix — currency symbol, unit, icon, or toggle
                      (e.g. password reveal)
                    </li>
                  </ul>
                </td>
                <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700 align-top">
                  <ul className="flex flex-col gap-1.5">
                    <li>
                      Use <strong>Textarea</strong> when the value spans multiple lines — notes,
                      descriptions, or comments
                    </li>
                    <li>
                      Use <strong>Select</strong> when the user must pick from a fixed, enumerated
                      list of options
                    </li>
                    <li>
                      Use a <strong>DatePicker</strong> when the value is a calendar date or time
                      range
                    </li>
                    <li>
                      Use a <strong>NumberInput</strong> or stepper when the value is numeric with
                      increment/decrement controls
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
            <div className="space-y-3">
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <p className="text-xs text-green-800">
                  Always pair an Input with a <strong>FieldLabel</strong>. Labels give the field an
                  accessible name and help users understand what to enter — never rely on
                  placeholder text alone.
                </p>
              </div>
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <p className="text-xs text-green-800">
                  Use <strong>placeholder</strong> to show an example value or format hint (e.g.
                  "you@example.com", "YYYY-MM-DD"). Keep it concise — it disappears once the user
                  starts typing.
                </p>
              </div>
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <p className="text-xs text-green-800">
                  Surface validation errors via <strong>FieldError</strong> and the{' '}
                  <strong>error</strong> prop on FieldContent. The error variant ring and the error
                  message together give both visual and assistive-technology feedback.
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
            <div className="space-y-3">
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <p className="text-xs text-red-800">
                  Don't use placeholder text as a substitute for a label. Placeholders vanish on
                  focus and are not announced reliably by screen readers — users lose context the
                  moment they start typing.
                </p>
              </div>
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <p className="text-xs text-red-800">
                  Don't use an Input for content that wraps across multiple lines — notes,
                  addresses, or long descriptions. Use a <strong>Textarea</strong> instead so the
                  full value stays visible while the user edits.
                </p>
              </div>
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <p className="text-xs text-red-800">
                  Don't set the <strong>error</strong> variant without also providing a FieldError
                  message. A red ring alone doesn't tell the user what went wrong or how to fix it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  ),
}
