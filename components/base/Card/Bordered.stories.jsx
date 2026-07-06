import { AlertTriangle, CheckCircle2, Info, Package, XCircle } from 'lucide-react'
import Card, { CardContent, CardDescription, CardHeader, CardIcon, CardTitle } from './Card'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Card/Bordered',
}

export default meta

const VARIANTS = [
  { variant: 'shell', icon: Package, label: 'shell' },
  { variant: 'transparent', icon: Package, label: 'transparent' },
  { variant: 'info', icon: Info, label: 'info' },
  { variant: 'success', icon: CheckCircle2, label: 'success' },
  { variant: 'warning', icon: AlertTriangle, label: 'warning' },
  { variant: 'danger', icon: XCircle, label: 'danger' },
  { variant: 'muted', icon: Package, label: 'muted' },
]

export const BorderedProp = {
  name: 'Bordered prop',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">bordered</code> prop
        controls the outer border independently of{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant</code>. Default is{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">true</code> for all variants
        except <code className="font-mono bg-gray-100 px-1 rounded text-xs">transparent</code>{' '}
        (which defaults to <code className="font-mono bg-gray-100 px-1 rounded text-xs">false</code>
        ). Background color and radius are always preserved.
      </p>

      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-2 gap-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide col-span-1 text-center pb-1">
            bordered (default)
          </p>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide col-span-1 text-center pb-1">
            bordered={'{false}'}
          </p>

          {VARIANTS.map(({ variant, icon, label }) => (
            <>
              <Card key={`${variant}-on`} variant={variant}>
                <CardHeader>
                  <CardIcon icon={icon} />
                  <div className="min-w-0 flex-1">
                    <CardTitle>{label}</CardTitle>
                    <CardDescription>default bordered</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-slate-500">Background and border visible.</p>
                </CardContent>
              </Card>

              <Card key={`${variant}-off`} variant={variant} bordered={false}>
                <CardHeader>
                  <CardIcon icon={icon} />
                  <div className="min-w-0 flex-1">
                    <CardTitle>{label}</CardTitle>
                    <CardDescription>bordered={'{false}'}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-slate-500">Background preserved, border removed.</p>
                </CardContent>
              </Card>
            </>
          ))}
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* no border, keep shell background */}
<Card bordered={false}>...</Card>

{/* transparent with border */}
<Card variant="transparent" bordered>...</Card>

{/* danger card, border removed */}
<Card variant="danger" bordered={false}>...</Card>`}</code>
      </pre>
    </div>
  ),
}
