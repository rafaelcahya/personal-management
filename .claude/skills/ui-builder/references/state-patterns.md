# State Patterns

## Section with loading / error / empty / content

```jsx
'use client'

import { Activity } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import { Skeleton } from '@/components/base/Skeleton/Skeleton'
import {
  EmptyState,
  EmptyStateTitle,
  EmptyStateDescription,
} from '@/components/base/EmptyState/EmptyState'
import Section from './Section'

export default function GearUsageSection({ data, loading, error, onRetry }) {
  return (
    <Section
      id="gearUsageSection_analyticsPage"
      title="Gear usage"
      description="Distance per pair over the last 90 days"
      icon={Activity}
    >
      {loading ? (
        <div id="gearUsageSkeleton_analyticsPage" className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md" />
          ))}
        </div>
      ) : error ? (
        <div
          id="gearUsageError_analyticsPage"
          role="alert"
          className="flex flex-col items-start gap-3"
        >
          <p className="text-sm text-destructive">Couldn't load gear usage.</p>
          <Button variant="secondary" onClick={onRetry} id="gearUsageRetryBtn_analyticsPage">
            Try again
          </Button>
        </div>
      ) : !data?.length ? (
        <EmptyState size="sm" id="gearUsageEmpty_analyticsPage">
          <EmptyStateTitle>No gear yet</EmptyStateTitle>
          <EmptyStateDescription>Add a pair of shoes to see usage here.</EmptyStateDescription>
        </EmptyState>
      ) : (
        <GearUsageTable rows={data} />
      )}
    </Section>
  )
}
```

`Section` is the card wrapper in `app/main/running/(app)/analytics/components/Section.jsx` (icon + title + description header). Copy it into a new page's `components/` folder, or import a shared one if the module already has it.

## Loading data with retry in a page

```jsx
const [data, setData] = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)

const load = useCallback(() => {
  setLoading(true)
  setError(null)
  fetchGearUsage()
    .then(setData)
    .catch(setError)
    .finally(() => setLoading(false))
}, [])

useEffect(() => {
  load()
}, [load])
```

Pass `load` as `onRetry`. Move this into a `hooks/use{Thing}.js` file when the page has more than one data source.

## Mutation feedback

```jsx
import { toast } from 'sonner'

try {
  await deleteGear(id)
  toast.success('Gear deleted')
  onDeleted?.()
} catch (err) {
  toast.error(err.message || 'Something went wrong')
}
```

## Destructive confirmation

```jsx
<Modal open={open} onOpenChange={setOpen}>
  <ModalContent id="deleteGearDialog_gearPage">
    <ModalHeader layout="beside">
      <ModalIcon icon={Trash2} />
      <ModalHeaderContent>
        <ModalTitle>Delete this gear?</ModalTitle>
        <ModalDescription>This can't be undone.</ModalDescription>
      </ModalHeaderContent>
    </ModalHeader>
    <ModalFooter>
      <ModalClose asChild>
        <Button variant="secondary" id="deleteGearCancelBtn_gearPage">
          Cancel
        </Button>
      </ModalClose>
      <Button
        variant="destructive"
        onClick={onConfirm}
        disabled={deleting}
        id="deleteGearConfirmBtn_gearPage"
      >
        {deleting ? 'Deleting…' : 'Delete'}
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```
