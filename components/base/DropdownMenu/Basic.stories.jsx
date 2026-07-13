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

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        A minimal dropdown with a click trigger and basic items. Click the button to open, click an
        item or press <kbd className="bg-gray-100 px-1 rounded text-xs">Esc</kbd> to close.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">Button trigger</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
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
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">Icon trigger</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
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

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use DropdownMenu for contextual actions tied to a specific trigger',
                body: 'Row action buttons (⋯), avatar menus, kebab menus — actions that belong to a specific item on the page, not global commands.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use for value selection where the current value shows in the trigger",
                body: 'Use Select instead. DropdownMenu is for dispatching commands (Edit, Delete, Export), not for picking a value that needs to be reflected back in the UI.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Always use asChild on DropdownMenuTrigger when wrapping a Button',
                body: 'Without asChild, DropdownMenuTrigger renders a <span> wrapper inside the Button — creating invalid nested interactive elements. asChild merges the props directly.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use MoreHorizontal icon trigger for row-level actions in tables',
                body: 'An icon-only trigger saves column space and signals contextual actions without cluttering the UI. Keep item labels short and verb-first — "Edit", "Delete", "Export".',
              },
            ],
          },
        ]}
      />

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
