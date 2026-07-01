import { Info } from 'lucide-react'
import { Banner, BannerIcon, BannerContent, BannerTitle, BannerDescription } from './Banner'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Banner/Basic' }
export default meta

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        A minimal banner with an icon, title, and description. The{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant</code> prop sets the
        color palette — the default is{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">info</code>.
      </p>

      <Banner variant="info">
        <BannerIcon icon={Info} />
        <BannerContent>
          <BannerTitle>Your session will expire soon</BannerTitle>
          <BannerDescription>
            You will be automatically logged out in 5 minutes. Save your work to avoid losing
            changes.
          </BannerDescription>
        </BannerContent>
      </Banner>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`import { Info } from 'lucide-react'
import {
  Banner, BannerIcon, BannerContent,
  BannerTitle, BannerDescription,
} from '@/components/base/Banner/Banner'

<Banner variant="info">
  <BannerIcon icon={Info} />
  <BannerContent>
    <BannerTitle>Your session will expire soon</BannerTitle>
    <BannerDescription>
      You will be automatically logged out in 5 minutes.
    </BannerDescription>
  </BannerContent>
</Banner>`}</code>
      </pre>
    </div>
  ),
}
