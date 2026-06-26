import { useId } from 'react'
import Card, { CardAction, CardDescription, CardHeader, CardIcon, CardTitle } from './Card'

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

  return (
    <Card variant={variant} id={id} className={className} aria-labelledby={titleId}>
      {hasHeader && (
        <CardHeader className={alignClass || undefined}>
          {icon && <CardIcon icon={icon} />}
          {(title || description) && (
            <div className="min-w-0 flex-1">
              {title && (
                <CardTitle as={TitleTag} id={titleId}>
                  {title}
                </CardTitle>
              )}
              {description && <CardDescription>{description}</CardDescription>}
            </div>
          )}
          {action && <CardAction>{action}</CardAction>}
        </CardHeader>
      )}
      {children}
    </Card>
  )
}
