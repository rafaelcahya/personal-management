'use client'

import ProfileSection from './components/ProfileSection'
import HrZonesSection from './components/HrZonesSection'
import PaceZonesSection from './components/PaceZonesSection'
import NotificationsSection from './components/NotificationsSection'
import StravaSection from './components/StravaSection'
import DangerZoneSection from './components/DangerZoneSection'
import PageHeader from '@/app/main/components/PageHeader'

export default function RunningSettingsPage() {
  return (
    <div id="settingsPage" className="flex flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Profile & preferences"
        breadcrumbs={[{ label: 'Running', href: '/main/running/dashboard' }, { label: 'Settings' }]}
      />

      <ProfileSection />
      <HrZonesSection />
      <PaceZonesSection />
      <NotificationsSection />
      <StravaSection />
      <DangerZoneSection />
    </div>
  )
}
