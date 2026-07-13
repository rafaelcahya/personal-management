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

export const NestedSubmenu = {
  name: 'Nested Submenu',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
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

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">Single level submenu</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
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
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">Multi-level (2 deep)</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
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

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use a submenu when a parent item has 3+ related sub-actions',
                body: 'Export (CSV / PDF / XLSX), Share (Copy link / Email) — submenus group related choices without cluttering the main surface. Use when flattening would make the menu unwieldy.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Limit nesting to 2 levels maximum',
                body: 'A 3-deep submenu is always a sign the information architecture needs flattening. Use a dialog or dedicated settings page instead. Also avoid submenus that reveal only 1 item.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Keyboard navigation is built in — → opens, ← and Esc close',
                body: 'SubTrigger opens the submenu on → key and closes on ← or Esc. No extra keyboard handling needed. Focus returns to the SubTrigger when the submenu closes.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  "DropdownMenuSubTrigger renders a chevron automatically — don't add your own",
                body: 'Adding a custom arrow icon inside SubTrigger duplicates the chevron. The → indicator is part of the component and cannot be removed — just pass icon and label.',
              },
            ],
          },
        ]}
      />

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
