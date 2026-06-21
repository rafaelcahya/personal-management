import { Card, CardContent } from '@/components/ui/card'

export default function Section({ id, title, description, icon: Icon, children }) {
  return (
    <section id={id} aria-label={title} className="scroll-mt-20">
      <Card className="border border-slate-200/70 shadow-sm py-0">
        <CardContent className="px-5 py-5">
          <div className="flex flex-col gap-1 mb-4">
            <div className="flex items-center gap-2">
              <Icon className="size-4 text-violet-500 shrink-0" aria-hidden="true" />
              <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
            </div>
            {description && <p className="text-xs text-slate-400">{description}</p>}
          </div>
          {children}
        </CardContent>
      </Card>
    </section>
  )
}
