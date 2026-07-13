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

export const WithChip = {
  name: 'With Chip',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Default behavior — each shortcut token renders as an individual{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">&lt;kbd&gt;</code> chip with
        border and background. When a key is held down while the menu is open, the matching chip
        highlights in violet.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">shortcutVariant=&quot;chip&quot; (default)</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem icon={Pencil} label="Rename" shortcut="F2" onSelect={() => {}} />
              <DropdownMenuItem icon={Copy} label="Duplicate" shortcut="⌘ D" onSelect={() => {}} />
              <DropdownMenuItem icon={Download} label="Export" shortcut="⌘ E" onSelect={() => {}} />
              <DropdownMenuItem icon={User} label="Profile" shortcut="⌘ P" onSelect={() => {}} />
              <DropdownMenuItem
                icon={Settings}
                label="Settings"
                shortcut="⌘ ,"
                onSelect={() => {}}
              />
              <DropdownMenuItem icon={LogOut} label="Logout" shortcut="⌘ Q" onSelect={() => {}} />
              <DropdownMenuItem icon={Trash2} label="Delete" shortcut="⌫" onSelect={() => {}} />
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
                title: 'Use chip variant where the shortcut is a key teaching moment',
                body: 'Main action menus and context menus for power users — chip styling is visually distinct and passively teaches shortcuts. Use it where the shortcut awareness is part of the UX goal.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't show shortcuts for rarely-used actions",
                body: 'A menu full of chips loses signal value — every item looks equally important. Reserve shortcut hints for high-frequency commands users will actually memorize.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Shortcut hints are display-only — wire the keybind listener separately',
                body: 'The shortcut prop only renders the visual hint. Wire the actual keydown listener elsewhere (e.g. global useEffect). Holding a key while the menu is open highlights the chip as visual confirmation.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use icons consistently — either all items have icons or none do',
                body: 'Mixing icon-bearing and icon-less items in the same menu creates uneven leading alignment that looks unpolished. Pick one approach and apply it throughout the DropdownMenuContent.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* shortcutVariant defaults to "chip" */}
<DropdownMenuItem icon={Pencil} label="Rename"    shortcut="F2"  onSelect={handleRename} />
<DropdownMenuItem icon={Copy}   label="Duplicate" shortcut="⌘ D" onSelect={handleDupe} />
<DropdownMenuItem icon={Trash2} label="Delete"    shortcut="⌫"   onSelect={handleDelete} />`}</code>
      </pre>
    </div>
  ),
}

export const WithoutChip = {
  name: 'Without Chip',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Pass{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          shortcutVariant=&quot;text&quot;
        </code>{' '}
        to show the shortcut as plain monospace text instead of styled chips. The hint is still
        visible but takes less visual weight. Matching characters highlight in violet when the key
        is held down.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          shortcutVariant=&quot;text&quot; — plain monospace with letter-spacing
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                icon={Pencil}
                label="Rename"
                shortcut="F2"
                shortcutVariant="text"
                onSelect={() => {}}
              />
              <DropdownMenuItem
                icon={Copy}
                label="Duplicate"
                shortcut="⌘ D"
                shortcutVariant="text"
                onSelect={() => {}}
              />
              <DropdownMenuItem
                icon={Download}
                label="Export"
                shortcut="⌘ E"
                shortcutVariant="text"
                onSelect={() => {}}
              />
              <DropdownMenuItem
                icon={User}
                label="Profile"
                shortcut="⌘ P"
                shortcutVariant="text"
                onSelect={() => {}}
              />
              <DropdownMenuItem
                icon={Settings}
                label="Settings"
                shortcut="⌘ ,"
                shortcutVariant="text"
                onSelect={() => {}}
              />
              <DropdownMenuItem
                icon={LogOut}
                label="Logout"
                shortcut="⌘ Q"
                shortcutVariant="text"
                onSelect={() => {}}
              />
              <DropdownMenuItem
                icon={Trash2}
                label="Delete"
                shortcut="⌫"
                shortcutVariant="text"
                onSelect={() => {}}
              />
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
                title: 'Use text variant when the menu is compact or visually dense',
                body: 'In menus with many items and icons, chip borders add noise that competes with labels. Text variant keeps the hint readable without raising the visual weight of shortcut hints.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't mix chip and text variants in the same DropdownMenuContent",
                body: 'Mixing makes some items look more prominent than others for no reason. Pick one shortcutVariant and apply it consistently across all items in the menu.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Active key highlight works in text mode too',
                body: "Matching characters still highlight in violet when the key is held down — the visual confirmation feedback is not chip-exclusive. Both variants confirm the user's key press.",
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Text variant reads best with short shortcut strings',
                body: '"⌘ D", "F2", "⌫" stay legible in text mode. Longer sequences like "⌘ Shift K" can look crowded without chip borders to visually separate the tokens.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<DropdownMenuItem icon={Pencil} label="Rename"    shortcut="F2"  shortcutVariant="text" onSelect={handleRename} />
<DropdownMenuItem icon={Copy}   label="Duplicate" shortcut="⌘ D" shortcutVariant="text" onSelect={handleDupe} />
<DropdownMenuItem icon={Trash2} label="Delete"    shortcut="⌫"   shortcutVariant="text" onSelect={handleDelete} />`}</code>
      </pre>
    </div>
  ),
}
