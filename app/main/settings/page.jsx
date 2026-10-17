import PageHeader from '@/app/main/components/PageHeader'
import ProfileSection from './components/ProfileSection'
import AvatarSection from './components/AvatarSection'
import PushDevicesSection from './components/PushDevicesSection'
import PreferencesSection from './components/PreferencesSection'

export const metadata = {
  title: 'Settings — Personal Management',
}

export default function SettingsPage() {
  return (
    <div id="settingsPage" className="flex flex-col gap-6 px-6 py-6 max-w-2xl">
      <PageHeader
        title="Settings"
        description="Manage your profile, notifications, and account details"
        breadcrumbs={[{ label: 'Settings' }]}
      />
      <AvatarSection />
      <ProfileSection />
      <PushDevicesSection />
      <PreferencesSection />
    </div>
  )
}
