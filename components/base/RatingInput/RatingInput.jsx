'use client'

import { useState } from 'react'
import { clsx } from 'clsx'
import { Star } from 'lucide-react'
import { useFieldContentContext } from '../Field/FieldContent'

// ─── Size config ───────────────────────────────────────────────────────────────

const SIZE = {
  sm: { star: 'size-4', gap: 'gap-0.5', num: 'size-6 text-xs' },
  base: { star: 'size-6', gap: 'gap-1', num: 'size-8 text-sm' },
  md: { star: 'size-8', gap: 'gap-1.5', num: 'size-10 text-sm' },
}

// ─── StarItem ─────────────────────────────────────────────────────────────────

function StarItem({
  starNum,
  displayValue,
  allowHalf,
  sizeClass,
  interactive,
  onMouseMove,
  onMouseLeave,
  onClick,
}) {
  const isFull = displayValue >= starNum
  const isHalf = !isFull && allowHalf && displayValue >= starNum - 0.5

  const getPosition = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    return allowHalf && e.clientX - rect.left < rect.width / 2 ? starNum - 0.5 : starNum
  }

  return (
    <div
      className={clsx('relative shrink-0', sizeClass, interactive && 'cursor-pointer')}
      onClick={interactive ? (e) => onClick(getPosition(e)) : undefined}
      onMouseMove={interactive ? (e) => onMouseMove(getPosition(e)) : undefined}
      onMouseLeave={interactive ? onMouseLeave : undefined}
    >
      <Star className="size-full text-gray-200 fill-gray-100" />
      {(isFull || isHalf) && (
        <div
          className="absolute inset-0"
          style={isHalf ? { clipPath: 'inset(0 50% 0 0)' } : undefined}
        >
          <Star className="size-full text-amber-400 fill-amber-400" />
        </div>
      )}
    </div>
  )
}

// ─── NumberItem ───────────────────────────────────────────────────────────────

function NumberItem({
  num,
  displayValue,
  sizeClass,
  interactive,
  disabled,
  onMouseEnter,
  onMouseLeave,
  onClick,
}) {
  const isActive = num <= displayValue

  return (
    <button
      type="button"
      disabled={!interactive}
      onClick={() => onClick(num)}
      onMouseEnter={() => onMouseEnter(num)}
      onMouseLeave={onMouseLeave}
      className={clsx(
        'rounded font-medium transition-colors flex items-center justify-center shrink-0',
        sizeClass,
        isActive
          ? 'bg-violet-600 text-white'
          : 'bg-gray-100 text-gray-500 hover:bg-violet-50 hover:text-violet-600',
        disabled && 'opacity-50',
        !interactive && 'pointer-events-none'
      )}
    >
      {num}
    </button>
  )
}

// ─── RatingInput ──────────────────────────────────────────────────────────────

export default function RatingInput({
  value = null,
  onChange,
  style = 'star',
  max = 5,
  allowHalf = false,
  readOnly = false,
  clearable = true,
  size: sizeProp,
  disabled: disabledProp = false,
  className,
}) {
  const [hoverValue, setHoverValue] = useState(null)

  const { disabled: ctxDisabled, size: ctxSize } = useFieldContentContext()
  const isDisabled = ctxDisabled || disabledProp
  const resolvedSize = sizeProp ?? ctxSize ?? 'base'
  const cfg = SIZE[resolvedSize] ?? SIZE.base
  const interactive = !readOnly && !isDisabled

  const handleClick = (clicked) => {
    if (!interactive) return
    if (clearable && clicked === value) {
      onChange?.(null)
    } else {
      onChange?.(clicked)
    }
  }

  const displayValue = hoverValue ?? value ?? 0

  return (
    <div
      className={clsx('inline-flex', cfg.gap, isDisabled && 'opacity-50', className)}
      onMouseLeave={() => setHoverValue(null)}
    >
      {Array.from({ length: max }, (_, i) => {
        const num = i + 1
        return style === 'star' ? (
          <StarItem
            key={num}
            starNum={num}
            displayValue={displayValue}
            allowHalf={allowHalf}
            sizeClass={cfg.star}
            interactive={interactive}
            onMouseMove={setHoverValue}
            onMouseLeave={() => setHoverValue(null)}
            onClick={handleClick}
          />
        ) : (
          <NumberItem
            key={num}
            num={num}
            displayValue={displayValue}
            sizeClass={cfg.num}
            interactive={interactive}
            disabled={isDisabled}
            onMouseEnter={setHoverValue}
            onMouseLeave={() => setHoverValue(null)}
            onClick={handleClick}
          />
        )
      })}
    </div>
  )
}

RatingInput.displayName = 'RatingInput'
