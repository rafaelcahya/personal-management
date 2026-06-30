import { useState } from 'react'
import { Zap, Shield, Package } from 'lucide-react'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/SelectCard/Basic',
}

export default meta

const cn = (...classes) => classes.filter(Boolean).join(' ')

const MockCard = ({
  layout = 'vertical',
  indicator = 'badge',
  selected = false,
  disabled = false,
  onClick,
  icon,
  title,
  description,
}) => {
  const isH = layout === 'horizontal'
  const isBadge = indicator === 'badge'
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={cn(
        'relative rounded-lg transition-all select-none',
        isH
          ? cn('flex items-center gap-4', isBadge && 'pr-12')
          : cn('flex flex-col gap-2.5', isBadge && 'pr-8'),
        selected
          ? 'border border-violet-600 ring-2 ring-violet-200 bg-violet-50/40 p-4'
          : 'border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      )}
    >
      {isBadge && (
        <div
          className={cn(
            'absolute size-5 rounded-full flex items-center justify-center transition-all bg-white',
            isH ? 'right-4 top-1/2 -translate-y-1/2' : 'top-3 right-3',
            selected ? 'bg-violet-600' : 'border-2 border-gray-300'
          )}
        >
          {selected && <span className="size-2 rounded-full bg-white block" />}
        </div>
      )}
      {icon && (
        <div
          className={cn(
            'flex items-center justify-center rounded-md shrink-0 size-9',
            selected ? 'bg-violet-100 text-violet-600' : 'bg-gray-100 text-gray-500'
          )}
        >
          {icon}
        </div>
      )}
      <div className={cn(isH && 'flex-1', 'flex flex-col gap-0.5')}>
        <p className="text-sm font-medium leading-snug text-gray-900">{title}</p>
        {description && <p className="text-xs text-muted-foreground leading-snug">{description}</p>}
      </div>
    </div>
  )
}

const plans = [
  {
    value: 'starter',
    icon: <Package className="size-5" />,
    title: 'Starter',
    description: 'For individuals and small projects.',
  },
  {
    value: 'pro',
    icon: <Zap className="size-5" />,
    title: 'Pro',
    description: 'For growing teams and businesses.',
  },
  {
    value: 'enterprise',
    icon: <Shield className="size-5" />,
    title: 'Enterprise',
    description: 'Custom scale for large orgs.',
  },
]

export const Basic = {
  name: 'Basic',
  render: () => {
    const [selected, setSelected] = useState('pro')
    return (
      <div className="flex flex-col items-center gap-6 w-full">
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
          Default layout is{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">vertical</code> with{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">badge</code> indicator. Click
          a card to select it.
        </p>

        <div className="grid grid-cols-3 gap-3 w-full max-w-lg">
          {plans.map((p) => (
            <MockCard
              key={p.value}
              selected={selected === p.value}
              onClick={() => setSelected(p.value)}
              icon={p.icon}
              title={p.title}
              description={p.description}
            />
          ))}
        </div>

        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
          <code>{`const [selected, setSelected] = useState('pro')

<div className="grid grid-cols-3 gap-3">
  {plans.map((p) => (
    <SelectCard
      key={p.value}
      value={p.value}
      selected={selected === p.value}
      onSelect={setSelected}
    >
      <SelectCardIcon>{p.icon}</SelectCardIcon>
      <SelectCardTitle>{p.title}</SelectCardTitle>
      <SelectCardDescription>{p.description}</SelectCardDescription>
    </SelectCard>
  ))}
</div>`}</code>
        </pre>
      </div>
    )
  },
}
