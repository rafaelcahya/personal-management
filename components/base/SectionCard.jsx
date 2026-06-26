import { createElement, useId } from 'react'

const variants = {
  shell: {
    section: 'bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden',
    header: 'px-5 py-4 border-b border-slate-100',
  },
  transparent: {
    section: '',
    header: 'pb-3',
  },
}

export default function SectionCard({
  icon,
  title,
  description,
  action,
  actionAlign = 'right',
  variant = 'shell',
  className = '',
  id,
  titleAs: TitleTag = 'h3',
  children,
}) {
  const autoId = useId()
  const titleId = title ? `${autoId}-title` : undefined

  const hasHeader = icon || title || description || action
  const hasTextContent = icon || title || description

  const alignClass =
    !hasTextContent && action
      ? actionAlign === 'left'
        ? 'justify-start'
        : actionAlign === 'center'
          ? 'justify-center'
          : 'justify-end'
      : ''

  const v = variants[variant] ?? variants.shell

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={[v.section, className].filter(Boolean).join(' ')}
    >
      {hasHeader && (
        <div className={`flex items-start gap-3 ${v.header} ${alignClass}`}>
          {icon && (
            <div className="flex items-center justify-center size-9 rounded-lg bg-violet-50 shrink-0">
              {createElement(icon, { className: 'size-4 text-violet-600', 'aria-hidden': 'true' })}
            </div>
          )}
          {(title || description) && (
            <div className="min-w-0 flex-1">
              {title && (
                <TitleTag id={titleId} className="text-sm font-semibold text-slate-900">
                  {title}
                </TitleTag>
              )}
              {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
            </div>
          )}
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </section>
  )
}
