import EventDetailClient from './EventDetailClient'

export default async function EventDetailPage({ params }) {
  const { id } = await params
  return <EventDetailClient id={id} />
}
