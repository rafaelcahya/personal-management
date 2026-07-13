import { AlertTriangle, CheckCircle2, Info, Package, XCircle } from 'lucide-react'
import Card, { CardContent, CardDescription, CardHeader, CardIcon, CardTitle } from './Card'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Card/Bordered',
}

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
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
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

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use bordered={false} when nesting inside another card',
                body: "When nesting a card inside another card's CardContent, the outer card already provides the visual boundary. Adding bordered={false} removes the redundant inner border without losing the background.",
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't toggle bordered at runtime based on data",
                body: 'bordered is a structural, design-time decision determined by nesting context — not a state that changes based on content. Switching it at runtime causes unexpected layout shifts.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'The bordered prop is purely visual — no effect on ARIA or focus',
                body: 'Removing or adding a border has no impact on screen reader behavior or keyboard navigation. The card still renders the same semantic structure regardless of this prop.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use bordered on transparent cards when you need a visible edge',
                body: 'transparent defaults to bordered={false}. Pass bordered (or bordered={true}) explicitly when the transparent card needs a visible edge — e.g. a filter strip or search bar below a section header.',
              },
            ],
          },
        ]}
      />

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
