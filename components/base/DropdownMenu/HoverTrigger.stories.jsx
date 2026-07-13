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

export const HoverTrigger = {
  name: 'Hover Trigger',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Set{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          trigger=&quot;hover&quot;
        </code>{' '}
        on <code className="font-mono bg-gray-100 px-1 rounded text-xs">DropdownMenu</code> to open
        on mouse enter. A 150ms delay prevents accidental opens when moving between items. The menu
        stays open while the cursor is over the trigger or the content panel.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">Hover to open — simulates a menu bar</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
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
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use hover trigger for desktop menu bars with consecutive menus',
                body: 'When File / View / Tools sit side by side, hover lets users scan across them quickly without clicking each one. The 150ms delay prevents accidental opens when moving between menus.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Never use hover trigger on touch/mobile interfaces',
                body: 'Hover has no equivalent on touch devices — the menu would never open. Use click trigger (the default) for any interface that might be used on a phone or tablet.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: "Don't use hover trigger for menus with destructive actions",
                body: 'Hover menus open too easily and increase the risk of accidental selection. Menus with Delete or Remove should use click trigger — intentional interaction before exposure to irreversible actions.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'For isolated dropdowns, stick with the default click trigger',
                body: 'Hover is only appropriate when menus are in a bar and users need to sweep across them. A standalone button trigger should always be click — hover on an isolated button is unexpected.',
              },
            ],
          },
        ]}
      />

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
