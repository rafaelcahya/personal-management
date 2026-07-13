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

const BestPractices = ({ items }) => (
  <div className="flex flex-col gap-8 w-full max-w-2xl">
    {items.map(({ heading, cards }) => (
      <div key={heading}>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          {heading}
        </p>
        <div className="flex flex-col gap-3">
          {cards.map(({ title, body }) => (
            <div
              key={title}
              className="flex gap-3 p-4 rounded-lg border border-violet-100 bg-violet-50"
            >
              <span className="mt-0.5 shrink-0 size-4 rounded-full bg-violet-500 flex items-center justify-center text-white text-[10px] font-bold">
                ✓
              </span>
              <div>
                <p className="text-xs font-semibold text-violet-800 mb-0.5">{title}</p>
                <p className="text-xs text-violet-700 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
)

export const WithAction = {
  name: 'With Action',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          Add <code className="font-mono bg-gray-100 px-1 rounded text-xs">BannerAction</code>{' '}
          inside <code className="font-mono bg-gray-100 px-1 rounded text-xs">BannerContent</code>{' '}
          to place one or more call-to-action buttons below the description. Use it to give users a
          direct path to resolve the issue without leaving the page.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-2xl">
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
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Add BannerAction when the user can fix the issue inline',
                body: "Restock, Retry, Save, Discard — actions that resolve the banner's message without leaving the page. Only add BannerAction when there's a clear, specific next step.",
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't add action buttons to purely informational banners",
                body: "An info banner about sync status or a maintenance window doesn't need an action. Adding buttons to neutral messages makes them feel more urgent than they are.",
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Limit to 1–2 buttons and put the safer option first',
                body: 'More than two actions creates decision paralysis. For destructive choices like Discard vs Save, offer both with the safer action (Save) positioned last so it reads as the default.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use size="sm" and variant="outline" for banner buttons',
                body: "Compact outline buttons stay proportional to the banner height and don't compete with the banner's own variant color styling. A full-size filled button inside a banner overwhelms the layout.",
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Banner variant="warning">
  <BannerIcon icon={AlertTriangle} />
  <BannerContent>
    <BannerTitle>Stock below threshold</BannerTitle>
    <BannerDescription>BBCA has only 2 units remaining.</BannerDescription>
    <BannerAction>
      <Button size="sm" variant="outline">Restock</Button>
    </BannerAction>
  </BannerContent>
</Banner>

{/* Two actions — safer option first */}
<Banner variant="info">
  <BannerIcon icon={Info} />
  <BannerContent>
    <BannerTitle>You have unsaved changes</BannerTitle>
    <BannerAction>
      <Button size="sm" variant="outline">Discard</Button>
      <Button size="sm">Stay & Save</Button>
    </BannerAction>
  </BannerContent>
</Banner>`}</code>
      </pre>
    </div>
  ),
}
