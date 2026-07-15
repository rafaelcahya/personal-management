import { Package, BarChart2, TrendingUp, Settings, Users, Bell, HelpCircle } from 'lucide-react'
import {
  NavMenu,
  NavMenuList,
  NavMenuItem,
  NavMenuTrigger,
  NavMenuContent,
  NavMenuIndicator,
  NavMenuLink,
  NavMenuSeparator,
} from './NavMenu'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'NavMenu/Trigger Modes' }
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

const Preview = ({ children }) => (
  <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg mb-3 overflow-visible">
    {children}
  </div>
)

const Code = ({ children }) => (
  <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto mb-4 leading-relaxed">
    <code>{children}</code>
  </pre>
)

function SampleNav({ trigger }) {
  return (
    <NavMenu trigger={trigger}>
      <NavMenuList>
        <NavMenuLink href="#" active>
          Home
        </NavMenuLink>

        <NavMenuItem>
          <NavMenuTrigger icon={Package}>Inventory</NavMenuTrigger>
          <NavMenuIndicator />
          <NavMenuContent>
            <NavMenuLink href="#" icon={Package}>
              Stock
            </NavMenuLink>
            <NavMenuLink href="#" icon={BarChart2}>
              Analytics
            </NavMenuLink>
            <NavMenuLink href="#" icon={TrendingUp}>
              Reports
            </NavMenuLink>
          </NavMenuContent>
        </NavMenuItem>

        <NavMenuItem>
          <NavMenuTrigger icon={Settings}>Settings</NavMenuTrigger>
          <NavMenuIndicator />
          <NavMenuContent>
            <NavMenuLink href="#" icon={Users}>
              Account
            </NavMenuLink>
            <NavMenuLink href="#" icon={Bell}>
              Notifications
            </NavMenuLink>
            <NavMenuSeparator />
            <NavMenuLink href="#" icon={HelpCircle}>
              Help
            </NavMenuLink>
          </NavMenuContent>
        </NavMenuItem>

        <NavMenuLink href="#">Activity</NavMenuLink>
      </NavMenuList>
    </NavMenu>
  )
}

// ─── Trigger Hover ────────────────────────────────────────────────────────────

export const TriggerHover = {
  name: 'Trigger Hover',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          trigger=&quot;hover&quot;
        </code>{' '}
        is the default mode. Dropdowns open on{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">mouseenter</code> and close on{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">mouseleave</code> after a
        configurable <code className="font-mono bg-gray-100 px-1 rounded text-xs">closeDelay</code>{' '}
        (default 150ms). The delay gives the cursor time to travel from the trigger into the panel
        without the dropdown collapsing.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          trigger=&quot;hover&quot; — open on mouseenter, close on mouseleave after 150ms
        </span>
        <Preview>
          <SampleNav trigger="hover" />
        </Preview>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Default for desktop apps',
                body: 'Hover mode feels faster and rewards users who already know the layout — no deliberate click required to preview a section.',
              },
              {
                title: 'Best when mouse precision is assumed',
                body: 'Hover mode suits standard productivity apps on desktop where users navigate with a mouse and expect immediate feedback on hover.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Avoid for touch-only or accessibility-focused contexts',
                body: 'mouseenter events are unreliable on touch devices. Screen-reader users also benefit from click-based navigation — use trigger="click" instead.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Hover mode is harder for keyboard and screen-reader users',
                body: 'Hover-triggered dropdowns require mouse interaction to open. For accessibility-first apps, consider trigger="click" which responds to both mouse and keyboard focus.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Increase closeDelay if users frequently miss the dropdown',
                body: 'Bump closeDelay to 300ms if users often close the panel while moving the cursor diagonally from trigger to dropdown. The default 150ms suits most layouts.',
              },
            ],
          },
        ]}
      />

      <Code>{`<NavMenu trigger="hover" closeDelay={150}>
  <NavMenuList>
    <NavMenuLink href="/" active>Home</NavMenuLink>

    <NavMenuItem>
      <NavMenuTrigger icon={Package}>Inventory</NavMenuTrigger>
      <NavMenuIndicator />
      <NavMenuContent>
        <NavMenuLink href="/stock" icon={Package}>Stock</NavMenuLink>
        <NavMenuLink href="/analytics" icon={BarChart2}>Analytics</NavMenuLink>
      </NavMenuContent>
    </NavMenuItem>
  </NavMenuList>
</NavMenu>`}</Code>
    </div>
  ),
}

// ─── Trigger Click ────────────────────────────────────────────────────────────

export const TriggerClick = {
  name: 'Trigger Click',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          trigger=&quot;click&quot;
        </code>{' '}
        opens the dropdown on click and closes it on a second click, a click outside, or Escape. Use
        this mode when hover interaction is unreliable — touch-friendly devices, hybrid laptops, or
        contexts where deliberate intent matters.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          trigger=&quot;click&quot; — click to open, click again or outside to close
        </span>
        <Preview>
          <SampleNav trigger="click" />
        </Preview>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Touch-friendly and accessibility-focused apps',
                body: 'Touchpad-heavy laptops, tablets, and screen-reader users all benefit from explicit click intent. mouseenter events are unreliable on touch devices.',
              },
              {
                title: 'Natural pairing for controlled mode',
                body: 'Click mode works cleanly with value + onValueChange — both user clicks and programmatic setActiveMenu() calls work without hover events interfering.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Avoid for pure desktop apps where hover is expected',
                body: 'Click mode adds an extra deliberate step for mouse users. On desktop-first apps where speed is a priority, hover mode is the better default.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Click mode is more predictable for screen-reader users',
                body: "Explicit open/close on click is easier to navigate than hover — the dropdown stays put until dismissed, giving screen-reader users time to explore the panel's content.",
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'No closeDelay in click mode — the dropdown stays open until explicitly closed',
                body: 'This makes click mode safer for dropdowns with interactive content the user needs time to act on, like forms or multi-step selections.',
              },
            ],
          },
        ]}
      />

      <Code>{`<NavMenu trigger="click">
  <NavMenuList>
    <NavMenuLink href="/" active>Home</NavMenuLink>

    <NavMenuItem>
      <NavMenuTrigger icon={Package}>Inventory</NavMenuTrigger>
      <NavMenuIndicator />
      <NavMenuContent>
        <NavMenuLink href="/stock" icon={Package}>Stock</NavMenuLink>
        <NavMenuLink href="/analytics" icon={BarChart2}>Analytics</NavMenuLink>
      </NavMenuContent>
    </NavMenuItem>
  </NavMenuList>
</NavMenu>`}</Code>
    </div>
  ),
}
