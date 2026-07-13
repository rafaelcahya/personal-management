'use client'
import { useState } from 'react'
import PasswordInput, { DEFAULT_STRENGTH_RULES } from './PasswordInput'
import FieldContent from '../Field/FieldContent'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Input/Password Input/Strength Rules' }
export default meta

const RULE_SETS = [
  {
    key: 'default',
    label: 'Default (5 rules)',
    description: 'length ≥8, length ≥12, uppercase, number, symbol',
    rules: DEFAULT_STRENGTH_RULES,
    placeholder: 'e.g. Hello123!',
  },
  {
    key: 'simple',
    label: 'Simple (3 rules)',
    description: 'length ≥6, uppercase, number',
    rules: [(v) => v.length >= 6, (v) => /[A-Z]/.test(v), (v) => /[0-9]/.test(v)],
    placeholder: 'e.g. Hello1',
  },
  {
    key: 'extended',
    label: 'Extended (6 rules)',
    description: 'default + length ≥16',
    rules: [...DEFAULT_STRENGTH_RULES, (v) => v.length >= 16],
    placeholder: 'e.g. MyVeryLongPass1!',
  },
  {
    key: 'pin',
    label: 'PIN / Digits only (4 rules)',
    description: 'digits only, length ≥4, length ≥6, ≥4 unique digits',
    rules: [
      (v) => /^\d+$/.test(v),
      (v) => v.length >= 4,
      (v) => v.length >= 6,
      (v) => new Set(v).size >= 4,
    ],
    placeholder: 'e.g. 183920',
  },
]

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

function RuleDemo({ label, description, rules, placeholder, meterVariant = 'bars' }) {
  const [value, setValue] = useState('')
  return (
    <div className="flex flex-col gap-1.5">
      <div className="mb-1">
        <p className="text-xs font-semibold text-gray-700">{label}</p>
        <p className="text-[11px] text-gray-400">{description}</p>
      </div>
      <FieldContent>
        <PasswordInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          strengthMeter
          strengthRules={rules}
          meterVariant={meterVariant}
        />
      </FieldContent>
    </div>
  )
}

export const StrengthRules = {
  name: 'Strength Rules',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Pass a <code className="font-mono bg-gray-100 px-1 rounded text-xs">strengthRules</code>{' '}
        array to customise how the score is calculated. Each rule is a function{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          (v: string) =&gt; boolean
        </code>
        . Each passing rule adds to the score, which is scaled to 0–5 automatically — so 3 rules or
        10 rules both produce a full range.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">4 rule sets — bars variant</span>
        <div className="grid grid-cols-2 gap-5 p-4 bg-gray-50 border border-gray-200 rounded-lg max-w-2xl">
          {RULE_SETS.map((rs) => (
            <RuleDemo key={rs.key} {...rs} meterVariant="bars" />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">same rule sets — full variant</span>
        <div className="grid grid-cols-2 gap-5 p-4 bg-gray-50 border border-gray-200 rounded-lg max-w-2xl">
          {RULE_SETS.map((rs) => (
            <RuleDemo key={rs.key} {...rs} meterVariant="full" />
          ))}
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use custom strengthRules to match your backend password policy exactly',
                body: 'The default rules are a sensible baseline. Override them when your policy has specific requirements — minimum length, no repeating digits for PINs, or an extended passphrase length requirement.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title:
                  "Don't use strengthRules without strengthMeter — the rules have no visual effect",
                body: 'strengthRules only controls how the score is calculated. Without strengthMeter={true}, the meter is never shown and the rules serve no purpose.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'Document the rules in FieldDescription so screen reader users know the requirements',
                body: 'The strength meter is visual-only. Add a FieldDescription listing the password requirements (e.g. "Minimum 8 characters, one uppercase letter, one number") so screen reader users know what they need to satisfy.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Extend DEFAULT_STRENGTH_RULES rather than replacing them entirely',
                body: 'The defaults cover the most common requirements. Spreading them and appending one or two extra rules is easier to maintain and avoids rewriting the base logic.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`import PasswordInput, { DEFAULT_STRENGTH_RULES } from '@/components/base/PasswordInput/PasswordInput'

// extend the defaults with one extra rule
const EXTENDED_RULES = [
  ...DEFAULT_STRENGTH_RULES,
  (v) => v.length >= 16,
]

// simple 3-rule set
const SIMPLE_RULES = [
  (v) => v.length >= 6,
  (v) => /[A-Z]/.test(v),
  (v) => /[0-9]/.test(v),
]

// digits-only PIN
const PIN_RULES = [
  (v) => /^\\d+$/.test(v),
  (v) => v.length >= 4,
  (v) => v.length >= 6,
  (v) => new Set(v).size >= 4,
]

<PasswordInput strengthMeter strengthRules={EXTENDED_RULES} />
<PasswordInput strengthMeter strengthRules={PIN_RULES} meterVariant="full" />`}</code>
      </pre>
    </div>
  ),
}
