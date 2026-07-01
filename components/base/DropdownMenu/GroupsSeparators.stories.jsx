import { BarChart2, Download, LogOut, Settings, Trash2, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './DropdownMenu'
import Button from '@/components/base/Button/Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'DropdownMenu/Groups & Separators' }
export default meta

export const GroupsSeparators = {
  name: 'Groups & Separators',
  render: () => (
    <div className="flex flex-col gap-10 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Use <code className="font-mono bg-gray-100 px-1 rounded text-xs">DropdownMenuGroup</code>{' '}
        with an optional <code className="font-mono bg-gray-100 px-1 rounded text-xs">label</code>{' '}
        to visually group related items. Use{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">DropdownMenuSeparator</code> to
        add a horizontal divider between sections.
      </p>

      <div className="flex flex-wrap gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">Separator only</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Account
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem icon={User} label="Profile" onSelect={() => {}} />
              <DropdownMenuItem icon={Settings} label="Settings" onSelect={() => {}} />
              <DropdownMenuSeparator />
              <DropdownMenuItem icon={Download} label="Export data" onSelect={() => {}} />
              <DropdownMenuSeparator />
              <DropdownMenuItem icon={LogOut} label="Logout" onSelect={() => {}} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">Labeled groups</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Menu
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup label="Account">
                <DropdownMenuItem icon={User} label="Profile" onSelect={() => {}} />
                <DropdownMenuItem icon={Settings} label="Settings" onSelect={() => {}} />
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup label="Data">
                <DropdownMenuItem icon={BarChart2} label="Analytics" onSelect={() => {}} />
                <DropdownMenuItem icon={Download} label="Export" onSelect={() => {}} />
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem icon={Trash2} label="Delete account" onSelect={() => {}} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<DropdownMenuContent>
  <DropdownMenuGroup label="Account">
    <DropdownMenuItem icon={User} label="Profile" onSelect={() => {}} />
    <DropdownMenuItem icon={Settings} label="Settings" onSelect={() => {}} />
  </DropdownMenuGroup>
  <DropdownMenuSeparator />
  <DropdownMenuGroup label="Data">
    <DropdownMenuItem icon={BarChart2} label="Analytics" onSelect={() => {}} />
  </DropdownMenuGroup>
  <DropdownMenuSeparator />
  <DropdownMenuItem icon={Trash2} label="Delete account" onSelect={() => {}} />
</DropdownMenuContent>`}</code>
      </pre>
    </div>
  ),
}
