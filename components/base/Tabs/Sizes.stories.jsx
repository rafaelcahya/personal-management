import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Tabs/Sizes',
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

function Panel({ title, body }) {
  return (
    <div className="pt-4">
      <p className="text-sm font-medium text-gray-800 mb-1">{title}</p>
      <p className="text-sm text-gray-500">{body}</p>
    </div>
  )
}

// ─── Underline ────────────────────────────────────────────────────────────────

export const UnderlineXs = {
  name: 'Underline / Xs',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">size=&quot;xs&quot;</code> on
        underline variant — the most compact option. Minimal padding, ideal for tight inline
        contexts such as a table toolbar or a small widget header.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">underline — size=&quot;xs&quot;</span>
        <Tabs defaultValue="overview">
          <TabsList variant="underline" size="xs">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Panel title="Overview" body="Extra compact — for tight inline or toolbar contexts." />
          </TabsContent>
          <TabsContent value="trades">
            <Panel title="Trades" body="Trades panel." />
          </TabsContent>
          <TabsContent value="settings">
            <Panel title="Settings" body="Settings panel." />
          </TabsContent>
        </Tabs>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use xs only in very tight spaces',
                body: 'xs is designed for toolbar-level or widget-level tabs where every pixel matters — a table toolbar, a chart header, a compact filter bar.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use xs for primary navigation",
                body: 'The touch target is too small for primary navigation. xs is for supplementary, non-critical tab strips where space is the hard constraint.',
              },
              {
                title: "Don't substitute xs for sm inside cards",
                body: 'xs can look uncomfortably dense inside a standard card. Prefer sm for card-level tabs — xs is for truly space-constrained contexts.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'xs has a very small touch target — use with caution on touch devices',
                body: 'WCAG recommends a minimum 44×44px touch target. xs tabs may fall below this threshold — reserve them for desktop-only interfaces when possible.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'xs works best with 1-word labels',
                body: 'The compact padding leaves no room for long labels. Keep xs tab labels to a single short word to avoid overflow or truncation.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`<TabsList variant="underline" size="xs">
  <TabsTrigger value="overview">Overview</TabsTrigger>
  <TabsTrigger value="trades">Trades</TabsTrigger>
</TabsList>`}</code>
      </pre>
    </div>
  ),
}

export const UnderlineSm = {
  name: 'Underline / Sm',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">size=&quot;sm&quot;</code> on
        underline variant — compact padding and smaller font. Best for dense UIs or nested panels
        where the tab strip should not dominate.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">underline — size=&quot;sm&quot;</span>
        <Tabs defaultValue="overview">
          <TabsList variant="underline" size="sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Panel
              title="Overview"
              body="Compact tab strip — suitable for dense UIs or nested panels."
            />
          </TabsContent>
          <TabsContent value="trades">
            <Panel title="Trades" body="Trades panel." />
          </TabsContent>
          <TabsContent value="settings">
            <Panel title="Settings" body="Settings panel." />
          </TabsContent>
        </Tabs>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use sm when the tab strip sits inside a compact container',
                body: 'sm is ideal for tabs inside cards, popovers, or sidebar panels where space is limited and the tab strip should feel lightweight next to the content.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use sm for primary page-level navigation",
                body: 'At page level, sm triggers are too small to be the main navigation element. Use md or lg for top-of-page or top-of-section tab strips.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'sm has a smaller touch target than md — test on touch devices',
                body: 'sm is fine for desktop-focused UIs. On mobile or hybrid apps, verify that sm touch targets are large enough for reliable tapping.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'sm is the go-to for nested or secondary tab strips',
                body: 'When a page already has an md-size primary tab strip and needs a secondary strip inside a panel below, sm creates visual hierarchy without adding noise.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`<TabsList variant="underline" size="sm">
  <TabsTrigger value="overview">Overview</TabsTrigger>
  <TabsTrigger value="trades">Trades</TabsTrigger>
</TabsList>`}</code>
      </pre>
    </div>
  ),
}

export const UnderlineMd = {
  name: 'Underline / Md',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">size=&quot;md&quot;</code> on
        underline variant — default size. Balanced padding and font size suitable for most
        page-level tab navigation.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">underline — size=&quot;md&quot; (default)</span>
        <Tabs defaultValue="overview">
          <TabsList variant="underline" size="md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Panel title="Overview" body="Default size — use for most page-level tab navigation." />
          </TabsContent>
          <TabsContent value="trades">
            <Panel title="Trades" body="Trades panel." />
          </TabsContent>
          <TabsContent value="settings">
            <Panel title="Settings" body="Settings panel." />
          </TabsContent>
        </Tabs>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use md as the default for most contexts',
                body: 'md is the safe default — it works well on standard page layouts, detail pages, and settings views without being too large or too small.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use md inside very compact containers",
                body: 'Inside cards, popovers, or sidebar panels, md triggers can feel oversized. Use sm for contained surfaces where the tab strip should be lightweight.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'md provides a comfortable touch target for most devices',
                body: 'The default padding meets touch target guidelines for most contexts. Prefer md over sm for any interface that may be used on a touch screen.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'No need to pass size="md" explicitly',
                body: 'md is the default value. Omitting the size prop produces the same result and keeps the code cleaner — only specify size when deviating from the default.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`{/* size="md" is the default — omitting size gives the same result */}
<TabsList variant="underline">
  <TabsTrigger value="overview">Overview</TabsTrigger>
  <TabsTrigger value="trades">Trades</TabsTrigger>
</TabsList>`}</code>
      </pre>
    </div>
  ),
}

export const UnderlineLg = {
  name: 'Underline / Lg',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">size=&quot;lg&quot;</code> on
        underline variant — larger padding for prominent, top-level section tabs where the tab strip
        needs visual weight.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">underline — size=&quot;lg&quot;</span>
        <Tabs defaultValue="overview">
          <TabsList variant="underline" size="lg">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Panel title="Overview" body="Large size — for prominent, top-level section tabs." />
          </TabsContent>
          <TabsContent value="trades">
            <Panel title="Trades" body="Trades panel." />
          </TabsContent>
          <TabsContent value="settings">
            <Panel title="Settings" body="Settings panel." />
          </TabsContent>
        </Tabs>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use lg for prominent top-level navigation',
                body: 'lg works when the tab strip is the primary navigation element on the page and needs strong visual presence — e.g. a main module switcher at the top of a dashboard.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use lg inside cards or compact layouts",
                body: 'A large tab strip dominates the visual weight of a small container. Use sm or md inside cards, sidebars, and popovers.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'lg provides a generous touch target — good for touch-first interfaces',
                body: 'The larger padding makes lg tabs easy to tap on mobile or tablet. If the tab strip is the primary navigation on a touch device, lg is often the right choice.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Pair lg with short labels to maintain balance',
                body: 'Large triggers with long labels (3+ words) can make the tab strip feel heavy. Keep lg labels to 1–2 words to maintain visual balance at this size.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`<TabsList variant="underline" size="lg">
  <TabsTrigger value="overview">Overview</TabsTrigger>
  <TabsTrigger value="trades">Trades</TabsTrigger>
</TabsList>`}</code>
      </pre>
    </div>
  ),
}

export const UnderlineXl = {
  name: 'Underline / Xl',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">size=&quot;xl&quot;</code> on
        underline variant — the largest size. Generous padding and base font size for hero-level or
        marketing-style tab navigation that demands maximum visual presence.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">underline — size=&quot;xl&quot;</span>
        <Tabs defaultValue="overview">
          <TabsList variant="underline" size="xl">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Panel
              title="Overview"
              body="Extra large — for hero-level or marketing-style tab navigation."
            />
          </TabsContent>
          <TabsContent value="trades">
            <Panel title="Trades" body="Trades panel." />
          </TabsContent>
          <TabsContent value="settings">
            <Panel title="Settings" body="Settings panel." />
          </TabsContent>
        </Tabs>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use xl for hero or marketing-level tab navigation',
                body: 'xl is reserved for full-width landing sections or dashboard headers where the tab strip is a primary focal point and visual scale is intentional.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use xl in standard app screens",
                body: 'xl triggers are oversized for typical app UI. Outside of hero or marketing contexts, xl creates visual imbalance and competes with the page content.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'xl has the largest touch target — excellent for touch-first hero sections',
                body: 'xl padding makes tabs very easy to tap. Appropriate for landing pages or onboarding flows accessed primarily on mobile or large-screen touch devices.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'xl is rare — lg covers most prominent navigation needs',
                body: 'If you are reaching for xl, verify that lg does not already provide the visual weight you need. xl is for intentionally oversized, focal-point navigation only.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`<TabsList variant="underline" size="xl">
  <TabsTrigger value="overview">Overview</TabsTrigger>
  <TabsTrigger value="trades">Trades</TabsTrigger>
</TabsList>`}</code>
      </pre>
    </div>
  ),
}

// ─── Pill ─────────────────────────────────────────────────────────────────────

export const PillXs = {
  name: 'Pill / Xs',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">size=&quot;xs&quot;</code> on
        pill variant — the most compact pill. Best for inline toggle controls inside a toolbar,
        table header, or widget where space is very limited.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">pill — size=&quot;xs&quot;</span>
        <Tabs defaultValue="overview">
          <TabsList variant="pill" size="xs">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Panel
              title="Overview"
              body="Extra compact pill — for tight toolbar or widget contexts."
            />
          </TabsContent>
          <TabsContent value="trades">
            <Panel title="Trades" body="Trades panel." />
          </TabsContent>
          <TabsContent value="settings">
            <Panel title="Settings" body="Settings panel." />
          </TabsContent>
        </Tabs>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use pill xs for inline toggle controls in toolbars',
                body: 'xs pill works as a view toggle (List / Grid) inside a table toolbar or widget header where the control should feel minimal and not compete with the surrounding UI.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use pill xs when labels are longer than 1 word",
                body: 'Compact padding makes multi-word labels feel cramped inside the pill container. Keep xs pill labels to a single short word.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'xs pill has a very small touch target — desktop-only contexts only',
                body: 'xs pill is appropriate for toolbar controls on desktop apps. On touch devices, the tap area may be too small. Use md or lg pill for touch-accessible toggles.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'xs pill pairs well with icon-only or icon+short-label triggers',
                body: 'A single icon or a one-character abbreviation can work at xs size. If labels need to be readable at a glance, move up to sm.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`<TabsList variant="pill" size="xs">
  <TabsTrigger value="overview">Overview</TabsTrigger>
  <TabsTrigger value="trades">Trades</TabsTrigger>
</TabsList>`}</code>
      </pre>
    </div>
  ),
}

export const PillSm = {
  name: 'Pill / Sm',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">size=&quot;sm&quot;</code> on
        pill variant — compact pill for use inside cards, sidebars, or any dense container where
        space is at a premium.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">pill — size=&quot;sm&quot;</span>
        <Tabs defaultValue="overview">
          <TabsList variant="pill" size="sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Panel title="Overview" body="Compact pill — useful inside cards or sidebars." />
          </TabsContent>
          <TabsContent value="trades">
            <Panel title="Trades" body="Trades panel." />
          </TabsContent>
          <TabsContent value="settings">
            <Panel title="Settings" body="Settings panel." />
          </TabsContent>
        </Tabs>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Combine pill + sm for compact contained surfaces',
                body: 'This combination works well inside card headers, filter bars, or sidebar panels where both the variant and the size need to stay lightweight.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use pill sm as the primary navigation on a full page",
                body: 'sm pill is too compact for page-level navigation. It is designed for supplementary toggles inside contained sections, not for top-of-page module switching.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'The gray container background is required for pill to be readable',
                body: "The active tab's white background only stands out against a gray surface. Without the container background, the active state becomes invisible — pill must always sit inside a container.",
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'sm pill is the most versatile compact pill size',
                body: 'sm hits the sweet spot between xs (too tight) and md (too prominent) for most compact contexts — card headers, widget toolbars, and inline filter groups.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`<TabsList variant="pill" size="sm">
  <TabsTrigger value="overview">Overview</TabsTrigger>
  <TabsTrigger value="trades">Trades</TabsTrigger>
</TabsList>`}</code>
      </pre>
    </div>
  ),
}

export const PillMd = {
  name: 'Pill / Md',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">size=&quot;md&quot;</code> on
        pill variant — default size for the pill. Suitable for standard in-page toggle groups and
        card-level navigation.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">pill — size=&quot;md&quot; (default)</span>
        <Tabs defaultValue="overview">
          <TabsList variant="pill" size="md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Panel
              title="Overview"
              body="Default pill size — use for standard in-page toggle groups."
            />
          </TabsContent>
          <TabsContent value="trades">
            <Panel title="Trades" body="Trades panel." />
          </TabsContent>
          <TabsContent value="settings">
            <Panel title="Settings" body="Settings panel." />
          </TabsContent>
        </Tabs>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use pill md for standard in-page toggle groups',
                body: 'md pill is the go-to for switching between chart views, filter presets, or data breakdowns inside a card or section — balanced padding, clearly readable.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use pill md inside very compact containers",
                body: 'Inside a table toolbar or a tight widget header, md pill can feel oversized. Use sm or xs pill for those contexts.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'md pill provides a comfortable touch target for most devices',
                body: 'The default padding meets touch target guidelines in most contexts. Prefer md over sm for any pill toggle that may be used on a touch screen.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'No need to pass size="md" explicitly',
                body: 'md is the default value. Omitting the size prop produces the same result and keeps the code cleaner — only specify size when deviating from the default.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`{/* size="md" is the default — omitting size gives the same result */}
<TabsList variant="pill">
  <TabsTrigger value="overview">Overview</TabsTrigger>
  <TabsTrigger value="trades">Trades</TabsTrigger>
</TabsList>`}</code>
      </pre>
    </div>
  ),
}

export const PillLg = {
  name: 'Pill / Lg',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">size=&quot;lg&quot;</code> on
        pill variant — larger pill for prominent toggle groups that need more visual presence, such
        as a top-level mode switcher.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">pill — size=&quot;lg&quot;</span>
        <Tabs defaultValue="overview">
          <TabsList variant="pill" size="lg">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Panel
              title="Overview"
              body="Large pill — for prominent toggle groups or mode switchers."
            />
          </TabsContent>
          <TabsContent value="trades">
            <Panel title="Trades" body="Trades panel." />
          </TabsContent>
          <TabsContent value="settings">
            <Panel title="Settings" body="Settings panel." />
          </TabsContent>
        </Tabs>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use pill lg for prominent mode switchers',
                body: 'lg pill works as a top-level view switcher (Chart / Table / Summary) where the toggle needs strong visual presence on a dashboard or overview page.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use pill lg inside small containers",
                body: 'Large pill triggers overflow or crowd the content below in compact containers. Reserve lg for sections with ample horizontal space.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'lg pill provides a large touch target — good for touch-accessible toggles',
                body: 'lg pill is well-suited for dashboard toggles that may be used on tablets or large-screen touch devices where md pill may be too small to tap comfortably.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Pair pill lg with a section that has visual breathing room',
                body: 'A large pill container needs surrounding whitespace to feel intentional. Avoid placing lg pill inside dense card grids or cramped sidebars.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`<TabsList variant="pill" size="lg">
  <TabsTrigger value="overview">Overview</TabsTrigger>
  <TabsTrigger value="trades">Trades</TabsTrigger>
</TabsList>`}</code>
      </pre>
    </div>
  ),
}

export const PillXl = {
  name: 'Pill / Xl',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">size=&quot;xl&quot;</code> on
        pill variant — the largest pill. For hero-level or marketing-style toggle groups that demand
        maximum visual presence.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">pill — size=&quot;xl&quot;</span>
        <Tabs defaultValue="overview">
          <TabsList variant="pill" size="xl">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Panel
              title="Overview"
              body="Extra large pill — for hero or marketing-level toggle groups."
            />
          </TabsContent>
          <TabsContent value="trades">
            <Panel title="Trades" body="Trades panel." />
          </TabsContent>
          <TabsContent value="settings">
            <Panel title="Settings" body="Settings panel." />
          </TabsContent>
        </Tabs>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use pill xl for hero or marketing-level toggle groups',
                body: 'xl pill is reserved for landing sections or prominent dashboard headers where the toggle is a focal point and the large scale is visually intentional.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use pill xl in standard app screens",
                body: 'xl pill is oversized for typical app UI. Outside hero or marketing contexts, it creates visual imbalance and competes with the surrounding page content.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'xl pill has the largest touch target of any pill size',
                body: 'xl is excellent for onboarding flows or landing pages accessed on mobile where the toggle is a key interaction. The generous tap area reduces missed taps.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'xl pill is rare — lg covers most prominent toggle needs',
                body: 'Before reaching for xl, verify that lg does not already provide the visual weight you need. xl is reserved for intentionally oversized, focal-point toggles only.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`<TabsList variant="pill" size="xl">
  <TabsTrigger value="overview">Overview</TabsTrigger>
  <TabsTrigger value="trades">Trades</TabsTrigger>
</TabsList>`}</code>
      </pre>
    </div>
  ),
}
