/**
 * Placeholder component — demonstrates project CSS variables and Tailwind classes.
 * Used as the baseline story for Storybook setup verification.
 */
export default function Placeholder({ title = 'Placeholder', description = 'A base component.' }) {
  return (
    <section
      className="rounded-lg border border-border bg-card p-6 text-card-foreground"
      aria-label={title}
    >
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
          primary
        </span>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
          secondary
        </span>
        <span className="rounded-full bg-tertiary px-3 py-1 text-xs font-medium text-tertiary-foreground">
          tertiary
        </span>
        <span className="rounded-full bg-trade-profit px-3 py-1 text-xs font-medium text-trade-profit-foreground">
          profit
        </span>
        <span className="rounded-full bg-trade-loss px-3 py-1 text-xs font-medium text-trade-loss-foreground">
          loss
        </span>
        <span className="rounded-full bg-trade-warning px-3 py-1 text-xs font-medium text-trade-warning-foreground">
          warning
        </span>
      </div>
    </section>
  )
}
