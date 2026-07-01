import { useState } from 'react'
import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { Banner, BannerIcon, BannerContent, BannerTitle, BannerDescription } from './Banner'
import Button from '@/components/base/Button/Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Banner/Dismissible' }
export default meta

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
      <div className="flex flex-col gap-4 w-full max-w-xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          Add <code className="font-mono bg-gray-100 px-1 rounded text-xs">dismissible</code> and an{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">onDismiss</code> handler to
          let users close the banner.
        </p>

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

        {allHidden && (
          <p className="text-sm text-gray-400 text-center py-2">All banners dismissed.</p>
        )}

        <Button
          size="sm"
          variant="outline"
          className="self-start"
          onClick={() => setVisible({ info: true, success: true, warning: true, danger: true })}
        >
          Reset all
        </Button>

        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
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
