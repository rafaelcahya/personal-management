import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
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
const meta = { title: 'Banner' }
export default meta

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-3xl py-6 px-2">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Banner</h1>
        <p className="text-base text-gray-500 leading-relaxed">
          A contextual notification strip used to surface system messages, warnings, or
          confirmations within a page. Supports four semantic variants, an optional dismiss button,
          and a slot for call-to-action buttons.
        </p>
      </div>

      {/* Overview */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Overview</h2>
        <div className="flex flex-col gap-3 p-6 border border-gray-200 rounded-xl">
          <Banner variant="info">
            <BannerIcon icon={Info} />
            <BannerContent>
              <BannerTitle>Update available</BannerTitle>
              <BannerDescription>Refresh to get the latest features and fixes.</BannerDescription>
            </BannerContent>
          </Banner>
          <Banner variant="success">
            <BannerIcon icon={CheckCircle} />
            <BannerContent>
              <BannerTitle>Trade executed successfully</BannerTitle>
              <BannerDescription>
                Your order for 100 shares of BBCA has been filled.
              </BannerDescription>
            </BannerContent>
          </Banner>
          <Banner variant="warning" dismissible>
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
          <Banner variant="danger" dismissible>
            <BannerIcon icon={XCircle} />
            <BannerContent>
              <BannerTitle>Failed to save changes</BannerTitle>
              <BannerDescription>Check your connection and try again.</BannerDescription>
            </BannerContent>
          </Banner>
        </div>
        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
          <code>{`import { AlertTriangle } from 'lucide-react'
import {
  Banner, BannerIcon, BannerContent,
  BannerTitle, BannerDescription, BannerAction,
} from '@/components/base/Banner/Banner'

<Banner variant="warning" dismissible onDismiss={() => setShow(false)}>
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
      </section>

      {/* Anatomy */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Anatomy</h2>
        <pre className="bg-gray-50 border border-gray-200 rounded-lg px-5 py-4 text-xs text-gray-700 leading-relaxed">
          <code>{`<Banner variant="info" dismissible onDismiss={fn}>  ← root (flex row, role="alert")
  <BannerIcon icon={Info} />                          ← left: icon (shrink-0)
  <BannerContent>                                     ← right: content (flex-1)
    <BannerTitle>…</BannerTitle>
    <BannerDescription>…</BannerDescription>
    <BannerAction>                                    ← optional action slot
      <Button>…</Button>
    </BannerAction>
  </BannerContent>
                                                      ← BannerClose auto-rendered
</Banner>`}</code>
        </pre>
        <p className="text-sm text-gray-500 leading-relaxed">
          Banner is a simple flex row.{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">BannerIcon</code> sits on the
          left as a fixed-size slot.{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">BannerContent</code> expands
          to fill the remaining space and stacks title, description, and action vertically.{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">BannerClose</code> is
          auto-rendered when{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">dismissible</code> is set.
          All components read{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant</code> from context.
        </p>
      </section>

      {/* Variants */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Variants</h2>
        <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
          {[
            {
              variant: 'info',
              icon: Info,
              bg: 'blue-50',
              border: 'blue-200',
              icon_color: 'blue-600',
            },
            {
              variant: 'success',
              icon: CheckCircle,
              bg: 'emerald-50',
              border: 'emerald-200',
              icon_color: 'emerald-600',
            },
            {
              variant: 'warning',
              icon: AlertTriangle,
              bg: 'amber-50',
              border: 'amber-200',
              icon_color: 'amber-700',
            },
            {
              variant: 'danger',
              icon: XCircle,
              bg: 'red-50',
              border: 'red-200',
              icon_color: 'red-600',
            },
          ].map(({ variant, icon, bg, border, icon_color }) => (
            <div key={variant} className="flex flex-col gap-2">
              <Banner variant={variant}>
                <BannerIcon icon={icon} />
                <BannerContent>
                  <BannerTitle>{variant.charAt(0).toUpperCase() + variant.slice(1)}</BannerTitle>
                </BannerContent>
              </Banner>
              <div className="flex gap-2 flex-wrap">
                <span className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">bg: {bg}</span>
                <span className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">
                  border: {border}
                </span>
                <span className="bg-gray-100 px-1.5 py-0.5 rounded font-mono">
                  icon: {icon_color}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* API Reference */}
      <section className="flex flex-col gap-6">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">API Reference</h2>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-gray-700">Banner</p>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-28">
                  Prop
                </th>
                <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-56">
                  Type
                </th>
                <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-20">
                  Default
                </th>
                <th className="text-left py-2 text-xs uppercase tracking-wide text-gray-500 font-medium">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                [
                  'variant',
                  '"info" | "success" | "warning" | "danger"',
                  '"info"',
                  'Controls the full color palette.',
                ],
                ['dismissible', 'boolean', 'false', 'Renders a close button at the trailing edge.'],
                ['onDismiss', '() => void', '—', 'Called when the close button is clicked.'],
                ['className', 'string', '—', 'Extra classes on the root div.'],
              ].map(([prop, type, def, desc]) => (
                <tr key={prop}>
                  <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">{prop}</td>
                  <td className="py-2.5 pr-4 font-mono text-xs text-gray-500">{type}</td>
                  <td className="py-2.5 pr-4 font-mono text-xs text-gray-400">{def}</td>
                  <td className="py-2.5 text-xs text-gray-600">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-gray-700">BannerIcon</p>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-28">
                  Prop
                </th>
                <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-56">
                  Type
                </th>
                <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-20">
                  Default
                </th>
                <th className="text-left py-2 text-xs uppercase tracking-wide text-gray-500 font-medium">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                ['icon', 'LucideIcon', 'required', 'Lucide icon component to render at size-5.'],
                [
                  'position',
                  '"top" | "center"',
                  '"center"',
                  'Vertical alignment. "top" = sejajar baris title; "center" = centered dengan seluruh konten.',
                ],
                ['className', 'string', '—', 'Extra classes on the icon wrapper span.'],
              ].map(([prop, type, def, desc]) => (
                <tr key={prop}>
                  <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">{prop}</td>
                  <td className="py-2.5 pr-4 font-mono text-xs text-gray-500">{type}</td>
                  <td className="py-2.5 pr-4 font-mono text-xs text-gray-400">{def}</td>
                  <td className="py-2.5 text-xs text-gray-600">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex flex-col gap-3 mt-2">
            <span className="text-xs text-gray-400">
              position=&quot;center&quot; — icon centered with full content (default)
            </span>
            <Banner variant="info">
              <BannerIcon icon={Info} position="center" />
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

            <span className="text-xs text-gray-400">
              position=&quot;top&quot; — icon sejajar dengan baris title
            </span>
            <Banner variant="info">
              <BannerIcon icon={Info} position="top" />
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
          </div>
        </div>

        <p className="text-sm text-gray-500">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">BannerContent</code>,{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">BannerTitle</code>,{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">BannerDescription</code>,{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">BannerAction</code>, and{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">BannerClose</code> accept{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">children</code> and{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">className</code> only. Color
          is inherited from the parent{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">Banner</code> via context.
        </p>
      </section>
    </div>
  ),
}
