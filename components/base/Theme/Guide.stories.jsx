'use client'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Theme/Overview' }
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
    blue: 'bg-blue-100 text-blue-700',
  }
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-medium ${colors[color]}`}
    >
      {children}
    </span>
  )
}

const TokenRow = ({ name, light, dark, description }) => (
  <tr className="even:bg-gray-50">
    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
      {name}
    </td>
    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-600 whitespace-nowrap">
      {light}
    </td>
    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-600 whitespace-nowrap">
      {dark}
    </td>
    <td className="px-3 py-2 border border-gray-200 text-xs text-gray-600">{description}</td>
  </tr>
)

const TableHead = ({ cols }) => (
  <thead>
    <tr className="bg-gray-50">
      {cols.map((h) => (
        <th
          key={h}
          className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700 text-xs uppercase tracking-wide"
        >
          {h}
        </th>
      ))}
    </tr>
  </thead>
)

// ─── Story ────────────────────────────────────────────────────────────────────

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="p-8 max-w-4xl font-sans text-gray-900">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Theme System</h1>
          <Tag color="blue">Design Tokens</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A dual-layer CSS variable system that powers light/dark mode and color scheme variants
          across all base components. Built on an OKLCH palette — all components respond to theme
          changes automatically via semantic tokens.
        </p>
        <div className="flex gap-2 mt-3">
          {[
            { label: 'Default Light', cls: '' },
            { label: 'Default Dark', cls: 'dark' },
            { label: 'Violet Light', cls: 'violet' },
            { label: 'Violet Dark', cls: 'violet dark' },
          ].map(({ label, cls }) => (
            <span
              key={label}
              className="inline-block px-2 py-0.5 rounded text-xs font-mono font-medium bg-gray-100 text-gray-600"
            >
              {cls || '(none)'}
            </span>
          ))}
        </div>
      </div>

      {/* Architecture */}
      <Section title="Architecture">
        <p className="text-sm text-gray-600 mb-5 leading-relaxed">
          All semantic tokens are defined in{' '}
          <code className="font-mono text-xs bg-gray-100 px-1 rounded">app/globals.css</code> using
          OKLCH — a perceptually-uniform color space where equal step differences look equally
          different to the eye. The raw palette lives in{' '}
          <code className="font-mono text-xs bg-gray-100 px-1 rounded">app/tokens.css</code>.
          Semantic tokens reference palette tokens, and components reference semantic tokens.
        </p>

        <div className="flex flex-col gap-2 mb-5">
          {[
            {
              label: 'tokens.css',
              desc: 'Raw OKLCH palette — black-950, slate-200, green-400, etc. Never used directly in components.',
              tag: 'Palette',
            },
            {
              label: 'globals.css',
              desc: 'Semantic tokens — --color-background, --color-primary, --color-border. Values change per theme.',
              tag: 'Semantic',
            },
            {
              label: 'components',
              desc: 'Use Tailwind semantic classes — bg-background, text-foreground, border-border. Always theme-aware.',
              tag: 'Usage',
            },
          ].map(({ label, desc, tag }, i) => (
            <div key={label} className="flex items-start gap-3">
              <div className="flex flex-col items-center shrink-0">
                <div className="size-6 rounded-full bg-violet-100 text-violet-700 text-[10px] font-bold flex items-center justify-center">
                  {i + 1}
                </div>
                {i < 2 && <div className="w-px h-4 bg-gray-200 mt-1" />}
              </div>
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-2 mb-0.5">
                  <code className="font-mono text-xs text-violet-700">{label}</code>
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 rounded font-medium">
                    {tag}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <Code>{`/* app/tokens.css — raw palette */
--color-black-950: oklch(0.085 0 0);
--color-slate-200: oklch(0.929 0.013 255);

/* app/globals.css — semantic tokens reference palette */
:root {
  --color-background: var(--color-white);
  --color-foreground: var(--color-slate-950);
  --color-primary:    var(--color-black-900);
}

.dark {
  --color-background: var(--color-black-950);
  --color-foreground: var(--color-white-50);
  --color-primary:    var(--color-white-50);
}

/* components — use Tailwind semantic classes */
<div className="bg-background text-foreground" />
<button className="bg-primary text-primary-foreground" />`}</Code>
      </Section>

      {/* Palette */}
      <Section
        title="Token Palette"
        description="app/tokens.css — the raw color scale. Never use palette tokens directly in components; always go through semantic tokens."
      >
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            {
              title: 'Black scale',
              desc: 'Pure neutral, zero chroma. Used for dark mode surfaces.',
              swatches: [
                { name: '950', bg: 'oklch(0.085 0 0)', label: 'bg' },
                { name: '900', bg: 'oklch(0.130 0 0)', label: 'card' },
                { name: '800', bg: 'oklch(0.198 0 0)', label: 'muted' },
                { name: '700', bg: 'oklch(0.291 0 0)', label: 'accent' },
                { name: '600', bg: 'oklch(0.395 0 0)', label: '' },
                { name: '900', bg: 'oklch(0.130 0 0)', label: 'primary (light)' },
              ],
            },
            {
              title: 'White scale',
              desc: 'Pure neutral, zero chroma. Used for dark mode text and primary.',
              swatches: [
                { name: '50', bg: 'oklch(0.995 0 0)', label: 'fg / primary (dark)' },
                { name: '400', bg: 'oklch(0.955 0 0)', label: '' },
                { name: '700', bg: 'oklch(0.883 0 0)', label: '' },
                { name: '900', bg: 'oklch(0.805 0 0)', label: '' },
                { name: '950', bg: 'oklch(0.755 0 0)', label: 'muted-fg (dark)' },
              ],
            },
            {
              title: 'Slate scale',
              desc: 'Blue-gray tint. Used for light mode UI chrome and surfaces.',
              swatches: [
                { name: '50', bg: 'oklch(0.984 0.003 247)', label: 'fg (dark via HSL)' },
                { name: '100', bg: 'oklch(0.968 0.007 247)', label: 'muted / accent' },
                { name: '200', bg: 'oklch(0.929 0.013 255)', label: 'border / input' },
                { name: '400', bg: 'oklch(0.704 0.040 256)', label: 'muted-fg (light)' },
                { name: '500', bg: 'oklch(0.610 0.049 257)', label: '' },
                { name: '950', bg: 'oklch(0.132 0.028 261)', label: 'foreground' },
              ],
            },
          ].map(({ title, desc, swatches }) => (
            <div key={title}>
              <p className="text-xs font-semibold text-gray-700 mb-1">{title}</p>
              <p className="text-[10px] text-gray-400 mb-2 leading-snug">{desc}</p>
              <div className="flex flex-col gap-1">
                {swatches.map(({ name, bg, label }) => (
                  <div key={name + bg} className="flex items-center gap-2">
                    <div
                      className="w-6 h-4 rounded shrink-0 border border-black/10"
                      style={{ background: bg }}
                    />
                    <span className="font-mono text-[10px] text-gray-500 w-7 shrink-0">{name}</span>
                    {label && <span className="text-[10px] text-gray-400 truncate">{label}</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Code>{`/* app/tokens.css — OKLCH palette */
--color-black-950: oklch(0.085 0 0);   /* near-black */
--color-black-900: oklch(0.130 0 0);
--color-black-800: oklch(0.198 0 0);
--color-black-700: oklch(0.291 0 0);

--color-white-50:  oklch(0.995 0 0);   /* near-white */
--color-white-950: oklch(0.755 0 0);

--color-slate-950: oklch(0.132 0.028 261);
--color-slate-500: oklch(0.610 0.049 257);
--color-slate-200: oklch(0.929 0.013 255);
--color-slate-100: oklch(0.968 0.007 247);`}</Code>
      </Section>

      {/* Semantic tokens */}
      <Section
        title="Semantic Token Reference"
        description="These are the tokens components actually use. Values change between modes — components stay the same."
      >
        <SubSection title="Surfaces">
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <TableHead cols={['Token', 'Light', 'Dark', 'Usage']} />
              <tbody>
                <TokenRow
                  name="--color-background"
                  light="white"
                  dark="black-950"
                  description="Page background — outermost layer"
                />
                <TokenRow
                  name="--color-card"
                  light="white"
                  dark="black-900"
                  description="Card surface — sits above background"
                />
                <TokenRow
                  name="--color-popover"
                  light="white"
                  dark="black-800"
                  description="Floating surfaces — dropdowns, tooltips, modals"
                />
                <TokenRow
                  name="--color-foreground"
                  light="slate-950"
                  dark="white-50"
                  description="Primary text on background"
                />
                <TokenRow
                  name="--color-card-foreground"
                  light="slate-950"
                  dark="white-50"
                  description="Primary text on card surface"
                />
                <TokenRow
                  name="--color-popover-foreground"
                  light="slate-950"
                  dark="white-50"
                  description="Primary text on popover surface"
                />
              </tbody>
            </table>
          </div>
        </SubSection>

        <SubSection title="Brand">
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <TableHead cols={['Token', 'Light', 'Dark', 'Usage']} />
              <tbody>
                <TokenRow
                  name="--color-primary"
                  light="black-900"
                  dark="white-50"
                  description="Primary action color — buttons, active states. Flips in dark mode."
                />
                <TokenRow
                  name="--color-primary-foreground"
                  light="slate-50"
                  dark="black-950"
                  description="Text on primary background"
                />
                <TokenRow
                  name="--color-secondary"
                  light="slate-100"
                  dark="black-800"
                  description="Secondary surfaces"
                />
                <TokenRow
                  name="--color-secondary-foreground"
                  light="slate-800"
                  dark="white-950"
                  description="Text on secondary background"
                />
                <TokenRow
                  name="--color-ring"
                  light="black-900"
                  dark="white-50"
                  description="Focus ring color — matches primary"
                />
              </tbody>
            </table>
          </div>
        </SubSection>

        <SubSection title="UI Chrome">
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <TableHead cols={['Token', 'Light', 'Dark', 'Usage']} />
              <tbody>
                <TokenRow
                  name="--color-muted"
                  light="slate-100"
                  dark="black-800"
                  description="Muted surface — badges, code blocks, empty states"
                />
                <TokenRow
                  name="--color-muted-foreground"
                  light="slate-500"
                  dark="white-950"
                  description="Secondary/helper text, placeholders, timestamps"
                />
                <TokenRow
                  name="--color-accent"
                  light="slate-100"
                  dark="black-700"
                  description="Hover surface — slightly above muted in dark mode"
                />
                <TokenRow
                  name="--color-accent-foreground"
                  light="slate-950"
                  dark="white-50"
                  description="Text on accent/hover background"
                />
                <TokenRow
                  name="--color-border"
                  light="slate-200"
                  dark="oklch(0.20)"
                  description="Dividers, card borders, input outlines. Intentionally subtle in dark mode."
                />
                <TokenRow
                  name="--color-input"
                  light="slate-200"
                  dark="black-800"
                  description="Input field border color"
                />
              </tbody>
            </table>
          </div>
        </SubSection>

        <SubSection title="Feedback">
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <TableHead cols={['Token', 'Light', 'Dark', 'Usage']} />
              <tbody>
                <TokenRow
                  name="--color-destructive"
                  light="red-500"
                  dark="red-400"
                  description="Error / danger. Lighter in dark for readability on dark bg."
                />
                <TokenRow
                  name="--color-destructive-subtle"
                  light="red-50"
                  dark="red-950"
                  description="Error surface background"
                />
                <TokenRow
                  name="--color-destructive-subtle-foreground"
                  light="red-600"
                  dark="red-400"
                  description="Text on error surface"
                />
                <TokenRow
                  name="--color-success"
                  light="green-600"
                  dark="green-400"
                  description="Success / positive"
                />
                <TokenRow
                  name="--color-success-subtle"
                  light="green-50"
                  dark="green-950"
                  description="Success surface background"
                />
                <TokenRow
                  name="--color-success-subtle-foreground"
                  light="green-700"
                  dark="green-400"
                  description="Text on success surface"
                />
                <TokenRow
                  name="--color-warning"
                  light="amber-500"
                  dark="amber-400"
                  description="Warning / caution"
                />
                <TokenRow
                  name="--color-warning-subtle"
                  light="amber-50"
                  dark="amber-950"
                  description="Warning surface background"
                />
                <TokenRow
                  name="--color-warning-subtle-foreground"
                  light="amber-700"
                  dark="amber-400"
                  description="Text on warning surface"
                />
                <TokenRow
                  name="--color-info"
                  light="blue-500"
                  dark="blue-400"
                  description="Informational"
                />
                <TokenRow
                  name="--color-info-subtle"
                  light="blue-50"
                  dark="blue-950"
                  description="Info surface background"
                />
                <TokenRow
                  name="--color-info-subtle-foreground"
                  light="blue-700"
                  dark="blue-400"
                  description="Text on info surface"
                />
              </tbody>
            </table>
          </div>
        </SubSection>

        <SubSection title="Shadow">
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <TableHead cols={['Token', 'Light', 'Dark', 'Usage']} />
              <tbody>
                <TokenRow
                  name="--shadow-card"
                  light="0 1px 3px oklch(slate / 0.05)"
                  dark="none"
                  description="Card elevation. Subtle slate-tinted shadow in light; suppressed in dark — depth comes from layered black surfaces instead."
                />
              </tbody>
            </table>
          </div>
        </SubSection>
      </Section>

      {/* How to use */}
      <Section title="How to Use Tokens in Components">
        <SubSection
          title="Tailwind utility classes"
          description="Use the semantic token names directly as Tailwind class suffixes. These read the HSL bridge variables."
        >
          <Code>{`{/* Surfaces */}
<div className="bg-background text-foreground" />
<div className="bg-card text-card-foreground" />
<div className="bg-popover text-popover-foreground" />

{/* Brand */}
<button className="bg-primary text-primary-foreground" />
<div className="ring-2 ring-ring" />

{/* UI Chrome */}
<p className="text-muted-foreground" />
<div className="bg-muted" />
<div className="hover:bg-accent hover:text-accent-foreground" />
<div className="border border-border" />

{/* Feedback */}
<div className="bg-destructive text-destructive-foreground" />
<div className="bg-success-subtle text-success-subtle-foreground" />
<div className="text-warning" />

{/* Opacity modifier — works with all semantic tokens */}
<div className="bg-primary/10 text-primary" />
<div className="border-success/20 bg-success-subtle" />`}</Code>
        </SubSection>

        <SubSection
          title="Direct CSS variable — when Tailwind classes aren't enough"
          description="SVG fills, gradients, and color-mix need direct var() access."
        >
          <Code>{`{/* Arbitrary Tailwind value */}
<div className="[box-shadow:var(--shadow-card)]" />

{/* Inline style — SVG fills, gradients */}
<circle style={{ fill: 'var(--color-primary)' }} />
<div style={{ background: 'color-mix(in oklch, var(--color-background) 85%, transparent)' }} />`}</Code>
        </SubSection>

        <SubSection
          title="What NOT to use"
          description="Avoid hardcoded palette classes in base components — they break in dark mode."
        >
          <Code>{`{/* ❌ Hardcoded — breaks in dark mode */}
<div className="bg-white text-slate-900 border-slate-200" />
<button className="bg-black text-white" />
<p className="text-gray-500" />

{/* ✅ Semantic — responds to theme */}
<div className="bg-card text-card-foreground border-border" />
<button className="bg-primary text-primary-foreground" />
<p className="text-muted-foreground" />`}</Code>
        </SubSection>
      </Section>

      {/* Color Scheme Variants */}
      <Section title="Color Scheme Variants">
        <p className="text-sm text-gray-600 mb-5 leading-relaxed">
          Color schemes add a second axis to the theme system — independent from brightness. The{' '}
          <code className="font-mono text-xs bg-gray-100 px-1 rounded">violet</code> class on{' '}
          <code className="font-mono text-xs bg-gray-100 px-1 rounded">&lt;html&gt;</code> activates
          the violet scheme. Combined with{' '}
          <code className="font-mono text-xs bg-gray-100 px-1 rounded">dark</code>, four states are
          possible:
        </p>

        <div className="overflow-x-auto mb-5">
          <table className="w-full text-sm border-collapse">
            <TableHead cols={['Class on <html>', 'State', 'Primary', 'Accent']} />
            <tbody>
              {[
                {
                  cls: '(none)',
                  state: 'Default Light',
                  primary: 'black-900',
                  accent: 'slate-100',
                },
                { cls: 'dark', state: 'Default Dark', primary: 'white-50', accent: 'black-700' },
                {
                  cls: 'violet',
                  state: 'Violet Light',
                  primary: 'violet-600',
                  accent: 'violet-100',
                },
                {
                  cls: 'violet dark',
                  state: 'Violet Dark',
                  primary: 'violet-400',
                  accent: 'violet-950',
                },
              ].map(({ cls, state, primary, accent }) => (
                <tr key={state} className="even:bg-gray-50">
                  <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                    {cls}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-xs text-gray-600">
                    {state}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-600">
                    {primary}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-600">
                    {accent}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <SubSection title="Token overrides">
          <p className="text-xs text-gray-500 mb-3 leading-relaxed">
            Only 4 tokens change between default and violet — surfaces, feedback, and muted stay
            identical. This minimises the override surface and ensures components only need to use
            semantic tokens to be automatically scheme-aware.
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <TableHead cols={['Token', 'Default Light', 'Violet Light', 'Violet Dark']} />
              <tbody>
                {[
                  {
                    name: '--color-primary',
                    def: 'black-900',
                    vl: 'violet-600',
                    vd: 'violet-400',
                    note: 'Brand action — buttons, active states',
                  },
                  {
                    name: '--color-primary-foreground',
                    def: 'slate-50',
                    vl: 'slate-50',
                    vd: 'white',
                    note: 'Text on primary bg — white in violet dark',
                  },
                  {
                    name: '--color-ring',
                    def: 'black-900',
                    vl: 'violet-700',
                    vd: 'violet-400',
                    note: 'Focus ring — always matches primary hue',
                  },
                  {
                    name: '--color-accent',
                    def: 'slate-100',
                    vl: 'violet-100',
                    vd: 'violet-950',
                    note: 'Hover surface — tinted in violet scheme',
                  },
                  {
                    name: '--color-accent-foreground',
                    def: 'slate-950',
                    vl: 'violet-900',
                    vd: 'violet-100',
                    note: 'Text on hover surface',
                  },
                ].map(({ name, def, vl, vd, note }) => (
                  <tr key={name} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                      {name}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500">
                      {def}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-violet-600">
                      {vl}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-violet-600">
                      {vd}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-xs text-gray-500">
                      {note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SubSection>

        <SubSection title="How it works in CSS">
          <Code>{`/* app/globals.css */

/* :root — base aliases (Tailwind reads these) */
:root {
  --primary: var(--color-primary);   /* thin alias — always in sync */
  --color-primary: var(--color-black-900);
}

/* .dark — overrides only --color-* tokens */
.dark {
  --color-primary: var(--color-white-50);
}

/* .violet — overrides only violet-specific tokens */
.violet {
  --color-primary: var(--color-violet-600);
  --color-ring:    var(--color-violet-700);
  --color-accent:  var(--color-violet-100);
  --color-accent-foreground: var(--color-violet-900);
}

/* .violet.dark — higher specificity, violet dark overrides */
.violet.dark {
  --color-primary:             var(--color-violet-400);
  --color-primary-foreground:  var(--color-white);
  --color-ring:                var(--color-violet-400);
  --color-accent:              var(--color-violet-950);
  --color-accent-foreground:   var(--color-violet-100);
}`}</Code>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            Because <code className="font-mono bg-gray-100 px-1 rounded">--primary</code> is a thin
            alias to <code className="font-mono bg-gray-100 px-1 rounded">--color-primary</code>,
            Tailwind utility classes like{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">bg-primary</code> automatically
            pick up the correct value in every scheme — no per-component overrides needed.
          </p>
        </SubSection>
      </Section>

      {/* Dark mode depth */}
      <Section title="Dark Mode — Surface Depth">
        <p className="text-sm text-gray-600 mb-5 leading-relaxed">
          Dark mode uses pure neutral black scales (zero chroma — no blue tint from slate). Depth is
          communicated by stacking progressively lighter black surfaces, not by borders or shadows.
        </p>

        <div className="rounded-xl overflow-hidden border border-gray-200 mb-5">
          {[
            {
              label: 'background',
              token: 'black-950',
              oklch: '0.085',
              role: 'Page background — the floor',
            },
            {
              label: 'card',
              token: 'black-900',
              oklch: '0.130',
              role: 'Card surface — sits 1 level above background',
            },
            {
              label: 'popover / muted',
              token: 'black-800',
              oklch: '0.198',
              role: 'Floating surfaces, muted areas — 2 levels up',
            },
            {
              label: 'accent (hover)',
              token: 'black-700',
              oklch: '0.291',
              role: 'Hover state — visible lift above muted',
            },
            {
              label: 'border',
              token: 'oklch(0.20)',
              oklch: '0.200',
              role: 'Very subtle — just above muted, intentionally close',
            },
          ].map(({ label, token, oklch, role }, i) => (
            <div
              key={label}
              className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 last:border-0"
            >
              <div
                className="w-10 h-10 rounded-lg shrink-0 border border-black/10"
                style={{ background: `oklch(${oklch} 0 0)` }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-mono text-xs text-violet-700">{`--color-${label}`}</span>
                  <span className="font-mono text-[10px] text-gray-400">{token}</span>
                </div>
                <p className="text-xs text-gray-500">{role}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="font-mono text-[10px] text-gray-400">L = {oklch}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-800 leading-relaxed">
          <strong>Why black instead of slate?</strong> Slate carries a blue-gray chroma that looks
          great in light mode but competes with colored UI elements in dark mode. Pure black (zero
          chroma) lets feedback colors (red, green, amber, blue) stand out clearly without
          interference.
        </div>
      </Section>

      {/* Theme switching */}
      <Section title="Theme Switching">
        <SubSection
          title="Brightness — in the app (production)"
          description="ThemeToggle in the sidebar footer manages brightness via next-themes."
        >
          <Code>{`// app/main/components/ThemeToggle.jsx
// Uses next-themes — ThemeProvider in app/layout.tsx applies
// the 'dark' class to <html> automatically.

import { useTheme } from 'next-themes'

const { theme, setTheme } = useTheme()
setTheme('light')    // removes .dark from <html>
setTheme('dark')     // adds .dark to <html>
setTheme('system')   // follows OS preference`}</Code>

          <Code>{`// app/layout.tsx — ThemeProvider config
<ThemeProvider
  attribute="class"       // applies theme as class on <html>
  defaultTheme="light"
  enableSystem
  disableTransitionOnChange
>`}</Code>
        </SubSection>

        <SubSection
          title="Color scheme — useColorScheme hook"
          description="lib/hooks/useColorScheme.js manages the violet class on <html> and persists to localStorage."
        >
          <Code>{`// lib/hooks/useColorScheme.js
import { useColorScheme } from '@/lib/hooks/useColorScheme'

const { scheme, setScheme } = useColorScheme()
// scheme: 'default' | 'violet'

setScheme('violet')   // adds .violet to <html>, persists to localStorage
setScheme('default')  // removes .violet from <html>`}</Code>

          <p className="text-xs text-gray-500 mt-2 mb-3 leading-relaxed">
            The hook reads from localStorage on mount so the selected scheme survives page reloads.
            ThemeToggle in the sidebar renders a Default / Violet row below the brightness toggle —
            both controls are independent.
          </p>

          <Code>{`// The four class combinations on <html>:
//
//   (none)        → default light
//   dark          → default dark
//   violet        → violet light
//   violet dark   → violet dark   ← .violet.dark selector handles this
`}</Code>
        </SubSection>

        <SubSection
          title="In Storybook"
          description="The FloatingBar in Theme/Overview has two controls: a scheme toggle (Default / Violet) and a brightness toggle (Light / Dark)."
        >
          <Code>{`// FloatingBar in Overview.stories.jsx
// Scheme toggle: adds/removes 'violet' class on document.documentElement
// Brightness toggle: adds/removes 'dark' class on document.documentElement
//
// Both controls are independent — all four states are previewable.`}</Code>

          <p className="text-xs text-gray-500 mt-2">
            The addon-themes toolbar in the Storybook top-right handles brightness for individual
            component stories. For full scheme + brightness preview, use the Theme/Overview story.
          </p>
        </SubSection>
      </Section>

      {/* Best Practices */}
      <Section title="Best Practices">
        <div className="flex flex-col gap-8">
          {[
            {
              heading: 'Do',
              color: 'border-green-100 bg-green-50',
              dot: 'bg-green-500',
              titleColor: 'text-green-800',
              bodyColor: 'text-green-700',
              items: [
                {
                  title: 'Always use semantic tokens, never palette tokens',
                  body: 'text-muted-foreground, not text-slate-500. Semantic tokens respond to theme changes; palette tokens are hardcoded.',
                },
                {
                  title: 'Use opacity modifiers for tinted variants',
                  body: 'bg-primary/10 text-primary gives a tinted surface that automatically uses the right primary color in each theme.',
                },
                {
                  title: 'Use --color-* tokens in inline styles for SVG fills and gradients',
                  body: 'SVG fill and stroke cannot use Tailwind classes. Use style={{ fill: "var(--color-primary)" }} for theme-aware SVG coloring.',
                },
              ],
            },
            {
              heading: "Don't",
              color: 'border-red-100 bg-red-50',
              dot: 'bg-red-500',
              titleColor: 'text-red-800',
              bodyColor: 'text-red-700',
              items: [
                {
                  title: "Don't add raw palette variables to tailwind.config.ts",
                  body: 'tokens.css is loaded separately — no need to register them in Tailwind. Doing so creates duplication and version drift.',
                },
                {
                  title: "Don't use dark: modifier for semantic token classes",
                  body: "dark:text-white defeats the purpose of semantic tokens. If a semantic token doesn't give the right color in dark mode, fix the token definition — don't patch it per-component.",
                },
                {
                  title: "Don't hardcode colors in base components",
                  body: 'Base components are shared across all themes. A hardcoded bg-white breaks in dark mode for every consumer simultaneously.',
                },
              ],
            },
          ].map(({ heading, color, dot, titleColor, bodyColor, items }) => (
            <div key={heading}>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                {heading}
              </p>
              <div className="flex flex-col gap-3">
                {items.map(({ title, body }) => (
                  <div key={title} className={`flex gap-3 p-4 rounded-lg border ${color}`}>
                    <span
                      className={`mt-0.5 shrink-0 size-4 rounded-full ${dot} flex items-center justify-center text-white text-[10px] font-bold`}
                    >
                      {heading === 'Do' ? '✓' : '✗'}
                    </span>
                    <div>
                      <p className={`text-xs font-semibold mb-0.5 ${titleColor}`}>{title}</p>
                      <p className={`text-xs leading-relaxed ${bodyColor}`}>{body}</p>
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
