'use client'

import ProfileSection from './components/ProfileSection'
import HrZonesSection from './components/HrZonesSection'
import NotificationsSection from './components/NotificationsSection'
import StravaConnectionSection from './components/StravaConnectionSection'
import StravaIntegrationSection from './components/StravaIntegrationSection'
import DangerZoneSection from './components/DangerZoneSection'

export default function RunningSettingsPage() {
  return (
    <div id="settingsPage" className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">Profile & preferences</p>
      </div>

      <ProfileSection />
      <HrZonesSection />
      <NotificationsSection />
      <StravaConnectionSection />
      <StravaIntegrationSection />
      <DangerZoneSection />
    </div>
  )
}
