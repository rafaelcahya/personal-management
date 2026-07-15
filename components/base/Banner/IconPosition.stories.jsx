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

export const IconPosition = {
  name: 'Icon Position',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          The <code className="font-mono bg-gray-100 px-1 rounded text-xs">position</code> prop on{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">BannerIcon</code> controls
          vertical alignment.{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">"center"</code> (default)
          centers the icon relative to the full content area.{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">"top"</code> aligns it to the
          title row — use this for tall banners with a description and action buttons.
        </p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-2xl">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400 font-mono">
            position="center" — default, icon centered with full content
          </span>
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

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400 font-mono">
            position="top" — icon aligned to title row
          </span>
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

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400 font-mono">
            single line — both positions look the same
          </span>
          <Banner variant="warning">
            <BannerIcon icon={AlertTriangle} />
            <BannerContent>
              <BannerTitle>Stock below threshold</BannerTitle>
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
                title: 'Use position="center" (default) for banners with title + description only',
                body: 'With two lines of content, centering the icon creates a balanced layout. It sits at the visual midpoint and avoids the icon feeling pinned to the top.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't center the icon on tall banners with BannerAction",
                body: 'With three or more lines (title + description + action button), a centered icon floats awkwardly in the middle of a tall content block. Use position="top" to anchor it to the title row instead.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Icon position is a visual concern only — no accessibility impact',
                body: 'BannerIcon is decorative. The position prop controls visual alignment but has no effect on screen reader output. Accessibility is governed by role="alert" on the Banner root, not the icon layout.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Omit the prop for single-line banners — both positions are identical',
                body: 'When the banner has a title only and no description or action, center and top produce the same visual result. Skip the prop and rely on the default.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* centered with full content (default) */}
<Banner variant="warning">
  <BannerIcon icon={AlertTriangle} position="center" />
  <BannerContent>
    <BannerTitle>Stock below threshold</BannerTitle>
    <BannerDescription>BBCA has only 2 units remaining.</BannerDescription>
  </BannerContent>
</Banner>

{/* aligned to title row — use for tall banners */}
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
