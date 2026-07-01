import { AlertTriangle } from 'lucide-react'
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
const meta = { title: 'Banner/Icon Position' }
export default meta

export const IconPosition = {
  name: 'Icon Position',
  render: () => (
    <div className="flex flex-col gap-8 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">position</code> prop on{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">BannerIcon</code> controls
        vertical alignment relative to the content.
      </p>

      {/* position="center" */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-700 font-mono">
            position=&quot;content&quot;
          </span>
          <span className="text-xs text-gray-400">default — icon centered dengan full content</span>
        </div>
        <Banner variant="warning">
          <BannerIcon icon={AlertTriangle} position="center" />
          <BannerContent>
            <BannerTitle>Stock below threshold</BannerTitle>
            <BannerDescription>
              BBCA has only 2 units remaining. Consider restocking before it runs out.
            </BannerDescription>
            <BannerAction>
              <Button size="sm" variant="outline">
                Restock
              </Button>
            </BannerAction>
          </BannerContent>
        </Banner>
      </div>

      {/* position="top" */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-700 font-mono">
            position=&quot;title&quot;
          </span>
          <span className="text-xs text-gray-400">icon sejajar dengan baris title</span>
        </div>
        <Banner variant="warning">
          <BannerIcon icon={AlertTriangle} position="top" />
          <BannerContent>
            <BannerTitle>Stock below threshold</BannerTitle>
            <BannerDescription>
              BBCA has only 2 units remaining. Consider restocking before it runs out.
            </BannerDescription>
            <BannerAction>
              <Button size="sm" variant="outline">
                Restock
              </Button>
            </BannerAction>
          </BannerContent>
        </Banner>
      </div>

      {/* single line — no difference */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-700">Single line</span>
          <span className="text-xs text-gray-400">both positions look the same</span>
        </div>
        <Banner variant="warning">
          <BannerIcon icon={AlertTriangle} />
          <BannerContent>
            <BannerTitle>Stock below threshold</BannerTitle>
          </BannerContent>
        </Banner>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`{/* icon centered with full content (default) */}
<Banner variant="warning">
  <BannerIcon icon={AlertTriangle} position="center" />
  <BannerContent>
    <BannerTitle>Stock below threshold</BannerTitle>
    <BannerDescription>BBCA has only 2 units remaining.</BannerDescription>
    <BannerAction>
      <Button size="sm" variant="outline">Restock</Button>
    </BannerAction>
  </BannerContent>
</Banner>

{/* icon aligned with title */}
<Banner variant="warning">
  <BannerIcon icon={AlertTriangle} position="top" />
  <BannerContent>
    <BannerTitle>Stock below threshold</BannerTitle>
    <BannerDescription>BBCA has only 2 units remaining.</BannerDescription>
    <BannerAction>
      <Button size="sm" variant="outline">Restock</Button>
    </BannerAction>
  </BannerContent>
</Banner>`}</code>
      </pre>
    </div>
  ),
}
