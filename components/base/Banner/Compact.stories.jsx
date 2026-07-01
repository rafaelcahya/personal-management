import { Info, AlertTriangle, CheckCircle } from 'lucide-react'
import {
  Banner,
  BannerIcon,
  BannerContent,
  BannerTitle,
  BannerDescription,
  BannerAction,
} from './Banner'
import Button from '@/components/base/Button/Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Banner/Compact' }
export default meta

export const Compact = {
  name: 'Compact',
  render: () => (
    <div className="flex flex-col gap-8 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        Use <code className="font-mono bg-gray-100 px-1 rounded text-xs">className</code> to reduce
        padding for tight spaces like inside a form, card, or sidebar.
      </p>

      <div className="flex flex-col gap-3">
        <span className="text-xs text-gray-400">Compact — single line</span>
        <Banner variant="info" className="py-2.5 px-3">
          <BannerIcon icon={Info} />
          <BannerContent>
            <BannerTitle>Read-only mode is active</BannerTitle>
          </BannerContent>
        </Banner>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs text-gray-400">Compact with description</span>
        <Banner variant="warning" className="py-2.5 px-3">
          <BannerIcon icon={AlertTriangle} />
          <BannerContent>
            <BannerTitle>Draft not saved</BannerTitle>
            <BannerDescription>Your last change was 2 minutes ago.</BannerDescription>
          </BannerContent>
        </Banner>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs text-gray-400">Inside a form card</span>
        <div className="border border-gray-200 rounded-xl p-5 flex flex-col gap-4">
          <p className="text-sm font-medium text-gray-800">Add Transaction</p>

          <Banner variant="success" className="py-2.5 px-3">
            <BannerIcon icon={CheckCircle} />
            <BannerContent>
              <BannerTitle>Last import: 12 items added</BannerTitle>
            </BannerContent>
            <BannerAction>
              <Button size="sm" variant="outline">
                View
              </Button>
            </BannerAction>
          </Banner>

          <div className="h-px bg-gray-100" />
          <p className="text-xs text-gray-400">Form fields would go here…</p>
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`{/* compact — reduce padding via className */}
<Banner variant="info" className="py-2.5 px-3">
  <BannerIcon icon={Info} />
  <BannerContent>
    <BannerTitle>Read-only mode is active</BannerTitle>
  </BannerContent>
</Banner>`}</code>
      </pre>
    </div>
  ),
}
