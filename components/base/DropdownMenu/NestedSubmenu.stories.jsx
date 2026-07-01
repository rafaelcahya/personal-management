import { Download, FileText, Settings, Share2, Trash2, User } from 'lucide-react'
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
const meta = { title: 'DropdownMenu/Nested Submenu' }
export default meta

export const NestedSubmenu = {
  name: 'Nested Submenu',
  render: () => (
    <div className="flex flex-col gap-10 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Wrap{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">DropdownMenuSubTrigger</code>{' '}
        and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">DropdownMenuSubContent</code>{' '}
        inside <code className="font-mono bg-gray-100 px-1 rounded text-xs">DropdownMenuSub</code>{' '}
        to create a submenu. Hover the trigger or press{' '}
        <kbd className="bg-gray-100 px-1 rounded text-xs">→</kbd> to open,{' '}
        <kbd className="bg-gray-100 px-1 rounded text-xs">←</kbd> or{' '}
        <kbd className="bg-gray-100 px-1 rounded text-xs">Esc</kbd> to close. Supports multiple
        levels.
      </p>

      <div className="flex flex-wrap gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">Single level submenu</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem icon={User} label="Profile" onSelect={() => {}} />
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger icon={Download} label="Export" />
                <DropdownMenuSubContent>
                  <DropdownMenuItem icon={FileText} label="Export as CSV" onSelect={() => {}} />
                  <DropdownMenuItem icon={FileText} label="Export as PDF" onSelect={() => {}} />
                  <DropdownMenuItem icon={FileText} label="Export as XLSX" onSelect={() => {}} />
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger icon={Share2} label="Share" />
                <DropdownMenuSubContent>
                  <DropdownMenuItem label="Copy link" onSelect={() => {}} />
                  <DropdownMenuItem label="Send via email" onSelect={() => {}} />
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem icon={Trash2} label="Delete" onSelect={() => {}} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">Multi-level (2 deep)</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Settings
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup label="General">
                <DropdownMenuItem icon={User} label="Profile" onSelect={() => {}} />
                <DropdownMenuItem icon={Settings} label="Preferences" onSelect={() => {}} />
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger label="Advanced" />
                <DropdownMenuSubContent>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger label="Export data" />
                    <DropdownMenuSubContent>
                      <DropdownMenuItem label="All data (CSV)" onSelect={() => {}} />
                      <DropdownMenuItem label="Trades only (CSV)" onSelect={() => {}} />
                      <DropdownMenuItem label="Inventory only (CSV)" onSelect={() => {}} />
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuItem label="Reset settings" onSelect={() => {}} />
                  <DropdownMenuItem label="Delete account" onSelect={() => {}} />
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<DropdownMenuContent>
  <DropdownMenuItem label="Profile" onSelect={() => {}} />
  <DropdownMenuSub>
    <DropdownMenuSubTrigger icon={Download} label="Export" />
    <DropdownMenuSubContent>
      <DropdownMenuItem label="Export as CSV" onSelect={() => {}} />
      <DropdownMenuItem label="Export as PDF" onSelect={() => {}} />
    </DropdownMenuSubContent>
  </DropdownMenuSub>
</DropdownMenuContent>`}</code>
      </pre>
    </div>
  ),
}
