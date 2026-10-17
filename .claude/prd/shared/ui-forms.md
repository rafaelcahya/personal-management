### Form (Dialog/Modal)

**Reference implementation:** `app/main/trading/currency/holdings/[id]/components/AddTransactionSheet.jsx`

All forms in the app are rendered inside a `Dialog` modal. This section documents every layer of the pattern.

---

#### 1. Stack

- **Schema:** Zod (`z.object`) with `superRefine` for cross-field validation
- **Form state:** `react-hook-form` + `zodResolver`
- **Components:** Base `Field` sub-components — `FieldContainer`, `FieldLabel`, `FieldControl`, `FieldDescription`, `FieldError` from `@/components/base/Field/`

---

#### 2. Dialog Container

```jsx
<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent
    ref={dialogRef}
    id="{formName}_{pageName}"
    className="max-w-md max-h-[90vh] flex flex-col p-0 gap-0"
  >
    <DialogHeader className="border-b border-slate-100 px-5 py-4 shrink-0">
      <DialogTitle className="flex items-center gap-2 text-base font-semibold">
        <SomeIcon className="size-4 text-violet-500" />
        Form Title
      </DialogTitle>
      <DialogDescription className="text-xs text-slate-500">
        Short description of what this form does
      </DialogDescription>
    </DialogHeader>

    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col overflow-y-auto px-5 py-5 gap-5"
        noValidate
      >
        {/* fields */}

        <DialogFooter className="gap-2 pt-2 border-t border-slate-100">
          {/* buttons */}
        </DialogFooter>
      </form>
    </Form>
  </DialogContent>
</Dialog>
```

**Key classes:**

| Element             | Classes                                                                   |
| ------------------- | ------------------------------------------------------------------------- |
| `DialogContent`     | `max-w-md max-h-[90vh] flex flex-col p-0 gap-0`                           |
| `DialogHeader`      | `border-b border-slate-100 px-5 py-4 shrink-0`                            |
| `DialogTitle`       | `flex items-center gap-2 text-base font-semibold` — icon left, text right |
| `DialogDescription` | `text-xs text-slate-500`                                                  |
| `<form>`            | `flex flex-col overflow-y-auto px-5 py-5 gap-5` + `noValidate`            |
| `DialogFooter`      | `gap-2 pt-2 border-t border-slate-100`                                    |

---

#### 3. Text Input Field

```jsx
<FormField
  control={form.control}
  name="fieldName"
  render={({ field, fieldState }) => (
    <FormItem>
      <FormLabel className="text-sm font-medium">Label</FormLabel>
      <FormControl>
        <Input
          id="{fieldName}_{formName}"
          type="text"
          placeholder="..."
          {...field}
          aria-invalid={!!fieldState.error}
          className={cn(
            'text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500',
            fieldState.error && 'border-rose-500'
          )}
        />
      </FormControl>
      <FormDescription className="text-xs text-slate-400">Helper text 💡</FormDescription>
      <FormMessage className="text-xs" />
    </FormItem>
  )}
/>
```

**Input class rules:**

| State    | Classes                                                                                                     |
| -------- | ----------------------------------------------------------------------------------------------------------- |
| Default  | `text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500` |
| Error    | add `border-rose-500`                                                                                       |
| Textarea | add `resize-none`                                                                                           |

**Optional field label:**

```jsx
<FormLabel className="text-sm font-medium">
  Label <span className="text-slate-400 font-normal">(optional)</span>
</FormLabel>
```

---

#### 4. Textarea Field

Same as text input but use `<Textarea>` with `rows={3}` and add `resize-none` to className.

```jsx
<Textarea
  id="{fieldName}_{formName}"
  rows={3}
  {...field}
  aria-invalid={!!fieldState.error}
  className={cn(
    'text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 resize-none',
    fieldState.error && 'border-rose-500'
  )}
/>
```

---

#### 5. Toggle Button Group

Used for mutually exclusive options (e.g. buy/sell, type selection).

```jsx
<div
  id="{groupName}_{formName}"
  role="group"
  aria-label="Group label"
  className="flex rounded-lg border border-slate-200 overflow-hidden"
>
  {OPTIONS.map((opt) => (
    <button
      key={opt}
      type="button"
      aria-pressed={field.value === opt}
      onClick={() => field.onChange(opt)}
      className={cn(
        'flex-1 py-2 text-sm font-medium capitalize transition-colors',
        field.value === opt ? 'bg-violet-600 text-white' : 'text-slate-600 hover:bg-slate-50'
      )}
    >
      {opt}
    </button>
  ))}
</div>
```

---

#### 6. Date Picker Field

Uses a `Button` trigger + `Calendar` rendered via `createPortal` into the dialog ref (prevents clipping by Dialog's overflow).

```jsx
;<Button
  ref={dateTriggerRef}
  id="{fieldName}_{formName}"
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

{
  calendarOpen &&
    dialogRef.current &&
    createPortal(
      <div
        ref={calendarRef}
        style={{ position: 'absolute', top: calendarPos.top, left: calendarPos.left, zIndex: 9999 }}
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
    )
}
```

> Always use `createPortal` into `dialogRef.current` for dropdowns and calendars so they are not clipped by the Dialog's overflow.

---

#### 7. Computed Result Box

Displayed between fields when a value is auto-calculated from user inputs.

```jsx
{
  result !== null && (
    <div className="bg-slate-50 rounded-md p-3 text-sm flex flex-col gap-0.5" aria-live="polite">
      <div>
        <span className="text-slate-500">= </span>
        <span className="font-semibold font-mono text-slate-800">{formattedValue}</span>
        <span className="text-slate-500 ml-1">{unit}</span>
      </div>
      {/* optional sub-line */}
      <div className="text-xs text-slate-400">implied rate: ...</div>
    </div>
  )
}
```

---

#### 8. Footer Buttons

```jsx
<DialogFooter className="gap-2 pt-2 border-t border-slate-100">
  <DialogClose asChild>
    <Button
      type="button"
      disabled={formState.isSubmitting}
      className="text-violet-600 bg-white hover:bg-violet-100 font-medium"
    >
      Cancel
    </Button>
  </DialogClose>
  <Button
    id="submitBtn_{formName}"
    type="submit"
    disabled={formState.isSubmitting}
    className="min-w-[80px]"
  >
    {formState.isSubmitting ? (
      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
    ) : (
      'Submit Label'
    )}
  </Button>
</DialogFooter>
```

**Button rules:**

| Button         | Classes                                                          |
| -------------- | ---------------------------------------------------------------- |
| Cancel         | `text-violet-600 bg-white hover:bg-violet-100 font-medium`       |
| Submit         | default variant + `min-w-[80px]`                                 |
| Submit loading | replace label with `<Loader2 className="size-4 animate-spin" />` |
| Both           | `disabled={formState.isSubmitting}`                              |

---

#### 9. ID Naming

| Element       | Pattern                  | Example                                  |
| ------------- | ------------------------ | ---------------------------------------- |
| DialogContent | `{formName}_{pageName}`  | `addTransactionModal_currencyDetailPage` |
| Field input   | `{fieldName}_{formName}` | `amountInput_addTransactionModal`        |
| Toggle group  | `{groupName}_{formName}` | `typeToggle_addTransactionModal`         |
| Submit button | `submitBtn_{formName}`   | `submitBtn_addTransactionModal`          |

---

#### 10. Form Reset on Open

Always reset the form when the dialog opens to clear stale state:

```jsx
useEffect(() => {
  if (open) {
    form.reset({ ...defaultValues })
  }
}, [open, form])
```

---
