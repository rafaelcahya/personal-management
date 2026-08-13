import PageHeader from '@/app/main/components/PageHeader'
import TwoFactorSection from './components/TwoFactorSection'

export const metadata = {
  title: 'Security — Personal Management',
}

export default function SecurityPage() {
  return (
    <div id="securityPage" className="flex flex-col gap-6 px-6 py-6 max-w-2xl">
      <PageHeader
        title="Security"
        description="Manage your account security settings"
        breadcrumbs={[{ label: 'Security' }]}
      />
      <TwoFactorSection />
    </div>
  )
}
