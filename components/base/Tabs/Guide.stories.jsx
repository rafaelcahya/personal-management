import { LayoutDashboard, BarChart2, Settings } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Tabs',
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
  <div className="flex flex-col gap-3 p-6 bg-gray-50 border border-gray-200 rounded-lg mb-3">
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
          <h1 className="text-3xl font-bold text-gray-900">Tabs</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A tab navigation component for switching between content panels. Supports two visual
          variants (underline with animated indicator, pill), two orientations (horizontal,
          vertical), icon support, keyboard navigation, and controlled/uncontrolled modes.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          Tabs manages active state via React Context. The{' '}
          <code className="font-mono text-xs bg-gray-100 px-1 rounded">underline</code> variant
          renders an animated sliding indicator that moves to the active tab. The{' '}
          <code className="font-mono text-xs bg-gray-100 px-1 rounded">pill</code> variant gives
          active tabs a white rounded background. Both support keyboard navigation following the
          WAI-ARIA tabs pattern.
        </p>
        <Preview>
          <Tabs defaultValue="overview">
            <TabsList variant="underline">
              <TabsTrigger value="overview" icon={LayoutDashboard}>
                Overview
              </TabsTrigger>
              <TabsTrigger value="trades" icon={BarChart2}>
                Trades
              </TabsTrigger>
              <TabsTrigger value="settings" icon={Settings}>
                Settings
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="pt-4">
              <p className="text-sm text-gray-500">Overview panel content.</p>
            </TabsContent>
            <TabsContent value="trades" className="pt-4">
              <p className="text-sm text-gray-500">Trades panel content.</p>
            </TabsContent>
            <TabsContent value="settings" className="pt-4">
              <p className="text-sm text-gray-500">Settings panel content.</p>
            </TabsContent>
          </Tabs>
        </Preview>
      </Section>

      {/* Anatomy */}
      <Section title="Anatomy">
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wide mb-1">
              Structure
            </span>

            {/* Root: Tabs */}
            <div className="relative p-4 border-2 border-dashed border-violet-400 rounded-xl">
              <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-[10px] font-mono font-semibold text-violet-600">
                Tabs
              </span>

              {/* TabsList */}
              <div className="relative p-3 border border-dashed border-violet-300 rounded-lg mb-2">
                <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-violet-500">
                  TabsList
                </span>
                <div className="mt-1 flex gap-2 flex-wrap">
                  {['TabsTrigger', 'TabsTrigger', 'TabsTrigger (disabled)'].map((t) => (
                    <div
                      key={t}
                      className="px-3 py-1.5 bg-white border border-gray-200 rounded text-xs text-gray-500 whitespace-nowrap"
                    >
                      {t}
                    </div>
                  ))}
                </div>
              </div>

              {/* TabsContent */}
              {['TabsContent (active — rendered)', 'TabsContent (inactive — null)'].map((t) => (
                <div
                  key={t}
                  className="relative p-2 border border-dashed border-blue-300 rounded-lg mb-1"
                >
                  <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-blue-500">
                    {t}
                  </span>
                  <div className="mt-0.5 text-[10px] text-gray-400 font-mono">children</div>
                </div>
              ))}
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
                  'Tabs',
                  '<div> (Context Root)',
                  'Root. Manages active value and orientation via Context.',
                ],
                [
                  'TabsList',
                  '<div role="tablist">',
                  'Tab button container. Handles keyboard navigation and renders the underline indicator.',
                ],
                [
                  'TabsTrigger',
                  '<button role="tab">',
                  'Individual tab button. Reads active state from context. Supports icon and disabled.',
                ],
                [
                  'TabsContent',
                  '<div role="tabpanel">',
                  'Content panel for a given value. Renders only when its value matches the active value.',
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

        <Code>{`<Tabs defaultValue="overview">
  <TabsList variant="underline">
    <TabsTrigger value="overview" icon={LayoutDashboard}>Overview</TabsTrigger>
    <TabsTrigger value="trades">Trades</TabsTrigger>
    <TabsTrigger value="settings" disabled>Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="overview"><OverviewPanel /></TabsContent>
  <TabsContent value="trades"><TradesPanel /></TabsContent>
  <TabsContent value="settings"><SettingsPanel /></TabsContent>
</Tabs>`}</Code>
      </Section>

      {/* Usage */}
      <Section title="Usage">
        <SubSection title="Import">
          <Code>{`import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/base/Tabs/Tabs'`}</Code>
        </SubSection>

        <SubSection title="Uncontrolled">
          <Code>{`<Tabs defaultValue="overview">
  <TabsList variant="underline">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="trades">Trades</TabsTrigger>
  </TabsList>
  <TabsContent value="overview"><p>Overview</p></TabsContent>
  <TabsContent value="trades"><p>Trades</p></TabsContent>
</Tabs>`}</Code>
        </SubSection>

        <SubSection title="Controlled">
          <Code>{`const [tab, setTab] = useState('overview')

<Tabs value={tab} onValueChange={setTab}>
  <TabsList variant="pill">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="trades">Trades</TabsTrigger>
  </TabsList>
  <TabsContent value="overview"><p>Overview</p></TabsContent>
  <TabsContent value="trades"><p>Trades</p></TabsContent>
</Tabs>`}</Code>
        </SubSection>

        <SubSection title="Vertical">
          <Code>{`<Tabs defaultValue="overview" orientation="vertical">
  <TabsList variant="pill">
    <TabsTrigger value="overview" icon={LayoutDashboard}>Overview</TabsTrigger>
    <TabsTrigger value="trades" icon={BarChart2}>Trades</TabsTrigger>
  </TabsList>
  <TabsContent value="overview" className="pl-6"><p>Overview</p></TabsContent>
  <TabsContent value="trades" className="pl-6"><p>Trades</p></TabsContent>
</Tabs>`}</Code>
        </SubSection>

        <SubSection title="Sizes">
          <Code>{`{/* xs */}
<TabsList variant="underline" size="xs">...</TabsList>

{/* sm */}
<TabsList variant="underline" size="sm">...</TabsList>

{/* md (default) */}
<TabsList variant="underline" size="md">...</TabsList>

{/* lg */}
<TabsList variant="underline" size="lg">...</TabsList>

{/* xl */}
<TabsList variant="underline" size="xl">...</TabsList>`}</Code>
        </SubSection>
      </Section>

      {/* Keyboard navigation */}
      <Section title="Keyboard Navigation">
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          Tabs follow the WAI-ARIA tabs pattern. Arrow keys move focus between tabs; disabled tabs
          are skipped. The focused tab is activated immediately on focus.
        </p>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {['Key', 'Action'].map((h) => (
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
                ['← / →', 'Move focus to previous / next tab (horizontal orientation)'],
                ['↑ / ↓', 'Move focus to previous / next tab (vertical orientation)'],
                ['Home', 'Move focus to the first non-disabled tab'],
                ['End', 'Move focus to the last non-disabled tab'],
                ['Enter / Space', 'Activate the focused tab'],
                ['Tab', 'Move focus out of the tab list to the tab panel'],
              ].map(([key, action]) => (
                <tr key={key} className="even:bg-gray-50">
                  <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                    {key}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">
                    {action}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Best Practices */}
      <Section title="Best Practices">
        <div className="flex flex-col gap-8">
          {[
            {
              heading: 'When to use',
              items: [
                {
                  title: 'Use for 2–5 peer-level content views on the same page',
                  body: "Overview, Trades, Settings — tabs work when each panel is at the same hierarchy level and only one is relevant at a time. If the views aren't peers, consider a different pattern.",
                },
                {
                  title: 'Use for compact in-page toggles without a full page reload',
                  body: 'Chart views, filter presets, data breakdowns — anywhere a user needs to switch context quickly without navigating away from the current page.',
                },
              ],
            },
            {
              heading: 'When not to use',
              items: [
                {
                  title: 'Use Sidebar / NavMenu when switching between distinct routes or pages',
                  body: 'Tabs are for in-page content only. If each tab would normally have its own URL, use proper navigation — tabs are not a substitute for routing.',
                },
                {
                  title: 'Use Accordion when sections can be open simultaneously or are optional',
                  body: 'Accordion lets users read multiple sections at once. Tabs force one active panel at a time — wrong for content users need to compare side by side.',
                },
                {
                  title: 'Use a dropdown when there are more than 5–6 options or space is limited',
                  body: 'A tab strip with 6+ items either wraps or overflows on small screens. A select dropdown scales to any number of options without layout issues.',
                },
                {
                  title: "Don't use tabs for sequential workflows",
                  body: 'A stepper communicates progression and prevents skipping steps. Tabs imply all panels are equally accessible at any time — wrong when step order matters.',
                },
              ],
            },
            {
              heading: 'Accessibility',
              items: [
                {
                  title: 'Tabs follow the WAI-ARIA tabs pattern — keyboard navigation is built in',
                  body: '← → (horizontal) or ↑ ↓ (vertical) move focus between tabs. Disabled tabs are skipped. Tab key moves focus to the active panel. No manual ARIA attributes needed.',
                },
                {
                  title: 'Keep labels short and grammatically parallel',
                  body: 'Use 1–2 word nouns: "Overview", "Trades", "Settings". Avoid verbs or inconsistent lengths. Parallel grammar makes the tab list scannable and screen-reader-friendly.',
                },
                {
                  title: 'Keep tab count between 2 and 5',
                  body: 'Fewer than 2 tabs is a plain section — no navigation needed. More than 5 creates scanning overhead for sighted and keyboard users alike.',
                },
              ],
            },
            {
              heading: 'Advice',
              items: [
                {
                  title: 'Set defaultValue to the most important panel, not the first in the list',
                  body: "The first panel sets the user's mental model of the feature. Default to the highest-value or most-used panel. Non-default tabs are frequently missed on first visit.",
                },
                {
                  title: 'Match variant to context',
                  body: 'Use underline for primary page-level navigation (detail page, settings). Use pill inside cards, sidebars, or any surface with a background — pill reads better against contained backgrounds.',
                },
                {
                  title: 'Match size to density',
                  body: 'Use sm inside dense panels or compact containers. Use md (default) for most contexts. Use lg only for prominent top-level navigation where the tab strip needs visual weight.',
                },
                {
                  title: 'Apply icons consistently — all or none',
                  body: 'If one tab has an icon, every tab in the same list should have one. Mixed icon/no-icon triggers create uneven spacing and draw unintended attention to icon-less items.',
                },
                {
                  title: "Don't nest Tabs inside another Tabs without clear scope separation",
                  body: 'Nested tabs create orientation confusion and make keyboard navigation hard to follow. Only nest when the two levels have visually and semantically distinct scopes.',
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

      {/* API Reference */}
      <Section title="API Reference">
        <SubSection
          title="Tabs"
          description="Root component. Manages active value and orientation."
        >
          <div className="overflow-x-auto mb-6">
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
                {[
                  [
                    'defaultValue',
                    'string',
                    "''",
                    'The initially active tab value (uncontrolled).',
                  ],
                  ['value', 'string', '—', 'Controlled active tab value.'],
                  [
                    'onValueChange',
                    '(value: string) => void',
                    '—',
                    'Called when the active tab changes.',
                  ],
                  [
                    'orientation',
                    "'horizontal' | 'vertical'",
                    "'horizontal'",
                    'Layout direction. Affects arrow key navigation and TabsList border.',
                  ],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
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

        <SubSection
          title="TabsList"
          description="Tab button container. Handles keyboard navigation."
        >
          <div className="overflow-x-auto mb-6">
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
                {[
                  [
                    'variant',
                    "'underline' | 'pill'",
                    "'underline'",
                    'Visual style. underline: animated line indicator. pill: white rounded background on active tab.',
                  ],
                  [
                    'size',
                    "'xs' | 'sm' | 'md' | 'lg' | 'xl'",
                    "'md'",
                    'Controls the padding and font size of all triggers in this list.',
                  ],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
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

        <SubSection title="TabsTrigger" description="Individual tab button.">
          <div className="overflow-x-auto mb-6">
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
                {[
                  [
                    'value',
                    'string',
                    '—',
                    'The value this trigger activates. Must match a TabsContent value.',
                  ],
                  ['icon', 'LucideIcon', '—', 'Optional leading icon rendered before the label.'],
                  [
                    'disabled',
                    'boolean',
                    'false',
                    'Disables the tab. Disabled tabs are skipped during keyboard navigation.',
                  ],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
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

        <SubSection
          title="TabsContent"
          description="Content panel — renders only when its value is active."
        >
          <div className="overflow-x-auto mb-6">
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
                {[
                  [
                    'value',
                    'string',
                    '—',
                    'The value this panel belongs to. Renders only when Tabs activeValue matches.',
                  ],
                  ['className', 'string', '—', 'Extra classes applied to the panel wrapper.'],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
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
