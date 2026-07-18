import { Package } from 'lucide-react'
import Card, { CardContent, CardDescription, CardHeader, CardIcon, CardTitle } from './Card'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Card/Card',
}

export default meta

const COMBOS = [
  {
    label: 'Border + Shadow',
    props: {},
    desc: 'Default — bordered and shadow both on',
    code: '<Card>',
  },
  {
    label: 'Border only',
    props: { shadow: false },
    desc: 'Shadow removed, border preserved',
    code: '<Card shadow={false}>',
  },
  {
    label: 'Shadow only',
    props: { bordered: false },
    desc: 'Border removed, shadow preserved',
    code: '<Card bordered={false}>',
  },
  {
    label: 'Flat',
    props: { bordered: false, shadow: false },
    desc: 'No border, no shadow',
    code: '<Card bordered={false} shadow={false}>',
  },
]

export const ShadowProp = {
  name: 'Shadow prop',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">shadow</code> prop controls
        the card drop shadow independently of{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">bordered</code>. Both props
        default to <code className="font-mono bg-gray-100 px-1 rounded text-xs">true</code> for all
        variants except{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">transparent</code>, which is
        always flat.
      </p>

      <div className="grid grid-cols-2 gap-4 w-full max-w-3xl">
        {COMBOS.map(({ label, props, desc, code }) => (
          <div key={label} className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
            <Card {...props}>
              <CardHeader>
                <CardIcon icon={Package} />
                <div className="min-w-0 flex-1">
                  <CardTitle>{label}</CardTitle>
                  <CardDescription>{desc}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <code className="text-xs font-mono text-slate-500">{code}</code>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* border ✓  shadow ✓  — default */}
<Card>...</Card>

{/* border ✓  shadow ✗ */}
<Card shadow={false}>...</Card>

{/* border ✗  shadow ✓ */}
<Card bordered={false}>...</Card>

{/* border ✗  shadow ✗  — flat */}
<Card bordered={false} shadow={false}>...</Card>

{/* transparent is always flat regardless of props */}
<Card variant="transparent">...</Card>`}</code>
      </pre>
    </div>
  ),
}
