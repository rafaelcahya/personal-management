import { Info } from 'lucide-react'
import { Banner, BannerIcon, BannerContent, BannerTitle, BannerDescription } from './Banner'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Banner/Basic' }
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

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          The minimal Banner composition: an icon, a title, and a description inside a{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">Banner</code> root. The{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant</code> prop (default{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">info</code>) cascades the
          full color palette to all sub-components via context.
        </p>
      </div>

      <div className="w-full max-w-2xl">
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
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Start with the minimal structure: icon + title + description',
                body: 'This composition covers most Banner use cases. Add BannerAction or dismissible only when the use case requires it — not by default.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't omit BannerIcon from the basic structure",
                body: "The icon is the fastest signal of severity before the user reads the text. It's colored automatically by variant — no extra styling needed. Omitting it makes banners harder to scan.",
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Keep BannerTitle short and BannerDescription specific',
                body: 'Banner renders with role="alert" — screen readers announce the content immediately. A short, specific title (5–8 words) and an actionable description give users everything they need at first hear.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Set variant once on Banner — color cascades to all sub-components',
                body: 'BannerIcon, BannerTitle, BannerDescription, and BannerAction all inherit color from the Banner context. You never need to pass variant down to individual sub-components.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
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
