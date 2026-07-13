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

export const DisabledItems = {
  name: 'Disabled Items',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">disabled</code> to any
        item to prevent interaction. Disabled items are visually dimmed, skipped during keyboard
        navigation, and cannot be selected.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">Mixed disabled</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
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
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">Disabled submenu trigger</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
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

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Show disabled items when the action exists but is temporarily unavailable',
                body: 'If the user lacks permission or the required context, disabled communicates that the feature exists without removing it. It sets the right expectation — "you can do this, just not right now".',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'If an action is permanently unavailable, omit it entirely',
                body: "Don't disable something the user will never be able to do. Permanently disabled items waste space and create confusion. Only disable for temporary conditions — missing permission, wrong context, pending state.",
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Disabled items are set to aria-disabled and skipped from keyboard nav',
                body: 'Keyboard navigation (↑ ↓) skips disabled items automatically. Screen readers announce them as disabled without requiring focus. No extra ARIA attributes needed.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Pair disabled items with a tooltip explaining why',
                body: '"Export disabled — no data to export" is far more useful than a grayed-out item with no context. A disabled SubTrigger also prevents its submenu from opening — make sure that\'s intentional.',
              },
            ],
          },
        ]}
      />

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
