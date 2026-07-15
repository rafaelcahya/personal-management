import { useState } from 'react'
import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { Banner, BannerIcon, BannerContent, BannerTitle, BannerDescription } from './Banner'
import Button from '@/components/base/Button/Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Banner/Dismissible' }
export default meta

const BestPractices = ({ items: bpItems }) => (
  <div className="flex flex-col gap-8 w-full max-w-2xl">
    {bpItems.map(({ heading, cards }) => (
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

const items = [
  {
    key: 'info',
    variant: 'info',
    icon: Info,
    title: 'Maintenance scheduled',
    desc: 'The app will be offline for 10 minutes on Sunday at 2:00 AM WIB.',
  },
  {
    key: 'success',
    variant: 'success',
    icon: CheckCircle,
    title: 'Portfolio synced',
    desc: 'All positions have been updated with the latest market data.',
  },
  {
    key: 'warning',
    variant: 'warning',
    icon: AlertTriangle,
    title: 'Low stock detected',
    desc: '3 items are below their minimum threshold and need attention.',
  },
  {
    key: 'danger',
    variant: 'danger',
    icon: XCircle,
    title: 'Payment method expired',
    desc: 'Your payment method on file has expired. Update it to continue.',
  },
]

export const Dismissible = {
  name: 'Dismissible',
  render: () => {
    const [visible, setVisible] = useState({
      info: true,
      success: true,
      warning: true,
      danger: true,
    })
    const allHidden = Object.values(visible).every((v) => !v)

    return (
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-col gap-2 max-w-2xl">
          <p className="text-sm text-gray-500 leading-relaxed">
            Add <code className="font-mono bg-gray-100 px-1 rounded text-xs">dismissible</code> to
            auto-render a close button at the trailing edge. Pair it with an{' '}
            <code className="font-mono bg-gray-100 px-1 rounded text-xs">onDismiss</code> handler
            that hides the banner in parent state. Click the × buttons below to try it.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-2xl">
          {items.map(({ key, variant, icon, title, desc }) =>
            visible[key] ? (
              <Banner
                key={key}
                variant={variant}
                dismissible
                onDismiss={() => setVisible((prev) => ({ ...prev, [key]: false }))}
              >
                <BannerIcon icon={icon} />
                <BannerContent>
                  <BannerTitle>{title}</BannerTitle>
                  <BannerDescription>{desc}</BannerDescription>
                </BannerContent>
              </Banner>
            ) : null
          )}

          {allHidden && <p className="text-sm text-gray-400 py-2">All banners dismissed.</p>}

          <div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setVisible({ info: true, success: true, warning: true, danger: true })}
            >
              Reset all
            </Button>
          </div>
        </div>

        <BestPractices
          items={[
            {
              heading: 'When to use',
              cards: [
                {
                  title: 'Use dismissible on info and success banners',
                  body: 'Once the user reads a neutral or success message, they may want to clear it. Dismissible lets them clean up their own UI without requiring you to auto-remove the banner after a timeout.',
                },
              ],
            },
            {
              heading: 'When not to use',
              cards: [
                {
                  title:
                    "Don't make warning or danger banners dismissible until the issue is resolved",
                  body: 'If the problem is ongoing — low stock, expired payment, lost connection — the banner should stay until the user acts. Letting them dismiss it without fixing the issue hides a live problem.',
                },
              ],
            },
            {
              heading: 'Accessibility',
              cards: [
                {
                  title: 'Always pair dismissible with onDismiss and manage state in the parent',
                  body: 'BannerClose has aria-label="Dismiss" built in. A close button with no handler is a broken interaction for keyboard users — the button activates but nothing happens.',
                },
              ],
            },
            {
              heading: 'Advice',
              cards: [
                {
                  title: 'Persist dismissed state if the banner should stay gone after refresh',
                  body: 'If you remove the banner from state without saving the preference, it reappears on refresh. Save to localStorage or the server if the dismissed state should survive a page reload.',
                },
              ],
            },
          ]}
        />

        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
          <code>{`const [show, setShow] = useState(true)

{show && (
  <Banner
    variant="warning"
    dismissible
    onDismiss={() => setShow(false)}
  >
    <BannerIcon icon={AlertTriangle} />
    <BannerContent>
      <BannerTitle>Low stock detected</BannerTitle>
      <BannerDescription>3 items need attention.</BannerDescription>
    </BannerContent>
  </Banner>
)}`}</code>
        </pre>
      </div>
    )
  },
}
