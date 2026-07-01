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

function CheckboxDemo() {
  const [sidebar, setSidebar] = useState(true)
  const [toolbar, setToolbar] = useState(false)
  const [statusBar, setStatusBar] = useState(true)
  const [notifications, setNotifications] = useState(false)

  return (
    <div className="flex flex-wrap gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">View options</span>
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
      </div>

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
    <div className="flex flex-col gap-10 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">DropdownMenuCheckboxItem</code>{' '}
        manages toggle state via{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">checked</code> and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">onCheckedChange</code>.
        Multiple items can be checked independently.
      </p>

      <CheckboxDemo />

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
