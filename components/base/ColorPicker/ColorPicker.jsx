'use client'

import { useRef, useState, useCallback, forwardRef } from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { cva } from 'class-variance-authority'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { useFieldContentContext } from '../Field/FieldContent'
import { hsvToRgb, toOutput, fromInput, displayText } from './colorUtils'

// ─── Trigger variants ─────────────────────────────────────────────────────────

const triggerVariants = cva(
  [
    'flex w-full items-center gap-2 whitespace-nowrap',
    'rounded-md border bg-background text-foreground',
    'text-sm font-medium cursor-pointer',
    'transition-[color,box-shadow,border-color] duration-150',
    'outline-none',
    'focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:border-violet-600',
  ],
  {
    variants: {
      variant: {
        default: 'border-input',
        error:
          'border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive',
        disabled: 'border-input opacity-50 cursor-not-allowed pointer-events-none bg-muted',
      },
      size: {
        xs: 'h-6 px-2 text-xs rounded',
        sm: 'h-7 px-2.5 text-xs rounded-md',
        base: 'h-8 px-3 text-sm rounded-md',
        md: 'h-9 px-3.5 text-sm rounded-md',
        lg: 'h-10 px-4 text-sm rounded-md',
      },
    },
    defaultVariants: { variant: 'default', size: 'base' },
  }
)

// ─── Saturation / Value canvas ────────────────────────────────────────────────

function SatValPicker({ h, s, v, onChange }) {
  const ref = useRef(null)
  const dragging = useRef(false)

  const update = useCallback(
    (e) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const ns = Math.round(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * 100)
      const nv = Math.round(
        Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height)) * 100
      )
      onChange(ns, nv)
    },
    [onChange]
  )

  return (
    <div
      ref={ref}
      className="relative rounded overflow-hidden cursor-crosshair select-none"
      style={{ height: 152 }}
      onPointerDown={(e) => {
        dragging.current = true
        e.currentTarget.setPointerCapture(e.pointerId)
        update(e)
      }}
      onPointerMove={(e) => {
        if (dragging.current) update(e)
      }}
      onPointerUp={() => {
        dragging.current = false
      }}
    >
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(to right, #fff, hsl(${h}, 100%, 50%))` }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, transparent, #000)' }}
      />
      <div
        className="absolute w-3 h-3 rounded-full border-2 border-white shadow pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${s}%`, top: `${100 - v}%` }}
      />
    </div>
  )
}

// ─── Hue slider ───────────────────────────────────────────────────────────────

function HueSlider({ h, onChange }) {
  const ref = useRef(null)
  const dragging = useRef(false)

  const update = useCallback(
    (e) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      onChange(Math.round(x * 360))
    },
    [onChange]
  )

  return (
    <div
      ref={ref}
      className="relative h-3 rounded-full cursor-ew-resize select-none"
      style={{ background: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)' }}
      onPointerDown={(e) => {
        dragging.current = true
        e.currentTarget.setPointerCapture(e.pointerId)
        update(e)
      }}
      onPointerMove={(e) => {
        if (dragging.current) update(e)
      }}
      onPointerUp={() => {
        dragging.current = false
      }}
    >
      <div
        className="absolute top-1/2 w-3 h-3 rounded-full border-2 border-white shadow pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${(h / 360) * 100}%` }}
      />
    </div>
  )
}

// ─── Alpha slider ─────────────────────────────────────────────────────────────

function AlphaSlider({ h, s, v, a, onChange }) {
  const ref = useRef(null)
  const dragging = useRef(false)
  const { r, g, b } = hsvToRgb(h, s, v)

  const update = useCallback(
    (e) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      onChange(+x.toFixed(2))
    },
    [onChange]
  )

  return (
    <div className="relative h-3 rounded-full select-none overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%)',
          backgroundSize: '8px 8px',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right, rgba(${r},${g},${b},0), rgba(${r},${g},${b},1))`,
        }}
      />
      <div
        ref={ref}
        className="absolute inset-0 cursor-ew-resize"
        onPointerDown={(e) => {
          dragging.current = true
          e.currentTarget.setPointerCapture(e.pointerId)
          update(e)
        }}
        onPointerMove={(e) => {
          if (dragging.current) update(e)
        }}
        onPointerUp={() => {
          dragging.current = false
        }}
      />
      <div
        className="absolute top-1/2 w-3 h-3 rounded-full border-2 border-white shadow pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${a * 100}%` }}
      />
    </div>
  )
}

// ─── ColorPicker ──────────────────────────────────────────────────────────────

const ColorPicker = forwardRef(function ColorPicker(
  {
    value,
    defaultValue,
    onChange,
    format = 'hex',
    withAlpha = false,
    size: sizeProp,
    variant: variantProp,
    presets,
    className,
    disabled: disabledProp,
    ...props
  },
  ref
) {
  const ctx = useFieldContentContext()
  const resolvedSize = sizeProp ?? ctx.size ?? 'base'
  const isDisabled = ctx.disabled || disabledProp
  const resolvedVariant =
    variantProp ?? (ctx.hasError ? 'error' : isDisabled ? 'disabled' : 'default')

  const isControlled = value !== undefined
  const [internalHsva, setInternalHsva] = useState(() => fromInput(value ?? defaultValue, format))
  const hsva = isControlled ? fromInput(value, format) : internalHsva
  const { h, s, v, a } = hsva

  const [formatMode, setFormatMode] = useState(format)
  const [inputFocused, setInputFocused] = useState(false)
  const [inputText, setInputText] = useState('')

  const fireChange = useCallback(
    (newHsva) => {
      if (!isControlled) setInternalHsva(newHsva)
      onChange?.(toOutput(newHsva.h, newHsva.s, newHsva.v, newHsva.a, format, withAlpha))
    },
    [isControlled, onChange, format, withAlpha]
  )

  const currentDisplay = displayText(h, s, v, a, formatMode, withAlpha)
  const { r, g, b } = hsvToRgb(h, s, v)
  const swatchBg = withAlpha ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`

  const parseAndApply = (text) => {
    try {
      let parsed
      if (formatMode === 'hex') {
        parsed = fromInput(text.trim(), 'hex')
      } else if (formatMode === 'rgb') {
        const m = text.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/)
        if (m)
          parsed = fromInput(
            { r: +m[1], g: +m[2], b: +m[3], a: m[4] !== undefined ? +m[4] : 1 },
            'rgb'
          )
      } else if (formatMode === 'hsl') {
        const m = text.match(/hsla?\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?(?:\s*,\s*([\d.]+))?\s*\)/)
        if (m)
          parsed = fromInput(
            { h: +m[1], s: +m[2], l: +m[3], a: m[4] !== undefined ? +m[4] : 1 },
            'hsl'
          )
      }
      if (parsed) fireChange(parsed)
    } catch {}
  }

  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>
        <button
          ref={ref}
          type="button"
          id={ctx.id}
          disabled={isDisabled}
          aria-invalid={ctx.hasError || undefined}
          aria-required={ctx.required || undefined}
          aria-describedby={[ctx.descriptionId, ctx.errorId].filter(Boolean).join(' ') || undefined}
          className={twMerge(
            clsx(triggerVariants({ variant: resolvedVariant, size: resolvedSize }), className)
          )}
          {...props}
        >
          <span
            className="shrink-0 size-4 rounded border border-black/10"
            style={{ background: swatchBg }}
          />
          <span className="font-mono text-xs truncate">
            {displayText(h, s, v, a, 'hex', false).toUpperCase()}
          </span>
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          sideOffset={6}
          align="start"
          className={clsx(
            'z-50 w-60 rounded-lg border border-border bg-popover shadow-xl p-3',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2'
          )}
        >
          <SatValPicker
            h={h}
            s={s}
            v={v}
            onChange={(ns, nv) => fireChange({ h, s: ns, v: nv, a })}
          />

          <div className="flex flex-col gap-2 mt-3">
            <HueSlider h={h} onChange={(nh) => fireChange({ h: nh, s, v, a })} />
            {withAlpha && (
              <AlphaSlider
                h={h}
                s={s}
                v={v}
                a={a}
                onChange={(na) => fireChange({ h, s, v, a: na })}
              />
            )}
          </div>

          <div className="flex items-center gap-1.5 mt-3">
            <select
              value={formatMode}
              onChange={(e) => setFormatMode(e.target.value)}
              className={clsx(
                'h-7 rounded border border-input bg-background px-1.5',
                'text-xs font-medium text-foreground cursor-pointer',
                'outline-none focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:border-violet-600'
              )}
            >
              <option value="hex">HEX</option>
              <option value="rgb">RGB</option>
              <option value="hsl">HSL</option>
            </select>
            <input
              type="text"
              value={inputFocused ? inputText : currentDisplay}
              onFocus={() => {
                setInputFocused(true)
                setInputText(currentDisplay)
              }}
              onChange={(e) => setInputText(e.target.value)}
              onBlur={() => {
                parseAndApply(inputText)
                setInputFocused(false)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  parseAndApply(inputText)
                  setInputFocused(false)
                }
              }}
              className={clsx(
                'flex-1 h-7 min-w-0 rounded border border-input bg-background px-2',
                'text-xs font-mono text-foreground',
                'outline-none focus-visible:ring-2 focus-visible:ring-violet-200 focus-visible:border-violet-600'
              )}
            />
          </div>

          {presets?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border">
              {presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  title={preset}
                  className={clsx(
                    'size-5 rounded border border-black/10 cursor-pointer',
                    'hover:scale-110 transition-transform',
                    'outline-none focus-visible:ring-2 focus-visible:ring-violet-200'
                  )}
                  style={{ background: preset }}
                  onClick={() => fireChange(fromInput(preset, 'hex'))}
                />
              ))}
            </div>
          )}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
})

ColorPicker.displayName = 'ColorPicker'

export { ColorPicker }
