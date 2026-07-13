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

export const Compact = {
  name: 'Compact',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          Override padding via{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">className</code> for tight
          spaces like inside a form, card header, or sidebar. The default padding is{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">p-4</code> — reduce to{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">py-2.5 px-3</code> for a
          compact variant.
        </p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-2xl">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">compact — single line</span>
          <Banner variant="info" className="py-2.5 px-3">
            <BannerIcon icon={Info} />
            <BannerContent>
              <BannerTitle>Read-only mode is active</BannerTitle>
            </BannerContent>
          </Banner>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">compact with description</span>
          <Banner variant="warning" className="py-2.5 px-3">
            <BannerIcon icon={AlertTriangle} />
            <BannerContent>
              <BannerTitle>Draft not saved</BannerTitle>
              <BannerDescription>Your last change was 2 minutes ago.</BannerDescription>
            </BannerContent>
          </Banner>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">inside a form card</span>
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
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use compact padding inside cards, forms, and sidebars',
                body: 'When the banner lives inside a smaller container, default p-4 adds too much visual weight relative to surrounding content. Override to py-2.5 px-3 to keep it proportional.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't add long descriptions or multiple action buttons in a compact banner",
                body: 'Compact works best with a single-line title only. Adding a description plus multiple buttons makes the banner feel cramped. If you need that content, use full default padding instead.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Compact padding does not affect role="alert" or keyboard behavior',
                body: 'Overriding padding via className is purely visual. The Banner still renders with role="alert" and BannerClose retains its aria-label — compact is a layout concern, not a semantic change.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: "Don't add a compact prop or variant — use className directly",
                body: 'Compact is a layout concern, not a semantic state. Encoding it as a prop would bloat the API for a one-liner className override. Pass className="py-2.5 px-3" at the usage site.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* compact — reduce padding via className */}
<Banner variant="info" className="py-2.5 px-3">
  <BannerIcon icon={Info} />
  <BannerContent>
    <BannerTitle>Read-only mode is active</BannerTitle>
  </BannerContent>
</Banner>

{/* compact inside a card */}
<div className="border border-gray-200 rounded-xl p-5">
  <Banner variant="warning" className="py-2.5 px-3">
    <BannerIcon icon={AlertTriangle} />
    <BannerContent>
      <BannerTitle>Draft not saved</BannerTitle>
    </BannerContent>
  </Banner>
</div>`}</code>
      </pre>
    </div>
  ),
}
