import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './DropdownMenu'
import Button from '@/components/base/Button/Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'DropdownMenu/Checkbox Items' }
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

function CheckboxDemo() {
  const [sidebar, setSidebar] = useState(true)
  const [toolbar, setToolbar] = useState(false)
  const [statusBar, setStatusBar] = useState(true)
  const [notifications, setNotifications] = useState(false)

  return (
    <div className="flex flex-wrap gap-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            View
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup label="Panels">
            <DropdownMenuCheckboxItem
              label="Sidebar"
              checked={sidebar}
              onCheckedChange={setSidebar}
            />
            <DropdownMenuCheckboxItem
              label="Toolbar"
              checked={toolbar}
              onCheckedChange={setToolbar}
            />
            <DropdownMenuCheckboxItem
              label="Status bar"
              checked={statusBar}
              onCheckedChange={setStatusBar}
            />
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup label="Alerts">
            <DropdownMenuCheckboxItem
              label="Notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="text-xs text-gray-500 self-center">
        <p className="font-medium mb-1">Current state:</p>
        <ul className="space-y-0.5">
          <li>
            Sidebar:{' '}
            <span className={sidebar ? 'text-violet-600' : 'text-gray-400'}>
              {sidebar ? 'on' : 'off'}
            </span>
          </li>
          <li>
            Toolbar:{' '}
            <span className={toolbar ? 'text-violet-600' : 'text-gray-400'}>
              {toolbar ? 'on' : 'off'}
            </span>
          </li>
          <li>
            Status bar:{' '}
            <span className={statusBar ? 'text-violet-600' : 'text-gray-400'}>
              {statusBar ? 'on' : 'off'}
            </span>
          </li>
          <li>
            Notifications:{' '}
            <span className={notifications ? 'text-violet-600' : 'text-gray-400'}>
              {notifications ? 'on' : 'off'}
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export const CheckboxItems = {
  name: 'Checkbox Items',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">DropdownMenuCheckboxItem</code>{' '}
        manages toggle state via{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">checked</code> and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">onCheckedChange</code>.
        Multiple items can be checked independently.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">View options with independent toggles</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <CheckboxDemo />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use CheckboxItem for independent view toggles and feature flags',
                body: 'Show/hide sidebar, enable notifications, toggle panels — settings that are each independently on/off. Multiple items can be checked simultaneously.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use CheckboxItem for mutually exclusive options",
                body: 'Use DropdownMenuRadioGroup instead. If only one option can be active at a time (theme: Light/Dark/System), radio enforces that constraint — checkboxes do not.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Group related checkboxes under DropdownMenuGroup with a label',
                body: 'When the menu has 4+ items, a group label orients screen reader users before they navigate into the items. Without a label, items are announced individually with no structural context.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Persist checkbox state to local storage or a user preferences API',
                body: "Don't reset to default on every mount. View toggles and layout preferences feel broken when they reset after a page refresh — users expect their settings to stick.",
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`const [sidebar, setSidebar] = useState(true)
const [toolbar, setToolbar] = useState(false)

<DropdownMenuContent>
  <DropdownMenuCheckboxItem
    label="Sidebar"
    checked={sidebar}
    onCheckedChange={setSidebar}
  />
  <DropdownMenuCheckboxItem
    label="Toolbar"
    checked={toolbar}
    onCheckedChange={setToolbar}
  />
</DropdownMenuContent>`}</code>
      </pre>
    </div>
  ),
}
