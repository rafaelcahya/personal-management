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

const BestPractices = ({ items }) => (
  <div className="flex flex-col gap-8 w-full max-w-2xl">
    {items.map(({ heading, cards }) => (
      <div key={heading}>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          {heading}
        </p>
        <div className="flex flex-col gap-3">
          {cards.map(({ title, body }) => (
            <div
              key={title}
              className="flex gap-3 p-4 rounded-lg border border-violet-100 bg-violet-50"
            >
              <span className="mt-0.5 shrink-0 size-4 rounded-full bg-violet-500 flex items-center justify-center text-white text-[10px] font-bold">
                ✓
              </span>
              <div>
                <p className="text-xs font-semibold text-violet-800 mb-0.5">{title}</p>
                <p className="text-xs text-violet-700 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
)

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

// ─── Variant stories (1 variant = 1 story) ───────────────────────────────────

export const Shell = {
  name: 'Shell',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          variant=&quot;shell&quot;
        </code>{' '}
        (default) — white background, slate border. Use for any neutral container: tables, forms,
        stats, or empty states.
      </p>
      <div className="w-full max-w-2xl">
        <Card variant="shell">
          <CardHeader>
            <CardIcon icon={Package} />
            <div className="min-w-0 flex-1">
              <CardTitle>Inventory</CardTitle>
              <CardDescription>Default card — no semantic status</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <DataRow label="Total Items" value="48" />
            <DataRow label="Categories" value="5" />
          </CardContent>
        </Card>
      </div>
      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Default for all neutral content — no need to pass it explicitly',
                body: 'Use shell for any container that does not carry a semantic meaning (error, warning, success). Tables, forms, stats, and empty states all use shell without passing the prop.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use shell for error or warning content",
                body: 'Use variant="danger" or variant="warning" instead so the semantic color communicates status at a glance. Shell is neutral — it signals nothing about the content state.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Shell is the baseline variant — no ARIA status role needed',
                body: 'For semantic status cards, add role="status" (success/info) or role="alert" (danger/warning) on the card or its content area. Shell itself needs no extra ARIA attributes.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Never manually set a white background or slate border on the card root',
                body: 'Those come from the shell variant automatically. Overriding via className bypasses the variant system and will conflict with future design changes.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Card>...</Card>
{/* or explicitly */}
<Card variant="shell">...</Card>`}</code>
      </pre>
    </div>
  ),
}

export const TransparentVariant = {
  name: 'Transparent',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          variant=&quot;transparent&quot;
        </code>{' '}
        — no background or border. Use as a page-level section wrapper in the card-in-card pattern.
      </p>
      <div className="w-full max-w-2xl">
        <Card variant="transparent">
          <CardHeader>
            <CardIcon icon={Package} />
            <div className="min-w-0 flex-1">
              <CardTitle>Overview</CardTitle>
              <CardDescription>No background or border — page-level wrapper</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <DataRow label="Total Items" value="48" />
            <DataRow label="Categories" value="5" />
          </CardContent>
        </Card>
      </div>
      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Only use transparent as a page-level section wrapper',
                body: 'transparent is for the outer card in the card-in-card pattern — not for inline content cards or alert banners. It provides header structure without adding a white box.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't nest a transparent card inside a shell",
                body: 'The absence of borders makes it look invisible and the hierarchy becomes confusing. transparent is always the outer wrapper — never an inner card.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Transparent cards should still have a meaningful CardTitle',
                body: 'The absence of visual borders does not mean the section title can be omitted. CardTitle communicates the section purpose to screen readers — always include it.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Pair with shell inner cards that hold the actual content',
                body: 'The transparent card should only contain a CardHeader + CardContent with the grid or flex layout of inner shell cards. Never put data directly inside the transparent card.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Card variant="transparent">...</Card>`}</code>
      </pre>
    </div>
  ),
}

export const InfoVariant = {
  name: 'Info',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant=&quot;info&quot;</code>{' '}
        — blue tint. Use for informational tips, sync status, or neutral guidance.
      </p>
      <div className="w-full max-w-2xl">
        <Card variant="info">
          <CardHeader>
            <CardIcon icon={Info} />
            <div className="min-w-0 flex-1">
              <CardTitle>Sync in Progress</CardTitle>
              <CardDescription>Last synced 5 minutes ago</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <DataRow label="Records synced" value="1,204" />
            <DataRow label="Errors" value="0" />
          </CardContent>
        </Card>
      </div>
      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use for contextual help, tips, sync progress, or non-blocking notices',
                body: 'info is for informational content that does not require action — contextual help, sync status, neutral guidance. It informs without creating urgency.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use info for errors or actions the user must take",
                body: 'Use danger for blocking errors and warning for recoverable issues that need attention. info is strictly informational — it signals nothing is wrong.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'Info cards are informational, not urgent — use role="status" for dynamic content',
                body: 'Don\'t use role="alert" on info cards — it interrupts screen readers unnecessarily. Use role="status" if the content updates dynamically (e.g. sync progress) so updates are announced politely.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Pair with a blue CardIcon (Info, HelpCircle, Zap)',
                body: 'The icon + tint together communicate the semantic purpose. A blue icon reinforces that this is informational — not a warning or error — without the user needing to read the content first.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Card variant="info">...</Card>`}</code>
      </pre>
    </div>
  ),
}

export const SuccessVariant = {
  name: 'Success',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          variant=&quot;success&quot;
        </code>{' '}
        — emerald tint. Use for completed operations, approvals, or exported files.
      </p>
      <div className="w-full max-w-2xl">
        <Card variant="success">
          <CardHeader>
            <CardIcon icon={CheckCircle2} />
            <div className="min-w-0 flex-1">
              <CardTitle>Export Complete</CardTitle>
              <CardDescription>Your CSV file is ready to download</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <DataRow label="File" value="inventory-2026.csv" />
            <DataRow label="Records" value="48 items" />
          </CardContent>
        </Card>
      </div>
      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use for completed operations — exports, restocks, imports finished',
                body: 'success is for transient events: export ready to download, restock confirmed, import finished. Success cards should go away once the user acknowledges them.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Don\'t use success for persistent "healthy" status',
                body: 'Persistent healthy state is just the default shell. Reserve success for events, not ongoing states — a card that stays green forever loses its semantic meaning.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Use role="status" (not role="alert") for success cards',
                body: 'Success cards should be announced without interrupting the user\'s current task. role="status" announces politely; role="alert" interrupts — save that for critical errors.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Pair with a CardFooter download or dismiss button',
                body: 'A success card with no action just sits there. Give users a clear next step — Download, View, or Dismiss — so the success state resolves and the layout can return to normal.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Card variant="success">...</Card>`}</code>
      </pre>
    </div>
  ),
}

export const WarningVariant = {
  name: 'Warning',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          variant=&quot;warning&quot;
        </code>{' '}
        — amber tint. Use for recoverable issues — low stock, approaching limits.
      </p>
      <div className="w-full max-w-2xl">
        <Card variant="warning">
          <CardHeader>
            <CardIcon icon={AlertTriangle} />
            <div className="min-w-0 flex-1">
              <CardTitle>Low Stock Alert</CardTitle>
              <CardDescription>3 items need restocking soon</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <DataRow label="Vitamin C Serum" value="1 left" />
            <DataRow label="Body Lotion" value="2 left" />
            <DataRow label="Moisturizer" value="3 left" />
          </CardContent>
        </Card>
      </div>
      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title:
                  'Use for recoverable issues the user should address but can continue without',
                body: 'warning is for issues the user needs to address eventually but can ignore for now — low stock alerts, expiring sessions, nearing usage limits.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use warning for blocking errors",
                body: 'Use danger when the user cannot continue until the issue is resolved. warning signals "attention needed" not "you must stop" — the distinction matters for user trust.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Use role="alert" with aria-live="polite" for dynamically injected warnings',
                body: 'When warning cards appear dynamically (e.g. after a data load), aria-live="polite" ensures screen readers announce them without interrupting the user.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Always pair with a CardAction or CardFooter CTA',
                body: 'A warning with no action is just noise — users see the amber tint but have nowhere to go. Pair with "Restock", "Renew", or "View" so the warning has a clear resolution path.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Card variant="warning">...</Card>`}</code>
      </pre>
    </div>
  ),
}

export const DangerVariant = {
  name: 'Danger',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          variant=&quot;danger&quot;
        </code>{' '}
        — red tint. Use for blocking errors, payment failures, or missing required data.
      </p>
      <div className="w-full max-w-2xl">
        <Card variant="danger">
          <CardHeader>
            <CardIcon icon={XCircle} />
            <div className="min-w-0 flex-1">
              <CardTitle>Payment Failed</CardTitle>
              <CardDescription>Order #4821 could not be processed</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <DataRow label="Order" value="#4821" />
            <DataRow label="Amount" value="Rp 180.000" />
            <DataRow label="Reason" value="Insufficient funds" />
          </CardContent>
        </Card>
      </div>
      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use for blocking errors — payment failures, broken auth, missing data',
                body: 'danger is for states where the user cannot continue until the issue is resolved. The red tint signals "something is critically wrong and needs immediate attention."',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use danger for destructive confirmation dialogs",
                body: 'Destructive confirmations (Delete, Remove) belong in a Modal with a red button. danger is for error states, not flows where the user is making a deliberate choice.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'Use role="alert" with aria-live="assertive" for dynamically injected errors',
                body: 'When danger cards appear dynamically, aria-live="assertive" ensures screen readers immediately announce the error — appropriate for critical blocking states.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Always include a recovery path in CardFooter or CardAction',
                body: 'Retry, Contact Support, or Go Back so users can resolve the error without a full page reload. A danger card with no action leaves the user stuck.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Card variant="danger">...</Card>`}</code>
      </pre>
    </div>
  ),
}

export const MutedVariant = {
  name: 'Muted',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          variant=&quot;muted&quot;
        </code>{' '}
        — gray tint. Use to de-emphasize archived, read-only, or inactive sections.
      </p>
      <div className="w-full max-w-2xl">
        <Card variant="muted">
          <CardHeader>
            <CardIcon icon={Package} />
            <div className="min-w-0 flex-1">
              <CardTitle>Archived Category</CardTitle>
              <CardDescription>De-emphasized — archived, read-only, or inactive</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <DataRow label="Total Items" value="12" />
            <DataRow label="Status" value="Archived" />
          </CardContent>
        </Card>
      </div>
      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use to de-emphasize archived, disabled, or read-only sections',
                body: 'muted signals "inactive" without removing the card from the layout. Use it for archived items or sections where interaction is not expected.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use muted for loading states",
                body: "Loading states use skeleton rows inside CardContent. Muted is a permanent or long-term state — don't apply it temporarily while waiting for data.",
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Add aria-disabled="true" if muted cards contain non-interactive controls',
                body: 'The gray tint alone does not signal non-interactivity to assistive tech. If the muted card contains controls that are not interactive, mark them with aria-disabled="true" so screen readers announce the inactive state.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Add an "Archived" or "Read-only" badge in CardAction',
                body: 'The gray tint signals inactive visually, but an explicit label in CardAction makes the state unambiguous — especially when the card still shows data that looks like it could be edited.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Card variant="muted">...</Card>`}</code>
      </pre>
    </div>
  ),
}

// ─── Loading State ────────────────────────────────────────────────────────────

export const LoadingState = {
  name: 'Loading State',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Information guide */}
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        While data is loading, replace{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">CardContent</code> with
        skeleton rows. The variant tint is preserved — so the card still communicates status even
        while loading. This pattern works identically across all variants.
      </p>

      {/* 2. Live preview */}
      <div className="w-full max-w-2xl">
        <Card variant="warning">
          <CardHeader>
            <CardIcon icon={AlertTriangle} />
            <div className="min-w-0 flex-1">
              <CardTitle>Low Stock Alert</CardTitle>
              <CardDescription>Loading…</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </CardContent>
        </Card>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use skeleton rows inside CardContent when data is loading',
                body: 'Skeleton rows keep the card layout stable and preview the data density before real content arrives. Show 2–3 rows matching the expected data density.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't switch to shell while loading a status card",
                body: 'Always preserve the variant tint while loading — the colored tint gives users a heads-up of what is coming (warning = low stock, danger = error) before data arrives.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Replace CardDescription with "Loading..." during the loading state',
                body: 'Screen readers announce the description — "Loading..." communicates that data is on the way even before the skeleton is visible to sighted users.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Show 2–3 skeleton rows — not too few, not too many',
                body: 'Too few rows feels sparse; too many implies more data than actually exists and causes layout shift when real rows appear. Match the expected data density of the card.',
              },
            ],
          },
        ]}
      />

      {/* 3. Code snippet */}
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Card variant="warning">
  <CardHeader>
    <CardIcon icon={AlertTriangle} />
    <div className="min-w-0 flex-1">
      <CardTitle>Low Stock Alert</CardTitle>
      <CardDescription>Loading…</CardDescription>
    </div>
  </CardHeader>
  <CardContent>
    <SkeletonRow />
    <SkeletonRow />
    <SkeletonRow />
  </CardContent>
</Card>`}</code>
      </pre>
    </div>
  ),
}

// ─── Error + Retry State ──────────────────────────────────────────────────────

export const ErrorState = {
  name: 'Error State',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Information guide */}
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        When a fetch fails, show an error state inside{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">CardContent</code> with a retry
        button. The card variant stays the same — the error is in the content area, not the card
        style. This pattern works identically across all variants.
      </p>

      {/* 2. Live preview */}
      <div className="w-full max-w-2xl">
        <Card variant="shell">
          <CardHeader>
            <CardIcon icon={Package} />
            <div className="min-w-0 flex-1">
              <CardTitle>Products</CardTitle>
              <CardDescription>Could not load data</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ErrorRetry onRetry={() => {}} />
          </CardContent>
        </Card>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title:
                  'Show an error state inside CardContent with a Retry button when a fetch fails',
                body: 'Keep the card variant unchanged — the error lives in CardContent, not the card style. The header still communicates the section context even when data fails to load.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't switch the card variant to danger on error",
                body: 'Switching variant on error causes a jarring visual change and misuses the danger semantic — danger is for systemic blocking errors, not transient fetch failures.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Add role="alert" and aria-live="assertive" to the error content area',
                body: 'When the error state replaces the skeleton, add role="alert" on the CardContent error state so screen readers immediately announce the failure.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Always include a Retry button and update CardDescription',
                body: 'Include a Retry button with a clear onClick so users can recover without a full page refresh. Update CardDescription to "Could not load data" so the header communicates context in the error state.',
              },
            ],
          },
        ]}
      />

      {/* 3. Code snippet */}
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Card variant="shell">
  <CardHeader>
    <CardIcon icon={Package} />
    <div className="min-w-0 flex-1">
      <CardTitle>Products</CardTitle>
      <CardDescription>Could not load data</CardDescription>
    </div>
  </CardHeader>
  <CardContent>
    <div className="flex flex-col items-center gap-3 py-6 text-center">
      <XCircle className="size-8 text-slate-300" />
      <p className="text-sm text-slate-500">Failed to load data</p>
      <Button size="sm" variant="outline" onClick={onRetry}>Retry</Button>
    </div>
  </CardContent>
</Card>`}</code>
      </pre>
    </div>
  ),
}

// ─── With Action Button ───────────────────────────────────────────────────────

export const WithAction = {
  name: 'With Action',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Information guide */}
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Use <code className="font-mono bg-gray-100 px-1 rounded text-xs">CardAction</code> inside{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">CardHeader</code> to place a
        contextual action button in the right slot. Works across all variants.
      </p>

      {/* 2. Live preview */}
      <div className="w-full max-w-2xl">
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
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use CardAction for contextual secondary actions tied to the section',
                body: "View All, Restock, Filter — actions that let users respond to the card's status. These are secondary actions, not the primary CTA of the page.",
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't place primary create actions in CardAction on status cards",
                body: "Add Trade, Add Product belong in neutral shell cards where the Add button is the section's main purpose. On a warning or danger card, the action should be about resolving the status.",
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Add descriptive aria-labels for icon-only CardAction buttons',
                body: '"View low stock items" is more useful than "View". If CardAction uses an icon-only button, add aria-label so screen readers can announce the button\'s purpose.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Keep CardAction to a single small button (size="sm", variant="outline")',
                body: 'CardAction sits in the header row and should not dominate the title. For multiple actions, use layout="below" on CardHeader to give them their own full-width row.',
              },
            ],
          },
        ]}
      />

      {/* 3. Code snippet */}
      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Card variant="warning">
  <CardHeader>
    <CardIcon icon={AlertTriangle} />
    <div className="min-w-0 flex-1">
      <CardTitle>Low Stock Alert</CardTitle>
      <CardDescription>3 items need restocking soon</CardDescription>
    </div>
    <CardAction>
      <Button size="sm" variant="outline">View Items</Button>
    </CardAction>
  </CardHeader>
  <CardContent>
    {items.map(item => (
      <DataRow key={item.name} label={item.name} value={item.stock} />
    ))}
  </CardContent>
</Card>`}</code>
      </pre>
    </div>
  ),
}
