import Link from 'next/link'
import { ChevronRight, ChevronLeft } from 'lucide-react'

export default function PageHeader({ title, description, breadcrumbs = [], backHref }) {
  return (
    <div>
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1 text-xs text-slate-400 pt-6 lg:pt-0 mb-2.5 overflow-hidden"
      >
        {breadcrumbs.map((crumb, i) => {
          const isLast = i === breadcrumbs.length - 1
          return (
            <span key={i} className={`flex items-center gap-1 ${isLast ? 'min-w-0' : 'shrink-0'}`}>
              {i > 0 && <ChevronRight className="size-3 text-slate-300 shrink-0" />}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-slate-600 transition-colors shrink-0">
                  {crumb.label}
                </Link>
              ) : (
                <span className={`text-slate-500 font-medium ${isLast ? 'truncate' : ''}`}>
                  {crumb.label}
                </span>
              )}
            </span>
          )
        })}
      </nav>

      <div className="flex items-center gap-1">
        {backHref && (
          <Link
            href={backHref}
            aria-label="Go back"
            className="shrink-0 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:ring-offset-1"
          >
            <ChevronLeft className="size-5" />
          </Link>
        )}
        <div>
          <h1 className="text-xl font-semibold text-slate-800 leading-tight">{title}</h1>
          {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
        </div>
      </div>
    </div>
  )
}
