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

export const GroupsSeparators = {
  name: 'Groups & Separators',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Use <code className="font-mono bg-gray-100 px-1 rounded text-xs">DropdownMenuGroup</code>{' '}
        with an optional <code className="font-mono bg-gray-100 px-1 rounded text-xs">label</code>{' '}
        to visually group related items. Use{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">DropdownMenuSeparator</code> to
        add a horizontal divider between sections.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">Separator only</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
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
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">Labeled groups</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
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

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use labeled groups when the menu has 3+ distinct sections',
                body: 'DropdownMenuGroup with a label makes the structure scannable at a glance. For just 2 sections, a DropdownMenuSeparator alone is sufficient — labels add overhead for simple splits.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Don\'t label a group "Dangerous actions" or by action type',
                body: 'Use visual isolation (separator + bottom position) for destructive items — not a label. Labels should describe category, not severity. "Dangerous actions" as a label is alarming and unnecessary.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Always isolate destructive actions at the bottom with a separator above',
                body: 'Visual distance from safe actions reduces accidental clicks. Bottom placement + separator is the standard pattern for Delete, Remove, and other irreversible actions.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Keep group labels short and categorical — "Account", "Data", "Appearance"',
                body: 'Group labels orient the user, not describe the actions. One or two words max. If the label needs to be a sentence, the grouping itself probably needs rethinking.',
              },
            ],
          },
        ]}
      />

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
