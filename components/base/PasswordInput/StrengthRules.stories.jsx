'use client'
import { useState } from 'react'
import PasswordInput, { DEFAULT_STRENGTH_RULES } from './PasswordInput'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldDescription from '../Field/FieldDescription'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Input/Password Input/Strength Rules' }
export default meta

// ─── Rule sets ───────────────────────────────────────────────────────────────

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

function RuleDemo({ label, description, rules, placeholder, meterVariant = 'bars' }) {
  const [value, setValue] = useState('')
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-col gap-0.5 mb-1">
        <p className="text-xs font-semibold text-gray-700">{label}</p>
        <p className="text-[11px] text-gray-400">{description}</p>
      </div>
      <FieldContent size="base">
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

// ─── Stories ─────────────────────────────────────────────────────────────────

export const StrengthRules = {
  name: 'Strength Rules',
  render: () => (
    <div className="flex flex-col items-center gap-10 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Pass a <code className="font-mono bg-gray-100 px-1 rounded text-xs">strengthRules</code>{' '}
        array to customise how the score is calculated. Each passing rule adds to the score; the
        total is scaled to 0–5 automatically.
      </p>

      {/* Bars variant */}
      <div className="flex flex-col gap-2 w-full max-w-2xl">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          meterVariant="bars"
        </p>
        <div className="grid grid-cols-2 gap-6 p-6 bg-gray-50 border border-gray-200 rounded-xl">
          {RULE_SETS.map((rs) => (
            <RuleDemo key={rs.key} {...rs} meterVariant="bars" />
          ))}
        </div>
      </div>

      {/* Full variant */}
      <div className="flex flex-col gap-2 w-full max-w-2xl">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          meterVariant="full"
        </p>
        <div className="grid grid-cols-2 gap-6 p-6 bg-gray-50 border border-gray-200 rounded-xl">
          {RULE_SETS.map((rs) => (
            <RuleDemo key={rs.key} {...rs} meterVariant="full" />
          ))}
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`import PasswordInput, { DEFAULT_STRENGTH_RULES } from '@/components/base/PasswordInput/PasswordInput'

// simple — fewer rules, easier to satisfy
const SIMPLE_RULES = [
  (v) => v.length >= 6,
  (v) => /[A-Z]/.test(v),
  (v) => /[0-9]/.test(v),
]

// extend — add on top of defaults
const EXTENDED_RULES = [
  ...DEFAULT_STRENGTH_RULES,
  (v) => v.length >= 16,
]

// digits-only PIN
const PIN_RULES = [
  (v) => /^\\d+$/.test(v),
  (v) => v.length >= 4,
  (v) => v.length >= 6,
  (v) => new Set(v).size >= 4,
]

<PasswordInput strengthMeter strengthRules={SIMPLE_RULES} />
<PasswordInput strengthMeter strengthRules={EXTENDED_RULES} meterVariant="full" />
<PasswordInput strengthMeter strengthRules={PIN_RULES} />`}</code>
      </pre>
    </div>
  ),
}
