import { AlertTriangle, CheckCircle, Info } from 'lucide-react'
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
const meta = { title: 'Banner/With Action' }
export default meta

export const WithAction = {
  name: 'With Action',
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        Use <code className="font-mono bg-gray-100 px-1 rounded text-xs">BannerAction</code> inside{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">BannerContent</code> to add one
        or more call-to-action buttons below the description.
      </p>

      <Banner variant="warning">
        <BannerIcon icon={AlertTriangle} />
        <BannerContent>
          <BannerTitle>Stock below threshold</BannerTitle>
          <BannerDescription>BBCA has only 2 units remaining.</BannerDescription>
          <BannerAction>
            <Button size="sm" variant="outline">
              Restock
            </Button>
          </BannerAction>
        </BannerContent>
      </Banner>

      <Banner variant="info">
        <BannerIcon icon={Info} />
        <BannerContent>
          <BannerTitle>You have unsaved changes</BannerTitle>
          <BannerDescription>
            Navigating away will discard any edits you have made to this form.
          </BannerDescription>
          <BannerAction>
            <Button size="sm" variant="outline">
              Discard
            </Button>
            <Button size="sm">Stay & Save</Button>
          </BannerAction>
        </BannerContent>
      </Banner>

      <Banner variant="success">
        <BannerIcon icon={CheckCircle} />
        <BannerContent>
          <BannerTitle>Import complete</BannerTitle>
          <BannerDescription>
            48 inventory items were imported successfully. Review them before publishing.
          </BannerDescription>
          <BannerAction>
            <Button size="sm" variant="outline">
              View items
            </Button>
          </BannerAction>
        </BannerContent>
      </Banner>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`<Banner variant="warning">
  <BannerIcon icon={AlertTriangle} />
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
