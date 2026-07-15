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
const meta = { title: 'NavMenu/Basic' }
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

// ─── With Icon ────────────────────────────────────────────────────────────────

export const WithIcon = {
  name: 'With Icon',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Pass an icon to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">NavMenuTrigger</code> to render
        it before the label. Icons help users scan the nav faster when section labels alone are not
        distinctive enough.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">with icon on trigger</span>
        <Preview>
          <NavMenu trigger="hover">
            <NavMenuList>
              <NavMenuLink href="#" active>
                Home
              </NavMenuLink>

              <NavMenuItem>
                <NavMenuTrigger icon={Package}>Products</NavMenuTrigger>
                <NavMenuIndicator />
                <NavMenuContent>
                  <NavMenuLink href="#" icon={Package}>
                    Stock
                  </NavMenuLink>
                  <NavMenuLink href="#" icon={BarChart2}>
                    Analytics
                  </NavMenuLink>
                  <NavMenuLink href="#" icon={TrendingUp}>
                    Trades
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
            </NavMenuList>
          </NavMenu>
        </Preview>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use icons when section labels are short or visually similar',
                body: 'Icons add a visual anchor that helps users locate the right trigger without reading every word — especially useful when multiple labels have similar lengths.',
              },
              {
                title: 'Be consistent — if one trigger has an icon, all should',
                body: 'Mixed icon and text-only triggers in the same NavMenuList create visual imbalance. Either all triggers have icons or none of them do.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't mix icon and text-only triggers in the same nav bar",
                body: 'Inconsistent iconography signals a design that was never reviewed. If you run out of relevant icons, drop icons from all triggers rather than mixing.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Always pair NavMenuTrigger with NavMenuIndicator',
                body: 'The animated caret below the trigger signals that a dropdown is attached. Without it, users may not discover that the trigger opens a panel.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Icons add the most value when labels are ambiguous or very similar',
                body: 'If labels like "Inventory" and "Trading" are clearly distinct, icons are optional. Add them when the nav has many similarly-named sections or when scanning speed matters.',
              },
            ],
          },
        ]}
      />

      <Code>{`<NavMenuItem>
  <NavMenuTrigger icon={Package}>Products</NavMenuTrigger>
  <NavMenuIndicator />
  <NavMenuContent>
    <NavMenuLink href="/stock" icon={Package}>Stock</NavMenuLink>
    <NavMenuLink href="/analytics" icon={BarChart2}>Analytics</NavMenuLink>
  </NavMenuContent>
</NavMenuItem>`}</Code>
    </div>
  ),
}

// ─── Without Icon ─────────────────────────────────────────────────────────────

export const WithoutIcon = {
  name: 'Without Icon',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">icon</code> prop on{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">NavMenuTrigger</code> is
        optional. Omitting it renders a text-only trigger — cleaner for compact or text-heavy navs
        where icons add visual noise without improving scannability.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">text-only triggers — no icon prop</span>
        <Preview>
          <NavMenu trigger="hover">
            <NavMenuList>
              <NavMenuLink href="#" active>
                Dashboard
              </NavMenuLink>
              <NavMenuItem>
                <NavMenuTrigger>Inventory</NavMenuTrigger>
                <NavMenuIndicator />
                <NavMenuContent>
                  <NavMenuLink href="#">Stock</NavMenuLink>
                  <NavMenuLink href="#">Analytics</NavMenuLink>
                  <NavMenuLink href="#">Reports</NavMenuLink>
                </NavMenuContent>
              </NavMenuItem>
              <NavMenuItem>
                <NavMenuTrigger>Trading</NavMenuTrigger>
                <NavMenuIndicator />
                <NavMenuContent>
                  <NavMenuLink href="#">Trades</NavMenuLink>
                  <NavMenuLink href="#">Portfolio</NavMenuLink>
                  <NavMenuSeparator />
                  <NavMenuLink href="#">P&amp;L Report</NavMenuLink>
                </NavMenuContent>
              </NavMenuItem>
              <NavMenuLink href="#">Activity</NavMenuLink>
            </NavMenuList>
          </NavMenu>
        </Preview>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Omit the icon when labels are self-explanatory',
                body: 'Icons add value only when labels are ambiguous or when visual scanning speed is a priority. If "Inventory" and "Trading" are clearly distinct, text-only is clean and sufficient.',
              },
              {
                title: 'Text-only works well in compact or information-dense layouts',
                body: 'When the nav bar competes for space with other UI elements, dropping icons reduces visual noise without hurting usability.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't mix icon and text-only triggers in the same nav bar",
                body: 'If one trigger has no icon, all triggers in the same NavMenuList should be text-only. Mixed styles create visual imbalance.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'Text-only triggers have the same keyboard and focus behavior as icon triggers',
                body: 'No special accessibility handling is needed when icons are omitted — all keyboard navigation, focus styles, and screen-reader announcements work identically.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'When in doubt, choose consistency over icons',
                body: 'A clean text-only nav is better than one where some triggers have icons and others do not. Consistency is more important than visual decoration.',
              },
            ],
          },
        ]}
      />

      <Code>{`<NavMenuItem>
  {/* Omit icon — text-only trigger */}
  <NavMenuTrigger>Inventory</NavMenuTrigger>
  <NavMenuIndicator />
  <NavMenuContent>
    <NavMenuLink href="/stock">Stock</NavMenuLink>
    <NavMenuLink href="/analytics">Analytics</NavMenuLink>
  </NavMenuContent>
</NavMenuItem>`}</Code>
    </div>
  ),
}
