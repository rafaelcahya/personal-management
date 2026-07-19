import { useState } from 'react'
import {
  Package,
  TrendingUp,
  TrendingDown,
  Wallet,
  Bell,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Check,
} from 'lucide-react'
import Card, {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardHeaderContent,
  CardIcon,
  CardTitle,
} from './Card'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Card/Card',
}

export default meta

const COMBOS = [
  {
    label: 'Border + Shadow',
    props: {},
    desc: 'Default — bordered and shadow both on',
    code: '<Card>',
  },
  {
    label: 'Border only',
    props: { shadow: false },
    desc: 'Shadow removed, border preserved',
    code: '<Card shadow={false}>',
  },
  {
    label: 'Shadow only',
    props: { bordered: false },
    desc: 'Border removed, shadow preserved',
    code: '<Card bordered={false}>',
  },
  {
    label: 'Flat',
    props: { bordered: false, shadow: false },
    desc: 'No border, no shadow',
    code: '<Card bordered={false} shadow={false}>',
  },
]

// ── 1. Portfolio Summary ──────────────────────────────────────────────────────
function PortfolioCard() {
  const stats = [
    { label: 'Total Value', value: 'Rp 142.6M', delta: '+4.2%', up: true },
    { label: "Today's P&L", value: '+Rp 1.84M', delta: '+1.3%', up: true },
    { label: 'Win Rate', value: '68%', delta: '−2% mo', up: false },
    { label: 'Open Positions', value: '7', delta: '3 profit', up: true },
  ]
  return (
    <Card>
      <CardHeader>
        <CardIcon icon={Wallet} />
        <CardHeaderContent>
          <CardTitle>Portfolio Overview</CardTitle>
          <CardDescription>July 2025 · IDX + Crypto</CardDescription>
        </CardHeaderContent>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3 pt-0">
        {stats.map(({ label, value, delta, up }) => (
          <div key={label} className="rounded-lg bg-muted/40 px-3 py-2.5">
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className="text-sm font-semibold text-card-foreground">{value}</p>
            <p className={`text-xs font-medium mt-0.5 ${up ? 'text-success' : 'text-destructive'}`}>
              {delta}
            </p>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <span className="text-xs text-muted-foreground">Last synced 2 min ago</span>
      </CardFooter>
    </Card>
  )
}

// ── 2. Stock Position (shadow only, no border) ────────────────────────────────
function PositionCard() {
  const positions = [
    { ticker: 'BBRI', name: 'Bank Rakyat', price: 'Rp 5,150', pct: '+7.3%', up: true },
    { ticker: 'TLKM', name: 'Telkom', price: 'Rp 3,720', pct: '−4.6%', up: false },
    { ticker: 'ASII', name: 'Astra Intl', price: 'Rp 4,890', pct: '+1.8%', up: true },
  ]
  return (
    <Card bordered={false}>
      <CardHeader>
        <CardIcon icon={TrendingUp} />
        <CardHeaderContent>
          <CardTitle>Open Positions</CardTitle>
          <CardDescription>3 active holdings</CardDescription>
        </CardHeaderContent>
        <MoreHorizontal className="size-4 text-muted-foreground shrink-0" />
      </CardHeader>
      <CardContent className="pt-0 space-y-1">
        {positions.map(({ ticker, name, price, pct, up }) => (
          <div
            key={ticker}
            className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-accent/60 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="size-7 rounded-md bg-secondary flex items-center justify-center">
                <span className="text-[10px] font-bold text-secondary-foreground">
                  {ticker.slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-card-foreground">{ticker}</p>
                <p className="text-[10px] text-muted-foreground">{name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-card-foreground">{price}</p>
              <p
                className={`text-[10px] font-medium flex items-center justify-end gap-0.5 ${up ? 'text-success' : 'text-destructive'}`}
              >
                {up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                {pct}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ── 3. Notification Feed (border only, no shadow) ─────────────────────────────
function NotificationCard() {
  const [read, setRead] = useState([])
  const items = [
    {
      id: 1,
      icon: TrendingUp,
      color: 'text-success',
      title: 'BBRI hit your target',
      time: '2m ago',
      body: 'Price crossed Rp 5,200 — your alert triggered.',
    },
    {
      id: 2,
      icon: Bell,
      color: 'text-info',
      title: 'Dividend incoming',
      time: '1h ago',
      body: 'TLKM declares Rp 150/share dividend for Q2.',
    },
    {
      id: 3,
      icon: TrendingDown,
      color: 'text-destructive',
      title: 'GOTO dropped 8%',
      time: '3h ago',
      body: 'Portfolio impact: −Rp 42,000. Review stop-loss?',
    },
  ]
  return (
    <Card shadow={false}>
      <CardHeader>
        <CardIcon icon={Bell} />
        <CardHeaderContent>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>{items.length - read.length} unread</CardDescription>
        </CardHeaderContent>
      </CardHeader>
      <CardContent className="pt-0 space-y-1">
        {items.map(({ id, icon: Icon, color, title, time, body }) => (
          <div
            key={id}
            className={`flex gap-3 rounded-lg px-3 py-2.5 transition-colors ${read.includes(id) ? 'opacity-50' : 'bg-muted/40'}`}
          >
            <Icon className={`size-4 mt-0.5 shrink-0 ${color}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <p className="text-xs font-semibold text-card-foreground truncate">{title}</p>
                <span className="text-[10px] text-muted-foreground shrink-0">{time}</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-snug">{body}</p>
            </div>
            {!read.includes(id) && (
              <button onClick={() => setRead((r) => [...r, id])} className="shrink-0 mt-0.5">
                <Check className="size-3.5 text-muted-foreground hover:text-foreground transition-colors" />
              </button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ── 4. KYC Verification (flat — no border, no shadow) ────────────────────────
function KycCard() {
  const steps = [
    { label: 'Email verified', done: true },
    { label: 'ID document uploaded', done: true },
    { label: 'Selfie verification', done: false },
    { label: 'Review & approval', done: false },
  ]
  const doneCount = steps.filter((s) => s.done).length
  const pct = Math.round((doneCount / steps.length) * 100)

  return (
    <Card bordered={false} shadow={false} variant="muted">
      <CardHeader>
        <CardIcon icon={ShieldCheck} />
        <CardHeaderContent>
          <CardTitle>KYC Verification</CardTitle>
          <CardDescription>
            {doneCount} of {steps.length} steps complete
          </CardDescription>
        </CardHeaderContent>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="space-y-1.5">
          {steps.map(({ label, done }) => (
            <div key={label} className="flex items-center gap-2.5">
              <div
                className={`size-4 rounded-full flex items-center justify-center shrink-0 ${done ? 'bg-success' : 'bg-muted border border-border'}`}
              >
                {done && <Check className="size-2.5 text-white" />}
              </div>
              <span
                className={`text-xs ${done ? 'text-card-foreground' : 'text-muted-foreground'}`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <button className="text-xs font-semibold text-primary hover:underline underline-offset-2">
          Continue verification →
        </button>
      </CardFooter>
    </Card>
  )
}

// ── 5. Quick Stats Row (nested inside outer shell) ────────────────────────────
function NestedStatsCard() {
  const items = [
    { label: 'Trades this month', value: '24', icon: Package },
    { label: 'Avg. hold time', value: '4.2d', icon: TrendingUp },
    { label: 'Best trade', value: '+18%', icon: ArrowUpRight },
  ]
  return (
    <Card>
      <CardHeader>
        <CardHeaderContent>
          <CardTitle>Monthly Stats</CardTitle>
          <CardDescription>Period: 1 – 19 Jul 2025</CardDescription>
        </CardHeaderContent>
      </CardHeader>
      <CardContent className="pt-0 grid grid-cols-3 gap-2">
        {items.map(({ label, value, icon: Icon }) => (
          <Card key={label} bordered={false} shadow={false} variant="muted">
            <CardContent className="p-3 flex flex-col items-center text-center gap-1">
              <Icon className="size-4 text-primary" />
              <p className="text-lg font-bold text-card-foreground">{value}</p>
              <p className="text-[10px] text-muted-foreground leading-snug">{label}</p>
            </CardContent>
          </Card>
        ))}
      </CardContent>
      <CardFooter>
        <span className="text-xs text-muted-foreground">
          Nested cards use{' '}
          <code className="font-mono bg-muted px-1 rounded">bordered=false shadow=false</code>
        </span>
      </CardFooter>
    </Card>
  )
}

export const Examples = {
  name: 'Examples',
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <div className="flex flex-col gap-1 mb-2">
        <p className="text-sm font-semibold text-gray-700">
          5 realistic cards — border & shadow variants
        </p>
        <p className="text-xs text-gray-400">
          Each card uses a different bordered/shadow combination appropriate to its context.
        </p>
      </div>
      <PortfolioCard />
      <PositionCard />
      <NotificationCard />
      <KycCard />
      <NestedStatsCard />
    </div>
  ),
}

export const ShadowProp = {
  name: 'Shadow prop',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">shadow</code> prop controls
        the card drop shadow independently of{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">bordered</code>. Both props
        default to <code className="font-mono bg-gray-100 px-1 rounded text-xs">true</code> for all
        variants except{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">transparent</code>, which is
        always flat.
      </p>

      <div className="grid grid-cols-2 gap-4 w-full max-w-3xl">
        {COMBOS.map(({ label, props, desc, code }) => (
          <div key={label} className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
            <Card {...props}>
              <CardHeader>
                <CardIcon icon={Package} />
                <div className="min-w-0 flex-1">
                  <CardTitle>{label}</CardTitle>
                  <CardDescription>{desc}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <code className="text-xs font-mono text-slate-500">{code}</code>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* border ✓  shadow ✓  — default */}
<Card>...</Card>

{/* border ✓  shadow ✗ */}
<Card shadow={false}>...</Card>

{/* border ✗  shadow ✓ */}
<Card bordered={false}>...</Card>

{/* border ✗  shadow ✗  — flat */}
<Card bordered={false} shadow={false}>...</Card>

{/* transparent is always flat regardless of props */}
<Card variant="transparent">...</Card>`}</code>
      </pre>
    </div>
  ),
}
