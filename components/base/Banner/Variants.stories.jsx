import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { Banner, BannerIcon, BannerContent, BannerTitle, BannerDescription } from './Banner'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Banner/Variants' }
export default meta

const variants = [
  {
    variant: 'info',
    icon: Info,
    title: 'Update available',
    desc: 'A new version of the app is ready. Refresh to get the latest features and fixes.',
  },
  {
    variant: 'success',
    icon: CheckCircle,
    title: 'Trade executed successfully',
    desc: 'Your order to buy 100 shares of BBCA at Rp 9,250 has been filled.',
  },
  {
    variant: 'warning',
    icon: AlertTriangle,
    title: 'Stock below threshold',
    desc: 'BBCA has only 2 units remaining. Consider restocking before it runs out.',
  },
  {
    variant: 'danger',
    icon: XCircle,
    title: 'Failed to save changes',
    desc: 'We could not save your changes. Please check your connection and try again.',
  },
]

export const Variants = {
  name: 'Variants',
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        Four variants to match the intent of the message:{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">info</code>,{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">success</code>,{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">warning</code>, and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">danger</code>.
      </p>

      {variants.map(({ variant, icon, title, desc }) => (
        <Banner key={variant} variant={variant}>
          <BannerIcon icon={icon} />
          <BannerContent>
            <BannerTitle>{title}</BannerTitle>
            <BannerDescription>{desc}</BannerDescription>
          </BannerContent>
        </Banner>
      ))}

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`<Banner variant="info">...</Banner>
<Banner variant="success">...</Banner>
<Banner variant="warning">...</Banner>
<Banner variant="danger">...</Banner>`}</code>
      </pre>
    </div>
  ),
}
