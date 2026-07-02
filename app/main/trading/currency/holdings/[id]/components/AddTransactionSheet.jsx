'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format, parseISO } from 'date-fns'
import { Loader2, Check, ChevronsUpDown, Search, CalendarIcon, ArrowLeftRight } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import Button from '@/components/base/Button/Button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import {
  createCurrencyInvestment,
  getForexCurrencies,
  getForexRatesWithMeta,
} from '@/lib/api/currencyInvestments'

const PINNED_CURRENCIES = ['USD', 'CHF', 'JPY', 'SGD', 'AUD']

const formSchema = z
  .object({
    currency: z.string().length(3, 'Select a currency'),
    type: z.enum(['buy', 'sell']),
    transacted_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date required'),
    idr_amount: z.string().min(1, 'Amount is required'),
    foreign_amount: z.string().optional(),
    rate: z.string().optional(),
    notes: z.string().max(500).optional(),
  })
  .superRefine((val, ctx) => {
    const hasRate = val.rate && val.rate.replace(/[^0-9.]/g, '') !== ''
    const hasForeignAmount = val.foreign_amount && val.foreign_amount.replace(/[^0-9.]/g, '') !== ''
    if (!hasRate && !hasForeignAmount) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Enter rate or units', path: ['rate'] })
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enter rate or units',
        path: ['foreign_amount'],
      })
    }
  })

export default function AddTransactionSheet({ open, onOpenChange, defaultCurrency, onSuccess }) {
  const [currencySearch, setCurrencySearch] = useState('')
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 })
  const [currencyMap, setCurrencyMap] = useState({})
  const [currenciesLoading, setCurrenciesLoading] = useState(false)
  const [currenciesError, setCurrenciesError] = useState(false)
  const triggerRef = useRef(null)
  const dialogRef = useRef(null)
  const dropdownRef = useRef(null)
  const dateTriggerRef = useRef(null)
  const calendarRef = useRef(null)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [calendarPos, setCalendarPos] = useState({ top: 0, left: 0 })

  useEffect(() => {
    if (!currencyDropdownOpen) return
    function handleOutside(e) {
      if (!triggerRef.current?.contains(e.target) && !dropdownRef.current?.contains(e.target)) {
        setCurrencyDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [currencyDropdownOpen])

  function openDropdown() {
    const triggerRect = triggerRef.current?.getBoundingClientRect()
    const dialogRect = dialogRef.current?.getBoundingClientRect()
    if (triggerRect && dialogRect) {
      const top = triggerRect.bottom - dialogRect.top + 4
      const left = triggerRect.left - dialogRect.left
      const width = triggerRect.width
      const spaceBelow = dialogRect.bottom - triggerRect.bottom - 8
      const listHeight = Math.min(240, Math.max(120, spaceBelow - 44))
      setDropdownPos({ top, left, width, listHeight })
    }
    setCurrencyDropdownOpen(true)
    setCurrencySearch('')
  }

  useEffect(() => {
    if (!calendarOpen) return
    function handleOutside(e) {
      if (!dateTriggerRef.current?.contains(e.target) && !calendarRef.current?.contains(e.target)) {
        setCalendarOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [calendarOpen])

  function openCalendar() {
    const triggerRect = dateTriggerRef.current?.getBoundingClientRect()
    const dialogRect = dialogRef.current?.getBoundingClientRect()
    if (triggerRect && dialogRect) {
      setCalendarPos({
        top: triggerRect.bottom - dialogRect.top + 4,
        left: triggerRect.left - dialogRect.left,
      })
    }
    setCalendarOpen(true)
  }

  function selectCurrency(code, onChange) {
    onChange(code)
    setCurrencyDropdownOpen(false)
    setCurrencySearch('')
  }

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currency: defaultCurrency || '',
      type: 'buy',
      transacted_at: new Date().toISOString().slice(0, 10),
      idr_amount: '',
      foreign_amount: '',
      rate: '',
      notes: '',
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        currency: defaultCurrency || '',
        type: 'buy',
        transacted_at: new Date().toISOString().slice(0, 10),
        idr_amount: '',
        foreign_amount: '',
        rate: '',
        notes: '',
      })
      setCurrencySearch('')

      if (Object.keys(currencyMap).length === 0) {
        setCurrenciesLoading(true)
        setCurrenciesError(false)
        getForexCurrencies()
          .then(setCurrencyMap)
          .catch(() => setCurrenciesError(true))
          .finally(() => setCurrenciesLoading(false))
      }
    }
  }, [open, defaultCurrency, form])

  const watchedCurrency = form.watch('currency')
  const watchedAmount = form.watch('idr_amount')
  const watchedForeignAmount = form.watch('foreign_amount')
  const watchedRate = form.watch('rate')

  const [currentRate, setCurrentRate] = useState(null)
  const [rateFetchedAt, setRateFetchedAt] = useState(null)

  useEffect(() => {
    if (!watchedCurrency) {
      setCurrentRate(null)
      setRateFetchedAt(null)
      return
    }
    setCurrentRate(null)
    setRateFetchedAt(null)
    getForexRatesWithMeta(watchedCurrency)
      .then(({ rates, fetchedAt }) => {
        setCurrentRate(rates[watchedCurrency] ?? null)
        setRateFetchedAt(fetchedAt[watchedCurrency] ?? null)
      })
      .catch(() => {
        setCurrentRate(null)
        setRateFetchedAt(null)
      })
  }, [watchedCurrency])

  const computed = useMemo(() => {
    const idr = parseFloat(watchedAmount?.replace(/\D/g, '') || '0')
    const units = parseFloat(watchedForeignAmount?.replace(/[^0-9.]/g, '') || '0')
    const rate = parseFloat(watchedRate?.replace(/[^0-9.]/g, '') || '0')
    if (!idr) return null
    if (units) return { units, impliedRate: rate || idr / units }
    if (rate) return { units: idr / rate, impliedRate: rate }
    return null
  }, [watchedAmount, watchedForeignAmount, watchedRate])

  const subtotal = computed?.units ?? null

  const allCurrencies = useMemo(() => Object.keys(currencyMap).sort(), [currencyMap])

  const filteredCurrencies = useMemo(() => {
    const q = currencySearch.toLowerCase()
    if (!q) return allCurrencies.filter((c) => !PINNED_CURRENCIES.includes(c))
    return allCurrencies.filter(
      (c) => c.toLowerCase().includes(q) || currencyMap[c]?.name?.toLowerCase().includes(q)
    )
  }, [currencySearch, allCurrencies, currencyMap])

  async function onSubmit(values) {
    const idrAmount = parseInt(values.idr_amount.replace(/\D/g, ''), 10)
    if (!idrAmount || isNaN(idrAmount)) {
      form.setError('idr_amount', { message: 'Enter a valid amount' })
      return
    }
    const directUnits = values.foreign_amount
      ? parseFloat(values.foreign_amount.replace(/[^0-9.]/g, ''))
      : 0
    const directRate = values.rate ? parseFloat(values.rate.replace(/[^0-9.]/g, '')) : 0

    const foreignAmount = directUnits || idrAmount / directRate
    const rate = directRate || idrAmount / foreignAmount

    try {
      await createCurrencyInvestment({
        currency: values.currency,
        type: values.type,
        idr_amount: idrAmount,
        rate,
        foreign_amount: foreignAmount,
        transacted_at: values.transacted_at,
        notes: values.notes || undefined,
      })
      toast.success('Transaction added')
      onSuccess?.()
    } catch (err) {
      toast.error(err.message || 'Failed to add transaction')
    }
  }

  const { formState } = form

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        ref={dialogRef}
        id="addTransactionModal_currencyDetailPage"
        className="max-w-md max-h-[90vh] flex flex-col p-0 gap-0"
      >
        <DialogHeader className="border-b border-slate-100 px-5 py-4 shrink-0">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <ArrowLeftRight className="size-4 text-violet-500" />
            Add Transaction
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Record a buy or sell transaction
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col overflow-y-auto px-5 py-5 gap-5"
            noValidate
          >
            {/* Currency */}
            <FormField
              control={form.control}
              name="currency"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Currency</FormLabel>
                  <FormControl>
                    <Button
                      ref={triggerRef}
                      id="currencySelect_addTransactionModal"
                      variant="outline"
                      aria-expanded={currencyDropdownOpen}
                      aria-haspopup="listbox"
                      onClick={openDropdown}
                      className={cn(
                        'justify-between w-full h-9 px-3 text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600',
                        fieldState.error ? 'border-rose-500' : '',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        <span className="flex items-center gap-2">
                          <span>{field.value}</span>
                          <span className="text-slate-400 font-normal">
                            — {currencyMap[field.value]?.name || ''}
                          </span>
                        </span>
                      ) : (
                        'Select currency...'
                      )}
                      <ChevronsUpDown
                        className="size-4 text-slate-400 shrink-0"
                        aria-hidden="true"
                      />
                    </Button>
                  </FormControl>

                  <FormDescription className="text-xs text-slate-400 flex flex-col gap-0.5">
                    <span>The foreign currency you are buying or selling 💱</span>
                    {watchedCurrency && currentRate !== null && (
                      <span className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-violet-600 font-semibold font-mono">
                          1 {watchedCurrency} = Rp{' '}
                          {new Intl.NumberFormat('id-ID').format(currentRate)}
                        </span>
                        {rateFetchedAt && (
                          <span className="text-slate-400">
                            as of{' '}
                            {new Intl.DateTimeFormat('id-ID', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }).format(new Date(rateFetchedAt))}
                          </span>
                        )}
                      </span>
                    )}
                    <span className="text-slate-400">
                      Rates sourced from central banks via Frankfurter 🏦
                    </span>
                  </FormDescription>
                  {currencyDropdownOpen &&
                    dialogRef.current &&
                    createPortal(
                      <div
                        ref={dropdownRef}
                        style={{
                          position: 'absolute',
                          top: dropdownPos.top,
                          left: dropdownPos.left,
                          width: Math.max(dropdownPos.width, 288),
                          zIndex: 9999,
                        }}
                        className="bg-white border border-slate-200 rounded-md shadow-lg overflow-hidden"
                      >
                        <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-100">
                          <Search className="size-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                          <input
                            type="text"
                            placeholder="Search currencies..."
                            value={currencySearch}
                            onChange={(e) => setCurrencySearch(e.target.value)}
                            autoFocus
                            className="flex-1 text-sm outline-none bg-transparent placeholder:text-slate-400"
                            aria-label="Search currencies"
                          />
                        </div>

                        <div
                          style={{ height: dropdownPos.listHeight ?? 240, overflowY: 'scroll' }}
                          role="listbox"
                          aria-label="Currency options"
                        >
                          {currenciesLoading && (
                            <div className="flex items-center justify-center py-6 gap-2 text-slate-400 text-sm">
                              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                              Loading currencies...
                            </div>
                          )}

                          {!currenciesLoading && currenciesError && (
                            <div className="flex flex-col items-center gap-2 py-6 text-sm text-slate-500">
                              <p>Failed to load currencies.</p>
                              <Button
                                variant="link"
                                size="sm"
                                className="text-violet-600 text-xs h-auto p-0"
                                onClick={() => {
                                  setCurrenciesError(false)
                                  setCurrenciesLoading(true)
                                  getForexCurrencies()
                                    .then(setCurrencyMap)
                                    .catch(() => setCurrenciesError(true))
                                    .finally(() => setCurrenciesLoading(false))
                                }}
                              >
                                Try again
                              </Button>
                            </div>
                          )}

                          {!currenciesLoading && !currencySearch && (
                            <>
                              <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                Popular
                              </p>
                              {PINNED_CURRENCIES.map((c) => (
                                <Button
                                  key={c}
                                  variant="ghost"
                                  fullWidth
                                  role="option"
                                  aria-selected={field.value === c}
                                  onClick={() => selectCurrency(c, field.onChange)}
                                  className="justify-start gap-2 px-3 py-2 text-sm hover:bg-slate-50 rounded-none"
                                >
                                  <Check
                                    className={cn(
                                      'size-3.5 shrink-0',
                                      field.value === c ? 'text-violet-600' : 'opacity-0'
                                    )}
                                    aria-hidden="true"
                                  />
                                  <span className="font-medium">{c}</span>
                                  <span className="text-slate-400 text-xs truncate">
                                    {currencyMap[c]?.name}
                                  </span>
                                </Button>
                              ))}
                              <div className="mx-3 my-1 border-t border-slate-100" />
                              <p className="px-3 pt-1 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                All currencies
                              </p>
                            </>
                          )}

                          {!currenciesLoading && currencySearch && (
                            <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                              Results
                            </p>
                          )}

                          {!currenciesLoading &&
                            filteredCurrencies.map((c) => (
                              <Button
                                key={c}
                                variant="ghost"
                                fullWidth
                                role="option"
                                aria-selected={field.value === c}
                                onClick={() => selectCurrency(c, field.onChange)}
                                className="justify-start gap-2 px-3 py-2 text-sm hover:bg-slate-50"
                              >
                                <Check
                                  className={cn(
                                    'size-3.5 shrink-0',
                                    field.value === c ? 'text-violet-600' : 'opacity-0'
                                  )}
                                  aria-hidden="true"
                                />
                                <span className="font-medium">{c}</span>
                                <span className="text-slate-400 text-xs truncate">
                                  {currencyMap[c]?.name}
                                </span>
                              </Button>
                            ))}

                          {!currenciesLoading &&
                            filteredCurrencies.length === 0 &&
                            currencySearch && (
                              <p className="px-3 py-4 text-sm text-slate-400 text-center">
                                No results
                              </p>
                            )}
                        </div>
                      </div>,
                      dialogRef.current
                    )}
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Type toggle */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Type</FormLabel>
                  <div
                    id="typeToggle_addTransactionModal"
                    role="group"
                    aria-label="Transaction type"
                    className="flex rounded-lg border border-slate-200 overflow-hidden"
                  >
                    {['buy', 'sell'].map((t) => (
                      <Button
                        key={t}
                        variant="ghost"
                        aria-pressed={field.value === t}
                        onClick={() => field.onChange(t)}
                        className={cn(
                          'flex-1 py-2 text-sm font-medium capitalize rounded-none',
                          field.value === t
                            ? 'bg-violet-600 text-white hover:bg-violet-600'
                            : 'text-slate-600 hover:bg-slate-50'
                        )}
                      >
                        {t}
                      </Button>
                    ))}
                  </div>
                  <FormDescription className="text-xs text-slate-400">
                    Buy to add holdings, sell to reduce them 📊
                  </FormDescription>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Date */}
            <FormField
              control={form.control}
              name="transacted_at"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Date</FormLabel>
                  <FormControl>
                    <Button
                      ref={dateTriggerRef}
                      id="dateInput_addTransactionModal"
                      type="button"
                      variant="outline"
                      onClick={openCalendar}
                      aria-invalid={!!fieldState.error}
                      className={cn(
                        'w-full justify-start text-left font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600',
                        fieldState.error && 'border-rose-500',
                        !field.value && 'text-slate-500'
                      )}
                    >
                      <CalendarIcon className="mr-2 size-4 opacity-50" />
                      {field.value ? format(parseISO(field.value), 'PPP') : 'Pick a date'}
                    </Button>
                  </FormControl>
                  <FormDescription className="text-xs text-slate-400">
                    When did you execute this transaction? 📅
                  </FormDescription>
                  {calendarOpen &&
                    dialogRef.current &&
                    createPortal(
                      <div
                        ref={calendarRef}
                        style={{
                          position: 'absolute',
                          top: calendarPos.top,
                          left: calendarPos.left,
                          zIndex: 9999,
                        }}
                        className="bg-white border border-slate-200 rounded-md shadow-lg p-0"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value ? parseISO(field.value) : undefined}
                          onSelect={(date) => {
                            field.onChange(date ? format(date, 'yyyy-MM-dd') : '')
                            setCalendarOpen(false)
                          }}
                          initialFocus
                        />
                      </div>,
                      dialogRef.current
                    )}
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Amount (IDR) */}
            <FormField
              control={form.control}
              name="idr_amount"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Amount (IDR)</FormLabel>
                  <FormControl>
                    <Input
                      id="amountInput_addTransactionModal"
                      type="text"
                      placeholder="Rp 10.000.000"
                      value={
                        field.value
                          ? `Rp ${Number(field.value.replace(/\D/g, '')).toLocaleString('id-ID')}`
                          : ''
                      }
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '')
                        field.onChange(raw)
                      }}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      aria-invalid={!!fieldState.error}
                      className={cn(
                        'text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500',
                        fieldState.error && 'border-rose-500'
                      )}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-slate-400 flex items-center gap-1.5 flex-wrap">
                    <span>Total IDR you spent (buy) or received (sell) 💵</span>
                    {subtotal !== null && watchedCurrency && (
                      <span className="text-violet-600 font-semibold font-mono">
                        ={' '}
                        {new Intl.NumberFormat('en', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 6,
                        }).format(subtotal)}{' '}
                        {watchedCurrency}
                      </span>
                    )}
                  </FormDescription>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Units */}
            <FormField
              control={form.control}
              name="foreign_amount"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Units {watchedCurrency ? `(${watchedCurrency})` : ''}{' '}
                    <span className="text-slate-400 font-normal">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="unitsInput_addTransactionModal"
                      type="text"
                      placeholder="e.g. 100.50"
                      value={field.value}
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/[^0-9.]/g, '')
                        field.onChange(cleaned)
                      }}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      aria-invalid={!!fieldState.error}
                      className={cn(
                        'text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500',
                        fieldState.error && 'border-rose-500'
                      )}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-slate-400">
                    How many units you bought or sold — fill this if you don&apos;t know the rate 💡
                  </FormDescription>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Rate */}
            <FormField
              control={form.control}
              name="rate"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Rate (IDR per 1 unit){' '}
                    <span className="text-slate-400 font-normal">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="rateInput_addTransactionModal"
                      type="text"
                      placeholder="15.500"
                      value={field.value}
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/[^0-9.]/g, '')
                        field.onChange(cleaned)
                      }}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      aria-invalid={!!fieldState.error}
                      className={cn(
                        'text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500',
                        fieldState.error && 'border-rose-500'
                      )}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-slate-400">
                    IDR value per 1 unit of the currency (e.g. 16,000 for 1 USD) 🔢
                  </FormDescription>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Subtotal display */}
            {computed !== null && (
              <div
                className="bg-slate-50 rounded-md p-3 text-sm flex flex-col gap-0.5"
                aria-live="polite"
              >
                <div>
                  <span className="text-slate-500">= </span>
                  <span className="font-semibold font-mono text-slate-800">
                    {new Intl.NumberFormat('en', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    }).format(computed.units)}
                  </span>
                  {watchedCurrency && (
                    <span className="text-slate-500 ml-1">{watchedCurrency}</span>
                  )}
                </div>
                {watchedForeignAmount && !watchedRate && (
                  <div className="text-xs text-slate-400">
                    implied rate: Rp{' '}
                    {new Intl.NumberFormat('id-ID').format(Math.round(computed.impliedRate))} per
                    unit
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      id="notesInput_addTransactionModal"
                      placeholder="Any notes about this transaction..."
                      rows={3}
                      {...field}
                      aria-invalid={!!fieldState.error}
                      className={cn(
                        'text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 resize-none',
                        fieldState.error && 'border-rose-500'
                      )}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 pt-2 border-t border-slate-100">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={formState.isSubmitting}
                  className="text-violet-600 font-medium"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                id="submitBtn_addTransactionModal"
                type="submit"
                disabled={formState.isSubmitting}
                className="min-w-[80px]"
              >
                {formState.isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  'Add Transaction'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
