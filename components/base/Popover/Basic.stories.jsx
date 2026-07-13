import { Info, X } from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from './Popover'
import Button from '@/components/base/Button/Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Popover/Basic' }
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

const Code = ({ children }) => (
  <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
    <code>{children}</code>
  </pre>
)

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        A minimal popover with a trigger and floating content panel. Click the trigger to open;
        click outside or press{' '}
        <kbd className="font-mono bg-gray-100 border border-gray-200 rounded px-1 text-xs">Esc</kbd>{' '}
        to close. Add{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">PopoverClose</code> inside the
        panel to close from within the content.
      </p>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">with close button inside content</span>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Open popover</Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-2 items-start">
                    <Info className="size-4 text-violet-500 shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-semibold text-gray-800">What is a Popover?</p>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        A floating panel anchored to a trigger. Any ReactNode can go here.
                      </p>
                    </div>
                  </div>
                  <PopoverClose>
                    <X className="size-4" />
                  </PopoverClose>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">
            without close button — click outside or Esc to dismiss
          </span>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost">Without close button</Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4">
                <p className="text-sm text-gray-700">Click outside or press Esc to close.</p>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Freeform floating content anchored to a trigger',
                body: 'Use for any content that needs to float near a trigger element — info panels, quick views, or any ReactNode that stays open while the user interacts.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Omit PopoverClose only when click-outside is the sole dismiss path',
                body: "If the panel has no interactive content and click-outside or Escape is sufficient, you don't need PopoverClose. Add it whenever the user needs an explicit close button inside.",
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Always add PopoverClose for multi-step or form panels',
                body: 'Keyboard users rely on an explicit close path inside the panel. Add PopoverClose on a Cancel or × button so they can always dismiss without pressing Escape.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Always use asChild and set an explicit width',
                body: 'asChild on PopoverTrigger avoids an extra wrapper span. Always set a width on PopoverContent (e.g. className="w-64") — without it the panel collapses to the narrowest child\'s width.',
              },
            ],
          },
        ]}
      />

      <Code>{`import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from '@/components/base/Popover/Popover'

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Open popover</Button>
  </PopoverTrigger>
  <PopoverContent className="w-72 p-4">
    <p className="text-sm text-gray-700">Content goes here.</p>
    <PopoverClose>
      <X className="size-4" />
    </PopoverClose>
  </PopoverContent>
</Popover>`}</Code>
    </div>
  ),
}
