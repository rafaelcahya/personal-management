import { requireAuth } from '@/lib/auth/utils'
import EventsPageClient from './EventsPageClient'

export default async function EventsPage() {
  await requireAuth()
  return <EventsPageClient />
}
