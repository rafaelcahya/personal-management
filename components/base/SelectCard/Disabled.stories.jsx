import { useState } from 'react'
import { Zap, Shield, Package } from 'lucide-react'
import { SelectCard, SelectCardIcon, SelectCardTitle, SelectCardDescription } from './SelectCard'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/SelectCard/Disabled',
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

export const Disabled = {
  name: 'Disabled',
  render: () => {
    const [selected, setSelected] = useState('pro')
    return (
      <div className="flex flex-col gap-6 w-full">
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
          Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">disabled</code> to
          prevent interaction. The card dims and cursor becomes{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">not-allowed</code>. The
          selected state is preserved visually — a disabled selected card stays highlighted.
        </p>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">
            disabled unselected, disabled selected, active
          </span>
          <div className="grid grid-cols-3 gap-3 max-w-lg">
            <SelectCard value="starter" selected={false} onSelect={setSelected} disabled>
              <SelectCardIcon>
                <Package className="size-5" />
              </SelectCardIcon>
              <SelectCardTitle>Starter</SelectCardTitle>
              <SelectCardDescription>For individuals.</SelectCardDescription>
            </SelectCard>
            <SelectCard value="pro" selected={true} onSelect={setSelected} disabled>
              <SelectCardIcon>
                <Zap className="size-5" />
              </SelectCardIcon>
              <SelectCardTitle>Pro</SelectCardTitle>
              <SelectCardDescription>For growing teams.</SelectCardDescription>
            </SelectCard>
            <SelectCard
              value="enterprise"
              selected={selected === 'enterprise'}
              onSelect={setSelected}
            >
              <SelectCardIcon>
                <Shield className="size-5" />
              </SelectCardIcon>
              <SelectCardTitle>Enterprise</SelectCardTitle>
              <SelectCardDescription>Custom scale.</SelectCardDescription>
            </SelectCard>
          </div>
        </div>

        <BestPractices
          items={[
            {
              heading: 'When to use',
              cards: [
                {
                  title:
                    'Disable a card when the option exists but is not available in the current context',
                  body: "A locked plan tier, an out-of-stock shipping method, or an option restricted by the user's region should be visible but non-interactive. This shows what exists without hiding it.",
                },
              ],
            },
            {
              heading: 'When not to use',
              cards: [
                {
                  title: "Don't disable a card the user is expected to select to proceed",
                  body: 'If the user must pick an option to continue, show it enabled. Disabling the only viable path traps users.',
                },
                {
                  title: "Don't hide unavailable options when seeing them is informative",
                  body: 'A disabled "Enterprise" card tells users the tier exists but is locked. Hiding it entirely removes context that might help the user understand what to upgrade to.',
                },
              ],
            },
            {
              heading: 'Advice',
              cards: [
                {
                  title: 'Explain why the option is disabled if it may surprise the user',
                  body: 'A tooltip or nearby helper text ("Not available in your region" or "Upgrade to unlock") prevents confusion when users see a dimmed card they cannot click.',
                },
              ],
            },
          ]}
        />

        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
          <code>{`{/* Disabled — cannot be clicked, unselected */}
<SelectCard value="starter" disabled selected={false} onSelect={setSelected}>
  <SelectCardIcon><Package /></SelectCardIcon>
  <SelectCardTitle>Starter</SelectCardTitle>
  <SelectCardDescription>For individuals.</SelectCardDescription>
</SelectCard>

{/* Disabled + selected — shows selected state but non-interactive */}
<SelectCard value="pro" disabled selected={true} onSelect={setSelected}>
  <SelectCardIcon><Zap /></SelectCardIcon>
  <SelectCardTitle>Pro</SelectCardTitle>
  <SelectCardDescription>For growing teams.</SelectCardDescription>
</SelectCard>`}</code>
        </pre>
      </div>
    )
  },
}
