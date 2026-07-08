import { useState } from 'react'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './Collapsible'
import { ChevronDown, ChevronUp } from 'lucide-react'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Collapsible/Basic',
}

export default meta

function Demo({ label, children }) {
  const [open, setOpen] = useState(false)
  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="w-72 border border-gray-200 rounded-lg overflow-hidden"
    >
      <CollapsibleTrigger className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium bg-white hover:bg-gray-50 transition-colors">
        {label}
        {open ? (
          <ChevronUp className="size-4 text-gray-400" />
        ) : (
          <ChevronDown className="size-4 text-gray-400" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-4 py-3 text-sm text-gray-600 bg-gray-50 border-t border-gray-100">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col gap-8 max-w-sm">
      <p className="text-sm text-gray-500 leading-relaxed">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">Collapsible</code> is a
        controlled expand/collapse container. State lives in the consumer — pass{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">open</code> and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">onOpenChange</code>.
      </p>

      <Demo label="What is a collapsible?">
        A collapsible reveals or hides content when the trigger is clicked. The animation uses a CSS
        grid height trick — no JavaScript height measurement.
      </Demo>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`const [open, setOpen] = useState(false)

<Collapsible open={open} onOpenChange={setOpen}>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>
    Hidden content revealed on open
  </CollapsibleContent>
</Collapsible>`}</code>
      </pre>
    </div>
  ),
}

export const AsChild = {
  name: 'asChild trigger',
  render: () => {
    function AsChildDemo() {
      const [open, setOpen] = useState(false)
      return (
        <Collapsible
          open={open}
          onOpenChange={setOpen}
          className="w-72 border border-gray-200 rounded-lg overflow-hidden"
        >
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold bg-violet-600 text-white hover:bg-violet-700 transition-colors">
              Custom Trigger Button
              {open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 py-3 text-sm text-gray-600 bg-gray-50 border-t border-gray-100">
              The trigger is a fully custom element — styles, icons, anything goes.
            </div>
          </CollapsibleContent>
        </Collapsible>
      )
    }
    return (
      <div className="flex flex-col gap-8 max-w-sm">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">asChild</code> merges the
          click handler into the child element — no extra wrapper rendered.
        </p>
        <AsChildDemo />
        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
          <code>{`<CollapsibleTrigger asChild>
  <Button variant="ghost" className="w-full ...">
    Toggle
    {open ? <ChevronUp /> : <ChevronDown />}
  </Button>
</CollapsibleTrigger>`}</code>
        </pre>
      </div>
    )
  },
}
