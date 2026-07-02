import { useState } from 'react'
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
} from './Toast'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Toast',
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function OverviewDemo() {
  const [open, setOpen] = useState(false)
  return (
    <ToastProvider position="bottom-right">
      <Preview>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
        >
          Show Toast
        </button>
      </Preview>
      {open && (
        <Toast onOpenChange={(o) => !o && setOpen(false)} variant="default">
          <div className="flex-1 min-w-0">
            <ToastTitle>Toast notification</ToastTitle>
            <ToastDescription>Settings saved successfully.</ToastDescription>
          </div>
          <ToastClose />
        </Toast>
      )}
      <ToastViewport />
    </ToastProvider>
  )
}

// ─── Story ───────────────────────────────────────────────────────────────────

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="p-8 max-w-4xl font-sans text-gray-900">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Toast</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A brief notification that slides in from the edge of the screen. Renders in a Portal via
          ToastViewport — never clipped by overflow containers.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          Toast renders in a Portal via{' '}
          <code className="font-mono text-xs bg-gray-100 px-1 rounded">ToastViewport</code> so it is
          never clipped by overflow containers. Use it for transient feedback — save confirmations,
          error alerts, or undo prompts — not for critical content that must always be visible.
        </p>
        <OverviewDemo />
      </Section>

      {/* Anatomy */}
      <Section title="Anatomy">
        {/* Box diagram */}
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4">
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wide mb-1">
                Structure
              </span>

              {/* Root: ToastProvider */}
              <div className="relative p-4 border-2 border-dashed border-violet-400 rounded-xl inline-block">
                <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-[10px] font-mono font-semibold text-violet-600">
                  ToastProvider
                </span>

                {/* Core: Toast */}
                <div className="relative p-3 border border-dashed border-blue-300 rounded-lg mb-2">
                  <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-blue-500">
                    Toast
                  </span>
                  <div className="mt-1 flex flex-col gap-1.5">
                    {/* Internal: ToastTitle */}
                    <div className="relative p-2 border border-dashed border-slate-300 rounded">
                      <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-slate-400">
                        ToastTitle
                      </span>
                      <div className="mt-0.5 text-[10px] text-gray-400 font-mono">title text</div>
                    </div>
                    {/* Internal: ToastDescription */}
                    <div className="relative p-2 border border-dashed border-slate-300 rounded">
                      <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-slate-400">
                        ToastDescription
                      </span>
                      <div className="mt-0.5 text-[10px] text-gray-400 font-mono">
                        description text
                      </div>
                    </div>
                    {/* Optional: ToastAction */}
                    <div className="relative p-2 border border-dashed border-green-300 rounded">
                      <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-green-500">
                        ToastAction (optional)
                      </span>
                      <div className="mt-0.5 text-[10px] text-gray-400 font-mono">
                        action button
                      </div>
                    </div>
                    {/* Optional: ToastClose */}
                    <div className="relative p-2 border border-dashed border-green-300 rounded">
                      <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-green-500">
                        ToastClose (optional)
                      </span>
                      <div className="mt-0.5 text-[10px] text-gray-400 font-mono">✕</div>
                    </div>
                  </div>
                </div>

                {/* Core: ToastViewport */}
                <div className="relative p-3 border border-dashed border-blue-300 rounded-lg">
                  <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-blue-500">
                    ToastViewport
                  </span>
                  <div className="mt-1 text-[10px] text-gray-400 font-mono">
                    fixed portal container
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
                  'ToastProvider',
                  '<div> (context)',
                  'Required root. Accepts position prop — controls viewport placement and slide animation direction.',
                ],
                [
                  'ToastViewport',
                  '<ol> (Portal)',
                  'Fixed container that holds all active toasts. Reads position from ToastProvider context.',
                ],
                [
                  'Toast',
                  '<li>',
                  'Individual toast notification. Accepts variant, duration, open, and onOpenChange.',
                ],
                ['ToastTitle', '<div>', 'Semibold heading text inside the toast.'],
                [
                  'ToastDescription',
                  '<div>',
                  'Supporting body text below the title. Slightly smaller and muted.',
                ],
                [
                  'ToastAction',
                  '<button>',
                  'Optional action button rendered inside the toast. Requires altText for accessibility.',
                ],
                [
                  'ToastClose',
                  '<button>',
                  'Optional dismiss (✕) button anchored to the top-right of the toast.',
                ],
              ].map(([part, el, desc]) => (
                <tr key={part} className="even:bg-gray-50">
                  <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                    {part}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400 whitespace-nowrap">
                    {el}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Source code */}
        <Code>{`<ToastProvider position="bottom-right">
  <Toast open={open} onOpenChange={setOpen} variant="success">
    <div className="flex-1 min-w-0">
      <ToastTitle>Saved</ToastTitle>
      <ToastDescription>Your changes have been saved.</ToastDescription>
    </div>
    <ToastAction altText="Undo save" variant="success">Undo</ToastAction>
    <ToastClose />
  </Toast>
  <ToastViewport />
</ToastProvider>`}</Code>
      </Section>

      {/* Usage */}
      <Section title="Usage">
        <SubSection title="Import">
          <Code>{`import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
} from '@/components/base/Toast/Toast'`}</Code>
        </SubSection>

        <SubSection title="Basic example">
          <Code>{`const [open, setOpen] = useState(false)

<ToastProvider position="bottom-right">
  <button onClick={() => setOpen(true)}>Show Toast</button>

  <Toast open={open} onOpenChange={setOpen}>
    <div className="flex-1 min-w-0">
      <ToastTitle>Done</ToastTitle>
      <ToastDescription>Action completed successfully.</ToastDescription>
    </div>
    <ToastClose />
  </Toast>

  <ToastViewport />
</ToastProvider>`}</Code>
        </SubSection>

        <SubSection title="With action button">
          <Code>{`<Toast open={open} onOpenChange={setOpen} variant="info">
  <div className="flex-1 min-w-0">
    <ToastTitle>Update available</ToastTitle>
    <ToastDescription>A new version is ready to install.</ToastDescription>
  </div>
  <ToastAction altText="Install update" variant="info">Install</ToastAction>
  <ToastClose />
</Toast>`}</Code>
        </SubSection>
      </Section>

      {/* Animation */}
      <Section
        title="Animation"
        description="Toasts slide in/out from the direction matching their viewport position. Duration controls auto-dismiss timing."
      >
        <SubSection title="Enter / exit">
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {['Event', 'Effect'].map((h) => (
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
                  ['open', 'Slides in from the direction of the viewport position + fades in'],
                  ['closed (auto or dismiss)', 'Slides out in the same direction + fades out'],
                  ['swipe right', 'Follows finger, then slides out on release'],
                ].map(([event, desc]) => (
                  <tr key={event} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                      {event}
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

        <SubSection title="Duration">
          <p className="text-xs text-gray-500 mb-3">
            Pass a number in milliseconds to{' '}
            <code className="font-mono bg-gray-100 px-1 rounded">duration</code>. Default is 5000ms.
            Pass <code className="font-mono bg-gray-100 px-1 rounded">Infinity</code> to prevent
            auto-dismiss.
          </p>
          <Code>{`<Toast duration={3000}>...</Toast>   {/* 3 seconds */}
<Toast duration={Infinity}>...</Toast> {/* stays until dismissed */}`}</Code>
        </SubSection>
      </Section>

      {/* API Reference */}
      <Section title="API Reference">
        <SubSection title="Toast" description="The individual toast notification element.">
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
                    'variant',
                    "'default' | 'info' | 'success' | 'warning' | 'danger'",
                    "'default'",
                    'Semantic color variant.',
                  ],
                  [
                    'animation',
                    "'slide-fade' | 'slide' | 'fade' | 'none'",
                    "'slide-fade'",
                    'Enter/exit animation. slide-fade: slide up + fade. slide: slide only. fade: fade only. none: instant.',
                  ],
                  [
                    'duration',
                    'number',
                    '5000',
                    'Auto-dismiss delay in ms. Pass Infinity to disable.',
                  ],
                  ['open', 'boolean', '—', 'Controlled open state.'],
                  ['onOpenChange', '(open: boolean) => void', '—', 'Called when state changes.'],
                  ['className', 'string', '—', 'Extra classes merged onto the toast.'],
                  ['children', 'ReactNode', '—', 'Content — title, description, actions.'],
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

        <SubSection
          title="ToastProvider"
          description="Required root. Provides position context shared by ToastViewport and Toast."
        >
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
                    'position',
                    "'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'",
                    "'bottom-right'",
                    'Screen position for the toast stack. Controls both viewport placement and slide animation direction.',
                  ],
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

        <SubSection
          title="ToastViewport"
          description="Fixed portal container for all active toasts. Reads position from ToastProvider context."
        >
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
                {[['className', 'string', '—', 'Extra classes merged onto the viewport.']].map(
                  ([prop, type, def, desc]) => (
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
                  )
                )}
              </tbody>
            </table>
          </div>
        </SubSection>

        <SubSection
          title="ToastAction"
          description="Optional action button rendered inside the toast."
        >
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
                  ['altText', 'string', '—', 'Required screen reader label describing the action.'],
                  [
                    'variant',
                    "'default' | 'info' | 'success' | 'warning' | 'danger'",
                    "'default'",
                    'Match to the parent Toast variant for correct border/hover colors.',
                  ],
                  [
                    'position',
                    "'inline' | 'stacked-left' | 'stacked-right'",
                    "'inline'",
                    'inline — action sits in the same row. stacked-left / stacked-right — action wraps to its own row, aligned left or right.',
                  ],
                  ['children', 'ReactNode', '—', 'Button label.'],
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
      </Section>
    </div>
  ),
}
