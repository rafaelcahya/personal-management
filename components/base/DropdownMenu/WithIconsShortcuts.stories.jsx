import { Copy, Download, LogOut, Pencil, Settings, Trash2, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './DropdownMenu'
import Button from '@/components/base/Button/Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'DropdownMenu/With Icons & Shortcuts' }
export default meta

export const WithIconsShortcuts = {
  name: 'With Icons & Shortcuts',
  render: () => (
    <div className="flex flex-col gap-10 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Pass an icon component via the{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">icon</code> prop and a keyboard
        shortcut hint via{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">shortcut</code>. Shortcuts are
        display-only — wire the actual keyboard handler separately.
      </p>

      <div className="flex flex-wrap gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">Icons only</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem icon={User} label="Profile" onSelect={() => {}} />
              <DropdownMenuItem icon={Settings} label="Settings" onSelect={() => {}} />
              <DropdownMenuItem icon={Download} label="Export" onSelect={() => {}} />
              <DropdownMenuItem icon={LogOut} label="Logout" onSelect={() => {}} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">Icons + shortcuts</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem icon={Pencil} label="Rename" shortcut="F2" onSelect={() => {}} />
              <DropdownMenuItem icon={Copy} label="Duplicate" shortcut="⌘D" onSelect={() => {}} />
              <DropdownMenuItem icon={Download} label="Export" shortcut="⌘E" onSelect={() => {}} />
              <DropdownMenuItem icon={Trash2} label="Delete" shortcut="⌫" onSelect={() => {}} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<DropdownMenuItem icon={Pencil} label="Rename" shortcut="F2" onSelect={handleRename} />
<DropdownMenuItem icon={Copy}   label="Duplicate" shortcut="⌘D" onSelect={handleDupe} />
<DropdownMenuItem icon={Trash2} label="Delete"    shortcut="⌫"  onSelect={handleDelete} />`}</code>
      </pre>
    </div>
  ),
}
