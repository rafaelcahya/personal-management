import { AlertTriangle, CheckCircle2, Info, Package, RefreshCw, XCircle } from 'lucide-react'
import Card, {
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardIcon,
  CardTitle,
} from './Card'
import Button from '../Button/Button'
import { Skeleton } from '../Skeleton/Skeleton'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Card/Status',
}

export default meta

// ─── Shared helpers ───────────────────────────────────────────────────────────

const SkeletonRow = () => (
  <div className="flex items-center gap-3 py-2.5 border-b border-slate-100 last:border-0">
    <Skeleton className="h-3 rounded w-2/5" />
    <Skeleton className="h-3 rounded w-1/4 ml-auto" />
  </div>
)

const DataRow = ({ label, value }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
    <span className="text-sm text-slate-600">{label}</span>
    <span className="text-sm font-medium text-slate-900">{value}</span>
  </div>
)

const ErrorRetry = ({ onRetry }) => (
  <div className="flex flex-col items-center gap-3 py-6 text-center">
    <XCircle className="size-8 text-slate-300" />
    <p className="text-sm text-slate-500">Failed to load data</p>
    <Button size="sm" variant="outline" onClick={onRetry}>
      <RefreshCw className="size-3.5 mr-1.5" />
      Retry
    </Button>
  </div>
)

// ─── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants = {
  name: 'All Variants',
  render: () => (
    <div className="p-6 max-w-2xl flex flex-col gap-4">
      <Card variant="shell">
        <CardHeader>
          <CardIcon icon={Package} />
          <div className="min-w-0 flex-1">
            <CardTitle>Shell</CardTitle>
            <CardDescription>Default card — no semantic status</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <DataRow label="Total Items" value="48" />
          <DataRow label="Categories" value="5" />
        </CardContent>
      </Card>

      <Card variant="info">
        <CardHeader>
          <CardIcon icon={Info} />
          <div className="min-w-0 flex-1">
            <CardTitle>Info</CardTitle>
            <CardDescription>Informational — neutral guidance or tips</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <DataRow label="Total Items" value="48" />
          <DataRow label="Categories" value="5" />
        </CardContent>
      </Card>

      <Card variant="success">
        <CardHeader>
          <CardIcon icon={CheckCircle2} />
          <div className="min-w-0 flex-1">
            <CardTitle>Success</CardTitle>
            <CardDescription>Operation completed — sync done, order approved</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <DataRow label="Total Items" value="48" />
          <DataRow label="Categories" value="5" />
        </CardContent>
      </Card>

      <Card variant="warning">
        <CardHeader>
          <CardIcon icon={AlertTriangle} />
          <div className="min-w-0 flex-1">
            <CardTitle>Warning</CardTitle>
            <CardDescription>Recoverable issue — low stock, approaching limit</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <DataRow label="Total Items" value="48" />
          <DataRow label="Categories" value="5" />
        </CardContent>
      </Card>

      <Card variant="danger">
        <CardHeader>
          <CardIcon icon={XCircle} />
          <div className="min-w-0 flex-1">
            <CardTitle>Danger</CardTitle>
            <CardDescription>Blocking state — action required, data missing</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <DataRow label="Total Items" value="48" />
          <DataRow label="Categories" value="5" />
        </CardContent>
      </Card>

      <Card variant="muted">
        <CardHeader>
          <CardIcon icon={Package} />
          <div className="min-w-0 flex-1">
            <CardTitle>Muted</CardTitle>
            <CardDescription>De-emphasized — archived, read-only, or inactive</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <DataRow label="Total Items" value="48" />
          <DataRow label="Categories" value="5" />
        </CardContent>
      </Card>
    </div>
  ),
}

// ─── Loading State ────────────────────────────────────────────────────────────

export const LoadingState = {
  name: 'Loading State',
  render: () => (
    <div className="p-6 max-w-2xl flex flex-col gap-4">
      {[
        { variant: 'shell', icon: Package, title: 'Shell' },
        { variant: 'info', icon: Info, title: 'Info' },
        { variant: 'success', icon: CheckCircle2, title: 'Success' },
        { variant: 'warning', icon: AlertTriangle, title: 'Warning' },
        { variant: 'danger', icon: XCircle, title: 'Danger' },
        { variant: 'muted', icon: Package, title: 'Muted' },
      ].map(({ variant, icon, title }) => (
        <Card key={variant} variant={variant}>
          <CardHeader>
            <CardIcon icon={icon} />
            <div className="min-w-0 flex-1">
              <CardTitle>{title}</CardTitle>
              <CardDescription>Loading…</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </CardContent>
        </Card>
      ))}
    </div>
  ),
}

// ─── Error + Retry State ──────────────────────────────────────────────────────

export const ErrorState = {
  name: 'Error State',
  render: () => (
    <div className="p-6 max-w-2xl flex flex-col gap-4">
      {[
        { variant: 'shell', icon: Package, title: 'Shell' },
        { variant: 'info', icon: Info, title: 'Info' },
        { variant: 'success', icon: CheckCircle2, title: 'Success' },
        { variant: 'warning', icon: AlertTriangle, title: 'Warning' },
        { variant: 'danger', icon: XCircle, title: 'Danger' },
        { variant: 'muted', icon: Package, title: 'Muted' },
      ].map(({ variant, icon, title }) => (
        <Card key={variant} variant={variant}>
          <CardHeader>
            <CardIcon icon={icon} />
            <div className="min-w-0 flex-1">
              <CardTitle>{title}</CardTitle>
              <CardDescription>Could not load data</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ErrorRetry onRetry={() => {}} />
          </CardContent>
        </Card>
      ))}
    </div>
  ),
}

// ─── With Action Button ───────────────────────────────────────────────────────

export const WithAction = {
  name: 'With Action',
  render: () => (
    <div className="p-6 max-w-2xl flex flex-col gap-4">
      <Card variant="info">
        <CardHeader>
          <CardIcon icon={Info} />
          <div className="min-w-0 flex-1">
            <CardTitle>Sync in Progress</CardTitle>
            <CardDescription>Last synced: 5 minutes ago</CardDescription>
          </div>
          <CardAction>
            <Button size="sm" variant="outline">
              Refresh
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <DataRow label="Records synced" value="1,204" />
          <DataRow label="Errors" value="0" />
        </CardContent>
      </Card>

      <Card variant="warning">
        <CardHeader>
          <CardIcon icon={AlertTriangle} />
          <div className="min-w-0 flex-1">
            <CardTitle>Low Stock Alert</CardTitle>
            <CardDescription>3 items need restocking soon</CardDescription>
          </div>
          <CardAction>
            <Button size="sm" variant="outline">
              View Items
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <DataRow label="Vitamin C Serum" value="1 left" />
          <DataRow label="Body Lotion" value="2 left" />
          <DataRow label="Moisturizer" value="3 left" />
        </CardContent>
      </Card>

      <Card variant="danger">
        <CardHeader>
          <CardIcon icon={XCircle} />
          <div className="min-w-0 flex-1">
            <CardTitle>Payment Failed</CardTitle>
            <CardDescription>Order #4821 could not be processed</CardDescription>
          </div>
          <CardAction>
            <Button size="sm" variant="outline">
              Retry
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <DataRow label="Order" value="#4821" />
          <DataRow label="Amount" value="Rp 180.000" />
          <DataRow label="Reason" value="Insufficient funds" />
        </CardContent>
        <CardFooter>
          <p className="text-xs text-slate-500">Contact support if the issue persists</p>
        </CardFooter>
      </Card>

      <Card variant="success">
        <CardHeader>
          <CardIcon icon={CheckCircle2} />
          <div className="min-w-0 flex-1">
            <CardTitle>Export Complete</CardTitle>
            <CardDescription>Your CSV file is ready to download</CardDescription>
          </div>
          <CardAction>
            <Button size="sm" variant="outline">
              Download
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <DataRow label="File" value="inventory-2026.csv" />
          <DataRow label="Records" value="48 items" />
          <DataRow label="Size" value="~24 KB" />
        </CardContent>
      </Card>
    </div>
  ),
}
