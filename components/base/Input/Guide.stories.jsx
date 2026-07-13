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
        aria-label={show ? 'Hide password' : 'Show password'}
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
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Input</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A flexible single-line text input with three variants and five sizes. Reads context from{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">FieldContent</code> for
          accessible IDs, error state, required, and disabled — works standalone too. Pair with{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">FieldControl</code> to add a{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">FieldPrefix</code> or{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">FieldSuffix</code> without
          manual padding.
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
</FieldContent>`}</Code>
      </Section>

      {/* ── Anatomy ────────────────────────────────────────────────────────── */}
      <Section
        title="Anatomy"
        description="Input composes with the Field system. FieldControl handles prefix/suffix positioning; FieldContent wires up accessible IDs, error state, and disabled."
      >
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4">
          <div className="relative p-4 border-2 border-dashed border-violet-400 rounded-xl">
            <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-[10px] font-mono font-semibold text-violet-600">
              FieldContent
            </span>

            <div className="relative px-3 py-1.5 border border-dashed border-slate-300 rounded mb-2">
              <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-slate-400">
                FieldLabel
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Email</span>
            </div>

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

            <div className="relative px-3 py-1.5 border border-dashed border-green-300 rounded mb-2">
              <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-green-500">
                FieldDescription
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                We will never share your email.
              </span>
            </div>

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
                  'Root wrapper. Provides accessible IDs, error state, disabled, and required via context.',
                ],
                ['FieldLabel', '<label>', 'Accessible label linked to the input via context ID.'],
                [
                  'FieldControl',
                  '<div>',
                  'Relative positioning wrapper for prefix/suffix overlays. Required when using FieldPrefix or FieldSuffix.',
                ],
                [
                  'Input',
                  '<input>',
                  'Core input element. Reads variant, size, error, and disabled from FieldContent context.',
                ],
                [
                  'FieldPrefix',
                  '<span>',
                  'Optional overlay anchored to the left edge of the input. Icon or short text.',
                ],
                [
                  'FieldSuffix',
                  '<span>',
                  'Optional overlay anchored to the right edge of the input. Icon, unit, or action.',
                ],
                [
                  'FieldDescription',
                  '<p>',
                  'Helper text shown below the label. Linked to Input via aria-describedby.',
                ],
                [
                  'FieldError',
                  '<p>',
                  'Error message with role="alert". Reads from FieldContent context or from children.',
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

        <Code>{`<FieldContent required error={errors.email?.message}>
  <FieldLabel>Email</FieldLabel>
  <FieldControl>
    <FieldPrefix><Mail /></FieldPrefix>
    <Input type="email" placeholder="you@example.com" />
  </FieldControl>
  <FieldDescription>We will never share your email.</FieldDescription>
  <FieldError />
</FieldContent>`}</Code>
      </Section>

      {/* ── Variants ───────────────────────────────────────────────────────── */}
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
              <Input variant={variant} defaultValue={value} />
            </div>
            <div>
              <p className="text-xs font-mono font-medium text-violet-700 mb-1">
                variant="{variant}"
              </p>
              <p className="text-xs text-gray-500 leading-relaxed">{useCase}</p>
            </div>
          </div>
        ))}
        <Code>{`{/* Auto-derived from FieldContent — no variant prop needed */}
<FieldContent error="Enter a valid email.">
  <FieldControl><Input /></FieldControl>
  <FieldError />
</FieldContent>

{/* Explicit override for standalone usage */}
<Input variant="error" defaultValue="wrong@" />
<Input variant="disabled" defaultValue="read only" />`}</Code>
      </Section>

      {/* ── Usage Examples ─────────────────────────────────────────────────── */}
      <Section title="Usage Examples" description="Copy-ready code for common scenarios.">
        <SubSection title="With Label & Description">
          <Preview>
            <FieldContent required>
              <FieldLabel>Email</FieldLabel>
              <FieldDescription>We will never share your email.</FieldDescription>
              <FieldControl>
                <Input type="email" placeholder="you@example.com" />
              </FieldControl>
            </FieldContent>
          </Preview>
          <Code>{`<FieldContent required>
  <FieldLabel>Email</FieldLabel>
  <FieldDescription>We will never share your email.</FieldDescription>
  <FieldControl>
    <Input type="email" placeholder="you@example.com" />
  </FieldControl>
</FieldContent>`}</Code>
        </SubSection>

        <SubSection title="Error State">
          <Preview>
            <FieldContent required error="Enter a valid email address.">
              <FieldLabel>Email</FieldLabel>
              <FieldControl>
                <Input type="email" defaultValue="wrong@" />
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

        <SubSection title="Currency Field (prefix + suffix)">
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
          <Code>{`<FieldContent>
  <FieldLabel>Amount</FieldLabel>
  <FieldControl>
    <FieldPrefix>Rp</FieldPrefix>
    <Input type="number" placeholder="0" />
    <FieldSuffix>IDR</FieldSuffix>
  </FieldControl>
</FieldContent>`}</Code>
        </SubSection>

        <SubSection title="Search Bar (standalone — no label)">
          <Preview>
            <FieldControl>
              <FieldPrefix>
                <Search />
              </FieldPrefix>
              <Input placeholder="Search items…" aria-label="Search" />
            </FieldControl>
          </Preview>
          <Code>{`<FieldControl>
  <FieldPrefix><Search /></FieldPrefix>
  <Input placeholder="Search items…" aria-label="Search" />
</FieldControl>`}</Code>
        </SubSection>

        <SubSection title="Password Toggle">
          <Preview>
            <FieldContent>
              <FieldLabel>Password</FieldLabel>
              <PasswordDemo />
            </FieldContent>
          </Preview>
          <Code>{`const [show, setShow] = useState(false)

<FieldContent>
  <FieldLabel>Password</FieldLabel>
  <FieldControl>
    <FieldPrefix><Lock /></FieldPrefix>
    <Input type={show ? 'text' : 'password'} placeholder="••••••••" />
    <FieldSuffix
      className="pointer-events-auto cursor-pointer hover:text-foreground transition-colors"
      onClick={() => setShow(s => !s)}
      aria-label={show ? 'Hide password' : 'Show password'}
    >
      {show ? <EyeOff /> : <Eye />}
    </FieldSuffix>
  </FieldControl>
</FieldContent>`}</Code>
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
                  title: 'Use Input for short, free-form single-line values',
                  body: 'Names, emails, URLs, amounts, usernames — any value the user types freely on one line. Input is the default choice for form fields without a fixed set of options.',
                },
                {
                  title: 'Use a prefix or suffix to show format context inline',
                  body: 'When the value must be a currency amount, URL, or percentage, FieldPrefix and FieldSuffix make the expected format visible without adding text outside the field. Input auto-pads to prevent overlap.',
                },
                {
                  title:
                    'Use a standalone FieldControl for search bars and filter inputs without labels',
                  body: 'Search inputs in toolbars and table headers do not need a FieldContent wrapper. Use FieldControl directly and add aria-label to the Input for the accessible name.',
                },
              ],
            },
            {
              heading: 'When not to use',
              items: [
                {
                  title: 'Use Textarea for multi-line content — notes, descriptions, comments',
                  body: 'Input is a single line. If the expected value spans multiple lines, use Textarea so the full content stays visible while the user edits and the component grows with the text.',
                },
                {
                  title: 'Use Select when the user must pick from a fixed enumerated list',
                  body: 'A text input with a fixed list of valid values leads to user errors and inconsistent data. If the options are finite and known, use Select so users can only pick valid values.',
                },
                {
                  title: 'Use DatePicker or TimePicker for date and time input',
                  body: 'Typing dates as free text is error-prone and locale-sensitive. DatePicker and TimePicker give users a structured, guided experience and produce a consistent value format.',
                },
              ],
            },
            {
              heading: 'Accessibility',
              items: [
                {
                  title: 'Always pair Input with a FieldLabel — never rely on placeholder alone',
                  body: 'Placeholder text disappears when the user starts typing and is not reliably announced by all screen readers. FieldLabel provides a persistent accessible name that stays visible and is always read.',
                },
                {
                  title: 'Always include <FieldError /> when validation is possible',
                  body: 'FieldError renders with role="alert" and is linked to the Input via aria-errormessage. Even with no current error, including it in the tree means screen readers announce the message immediately when it appears.',
                },
                {
                  title: 'Add aria-label when using FieldControl without FieldContent',
                  body: 'Standalone FieldControl has no FieldLabel to auto-wire. Without aria-label on the Input, the field has no accessible name and assistive technologies cannot announce what the field is for.',
                },
              ],
            },
            {
              heading: 'Advice',
              items: [
                {
                  title: 'Write specific, actionable error messages',
                  body: '"Enter a valid email address" tells users exactly what to fix. "Invalid input" does not. Always write errors from the user\'s perspective: what the value should look like and what format is expected.',
                },
                {
                  title: 'Set input type correctly for mobile keyboards and browser autofill',
                  body: 'type="email" triggers the @ keyboard on mobile and enables browser autofill for email fields. type="tel" shows a numeric keypad. type="password" hides the value. Always set type to match the expected value.',
                },
                {
                  title: 'Set input type correctly for mobile keyboards and browser autofill',
                  body: 'type="email" triggers the @ keyboard on mobile and enables browser autofill for email fields. type="tel" shows a numeric keypad. type="password" hides the value. Always set type to match the expected value.',
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

      {/* ── API Reference ──────────────────────────────────────────────────── */}
      <Section title="API Reference">
        <ApiTable
          component="Input"
          rows={[
            [
              'variant',
              '"default" | "error" | "disabled"',
              'auto',
              'Visual state. Auto-derived from FieldContent context (error → "error", disabled → "disabled"). Override explicitly for standalone usage.',
            ],
            ['className', 'string', '—', 'Additional CSS classes applied to the <input> element.'],
            [
              '...props',
              'HTMLInputElement',
              '—',
              'All native input attributes — type, placeholder, defaultValue, value, onChange, etc.',
            ],
          ]}
        />
      </Section>
    </div>
  ),
}
