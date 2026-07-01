import { MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './DropdownMenu'
import Button from '@/components/base/Button/Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'DropdownMenu/Basic' }
export default meta

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col gap-10 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        A minimal dropdown with a click trigger and basic items. Click the button to open, click an
        item or press <kbd className="bg-gray-100 px-1 rounded text-xs">Esc</kbd> to close.
      </p>

      <div className="flex flex-wrap items-start gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">Button trigger</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Options
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem label="Profile" onSelect={() => {}} />
              <DropdownMenuItem label="Settings" onSelect={() => {}} />
              <DropdownMenuItem label="Billing" onSelect={() => {}} />
              <DropdownMenuItem label="Logout" onSelect={() => {}} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">Icon trigger</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem label="Edit" onSelect={() => {}} />
              <DropdownMenuItem label="Duplicate" onSelect={() => {}} />
              <DropdownMenuItem label="Delete" onSelect={() => {}} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/base/DropdownMenu/DropdownMenu'

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline" size="sm">Options</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem label="Profile" onSelect={() => {}} />
    <DropdownMenuItem label="Settings" onSelect={() => {}} />
    <DropdownMenuItem label="Logout" onSelect={() => {}} />
  </DropdownMenuContent>
</DropdownMenu>`}</code>
      </pre>
    </div>
  ),
}
