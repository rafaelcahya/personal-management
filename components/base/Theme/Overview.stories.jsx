'use client'

import { useState, useEffect } from 'react'
import {
  TrendingUp,
  Bell,
  Settings,
  Home,
  User,
  Shield,
  Zap,
  Star,
  Trash2,
  Download,
  Search,
  Moon,
  Sun,
  Monitor,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Plus,
  Wallet,
  Activity,
  Layers,
  MoreHorizontal,
  Pencil,
  Eye,
  Copy,
  ArrowUpDown,
  Archive,
  RefreshCw,
  Package,
  ShieldCheck,
} from 'lucide-react'
import { toast } from 'sonner'

import Button from '../Button/Button'
import Input from '../Input/Input'
import PasswordInput from '../PasswordInput/PasswordInput'
import Textarea from '../Textarea/Textarea'
import Slider from '../Slider/Slider'
import { Switch } from '../Switch/Switch'
import { Checkbox } from '../Checkbox/Checkbox'
import { RadioGroup, RadioGroupItem } from '../RadioGroup/RadioGroup'
import Combobox from '../Combobox/Combobox'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../Select/Select'
import DatePicker from '../DatePicker/DatePicker/DatePicker'
import { ColorPicker } from '../ColorPicker/ColorPicker'
import RatingInput from '../RatingInput/RatingInput'
import PinInput from '../PinInput/PinInput'
import {
  SelectCard,
  SelectCardIcon,
  SelectCardTitle,
  SelectCardDescription,
} from '../SelectCard/SelectCard'
import AttachmentGroup from '../Attachment/AttachmentGroup'
import FieldContent from '../Field/FieldContent'
import FieldControl from '../Field/FieldControl'
import FieldLabel from '../Field/FieldLabel'
import FieldDescription from '../Field/FieldDescription'
import FieldGroup from '../Field/FieldGroup'
import FieldContainer from '../Field/FieldContainer'
import { Avatar, AvatarFallback, AvatarImage, AvatarStatus, AvatarGroup } from '../Avatar/Avatar'
import { Badge } from '../Badge/Badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../Tabs/Tabs'
import Pagination from '../Pagination/Pagination'
import { Tooltip, TooltipTrigger, TooltipContent } from '../Tooltip/Tooltip'
import { HoverCard, HoverCardTrigger, HoverCardContent } from '../HoverCard/HoverCard'
import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from '../Popover/Popover'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '../DropdownMenu/DropdownMenu'
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalClose,
} from '../Modal/Modal'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '../Sheet/Sheet'
import {
  Command,
  CommandTrigger,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandSeparator,
  CommandEmpty,
} from '../Command/Command'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../Accordion/Accordion'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '../Collapsible/Collapsible'
import Card, {
  CardHeader,
  CardIcon,
  CardHeaderContent,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../Card/Card'
import { Separator } from '../Separator/Separator'
import { ScrollArea } from '../ScrollArea/ScrollArea'
import { Banner, BannerIcon, BannerContent, BannerTitle, BannerDescription } from '../Banner/Banner'
import { Spinner } from '../Spinner/Spinner'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from '../Breadcrumb/Breadcrumb'
import { Skeleton, SkeletonText } from '../Skeleton/Skeleton'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../Table/Table'
import { DataTable } from '../Table/DataTable'
import {
  NavMenu,
  NavMenuList,
  NavMenuItem,
  NavMenuTrigger,
  NavMenuIndicator,
  NavMenuContent,
  NavMenuLink,
  NavMenuGroup,
  NavMenuGroupTitle,
  NavMenuGroupItem,
  NavMenuSeparator,
} from '../NavMenu/NavMenu'
import State from '../State/State'
import MarkdownEditor from '../MarkdownEditor/MarkdownEditor'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarOverlay,
  SidebarProvider,
  SidebarSub,
  SidebarTrigger,
} from '../Sidebar/Sidebar'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Theme/Overview' }
export default meta

// ── 1. Quick Trade ────────────────────────────────────────────────────────────
function QuickTrade() {
  const [ticker, setTicker] = useState('')
  const [side, setSide] = useState('buy')
  const [submitting, setSubmitting] = useState(false)

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Quick Trade</p>
          <p className="text-xs text-muted-foreground">Log a new position fast</p>
        </div>
        <RadioGroup value={side} onValueChange={setSide} className="flex flex-row gap-3">
          {['buy', 'sell', 'short'].map((v) => (
            <div key={v} className="flex items-center gap-1.5">
              <RadioGroupItem value={v} id={`qt-${v}`} />
              <FieldLabel htmlFor={`qt-${v}`} className="capitalize cursor-pointer">
                {v}
              </FieldLabel>
            </div>
          ))}
        </RadioGroup>
        <FieldGroup cols={2}>
          <FieldContent required>
            <FieldLabel>Ticker</FieldLabel>
            <FieldControl>
              <Input
                placeholder="BBRI"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
              />
            </FieldControl>
          </FieldContent>
          <FieldContent required>
            <FieldLabel>Qty (Lot)</FieldLabel>
            <FieldControl>
              <Input type="number" placeholder="0" min={1} />
            </FieldControl>
          </FieldContent>
        </FieldGroup>
        <Button
          className="w-full"
          isLoading={submitting}
          onClick={() => {
            setSubmitting(true)
            setTimeout(() => {
              setSubmitting(false)
              toast.success('Trade logged!')
            }, 900)
          }}
        >
          Log Trade
        </Button>
      </CardContent>
    </Card>
  )
}

// ── 2. Price Alert ────────────────────────────────────────────────────────────
function PriceAlert() {
  const [enabled, setEnabled] = useState(true)
  const [type, setType] = useState('above')

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Price Alert</p>
            <p className="text-xs text-muted-foreground">Notify when target is hit</p>
          </div>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </div>
        <FieldContainer gap="sm">
          <FieldGroup cols={2}>
            <FieldContent>
              <FieldLabel>Ticker</FieldLabel>
              <FieldControl>
                <Input placeholder="AAPL" />
              </FieldControl>
            </FieldContent>
            <FieldContent>
              <FieldLabel>Target Price</FieldLabel>
              <FieldControl>
                <Input type="number" placeholder="0.00" />
              </FieldControl>
            </FieldContent>
          </FieldGroup>
          <FieldContent>
            <FieldLabel>Condition</FieldLabel>
            <FieldControl>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="above">Price above target</SelectItem>
                  <SelectItem value="below">Price below target</SelectItem>
                  <SelectItem value="cross">Price crosses target</SelectItem>
                </SelectContent>
              </Select>
            </FieldControl>
          </FieldContent>
        </FieldContainer>
        <Button variant="outline" className="w-full" disabled={!enabled}>
          Set Alert
        </Button>
      </CardContent>
    </Card>
  )
}

// ── 3. Payout Threshold ───────────────────────────────────────────────────────
function PayoutThreshold() {
  const [amount, setAmount] = useState(2500)
  const [currency, setCurrency] = useState('idr')

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Payout Threshold</p>
          <p className="text-xs text-muted-foreground">Minimum balance before payout triggers</p>
        </div>
        <FieldContainer gap="sm">
          <FieldContent>
            <FieldLabel>Preferred Currency</FieldLabel>
            <FieldControl>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="idr">IDR — Indonesian Rupiah</SelectItem>
                  <SelectItem value="usd">USD — United States Dollar</SelectItem>
                  <SelectItem value="sgd">SGD — Singapore Dollar</SelectItem>
                </SelectContent>
              </Select>
            </FieldControl>
          </FieldContent>
          <FieldContent>
            <div className="flex items-center justify-between mb-1">
              <FieldLabel>Minimum Payout Amount</FieldLabel>
              <span className="text-sm font-bold text-foreground">
                {currency === 'idr' ? 'Rp' : '$'}
                {amount.toLocaleString()}
              </span>
            </div>
            <FieldControl>
              <Slider
                className="w-full"
                value={[amount]}
                onValueChange={(vals) => setAmount(vals[0])}
                min={500}
                max={10000000}
                step={500}
              />
            </FieldControl>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Min 500</span>
              <span>Max 10,000,000</span>
            </div>
          </FieldContent>
          <FieldContent>
            <FieldLabel>Notes</FieldLabel>
            <FieldControl>
              <Textarea placeholder="Add notes for this payout configuration…" rows={2} />
            </FieldControl>
          </FieldContent>
        </FieldContainer>
        <Button className="w-full">Save Threshold</Button>
      </CardContent>
    </Card>
  )
}

// ── 4. Claimable Balance ──────────────────────────────────────────────────────
function ClaimableBalance() {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div>
          <p className="text-xs text-muted-foreground">Claimable Balance</p>
          <p className="text-3xl font-bold text-foreground mt-1">Rp 3,842,000</p>
          <Badge variant="secondary" className="mt-2">
            Ready to claim
          </Badge>
        </div>
        <Separator />
        <div className="space-y-2">
          {[
            { label: 'Net Royalties', value: 'Rp 3,920,000', muted: false },
            { label: 'Processing Fee', value: '−Rp 78,000', muted: true },
            { label: 'Total Ready to Claim', value: 'Rp 3,842,000', muted: false },
          ].map(({ label, value, muted }) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span
                className={`font-medium ${muted ? 'text-muted-foreground' : 'text-foreground'}`}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
        <Separator />
        <p className="text-xs text-muted-foreground leading-relaxed">
          Balances above Rp 500K are automatically eligible for monthly distribution on the 15th.
        </p>
        <Button className="w-full">Claim Now</Button>
      </CardContent>
    </Card>
  )
}

// ── 5. Notification Preferences ───────────────────────────────────────────────
function NotificationPrefs() {
  const [prefs, setPrefs] = useState({ email: true, push: false, price: true, digest: false })
  const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }))

  const items = [
    { key: 'email', label: 'Email Alerts', desc: 'Trade confirmations' },
    { key: 'push', label: 'Push Notifications', desc: 'Real-time on device' },
    { key: 'price', label: 'Price Alerts', desc: 'When targets are hit' },
    { key: 'digest', label: 'Weekly Digest', desc: 'Portfolio summary' },
  ]

  return (
    <Card>
      <CardContent className="p-4 space-y-1">
        <div className="mb-3">
          <p className="text-sm font-semibold text-foreground">Notifications</p>
          <p className="text-xs text-muted-foreground">Choose what to receive</p>
        </div>
        {items.map(({ key, label, desc }) => (
          <div
            key={key}
            className="flex items-center justify-between py-2.5 border-b border-border last:border-0"
          >
            <div>
              <p className="text-sm font-medium text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
            <Switch checked={prefs[key]} onCheckedChange={() => toggle(key)} />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ── 6. Theme & Accent ─────────────────────────────────────────────────────────
function ThemeAccent() {
  const [theme, setTheme] = useState('system')
  const [accent, setAccent] = useState('#7c3aed')

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Appearance</p>
          <p className="text-xs text-muted-foreground">Theme and accent color</p>
        </div>
        <FieldContent>
          <FieldLabel>Theme</FieldLabel>
          <FieldControl>
            <RadioGroup value={theme} onValueChange={setTheme} className="flex gap-4">
              {[
                { v: 'light', icon: Sun, label: 'Light' },
                { v: 'dark', icon: Moon, label: 'Dark' },
                { v: 'system', icon: Monitor, label: 'System' },
              ].map(({ v, icon: Icon, label }) => (
                <div key={v} className="flex items-center gap-1.5">
                  <RadioGroupItem value={v} id={`th-${v}`} />
                  <FieldLabel
                    htmlFor={`th-${v}`}
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    <Icon className="size-3.5 text-muted-foreground" />
                    {label}
                  </FieldLabel>
                </div>
              ))}
            </RadioGroup>
          </FieldControl>
        </FieldContent>
        <FieldContent>
          <FieldLabel>Accent Color</FieldLabel>
          <FieldControl>
            <ColorPicker value={accent} onChange={setAccent} />
          </FieldControl>
        </FieldContent>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => toast.success('Appearance saved!')}
        >
          Apply
        </Button>
      </CardContent>
    </Card>
  )
}

// ── 7. Confirm with PIN ───────────────────────────────────────────────────────
function ConfirmPin() {
  const [pin, setPin] = useState('')

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center size-10 rounded-full bg-muted mb-3">
            <Shield className="size-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-semibold text-foreground">Confirm Trade</p>
          <p className="text-xs text-muted-foreground mt-0.5">Enter your 6-digit PIN to proceed</p>
        </div>
        <div className="flex justify-center">
          <PinInput length={6} value={pin} onChange={setPin} />
        </div>
        <Button className="w-full" disabled={pin.length < 6}>
          Confirm
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Forgot PIN? <span className="text-primary cursor-pointer underline">Reset</span>
        </p>
      </CardContent>
    </Card>
  )
}

// ── 8. Trade Rating ───────────────────────────────────────────────────────────
function TradeRating() {
  const [rating, setRating] = useState(3)
  const [confidence, setConfidence] = useState(60)

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Trade Quality</p>
          <p className="text-xs text-muted-foreground">Rate your entry and confidence</p>
        </div>
        <FieldContent>
          <FieldLabel>Entry Quality</FieldLabel>
          <FieldControl>
            <RatingInput value={rating} onChange={setRating} />
          </FieldControl>
          <FieldDescription>
            {['', 'Very poor', 'Poor', 'Neutral', 'Good', 'Excellent'][rating]}
          </FieldDescription>
        </FieldContent>
        <FieldContent>
          <div className="flex justify-between mb-1">
            <FieldLabel>Confidence</FieldLabel>
            <span className="text-xs font-semibold text-foreground">{confidence}%</span>
          </div>
          <FieldControl>
            <Slider
              className="w-full"
              value={[confidence]}
              onValueChange={(vals) => setConfidence(vals[0])}
              min={0}
              max={100}
              step={5}
            />
          </FieldControl>
        </FieldContent>
        <Button variant="outline" className="w-full">
          Save Review
        </Button>
      </CardContent>
    </Card>
  )
}

// ── 9. Choose Plan ────────────────────────────────────────────────────────────
function ChoosePlan() {
  const [plan, setPlan] = useState('pro')
  const plans = [
    { value: 'basic', icon: Zap, title: 'Basic', desc: '10 trades/mo' },
    { value: 'pro', icon: Shield, title: 'Pro', desc: 'Unlimited' },
    { value: 'elite', icon: Star, title: 'Elite', desc: 'AI insights' },
  ]

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Subscription Plan</p>
          <p className="text-xs text-muted-foreground">Select the plan that fits you</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {plans.map((p) => (
            <SelectCard
              key={p.value}
              value={p.value}
              selected={plan === p.value}
              onSelect={setPlan}
              layout="vertical"
            >
              <SelectCardIcon>
                <p.icon className="size-4" />
              </SelectCardIcon>
              <SelectCardTitle>{p.title}</SelectCardTitle>
              <SelectCardDescription>{p.desc}</SelectCardDescription>
            </SelectCard>
          ))}
        </div>
        <Button className="w-full">Upgrade to {plans.find((p) => p.value === plan)?.title}</Button>
      </CardContent>
    </Card>
  )
}

// ── 10. Upload Document ───────────────────────────────────────────────────────
function UploadDocument() {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Supporting Documents</p>
          <p className="text-xs text-muted-foreground">Attach broker confirmation or research</p>
        </div>
        <AttachmentGroup accept=".pdf,.png,.jpg" maxSize={5 * 1024 * 1024} />
        <p className="text-xs text-muted-foreground">PDF, PNG or JPG · Max 5 MB per file</p>
      </CardContent>
    </Card>
  )
}

// ── 11. Search Trades ─────────────────────────────────────────────────────────
function SearchTrades() {
  const ALL_TRADES = [
    {
      id: 1,
      ticker: 'BBRI',
      name: 'Bank Rakyat Indonesia',
      side: 'Buy',
      qty: '100 lot',
      price: 'Rp 5,150',
      total: 'Rp 515,000',
      date: '12 Jul 2025',
      pnl: '+Rp 32,000',
      up: true,
    },
    {
      id: 2,
      ticker: 'TLKM',
      name: 'Telkom Indonesia',
      side: 'Sell',
      qty: '200 lot',
      price: 'Rp 3,860',
      total: 'Rp 772,000',
      date: '10 Jul 2025',
      pnl: '−Rp 14,000',
      up: false,
    },
    {
      id: 3,
      ticker: 'BTC',
      name: 'Bitcoin',
      side: 'Buy',
      qty: '0.5 BTC',
      price: '$98,500',
      total: '$49,250',
      date: '8 Jul 2025',
      pnl: '+$1,200',
      up: true,
    },
    {
      id: 4,
      ticker: 'AAPL',
      name: 'Apple Inc.',
      side: 'Sell',
      qty: '50 shr',
      price: '$245.00',
      total: '$12,250',
      date: '5 Jul 2025',
      pnl: '+$620',
      up: true,
    },
    {
      id: 5,
      ticker: 'GOTO',
      name: 'GoTo Group',
      side: 'Buy',
      qty: '500 lot',
      price: 'Rp 84',
      total: 'Rp 42,000',
      date: '1 Jul 2025',
      pnl: '−Rp 4,000',
      up: false,
    },
  ]

  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = ALL_TRADES.filter((t) => {
    const matchQuery =
      query === '' ||
      t.ticker.toLowerCase().includes(query.toLowerCase()) ||
      t.name.toLowerCase().includes(query.toLowerCase())
    const matchFilter = filter === 'all' || t.side.toLowerCase() === filter
    return matchQuery && matchFilter
  })

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Trade History</p>
          <p className="text-xs text-muted-foreground">Search and filter your past trades</p>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ticker or name…"
            className="pl-8"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1">
          {['all', 'buy', 'sell'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize ${
                filter === f
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {f === 'all' ? `All (${ALL_TRADES.length})` : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="space-y-1">
          {filtered.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground">
              No trades found for "{query}"
            </div>
          ) : (
            filtered.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-muted/50 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar size="sm">
                    <AvatarFallback className="text-[10px] font-bold">
                      {t.ticker.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-foreground">{t.ticker}</span>
                      <Badge
                        variant={t.side === 'Buy' ? 'secondary' : 'outline'}
                        className={`text-[10px] px-1.5 py-0 ${t.side === 'Buy' ? 'text-success' : 'text-destructive'}`}
                      >
                        {t.side}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {t.qty} · {t.price} · {t.date}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className="text-xs font-medium text-foreground">{t.total}</p>
                  <p
                    className={`text-xs font-medium ${t.up ? 'text-success' : 'text-destructive'}`}
                  >
                    {t.pnl}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ── 12. Portfolio Stats ───────────────────────────────────────────────────────
function PortfolioStats() {
  const stats = [
    { label: 'Total Value', value: 'Rp 142.6M', badge: '+4.2%', up: true },
    { label: "Today's P&L", value: '+Rp 1.84M', badge: '+1.3%', up: true },
    { label: 'Win Rate', value: '68%', badge: '−2% mo', up: false },
    { label: 'Open Positions', value: '7 assets', badge: '3 profit', up: true },
  ]

  return (
    <Card>
      <CardContent className="p-4 space-y-1">
        <div className="mb-3">
          <p className="text-sm font-semibold text-foreground">Portfolio Overview</p>
          <p className="text-xs text-muted-foreground">December 2024</p>
        </div>
        {stats.map(({ label, value, badge, up }) => (
          <div
            key={label}
            className="flex items-center justify-between py-2.5 border-b border-border last:border-0"
          >
            <p className="text-xs text-muted-foreground">{label}</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">{value}</span>
              <Badge variant={up ? 'default' : 'destructive'} size="sm">
                {badge}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ── 13. Add Date & Exchange ───────────────────────────────────────────────────
function TradeDetails() {
  const [date, setDate] = useState(null)
  const [exchange, setExchange] = useState('idx')

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Trade Details</p>
          <p className="text-xs text-muted-foreground">Date and exchange information</p>
        </div>
        <FieldContainer gap="sm">
          <FieldContent>
            <FieldLabel>Trade Date</FieldLabel>
            <FieldControl>
              <DatePicker value={date} onChange={setDate} placeholder="Pick a date" />
            </FieldControl>
          </FieldContent>
          <FieldContent>
            <FieldLabel>Exchange</FieldLabel>
            <FieldControl>
              <Combobox
                options={[
                  { value: 'idx', label: 'IDX — Indonesia Stock Exchange' },
                  { value: 'nyse', label: 'NYSE — New York Stock Exchange' },
                  { value: 'nasdaq', label: 'NASDAQ' },
                  { value: 'binance', label: 'Binance (Crypto)' },
                ]}
                value={exchange}
                onChange={setExchange}
                placeholder="Search exchange…"
              />
            </FieldControl>
          </FieldContent>
        </FieldContainer>
        <Button variant="outline" className="w-full">
          Continue
        </Button>
      </CardContent>
    </Card>
  )
}

// ── 14. Portfolio Summary ─────────────────────────────────────────────────────
function PortfolioSummary() {
  const [view, setView] = useState('loading')

  useEffect(() => {
    const t = setTimeout(() => setView('data'), 1200)
    return () => clearTimeout(t)
  }, [])

  const load = (result) => {
    setView('loading')
    setTimeout(() => setView(result), 1200)
  }

  const HOLDINGS = [
    {
      ticker: 'BBRI',
      name: 'Bank Rakyat Indonesia',
      value: 'Rp 12.5M',
      pct: '+2.18%',
      alloc: 42,
      up: true,
    },
    {
      ticker: 'TLKM',
      name: 'Telkom Indonesia',
      value: 'Rp 8.3M',
      pct: '−1.28%',
      alloc: 28,
      up: false,
    },
    {
      ticker: 'ASII',
      name: 'Astra International',
      value: 'Rp 5.9M',
      pct: '+0.85%',
      alloc: 20,
      up: true,
    },
    { ticker: 'Cash', name: 'IDR Cash', value: 'Rp 3.0M', pct: '—', alloc: 10, up: null },
  ]

  const body =
    view === 'loading' ? (
      <State variant="loading" skeletonRows={4} className="py-4 px-4" />
    ) : view === 'empty' ? (
      <State
        variant="empty"
        title="No holdings found"
        description="Add your first position to start tracking."
        className="py-10"
      />
    ) : view === 'error' ? (
      <State
        variant="error"
        title="Failed to load portfolio"
        description="Could not reach the data service."
        action={{ label: 'Retry', onClick: () => load('data') }}
        className="py-10"
      />
    ) : (
      <div className="divide-y divide-border">
        {HOLDINGS.map((h) => (
          <div key={h.ticker} className="flex items-center gap-3 px-4 py-3">
            <div className="size-8 rounded-md bg-muted flex items-center justify-center shrink-0">
              <span className="text-[11px] font-bold text-foreground">{h.ticker.slice(0, 2)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{h.ticker}</p>
              <p className="text-xs text-muted-foreground">{h.name}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-medium tabular-nums">{h.value}</p>
              <p
                className={`text-xs tabular-nums ${
                  h.up === true
                    ? 'text-success'
                    : h.up === false
                      ? 'text-destructive'
                      : 'text-muted-foreground'
                }`}
              >
                {h.pct}
              </p>
            </div>
            <div className="w-7 text-right shrink-0">
              <span className="text-[11px] text-muted-foreground">{h.alloc}%</span>
            </div>
          </div>
        ))}
      </div>
    )

  return (
    <Card>
      <CardHeader>
        <CardIcon icon={Wallet} />
        <CardHeaderContent>
          <CardTitle>Portfolio</CardTitle>
          <CardDescription>Equity holdings &amp; cash</CardDescription>
        </CardHeaderContent>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={view === 'loading'}
            onClick={() => load('data')}
          >
            <RefreshCw className={`size-4 ${view === 'loading' ? 'animate-spin' : ''}`} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup label="Simulate state">
                <DropdownMenuItem label="Show data" onSelect={() => load('data')} />
                <DropdownMenuItem label="Show empty" onSelect={() => setView('empty')} />
                <DropdownMenuItem label="Show error" onSelect={() => load('error')} />
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-0">{body}</CardContent>
    </Card>
  )
}

// ── 15. Alerts & Banners ──────────────────────────────────────────────────────
function PortfolioHealth() {
  const [dismissed, setDismissed] = useState([])
  const dismiss = (id) => setDismissed((prev) => [...prev, id])

  const ALERTS = [
    {
      id: 'sync',
      variant: 'danger',
      icon: XCircle,
      title: 'Broker sync failed',
      desc: 'Last sync attempt failed at 09:14. Portfolio data may be outdated.',
      action: { label: 'Retry', onClick: () => toast.success('Reconnecting…') },
    },
    {
      id: 'margin',
      variant: 'warning',
      icon: AlertTriangle,
      title: 'Margin usage at 78%',
      desc: 'You are approaching your margin limit. Consider reducing open positions.',
      action: { label: 'Review', onClick: () => toast.success('Opening positions…') },
    },
    {
      id: 'kyc',
      variant: 'info',
      icon: Info,
      title: 'Complete your KYC verification',
      desc: 'Submit your ID to unlock full trading features and higher limits.',
      action: { label: 'Start KYC', onClick: () => toast.success('Opening KYC flow…') },
    },
    {
      id: 'trade',
      variant: 'success',
      icon: CheckCircle2,
      title: 'BBRI order executed',
      desc: 'Buy 100 lot @ Rp 5,150 filled at 09:31 WIB.',
    },
  ]

  const visible = ALERTS.filter((a) => !dismissed.includes(a.id))

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Portfolio Health</p>
            <p className="text-xs text-muted-foreground">
              {visible.length} active notification{visible.length !== 1 ? 's' : ''}
            </p>
          </div>
          {dismissed.length < ALERTS.length && (
            <Button variant="ghost" size="xs" onClick={() => setDismissed(ALERTS.map((a) => a.id))}>
              Dismiss all
            </Button>
          )}
          {dismissed.length === ALERTS.length && (
            <Button variant="ghost" size="xs" onClick={() => setDismissed([])}>
              Reset
            </Button>
          )}
        </div>

        {visible.length === 0 ? (
          <div className="py-6 flex flex-col items-center gap-2">
            <CheckCircle2 className="size-8 text-success" />
            <p className="text-sm font-medium text-foreground">All clear</p>
            <p className="text-xs text-muted-foreground">No active alerts on your portfolio</p>
          </div>
        ) : (
          <div className="space-y-2">
            {visible.map(({ id, variant, icon, title, desc, action }) => (
              <Banner key={id} variant={variant}>
                <BannerIcon icon={icon} />
                <BannerContent>
                  <BannerTitle>{title}</BannerTitle>
                  <BannerDescription>{desc}</BannerDescription>
                  {action && (
                    <button
                      onClick={action.onClick}
                      className="mt-1.5 text-xs font-semibold underline underline-offset-2 hover:opacity-70 transition-opacity"
                    >
                      {action.label} →
                    </button>
                  )}
                </BannerContent>
                <button
                  onClick={() => dismiss(id)}
                  className="ml-auto shrink-0 p-0.5 rounded hover:opacity-60 transition-opacity"
                  aria-label="Dismiss"
                >
                  <XCircle className="size-3.5" />
                </button>
              </Banner>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ── 16. Overlays ──────────────────────────────────────────────────────────────
function PortfolioPositionCard() {
  const [alertPrice, setAlertPrice] = useState('')

  const POSITIONS = [
    {
      ticker: 'BBRI',
      name: 'Bank Rakyat Indonesia',
      sector: 'Financials · IDX',
      qty: 500,
      avgCost: 4800,
      currentPrice: 5150,
      marketValue: 2575000,
    },
    {
      ticker: 'TLKM',
      name: 'Telkom Indonesia',
      sector: 'Telecoms · IDX',
      qty: 200,
      avgCost: 3900,
      currentPrice: 3720,
      marketValue: 744000,
    },
  ]

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">My Positions</p>
            <p className="text-xs text-muted-foreground">2 active holdings</p>
          </div>
          <Badge variant="secondary">{POSITIONS.length} stocks</Badge>
        </div>

        <div className="space-y-2">
          {POSITIONS.map((pos) => {
            const pnl = (pos.currentPrice - pos.avgCost) * pos.qty
            const pnlPct = ((pos.currentPrice - pos.avgCost) / pos.avgCost) * 100
            const isGain = pnl >= 0

            return (
              <div key={pos.ticker} className="rounded-lg border border-border p-3 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar size="sm">
                      <AvatarFallback className="text-[10px] font-bold">
                        {pos.ticker.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <button className="text-sm font-semibold text-foreground hover:underline underline-offset-2 cursor-pointer">
                            {pos.ticker}
                          </button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-56 p-3">
                          <p className="text-sm font-semibold text-foreground">{pos.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{pos.sector}</p>
                          <Separator className="my-2" />
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Qty</span>
                              <span className="font-medium text-foreground">
                                {pos.qty.toLocaleString()} shares
                              </span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Avg Cost</span>
                              <span className="font-medium text-foreground">
                                Rp {pos.avgCost.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                      <p className="text-xs text-muted-foreground">{pos.sector}</p>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded">
                        <MoreHorizontal className="size-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Sheet>
                        <SheetTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Pencil className="size-3.5" /> View Detail
                          </DropdownMenuItem>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>{pos.ticker} — Position Detail</SheetTitle>
                            <SheetDescription>
                              {pos.name} · {pos.sector}
                            </SheetDescription>
                          </SheetHeader>
                          <div className="p-4 space-y-3">
                            {[
                              ['Quantity', `${pos.qty.toLocaleString()} shares`],
                              ['Avg Cost', `Rp ${pos.avgCost.toLocaleString()}`],
                              ['Current Price', `Rp ${pos.currentPrice.toLocaleString()}`],
                              ['Market Value', `Rp ${pos.marketValue.toLocaleString()}`],
                              ['Unrealized P&L', `${isGain ? '+' : ''}Rp ${pnl.toLocaleString()}`],
                              ['Return', `${isGain ? '+' : ''}${pnlPct.toFixed(2)}%`],
                            ].map(([k, v]) => (
                              <div
                                key={k}
                                className="flex justify-between text-sm border-b border-border pb-2 last:border-0"
                              >
                                <span className="text-muted-foreground">{k}</span>
                                <span className="font-medium text-foreground">{v}</span>
                              </div>
                            ))}
                          </div>
                          <div className="p-4 border-t border-border">
                            <SheetClose asChild>
                              <Button variant="outline" className="w-full">
                                Close
                              </Button>
                            </SheetClose>
                          </div>
                        </SheetContent>
                      </Sheet>

                      <Popover>
                        <PopoverTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Bell className="size-3.5" /> Set Alert
                          </DropdownMenuItem>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 p-3" align="end">
                          <p className="text-sm font-medium text-foreground mb-2">
                            Price Alert — {pos.ticker}
                          </p>
                          <div className="flex gap-2">
                            <Input
                              placeholder={`e.g. ${pos.currentPrice + 200}`}
                              value={alertPrice}
                              onChange={(e) => setAlertPrice(e.target.value)}
                              className="flex-1"
                            />
                            <PopoverClose asChild>
                              <Button
                                size="sm"
                                onClick={() => {
                                  toast.success(`Alert set at Rp ${alertPrice}`)
                                  setAlertPrice('')
                                }}
                              >
                                Set
                              </Button>
                            </PopoverClose>
                          </div>
                        </PopoverContent>
                      </Popover>

                      <DropdownMenuSeparator />

                      <Modal>
                        <ModalTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="text-destructive"
                          >
                            <Trash2 className="size-3.5" /> Close Position
                          </DropdownMenuItem>
                        </ModalTrigger>
                        <ModalContent>
                          <ModalHeader>
                            <ModalTitle>Close {pos.ticker} Position?</ModalTitle>
                            <ModalDescription>
                              This will sell all {pos.qty.toLocaleString()} shares at market price.
                              This action cannot be undone.
                            </ModalDescription>
                          </ModalHeader>
                          <ModalFooter>
                            <ModalClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </ModalClose>
                            <Button
                              variant="destructive"
                              onClick={() => toast.error(`${pos.ticker} position closed`)}
                            >
                              Close Position
                            </Button>
                          </ModalFooter>
                        </ModalContent>
                      </Modal>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-foreground">
                      Rp {pos.currentPrice.toLocaleString()}
                    </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-muted-foreground">
                          <Info className="size-3" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Last market close price</TooltipContent>
                    </Tooltip>
                  </div>
                  <span
                    className={`text-xs font-semibold ${isGain ? 'text-success' : 'text-destructive'}`}
                  >
                    {isGain ? '+' : ''}
                    {pnlPct.toFixed(2)}%
                  </span>
                </div>

                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Mkt value: Rp {pos.marketValue.toLocaleString()}</span>
                  <span className={isGain ? 'text-success' : 'text-destructive'}>
                    {isGain ? '+' : ''}Rp {pnl.toLocaleString()}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// ── 17. Spinners ──────────────────────────────────────────────────────────────
function SyncingData() {
  const [syncing, setSyncing] = useState(false)
  const [done, setDone] = useState(false)

  const ITEMS = [
    { label: 'Portfolio positions', done: true },
    { label: 'Trade history', done: true },
    { label: 'Dividend records', done: false },
    { label: 'Price data', done: false, live: true },
  ]

  const handleSync = () => {
    setSyncing(true)
    setDone(false)
    setTimeout(() => {
      setSyncing(false)
      setDone(true)
      toast.success('Data synced successfully')
    }, 2500)
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Sync Portfolio Data</p>
            <p className="text-xs text-muted-foreground">Pull latest data from your broker</p>
          </div>
          {syncing && <Spinner size="sm" />}
          {done && <CheckCircle2 className="size-4 text-success" />}
        </div>

        <div className="space-y-2">
          {ITEMS.map(({ label, done: itemDone, live }, i) => {
            const isActive = syncing && i === ITEMS.findIndex((x) => !x.done && !x.live)
            return (
              <div
                key={label}
                className="flex items-center justify-between rounded-md px-3 py-2 bg-muted/40"
              >
                <div>
                  <span className="text-sm text-foreground">{label}</span>
                  {live && (
                    <span className="ml-1.5 text-[10px] text-success font-medium">LIVE</span>
                  )}
                </div>
                {live ? (
                  <Spinner size="xs" />
                ) : isActive ? (
                  <Spinner size="xs" />
                ) : itemDone || done ? (
                  <CheckCircle2 className="size-3.5 text-success" />
                ) : (
                  <span className="size-3.5 rounded-full border border-border block" />
                )}
              </div>
            )
          })}
        </div>

        <div className="rounded-md bg-muted/40 px-3 py-2 flex items-center gap-2">
          {syncing ? (
            <>
              <Spinner size="xs" variant="muted" />
              <span className="text-xs text-muted-foreground">Syncing with broker API…</span>
            </>
          ) : done ? (
            <>
              <CheckCircle2 className="size-3.5 text-success" />
              <span className="text-xs text-muted-foreground">All data up to date</span>
            </>
          ) : (
            <span className="text-xs text-muted-foreground">Last synced 2 hours ago</span>
          )}
        </div>

        <Button className="w-full" variant="outline" onClick={handleSync} isLoading={syncing}>
          {syncing ? 'Syncing…' : 'Sync Now'}
        </Button>
      </CardContent>
    </Card>
  )
}

// ── 18. FAQ Accordion ─────────────────────────────────────────────────────────
function FaqAccordion() {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div>
          <p className="text-sm font-semibold text-foreground">FAQ</p>
          <p className="text-xs text-muted-foreground">Common questions about trading</p>
        </div>
        <Accordion type="single" collapsible defaultValue="q1">
          <AccordionItem value="q1">
            <AccordionTrigger>How is P&L calculated?</AccordionTrigger>
            <AccordionContent>
              P&L = (current price − avg cost) × shares. Unrealized updates live; realized locks on
              close.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>Can I import trades from my broker?</AccordionTrigger>
            <AccordionContent>
              Yes — go to Settings → Import and upload a CSV. We support IDX, NASDAQ, and most
              brokers.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger>How do price alerts work?</AccordionTrigger>
            <AccordionContent>
              Enable alerts on any trade. You'll get a push notification when the asset crosses your
              target.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}

// ── 19. Trading Strategy ─────────────────────────────────────────────────────
function TradingStrategy() {
  return (
    <div className="space-y-1">
      <div className="mb-3">
        <p className="text-sm font-semibold text-foreground">Trading Strategy</p>
        <p className="text-xs text-muted-foreground">Your active rule set for BBRI</p>
      </div>

      <Accordion type="multiple" variant="card" defaultValue={['risk']}>
        <AccordionItem value="risk">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-md bg-destructive-subtle flex items-center justify-center shrink-0">
                <Shield className="size-3.5 text-destructive" />
              </div>
              <span className="text-sm">Risk Management</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Max loss per trade</span>
                <span className="font-medium text-foreground">2% of portfolio</span>
              </div>
              <div className="flex justify-between">
                <span>Daily drawdown limit</span>
                <span className="font-medium text-foreground">5%</span>
              </div>
              <div className="flex justify-between">
                <span>Stop loss</span>
                <span className="font-medium text-destructive">−3% from entry</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="entry">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-md bg-success-subtle flex items-center justify-center shrink-0">
                <TrendingUp className="size-3.5 text-success" />
              </div>
              <span className="text-sm">Entry Rules</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Signal</span>
                <span className="font-medium text-foreground">MA20 cross above MA50</span>
              </div>
              <div className="flex justify-between">
                <span>Volume condition</span>
                <span className="font-medium text-foreground">{'>'} 1.5× avg 20d</span>
              </div>
              <div className="flex justify-between">
                <span>RSI range</span>
                <span className="font-medium text-foreground">40 – 60</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="exit">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-md bg-warning-subtle flex items-center justify-center shrink-0">
                <Activity className="size-3.5 text-warning" />
              </div>
              <span className="text-sm">Exit Rules</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Take profit 1</span>
                <span className="font-medium text-success">+5% → sell 50%</span>
              </div>
              <div className="flex justify-between">
                <span>Take profit 2</span>
                <span className="font-medium text-success">+10% → sell rest</span>
              </div>
              <div className="flex justify-between">
                <span>Trailing stop</span>
                <span className="font-medium text-foreground">2% below peak</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sizing">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-md bg-info/10 flex items-center justify-center shrink-0">
                <Layers className="size-3.5 text-info" />
              </div>
              <span className="text-sm">Position Sizing</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Method</span>
                <span className="font-medium text-foreground">Fixed fractional</span>
              </div>
              <div className="flex justify-between">
                <span>Allocation per trade</span>
                <span className="font-medium text-foreground">10% of portfolio</span>
              </div>
              <div className="flex justify-between">
                <span>Max open positions</span>
                <span className="font-medium text-foreground">8 positions</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

// ── 20. Export Report ────────────────────────────────────────────────────────
function ExportReport() {
  const SECTIONS = [
    { id: 'summary', label: 'Portfolio Summary', desc: 'Total value, return, asset allocation' },
    { id: 'trades', label: 'Trade History', desc: 'All buy/sell transactions in the period' },
    { id: 'pnl', label: 'P&L Analysis', desc: 'Realized and unrealized gains/losses' },
    { id: 'dividends', label: 'Dividends', desc: 'Dividend income received' },
    { id: 'tax', label: 'Tax Summary', desc: 'Capital gains for tax reporting' },
  ]

  const [sections, setSections] = useState({
    summary: true,
    trades: true,
    pnl: true,
    dividends: false,
    tax: false,
  })
  const [format, setFormat] = useState('pdf')
  const [period, setPeriod] = useState('this-year')
  const [isLoading, setIsLoading] = useState(false)

  const values = Object.values(sections)
  const allSelected = values.every(Boolean)
  const someSelected = values.some(Boolean) && !allSelected
  const selectedCount = values.filter(Boolean).length

  const toggleAll = () => {
    const next = !allSelected
    setSections(Object.fromEntries(SECTIONS.map((s) => [s.id, next])))
  }

  const toggle = (id) => setSections((prev) => ({ ...prev, [id]: !prev[id] }))

  const handleExport = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast.success(`Report exported as ${format.toUpperCase()}`)
    }, 1500)
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Export Report</p>
          <p className="text-xs text-muted-foreground">Choose sections to include in your report</p>
        </div>

        <FieldGroup cols={2}>
          <FieldContent>
            <FieldLabel>Format</FieldLabel>
            <FieldControl>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                </SelectContent>
              </Select>
            </FieldControl>
          </FieldContent>
          <FieldContent>
            <FieldLabel>Period</FieldLabel>
            <FieldControl>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-quarter">Last Quarter</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                  <SelectItem value="all-time">All Time</SelectItem>
                </SelectContent>
              </Select>
            </FieldControl>
          </FieldContent>
        </FieldGroup>

        <div className="space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <Checkbox
                id="export-all"
                checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                onCheckedChange={toggleAll}
              />
              <FieldLabel htmlFor="export-all" className="cursor-pointer">
                Include all sections
              </FieldLabel>
            </div>
            <span className="text-xs text-muted-foreground">
              {selectedCount} of {SECTIONS.length}
            </span>
          </div>

          <div className="space-y-1">
            {SECTIONS.map(({ id, label, desc }) => (
              <div
                key={id}
                onClick={() => toggle(id)}
                className="flex items-start gap-3 rounded-md px-2 py-2 cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  id={`sec-${id}`}
                  checked={sections[id]}
                  onCheckedChange={() => toggle(id)}
                  className="mt-0.5"
                />
                <div>
                  <FieldLabel htmlFor={`sec-${id}`} className="cursor-pointer leading-none">
                    {label}
                  </FieldLabel>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button
          className="w-full"
          onClick={handleExport}
          isLoading={isLoading}
          disabled={selectedCount === 0}
        >
          Export Report
        </Button>
      </CardContent>
    </Card>
  )
}

// ── 20. Color Picker ─────────────────────────────────────────────────────────
function ChartAppearance() {
  const PRESETS = [
    '#6366f1',
    '#8b5cf6',
    '#ec4899',
    '#ef4444',
    '#f97316',
    '#f59e0b',
    '#10b981',
    '#06b6d4',
    '#3b82f6',
    '#64748b',
  ]

  const [name, setName] = useState('My Portfolio')
  const [lineColor, setLineColor] = useState('#6366f1')
  const [fillColor, setFillColor] = useState('#8b5cf6')
  const [gridColor, setGridColor] = useState('#64748b')

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Chart Appearance</p>
          <p className="text-xs text-muted-foreground">Customize how your portfolio chart looks</p>
        </div>

        <FieldContent>
          <FieldLabel>Chart Name</FieldLabel>
          <FieldControl>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. My Portfolio"
            />
          </FieldControl>
        </FieldContent>

        <div className="space-y-2.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Colors
          </p>

          <FieldContent>
            <FieldLabel className="whitespace-nowrap">Line Color</FieldLabel>
            <FieldControl>
              <ColorPicker
                value={lineColor}
                onChange={setLineColor}
                format="hex"
                presets={PRESETS}
              />
            </FieldControl>
            <FieldDescription className="font-mono">{lineColor}</FieldDescription>
          </FieldContent>

          <FieldContent>
            <FieldLabel className="whitespace-nowrap">Fill Color</FieldLabel>
            <FieldControl>
              <ColorPicker
                value={fillColor}
                onChange={setFillColor}
                format="hex"
                presets={PRESETS}
              />
            </FieldControl>
            <FieldDescription className="font-mono">{fillColor}</FieldDescription>
          </FieldContent>

          <FieldContent>
            <FieldLabel className="whitespace-nowrap">Grid Color</FieldLabel>
            <FieldControl>
              <ColorPicker
                value={gridColor}
                onChange={setGridColor}
                format="hex"
                presets={PRESETS}
              />
            </FieldControl>
            <FieldDescription className="font-mono">{gridColor}</FieldDescription>
          </FieldContent>
        </div>

        {/* Preview */}
        <div
          className="rounded-lg border border-border p-3 h-24 relative overflow-hidden"
          style={{ background: `${fillColor}10` }}
        >
          <svg viewBox="0 0 220 60" className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={fillColor} stopOpacity="0.3" />
                <stop offset="100%" stopColor={fillColor} stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0, 55, 110, 165, 220].map((x) => (
              <line
                key={x}
                x1={x}
                y1="0"
                x2={x}
                y2="60"
                stroke={gridColor}
                strokeOpacity="0.2"
                strokeWidth="0.5"
              />
            ))}
            {[0, 20, 40, 60].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="220"
                y2={y}
                stroke={gridColor}
                strokeOpacity="0.2"
                strokeWidth="0.5"
              />
            ))}
            <path
              d="M0,48 L40,38 L80,42 L120,22 L160,28 L220,10"
              fill="none"
              stroke={lineColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M0,48 L40,38 L80,42 L120,22 L160,28 L220,10 L220,60 L0,60Z"
              fill="url(#chartFill)"
            />
          </svg>
          <span className="absolute top-2 left-3 text-[10px] font-medium text-foreground/60">
            {name}
          </span>
        </div>

        <Button className="w-full" onClick={() => toast.success('Chart appearance saved')}>
          Save Appearance
        </Button>
      </CardContent>
    </Card>
  )
}

// ── 20. Button Variants ───────────────────────────────────────────────────────
function PlaceOrder() {
  const [isPlacing, setIsPlacing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [watchlisted, setWatchlisted] = useState(false)
  const [qty, setQty] = useState(100)
  const price = 5150
  const total = qty * price

  const handlePlace = () => {
    setIsPlacing(true)
    setTimeout(() => {
      setIsPlacing(false)
      toast.success('Order placed — BBRI 100 lot @ Rp 5,150')
    }, 1800)
  }

  const handleDraft = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success('Draft saved')
    }, 1000)
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <Avatar size="sm">
              <AvatarFallback className="text-[10px] font-bold">BB</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-foreground">BBRI</p>
              <p className="text-xs text-muted-foreground">Bank Rakyat Indonesia · IDX</p>
            </div>
          </div>

          {/* Ghost icon buttons — toolbar */}
          <div className="flex items-center gap-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => {
                    setWatchlisted((w) => !w)
                    toast.success(watchlisted ? 'Removed from watchlist' : 'Added to watchlist')
                  }}
                >
                  <Star
                    className={`size-3.5 ${watchlisted ? 'fill-amber-400 text-amber-400' : ''}`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {watchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => toast.success('Report downloaded')}
                >
                  <Download className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download report</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Order summary */}
        <div className="rounded-lg bg-muted/40 border border-border divide-y divide-border">
          {[
            [
              'Type',
              <Badge key="type" variant="secondary" className="text-xs">
                Buy
              </Badge>,
            ],
            ['Price', `Rp ${price.toLocaleString()}`],
            ['Quantity', `${qty} lot`],
            [
              'Est. Total',
              <span key="total" className="font-semibold text-foreground">
                Rp {total.toLocaleString()}
              </span>,
            ],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between px-3 py-2 text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium text-foreground">{value}</span>
            </div>
          ))}
        </div>

        {/* Qty controls — outline + ghost */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Adjust quantity</p>
          <div className="flex items-center gap-1.5">
            <Button
              size="icon-sm"
              variant="outline"
              onClick={() => setQty((q) => Math.max(1, q - 10))}
            >
              <span className="text-base leading-none">−</span>
            </Button>
            <span className="w-10 text-center text-sm font-medium tabular-nums">{qty}</span>
            <Button size="icon-sm" variant="outline" onClick={() => setQty((q) => q + 10)}>
              <Plus className="size-3.5" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* Primary actions */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => toast.success('Order cleared')}
            >
              Clear
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              isLoading={isSaving}
              onClick={handleDraft}
            >
              Save Draft
            </Button>
            <Button className="flex-1" isLoading={isPlacing} onClick={handlePlace}>
              Place Order
            </Button>
          </div>

          {/* Destructive + link */}
          <div className="flex items-center justify-between pt-1">
            <Button variant="link" size="sm" className="h-auto p-0 text-xs">
              View fee schedule
            </Button>
            <Button variant="destructive" size="sm" onClick={() => toast.error('Order cancelled')}>
              Cancel Order
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ── 20. Disabled Form ─────────────────────────────────────────────────────────
function AccountProfile() {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('Rafael Cahya')
  const [bio, setBio] = useState('Personal investor focused on IDX and crypto markets.')
  const [exchange, setExchange] = useState('idx')
  const [alerts, setAlerts] = useState(true)
  const [riskLevel, setRiskLevel] = useState([60])
  const [joinDate] = useState(new Date('2023-03-15'))
  const [draft, setDraft] = useState({})

  const handleEdit = () => {
    setDraft({ name, bio, exchange, alerts, riskLevel })
    setEditing(true)
  }

  const handleCancel = () => setEditing(false)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setName(draft.name)
      setBio(draft.bio)
      setExchange(draft.exchange)
      setAlerts(draft.alerts)
      setRiskLevel(draft.riskLevel)
      setSaving(false)
      setEditing(false)
      toast.success('Profile updated')
    }, 1200)
  }

  const isDisabled = !editing
  const vals = { name, bio, exchange, alerts, riskLevel }
  const val = (key) => (editing ? draft[key] : vals[key])
  const set = (key) => (v) => setDraft((d) => ({ ...d, [key]: v }))

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="font-bold">RC</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-foreground">{name}</p>
              <p className="text-xs text-muted-foreground">example95@gmail.com</p>
            </div>
          </div>
          {!editing && (
            <Button size="sm" variant="outline" useIcon onClick={handleEdit}>
              <Pencil className="size-3.5" /> Edit
            </Button>
          )}
        </div>

        <Separator />

        <FieldContainer gap="sm">
          <FieldContent disabled={isDisabled}>
            <FieldLabel>Full Name</FieldLabel>
            <FieldControl>
              <Input value={val('name')} onChange={(e) => set('name')(e.target.value)} />
            </FieldControl>
          </FieldContent>

          <FieldContent disabled>
            <FieldLabel>Email</FieldLabel>
            <FieldControl>
              <Input value="example95@gmail.com" />
            </FieldControl>
            <FieldDescription>Managed by your auth provider</FieldDescription>
          </FieldContent>

          <FieldContent disabled={isDisabled}>
            <FieldLabel>Bio</FieldLabel>
            <FieldControl>
              <Textarea value={val('bio')} onChange={(e) => set('bio')(e.target.value)} rows={2} />
            </FieldControl>
          </FieldContent>

          <FieldContent disabled={isDisabled}>
            <FieldLabel>Primary Exchange</FieldLabel>
            <FieldControl>
              <Select value={val('exchange')} onValueChange={set('exchange')} disabled={isDisabled}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="idx">IDX — Indonesia Stock Exchange</SelectItem>
                  <SelectItem value="nasdaq">NASDAQ</SelectItem>
                  <SelectItem value="nyse">NYSE</SelectItem>
                </SelectContent>
              </Select>
            </FieldControl>
          </FieldContent>

          <FieldContent disabled={isDisabled}>
            <FieldLabel>Risk Tolerance</FieldLabel>
            <FieldControl>
              <Slider
                className="w-full"
                value={val('riskLevel')}
                onValueChange={set('riskLevel')}
                min={0}
                max={100}
                disabled={isDisabled}
              />
            </FieldControl>
            <FieldDescription>
              {val('riskLevel')[0]}% —{' '}
              {val('riskLevel')[0] < 40
                ? 'Conservative'
                : val('riskLevel')[0] < 70
                  ? 'Moderate'
                  : 'Aggressive'}
            </FieldDescription>
          </FieldContent>

          <FieldContent disabled={isDisabled}>
            <div className="flex items-center justify-between">
              <div>
                <FieldLabel>Price Alerts</FieldLabel>
                <FieldDescription>Receive push notifications</FieldDescription>
              </div>
              <Switch
                checked={val('alerts')}
                onCheckedChange={set('alerts')}
                disabled={isDisabled}
              />
            </div>
          </FieldContent>

          <FieldContent disabled>
            <FieldLabel>Member Since</FieldLabel>
            <FieldControl>
              <DatePicker value={joinDate} onChange={() => {}} disabled />
            </FieldControl>
          </FieldContent>
        </FieldContainer>

        {editing && (
          <div className="flex gap-2 pt-1">
            <Button variant="outline" className="flex-1" onClick={handleCancel}>
              Cancel
            </Button>
            <Button className="flex-1" isLoading={saving} onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
// ── Avatar Showcase ───────────────────────────────────────────────────────────
function AvatarShowcase() {
  const MEMBERS = [
    { initials: 'RC', name: 'Rafael Cahya', role: 'Owner', status: 'online', ping: true },
    { initials: 'AD', name: 'Andi Dharma', role: 'Analyst', status: 'busy', ping: false },
    { initials: 'SR', name: 'Siti Rahayu', role: 'Viewer', status: 'away', ping: false },
    { initials: 'BW', name: 'Budi Wijaya', role: 'Viewer', status: 'offline', ping: false },
  ]

  const STATUS_LABEL = { online: 'Online', busy: 'Busy', away: 'Away', offline: 'Offline' }
  const STATUS_COLOR = {
    online: 'text-success',
    busy: 'text-destructive',
    away: 'text-warning',
    offline: 'text-muted-foreground',
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-5">
        <div>
          <p className="text-sm font-semibold text-foreground">Portfolio Team</p>
          <p className="text-xs text-muted-foreground">Members with access to this portfolio</p>
        </div>

        {/* Featured — large avatar with ping */}
        <div className="flex items-center gap-4 rounded-lg bg-muted/40 px-4 py-3">
          <Avatar size="xl">
            <AvatarFallback className="bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 font-bold">
              RC
            </AvatarFallback>
            <AvatarStatus status="online" ping />
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-foreground">Rafael Cahya</p>
            <p className="text-xs text-muted-foreground">Owner · Active now</p>
            <div className="flex items-center gap-1 mt-1">
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                Admin
              </Badge>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                Full Access
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Member list — default size + status */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Members
          </p>
          {MEMBERS.slice(1).map(({ initials, name, role, status, ping }) => (
            <div key={name} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Avatar size="sm">
                  <AvatarFallback>{initials}</AvatarFallback>
                  <AvatarStatus status={status} ping={ping} />
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-foreground leading-none">{name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{role}</p>
                </div>
              </div>
              <span className={`text-xs font-medium ${STATUS_COLOR[status]}`}>
                {STATUS_LABEL[status]}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ActivityFeed() {
  const FEED = [
    {
      initials: 'RC',
      size: 'lg',
      color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
      name: 'Rafael Cahya',
      action: 'placed a buy order',
      subject: 'BBRI 100 lot @ Rp 5,150',
      time: '2m ago',
    },
    {
      initials: 'AD',
      size: 'default',
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
      name: 'Andi Dharma',
      action: 'commented on',
      subject: 'TLKM Q3 outlook',
      time: '18m ago',
    },
    {
      initials: 'SR',
      size: 'sm',
      color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
      name: 'Siti Rahayu',
      action: 'reacted to',
      subject: 'portfolio update',
      time: '1h ago',
    },
    {
      initials: 'BW',
      size: 'xs',
      color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
      name: 'Budi',
      action: 'joined the portfolio',
      subject: '',
      time: '3h ago',
    },
  ]

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Activity Feed</p>
          <p className="text-xs text-muted-foreground">Avatar sizes in context — xs to lg</p>
        </div>

        <div className="space-y-4">
          {FEED.map(({ initials, size, color, name, action, subject, time }) => (
            <div key={name} className="flex items-start gap-3">
              <Avatar size={size} className="mt-0.5 shrink-0">
                <AvatarFallback className={color}>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-snug">
                  <span className="font-medium">{name}</span>{' '}
                  <span className="text-muted-foreground">{action}</span>
                  {subject && <span className="font-medium"> {subject}</span>}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function AssetWatchlist() {
  const ASSETS = [
    {
      initials: 'BB',
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
      name: 'BBRI',
      fullName: 'Bank Rakyat Indonesia',
      price: 'Rp 5,150',
      change: '+1.2%',
      up: true,
    },
    {
      initials: 'TL',
      color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
      name: 'TLKM',
      fullName: 'Telkom Indonesia',
      price: 'Rp 3,720',
      change: '−0.5%',
      up: false,
    },
    {
      initials: '₿',
      color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
      name: 'BTC',
      fullName: 'Bitcoin',
      price: '$98,500',
      change: '+3.1%',
      up: true,
    },
    {
      initials: 'AP',
      color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      name: 'AAPL',
      fullName: 'Apple Inc.',
      price: '$245.00',
      change: '+0.8%',
      up: true,
    },
    {
      initials: 'GT',
      color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
      name: 'GOTO',
      fullName: 'GoTo Group',
      price: 'Rp 84',
      change: '−2.3%',
      up: false,
    },
  ]

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Asset Watchlist</p>
          <p className="text-xs text-muted-foreground">Square avatars for asset logos</p>
        </div>

        <div className="space-y-1">
          {ASSETS.map(({ initials, color, name, fullName, price, change, up }) => (
            <div
              key={name}
              className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Avatar shape="square" size="sm">
                  <AvatarFallback className={`${color} font-bold text-[10px]`}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-none">{name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-28">
                    {fullName}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{price}</p>
                <p className={`text-xs font-medium ${up ? 'text-success' : 'text-destructive'}`}>
                  {change}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function LiveViewers() {
  const MEMBERS = [
    {
      initials: 'RC',
      color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
      name: 'Rafael Cahya',
      role: 'Owner',
      status: 'online',
      action: 'Opened portfolio',
      time: 'Just now',
    },
    {
      initials: 'AD',
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
      name: 'Andi Dharma',
      role: 'Analyst',
      status: 'online',
      action: 'Viewed BBRI position',
      time: '4m ago',
    },
    {
      initials: 'SR',
      color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
      name: 'Siti Rahayu',
      role: 'Viewer',
      status: 'away',
      action: 'Exported PDF report',
      time: '12m ago',
    },
    {
      initials: 'BW',
      color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
      name: 'Budi Wijaya',
      role: 'Viewer',
      status: 'offline',
      action: 'Viewed P&L chart',
      time: '1h ago',
    },
    {
      initials: 'JK',
      color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
      name: 'Joko Kurnia',
      role: 'Viewer',
      status: 'busy',
      action: 'Downloaded report',
      time: '2h ago',
    },
  ]

  const STATUS_COLOR = {
    online: 'text-success',
    busy: 'text-destructive',
    away: 'text-warning',
    offline: 'text-muted-foreground',
  }
  const STATUS_DOT = {
    online: 'bg-success',
    busy: 'bg-destructive',
    away: 'bg-warning',
    offline: 'bg-muted-foreground',
  }
  const STATUS_LABEL = { online: 'Online', busy: 'Busy', away: 'Away', offline: 'Offline' }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Live Viewers</p>
          <p className="text-xs text-muted-foreground">Who's viewing this portfolio now</p>
        </div>

        <div className="rounded-lg border border-border px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">{MEMBERS.length} active viewers</p>
            <p className="text-xs text-muted-foreground">Last activity just now</p>
          </div>
          <AvatarGroup max={4} size="sm">
            {MEMBERS.map(({ initials, color }) => (
              <Avatar key={initials}>
                <AvatarFallback className={color}>{initials}</AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Recent Actions
          </p>
          {MEMBERS.map(({ initials, color, name, role, status, action, time }) => (
            <div
              key={name}
              className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Popover>
                  <PopoverTrigger asChild>
                    <Avatar size="sm" className="cursor-pointer">
                      <AvatarFallback className={color}>{initials}</AvatarFallback>
                      <AvatarStatus status={status} />
                    </Avatar>
                  </PopoverTrigger>
                  <PopoverContent className="w-52 p-3">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar size="lg">
                        <AvatarFallback className={color}>{initials}</AvatarFallback>
                        <AvatarStatus status={status} />
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-foreground leading-none">{name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{role}</p>
                        <span className={`text-xs font-medium ${STATUS_COLOR[status]}`}>
                          {STATUS_LABEL[status]}
                        </span>
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <p className="text-xs text-muted-foreground">Last action</p>
                    <p className="text-xs font-medium text-foreground">{action}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{time}</p>
                  </PopoverContent>
                </Popover>
                <div>
                  <p className="text-xs font-medium text-foreground">{name}</p>
                  <p className="text-xs text-muted-foreground">{action}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{time}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ── Breadcrumb Navigation ─────────────────────────────────────────────────────
function BreadcrumbNavigation() {
  const [page, setPage] = useState('detail')

  const PAGES = {
    home: { label: 'Home', path: ['Home'] },
    trades: { label: 'Trades', path: ['Home', 'Trades'] },
    detail: { label: 'BBRI #1042', path: ['Home', 'Trades', 'BBRI #1042'] },
    edit: { label: 'Edit Trade', path: ['Home', 'Trades', 'BBRI #1042', 'Edit'] },
    deepEdit: {
      label: 'Confirm Edit',
      path: ['Home', 'Portfolio', 'Trades', 'BBRI #1042', 'Edit', 'Confirm'],
    },
  }

  const current = PAGES[page]
  const crumbs = current.path
  const isDeep = crumbs.length > 4

  const TRADE = {
    ticker: 'BBRI',
    name: 'Bank Rakyat Indonesia',
    side: 'Buy',
    qty: '100 lot',
    price: 'Rp 5,150',
    total: 'Rp 515,000',
    date: '12 Jul 2025',
    status: 'Settled',
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Breadcrumb Navigation</p>
          <p className="text-xs text-muted-foreground">Simulate page depth to see variants</p>
        </div>

        {/* Depth selector */}
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(PAGES).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => setPage(key)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                page === key
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <Separator />

        {/* Basic breadcrumb */}
        {!isDeep && (
          <div className="space-y-1">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Basic
            </p>
            <Breadcrumb>
              <BreadcrumbList>
                {crumbs.map((crumb, i) => {
                  const isLast = i === crumbs.length - 1
                  return (
                    <BreadcrumbItem key={crumb}>
                      {isLast ? (
                        <BreadcrumbPage>{crumb}</BreadcrumbPage>
                      ) : (
                        <>
                          <BreadcrumbLink href="#" onClick={(e) => e.preventDefault()}>
                            {crumb}
                          </BreadcrumbLink>
                          <BreadcrumbSeparator />
                        </>
                      )}
                    </BreadcrumbItem>
                  )
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        )}

        {/* Collapsed breadcrumb (ellipsis) — shown when deep */}
        {isDeep && (
          <div className="space-y-1">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Collapsed
            </p>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#" onClick={(e) => e.preventDefault()}>
                    {crumbs[0]}
                  </BreadcrumbLink>
                  <BreadcrumbSeparator />
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbEllipsis />
                  <BreadcrumbSeparator />
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#" onClick={(e) => e.preventDefault()}>
                    {crumbs[crumbs.length - 2]}
                  </BreadcrumbLink>
                  <BreadcrumbSeparator />
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbPage>{crumbs[crumbs.length - 1]}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        )}

        {/* Custom separator */}
        <div className="space-y-1">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
            Custom separator
          </p>
          <Breadcrumb>
            <BreadcrumbList>
              {crumbs.slice(isDeep ? -3 : 0).map((crumb, i, arr) => {
                const isLast = i === arr.length - 1
                return (
                  <BreadcrumbItem key={crumb}>
                    {isLast ? (
                      <BreadcrumbPage>{crumb}</BreadcrumbPage>
                    ) : (
                      <>
                        <BreadcrumbLink href="#" onClick={(e) => e.preventDefault()}>
                          {crumb}
                        </BreadcrumbLink>
                        <BreadcrumbSeparator>/</BreadcrumbSeparator>
                      </>
                    )}
                  </BreadcrumbItem>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <Separator />

        {/* Page content preview */}
        <div className="rounded-lg border border-border divide-y divide-border">
          {[
            ['Ticker', TRADE.ticker],
            ['Side', TRADE.side],
            ['Qty', TRADE.qty],
            ['Price', TRADE.price],
            ['Total', TRADE.total],
            ['Date', TRADE.date],
            ['Status', TRADE.status],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between items-center px-3 py-1.5 text-xs">
              <span className="text-muted-foreground">{k}</span>
              <span className="font-medium text-foreground">{v}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ── Card Bordered — Warning ───────────────────────────────────────────────────
function HighVolatilityAlert() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed)
    return (
      <Card variant="muted">
        <CardContent className="p-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Alert dismissed</p>
          <Button variant="ghost" size="xs" onClick={() => setDismissed(false)}>
            Restore
          </Button>
        </CardContent>
      </Card>
    )

  return (
    <Card variant="warning">
      <CardHeader>
        <CardIcon icon={AlertTriangle} />
        <div className="flex-1 min-w-0">
          <CardTitle>High Volatility — BBRI</CardTitle>
          <CardDescription>Intraday swing exceeds 4.8% in the last 2 hours</CardDescription>
        </div>
        <Button size="icon-xs" variant="ghost" onClick={() => setDismissed(true)}>
          <XCircle className="size-3.5" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Open', value: 'Rp 4,980' },
            { label: 'High', value: 'Rp 5,230' },
            { label: 'Low', value: 'Rp 4,990' },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg bg-warning-subtle/60 px-2.5 py-2 text-center">
              <p className="text-[10px] text-warning-subtle-foreground uppercase tracking-wide">
                {label}
              </p>
              <p className="text-xs font-semibold text-warning-subtle-foreground mt-0.5">{value}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-warning-subtle-foreground">
          Consider tightening your stop-loss or reducing position size during high-volatility
          periods.
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button
          size="sm"
          variant="outline"
          className="border-warning/40 text-warning-subtle-foreground bg-warning-subtle/60 hover:bg-warning-subtle"
        >
          Review Position
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setDismissed(true)}>
          Dismiss
        </Button>
      </CardFooter>
    </Card>
  )
}

// ── Card Bordered — Success ────────────────────────────────────────────────────
function TradeExecuted() {
  return (
    <Card variant="success">
      <CardHeader>
        <CardIcon icon={CheckCircle2} />
        <div>
          <CardTitle>Order Executed</CardTitle>
          <CardDescription>BBRI · Buy · 17 Jul 2025 · 09:31 WIB</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-lg bg-success-subtle/60 divide-y divide-success-subtle">
          {[
            ['Ticker', 'BBRI'],
            ['Side', 'Buy'],
            ['Qty', '100 lot'],
            ['Avg Price', 'Rp 5,148'],
            ['Total', 'Rp 514,800'],
            ['Settled', 'T+2 · 19 Jul 2025'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between px-3 py-1.5 text-xs">
              <span className="text-success-subtle-foreground">{k}</span>
              <span className="font-semibold text-success-subtle-foreground">{v}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter align="end" className="gap-2">
        <Button size="sm" variant="ghost" onClick={() => toast.success('Copied trade ID')}>
          <Download className="size-3.5" /> Export
        </Button>
        <Button size="sm" className="bg-success hover:bg-success/90 text-success-foreground">
          View in History
        </Button>
      </CardFooter>
    </Card>
  )
}

// ── Card Bordered — Info ───────────────────────────────────────────────────────
function MarketSchedule() {
  const EVENTS = [
    { time: '08:55', label: 'Pre-opening session', status: 'done' },
    { time: '09:00', label: 'Regular session opens', status: 'active' },
    { time: '11:30', label: 'Mid-session break', status: 'upcoming' },
    { time: '13:30', label: 'Regular session resumes', status: 'upcoming' },
    { time: '15:49', label: 'Pre-closing session', status: 'upcoming' },
    { time: '16:00', label: 'Market closes', status: 'upcoming' },
  ]

  const STATUS = {
    done: { dot: 'bg-muted-foreground', text: 'text-muted-foreground line-through' },
    active: { dot: 'bg-info animate-pulse', text: 'text-info font-semibold' },
    upcoming: { dot: 'bg-info/30', text: 'text-foreground' },
  }

  return (
    <Card variant="info">
      <CardHeader>
        <CardIcon icon={Activity} />
        <div>
          <CardTitle>IDX Market Schedule</CardTitle>
          <CardDescription>Thursday, 17 July 2025 · Jakarta (WIB)</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {EVENTS.map(({ time, label, status }) => {
          const s = STATUS[status]
          return (
            <div key={time} className="flex items-center gap-3">
              <span className={`shrink-0 size-2 rounded-full ${s.dot}`} />
              <span className="text-xs text-muted-foreground w-10 shrink-0 tabular-nums">
                {time}
              </span>
              <span className={`text-xs flex-1 ${s.text}`}>{label}</span>
              {status === 'active' && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 text-info">
                  Now
                </Badge>
              )}
            </div>
          )
        })}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-info">
          All times in WIB (UTC+7). Subject to IDX holiday calendar.
        </p>
      </CardFooter>
    </Card>
  )
}

// ── Command Palette ───────────────────────────────────────────────────────────
function CommandPalette() {
  const RECENT = [
    { icon: TrendingUp, label: 'BBRI — Buy 100 lot @ Rp 5,150' },
    { icon: Activity, label: 'TLKM — Sell 200 lot @ Rp 3,860' },
    { icon: Wallet, label: 'Portfolio overview — Jul 2025' },
  ]

  const ACTIONS = [
    { icon: Plus, label: 'New trade entry', shortcut: '⌘ N' },
    { icon: Search, label: 'Search ticker or trade', shortcut: '⌘ F' },
    { icon: Download, label: 'Export portfolio report', shortcut: '⌘ E' },
    { icon: Bell, label: 'Set price alert', shortcut: '⌘ A' },
    { icon: Settings, label: 'Open settings', shortcut: '⌘ ,' },
  ]

  const PAGES = [
    { icon: Layers, label: 'Go to Dashboard' },
    { icon: TrendingUp, label: 'Go to Trades' },
    { icon: Wallet, label: 'Go to Portfolio' },
    { icon: Activity, label: 'Go to Activity' },
    { icon: User, label: 'Go to Profile' },
  ]

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Command Palette</p>
          <p className="text-xs text-muted-foreground">Quick actions, search, and navigation</p>
        </div>

        <Command>
          <CommandTrigger className="w-full justify-start" />

          <CommandDialog>
            <CommandInput placeholder="Search trades, actions, pages…" />
            <CommandList>
              <CommandGroup label="Recent">
                {RECENT.map(({ icon, label }) => (
                  <CommandItem
                    key={label}
                    icon={icon}
                    label={label}
                    onSelect={() => toast.success(`Opened: ${label.split('—')[0].trim()}`)}
                  />
                ))}
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup label="Actions">
                {ACTIONS.map(({ icon, label, shortcut }) => (
                  <CommandItem
                    key={label}
                    icon={icon}
                    label={label}
                    shortcut={shortcut}
                    onSelect={() => toast.success(label)}
                  />
                ))}
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup label="Navigation">
                {PAGES.map(({ icon, label }) => (
                  <CommandItem
                    key={label}
                    icon={icon}
                    label={label}
                    onSelect={() => toast.success(label)}
                  />
                ))}
              </CommandGroup>

              <CommandEmpty>No results for your search.</CommandEmpty>
            </CommandList>
          </CommandDialog>
        </Command>

        <div className="rounded-lg border border-border divide-y divide-border">
          <div className="px-3 py-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Open palette</span>
            <div className="flex items-center gap-1">
              <kbd className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded border border-border">
                ⌘
              </kbd>
              <kbd className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded border border-border">
                K
              </kbd>
            </div>
          </div>
          <div className="px-3 py-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Navigate items</span>
            <div className="flex items-center gap-1">
              <kbd className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded border border-border">
                ↑
              </kbd>
              <kbd className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded border border-border">
                ↓
              </kbd>
            </div>
          </div>
          <div className="px-3 py-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Select item</span>
            <kbd className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded border border-border">
              ↵ Enter
            </kbd>
          </div>
          <div className="px-3 py-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Close</span>
            <kbd className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded border border-border">
              Esc
            </kbd>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ── N. Open Orders ───────────────────────────────────────────────────────────
function OpenOrders() {
  const [orders, setOrders] = useState([
    {
      id: 'O-441',
      ticker: 'BBRI',
      side: 'Buy',
      qty: 1000,
      price: 'Rp 4,800',
      filled: '0%',
      status: 'Open',
    },
    {
      id: 'O-440',
      ticker: 'GOTO',
      side: 'Sell',
      qty: 5000,
      price: 'Rp 85',
      filled: '60%',
      status: 'Partial',
    },
    {
      id: 'O-439',
      ticker: 'TLKM',
      side: 'Buy',
      qty: 500,
      price: 'Rp 3,100',
      filled: '0%',
      status: 'Open',
    },
    {
      id: 'O-438',
      ticker: 'ASII',
      side: 'Sell',
      qty: 300,
      price: 'Rp 4,750',
      filled: '100%',
      status: 'Filled',
    },
  ])

  const cancel = (id) => setOrders((o) => o.filter((r) => r.id !== id))

  const pending = orders.filter((o) => o.status !== 'Filled').length

  const statusStyle = {
    Open: 'bg-info/10 text-info',
    Partial: 'bg-warning-subtle text-warning-subtle-foreground',
    Filled: 'bg-success-subtle text-success-subtle-foreground',
  }

  return (
    <Card>
      <CardHeader>
        <CardIcon icon={Layers} />
        <CardHeaderContent>
          <CardTitle>Open Orders</CardTitle>
          <CardDescription>{pending} pending</CardDescription>
        </CardHeaderContent>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader bordered>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Side</TableHead>
              <TableHead align="right">Qty</TableHead>
              <TableHead align="right">Price</TableHead>
              <TableHead align="right">Filled</TableHead>
              <TableHead align="right">Status</TableHead>
              <TableHead width="2rem" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell>
                  <p className="font-medium text-foreground leading-tight">{o.ticker}</p>
                  <p className="text-[11px] text-muted-foreground">{o.id}</p>
                </TableCell>
                <TableCell>
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      o.side === 'Buy'
                        ? 'bg-success-subtle text-success-subtle-foreground'
                        : 'bg-destructive-subtle text-destructive-subtle-foreground'
                    }`}
                  >
                    {o.side}
                  </span>
                </TableCell>
                <TableCell align="right" className="tabular-nums">
                  {o.qty.toLocaleString('id-ID')}
                </TableCell>
                <TableCell align="right" className="tabular-nums">
                  {o.price}
                </TableCell>
                <TableCell align="right" className="tabular-nums text-muted-foreground">
                  {o.filled}
                </TableCell>
                <TableCell align="right">
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${statusStyle[o.status]}`}
                  >
                    {o.status}
                  </span>
                </TableCell>
                <TableCell>
                  {o.status !== 'Filled' && (
                    <button
                      onClick={() => cancel(o.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      aria-label={`Cancel order ${o.id}`}
                    >
                      <XCircle className="size-3.5" />
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// ── N. Inventory Stock ───────────────────────────────────────────────────────
const STOCK_DATA = [
  {
    id: 1,
    name: 'Wireless Mouse',
    category: 'Electronics',
    stock: 24,
    unit: 'pcs',
    reorder: 10,
    location: 'Shelf A-3',
    supplier: 'TechDist',
    restocked: '12 Jul 2026',
  },
  {
    id: 2,
    name: 'A4 Paper Ream',
    category: 'Stationery',
    stock: 6,
    unit: 'box',
    reorder: 20,
    location: 'Shelf B-1',
    supplier: 'PaperCo',
    restocked: '10 Jul 2026',
  },
  {
    id: 3,
    name: 'HDMI Cable 2m',
    category: 'Electronics',
    stock: 15,
    unit: 'pcs',
    reorder: 8,
    location: 'Shelf A-5',
    supplier: 'TechDist',
    restocked: '08 Jul 2026',
  },
  {
    id: 4,
    name: 'Whiteboard Marker',
    category: 'Stationery',
    stock: 3,
    unit: 'box',
    reorder: 5,
    location: 'Shelf B-2',
    supplier: 'OfficeHub',
    restocked: '05 Jul 2026',
  },
  {
    id: 5,
    name: 'USB Hub 4-port',
    category: 'Electronics',
    stock: 9,
    unit: 'pcs',
    reorder: 5,
    location: 'Shelf A-2',
    supplier: 'TechDist',
    restocked: '03 Jul 2026',
  },
  {
    id: 6,
    name: 'Notebook A5',
    category: 'Stationery',
    stock: 42,
    unit: 'pcs',
    reorder: 20,
    location: 'Shelf B-3',
    supplier: 'PaperCo',
    restocked: '01 Jul 2026',
  },
  {
    id: 7,
    name: 'Laptop Stand',
    category: 'Electronics',
    stock: 7,
    unit: 'pcs',
    reorder: 3,
    location: 'Shelf A-1',
    supplier: 'ErgoShop',
    restocked: '28 Jun 2026',
  },
]

const getStockStatus = (row) =>
  row.stock <= Math.floor(row.reorder / 2) ? 'Critical' : row.stock <= row.reorder ? 'Low' : 'OK'

const STOCK_STATUS_STYLE = {
  Critical: 'bg-destructive-subtle text-destructive-subtle-foreground',
  Low: 'bg-warning-subtle text-warning-subtle-foreground',
  OK: 'bg-success-subtle text-success-subtle-foreground',
}

const STOCK_COLUMNS = [
  {
    id: 'name',
    header: 'Item',
    sortable: true,
    cell: (row) => (
      <div>
        <p className="font-medium text-foreground leading-tight">{row.name}</p>
        <p className="text-[11px] text-muted-foreground">{row.category}</p>
      </div>
    ),
  },
  {
    id: 'stock',
    header: 'Stock',
    align: 'right',
    sortable: true,
    cell: (row) => (
      <span className="tabular-nums font-medium text-foreground">
        {row.stock} <span className="text-muted-foreground font-normal">{row.unit}</span>
      </span>
    ),
  },
  {
    id: 'reorder',
    header: 'Reorder At',
    align: 'right',
    cell: (row) => (
      <span className="tabular-nums text-muted-foreground">
        {row.reorder} {row.unit}
      </span>
    ),
  },
  {
    id: 'status',
    header: 'Status',
    align: 'right',
    cell: (row) => {
      const status = getStockStatus(row)
      return (
        <span
          className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${STOCK_STATUS_STYLE[status]}`}
        >
          {status}
        </span>
      )
    },
  },
]

function InventoryStock() {
  const lowCount = STOCK_DATA.filter((r) => getStockStatus(r) !== 'OK').length

  return (
    <Card>
      <CardHeader>
        <CardIcon icon={Package} />
        <CardHeaderContent>
          <CardTitle>Stock Inventory</CardTitle>
          <CardDescription>{lowCount} item below reorder point</CardDescription>
        </CardHeaderContent>
      </CardHeader>
      <CardContent className="pt-2">
        <DataTable
          data={STOCK_DATA}
          columns={STOCK_COLUMNS}
          rowId="id"
          searchable
          searchKeys={['name', 'category']}
          sortable
          expandable
          expandContent={(row) => (
            <div className="grid grid-cols-3 gap-4 py-1 text-xs">
              <div>
                <p className="text-muted-foreground mb-0.5">Location</p>
                <p className="font-medium text-foreground">{row.location}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-0.5">Supplier</p>
                <p className="font-medium text-foreground">{row.supplier}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-0.5">Last Restocked</p>
                <p className="font-medium text-foreground">{row.restocked}</p>
              </div>
            </div>
          )}
          pagination
          pageSize={5}
        />
      </CardContent>
    </Card>
  )
}

// ── N. Asset Detail ───────────────────────────────────────────────────────────
const ASSET_FINANCIALS = [
  { period: 'Q1 2026', revenue: 'Rp 24.1T', profit: 'Rp 8.4T', eps: '56.2', roe: '17.8%' },
  { period: 'Q4 2025', revenue: 'Rp 23.7T', profit: 'Rp 8.1T', eps: '54.1', roe: '17.2%' },
  { period: 'Q3 2025', revenue: 'Rp 22.8T', profit: 'Rp 7.9T', eps: '52.8', roe: '16.9%' },
]

const ASSET_NEWS = [
  {
    id: 1,
    title: 'BBRI reports record net profit in Q1 2026, up 8% YoY',
    source: 'Bisnis.com',
    time: '2h ago',
  },
  {
    id: 2,
    title: 'Analyst upgrades BBRI to Strong Buy amid rate cut expectations',
    source: 'Kontan',
    time: '6h ago',
  },
  {
    id: 3,
    title: 'BRI expands digital lending with new fintech partnership',
    source: 'CNBC Indonesia',
    time: '1d ago',
  },
]

function Sparkline({ points, up }) {
  const w = 200
  const h = 48
  const min = Math.min(...points)
  const max = Math.max(...points)
  const xs = points.map((_, i) => (i / (points.length - 1)) * w)
  const ys = points.map((p) => h - ((p - min) / (max - min || 1)) * h)
  const d = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${ys[i].toFixed(1)}`).join(' ')
  const fill = `${d} L ${w} ${h} L 0 ${h} Z`
  const color = up ? '#10b981' : '#ef4444'
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-12" preserveAspectRatio="none">
      <defs>
        <linearGradient id="asset-spark-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill="url(#asset-spark-grad)" />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function AssetDetail() {
  return (
    <Card>
      <CardHeader>
        <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
          <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400">BR</span>
        </div>
        <CardHeaderContent>
          <CardTitle>BBRI</CardTitle>
          <CardDescription>Bank Rakyat Indonesia</CardDescription>
        </CardHeaderContent>
        <div className="ml-auto text-right shrink-0">
          <p className="text-sm font-semibold text-foreground tabular-nums">Rp 4,820</p>
          <p className="text-xs font-medium text-success">+80 (+1.69%)</p>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <Tabs defaultValue="overview">
          <TabsList variant="underline" className="w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-3 pt-3">
            <Sparkline points={[4680, 4700, 4690, 4730, 4750, 4740, 4780, 4800, 4790, 4820]} up />
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Open', value: 'Rp 4,780' },
                { label: 'High', value: 'Rp 4,860' },
                { label: 'Low', value: 'Rp 4,740' },
                { label: 'Volume', value: '89.4M' },
                { label: 'Mkt Cap', value: 'Rp 713T' },
                { label: 'P/E', value: '13.2x' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-muted/50 rounded-lg px-2.5 py-2">
                  <p className="text-[10px] text-muted-foreground">{label}</p>
                  <p className="text-xs font-semibold text-foreground tabular-nums">{value}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="financials" className="pt-3">
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="grid grid-cols-5 bg-muted/50 px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                {['Period', 'Revenue', 'Net Profit', 'EPS', 'ROE'].map((h) => (
                  <span key={h}>{h}</span>
                ))}
              </div>
              {ASSET_FINANCIALS.map((row, i) => (
                <div
                  key={row.period}
                  className={`grid grid-cols-5 px-3 py-2.5 text-xs ${i < ASSET_FINANCIALS.length - 1 ? 'border-b border-border' : ''}`}
                >
                  <span className="font-medium text-foreground">{row.period}</span>
                  <span className="text-muted-foreground tabular-nums">{row.revenue}</span>
                  <span className="text-muted-foreground tabular-nums">{row.profit}</span>
                  <span className="text-foreground tabular-nums">{row.eps}</span>
                  <span className="text-success tabular-nums">{row.roe}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="news" className="space-y-2 pt-3">
            {ASSET_NEWS.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-border px-3 py-2.5 hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <p className="text-xs font-medium text-foreground leading-snug mb-1">
                  {item.title}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-muted-foreground">{item.source}</span>
                  <span className="text-[10px] text-muted-foreground">·</span>
                  <span className="text-[10px] text-muted-foreground">{item.time}</span>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// ── N. Risk Dashboard ─────────────────────────────────────────────────────────
const RISK_METRICS = [
  {
    label: 'VaR (1-day)',
    value: '-Rp 2.84M',
    badge: '95% CI',
    badgeStyle: 'bg-destructive-subtle text-destructive-subtle-foreground',
    tip: 'Maximum expected loss in a single trading day at 95% confidence level.',
    tipVariant: 'danger',
  },
  {
    label: 'Beta',
    value: '1.24',
    badge: 'vs JCI',
    badgeStyle: 'bg-warning-subtle text-warning-subtle-foreground',
    tip: 'Portfolio sensitivity to JCI movements. Beta >1 means more volatile than the market.',
    tipVariant: 'warning',
  },
  {
    label: 'Sharpe Ratio',
    value: '1.87',
    badge: 'Good',
    badgeStyle: 'bg-success-subtle text-success-subtle-foreground',
    tip: 'Risk-adjusted return per unit of volatility. Above 1.0 is generally considered good.',
    tipVariant: 'success',
  },
  {
    label: 'Max Drawdown',
    value: '-15.2%',
    badge: 'YTD',
    badgeStyle: 'bg-muted text-muted-foreground',
    tip: 'Largest peak-to-trough portfolio decline year-to-date, measured from highest to lowest point.',
    tipVariant: 'default',
  },
  {
    label: 'JCI Correlation',
    value: '0.78',
    badge: 'High',
    badgeStyle: 'bg-info/10 text-info',
    tip: 'How closely the portfolio tracks the JCI index. 1.0 = moves in perfect lockstep with the market.',
    tipVariant: 'info',
  },
]

function RiskDashboard() {
  return (
    <Card>
      <CardHeader>
        <CardIcon icon={Shield} />
        <CardHeaderContent>
          <CardTitle>Risk Dashboard</CardTitle>
          <CardDescription>Hover ⓘ for metric details</CardDescription>
        </CardHeaderContent>
      </CardHeader>
      <CardContent className="space-y-0.5">
        {RISK_METRICS.map(({ label, value, badge, badgeStyle, tip, tipVariant }) => (
          <div
            key={label}
            className="flex items-center gap-2 px-2 py-2.5 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <span className="text-sm text-muted-foreground">{label}</span>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground/50 hover:text-muted-foreground transition-colors focus:outline-none">
                    <Info className="size-3" />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  align="center"
                  variant={tipVariant}
                  showArrow
                  className="max-w-[200px] leading-snug"
                >
                  {tip}
                </TooltipContent>
              </Tooltip>
            </div>
            <span className="text-sm font-semibold text-foreground tabular-nums">{value}</span>
            <span
              className={`text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0 ${badgeStyle}`}
            >
              {badge}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ── N. Filter Panel ──────────────────────────────────────────────────────────
function FilterPanel() {
  const [filters, setFilters] = useState({ type: 'all', exchange: 'all', period: '30d' })
  const [draft, setDraft] = useState(filters)

  const set = (key) => (val) => setDraft((d) => ({ ...d, [key]: val }))

  const PERIOD_LABEL = {
    '7d': 'Last 7 days',
    '30d': 'Last 30 days',
    '90d': 'Last 90 days',
    ytd: 'Year to date',
  }
  const EXCHANGE_LABEL = { all: 'All exchanges', idx: 'IDX', binance: 'Binance' }
  const TYPE_LABEL = { all: 'All trades', buy: 'Buy only', sell: 'Sell only' }

  const SUMMARY = [
    { label: 'Total trades', value: '24' },
    { label: 'Buy orders', value: '15' },
    { label: 'Sell orders', value: '9' },
    { label: 'Total value', value: 'Rp 84.2M' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardIcon icon={Search} />
        <CardHeaderContent>
          <CardTitle>Trade History</CardTitle>
          <CardDescription>
            {PERIOD_LABEL[filters.period]} · {EXCHANGE_LABEL[filters.exchange]} ·{' '}
            {TYPE_LABEL[filters.type]}
          </CardDescription>
        </CardHeaderContent>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
              <Settings className="size-3.5" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Trades</SheetTitle>
              <SheetDescription>Narrow results by period, exchange, and type.</SheetDescription>
            </SheetHeader>
            <div className="flex-1 px-6 py-4 space-y-5 overflow-y-auto">
              <FieldContent>
                <FieldLabel>Period</FieldLabel>
                <FieldControl>
                  <Select value={draft.period} onValueChange={set('period')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last 90 days</SelectItem>
                      <SelectItem value="ytd">Year to date</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldControl>
              </FieldContent>

              <FieldContent>
                <FieldLabel>Exchange</FieldLabel>
                <FieldControl>
                  <Select value={draft.exchange} onValueChange={set('exchange')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All exchanges</SelectItem>
                      <SelectItem value="idx">IDX</SelectItem>
                      <SelectItem value="binance">Binance</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldControl>
              </FieldContent>

              <FieldContent>
                <FieldLabel>Trade type</FieldLabel>
                <FieldControl>
                  <RadioGroup value={draft.type} onValueChange={set('type')} className="gap-2">
                    {[
                      ['all', 'All trades'],
                      ['buy', 'Buy only'],
                      ['sell', 'Sell only'],
                    ].map(([v, l]) => (
                      <label key={v} className="flex items-center gap-2 text-sm cursor-pointer">
                        <RadioGroupItem value={v} />
                        {l}
                      </label>
                    ))}
                  </RadioGroup>
                </FieldControl>
              </FieldContent>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline" onClick={() => setDraft(filters)}>
                  Reset
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button onClick={() => setFilters(draft)}>Apply filters</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {SUMMARY.map(({ label, value }) => (
            <div key={label} className="rounded-lg bg-muted/50 px-3 py-2.5">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-base font-bold text-foreground tabular-nums mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ── N. Order Recap ───────────────────────────────────────────────────────────
function OrderRecap() {
  const order = {
    ticker: 'BBRI',
    name: 'Bank Rakyat Indonesia',
    side: 'Buy',
    qty: 500,
    price: 4820,
    commission: 0.0015,
    tax: 0.001,
    levy: 0.00004,
  }

  const gross = order.qty * order.price
  const commissionAmt = Math.round(gross * order.commission)
  const taxAmt = Math.round(gross * order.tax)
  const levyAmt = Math.round(gross * order.levy)
  const totalFees = commissionAmt + taxAmt + levyAmt
  const net = gross + totalFees

  const fmt = (n) => `Rp ${n.toLocaleString('id-ID')}`

  const row = (label, value, bold) => (
    <div key={label} className="flex items-center justify-between">
      <span
        className={`text-sm ${bold ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}
      >
        {label}
      </span>
      <span
        className={`text-sm tabular-nums ${bold ? 'font-bold text-foreground' : 'text-foreground'}`}
      >
        {value}
      </span>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardIcon icon={CheckCircle2} />
        <CardHeaderContent>
          <CardTitle>Order Recap</CardTitle>
          <CardDescription>17 Jul 2025 · 09:31 WIB · IDX</CardDescription>
        </CardHeaderContent>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-bold text-foreground">{order.ticker}</p>
            <p className="text-xs text-muted-foreground">{order.name}</p>
          </div>
          <span className="text-xs font-semibold px-2 py-1 rounded-md bg-success-subtle text-success-subtle-foreground">
            {order.side}
          </span>
        </div>

        <Separator />

        <div className="space-y-2">
          {row('Quantity', `${order.qty.toLocaleString('id-ID')} shares`)}
          {row('Price per share', fmt(order.price))}
          {row('Gross amount', fmt(gross))}
        </div>

        <Separator variant="dashed" label="Fees" />

        <div className="space-y-2">
          {row('Commission (0.15%)', fmt(commissionAmt))}
          {row('Transaction tax (0.1%)', fmt(taxAmt))}
          {row('Levy (0.004%)', fmt(levyAmt))}
        </div>

        <Separator />

        <div className="space-y-2">
          {row('Total fees', fmt(totalFees))}
          {row('Net settlement', fmt(net), true)}
        </div>

        <div className="pt-1">
          <Button className="w-full" size="sm">
            Confirm Order
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ── N. Notification Feed ─────────────────────────────────────────────────────
function NotificationFeed() {
  const [read, setRead] = useState(new Set())

  const ITEMS = [
    {
      id: 1,
      icon: TrendingUp,
      title: 'BBRI hit your price alert',
      desc: 'Price crossed Rp 5,100',
      time: '2m ago',
      type: 'alert',
    },
    {
      id: 2,
      icon: CheckCircle2,
      title: 'Order executed — TLKM',
      desc: 'Sold 1,000 shares at Rp 3,090',
      time: '18m ago',
      type: 'trade',
    },
    {
      id: 3,
      icon: AlertTriangle,
      title: 'Margin call warning',
      desc: 'Equity ratio below 130%',
      time: '1h ago',
      type: 'warning',
    },
    {
      id: 4,
      icon: Download,
      title: 'Report ready',
      desc: 'July 2025 portfolio export',
      time: '2h ago',
      type: 'info',
    },
    {
      id: 5,
      icon: CheckCircle2,
      title: 'Order executed — ASII',
      desc: 'Bought 300 shares at Rp 4,680',
      time: '3h ago',
      type: 'trade',
    },
    {
      id: 6,
      icon: Bell,
      title: 'Market opens in 30 min',
      desc: 'IDX pre-market reminder',
      time: '5h ago',
      type: 'info',
    },
    {
      id: 7,
      icon: TrendingUp,
      title: 'GOTO hit your price alert',
      desc: 'Price crossed Rp 80',
      time: 'Yesterday',
      type: 'alert',
    },
    {
      id: 8,
      icon: CheckCircle2,
      title: 'Dividend credited',
      desc: 'BBCA — Rp 42,000 received',
      time: 'Yesterday',
      type: 'trade',
    },
  ]

  const unread = ITEMS.filter((i) => !read.has(i.id)).length
  const markAll = () => setRead(new Set(ITEMS.map((i) => i.id)))

  const iconColor = {
    alert: 'bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400',
    trade: 'bg-success-subtle text-success-subtle-foreground',
    warning: 'bg-warning-subtle text-warning-subtle-foreground',
    info: 'bg-info/10 text-info',
  }

  return (
    <Card>
      <CardHeader>
        <CardIcon icon={Bell} />
        <CardHeaderContent>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>{unread} unread</CardDescription>
        </CardHeaderContent>
        {unread > 0 && (
          <Button variant="ghost" size="xs" onClick={markAll} className="text-xs shrink-0">
            Mark all read
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-64">
          <div className="divide-y divide-border">
            {ITEMS.map((item) => {
              const isUnread = !read.has(item.id)
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setRead((r) => new Set([...r, item.id]))}
                  className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50 ${isUnread ? 'bg-primary/5' : ''}`}
                >
                  <div
                    className={`size-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${iconColor[item.type]}`}
                  >
                    <Icon className="size-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`text-sm leading-snug ${isUnread ? 'font-semibold' : 'font-medium'} text-foreground`}
                      >
                        {item.title}
                      </p>
                      {isUnread && <span className="size-1.5 rounded-full bg-primary shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    <p className="text-[11px] text-muted-foreground/60 mt-0.5">{item.time}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// ── N. Transaction Log ───────────────────────────────────────────────────────
function TransactionLog() {
  const [page, setPage] = useState(1)
  const PER_PAGE = 4

  const ALL = [
    {
      id: 'T-891',
      ticker: 'BBRI',
      type: 'Buy',
      qty: 500,
      price: 'Rp 4,820',
      date: '17 Jul',
      status: 'Settled',
    },
    {
      id: 'T-890',
      ticker: 'GOTO',
      type: 'Sell',
      qty: 2000,
      price: 'Rp 82',
      date: '16 Jul',
      status: 'Settled',
    },
    {
      id: 'T-889',
      ticker: 'TLKM',
      type: 'Buy',
      qty: 1000,
      price: 'Rp 3,150',
      date: '15 Jul',
      status: 'Settled',
    },
    {
      id: 'T-888',
      ticker: 'ASII',
      type: 'Buy',
      qty: 300,
      price: 'Rp 4,680',
      date: '14 Jul',
      status: 'Settled',
    },
    {
      id: 'T-887',
      ticker: 'BBCA',
      type: 'Sell',
      qty: 100,
      price: 'Rp 9,475',
      date: '12 Jul',
      status: 'Settled',
    },
    {
      id: 'T-886',
      ticker: 'BMRI',
      type: 'Buy',
      qty: 800,
      price: 'Rp 5,225',
      date: '11 Jul',
      status: 'Pending',
    },
    {
      id: 'T-885',
      ticker: 'BRIS',
      type: 'Buy',
      qty: 1500,
      price: 'Rp 1,845',
      date: '10 Jul',
      status: 'Settled',
    },
    {
      id: 'T-884',
      ticker: 'PGAS',
      type: 'Sell',
      qty: 600,
      price: 'Rp 1,510',
      date: '09 Jul',
      status: 'Settled',
    },
    {
      id: 'T-883',
      ticker: 'ADRO',
      type: 'Buy',
      qty: 2000,
      price: 'Rp 2,890',
      date: '08 Jul',
      status: 'Failed',
    },
  ]

  const totalPages = Math.ceil(ALL.length / PER_PAGE)
  const rows = ALL.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <Card>
      <CardHeader>
        <CardIcon icon={Activity} />
        <CardHeaderContent>
          <CardTitle>Transaction Log</CardTitle>
          <CardDescription>{ALL.length} trades this month</CardDescription>
        </CardHeaderContent>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-[3.5rem_1fr_auto_auto] gap-x-3 px-4 py-2 border-y border-border bg-muted/40">
          {['ID', 'Ticker', 'Price', 'Status'].map((h) => (
            <span
              key={h}
              className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground last:text-right"
            >
              {h}
            </span>
          ))}
        </div>

        <div className="divide-y divide-border">
          {rows.map((t) => (
            <div
              key={t.id}
              className="grid grid-cols-[3.5rem_1fr_auto_auto] gap-x-3 items-center px-4 py-2.5"
            >
              <span className="text-[11px] text-muted-foreground font-mono">{t.id}</span>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium">{t.ticker}</span>
                  <span
                    className={`text-[10px] font-medium px-1 rounded ${
                      t.type === 'Buy'
                        ? 'bg-success-subtle text-success-subtle-foreground'
                        : 'bg-destructive-subtle text-destructive-subtle-foreground'
                    }`}
                  >
                    {t.type}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {t.qty} shares · {t.date}
                </p>
              </div>
              <span className="text-xs font-medium tabular-nums">{t.price}</span>
              <span
                className={`text-[10px] font-medium px-1.5 py-0.5 rounded text-right ${
                  t.status === 'Settled'
                    ? 'bg-success-subtle text-success-subtle-foreground'
                    : t.status === 'Pending'
                      ? 'bg-warning-subtle text-warning-subtle-foreground'
                      : 'bg-destructive-subtle text-destructive-subtle-foreground'
                }`}
              >
                {t.status}
              </span>
            </div>
          ))}
        </div>

        <div className="px-4 py-3 border-t border-border">
          <Pagination
            page={page}
            totalPages={totalPages}
            total={ALL.length}
            onPrev={() => setPage((p) => p - 1)}
            onNext={() => setPage((p) => p + 1)}
          />
        </div>
      </CardContent>
    </Card>
  )
}

// ── N. Site Navigation ───────────────────────────────────────────────────────
function SiteNavigation() {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex items-center gap-3 px-4 h-14 border-b border-border">
          <div className="flex items-center gap-2 shrink-0 mr-1">
            <div className="size-7 rounded-md bg-primary flex items-center justify-center">
              <TrendingUp className="size-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold text-foreground">TradeDesk</span>
          </div>

          <NavMenu className="flex-1">
            <NavMenuList>
              <NavMenuItem>
                <NavMenuTrigger>Markets</NavMenuTrigger>
                <NavMenuIndicator />
                <NavMenuContent columns={2}>
                  <NavMenuGroup>
                    <NavMenuGroupTitle>Equities</NavMenuGroupTitle>
                    <NavMenuGroupItem
                      as="button"
                      icon={TrendingUp}
                      label="IDX Stocks"
                      description="Indonesian equities & ETFs"
                    />
                    <NavMenuGroupItem
                      as="button"
                      icon={Activity}
                      label="Global Markets"
                      description="US, HK, and ASEAN indices"
                    />
                  </NavMenuGroup>
                  <NavMenuGroup>
                    <NavMenuGroupTitle>Alternative</NavMenuGroupTitle>
                    <NavMenuGroupItem
                      as="button"
                      icon={Zap}
                      label="Crypto"
                      description="Top 100 coins"
                    />
                    <NavMenuGroupItem
                      as="button"
                      icon={Wallet}
                      label="Commodities"
                      description="Gold, oil, raw materials"
                    />
                  </NavMenuGroup>
                </NavMenuContent>
              </NavMenuItem>

              <NavMenuItem>
                <NavMenuTrigger>Portfolio</NavMenuTrigger>
                <NavMenuIndicator />
                <NavMenuContent columns={1}>
                  <NavMenuGroup>
                    <NavMenuGroupItem
                      as="button"
                      icon={Layers}
                      label="Open Positions"
                      description="All active holdings"
                      active
                    />
                    <NavMenuGroupItem
                      as="button"
                      icon={TrendingUp}
                      label="P&L Report"
                      description="Realized & unrealized gains"
                    />
                    <NavMenuSeparator />
                    <NavMenuGroupItem
                      as="button"
                      icon={Download}
                      label="Export"
                      description="Download portfolio data"
                    />
                  </NavMenuGroup>
                </NavMenuContent>
              </NavMenuItem>

              <NavMenuItem>
                <NavMenuTrigger>Tools</NavMenuTrigger>
                <NavMenuIndicator />
                <NavMenuContent columns={1}>
                  <NavMenuGroup>
                    <NavMenuGroupItem
                      as="button"
                      icon={Search}
                      label="Stock Screener"
                      description="Filter by fundamentals"
                    />
                    <NavMenuGroupItem
                      as="button"
                      icon={Bell}
                      label="Price Alerts"
                      description="Custom notifications"
                    />
                    <NavMenuGroupItem
                      as="button"
                      icon={Star}
                      label="Watchlist"
                      description="Favorite stocks"
                    />
                  </NavMenuGroup>
                </NavMenuContent>
              </NavMenuItem>

              <NavMenuLink as="button" active>
                Journal
              </NavMenuLink>
            </NavMenuList>
          </NavMenu>

          <div className="flex items-center gap-1.5 ml-auto shrink-0">
            <Button variant="ghost" size="icon-sm">
              <Bell className="size-4" />
            </Button>
            <Avatar size="sm">
              <AvatarFallback className="bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 text-xs font-bold">
                RC
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="px-6 py-8 flex flex-col items-center gap-1 text-center">
          <p className="text-xs font-medium text-muted-foreground">
            Hover a menu to explore dropdowns
          </p>
          <p className="text-[11px] text-muted-foreground/60">
            Supports multi-column layout, group titles & active state
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// ── N. Market Movers ─────────────────────────────────────────────────────────
function MarketMovers() {
  const MOVERS = [
    {
      ticker: 'BBRI',
      name: 'Bank Rakyat Indonesia',
      price: 'Rp 5,150',
      chg: '+2.18%',
      up: true,
      mktCap: 'Rp 843T',
      vol: '48.2M',
      high52: 'Rp 5,400',
      low52: 'Rp 3,920',
      sector: 'Financials',
    },
    {
      ticker: 'TLKM',
      name: 'Telkom Indonesia',
      price: 'Rp 3,090',
      chg: '−1.28%',
      up: false,
      mktCap: 'Rp 306T',
      vol: '31.5M',
      high52: 'Rp 3,800',
      low52: 'Rp 2,890',
      sector: 'Telecom',
    },
    {
      ticker: 'ASII',
      name: 'Astra International',
      price: 'Rp 4,710',
      chg: '+0.85%',
      up: true,
      mktCap: 'Rp 190T',
      vol: '22.7M',
      high52: 'Rp 5,100',
      low52: 'Rp 4,200',
      sector: 'Industrials',
    },
    {
      ticker: 'GOTO',
      name: 'GoTo Gojek Tokopedia',
      price: 'Rp 77',
      chg: '−3.75%',
      up: false,
      mktCap: 'Rp 73T',
      vol: '1.2B',
      high52: 'Rp 110',
      low52: 'Rp 62',
      sector: 'Tech',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardIcon icon={TrendingUp} />
        <CardHeaderContent>
          <CardTitle>Market Movers</CardTitle>
          <CardDescription>Hover a ticker to see details</CardDescription>
        </CardHeaderContent>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {MOVERS.map((s) => (
            <div key={s.ticker} className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1 min-w-0 flex items-center gap-2">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <button className="text-sm font-semibold text-foreground hover:text-primary hover:underline underline-offset-2 transition-colors shrink-0">
                      {s.ticker}
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-60 p-4" side="right" align="start">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{s.ticker}</p>
                        <p className="text-xs text-muted-foreground leading-snug">{s.name}</p>
                      </div>
                      <span
                        className={`text-xs font-medium px-1.5 py-0.5 rounded shrink-0 ${
                          s.up
                            ? 'bg-success-subtle text-success-subtle-foreground'
                            : 'bg-destructive-subtle text-destructive-subtle-foreground'
                        }`}
                      >
                        {s.chg}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-foreground tabular-nums mb-3">{s.price}</p>
                    <Separator className="mb-3" />
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      {[
                        ['Sector', s.sector],
                        ['Mkt Cap', s.mktCap],
                        ['Volume', s.vol],
                        ['52W High', s.high52],
                        ['52W Low', s.low52],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                            {label}
                          </p>
                          <p className="text-xs font-medium text-foreground">{value}</p>
                        </div>
                      ))}
                    </div>
                  </HoverCardContent>
                </HoverCard>
                <span className="text-xs text-muted-foreground truncate">{s.name}</span>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-medium tabular-nums">{s.price}</p>
                <p
                  className={`text-xs font-medium tabular-nums ${
                    s.up ? 'text-success' : 'text-destructive'
                  }`}
                >
                  {s.chg}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ── N. TradeActions ───────────────────────────────────────────────────────────
function TradeActions() {
  const [sort, setSort] = useState('date')
  const [pinned, setPinned] = useState({})

  const trades = [
    {
      id: 'T-8821',
      pair: 'BTC/USDT',
      side: 'buy',
      amount: '0.125 BTC',
      value: '$7,832',
      pnl: '+$214',
      pos: true,
    },
    {
      id: 'T-8819',
      pair: 'ETH/USDT',
      side: 'sell',
      amount: '2.0 ETH',
      value: '$4,610',
      pnl: '-$88',
      pos: false,
    },
    {
      id: 'T-8817',
      pair: 'SOL/USDT',
      side: 'buy',
      amount: '12.5 SOL',
      value: '$1,925',
      pnl: '+$43',
      pos: true,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3 w-full">
          <CardIcon icon={Activity} />
          <CardHeaderContent>
            <CardTitle>Recent Trades</CardTitle>
            <CardDescription>Last 3 executed trades</CardDescription>
          </CardHeaderContent>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
                <ArrowUpDown className="size-3.5" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup label="Sort by">
                <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                  <DropdownMenuRadioItem value="date" label="Date" />
                  <DropdownMenuRadioItem value="pnl" label="P&L" />
                  <DropdownMenuRadioItem value="value" label="Trade Value" />
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {trades.map((trade) => (
            <div key={trade.id} className="flex items-center gap-3 px-4 py-3">
              <div
                className={`size-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                  trade.side === 'buy'
                    ? 'bg-success-subtle text-success-subtle-foreground'
                    : 'bg-destructive-subtle text-destructive-subtle-foreground'
                }`}
              >
                {trade.side === 'buy' ? 'B' : 'S'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium">{trade.pair}</span>
                  {!!pinned[trade.id] && (
                    <span className="text-[10px] font-medium text-primary bg-primary/10 px-1 rounded">
                      Pinned
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {trade.amount} · {trade.value}
                </div>
              </div>
              <span
                className={`text-sm font-medium tabular-nums ${
                  trade.pos ? 'text-success' : 'text-destructive'
                }`}
              >
                {trade.pnl}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm" className="shrink-0">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup label="Actions">
                    <DropdownMenuItem
                      icon={Eye}
                      label="View Details"
                      onSelect={() => toast.success(`Viewing ${trade.id}`)}
                    />
                    <DropdownMenuItem
                      icon={Copy}
                      label="Copy Trade ID"
                      onSelect={() => toast.success(`Copied: ${trade.id}`)}
                    />
                    <DropdownMenuCheckboxItem
                      label="Pin Trade"
                      checked={!!pinned[trade.id]}
                      onCheckedChange={(v) => setPinned((p) => ({ ...p, [trade.id]: v }))}
                    />
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger icon={Download} label="Export as" />
                    <DropdownMenuSubContent>
                      <DropdownMenuItem
                        label="CSV"
                        onSelect={() => toast.success(`${trade.id} → CSV`)}
                      />
                      <DropdownMenuItem
                        label="PDF"
                        onSelect={() => toast.success(`${trade.id} → PDF`)}
                      />
                      <DropdownMenuItem
                        label="JSON"
                        onSelect={() => toast.success(`${trade.id} → JSON`)}
                      />
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    icon={Archive}
                    label="Archive"
                    onSelect={() => toast(`Archived ${trade.id}`)}
                  />
                  <DropdownMenuItem
                    icon={Trash2}
                    label="Delete Trade"
                    onSelect={() => toast.error(`Deleted ${trade.id}`)}
                    className="text-destructive hover:text-destructive focus:text-destructive"
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ── Border & Shadow: Portfolio Summary ───────────────────────────────────────
function PortfolioSnapshot() {
  const stats = [
    { label: 'Total Value', value: 'Rp 142.6M', delta: '+4.2%', up: true },
    { label: "Today's P&L", value: '+Rp 1.84M', delta: '+1.3%', up: true },
    { label: 'Win Rate', value: '68%', delta: '−2% mo', up: false },
    { label: 'Positions', value: '7', delta: '3 profit', up: true },
  ]
  return (
    <Card>
      <CardHeader>
        <CardIcon icon={Wallet} />
        <CardHeaderContent>
          <CardTitle>Portfolio Snapshot</CardTitle>
          <CardDescription>Default — bordered + shadow</CardDescription>
        </CardHeaderContent>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2 pt-0">
        {stats.map(({ label, value, delta, up }) => (
          <div key={label} className="rounded-lg bg-muted/40 px-3 py-2.5">
            <p className="text-[10px] text-muted-foreground mb-0.5">{label}</p>
            <p className="text-sm font-semibold text-card-foreground">{value}</p>
            <p
              className={`text-[10px] font-medium mt-0.5 ${up ? 'text-success' : 'text-destructive'}`}
            >
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

// ── Border & Shadow: Open Positions (shadow only) ─────────────────────────────
function OpenPositionsCard() {
  const rows = [
    { ticker: 'BBRI', name: 'Bank Rakyat Indonesia', price: 'Rp 5,150', pct: '+7.3%', up: true },
    { ticker: 'TLKM', name: 'Telkom Indonesia', price: 'Rp 3,720', pct: '−4.6%', up: false },
    { ticker: 'ASII', name: 'Astra International', price: 'Rp 4,890', pct: '+1.8%', up: true },
  ]
  return (
    <Card bordered={false}>
      <CardHeader>
        <CardIcon icon={TrendingUp} />
        <CardHeaderContent>
          <CardTitle>Open Positions</CardTitle>
          <CardDescription>Shadow only — bordered=false</CardDescription>
        </CardHeaderContent>
      </CardHeader>
      <CardContent className="pt-0 space-y-0.5">
        {rows.map(({ ticker, name, price, pct, up }) => (
          <div
            key={ticker}
            className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="size-7 rounded-md bg-secondary flex items-center justify-center shrink-0">
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
              <p className={`text-[10px] font-medium ${up ? 'text-success' : 'text-destructive'}`}>
                {pct}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ── Border & Shadow: Notification Feed (border only) ─────────────────────────
function NotificationFeedCard() {
  const [read, setRead] = useState([])
  const items = [
    {
      id: 1,
      title: 'BBRI hit your target',
      time: '2m ago',
      body: 'Price crossed Rp 5,200 — alert triggered.',
      color: 'text-success',
    },
    {
      id: 2,
      title: 'Dividend incoming',
      time: '1h ago',
      body: 'TLKM declares Rp 150/share for Q2.',
      color: 'text-info',
    },
    {
      id: 3,
      title: 'GOTO dropped 8%',
      time: '3h ago',
      body: 'Portfolio impact: −Rp 42,000.',
      color: 'text-destructive',
    },
  ]
  return (
    <Card shadow={false}>
      <CardHeader>
        <CardIcon icon={Bell} />
        <CardHeaderContent>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Border only — shadow=false</CardDescription>
        </CardHeaderContent>
        {read.length < items.length && (
          <button
            onClick={() => setRead(items.map((i) => i.id))}
            className="text-[10px] text-primary font-medium hover:underline shrink-0"
          >
            Mark all read
          </button>
        )}
      </CardHeader>
      <CardContent className="pt-0 space-y-1">
        {items.map(({ id, title, time, body, color }) => (
          <div
            key={id}
            onClick={() => setRead((r) => [...new Set([...r, id])])}
            className={`rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${read.includes(id) ? 'opacity-40' : 'bg-muted/40 hover:bg-muted/60'}`}
          >
            <div className="flex items-center justify-between mb-0.5">
              <p className={`text-xs font-semibold ${color}`}>{title}</p>
              <span className="text-[10px] text-muted-foreground shrink-0 ml-2">{time}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">{body}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ── Border & Shadow: KYC Progress (flat) ─────────────────────────────────────
function KycProgress() {
  const steps = [
    { label: 'Email verified', done: true },
    { label: 'ID document uploaded', done: true },
    { label: 'Selfie verification', done: false },
    { label: 'Review & approval', done: false },
  ]
  const pct = Math.round((steps.filter((s) => s.done).length / steps.length) * 100)
  return (
    <Card bordered={false} shadow={false}>
      <CardHeader>
        <CardIcon icon={ShieldCheck} />
        <CardHeaderContent>
          <CardTitle>KYC Verification</CardTitle>
          <CardDescription>Flat shell — bg-muted/40 auto-applied</CardDescription>
        </CardHeaderContent>
      </CardHeader>
      <CardContent className="space-y-3">
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
                {done && <CheckCircle2 className="size-2.5 text-white" />}
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

// ── Border & Shadow: Monthly Stats nested ────────────────────────────────────
function MonthlyStatsCard() {
  const items = [
    { label: 'Trades', value: '24', icon: Activity },
    { label: 'Avg. hold', value: '4.2d', icon: TrendingUp },
    { label: 'Best trade', value: '+18%', icon: Star },
  ]
  return (
    <Card>
      <CardHeader>
        <CardHeaderContent>
          <CardTitle>Monthly Stats</CardTitle>
          <CardDescription>Outer: bordered + shadow · Inner: flat nested cards</CardDescription>
        </CardHeaderContent>
      </CardHeader>
      <CardContent className="pt-0 grid grid-cols-3 gap-2">
        {items.map(({ label, value, icon: Icon }) => (
          <Card key={label} bordered={false} shadow={false} variant="muted">
            <CardContent className="p-3 flex flex-col items-center text-center gap-1">
              <Icon className="size-4 text-primary" />
              <p className="text-lg font-bold text-card-foreground">{value}</p>
              <p className="text-[10px] text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}

// ── App Layout (Sidebar) ──────────────────────────────────────────────────────
function AppLayout() {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div>
          <p className="text-sm font-semibold text-foreground">App Layout</p>
          <p className="text-xs text-muted-foreground">Sidebar in three states</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* Expanded */}
          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
              Expanded
            </p>
            <div className="flex h-36 rounded-lg overflow-hidden border border-border shadow-sm">
              <div className="w-20 bg-background border-r border-border flex flex-col shrink-0">
                <div className="flex items-center gap-1.5 px-2 py-2 border-b border-border">
                  <div className="size-3 rounded bg-primary/20 shrink-0" />
                  <div className="h-2 w-10 rounded bg-foreground/20" />
                </div>
                <div className="flex-1 py-1.5 px-1 flex flex-col gap-0.5">
                  <div className="text-[8px] font-semibold uppercase tracking-widest text-muted-foreground px-1 pb-0.5">
                    Main
                  </div>
                  <div className="flex items-center gap-1 px-1 py-1 rounded bg-primary/10">
                    <div className="size-2 rounded-sm bg-primary/50 shrink-0" />
                    <div className="h-1.5 w-8 rounded bg-primary/40" />
                  </div>
                  <div className="flex items-center gap-1 px-1 py-1 rounded">
                    <div className="size-2 rounded-sm bg-muted-foreground/30 shrink-0" />
                    <div className="h-1.5 w-10 rounded bg-muted-foreground/20" />
                    <div className="ml-auto h-3 w-3 rounded-full bg-primary/60 flex items-center justify-center">
                      <span className="text-[6px] text-primary-foreground font-bold">3</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-1 py-1 rounded">
                    <div className="size-2 rounded-sm bg-muted-foreground/30 shrink-0" />
                    <div className="h-1.5 w-7 rounded bg-muted-foreground/20" />
                  </div>
                </div>
                <div className="border-t border-border px-1 py-1.5">
                  <div className="flex items-center gap-1 px-1 py-0.5">
                    <div className="size-3 rounded-full bg-muted shrink-0" />
                    <div className="h-1.5 w-8 rounded bg-muted-foreground/20" />
                  </div>
                </div>
              </div>
              <div className="flex-1 bg-muted/30 p-2 flex flex-col gap-1.5">
                <div className="h-2.5 w-16 rounded bg-foreground/20" />
                <div className="h-1.5 w-20 rounded bg-muted-foreground/20" />
                <div className="flex-1 rounded bg-background border border-border" />
              </div>
            </div>
            <p className="text-[9px] text-muted-foreground text-center">240px</p>
          </div>

          {/* Collapsed */}
          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
              Collapsed
            </p>
            <div className="flex h-36 rounded-lg overflow-hidden border border-border shadow-sm">
              <div className="w-8 bg-background border-r border-border flex flex-col shrink-0">
                <div className="flex items-center justify-center py-2 border-b border-border">
                  <div className="size-3 rounded bg-primary/20" />
                </div>
                <div className="flex-1 py-1.5 flex flex-col gap-1 items-center">
                  <div className="size-5 rounded bg-primary/10 flex items-center justify-center">
                    <div className="size-2.5 rounded-sm bg-primary/50" />
                  </div>
                  <div className="size-5 rounded flex items-center justify-center">
                    <div className="size-2.5 rounded-sm bg-muted-foreground/30" />
                  </div>
                  <div className="size-5 rounded flex items-center justify-center">
                    <div className="size-2.5 rounded-sm bg-muted-foreground/30" />
                  </div>
                </div>
                <div className="border-t border-border py-1.5 flex justify-center">
                  <div className="size-4 rounded-full bg-muted" />
                </div>
              </div>
              <div className="flex-1 bg-muted/30 p-2 flex flex-col gap-1.5">
                <div className="h-2.5 w-16 rounded bg-foreground/20" />
                <div className="h-1.5 w-20 rounded bg-muted-foreground/20" />
                <div className="flex-1 rounded bg-background border border-border" />
              </div>
            </div>
            <p className="text-[9px] text-muted-foreground text-center">56px</p>
          </div>

          {/* Mobile Drawer */}
          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
              Mobile
            </p>
            <div className="relative h-36 rounded-lg overflow-hidden border border-border shadow-sm">
              <div className="absolute inset-0 bg-muted/30 p-2 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="size-3 rounded bg-foreground/20" />
                  <div className="h-2 w-14 rounded bg-foreground/20" />
                </div>
                <div className="h-1.5 w-20 rounded bg-muted-foreground/20 mt-0.5" />
                <div className="flex-1 rounded bg-background border border-border" />
              </div>
              <div className="absolute inset-0 bg-black/30 rounded-lg" />
              <div className="absolute top-0 left-0 bottom-0 w-20 bg-background shadow-xl flex flex-col rounded-l-lg">
                <div className="flex items-center gap-1.5 px-2 py-2 border-b border-border">
                  <div className="size-3 rounded bg-primary/20 shrink-0" />
                  <div className="h-2 w-10 rounded bg-foreground/20" />
                </div>
                <div className="flex-1 py-1.5 px-1 flex flex-col gap-0.5">
                  <div className="flex items-center gap-1 px-1 py-1 rounded bg-primary/10">
                    <div className="size-2 rounded-sm bg-primary/50 shrink-0" />
                    <div className="h-1.5 w-8 rounded bg-primary/40" />
                  </div>
                  <div className="flex items-center gap-1 px-1 py-1">
                    <div className="size-2 rounded-sm bg-muted-foreground/30 shrink-0" />
                    <div className="h-1.5 w-10 rounded bg-muted-foreground/20" />
                  </div>
                  <div className="flex items-center gap-1 px-1 py-1">
                    <div className="size-2 rounded-sm bg-muted-foreground/30 shrink-0" />
                    <div className="h-1.5 w-7 rounded bg-muted-foreground/20" />
                  </div>
                </div>
                <div className="border-t border-border px-1 py-1.5">
                  <div className="flex items-center gap-1 px-1">
                    <div className="size-3 rounded-full bg-muted shrink-0" />
                    <div className="h-1.5 w-8 rounded bg-muted-foreground/20" />
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[9px] text-muted-foreground text-center">drawer + overlay</p>
          </div>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <SidebarProvider defaultCollapsed={false}>
            <SidebarOverlay />
            <div className="flex h-48">
              <Sidebar>
                <SidebarHeader>
                  <SidebarTrigger />
                  <span className="ml-2 text-sm font-semibold text-foreground">My App</span>
                </SidebarHeader>
                <SidebarContent>
                  <SidebarGroup label="Main">
                    <SidebarItem icon={<Home className="size-4" />} label="Dashboard" active />
                    <SidebarItem icon={<Package className="size-4" />} label="Inventory" badge={3}>
                      <SidebarSub>
                        <SidebarItem label="Products" />
                        <SidebarItem label="Stock Alerts" />
                      </SidebarSub>
                    </SidebarItem>
                    <SidebarItem icon={<TrendingUp className="size-4" />} label="Trading" />
                  </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                  <SidebarItem icon={<Settings className="size-4" />} label="Settings" />
                </SidebarFooter>
              </Sidebar>
              <main className="flex-1 bg-muted/20 p-4 flex flex-col gap-2 overflow-hidden">
                <p className="text-sm font-semibold text-foreground">Dashboard</p>
                <p className="text-xs text-muted-foreground">
                  Use the trigger to collapse the sidebar
                </p>
                <div className="flex-1 rounded-lg bg-background border border-border" />
              </main>
            </div>
          </SidebarProvider>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Story ─────────────────────────────────────────────────────────────────────

const SCHEMES = ['default', 'violet', 'glass']

const SCHEME_CLASS = {
  violet: 'violet',
  glass: 'theme-glass',
}

function withTransition(fn) {
  const el = document.documentElement
  if (!document.startViewTransition) {
    fn(el)
    return
  }
  document.startViewTransition(() => fn(el))
}

function applyTheme(dark) {
  withTransition((el) => el.classList.toggle('dark', dark))
}

function applyScheme(scheme) {
  withTransition((el) => {
    Object.values(SCHEME_CLASS).forEach((cls) => el.classList.remove(cls))
    const cls = SCHEME_CLASS[scheme]
    if (cls) el.classList.add(cls)
  })
}

function FloatingBar({ scheme, onScheme }) {
  const [dark, setDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  )

  const handleMode = (isDark) => {
    setDark(isDark)
    applyTheme(isDark)
  }

  const handleScheme = (next) => {
    onScheme(next)
    applyScheme(next)
    if (next === 'glass') {
      setDark(false)
      applyTheme(false)
    }
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-12 flex items-center justify-between px-6 backdrop-blur-md border-b"
      style={{
        background: 'color-mix(in oklch, var(--color-background) 85%, transparent)',
        borderColor: 'var(--color-border)',
      }}
    >
      <p
        className="text-sm font-semibold tracking-tight"
        style={{ color: 'var(--color-foreground)' }}
      >
        Component Overview
      </p>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5 p-1 rounded-lg bg-muted">
          {SCHEMES.map((s) => (
            <button
              key={s}
              onClick={() => handleScheme(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                scheme === s
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div
          className={`flex items-center gap-0.5 p-1 rounded-lg bg-muted ${scheme === 'glass' ? 'opacity-40 pointer-events-none' : ''}`}
        >
          <button
            onClick={() => handleMode(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              !dark
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sun className="size-3.5" />
            Light
          </button>
          <button
            onClick={() => handleMode(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              dark
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Moon className="size-3.5" />
            Dark
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Trade Journal ─────────────────────────────────────────────────────────────
function TradeJournal() {
  const [value, setValue] = useState(
    `## BBRI Trade — 12 Jul 2025\n\nBought **100 lot** at Rp 5,150 based on MA20 crossing MA50.\n\n### Rationale\n\n- Volume confirmation: 1.8× average\n- RSI at 48 — neutral zone\n- Support held at 5,000\n\n### Exit Plan\n\n1. TP1: Rp 5,500 → sell 50%\n2. TP2: Rp 5,800 → sell remaining\n3. SL: Rp 4,900`
  )

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Trade Journal</p>
          <p className="text-xs text-muted-foreground">Document your analysis and rationale</p>
        </div>
        <FieldContent>
          <FieldLabel>Entry Notes</FieldLabel>
          <MarkdownEditor value={value} onChange={setValue} minHeight="180px" />
        </FieldContent>
        <Button className="w-full" variant="outline" onClick={() => toast.success('Journal saved')}>
          Save Journal
        </Button>
      </CardContent>
    </Card>
  )
}

function VisualPage() {
  const [scheme, setScheme] = useState('default')
  const bg = scheme === 'glass' ? 'rgb(248 250 252 / 0.5)' : 'var(--color-background)'

  useEffect(() => {
    document.body.style.backgroundColor = scheme === 'glass' ? '#f8fafc' : ''
    return () => {
      document.body.style.backgroundColor = ''
    }
  }, [scheme])

  return (
    <div style={{ background: bg, color: 'var(--color-foreground)' }} className="min-h-screen">
      <FloatingBar scheme={scheme} onScheme={setScheme} />
      <div className="pt-12 p-8">
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 max-w-full mx-auto [&>*]:mb-4 [&>*]:break-inside-avoid">
          <QuickTrade />
          <ClaimableBalance />
          <PriceAlert />
          <NotificationPrefs />
          <PayoutThreshold />
          <PortfolioSummary />
          <PortfolioStats />
          <ThemeAccent />
          <ChoosePlan />
          <PortfolioHealth />
          <TradeDetails />
          <ConfirmPin />
          <SearchTrades />
          <TradeRating />
          <UploadDocument />
          <PortfolioPositionCard />
          <FaqAccordion />
          <TradingStrategy />
          <AvatarShowcase />
          <ActivityFeed />
          <AssetWatchlist />
          <LiveViewers />
          <SyncingData />
          <ChartAppearance />
          <ExportReport />
          <PlaceOrder />
          <AccountProfile />
          <BreadcrumbNavigation />
          <HighVolatilityAlert />
          <TradeExecuted />
          <MarketSchedule />
          <CommandPalette />
          <OpenOrders />
          <FilterPanel />
          <OrderRecap />
          <NotificationFeed />
          <TransactionLog />
          <SiteNavigation />
          <MarketMovers />
          <TradeActions />
          <InventoryStock />
          <AssetDetail />
          <RiskDashboard />
          <PortfolioSnapshot />
          <OpenPositionsCard />
          <NotificationFeedCard />
          <KycProgress />
          <MonthlyStatsCard />
          <TradeJournal />
          <AppLayout />
        </div>
      </div>
    </div>
  )
}

export const Visual = {
  name: 'Visual',
  render: () => <VisualPage />,
}
