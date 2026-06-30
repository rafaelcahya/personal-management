import { useState } from 'react'
import { Zap, Shield, Package, Truck, Star } from 'lucide-react'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/SelectCard/Orientation',
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

export const Orientation = {
  name: 'Orientation',
  render: () => {
    const [verticalSelected, setVerticalSelected] = useState('pro')
    const [horizontalSelected, setHorizontalSelected] = useState('express')

    const plans = [
      {
        value: 'starter',
        icon: <Package className="size-5" />,
        title: 'Starter',
        description: 'For individuals.',
      },
      {
        value: 'pro',
        icon: <Zap className="size-5" />,
        title: 'Pro',
        description: 'For growing teams.',
      },
      {
        value: 'enterprise',
        icon: <Shield className="size-5" />,
        title: 'Enterprise',
        description: 'Custom scale.',
      },
    ]

    const methods = [
      {
        value: 'standard',
        icon: <Package className="size-5" />,
        title: 'Standard delivery',
        description: '3–5 business days · Free',
      },
      {
        value: 'express',
        icon: <Truck className="size-5" />,
        title: 'Express delivery',
        description: '1–2 business days · Rp 25.000',
      },
      {
        value: 'overnight',
        icon: <Star className="size-5" />,
        title: 'Overnight delivery',
        description: 'Next business day · Rp 75.000',
      },
    ]

    return (
      <div className="flex flex-col items-center gap-10 w-full">
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
          Two layout orientations controlled by the{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">layout</code> prop. Default
          is <code className="font-mono bg-gray-100 px-1 rounded text-xs">vertical</code>.
        </p>

        {/* Vertical */}
        <div className="flex flex-col gap-3 w-full max-w-lg">
          <p className="text-xs font-mono text-violet-700">layout="vertical"</p>
          <p className="text-xs text-gray-500">
            Icon on top, title and description below. Best for grid layouts like pricing or plan
            selection.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {plans.map((p) => (
              <MockCard
                key={p.value}
                layout="vertical"
                selected={verticalSelected === p.value}
                onClick={() => setVerticalSelected(p.value)}
                icon={p.icon}
                title={p.title}
                description={p.description}
              />
            ))}
          </div>
          <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
            <code>{`<SelectCard layout="vertical" value="pro" selected={selected === 'pro'} onSelect={setSelected}>
  <SelectCardIcon><Zap /></SelectCardIcon>
  <SelectCardTitle>Pro</SelectCardTitle>
  <SelectCardDescription>For growing teams.</SelectCardDescription>
</SelectCard>`}</code>
          </pre>
        </div>

        {/* Horizontal */}
        <div className="flex flex-col gap-3 w-full max-w-lg">
          <p className="text-xs font-mono text-violet-700">layout="horizontal"</p>
          <p className="text-xs text-gray-500">
            Icon on the left, title and description stacked on the right. Best for list layouts like
            shipping or payment methods.
          </p>
          <div className="flex flex-col gap-2 max-w-sm">
            {methods.map((m) => (
              <MockCard
                key={m.value}
                layout="horizontal"
                selected={horizontalSelected === m.value}
                onClick={() => setHorizontalSelected(m.value)}
                icon={m.icon}
                title={m.title}
                description={m.description}
              />
            ))}
          </div>
          <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
            <code>{`<SelectCard layout="horizontal" value="express" selected={selected === 'express'} onSelect={setSelected}>
  <SelectCardIcon><Truck /></SelectCardIcon>
  <SelectCardTitle>Express delivery</SelectCardTitle>
  <SelectCardDescription>1–2 business days · Rp 25.000</SelectCardDescription>
</SelectCard>`}</code>
          </pre>
        </div>
      </div>
    )
  },
}
