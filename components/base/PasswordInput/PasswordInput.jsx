'use client'

import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import Input from '../Input/Input'
import FieldControl from '../Field/FieldControl'
import FieldSuffix from '../Field/FieldSuffix'

export const DEFAULT_STRENGTH_RULES = [
  (v) => v.length >= 8,
  (v) => v.length >= 12,
  (v) => /[A-Z]/.test(v),
  (v) => /[0-9]/.test(v),
  (v) => /[^A-Za-z0-9]/.test(v),
]

function calcStrength(pwd, rules) {
  if (!pwd) return 0
  const passed = rules.filter((rule) => rule(pwd)).length
  return Math.round((passed / rules.length) * 5)
}

const STRENGTH = [
  { label: 'Weak', color: 'bg-red-400', text: 'text-red-600', hex: '#f87171' },
  { label: 'Weak', color: 'bg-red-400', text: 'text-red-600', hex: '#f87171' },
  { label: 'Weak', color: 'bg-red-400', text: 'text-red-600', hex: '#f87171' },
  { label: 'Fair', color: 'bg-amber-400', text: 'text-amber-600', hex: '#fbbf24' },
  { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-600', hex: '#10b981' },
  { label: 'Very Strong', color: 'bg-emerald-600', text: 'text-emerald-700', hex: '#059669' },
]

const PasswordInput = forwardRef(function PasswordInput(
  {
    value,
    onChange,
    defaultValue,
    strengthMeter = false,
    strengthRules = DEFAULT_STRENGTH_RULES,
    meterVariant = 'bars',
    size,
    variant,
    className,
    ...props
  },
  ref
) {
  const [show, setShow] = useState(false)
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  function handleChange(e) {
    if (!isControlled) setInternalValue(e.target.value)
    onChange?.(e)
  }

  const score = strengthMeter && currentValue ? calcStrength(currentValue, strengthRules) : 0
  const strengthInfo = STRENGTH[score]

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <FieldControl>
        <Input
          ref={ref}
          type={show ? 'text' : 'password'}
          value={isControlled ? value : undefined}
          defaultValue={!isControlled ? defaultValue : undefined}
          onChange={handleChange}
          size={size}
          variant={variant}
          className={className}
          {...props}
        />
        <FieldSuffix
          role="button"
          tabIndex={0}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="pointer-events-auto cursor-pointer hover:text-foreground transition-colors"
          onClick={() => setShow((s) => !s)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setShow((s) => !s)
            }
          }}
        >
          {show ? <EyeOff /> : <Eye />}
        </FieldSuffix>
      </FieldControl>

      {strengthMeter && currentValue && (
        <div className="flex flex-col gap-1">
          {meterVariant === 'full' ? (
            <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(score / 5) * 100}%`,
                  backgroundColor: strengthInfo.hex,
                  transition: 'width 0.4s ease-out, background-color 0.4s ease-out',
                }}
              />
            </div>
          ) : (
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-1 flex-1 rounded-full transition-colors duration-300',
                    i < score ? strengthInfo.color : 'bg-gray-200'
                  )}
                />
              ))}
            </div>
          )}
          <p className={cn('text-xs font-medium', strengthInfo.text)}>{strengthInfo.label}</p>
        </div>
      )}
    </div>
  )
})

PasswordInput.displayName = 'PasswordInput'

export default PasswordInput
