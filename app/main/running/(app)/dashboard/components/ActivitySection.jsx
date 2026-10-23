'use client'

import { useState } from 'react'
import { Activity } from 'lucide-react'
import Card, {
  CardContent,
  CardDescription,
  CardHeader,
  CardHeaderContent,
  CardIcon,
  CardTitle,
} from '@/components/base/Card/Card.jsx'
import CalendarColumn from './CalendarColumn'
import RecentColumn from './RecentColumn'

export default function ActivitySection({ calendarActivities, recentActivities, activityType }) {
  const [selectedDate, setSelectedDate] = useState(null)

  return (
    <section id="activitySection" aria-label="Activity">
      <Card>
        <CardHeader>
          <CardIcon icon={Activity} />
          <CardHeaderContent>
            <CardTitle>Activity</CardTitle>
            <CardDescription>Monthly calendar and your most recent activities.</CardDescription>
          </CardHeaderContent>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:divide-x md:divide-slate-100">
            <CalendarColumn
              initialActivities={calendarActivities}
              activityType={activityType}
              selectedDate={selectedDate}
            />
            <div className="md:pl-6">
              <RecentColumn
                activities={recentActivities}
                activityType={activityType}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
