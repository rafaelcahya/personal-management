import Card, {
  CardContent,
  CardDescription,
  CardHeader,
  CardHeaderContent,
  CardIcon,
  CardTitle,
} from '@/components/base/Card/Card.jsx'

export default function Section({ id, title, description, icon: Icon, children }) {
  return (
    <section id={id} aria-label={title} className="scroll-mt-20">
      <Card>
        <CardHeader>
          <CardIcon icon={Icon} />
          <CardHeaderContent>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeaderContent>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </section>
  )
}
