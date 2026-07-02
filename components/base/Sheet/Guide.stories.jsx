import { useState } from 'react'
import { X, Settings } from 'lucide-react'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from './Sheet'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Sheet',
}

export default meta

// ─── Primitives ──────────────────────────────────────────────────────────────

const Section = ({ title, description, children }) => (
  <div className="mb-12">
    <h2 className="text-xl font-semibold text-gray-900 mb-1">{title}</h2>
    {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
    <hr className="mb-5 border-gray-200" />
    {children}
  </div>
)

const SubSection = ({ title, description, children }) => (
  <div className="mb-8">
    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">{title}</h3>
    {description && <p className="text-xs text-gray-500 mb-3">{description}</p>}
    {children}
  </div>
)

const Preview = ({ children }) => (
  <div className="flex flex-col gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg mb-3 w-80">
    {children}
  </div>
)

const Code = ({ children }) => (
  <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto mb-4 leading-relaxed">
    <code>{children}</code>
  </pre>
)

const Tag = ({ children, color = 'gray' }) => {
  const colors = {
    gray: 'bg-gray-100 text-gray-600',
    violet: 'bg-violet-100 text-violet-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
  }
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-medium ${colors[color]}`}
    >
      {children}
    </span>
  )
}

const btnClass =
  'inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors'

// ─── Story ───────────────────────────────────────────────────────────────────

export const Docs = {
  name: 'Docs',
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="p-8 max-w-4xl font-sans text-gray-900">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Sheet</h1>
            <Tag color="violet">Base Component</Tag>
          </div>
          <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
            A slide-in panel that pushes in from any edge of the viewport. Supports 4 sides, 4
            sizes, focus trap, scroll lock, and keyboard accessibility. Renders via createPortal —
            never clipped by overflow containers.
          </p>
        </div>

        {/* Overview */}
        <Section title="Overview">
          <Preview>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button type="button" className={btnClass}>
                  <Settings size={14} />
                  Open Sheet
                </button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Edit Profile</SheetTitle>
                  <SheetDescription>Update your display name and preferences.</SheetDescription>
                </SheetHeader>
                <div className="flex-1 px-6 py-2 text-sm text-gray-600">Sheet body content</div>
                <SheetFooter>
                  <SheetClose asChild>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                    >
                      Cancel
                    </button>
                  </SheetClose>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Save changes
                  </button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </Preview>
        </Section>

        {/* Anatomy */}
        <Section title="Anatomy">
          <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4">
            <div className="flex flex-wrap gap-8">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wide mb-1">
                  Structure
                </span>

                {/* Root: Sheet */}
                <div className="relative p-4 border-2 border-dashed border-violet-400 rounded-xl inline-block">
                  <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-[10px] font-mono font-semibold text-violet-600">
                    Sheet
                  </span>

                  {/* SheetTrigger */}
                  <div className="relative p-3 border border-dashed border-violet-300 rounded-lg mb-2">
                    <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-violet-500">
                      SheetTrigger
                    </span>
                    <div className="mt-1 px-3 py-1.5 bg-white border border-gray-200 rounded text-xs text-gray-500 whitespace-nowrap">
                      trigger element
                    </div>
                  </div>

                  {/* SheetContent (Portal) */}
                  <div className="relative p-3 border border-dashed border-blue-300 rounded-lg">
                    <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-blue-500">
                      SheetContent (Portal)
                    </span>
                    <div className="mt-1 flex flex-col gap-1.5">
                      {/* SheetOverlay */}
                      <div className="relative p-2 border border-dashed border-slate-300 rounded">
                        <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-slate-400">
                          SheetOverlay
                        </span>
                        <div className="mt-0.5 text-[10px] text-gray-400 font-mono">
                          backdrop, click to close
                        </div>
                      </div>
                      {/* SheetHeader */}
                      <div className="relative p-2 border border-dashed border-slate-300 rounded">
                        <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-slate-400">
                          SheetHeader
                        </span>
                        <div className="mt-0.5 text-[10px] text-gray-400 font-mono">
                          SheetTitle · SheetDescription
                        </div>
                      </div>
                      {/* children */}
                      <div className="px-2 py-1.5 bg-white border border-gray-200 rounded text-xs text-gray-500">
                        children (any ReactNode)
                      </div>
                      {/* SheetFooter */}
                      <div className="relative p-2 border border-dashed border-slate-300 rounded">
                        <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-slate-400">
                          SheetFooter
                        </span>
                        <div className="mt-0.5 text-[10px] text-gray-400 font-mono">
                          SheetClose · action buttons
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Parts table */}
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {['Part', 'Element', 'Description'].map((h) => (
                    <th
                      key={h}
                      className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700 text-xs uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    'Sheet',
                    '<div> (Context Root)',
                    'Root. Manages open state; supports controlled and uncontrolled modes.',
                  ],
                  [
                    'SheetTrigger',
                    '<span> or asChild',
                    'Opens the sheet on click. Use asChild to merge onto a custom element.',
                  ],
                  [
                    'SheetOverlay',
                    '<div> (Portal)',
                    'Full-screen backdrop. Click to close. Included automatically inside SheetContent.',
                  ],
                  [
                    'SheetContent',
                    '<div> (Portal)',
                    'The sliding panel. Renders in a Portal. Handles focus trap, scroll lock, Escape key.',
                  ],
                  ['SheetHeader', '<div>', 'Top section — wraps SheetTitle and SheetDescription.'],
                  ['SheetTitle', '<h2>', 'Panel heading.'],
                  ['SheetDescription', '<p>', 'Supporting description text below the title.'],
                  [
                    'SheetFooter',
                    '<div>',
                    'Bottom section — action buttons row, pinned to bottom.',
                  ],
                  [
                    'SheetClose',
                    '<button> or asChild',
                    'Closes the sheet on click. Place anywhere inside or outside SheetContent.',
                  ],
                ].map(([part, el, desc]) => (
                  <tr key={part} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                      {part}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400 whitespace-nowrap">
                      {el}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">
                      {desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Code>{`<Sheet>
  <SheetTrigger asChild>
    <Button>Open Sheet</Button>
  </SheetTrigger>
  <SheetContent side="right" size="default">
    <SheetHeader>
      <SheetTitle>Edit Profile</SheetTitle>
      <SheetDescription>Make changes to your profile here.</SheetDescription>
    </SheetHeader>
    {/* body content */}
    <SheetFooter>
      <SheetClose asChild>
        <Button variant="outline">Cancel</Button>
      </SheetClose>
      <Button>Save changes</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>`}</Code>
        </Section>

        {/* Usage */}
        <Section title="Usage">
          <SubSection title="Import">
            <Code>{`import {
  Sheet, SheetTrigger, SheetContent,
  SheetHeader, SheetTitle, SheetDescription,
  SheetFooter, SheetClose,
} from '@/components/base/Sheet/Sheet'`}</Code>
          </SubSection>

          <SubSection title="Basic uncontrolled">
            <Code>{`<Sheet>
  <SheetTrigger asChild>
    <Button>Open</Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Title</SheetTitle>
    </SheetHeader>
    <SheetClose asChild>
      <Button variant="ghost">Close</Button>
    </SheetClose>
  </SheetContent>
</Sheet>`}</Code>
          </SubSection>

          <SubSection title="Controlled">
            <Code>{`const [open, setOpen] = useState(false)

<Sheet open={open} onOpenChange={setOpen}>
  <SheetTrigger asChild>
    <Button>Open</Button>
  </SheetTrigger>
  <SheetContent>...</SheetContent>
</Sheet>`}</Code>
          </SubSection>
        </Section>

        {/* Behaviors */}
        <Section title="Behaviors">
          <SubSection title="Built-in interactions">
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    {['Interaction', 'Behavior'].map((h) => (
                      <th
                        key={h}
                        className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700 text-xs uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Click overlay', 'Closes the sheet (when closeOnOverlayClick=true, default)'],
                    ['Escape key', 'Closes the sheet, restores focus to trigger'],
                    ['Tab / Shift+Tab', 'Cycles focus within SheetContent (focus trap)'],
                    ['Open', 'Locks body scroll, auto-focuses first focusable element'],
                    ['Close', 'Unlocks body scroll, restores focus to previous element'],
                  ].map(([interaction, behavior]) => (
                    <tr key={interaction} className="even:bg-gray-50">
                      <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                        {interaction}
                      </td>
                      <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">
                        {behavior}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SubSection>
        </Section>

        {/* Sizes */}
        <Section title="Sizes">
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            <code className="font-mono text-xs bg-gray-100 px-1 rounded">size</code> controls width
            for left/right sheets and height for top/bottom sheets.
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {['size', 'left / right', 'top / bottom'].map((h) => (
                    <th
                      key={h}
                      className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700 text-xs uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['sm', '320px', '200px'],
                  ['default', '400px', '300px'],
                  ['lg', '540px', '400px'],
                  ['full', '100vw', '100vh'],
                ].map(([size, lr, tb]) => (
                  <tr key={size} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs">
                      {size}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500">
                      {lr}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500">
                      {tb}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* API Reference */}
        <Section title="API Reference">
          <SubSection title="Sheet" description="Root component. Manages open state.">
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    {['Prop', 'Type', 'Default', 'Description'].map((h) => (
                      <th
                        key={h}
                        className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['open', 'boolean', '—', 'Controlled open state.'],
                    [
                      'onOpenChange',
                      '(open: boolean) => void',
                      '—',
                      'Called when open state changes.',
                    ],
                    ['defaultOpen', 'boolean', 'false', 'Initial open state (uncontrolled).'],
                  ].map(([prop, type, def, desc]) => (
                    <tr key={prop} className="even:bg-gray-50">
                      <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                        {prop}
                      </td>
                      <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500 max-w-xs">
                        {type}
                      </td>
                      <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400">
                        {def}
                      </td>
                      <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">
                        {desc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SubSection>

          <SubSection title="SheetContent" description="The sliding panel rendered in a Portal.">
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    {['Prop', 'Type', 'Default', 'Description'].map((h) => (
                      <th
                        key={h}
                        className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      'side',
                      "'left' | 'right' | 'top' | 'bottom'",
                      "'right'",
                      'Which edge the panel slides in from.',
                    ],
                    [
                      'size',
                      "'sm' | 'default' | 'lg' | 'full'",
                      "'default'",
                      'Width (left/right) or height (top/bottom) of the panel.',
                    ],
                    [
                      'animation',
                      "'slide' | 'none'",
                      "'slide'",
                      'slide — panel transitions in from the side. none — appears instantly with no transition.',
                    ],
                    [
                      'closeOnOverlayClick',
                      'boolean',
                      'true',
                      'Whether clicking the backdrop overlay closes the sheet.',
                    ],
                    [
                      'children',
                      'ReactNode',
                      '—',
                      'Any content — forms, lists, structured layouts.',
                    ],
                    ['className', 'string', '—', 'Extra classes merged onto the panel.'],
                  ].map(([prop, type, def, desc]) => (
                    <tr key={prop} className="even:bg-gray-50">
                      <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                        {prop}
                      </td>
                      <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500 max-w-xs">
                        {type}
                      </td>
                      <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400">
                        {def}
                      </td>
                      <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">
                        {desc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SubSection>

          <SubSection title="SheetTrigger / SheetClose">
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    {['Prop', 'Type', 'Default', 'Description'].map((h) => (
                      <th
                        key={h}
                        className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      'asChild',
                      'boolean',
                      'false',
                      'Merge open/close handler onto the child element instead of wrapping.',
                    ],
                  ].map(([prop, type, def, desc]) => (
                    <tr key={prop} className="even:bg-gray-50">
                      <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                        {prop}
                      </td>
                      <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500">
                        {type}
                      </td>
                      <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400">
                        {def}
                      </td>
                      <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">
                        {desc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SubSection>
        </Section>
      </div>
    )
  },
}
