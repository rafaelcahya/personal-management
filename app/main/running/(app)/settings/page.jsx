'use client'

import ProfileSection from './components/ProfileSection'
import HrZonesSection from './components/HrZonesSection'
import PaceZonesSection from './components/PaceZonesSection'
import StravaSection from './components/StravaSection'
import DangerZoneSection from './components/DangerZoneSection'
import { useState } from 'react'
import useSettingsProfile from './hooks/useSettingsProfile'
import PageHeader from '@/app/main/components/PageHeader'

export default function RunningSettingsPage() {
  const { profile, loading, error, retry } = useSettingsProfile()
  const [stravaRefreshKey, setStravaRefreshKey] = useState(0)
  const profileState = { profile, loading, error, onRetry: retry }

  return (
    <div id="settingsPage" className="flex flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Profile & preferences"
        breadcrumbs={[{ label: 'Running', href: '/main/running/dashboard' }, { label: 'Settings' }]}
      />

      <ProfileSection {...profileState} />
      <HrZonesSection />
      <PaceZonesSection {...profileState} />
      <StravaSection refreshKey={stravaRefreshKey} />
      <DangerZoneSection onDeleted={() => setStravaRefreshKey((k) => k + 1)} />
    </div>
  )
}
