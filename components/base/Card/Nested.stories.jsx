import { AlertTriangle, Bell, Package, Settings, ShoppingCart, Trash2, User } from 'lucide-react'
import Button from '../Button/Button'
import Card, {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardIcon,
  CardTitle,
} from './Card'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Card/Nested',
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

const FakeField = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-xs font-medium text-slate-700">{label}</p>
    <div className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-400">
      {value}
    </div>
  </div>
)

// ─── Stories ─────────────────────────────────────────────────────────────────

export const PageSections = {
  name: 'Page Sections (transparent + shell)',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Guide */}
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        The most common nesting pattern.{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant="transparent"</code>{' '}
        acts as the page-level wrapper (no bg/border) and each feature section is a{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">shell</code> Card inside it.
        This gives a clear visual hierarchy: page → section.
      </p>

      {/* 2. Live preview */}
      <div className="w-full max-w-2xl">
        <Card variant="transparent">
          <CardHeader>
            <CardIcon icon={Settings} />
            <div className="min-w-0 flex-1">
              <CardTitle as="h1">Settings</CardTitle>
              <CardDescription>Profile &amp; preferences</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 pt-2">
            {/* Profile section */}
            <Card>
              <CardHeader>
                <CardIcon icon={User} />
                <div className="min-w-0 flex-1">
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>
                    Personal details used for performance calculations
                  </CardDescription>
                </div>
              </CardHeader>
              <div className="px-5 py-5 grid grid-cols-2 gap-4">
                <FakeField label="Display Name" value="Rafael Cahya" />
                <FakeField label="Date of Birth" value="1995-04-07" />
                <FakeField label="Height (cm)" value="172" />
                <FakeField label="Weight (kg)" value="64" />
              </div>
              <CardFooter className="justify-end">
                <Button size="base" className="bg-violet-600 hover:bg-violet-700">
                  Save
                </Button>
              </CardFooter>
            </Card>

            {/* Notifications section */}
            <Card>
              <CardHeader>
                <CardIcon icon={Bell} />
                <div className="min-w-0 flex-1">
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>
                    Configure push alerts for your training insights
                  </CardDescription>
                </div>
              </CardHeader>
              <div className="px-5 py-4 flex flex-col gap-3">
                {['Post-activity insight', 'Weekly review', 'Anomaly alerts'].map((label) => (
                  <div key={label} className="flex items-center justify-between gap-4">
                    <p className="text-sm text-slate-700">{label}</p>
                    <div className="w-10 h-5 bg-violet-500 rounded-full shrink-0" />
                  </div>
                ))}
              </div>
            </Card>
          </CardContent>
        </Card>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'This is the primary page layout pattern',
                body: 'transparent outer provides the page-level title without a visual box; shell inner provides the visual container for each feature section. Always start here for page layouts.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't nest a shell section card inside another shell",
                body: 'Two nested boxes with borders creates a heavy double-box look. Transparent outer is always the right wrapper at page level — never shell inside shell for page sections.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Use as="h1" on the outer CardTitle since it is the page heading',
                body: 'Inner section cards default to h3. Setting as="h1" on the outer card gives screen readers a correct document hierarchy: h1 (page) → h3 (section).',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use CardContent className="flex flex-col gap-4 pt-2" on the outer card',
                body: 'This stacks inner sections with consistent spacing and a small top offset from the header border. pt-2 prevents the first inner card from sitting directly against the transparent header border.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* transparent outer — no bg/border, just a page-level wrapper */}
<Card variant="transparent">
  <CardHeader>
    <CardIcon icon={Settings} />
    <div className="min-w-0 flex-1">
      <CardTitle as="h1">Settings</CardTitle>
      <CardDescription>Profile & preferences</CardDescription>
    </div>
  </CardHeader>
  <CardContent className="flex flex-col gap-4 pt-2">

    {/* each section is a shell Card */}
    <Card>
      <CardHeader>
        <CardIcon icon={User} />
        <div className="min-w-0 flex-1">
          <CardTitle>Profile</CardTitle>
          <CardDescription>...</CardDescription>
        </div>
      </CardHeader>
      <div className="px-5 py-5">...</div>
    </Card>

    <Card>
      <CardHeader>
        <CardIcon icon={Bell} />
        <div className="min-w-0 flex-1">
          <CardTitle>Notifications</CardTitle>
        </div>
      </CardHeader>
      <div className="px-5 py-4">...</div>
    </Card>

  </CardContent>
</Card>`}</code>
      </pre>
    </div>
  ),
}

export const AlertInSection = {
  name: 'Alert in Section (status card in shell)',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Guide */}
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Use a status Card (
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant="danger"</code>,{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant="warning"</code>)
        inside a shell Card's{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">CardContent</code> to surface
        destructive actions or alerts within a section. Add{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          className="shadow-none rounded-lg"
        </code>{' '}
        on the inner Card to soften its appearance inside the outer card.
      </p>

      {/* 2. Live preview */}
      <div className="w-full max-w-2xl flex flex-col gap-4">
        {/* Danger inside shell */}
        <Card className="border-red-200">
          <CardHeader className="border-red-100">
            <CardIcon icon={Trash2} className="bg-red-50" iconClassName="text-red-600" />
            <div className="min-w-0 flex-1">
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>Irreversible actions — proceed with caution</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Card variant="danger" className="shadow-none rounded-lg">
              <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-2 min-w-0">
                  <AlertTriangle
                    className="h-4 w-4 text-red-500 mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm font-medium text-red-800">Delete all activity data</p>
                    <p className="text-xs text-red-600 mt-0.5">
                      Permanently remove all your running activities. This cannot be undone.
                    </p>
                  </div>
                </div>
                <Button
                  size="base"
                  variant="outline"
                  className="shrink-0 border-red-300 text-red-700 hover:bg-red-100"
                >
                  Delete All
                </Button>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Warning inside shell */}
        <Card>
          <CardHeader>
            <CardIcon icon={Package} />
            <div className="min-w-0 flex-1">
              <CardTitle>Low Stock Alert</CardTitle>
              <CardDescription>Items that need restocking</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {['Vitamin C Serum', 'Body Lotion'].map((name) => (
              <Card key={name} variant="warning" className="shadow-none rounded-lg">
                <CardContent className="flex items-center justify-between gap-4 py-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      className="h-3.5 w-3.5 text-amber-500 shrink-0"
                      aria-hidden="true"
                    />
                    <p className="text-sm font-medium text-amber-800">{name}</p>
                  </div>
                  <span className="text-xs font-medium text-amber-700 shrink-0">1 left</span>
                </CardContent>
              </Card>
            ))}
          </CardContent>
          <CardFooter>
            <Button size="base" className="bg-violet-600 hover:bg-violet-700">
              Restock All
            </Button>
          </CardFooter>
        </Card>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use a status card inside a shell section to surface inline alerts',
                body: 'Nesting danger or warning cards inside a shell CardContent keeps the alert visually associated with the section — ideal for destructive zones, low-stock rows, or recoverable issues within a settings page.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't nest more than 3 alert items in a single shell section",
                body: 'If you have many alerts, consider a separate page section or change the outer card to the matching variant instead of listing many nested status cards.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Add role="alert" or role="status" on the inner status card content',
                body: 'Status cards nested inside a shell are not automatically announced on insertion. Add the appropriate ARIA role to the inner card or its CardContent so screen readers announce them when they appear.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Always add className="shadow-none rounded-lg" to inner status cards',
                body: "Without shadow-none, the inner card's shadow creates a floating look inside the outer shell. Override the outer border color (e.g. border-red-200) rather than switching the outer card's variant — keeps the section neutral while the alert pops.",
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* outer shell with red border override */}
<Card className="border-red-200">
  <CardHeader className="border-red-100">
    <CardIcon icon={Trash2} className="bg-red-50" iconClassName="text-red-600" />
    <div className="min-w-0 flex-1">
      <CardTitle>Danger Zone</CardTitle>
    </div>
  </CardHeader>
  <CardContent className="flex flex-col gap-3">

    {/* inner danger card — shadow-none rounded-lg to soften */}
    <Card variant="danger" className="shadow-none rounded-lg">
      <CardContent className="flex items-center justify-between gap-4">
        <div>...</div>
        <Button>Delete All</Button>
      </CardContent>
    </Card>

  </CardContent>
</Card>

{/* warning items inside a shell section */}
<Card>
  <CardHeader>...</CardHeader>
  <CardContent className="flex flex-col gap-3">
    {items.map(item => (
      <Card key={item} variant="warning" className="shadow-none rounded-lg">
        <CardContent>...</CardContent>
      </Card>
    ))}
  </CardContent>
</Card>`}</code>
      </pre>
    </div>
  ),
}

export const StatGridInSection = {
  name: 'Stat Grid in Section (shell in shell)',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Guide */}
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Embed a grid of stat tiles inside a shell Card's{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">CardContent</code>. The outer
        card provides the section header; inner cards are small stat tiles with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">className="shadow-none"</code>{' '}
        and a custom color override to avoid a heavy double-border look.
      </p>

      {/* 2. Live preview */}
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardIcon icon={ShoppingCart} />
            <div className="min-w-0 flex-1">
              <CardTitle>Inventory Overview</CardTitle>
              <CardDescription>Stock summary across all categories</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: 'Total Products',
                  value: '48',
                  unit: 'items',
                  bg: 'bg-violet-50',
                  border: 'border-violet-200',
                  text: 'text-violet-600',
                },
                {
                  label: 'Low Stock',
                  value: '6',
                  unit: 'items',
                  bg: 'bg-amber-50',
                  border: 'border-amber-200',
                  text: 'text-amber-600',
                },
                {
                  label: 'Out of Stock',
                  value: '2',
                  unit: 'items',
                  bg: 'bg-red-50',
                  border: 'border-red-200',
                  text: 'text-red-600',
                },
              ].map((s) => (
                <Card key={s.label} className={`${s.bg} ${s.border} shadow-none`}>
                  <CardContent className="p-4 flex flex-col gap-1">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      {s.label}
                    </p>
                    <p className={`text-2xl font-bold leading-none ${s.text}`}>
                      {s.value}
                      <span className="text-xs font-normal text-slate-400 ml-1">{s.unit}</span>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-slate-500">Last synced today at 15:42</p>
          </CardFooter>
        </Card>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Embed stat tiles in a shell section for grouped summary data',
                body: 'When a section needs a header above a row of statistics, use a shell outer card for the header and embed inner stat tiles in a grid inside CardContent — the outer card provides context; inner tiles show the data.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use more than 4 columns for inner stat tiles",
                body: 'More than 4 columns makes values too small to scan quickly on desktop, and they collapse poorly on mobile. Stick to 2–3 columns for most stat grids inside a shell section.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Pair each stat value with a text label in CardContent',
                body: 'Screen readers need context for numbers — ensure each tile has both a visible label (e.g. "Total Products") and the value so users can scan the data without visual cues.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Always add shadow-none to inner stat tiles',
                body: 'The outer card already provides the visual box. A second shadow on inner tiles creates unnecessary noise. Use a custom bg + border per tile (e.g. bg-violet-50 border-violet-200) to semantically color-code stats instead.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* outer section card */}
<Card>
  <CardHeader>
    <CardIcon icon={ShoppingCart} />
    <div className="min-w-0 flex-1">
      <CardTitle>Inventory Overview</CardTitle>
      <CardDescription>Stock summary across all categories</CardDescription>
    </div>
  </CardHeader>
  <CardContent>

    {/* inner stat tiles — shadow-none to reduce visual weight */}
    <div className="grid grid-cols-3 gap-3">
      <Card className="bg-violet-50 border-violet-200 shadow-none">
        <CardContent className="p-4 flex flex-col gap-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Total Products
          </p>
          <p className="text-2xl font-bold text-violet-600">48</p>
        </CardContent>
      </Card>
      {/* ...more tiles */}
    </div>

  </CardContent>
  <CardFooter>...</CardFooter>
</Card>`}</code>
      </pre>
    </div>
  ),
}
