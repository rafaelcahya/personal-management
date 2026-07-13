import { LayoutDashboard, Package, TrendingUp, SearchX } from 'lucide-react'
import {
  Command,
  CommandTrigger,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from './Command'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Command/Empty State' }
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

export const EmptyState = {
  name: 'Empty State',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">CommandEmpty</code> renders
        automatically when no items match the current query. Type something with no match to see it
        appear. Pass custom content or leave empty for the default "No results found." message.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">default empty — type "xyz" to trigger</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <Command>
            <CommandTrigger className="w-64" />
            <CommandDialog>
              <CommandInput placeholder="Search…" />
              <CommandList>
                <CommandGroup label="Navigation">
                  <CommandItem icon={LayoutDashboard} label="Dashboard" onSelect={() => {}} />
                  <CommandItem icon={Package} label="Inventory" onSelect={() => {}} />
                  <CommandItem icon={TrendingUp} label="Trades" onSelect={() => {}} />
                </CommandGroup>
                <CommandEmpty />
              </CommandList>
            </CommandDialog>
          </Command>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Always include CommandEmpty inside CommandList',
                body: 'Omitting CommandEmpty leaves the dialog visually blank on no-match — which looks broken. It appears automatically when no items match and requires no extra logic.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't customize CommandEmpty for palettes with a small item set",
                body: 'The default "No results found" message is clear for palettes with a small, stable list of items. Only customize when users are likely to reach the empty state often.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'CommandEmpty content is announced by screen readers when it appears',
                body: 'When all items are filtered out, the empty state becomes visible and its text is read aloud. Keep the message short and clear.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Place CommandEmpty at the end of CommandList, after all groups',
                body: 'CommandEmpty watches all siblings — putting it before groups may cause it to appear when items in later groups are still visible.',
              },
            ],
          },
        ]}
      />

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">custom empty — with icon and description</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <Command>
            <CommandTrigger className="w-64" />
            <CommandDialog>
              <CommandInput placeholder="Search…" />
              <CommandList>
                <CommandGroup label="Navigation">
                  <CommandItem icon={LayoutDashboard} label="Dashboard" onSelect={() => {}} />
                  <CommandItem icon={Package} label="Inventory" onSelect={() => {}} />
                  <CommandItem icon={TrendingUp} label="Trades" onSelect={() => {}} />
                </CommandGroup>
                <CommandEmpty>
                  <div className="flex flex-col items-center gap-2">
                    <SearchX className="size-8 text-gray-300" />
                    <p className="text-sm text-gray-400 font-medium">Nothing found</p>
                    <p className="text-xs text-gray-400">Try a different search term</p>
                  </div>
                </CommandEmpty>
              </CommandList>
            </CommandDialog>
          </Command>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Customize CommandEmpty when users often search outside the palette scope',
                body: 'A brief, actionable message like "Try a shorter word" or "Nothing found — check spelling" helps users recover. Default text is fine when the empty state is rare.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't place interactive elements inside CommandEmpty",
                body: "It's a dead-end state — buttons and links inside it are unexpected and hard to reach with keyboard. Surface follow-up actions (like a help link) outside the palette instead.",
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Keep custom empty messages short and screen-reader friendly',
                body: 'The content is announced when the empty state appears. Avoid long paragraphs or complex layouts — a heading and one short line is enough.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use an icon only when it reinforces the message',
                body: 'SearchX works well for "nothing found" — the icon and text reinforce each other. Don\'t add an icon just to fill space; an icon without purpose adds noise.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Default message */}
<CommandEmpty />

{/* Custom content */}
<CommandEmpty>
  <div className="flex flex-col items-center gap-2">
    <SearchX className="size-8 text-gray-300" />
    <p className="text-sm font-medium text-gray-400">Nothing found</p>
    <p className="text-xs text-gray-400">Try a different search term</p>
  </div>
</CommandEmpty>`}</code>
      </pre>
    </div>
  ),
}
