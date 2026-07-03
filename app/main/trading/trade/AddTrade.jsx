'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import Button from '@/components/base/Button/Button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import FieldContent from '@/components/base/Field/FieldContent'
import FieldLabel from '@/components/base/Field/FieldLabel'
import FieldError from '@/components/base/Field/FieldError'
import FieldDescription from '@/components/base/Field/FieldDescription'
import Input from '@/components/base/Input/Input'
import Textarea from '@/components/base/Textarea/Textarea'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { toast } from 'sonner'
import { Loader2, PlusIcon, CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { tradeSchema } from '@/schemas/trade'
import { createTrade, fetchAllTradeOptions } from '@/lib/api/trade'
import { formatRupiah } from '@/lib/utils/currencyFormatter'
import CurrencyField from '@/components/ui/common/CurrencyField'
import DynamicSelectField from '@/components/ui/common/DynamicSelectField'

const SELECT_CONFIG = [
  {
    name: 'stock_type_option',
    label: 'Stock Type',
    apiKey: 'stockType',
    displayField: 'stock_type_option',
    placeholder: 'Select stock type',
  },
  {
    name: 'entry_session_option',
    label: 'Entry Session',
    apiKey: 'entrySession',
    displayField: 'entry_session_option',
    placeholder: 'Select entry session',
  },
  {
    name: 'entry_occasion_option',
    label: 'Entry Occasion',
    apiKey: 'entryOccasion',
    displayField: 'entry_occasion_option',
    placeholder: 'Select entry occasion',
  },
  {
    name: 'buy_reason_option',
    label: 'Buy Reason',
    apiKey: 'buyReason',
    displayField: 'buy_reason_option',
    placeholder: 'Why did you buy?',
  },
  {
    name: 'sell_reason_option',
    label: 'Sell Reason',
    apiKey: 'sellReason',
    displayField: 'sell_reason_option',
    placeholder: 'Why did you sell?',
  },
]

export default function AddTrade({
  onAdded,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = controlledOnOpenChange !== undefined ? controlledOnOpenChange : setInternalOpen
  const [loading, setLoading] = useState(false)
  const [optionsLoading, setOptionsLoading] = useState(false)
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

  const { watch, setValue, control, handleSubmit, reset } = form

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
    } else {
      setValue('realized_gain', '')
      setValue('return_percent', '')
    }
  }, [margin, proceeds, setValue])

  useEffect(() => {
    if (open) {
      fetchOptions()
    }
  }, [open])

  const fetchOptions = async () => {
    try {
      setOptionsLoading(true)
      const allOptions = await fetchAllTradeOptions()
      setOptions(allOptions)
    } catch (error) {
      console.error('Failed to load options:', error)
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

  const handleAddTrade = async (values) => {
    setLoading(true)
    try {
      const payload = {
        ...values,
        trade_date: values.trade_date.toISOString().split('T')[0],
      }

      await createTrade(payload)
      toast.success('Trade added successfully! 📈')
      setOpen(false)
      reset()
      onAdded?.()
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Failed to create trade')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild id="addNewTradeBtn_tradePage">
        <Button>
          <PlusIcon className="w-4" />
          <span>Add Trade</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-2xl flex flex-col max-h-[90vh]"
        id="addNewTradeForm_tradePage"
      >
        <DialogHeader className="text-left shrink-0">
          <DialogTitle>📊 Add New Trade</DialogTitle>
          <DialogDescription className="text-slate-600">
            Record your trade details to track performance and learn from every position
          </DialogDescription>
        </DialogHeader>

        {optionsLoading ? (
          <div
            id="loadingOptionsContainer_tradePage"
            className="flex flex-col items-center justify-center py-12 gap-3"
          >
            <Loader2 className="size-8 animate-spin text-violet-600" />
            <p className="text-sm text-slate-600">Loading form options...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(handleAddTrade)} className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {/* Trade Date */}
              <Controller
                control={control}
                name="trade_date"
                render={({ field, fieldState }) => (
                  <FieldContent className="flex flex-col" error={fieldState.error?.message}>
                    <FieldLabel className="font-medium">Trade Date</FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          id="tradeDateField_tradePage"
                          className={cn(
                            'w-full pl-3 text-left font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600',
                            fieldState.error && 'border-rose-500',
                            !field.value && 'text-slate-500'
                          )}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0"
                        align="start"
                        id="tradeDatePicker_tradePage"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FieldDescription className="text-xs text-slate-400">
                      When did you execute this trade? 📅
                    </FieldDescription>
                    <FieldError
                      id="tradeDateField_errorMessage_tradePage"
                      className="font-medium"
                    />
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
                      id="tickerField_tradePage"
                      className={`uppercase text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 ${
                        fieldState.error ? 'border-rose-500' : ''
                      }`}
                    />
                    <FieldDescription className="text-xs text-slate-400">
                      Stock symbol you traded 🏷️
                    </FieldDescription>
                    <FieldError id="tickerField_errorMessage_tradePage" className="font-medium" />
                  </FieldContent>
                )}
              />

              {/* Margin & Proceeds Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CurrencyField
                  control={control}
                  idField="marginField_tradePage"
                  message="marginField_errorMessage_tradePage"
                  name="margin"
                  label="Margin (Capital)"
                  placeholder="e.g., 1000000"
                  description="Total capital deployed 💰"
                />

                <CurrencyField
                  control={control}
                  idField="proceedsField_tradePage"
                  message="proceedsField_errorMessage_tradePage"
                  name="proceeds"
                  label="Proceeds (Return)"
                  placeholder="e.g., 1200000"
                  description="Total amount received 💵"
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
                        id="realizedGainValue_realizedGainField_tradePage"
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
                      <Input
                        value={field.value}
                        disabled
                        id="returnPercentValue_returnPercentField_tradePage"
                        className="font-medium bg-slate-50"
                      />
                      <FieldDescription className="text-xs text-slate-400">
                        Auto-calculated 📊
                      </FieldDescription>
                    </FieldContent>
                  )}
                />
              </div>

              {/* Dynamic Select Fields */}
              {SELECT_CONFIG.map(({ name, label, apiKey, displayField, placeholder }) => (
                <DynamicSelectField
                  key={name}
                  control={control}
                  name={name}
                  label={label}
                  options={options[apiKey]}
                  loading={false}
                  displayField={displayField}
                  placeholder={placeholder}
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
                      id="notesField_tradePage"
                      className="focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-sm font-medium min-h-[80px]"
                    />
                    <FieldDescription className="text-xs text-slate-400">
                      Document your thought process 📝
                    </FieldDescription>
                  </FieldContent>
                )}
              />
            </div>

            <DialogFooter className="shrink-0 pt-4">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  className="text-violet-600 font-medium"
                  id="cancelNewTradeBtn_tradePage"
                  disabled={loading}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={loading} id="submitNewTradeBtn_tradePage">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Adding...' : 'Add Trade'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
