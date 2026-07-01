import { Banner, BannerContent, BannerTitle, BannerDescription, BannerAction } from './Banner'
import Button from '@/components/base/Button/Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Banner/Without Icon' }
export default meta

export const WithoutIcon = {
  name: 'Without Icon',
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">BannerIcon</code> is optional.
        Omit it and start directly with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">BannerContent</code> — the
        content fills the full width automatically.
      </p>

      <div className="flex flex-col gap-3">
        <span className="text-xs text-gray-400">Title only</span>
        <Banner variant="info">
          <BannerContent>
            <BannerTitle>Syncing data in the background…</BannerTitle>
          </BannerContent>
        </Banner>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs text-gray-400">Title + description</span>
        <Banner variant="warning">
          <BannerContent>
            <BannerTitle>Heads up</BannerTitle>
            <BannerDescription>
              Prices shown are delayed by 15 minutes. Real-time data requires a premium
              subscription.
            </BannerDescription>
          </BannerContent>
        </Banner>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs text-gray-400">Title + description + action</span>
        <Banner variant="danger">
          <BannerContent>
            <BannerTitle>Connection lost</BannerTitle>
            <BannerDescription>
              Unable to reach the server. Check your internet connection and try again.
            </BannerDescription>
            <BannerAction>
              <Button size="sm" variant="outline">
                Retry
              </Button>
            </BannerAction>
          </BannerContent>
        </Banner>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`{/* title only — no icon */}
<Banner variant="info">
  <BannerContent>
    <BannerTitle>Syncing data in the background…</BannerTitle>
  </BannerContent>
</Banner>

{/* title + description */}
<Banner variant="warning">
  <BannerContent>
    <BannerTitle>Heads up</BannerTitle>
    <BannerDescription>Prices are delayed by 15 minutes.</BannerDescription>
  </BannerContent>
</Banner>`}</code>
      </pre>
    </div>
  ),
}
