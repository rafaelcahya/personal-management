'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '@/components/base/Button/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import FieldContent from '@/components/base/Field/FieldContent'
import FieldLabel from '@/components/base/Field/FieldLabel'
import FieldError from '@/components/base/Field/FieldError'
import FieldDescription from '@/components/base/Field/FieldDescription'
import Input from '@/components/base/Input/Input'
import Textarea from '@/components/base/Textarea/Textarea'
import DatePicker from '@/components/base/DatePicker/DatePicker/DatePicker'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { tradeSchema } from '@/schemas/trade'
import { updateTrade, fetchAllTradeOptions } from '@/lib/api/trade'
import { formatRupiah } from '@/lib/utils/currencyFormatter'
import CurrencyField from '@/components/ui/common/CurrencyField'
import DynamicSelectField from '@/components/ui/common/DynamicSelectField'
import DeleteTrade from './DeleteTrade'

const SELECT_CONFIG = [
  {
    name: 'stock_type_option',
    label: 'Stock Type',
    apiKey: 'stockType',
    displayField: 'stock_type_option',
  },
  {
    name: 'entry_session_option',
    label: 'Entry Session',
    apiKey: 'entrySession',
    displayField: 'entry_session_option',
  },
  {
    name: 'entry_occasion_option',
    label: 'Entry Occasion',
    apiKey: 'entryOccasion',
    displayField: 'entry_occasion_option',
  },
  {
    name: 'buy_reason_option',
    label: 'Buy Reason',
    apiKey: 'buyReason',
    displayField: 'buy_reason_option',
  },
  {
    name: 'sell_reason_option',
    label: 'Sell Reason',
    apiKey: 'sellReason',
    displayField: 'sell_reason_option',
  },
]

export default function UpdateTrade({ trade, onClose, onUpdated }) {
  const [loading, setLoading] = useState(false)
  const [optionsLoading, setOptionsLoading] = useState(true)
  const [options, setOptions] = useState({
    stockType: [],
    entrySession: [],
    entryOccasion: [],
    buyReason: [],
    sellReason: [],
  })

  const form = useForm({
    resolver: zodResolver(tradeSchema),
    defaultValues: {
      trade_date: new Date(),
      ticker: '',
      margin: '',
      proceeds: '',
      return_percent: '',
      realized_gain: '',
      stock_type_option: '',
      entry_session_option: '',
      entry_occasion_option: '',
      buy_reason_option: '',
      sell_reason_option: '',
      notes: '',
    },
  })

  const { watch, setValue, control, reset } = form

  const margin = watch('margin')
  const proceeds = watch('proceeds')

  useEffect(() => {
    const marginNum = parseFloat(margin)
    const proceedsNum = parseFloat(proceeds)

    if (!isNaN(marginNum) && !isNaN(proceedsNum)) {
      const gain = proceedsNum - marginNum
      setValue('realized_gain', gain.toFixed(2))

      if (marginNum !== 0) {
        setValue('return_percent', ((gain / marginNum) * 100).toFixed(2) + '%')
      }
    }
  }, [margin, proceeds, setValue])

  useEffect(() => {
    if (trade) {
      loadTradeData()
    }
  }, [trade])

  const loadTradeData = async () => {
    try {
      setOptionsLoading(true)

      const allOptions = await fetchAllTradeOptions()
      setOptions(allOptions)

      reset({
        trade_date: new Date(trade.trade_date),
        ticker: trade.ticker || '',
        margin: trade.margin?.toString() || '',
        proceeds: trade.proceeds?.toString() || '',
        return_percent: trade.return_percent || '',
        realized_gain: trade.realized_gain?.toString() || '',
        stock_type_option: trade.stock_type_option || '',
        entry_session_option: trade.entry_session_option || '',
        entry_occasion_option: trade.entry_occasion_option || '',
        buy_reason_option: trade.buy_reason_option || '',
        sell_reason_option: trade.sell_reason_option || '',
        notes: trade.notes || '',
      })
    } catch (error) {
      console.error('Failed to load trade data:', error)
      toast.error('Failed to load form options')
      setOptions({
        stockType: [],
        entrySession: [],
        entryOccasion: [],
        buyReason: [],
        sellReason: [],
      })
    } finally {
      setOptionsLoading(false)
    }
  }

  const onSubmit = async (values) => {
    setLoading(true)

    try {
      const payload = {
        ...values,
        trade_date: values.trade_date.toISOString().split('T')[0],
      }

      await updateTrade(trade.id, payload)
      toast.success('Trade updated successfully! ✅')
      onUpdated?.()
    } catch (err) {
      console.error('Update error:', err)
      toast.error(err.message || 'Failed to update trade')
    } finally {
      setLoading(false)
    }
  }

  if (!trade) return null

  return (
    <Dialog open={!!trade} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl flex flex-col max-h-[90vh]">
        <DialogHeader className="text-left shrink-0">
          <DialogTitle>✏️ Update Trade</DialogTitle>
          <DialogDescription className="text-slate-600">
            Adjust your trade details to keep your journal accurate and insightful
          </DialogDescription>
        </DialogHeader>

        {optionsLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="size-8 animate-spin text-violet-600" />
            <p className="text-sm text-slate-600">Loading form options...</p>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {/* Trade Date */}
              <Controller
                control={control}
                name="trade_date"
                render={({ field, fieldState }) => (
                  <FieldContent error={fieldState.error?.message}>
                    <FieldLabel className="font-medium">Trade Date</FieldLabel>
                    <DatePicker value={field.value} onChange={field.onChange} />
                    <FieldError className="font-medium" />
                  </FieldContent>
                )}
              />

              {/* Ticker */}
              <Controller
                control={control}
                name="ticker"
                render={({ field, fieldState }) => (
                  <FieldContent error={fieldState.error?.message}>
                    <FieldLabel className="font-medium">Ticker</FieldLabel>
                    <Input
                      {...field}
                      placeholder="e.g., BBCA, GOTO"
                      className={`uppercase text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 ${
                        fieldState.error ? 'border-rose-500' : ''
                      }`}
                    />
                    <FieldError className="font-medium" />
                  </FieldContent>
                )}
              />

              {/* Margin & Proceeds Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CurrencyField
                  control={control}
                  name="margin"
                  label="Margin (Capital)"
                  placeholder="e.g., 1000000"
                />

                <CurrencyField
                  control={control}
                  name="proceeds"
                  label="Proceeds (Return)"
                  placeholder="e.g., 1200000"
                />
              </div>

              {/* Auto-calculated fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  control={control}
                  name="realized_gain"
                  render={({ field }) => (
                    <FieldContent>
                      <FieldLabel className="font-medium">Realized Gain/Loss</FieldLabel>
                      <Input
                        value={formatRupiah(field.value)}
                        disabled
                        className="font-medium bg-slate-50"
                      />
                      <FieldDescription className="text-xs text-slate-400">
                        Auto-calculated 🧮
                      </FieldDescription>
                    </FieldContent>
                  )}
                />

                <Controller
                  control={control}
                  name="return_percent"
                  render={({ field }) => (
                    <FieldContent>
                      <FieldLabel className="font-medium">Return %</FieldLabel>
                      <Input value={field.value} disabled className="font-medium bg-slate-50" />
                      <FieldDescription className="text-xs text-slate-400">
                        Auto-calculated 📊
                      </FieldDescription>
                    </FieldContent>
                  )}
                />
              </div>

              {/* Dynamic Select Fields */}
              {SELECT_CONFIG.map(({ name, label, apiKey, displayField }) => (
                <DynamicSelectField
                  key={name}
                  control={control}
                  name={name}
                  label={label}
                  options={options[apiKey]}
                  loading={false}
                  displayField={displayField}
                />
              ))}

              {/* Notes */}
              <Controller
                control={control}
                name="notes"
                render={({ field }) => (
                  <FieldContent>
                    <FieldLabel className="font-medium">Notes (Optional)</FieldLabel>
                    <Textarea
                      {...field}
                      placeholder="Trade insights, emotions, market conditions..."
                      className="focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-sm font-medium min-h-[80px]"
                    />
                  </FieldContent>
                )}
              />
            </div>

            <DialogFooter className="shrink-0 pt-4 flex-col sm:flex-row gap-2">
              <DeleteTrade trade={trade} onDeleted={onUpdated} onClose={onClose} />

              <div className="flex gap-2 flex-1 justify-end">
                <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? 'Updating...' : 'Update Trade'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
