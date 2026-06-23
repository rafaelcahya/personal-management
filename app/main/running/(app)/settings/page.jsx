'use client'

import ProfileSection from './components/ProfileSection'
import HrZonesSection from './components/HrZonesSection'
import PaceZonesSection from './components/PaceZonesSection'
import NotificationsSection from './components/NotificationsSection'
import StravaSection from './components/StravaSection'
import DangerZoneSection from './components/DangerZoneSection'

export default function RunningSettingsPage() {
  return (
    <div id="settingsPage" className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">Profile & preferences</p>
      </div>

      <ProfileSection />
      <HrZonesSection />
      <PaceZonesSection />
      <NotificationsSection />
      <StravaSection />
      <DangerZoneSection />
    </div>
  )
}
