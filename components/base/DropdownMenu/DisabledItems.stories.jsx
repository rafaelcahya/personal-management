import { Download, Lock, Settings, Trash2, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './DropdownMenu'
import Button from '@/components/base/Button/Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'DropdownMenu/Disabled Items' }
export default meta

export const DisabledItems = {
  name: 'Disabled Items',
  render: () => (
    <div className="flex flex-col gap-10 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">disabled</code> to any
        item to prevent interaction. Disabled items are visually dimmed, skipped during keyboard
        navigation, and cannot be selected.
      </p>

      <div className="flex flex-wrap gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">Mixed disabled</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup label="Account">
                <DropdownMenuItem icon={User} label="Profile" onSelect={() => {}} />
                <DropdownMenuItem icon={Settings} label="Settings" disabled onSelect={() => {}} />
                <DropdownMenuItem icon={Lock} label="Security" onSelect={() => {}} />
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem icon={Download} label="Export" disabled onSelect={() => {}} />
              <DropdownMenuSeparator />
              <DropdownMenuItem icon={Trash2} label="Delete" onSelect={() => {}} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">Disabled submenu trigger</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                More
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem label="Duplicate" onSelect={() => {}} />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger label="Share" disabled />
                <DropdownMenuSubContent>
                  <DropdownMenuItem label="Copy link" onSelect={() => {}} />
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger icon={Download} label="Export" />
                <DropdownMenuSubContent>
                  <DropdownMenuItem label="Export as CSV" onSelect={() => {}} />
                  <DropdownMenuItem label="Export as PDF" disabled onSelect={() => {}} />
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* disabled regular item */}
<DropdownMenuItem icon={Settings} label="Settings" disabled onSelect={() => {}} />

{/* disabled submenu trigger */}
<DropdownMenuSub>
  <DropdownMenuSubTrigger label="Share" disabled />
  <DropdownMenuSubContent>...</DropdownMenuSubContent>
</DropdownMenuSub>`}</code>
      </pre>
    </div>
  ),
}
