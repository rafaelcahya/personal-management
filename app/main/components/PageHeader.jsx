import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function PageHeader({ title, description, breadcrumbs = [] }) {
  return (
    <div>
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1 text-xs text-slate-400 pt-6 lg:pt-0 mb-2.5"
      >
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="size-3 text-slate-300 shrink-0" />}
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-slate-600 transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-slate-500 font-medium">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      <h1 className="text-xl font-semibold text-slate-800 leading-tight">{title}</h1>
      {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
    </div>
  )
}
