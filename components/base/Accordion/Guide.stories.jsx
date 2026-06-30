import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Accordion',
}

export default meta

// ─── Primitives ───────────────────────────────────────────────────────────────

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
  <div className="flex flex-col gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg mb-3">
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

// ─── Story ────────────────────────────────────────────────────────────────────

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="p-8 max-w-4xl font-sans text-gray-900">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Accordion</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A vertically stacked set of collapsible sections. Built on Radix UI — supports single-open
          and multi-open modes, keyboard navigation, and animated expand/collapse transitions.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <Preview>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Personal Information</AccordionTrigger>
              <AccordionContent>
                Update your name, email address, and profile photo. Changes are saved automatically.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Notification Preferences</AccordionTrigger>
              <AccordionContent>
                Choose which notifications you want to receive — push, email, or in-app alerts.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Security & Privacy</AccordionTrigger>
              <AccordionContent>
                Manage your password, two-factor authentication, and connected devices.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Preview>
      </Section>

      {/* Variants */}
      <Section
        title="Variants"
        description="The variant prop controls the visual presentation of the accordion."
      >
        {[
          {
            value: 'default',
            label: 'default',
            desc: 'Flat list with border-bottom separators between items. Best for dense layouts and settings pages.',
          },
          {
            value: 'card',
            label: 'card',
            desc: 'Each item rendered as a standalone card with border and rounded corners, separated by a gap. Best for content-heavy sections.',
          },
        ].map(({ value, label, desc }) => (
          <div
            key={value}
            className="flex items-start gap-4 mb-4 p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors"
          >
            <div className="w-48 shrink-0">
              <p className="text-xs font-mono font-medium text-violet-700 mb-1">
                variant="{label}"
              </p>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
            <div className="flex-1">
              <Accordion variant={value} type="single" collapsible>
                <AccordionItem value="v1">
                  <AccordionTrigger>Section A</AccordionTrigger>
                  <AccordionContent>Content for section A.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="v2">
                  <AccordionTrigger>Section B</AccordionTrigger>
                  <AccordionContent>Content for section B.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="v3">
                  <AccordionTrigger>Section C</AccordionTrigger>
                  <AccordionContent>Content for section C.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        ))}
      </Section>

      {/* Anatomy */}
      <Section
        title="Anatomy"
        description="Accordion is composed of four sub-components nested in a fixed hierarchy."
      >
        {/* Diagram */}
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4">
          <div className="relative pt-6 p-4 border-2 border-dashed border-violet-400 rounded-xl inline-block min-w-[320px]">
            <span className="absolute top-2 left-3 text-[10px] font-mono font-semibold text-violet-600">
              Accordion
            </span>

            <div className="relative pt-6 p-3 border border-dashed border-green-300 rounded-lg">
              <span className="absolute top-1.5 left-3 text-[10px] font-mono text-green-500">
                AccordionItem
              </span>

              <div className="flex flex-col gap-2">
                <div className="relative pt-5 px-3 pb-2 border border-dashed border-orange-300 rounded-md">
                  <span className="absolute top-1.5 left-2 text-[10px] font-mono text-orange-500">
                    AccordionTrigger
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-mono">Section title</span>
                    <span className="text-xs text-slate-400">⌄</span>
                  </div>
                </div>

                <div className="relative pt-5 px-3 pb-2 border border-dashed border-pink-300 rounded-md">
                  <span className="absolute top-1.5 left-2 text-[10px] font-mono text-pink-500">
                    AccordionContent
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Body content...</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parts table */}
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
                  'Accordion',
                  '<div>',
                  'Root wrapper. Controls open mode via type="single" or "multiple".',
                ],
                [
                  'AccordionItem',
                  '<div>',
                  'One collapsible section. Requires a unique value prop. Accepts disabled.',
                ],
                [
                  'AccordionTrigger',
                  '<button>',
                  'Clickable header that toggles open/close. Includes ChevronDown that rotates on open.',
                ],
                [
                  'AccordionContent',
                  '<div>',
                  'The collapsible body. Animates height on open/close.',
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

        <Code>{`import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/base/Accordion/Accordion'`}</Code>
      </Section>

      {/* Modes */}
      <Section
        title="Modes"
        description="The type prop controls how many items can be open at once."
      >
        <SubSection
          title="Single"
          description="Only one item can be open at a time. Add collapsible to allow closing the open item."
        >
          <div className="flex items-start gap-4 mb-4 p-4 border border-gray-100 rounded-lg">
            <div className="w-48 shrink-0 text-xs">
              <p className="font-mono text-violet-700 mb-1">type="single"</p>
              <p className="text-gray-400 leading-relaxed">
                Opening a new item closes the previous one. Cannot close the open item.
              </p>
            </div>
            <div className="flex-1">
              <Accordion type="single">
                <AccordionItem value="s1">
                  <AccordionTrigger>Item 1</AccordionTrigger>
                  <AccordionContent>Content for item 1.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="s2">
                  <AccordionTrigger>Item 2</AccordionTrigger>
                  <AccordionContent>Content for item 2.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          <div className="flex items-start gap-4 mb-4 p-4 border border-gray-100 rounded-lg">
            <div className="w-48 shrink-0 text-xs">
              <p className="font-mono text-violet-700 mb-1">type="single" collapsible</p>
              <p className="text-gray-400 leading-relaxed">
                Same as above, but clicking the open trigger closes it.
              </p>
            </div>
            <div className="flex-1">
              <Accordion type="single" collapsible>
                <AccordionItem value="c1">
                  <AccordionTrigger>Item 1</AccordionTrigger>
                  <AccordionContent>Content for item 1.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="c2">
                  <AccordionTrigger>Item 2</AccordionTrigger>
                  <AccordionContent>Content for item 2.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </SubSection>

        <SubSection
          title="Multiple"
          description="Any number of items can be open simultaneously. Each toggles independently."
        >
          <Preview>
            <Accordion type="multiple">
              <AccordionItem value="m1">
                <AccordionTrigger>Item 1</AccordionTrigger>
                <AccordionContent>Content for item 1.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="m2">
                <AccordionTrigger>Item 2</AccordionTrigger>
                <AccordionContent>Content for item 2.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="m3">
                <AccordionTrigger>Item 3</AccordionTrigger>
                <AccordionContent>Content for item 3.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </Preview>
        </SubSection>
      </Section>

      {/* Default Open */}
      <Section
        title="Default Open"
        description="Use defaultValue to pre-open one or more items on mount. For single mode, pass a string. For multiple mode, pass an array."
      >
        <SubSection title="Single — defaultValue">
          <Preview>
            <Accordion type="single" collapsible defaultValue="item-2">
              <AccordionItem value="item-1">
                <AccordionTrigger>Personal Information</AccordionTrigger>
                <AccordionContent>Update your name and email.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Notification Preferences</AccordionTrigger>
                <AccordionContent>Choose your notification channels.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Security & Privacy</AccordionTrigger>
                <AccordionContent>Manage your password.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </Preview>
          <Code>{`<Accordion type="single" collapsible defaultValue="item-2">
  <AccordionItem value="item-1">...</AccordionItem>
  <AccordionItem value="item-2">...</AccordionItem>  {/* opens on mount */}
  <AccordionItem value="item-3">...</AccordionItem>
</Accordion>`}</Code>
        </SubSection>

        <SubSection title="Multiple — defaultValue array">
          <Preview>
            <Accordion type="multiple" defaultValue={['item-1', 'item-3']}>
              <AccordionItem value="item-1">
                <AccordionTrigger>Personal Information</AccordionTrigger>
                <AccordionContent>Update your name and email.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Notification Preferences</AccordionTrigger>
                <AccordionContent>Choose your notification channels.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Security & Privacy</AccordionTrigger>
                <AccordionContent>Manage your password.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </Preview>
          <Code>{`<Accordion type="multiple" defaultValue={['item-1', 'item-3']}>
  <AccordionItem value="item-1">...</AccordionItem>  {/* open */}
  <AccordionItem value="item-2">...</AccordionItem>
  <AccordionItem value="item-3">...</AccordionItem>  {/* open */}
</Accordion>`}</Code>
        </SubSection>
      </Section>

      {/* Disabled */}
      <Section
        title="Disabled"
        description="Pass disabled on AccordionItem to prevent that item from being toggled. The trigger is non-interactive and visually dimmed."
      >
        <Preview>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Personal Information</AccordionTrigger>
              <AccordionContent>Update your name and email.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" disabled>
              <AccordionTrigger>Notification Preferences</AccordionTrigger>
              <AccordionContent>Choose your notification channels.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Security & Privacy</AccordionTrigger>
              <AccordionContent>Manage your password.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </Preview>
        <Code>{`<AccordionItem value="item-2" disabled>
  <AccordionTrigger>Notification Preferences</AccordionTrigger>
  <AccordionContent>...</AccordionContent>
</AccordionItem>`}</Code>
      </Section>

      {/* Props */}
      <Section title="Props">
        {[
          {
            name: 'Accordion',
            rows: [
              [
                'variant',
                '"default" | "card"',
                '"default"',
                'Visual style. default uses border-bottom separators; card wraps each item in a bordered, rounded box.',
              ],
              [
                'type',
                '"single" | "multiple"',
                '—',
                'Required. Controls how many items can be open at once.',
              ],
              [
                'collapsible',
                'boolean',
                'false',
                'Single mode only — allows closing the open item by clicking its trigger.',
              ],
              [
                'defaultValue',
                'string | string[]',
                '—',
                'Uncontrolled initial open item(s). String for single, array for multiple.',
              ],
              [
                'value',
                'string | string[]',
                '—',
                'Controlled open item(s). Pair with onValueChange.',
              ],
              ['onValueChange', '(value) => void', '—', 'Callback fired when open items change.'],
              ['className', 'string', '—', 'Additional Tailwind classes.'],
            ],
          },
          {
            name: 'AccordionItem',
            rows: [
              [
                'value',
                'string',
                '—',
                'Required. Unique identifier used by Accordion to track open state.',
              ],
              ['disabled', 'boolean', 'false', 'Prevents the item from being opened or closed.'],
              ['className', 'string', '—', 'Additional Tailwind classes.'],
            ],
          },
          {
            name: 'AccordionTrigger',
            rows: [
              ['children', 'ReactNode', '—', 'Trigger label text or content.'],
              [
                'className',
                'string',
                '—',
                'Additional Tailwind classes applied to the trigger button.',
              ],
            ],
          },
          {
            name: 'AccordionContent',
            rows: [
              ['children', 'ReactNode', '—', 'Body content rendered when the item is open.'],
              [
                'className',
                'string',
                '—',
                'Additional Tailwind classes applied to the inner content div.',
              ],
            ],
          },
        ].map(({ name, rows }) => (
          <SubSection key={name} title={name}>
            <div className="overflow-x-auto mb-2">
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
                      <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500">
                        {type}
                      </td>
                      <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400 whitespace-nowrap">
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
        ))}
      </Section>

      {/* Usage Examples */}
      <Section title="Usage Examples" description="Copy-ready code for common scenarios.">
        <SubSection title="FAQ / Help Section">
          <Code>{`<Accordion type="single" collapsible>
  <AccordionItem value="q1">
    <AccordionTrigger>How do I reset my password?</AccordionTrigger>
    <AccordionContent>
      Go to Settings → Security and click "Change password".
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="q2">
    <AccordionTrigger>How do I export my data?</AccordionTrigger>
    <AccordionContent>
      Navigate to Settings → Data and click "Export all data".
    </AccordionContent>
  </AccordionItem>
</Accordion>`}</Code>
        </SubSection>

        <SubSection title="Settings Page">
          <Code>{`<Accordion type="multiple" defaultValue={['profile']}>
  <AccordionItem value="profile">
    <AccordionTrigger>Profile</AccordionTrigger>
    <AccordionContent>
      <ProfileForm />
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="notifications">
    <AccordionTrigger>Notifications</AccordionTrigger>
    <AccordionContent>
      <NotificationSettings />
    </AccordionContent>
  </AccordionItem>
</Accordion>`}</Code>
        </SubSection>

        <SubSection title="Controlled">
          <Code>{`const [open, setOpen] = useState('')

<Accordion type="single" collapsible value={open} onValueChange={setOpen}>
  <AccordionItem value="item-1">
    <AccordionTrigger>Item 1</AccordionTrigger>
    <AccordionContent>Content 1</AccordionContent>
  </AccordionItem>
</Accordion>`}</Code>
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
                <div className="mb-3">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="d1">
                      <AccordionTrigger>How do I reset my password?</AccordionTrigger>
                      <AccordionContent>Go to Settings → Security.</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="d2">
                      <AccordionTrigger>How do I export my data?</AccordionTrigger>
                      <AccordionContent>Navigate to Settings → Data.</AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                <p className="text-xs text-green-800">
                  Use <code className="font-mono bg-green-100 px-1 rounded">collapsible</code> on{' '}
                  <code className="font-mono bg-green-100 px-1 rounded">type="single"</code> so
                  users can close any open section.
                </p>
              </div>

              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <p className="text-xs text-green-800">
                  Use <code className="font-mono bg-green-100 px-1 rounded">type="multiple"</code>{' '}
                  when users may need to compare content across sections simultaneously.
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
                <p className="text-xs text-red-800">
                  Don't use accordion for critical content that must always be visible — collapsed
                  content is easy to miss.
                </p>
              </div>

              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <p className="text-xs text-red-800">
                  Don't nest accordions — deeply nested collapsible sections create confusing
                  navigation and poor UX.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  ),
}
