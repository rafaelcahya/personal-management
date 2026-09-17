'use client'

import Link from 'next/link'
import Button from '@/components/base/Button/Button'
import { AlertCircle } from 'lucide-react'
import Card, {
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardHeaderContent,
  CardIcon,
  CardTitle,
} from '@/components/base/Card/Card.jsx'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'

export default function HighlightSection({
  id,
  linkId,
  retryId,
  title,
  description,
  icon,
  href,
  linkLabel = 'View →',
  loading,
  error,
  onRetry,
  children,
}) {
  return (
    <section id={id} aria-label={title}>
      <Card className="h-full">
        <CardHeader layout="below">
          <div className="flex gap-2">
            <CardIcon icon={icon} />
            <CardHeaderContent>
              <CardTitle>{title}</CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
            </CardHeaderContent>
          </div>
          <CardAction>
            <Link
              id={linkId}
              href={href}
              className="text-xs text-primary hover:underline mt-1 inline-flex items-center gap-1"
            >
              {linkLabel}
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent className="px-5 py-5">
          {loading ? (
            <div className="space-y-3" role="status" aria-label={`Loading ${title}`}>
              <Skeleton className="h-8 w-32 rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-2/3 rounded" />
            </div>
          ) : error ? (
            <div role="alert" aria-live="assertive" className="flex flex-col items-start gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="size-4 text-destructive shrink-0" aria-hidden="true" />
                <span>Couldn&rsquo;t load {title.toLowerCase()}</span>
              </div>
              <Button
                id={retryId}
                variant="outline"
                size="xs"
                onClick={onRetry}
                className="min-w-11"
              >
                Try again
              </Button>
            </div>
          ) : (
            children
          )}
        </CardContent>
      </Card>
    </section>
  )
}
