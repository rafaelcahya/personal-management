import { Card, CardContent } from '@/components/ui/card'

export default function Section({ id, title, description, icon: Icon, children }) {
  return (
    <section id={id} aria-label={title}>
      <div className="flex items-start gap-2 mb-3">
        <Icon className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" aria-hidden="true" />
        <div>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{title}</h2>
          {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
        </div>
      </div>
      <Card className="border border-slate-200/70 shadow-sm py-0">
        <CardContent className="px-5 py-5">{children}</CardContent>
      </Card>
    </section>
  )
}
