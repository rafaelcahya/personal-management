import { Info, X } from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from './Popover'
import Button from '@/components/base/Button/Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Popover/Basic' }
export default meta

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-xl min-h-48 items-start">
      <p className="text-sm text-gray-500 leading-relaxed">
        A minimal popover with a trigger and floating content panel. Click the trigger to open;
        click outside or press{' '}
        <kbd className="font-mono bg-gray-100 border border-gray-200 rounded px-1 text-xs">Esc</kbd>{' '}
        to close.
      </p>

      <div className="flex gap-3 flex-wrap">
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
                    A floating panel anchored to a trigger. Content is fully open — any ReactNode
                    can go here.
                  </p>
                </div>
              </div>
              <PopoverClose>
                <X className="size-4" />
              </PopoverClose>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost">Without close button</Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4">
            <p className="text-sm text-gray-700">Click outside or press Esc to close.</p>
          </PopoverContent>
        </Popover>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from '@/components/base/Popover/Popover'

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
</Popover>`}</code>
      </pre>
    </div>
  ),
}
