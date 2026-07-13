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
    <Card id={id} aria-label={title}>
      <CardHeader>
        <CardIcon icon={Icon} />
        <CardHeaderContent>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeaderContent>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
