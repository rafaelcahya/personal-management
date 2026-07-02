/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Colors',
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

const Swatch = ({ bg, fg = 'text-white', label, variable, twClass }) => (
  <div className="rounded-lg overflow-hidden border border-border text-xs font-mono">
    <div className={`h-20 ${bg} ${fg} flex flex-col justify-end p-3`}>
      <span className="opacity-90 font-medium">{label}</span>
    </div>
    <div className="px-3 py-2.5 bg-background space-y-0.5">
      <p className="text-foreground">{variable}</p>
      <p className="text-muted-foreground">{twClass}</p>
    </div>
  </div>
)

const SwatchPair = ({ bg, fg, bgLabel, fgLabel, bgVar, fgVar, bgTw, fgTw }) => (
  <div className="rounded-lg overflow-hidden border border-border text-xs font-mono">
    <div className={`h-20 ${bg} ${fg} flex flex-col justify-end p-3`}>
      <span className="opacity-90 font-medium">{bgLabel}</span>
      <span className="opacity-60 text-[10px]">{fgLabel} on top</span>
    </div>
    <div className="px-3 py-2.5 bg-background divide-y divide-border">
      <div className="pb-1.5 space-y-0.5">
        <p className="text-foreground">{bgVar}</p>
        <p className="text-muted-foreground">{bgTw}</p>
      </div>
      <div className="pt-1.5 space-y-0.5">
        <p className="text-foreground">{fgVar}</p>
        <p className="text-muted-foreground">{fgTw}</p>
      </div>
    </div>
  </div>
)

// ─── Story ───────────────────────────────────────────────────────────────────

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="p-8 max-w-5xl font-sans text-gray-900">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Colors</h1>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          All color tokens are defined as CSS variables in{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">globals.css</code> and mapped
          to Tailwind in{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">tailwind.config.ts</code>.
          Use Tailwind classes directly — hover states use opacity modifiers (e.g.{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">hover:bg-primary/90</code>).
        </p>
      </div>

      {/* Brand */}
      <Section
        title="Brand"
        description="Core interactive colors. Primary is the main CTA; secondary is the supporting action."
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <SwatchPair
            bg="bg-primary"
            fg="text-primary-foreground"
            bgLabel="primary"
            fgLabel="primary-foreground"
            bgVar="--primary"
            fgVar="--primary-foreground"
            bgTw="bg-primary"
            fgTw="text-primary-foreground"
          />
          <SwatchPair
            bg="bg-secondary"
            fg="text-secondary-foreground"
            bgLabel="secondary"
            fgLabel="secondary-foreground"
            bgVar="--secondary"
            fgVar="--secondary-foreground"
            bgTw="bg-secondary"
            fgTw="text-secondary-foreground"
          />
        </div>
      </Section>

      {/* Feedback */}
      <Section
        title="Feedback"
        description="Semantic status colors for user-facing messages, alerts, and interactive states."
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <SwatchPair
            bg="bg-destructive"
            fg="text-destructive-foreground"
            bgLabel="destructive"
            fgLabel="destructive-foreground"
            bgVar="--destructive"
            fgVar="--destructive-foreground"
            bgTw="bg-destructive"
            fgTw="text-destructive-foreground"
          />
          <SwatchPair
            bg="bg-success"
            fg="text-success-foreground"
            bgLabel="success"
            fgLabel="success-foreground"
            bgVar="--success"
            fgVar="--success-foreground"
            bgTw="bg-success"
            fgTw="text-success-foreground"
          />
          <SwatchPair
            bg="bg-warning"
            fg="text-warning-foreground"
            bgLabel="warning"
            fgLabel="warning-foreground"
            bgVar="--warning"
            fgVar="--warning-foreground"
            bgTw="bg-warning"
            fgTw="text-warning-foreground"
          />
          <SwatchPair
            bg="bg-info"
            fg="text-info-foreground"
            bgLabel="info"
            fgLabel="info-foreground"
            bgVar="--info"
            fgVar="--info-foreground"
            bgTw="bg-info"
            fgTw="text-info-foreground"
          />
        </div>
      </Section>

      {/* Additional */}
      <Section
        title="Additional"
        description="Tinted surface variants of the feedback colors. Use for subtle backgrounds where a full-strength color would be too heavy."
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <SwatchPair
            bg="bg-success-subtle"
            fg="text-success-subtle-foreground"
            bgLabel="success-subtle"
            fgLabel="success-subtle-foreground"
            bgVar="--success-subtle"
            fgVar="--success-subtle-foreground"
            bgTw="bg-success-subtle"
            fgTw="text-success-subtle-foreground"
          />
          <SwatchPair
            bg="bg-destructive-subtle"
            fg="text-destructive-subtle-foreground"
            bgLabel="destructive-subtle"
            fgLabel="destructive-subtle-foreground"
            bgVar="--destructive-subtle"
            fgVar="--destructive-subtle-foreground"
            bgTw="bg-destructive-subtle"
            fgTw="text-destructive-subtle-foreground"
          />
          <SwatchPair
            bg="bg-warning-subtle"
            fg="text-warning-subtle-foreground"
            bgLabel="warning-subtle"
            fgLabel="warning-subtle-foreground"
            bgVar="--warning-subtle"
            fgVar="--warning-subtle-foreground"
            bgTw="bg-warning-subtle"
            fgTw="text-warning-subtle-foreground"
          />
        </div>
      </Section>

      {/* Neutral */}
      <Section
        title="Neutral"
        description="Gray-based tokens for text hierarchy, borders, inputs, and subtle backgrounds."
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Swatch
            bg="bg-foreground"
            fg="text-background"
            label="foreground"
            variable="--foreground"
            twClass="text-foreground"
          />
          <SwatchPair
            bg="bg-muted"
            fg="text-muted-foreground"
            bgLabel="muted"
            fgLabel="muted-foreground"
            bgVar="--muted"
            fgVar="--muted-foreground"
            bgTw="bg-muted"
            fgTw="text-muted-foreground"
          />
          <SwatchPair
            bg="bg-accent"
            fg="text-accent-foreground"
            bgLabel="accent"
            fgLabel="accent-foreground"
            bgVar="--accent"
            fgVar="--accent-foreground"
            bgTw="bg-accent"
            fgTw="text-accent-foreground"
          />
          <Swatch
            bg="bg-border"
            fg="text-foreground"
            label="border"
            variable="--border"
            twClass="border-border"
          />
          <Swatch
            bg="bg-input"
            fg="text-foreground"
            label="input"
            variable="--input"
            twClass="border-input"
          />
          <Swatch bg="bg-ring" fg="text-white" label="ring" variable="--ring" twClass="ring-ring" />
        </div>
      </Section>
    </div>
  ),
}
