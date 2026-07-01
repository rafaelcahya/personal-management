import { BarChart2, Download, Settings, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './DropdownMenu'
import Button from '@/components/base/Button/Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'DropdownMenu/Hover Trigger' }
export default meta

export const HoverTrigger = {
  name: 'Hover Trigger',
  render: () => (
    <div className="flex flex-col gap-10 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Set{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          trigger=&quot;hover&quot;
        </code>{' '}
        on <code className="font-mono bg-gray-100 px-1 rounded text-xs">DropdownMenu</code> to open
        on mouse enter. A 150ms delay prevents accidental opens when moving between items. The menu
        stays open while the cursor is over the trigger or the content panel.
      </p>

      <div className="flex flex-wrap gap-4">
        <DropdownMenu trigger="hover">
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              File
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem label="New" shortcut="⌘N" onSelect={() => {}} />
            <DropdownMenuItem label="Open" shortcut="⌘O" onSelect={() => {}} />
            <DropdownMenuItem label="Save" shortcut="⌘S" onSelect={() => {}} />
            <DropdownMenuSeparator />
            <DropdownMenuItem icon={Download} label="Export" onSelect={() => {}} />
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu trigger="hover">
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem icon={BarChart2} label="Dashboard" onSelect={() => {}} />
            <DropdownMenuItem icon={User} label="Profile" onSelect={() => {}} />
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu trigger="hover">
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Tools
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem icon={Settings} label="Settings" onSelect={() => {}} />
            <DropdownMenuItem label="Extensions" onSelect={() => {}} />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* default: click trigger */}
<DropdownMenu trigger="click">...</DropdownMenu>

{/* hover trigger */}
<DropdownMenu trigger="hover">
  <DropdownMenuTrigger asChild>
    <Button variant="outline">File</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem label="New" shortcut="⌘N" onSelect={() => {}} />
    <DropdownMenuItem label="Open" shortcut="⌘O" onSelect={() => {}} />
  </DropdownMenuContent>
</DropdownMenu>`}</code>
      </pre>
    </div>
  ),
}
