import Card, {
  CardContent,
  CardDescription,
  CardHeader,
  CardIcon,
  CardTitle,
} from '@/components/base/Card/Card.jsx'

export default function Section({ id, title, description, icon: Icon, children }) {
  return (
    <section id={id} aria-label={title} className="scroll-mt-20">
      <Card>
        <CardHeader>
          <CardIcon icon={Icon} />
          <div className="min-w-0 flex-1">
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </section>
  )
}
