import { Banner, BannerContent, BannerTitle, BannerDescription, BannerAction } from './Banner'
import Button from '@/components/base/Button/Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Banner/Without Icon' }
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

export const WithoutIcon = {
  name: 'Without Icon',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">BannerIcon</code> is
          optional. Omit it and start directly with{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">BannerContent</code> — the
          content expands to fill the full available width automatically.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-2xl">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">title only</span>
          <Banner variant="info">
            <BannerContent>
              <BannerTitle>Syncing data in the background…</BannerTitle>
            </BannerContent>
          </Banner>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">title + description</span>
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

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">title + description + action</span>
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
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Omit BannerIcon when severity is clear from context',
                body: 'In dedicated notification areas or status strips where banners appear in a known slot, the icon can be redundant. Without it, BannerContent expands to fill the full width automatically.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't omit the icon in general-purpose page banners",
                body: 'The icon is the fastest signal of severity — users identify warning vs. danger vs. info by shape before reading the text. Removing it makes the variant rely on color alone, which fails users with color blindness.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Make the BannerTitle explicit enough to stand alone',
                body: 'Without an icon, the title carries the full severity signal. Write "Connection lost" not "Issue" — the title must describe the problem clearly for screen reader users who hear it announced via role="alert".',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Variant color tokens cascade even without BannerIcon',
                body: 'BannerTitle, BannerDescription, and BannerAction still inherit all variant colors from Banner context. You lose the icon signal, not the color palette.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
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
