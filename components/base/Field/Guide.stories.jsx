import { useState } from 'react'
import { Search, Mail, DollarSign, Globe, Lock, Eye, EyeOff } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
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
          <h1 className="text-3xl font-bold text-gray-900">Field</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A set of composable layout and context primitives for building accessible form fields.
          Wrap inputs with{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">FieldContent</code> to wire
          up a11y context, organize multiple fields with{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">FieldContainer</code> and{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">FieldGroup</code>, and use{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">FieldLabel</code>,{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">FieldDescription</code>, and{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">FieldError</code> for
          complete field anatomy.
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
        description="Full component hierarchy from outermost wrapper down to the input element."
      >
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg mb-4 w-full max-w-2xl">
          {/* FieldContainer */}
          <div className="border-2 border-dashed border-slate-400 rounded-md p-3 bg-slate-50">
            <div className="text-xs font-mono text-slate-500 mb-3 px-0.5">
              FieldContainer (flex-col gap-*)
            </div>

            {/* FieldGroup */}
            <div className="border-2 border-dashed border-teal-300 rounded-md p-2 bg-teal-50">
              <div className="text-xs font-mono text-teal-600 mb-1.5 px-0.5">
                FieldGroup (grid cols=2)
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2 border border-dashed border-amber-300 rounded px-2 py-0.5 bg-amber-50">
                  <span className="text-xs font-mono text-amber-600">FieldTitle</span>
                </div>
                {[0, 1].map((i) => (
                  <div
                    key={i}
                    className="border-2 border-dashed border-blue-300 rounded p-1.5 bg-blue-50"
                  >
                    <div className="text-xs font-mono text-blue-500 mb-1">
                      FieldContent (flex-col gap-1.5)
                    </div>
                    <div className="border border-dashed border-green-400 rounded px-1.5 py-0.5 bg-green-50 text-xs font-mono text-green-600 w-fit mb-1">
                      FieldLabel
                    </div>
                    <div className="border border-dashed border-indigo-300 rounded p-0.5 bg-indigo-50/60 mb-1">
                      <div
                        className="text-xs font-mono text-indigo-400 mb-0.5 px-0.5"
                        style={{ fontSize: 10 }}
                      >
                        FieldControl (relative flex)
                      </div>
                      <div className="flex items-stretch gap-1">
                        <div className="border border-dashed border-orange-300 rounded px-1.5 py-0.5 bg-orange-50 flex items-center">
                          <span
                            className="text-xs font-mono text-orange-500"
                            style={{ fontSize: 10 }}
                          >
                            FieldPrefix
                          </span>
                        </div>
                        <div
                          className="flex-1 border border-dashed border-violet-300 rounded h-5 bg-violet-50 flex items-center justify-center font-mono text-violet-400"
                          style={{ fontSize: 10 }}
                        >
                          Input / Textarea
                        </div>
                        <div className="border border-dashed border-orange-300 rounded px-1.5 py-0.5 bg-orange-50 flex items-center">
                          <span
                            className="text-xs font-mono text-orange-500"
                            style={{ fontSize: 10 }}
                          >
                            FieldSuffix
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className="border border-dashed border-gray-300 rounded px-1.5 py-0.5 bg-white font-mono text-gray-400 w-fit mb-1"
                      style={{ fontSize: 10 }}
                    >
                      FieldDescription
                    </div>
                    <div
                      className="border border-dashed border-red-300 rounded px-1.5 py-0.5 bg-red-50 font-mono text-red-400 w-fit"
                      style={{ fontSize: 10 }}
                    >
                      FieldError
                    </div>
                  </div>
                ))}
              </div>
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
                  'Outer wrapper. Stacks all fields vertically with consistent gap.',
                ],
                [
                  'FieldGroup',
                  '<div>',
                  'CSS grid for multi-column layouts. Use inside FieldContainer.',
                ],
                [
                  'FieldTitle',
                  '<p>',
                  'col-span-full label for a group of fields inside FieldGroup.',
                ],
                [
                  'FieldContent',
                  '<div>',
                  'Single field unit. Provides accessible IDs, required, disabled, and error state via context.',
                ],
                ['FieldLabel', '<label>', 'Accessible label linked to the input via context ID.'],
                [
                  'FieldControl',
                  '<div>',
                  'Input row wrapper. Handles prefix/suffix positioning. Required when using FieldPrefix or FieldSuffix.',
                ],
                [
                  'FieldPrefix / FieldSuffix',
                  '<div>',
                  'Absolutely-positioned overlays inside FieldControl. Left or right edge of the input.',
                ],
                [
                  'FieldDescription',
                  '<p>',
                  'Helper text below the input. Linked via aria-describedby.',
                ],
                [
                  'FieldError',
                  '<p>',
                  'Error message with role="alert". Only renders when FieldContent has an error prop.',
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

        <Code>{`<FieldContainer>
  <FieldGroup cols={2}>
    <FieldTitle>Personal Info</FieldTitle>
    <FieldContent size="base" required>
      <FieldLabel>First Name</FieldLabel>
      <FieldControl>
        <Input placeholder="John" />
      </FieldControl>
    </FieldContent>
    <FieldContent size="base" required error={errors.email?.message}>
      <FieldLabel>Email</FieldLabel>
      <FieldControl>
        <FieldPrefix>@</FieldPrefix>
        <Input placeholder="you@example.com" />
      </FieldControl>
      <FieldDescription>We'll never share your email.</FieldDescription>
      <FieldError />
    </FieldContent>
  </FieldGroup>
</FieldContainer>`}</Code>
      </Section>

      {/* FieldContainer */}
      <Section
        title="FieldContainer"
        description="Outer wrapper that stacks all form fields vertically with consistent spacing. Use it as the form body — wrap all your fields inside one FieldContainer instead of a bare div."
      >
        <SubSection
          title="Basic"
          description="Wraps multiple fields with a consistent vertical gap."
        >
          <div className="max-w-sm mb-3">
            <FieldContainer>
              <FieldContent size="base" required>
                <FieldLabel>Email</FieldLabel>
                <FieldControl>
                  <Input placeholder="you@example.com" />
                </FieldControl>
              </FieldContent>
              <FieldContent size="base" required>
                <FieldLabel>Password</FieldLabel>
                <FieldControl>
                  <Input type="password" placeholder="••••••••" />
                </FieldControl>
              </FieldContent>
            </FieldContainer>
          </div>
        </SubSection>

        <SubSection
          title="With FieldGroup"
          description="FieldContainer wraps the whole form; FieldGroup handles grid layout inside."
        >
          <div className="max-w-lg mb-3">
            <FieldContainer gap="md">
              <FieldGroup cols={2}>
                <FieldContent size="base" required>
                  <FieldLabel>First Name</FieldLabel>
                  <FieldControl>
                    <Input placeholder="John" />
                  </FieldControl>
                </FieldContent>
                <FieldContent size="base" required>
                  <FieldLabel>Last Name</FieldLabel>
                  <FieldControl>
                    <Input placeholder="Doe" />
                  </FieldControl>
                </FieldContent>
              </FieldGroup>
              <FieldContent size="base" required>
                <FieldLabel>Email</FieldLabel>
                <FieldControl>
                  <Input type="email" placeholder="john@example.com" />
                </FieldControl>
              </FieldContent>
              <FieldGroup cols={2}>
                <FieldContent size="base">
                  <FieldLabel>City</FieldLabel>
                  <FieldControl>
                    <Input placeholder="Jakarta" />
                  </FieldControl>
                </FieldContent>
                <FieldContent size="base">
                  <FieldLabel>Postal Code</FieldLabel>
                  <FieldControl>
                    <Input placeholder="12345" />
                  </FieldControl>
                </FieldContent>
              </FieldGroup>
            </FieldContainer>
          </div>
        </SubSection>

        <SubSection
          title="Nested FieldContainer"
          description="Use nested FieldContainers to separate form sections with different gaps."
        >
          <div className="max-w-sm mb-3">
            <FieldContainer gap="lg">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Account
                </p>
                <FieldContainer gap="base">
                  <FieldContent size="base" required>
                    <FieldLabel>Email</FieldLabel>
                    <FieldControl>
                      <Input placeholder="you@example.com" />
                    </FieldControl>
                  </FieldContent>
                  <FieldContent size="base" required>
                    <FieldLabel>Password</FieldLabel>
                    <FieldControl>
                      <Input type="password" placeholder="••••••••" />
                    </FieldControl>
                  </FieldContent>
                </FieldContainer>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Profile
                </p>
                <FieldContainer gap="base">
                  <FieldContent size="base">
                    <FieldLabel>Display Name</FieldLabel>
                    <FieldControl>
                      <Input placeholder="Cahya" />
                    </FieldControl>
                  </FieldContent>
                  <FieldContent size="base">
                    <FieldLabel>Bio</FieldLabel>
                    <FieldControl>
                      <Input placeholder="Tell us about yourself" />
                    </FieldControl>
                  </FieldContent>
                </FieldContainer>
              </div>
            </FieldContainer>
          </div>
        </SubSection>

        <SubSection title="Props — FieldContainer">
          <div className="overflow-x-auto mb-6">
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
                    'gap',
                    '"sm" | "base" | "md" | "lg"',
                    '"base"',
                    'Vertical gap between children — sm→gap-3, base→gap-4, md→gap-5, lg→gap-6',
                  ],
                  ['className', 'string', '—', 'Additional CSS classes on the wrapper div'],
                  [
                    'children',
                    'ReactNode',
                    '—',
                    'Form fields — FieldContent, FieldGroup, or any node',
                  ],
                ].map(([prop, type, def, desc]) => (
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
                    <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">
                      {desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SubSection>
      </Section>

      {/* FieldGroup */}
      <Section
        title="FieldGroup"
        description="Grid layout wrapper for grouping multiple form fields. Use FieldTitle inside to label a section of fields. Supports responsive cols via breakpoint object."
      >
        <SubSection title="Fixed Columns">
          <div className="flex flex-col gap-6 max-w-2xl mb-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n}>
                <p className="text-xs font-mono text-violet-700 mb-2">cols={`{${n}}`}</p>
                <FieldGroup cols={n}>
                  {Array.from({ length: n }).map((_, i) => (
                    <FieldContent key={i} size="base">
                      <FieldLabel>{`Field ${i + 1}`}</FieldLabel>
                      <FieldControl>
                        <Input placeholder={`Field ${i + 1}`} />
                      </FieldControl>
                    </FieldContent>
                  ))}
                </FieldGroup>
              </div>
            ))}
          </div>
        </SubSection>

        <SubSection
          title="Responsive Columns"
          description="Pass an object with breakpoint keys. xs is mobile-first (no prefix), xxl maps to Tailwind 2xl. Resize the window to see columns change."
        >
          <div className="max-w-2xl mb-4">
            <p className="text-xs font-mono text-violet-700 mb-2">
              {'cols={{ xs: 1, md: 2, lg: 3 }}'}
            </p>
            <FieldGroup cols={{ xs: 1, md: 2, lg: 3 }}>
              {['First Name', 'Last Name', 'Email', 'Phone', 'City', 'Postal Code'].map((label) => (
                <FieldContent key={label} size="base">
                  <FieldLabel>{label}</FieldLabel>
                  <FieldControl>
                    <Input placeholder={label} />
                  </FieldControl>
                </FieldContent>
              ))}
            </FieldGroup>
          </div>

          <div className="overflow-x-auto mb-3">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {['Breakpoint', 'Key', 'Tailwind prefix', 'Viewport'].map((h) => (
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
                  ['Extra Small', 'xs', '(none)', '0px+'],
                  ['Small', 'sm', 'sm:', '640px+'],
                  ['Medium', 'md', 'md:', '768px+'],
                  ['Large', 'lg', 'lg:', '1024px+'],
                  ['Extra Large', 'xl', 'xl:', '1280px+'],
                  ['2X Large', 'xxl', '2xl:', '1536px+'],
                ].map(([name, key, prefix, vp]) => (
                  <tr key={key} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 text-gray-600">{name}</td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700">
                      {key}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-gray-500">
                      {prefix}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-gray-500">{vp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SubSection>

        <SubSection title="Props — FieldGroup">
          <div className="overflow-x-auto mb-6">
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
                    'cols',
                    'number | { xs?, sm?, md?, lg?, xl?, xxl? }',
                    '1',
                    'Fixed number or responsive object — xs is mobile-first, xxl maps to 2xl',
                  ],
                  [
                    'gap',
                    '"sm" | "base" | "lg"',
                    '"base"',
                    'Gap between items — sm → gap-3, base → gap-4, lg → gap-6',
                  ],
                  ['className', 'string', '—', 'Additional CSS classes on the grid wrapper'],
                ].map(([prop, type, def, desc]) => (
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
                    <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">
                      {desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SubSection>
      </Section>

      {/* FieldTitle */}
      <Section
        title="FieldTitle"
        description="Section label inside FieldGroup. Always spans all columns — use it to separate groups of fields with a named heading."
      >
        <SubSection title="Basic">
          <div className="max-w-lg mb-4">
            <FieldGroup cols={2}>
              <FieldTitle>Personal Info</FieldTitle>
              <FieldContent size="base" required>
                <FieldLabel>First Name</FieldLabel>
                <FieldControl>
                  <Input placeholder="John" />
                </FieldControl>
              </FieldContent>
              <FieldContent size="base" required>
                <FieldLabel>Last Name</FieldLabel>
                <FieldControl>
                  <Input placeholder="Doe" />
                </FieldControl>
              </FieldContent>

              <FieldTitle>Address</FieldTitle>
              <FieldContent size="base">
                <FieldLabel>City</FieldLabel>
                <FieldControl>
                  <Input placeholder="Jakarta" />
                </FieldControl>
              </FieldContent>
              <FieldContent size="base">
                <FieldLabel>Postal Code</FieldLabel>
                <FieldControl>
                  <Input placeholder="12345" />
                </FieldControl>
              </FieldContent>
            </FieldGroup>
          </div>
        </SubSection>

        <SubSection title="Props — FieldTitle">
          <div className="overflow-x-auto mb-6">
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
                    'className',
                    'string',
                    '—',
                    'Additional CSS classes — col-span-full is always applied',
                  ],
                  ['children', 'ReactNode', '—', 'Section label text'],
                ].map(([prop, type, def, desc]) => (
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
                    <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">
                      {desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SubSection>
      </Section>

      {/* FieldSeparator */}
      <Section
        title="FieldSeparator"
        description="A simple hr divider for visually separating sections inside a form. Drop it anywhere between fields."
      >
        <SubSection title="Basic">
          <div className="max-w-sm mb-4">
            <FieldContainer gap="md">
              <FieldContent size="base" required>
                <FieldLabel>Email</FieldLabel>
                <FieldControl>
                  <Input placeholder="you@example.com" />
                </FieldControl>
              </FieldContent>
              <FieldContent size="base" required>
                <FieldLabel>Password</FieldLabel>
                <FieldControl>
                  <Input type="password" placeholder="••••••••" />
                </FieldControl>
              </FieldContent>
              <FieldSeparator />
              <FieldContent size="base">
                <FieldLabel>Display Name</FieldLabel>
                <FieldControl>
                  <Input placeholder="Cahya" />
                </FieldControl>
              </FieldContent>
            </FieldContainer>
          </div>
        </SubSection>

        <SubSection title="Props — FieldSeparator">
          <div className="overflow-x-auto mb-6">
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
                {[['className', 'string', '—', 'Additional CSS classes on the hr element']].map(
                  ([prop, type, def, desc]) => (
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
                      <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">
                        {desc}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </SubSection>
      </Section>

      {/* FieldContent */}
      <Section
        title="FieldContent"
        description="The single-field unit. Provides a React context that wires up accessible IDs, required, disabled, and error state to all children — FieldLabel, Input, FieldDescription, and FieldError all read from this context automatically."
      >
        <SubSection title="With Label & Description">
          <Preview>
            <FieldContent size="base" required>
              <FieldLabel>Email</FieldLabel>
              <FieldControl>
                <Input placeholder="you@example.com" />
              </FieldControl>
              <FieldDescription>We'll never share your email.</FieldDescription>
            </FieldContent>
          </Preview>
        </SubSection>

        <SubSection
          title="Error State"
          description="Pass an error string — FieldError reads it from context and renders automatically."
        >
          <Preview>
            <FieldContent size="base" required error="Enter a valid email address.">
              <FieldLabel>Email</FieldLabel>
              <FieldControl>
                <Input defaultValue="wrong@" />
              </FieldControl>
              <FieldError />
            </FieldContent>
          </Preview>
        </SubSection>

        <SubSection
          title="Disabled"
          description="Disabled flows to Input (cursor-not-allowed, opacity-50) and FieldLabel automatically."
        >
          <Preview>
            <FieldContent size="base" disabled>
              <FieldLabel>User ID</FieldLabel>
              <FieldControl>
                <Input defaultValue="usr_abc123" />
              </FieldControl>
              <FieldDescription>Auto-generated. Cannot be changed.</FieldDescription>
            </FieldContent>
          </Preview>
        </SubSection>

        <SubSection
          title="Horizontal Orientation"
          description="Use orientation=horizontal for settings-style rows — label and description stack on the left, the control sits on the right. FieldError spans the full width below."
        >
          <Preview>
            <FieldContent orientation="horizontal" size="base" required>
              <FieldLabel>Push notifications</FieldLabel>
              <FieldDescription>Receive alerts for new messages and activity.</FieldDescription>
              <FieldControl>
                <Switch defaultChecked />
              </FieldControl>
            </FieldContent>

            <FieldContent orientation="horizontal" size="base" disabled>
              <FieldLabel>SMS alerts</FieldLabel>
              <FieldDescription>Not available in your region.</FieldDescription>
              <FieldControl>
                <Switch disabled />
              </FieldControl>
            </FieldContent>

            <FieldContent
              orientation="horizontal"
              size="base"
              required
              error="This field is required."
            >
              <FieldLabel>Data processing agreement</FieldLabel>
              <FieldDescription>You must accept to continue.</FieldDescription>
              <FieldControl>
                <Switch />
              </FieldControl>
              <FieldError />
            </FieldContent>
          </Preview>

          <Code>{`{/* Basic */}
<FieldContent orientation="horizontal" size="base" required>
  <FieldLabel>Push notifications</FieldLabel>
  <FieldDescription>Receive alerts for new messages and activity.</FieldDescription>
  <FieldControl>
    <Switch />
  </FieldControl>
</FieldContent>

{/* With error */}
<FieldContent orientation="horizontal" size="base" required error="This field is required.">
  <FieldLabel>Data processing agreement</FieldLabel>
  <FieldDescription>You must accept to continue.</FieldDescription>
  <FieldControl>
    <Switch />
  </FieldControl>
  <FieldError />
</FieldContent>

{/* Disabled */}
<FieldContent orientation="horizontal" size="base" disabled>
  <FieldLabel>SMS alerts</FieldLabel>
  <FieldDescription>Not available in your region.</FieldDescription>
  <FieldControl>
    <Switch />
  </FieldControl>
</FieldContent>`}</Code>

          <SubSection
            title="Grid layout"
            description="How children map to the 2-column grid when orientation is horizontal."
          >
            <div className="p-5 bg-gray-50 border border-gray-200 rounded-lg mb-3 w-full max-w-md">
              <div className="grid grid-cols-[1fr_80px] gap-x-4 gap-y-1 text-xs font-mono">
                <div className="border border-dashed border-green-400 rounded px-2 py-1.5 bg-green-50 text-green-700">
                  FieldLabel
                </div>
                <div className="border border-dashed border-indigo-300 rounded px-2 py-1.5 bg-indigo-50 text-indigo-600 row-span-2 flex items-center justify-center text-center leading-snug">
                  Field­Control
                </div>
                <div className="border border-dashed border-gray-300 rounded px-2 py-1.5 bg-white text-gray-500">
                  FieldDescription
                </div>
                <div className="col-span-2 border border-dashed border-red-300 rounded px-2 py-1.5 bg-red-50 text-red-500">
                  FieldError (col-span-2)
                </div>
              </div>
            </div>
          </SubSection>

          <SubSection
            title="Works with any control"
            description="Not limited to Switch — any control that fits the right column works: Checkbox, a small button, a badge."
          >
            <Preview>
              <FieldContent orientation="horizontal" size="base" required>
                <FieldLabel>Accept terms</FieldLabel>
                <FieldDescription>I agree to the Terms of Service.</FieldDescription>
                <FieldControl>
                  <Checkbox />
                </FieldControl>
              </FieldContent>
            </Preview>
            <Code>{`{/* Checkbox */}
<FieldContent orientation="horizontal" size="base" required>
  <FieldLabel>Accept terms</FieldLabel>
  <FieldDescription>I agree to the Terms of Service.</FieldDescription>
  <FieldControl>
    <Checkbox />
  </FieldControl>
</FieldContent>`}</Code>
          </SubSection>

          <SubSection
            title="Settings list pattern"
            description="Wrap multiple horizontal FieldContent rows in a FieldContainer for a clean settings page."
          >
            <div className="max-w-sm mb-3 divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
              {[
                {
                  label: 'Push notifications',
                  desc: 'Receive alerts for new messages.',
                  checked: true,
                },
                {
                  label: 'Dark mode',
                  desc: 'Use a dark background across the app.',
                  checked: false,
                },
                {
                  label: 'SMS alerts',
                  desc: 'Not available in your region.',
                  checked: false,
                  disabled: true,
                },
              ].map(({ label, desc, checked, disabled }) => (
                <div key={label} className="px-4 py-3">
                  <FieldContent orientation="horizontal" size="base" disabled={disabled}>
                    <FieldLabel className={disabled ? 'cursor-not-allowed' : 'cursor-pointer'}>
                      {label}
                    </FieldLabel>
                    <FieldDescription>{desc}</FieldDescription>
                    <FieldControl>
                      <Switch defaultChecked={checked} disabled={disabled} />
                    </FieldControl>
                  </FieldContent>
                </div>
              ))}
            </div>
            <Code>{`<FieldContainer>
  <FieldContent orientation="horizontal" size="base">
    <FieldLabel>Push notifications</FieldLabel>
    <FieldDescription>Receive alerts for new messages.</FieldDescription>
    <FieldControl><Switch defaultChecked /></FieldControl>
  </FieldContent>
  <FieldContent orientation="horizontal" size="base">
    <FieldLabel>Dark mode</FieldLabel>
    <FieldDescription>Use a dark background across the app.</FieldDescription>
    <FieldControl><Switch /></FieldControl>
  </FieldContent>
  <FieldContent orientation="horizontal" size="base" disabled>
    <FieldLabel>SMS alerts</FieldLabel>
    <FieldDescription>Not available in your region.</FieldDescription>
    <FieldControl><Switch /></FieldControl>
  </FieldContent>
</FieldContainer>`}</Code>
          </SubSection>
        </SubSection>

        <SubSection
          title="Size via Context"
          description="Set size once on FieldContent — Input, FieldPrefix, and FieldSuffix all inherit it automatically."
        >
          <div className="flex flex-col gap-4 max-w-xs mb-3">
            {['xs', 'sm', 'base', 'md', 'lg'].map((size) => (
              <FieldContent key={size} size={size}>
                <FieldLabel>size="{size}"</FieldLabel>
                <FieldControl>
                  <FieldPrefix>
                    <Mail />
                  </FieldPrefix>
                  <Input placeholder={`size ${size}`} />
                  <FieldSuffix>.com</FieldSuffix>
                </FieldControl>
              </FieldContent>
            ))}
          </div>
        </SubSection>

        <SubSection title="Props — FieldContent">
          <div className="overflow-x-auto mb-6">
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
                    'orientation',
                    '"vertical" | "horizontal"',
                    '"vertical"',
                    'Layout mode — vertical stacks label above control; horizontal puts label+description on the left and control on the right.',
                  ],
                  [
                    'size',
                    '"xs" | "sm" | "base" | "md" | "lg"',
                    '"base"',
                    'Shared via context — sets height for Input, FieldPrefix, and FieldSuffix. Set it once here instead of on every child.',
                  ],
                  [
                    'required',
                    'boolean',
                    'false',
                    'Flows to FieldLabel (shows red *) and Input (aria-required)',
                  ],
                  [
                    'disabled',
                    'boolean',
                    'false',
                    'Flows to Input (disabled + disabled variant) and FieldLabel',
                  ],
                  [
                    'error',
                    'string',
                    '—',
                    'Error message — flows to FieldError and Input (error variant + aria-invalid)',
                  ],
                  [
                    'name',
                    'string',
                    '—',
                    'Optional — informational only, does not wire to Input automatically',
                  ],
                  [
                    'as',
                    'React.ElementType',
                    '"div"',
                    'Rendered HTML element for the outer wrapper',
                  ],
                  ['className', 'string', '—', 'Additional CSS classes on the outer wrapper'],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs">
                      {prop}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500">
                      {type}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400">
                      {def}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">
                      {desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SubSection>
      </Section>

      {/* FieldControl */}
      <Section
        title="FieldControl"
        description="The input row wrapper. Renders as relative flex items-center and detects FieldPrefix/FieldSuffix children — telling Input to add left or right padding automatically. Use FieldControl inside FieldContent, or standalone for bare input rows."
      >
        <SubSection title="With Affix">
          <Preview>
            <FieldContent size="base">
              <FieldLabel>Amount</FieldLabel>
              <FieldControl>
                <FieldPrefix>Rp</FieldPrefix>
                <Input type="number" placeholder="0" />
                <FieldSuffix>IDR</FieldSuffix>
              </FieldControl>
            </FieldContent>
          </Preview>
        </SubSection>

        <SubSection
          title="Standalone — no FieldContent"
          description="FieldControl works without FieldContent for bare input rows like search bars."
        >
          <Preview>
            <FieldControl>
              <FieldPrefix>
                <Search />
              </FieldPrefix>
              <Input placeholder="Search..." />
            </FieldControl>
            <FieldControl>
              <Input placeholder="Inline field" />
            </FieldControl>
          </Preview>
        </SubSection>

        <SubSection title="Props — FieldControl">
          <div className="overflow-x-auto mb-6">
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
                    'as',
                    'React.ElementType',
                    '"div"',
                    'Rendered HTML element for the input row wrapper',
                  ],
                  ['className', 'string', '—', 'Additional CSS classes on the wrapper'],
                  [
                    'children',
                    'ReactNode',
                    '—',
                    'FieldPrefix, Input, FieldSuffix — any combination',
                  ],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs">
                      {prop}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500">
                      {type}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400">
                      {def}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">
                      {desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SubSection>
      </Section>

      {/* FieldPrefix & FieldSuffix */}
      <Section
        title="FieldPrefix & FieldSuffix"
        description="Absolutely-positioned slots inside FieldControl's input row. Pointer-events-none by default — clicks pass through to the input. Add pointer-events-auto when the affix needs to be interactive."
      >
        <SubSection title="Text Affix" description="Short strings like currency or unit symbols.">
          <Preview>
            <FieldContent size="base">
              <FieldControl>
                <FieldPrefix>Rp</FieldPrefix>
                <Input placeholder="0" />
              </FieldControl>
            </FieldContent>
            <FieldContent size="base">
              <FieldControl>
                <Input placeholder="0" />
                <FieldSuffix>%</FieldSuffix>
              </FieldControl>
            </FieldContent>
            <FieldContent size="base">
              <FieldControl>
                <FieldPrefix>$</FieldPrefix>
                <Input placeholder="0.00" />
                <FieldSuffix>USD</FieldSuffix>
              </FieldControl>
            </FieldContent>
          </Preview>
        </SubSection>

        <SubSection title="Icon Affix" description="Lucide icons or any ReactNode.">
          <Preview>
            <FieldContent size="base">
              <FieldControl>
                <FieldPrefix>
                  <Search />
                </FieldPrefix>
                <Input placeholder="Search..." />
              </FieldControl>
            </FieldContent>
            <FieldContent size="base">
              <FieldControl>
                <FieldPrefix>
                  <Mail />
                </FieldPrefix>
                <Input placeholder="you@example.com" />
              </FieldControl>
            </FieldContent>
            <FieldContent size="base">
              <FieldControl>
                <FieldPrefix>
                  <Globe />
                </FieldPrefix>
                <Input placeholder="yoursite" />
                <FieldSuffix>.com</FieldSuffix>
              </FieldControl>
            </FieldContent>
          </Preview>
        </SubSection>

        <SubSection title="Affix + Variants" description="Affixes work with all Input variants.">
          <Preview>
            <FieldContent size="base">
              <FieldControl>
                <FieldPrefix>
                  <Mail />
                </FieldPrefix>
                <Input placeholder="Normal" />
              </FieldControl>
            </FieldContent>
            <FieldContent size="base" error="Invalid email.">
              <FieldControl>
                <FieldPrefix>
                  <Mail />
                </FieldPrefix>
                <Input defaultValue="wrong@" />
              </FieldControl>
            </FieldContent>
            <FieldContent size="base" disabled>
              <FieldControl>
                <FieldPrefix>
                  <Mail />
                </FieldPrefix>
                <Input defaultValue="Disabled" />
              </FieldControl>
            </FieldContent>
          </Preview>
        </SubSection>

        <SubSection
          title="Interactive Affix"
          description="Add pointer-events-auto to make the affix clickable. The example below shows a password toggle."
        >
          <div className="flex flex-col gap-2 mb-3">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              Default — click on icon focuses the input
            </p>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
              <FieldContent size="base">
                <FieldControl>
                  <FieldPrefix>
                    <Search />
                  </FieldPrefix>
                  <Input placeholder="Click the icon — input gets focus" />
                </FieldControl>
              </FieldContent>
            </div>

            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mt-2">
              Interactive — suffix is clickable
            </p>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
              <FieldContent size="base">
                <PasswordDemo />
              </FieldContent>
            </div>
          </div>
          <Code>{`{/* Default — pointer-events-none, click passes through to input */}
<FieldContent size="base">
  <FieldControl>
    <FieldPrefix><Search /></FieldPrefix>
    <Input placeholder="Search..." />
  </FieldControl>
</FieldContent>

{/* Interactive — add pointer-events-auto to the suffix */}
<FieldContent size="base">
  <FieldControl>
    <Input type="password" placeholder="Password" />
    <FieldSuffix className="pointer-events-auto cursor-pointer hover:text-foreground">
      <button onClick={toggleShow}>
        {show ? <EyeOff /> : <Eye />}
      </button>
    </FieldSuffix>
  </FieldControl>
</FieldContent>`}</Code>
        </SubSection>

        <SubSection title="Props — FieldPrefix & FieldSuffix">
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
                    'className',
                    'string',
                    '—',
                    'Override styles — use pointer-events-auto to make the affix interactive',
                  ],
                  [
                    'children',
                    'ReactNode',
                    '—',
                    'Text, icon, or any element to render inside the slot',
                  ],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs">
                      {prop}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500">
                      {type}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400">
                      {def}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">
                      {desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SubSection>
      </Section>

      {/* FieldLabel */}
      <Section
        title="FieldLabel"
        description="Standalone label component. When inside FieldContent, htmlFor and required are wired automatically from context. Polymorphic via the as prop."
      >
        <SubSection title="Basic">
          <Preview>
            <FieldLabel htmlFor="demo-1">Email address</FieldLabel>
            <FieldLabel htmlFor="demo-2" required>
              Password
            </FieldLabel>
          </Preview>
        </SubSection>

        <SubSection
          title="Auto-wired inside FieldContent"
          description="htmlFor and required come from FieldContent context — no manual props needed."
        >
          <Preview>
            <FieldContent size="base" required>
              <FieldLabel>Auto-linked label</FieldLabel>
              <FieldControl>
                <Input placeholder="Click label to focus" />
              </FieldControl>
            </FieldContent>
          </Preview>
        </SubSection>

        <SubSection
          title="Polymorphic — as prop"
          description='Default is "label". Change when label semantics dont apply.'
        >
          <Preview>
            <FieldLabel as="span">Rendered as span</FieldLabel>
            <FieldLabel as="legend">Rendered as legend</FieldLabel>
            <FieldLabel as="div">Rendered as div</FieldLabel>
          </Preview>
        </SubSection>

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
                ['as', 'React.ElementType', '"label"', 'Rendered HTML element'],
                [
                  'required',
                  'boolean',
                  'ctx.required',
                  'Appends a red * indicator — auto-derived from FieldContent context',
                ],
                [
                  'htmlFor',
                  'string',
                  'ctx.id',
                  'Native for attribute — auto-derived from FieldContent context',
                ],
                ['className', 'string', '—', 'Additional CSS classes'],
              ].map(([prop, type, def, desc]) => (
                <tr key={prop} className="even:bg-gray-50">
                  <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs">
                    {prop}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500">
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
      </Section>

      {/* FieldDescription */}
      <Section
        title="FieldDescription"
        description="Hint text below the field. When inside FieldContent, its id is auto-set and Input wires aria-describedby automatically. Polymorphic via the as prop."
      >
        <SubSection title="Variants">
          <Preview>
            <FieldDescription variant="default">We'll never share your email.</FieldDescription>
            <FieldDescription variant="error">This field is required.</FieldDescription>
          </Preview>
        </SubSection>

        <SubSection title="Polymorphic — as prop">
          <Preview>
            <FieldDescription as="span">Rendered as span</FieldDescription>
            <FieldDescription as="div">Rendered as div</FieldDescription>
          </Preview>
        </SubSection>

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
                ['as', 'React.ElementType', '"p"', 'Rendered HTML element'],
                [
                  'variant',
                  '"default" | "error"',
                  '"default"',
                  'Text color — muted for default, red for error',
                ],
                ['className', 'string', '—', 'Additional CSS classes'],
              ].map(([prop, type, def, desc]) => (
                <tr key={prop} className="even:bg-gray-50">
                  <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs">
                    {prop}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500">
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
      </Section>

      {/* FieldError */}
      <Section
        title="FieldError"
        description="Error message below the field. Has role='alert' so screen readers announce it immediately. Reads the error message from FieldContent context — just drop <FieldError /> inside FieldContent and pass error prop to FieldContent. Only renders when error exists."
      >
        <SubSection
          title="Via context (recommended)"
          description="Pass error to FieldContent — FieldError renders it automatically."
        >
          <Preview>
            <FieldContent size="base" required error="Enter a valid email address.">
              <FieldLabel>Email</FieldLabel>
              <FieldControl>
                <Input defaultValue="wrong@" />
              </FieldControl>
              <FieldError />
            </FieldContent>
          </Preview>
        </SubSection>

        <SubSection
          title="Custom message"
          description="Pass children to FieldError to override the context error message."
        >
          <Preview>
            <FieldContent size="base" required error="Context error (not shown)">
              <FieldLabel>Amount</FieldLabel>
              <FieldControl>
                <FieldPrefix>Rp</FieldPrefix>
                <Input defaultValue="-1" />
              </FieldControl>
              <FieldError>Amount must be greater than zero.</FieldError>
            </FieldContent>
          </Preview>
        </SubSection>

        <SubSection
          title="Null render — no error"
          description="When no error exists, FieldError renders nothing."
        >
          <Preview>
            <FieldContent size="base">
              <FieldLabel>Email</FieldLabel>
              <FieldControl>
                <Input placeholder="No error — FieldError renders nothing" />
              </FieldControl>
              <FieldError />
            </FieldContent>
          </Preview>
        </SubSection>

        <SubSection title="Props — FieldError">
          <div className="overflow-x-auto mb-6">
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
                  ['as', 'React.ElementType', '"p"', 'Rendered HTML element'],
                  [
                    'children',
                    'ReactNode',
                    'ctx.error',
                    'Error message — overrides the context error when provided',
                  ],
                  ['className', 'string', '—', 'Additional CSS classes'],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs">
                      {prop}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500">
                      {type}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400">
                      {def}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">
                      {desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SubSection>
      </Section>
    </div>
  ),
}
