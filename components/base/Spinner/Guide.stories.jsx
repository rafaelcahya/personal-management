import { Spinner } from './Spinner'
import Button from '@/components/base/Button/Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Spinner' }
export default meta

// ─── Primitives ───────────────────────────────────────────────────────────────

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

const ApiTable = ({ component, rows }) => (
  <div className="mb-6">
    {component && <p className="text-xs font-mono font-semibold text-gray-500 mb-2">{component}</p>}
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-50">
            {['Prop', 'Type', 'Default', 'Description'].map((h) => (
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
          {rows.map(([prop, type, def, desc]) => (
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
              <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

// ─── Story ────────────────────────────────────────────────────────────────────

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="p-8 max-w-4xl font-sans text-gray-900">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Spinner</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A lightweight inline loading indicator built from scratch using a CSS border animation. No
          SVG, no library — just a spinning circle that inherits color via{' '}
          <code className="font-mono text-sm">border-current</code>.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <div className="flex flex-col gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg mb-3 w-80">
          <div className="flex items-center gap-6">
            <Spinner size="xs" />
            <Spinner size="sm" />
            <Spinner size="default" />
            <Spinner size="lg" />
            <Spinner size="xl" />
          </div>
          <div className="flex items-center gap-6">
            <Spinner variant="default" />
            <Spinner variant="muted" />
            <div className="bg-violet-600 rounded-lg p-1.5 flex">
              <Spinner variant="white" />
            </div>
          </div>
          <Button disabled className="w-fit">
            <Spinner size="xs" variant="white" />
            Saving...
          </Button>
        </div>
        <Code>{`import { Spinner } from '@/components/base/Spinner/Spinner'

<Spinner />
<Spinner size="lg" />
<Spinner variant="muted" />
<Spinner variant="white" />

<Button disabled>
  <Spinner size="xs" variant="white" />
  Saving...
</Button>`}</Code>
      </Section>

      {/* Anatomy */}
      <Section title="Anatomy">
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4">
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wide block mb-3">
            Structure
          </span>
          <div className="relative p-4 border-2 border-dashed border-violet-400 rounded-xl inline-block">
            <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-[10px] font-mono font-semibold text-violet-600">
              Spinner
            </span>
            <div className="flex items-center gap-3 mt-1">
              <Spinner />
              <div className="relative px-3 py-2 border border-dashed border-slate-300 rounded-lg">
                <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-slate-400">
                  span[role=status]
                </span>
                <p className="text-[10px] font-mono text-gray-400 mt-1">
                  border-current · border-t-transparent · animate-spin
                </p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed mb-4">
          A single <code className="font-mono bg-gray-100 px-1 rounded text-xs">span</code> with{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">border-current</code> on
          three sides and{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">border-t-transparent</code>{' '}
          on the top, rotated via Tailwind&apos;s{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">animate-spin</code>. Color is
          inherited from <code className="font-mono bg-gray-100 px-1 rounded text-xs">text-*</code>{' '}
          classes since{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">border-current</code> uses{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">currentColor</code>.
        </p>
        <Code>{`<span
  role="status"
  aria-label="Loading"
  className="inline-block rounded-full border-current border-t-transparent animate-spin"
/>`}</Code>
      </Section>

      {/* Sizes */}
      <Section title="Sizes">
        <div className="flex items-end gap-8 mb-4">
          {[
            { size: 'xs', dim: '12px' },
            { size: 'sm', dim: '16px' },
            { size: 'default', dim: '20px' },
            { size: 'lg', dim: '28px' },
            { size: 'xl', dim: '40px' },
          ].map(({ size, dim }) => (
            <div key={size} className="flex flex-col items-center gap-3">
              <Spinner size={size} />
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-xs font-medium text-gray-700">{size}</span>
                <span className="text-[10px] text-gray-400">{dim}</span>
              </div>
            </div>
          ))}
        </div>
        <Code>{`<Spinner size="xs" />      {/* 12px */}
<Spinner size="sm" />      {/* 16px */}
<Spinner size="default" /> {/* 20px — default */}
<Spinner size="lg" />      {/* 28px */}
<Spinner size="xl" />      {/* 40px */}`}</Code>
      </Section>

      {/* Best Practices */}
      <Section title="Best Practices">
        <div className="flex flex-col gap-8">
          {[
            {
              heading: 'When to use',
              items: [
                {
                  title: 'Content shape is unknown or loading time is unpredictable',
                  body: 'Ideal for dynamic API responses, form submits, delete confirmations — any short background action where you just need to signal "something is happening."',
                },
                {
                  title: 'Use variant="white" on dark or colored backgrounds',
                  body: 'Filled buttons, dark overlays, colored surfaces — any background darker than midtone gray needs variant="white" to maintain sufficient contrast.',
                },
                {
                  title: 'Use xs or sm inside buttons and badges',
                  body: 'xs matches the text line height without making the button taller. sm for icon buttons. Keep size proportional to the surrounding context.',
                },
              ],
            },
            {
              heading: 'When not to use',
              items: [
                {
                  title: 'Use Skeleton when the layout is already known',
                  body: 'Skeleton reserves space, prevents layout shift, and feels faster than a Spinner that causes the page to reflow when content arrives.',
                },
                {
                  title: 'Use a progress bar for measurable operations',
                  body: 'File uploads and multi-step wizards have a defined percentage. A spinner communicates nothing about progress when you have actual numbers.',
                },
                {
                  title: "Don't place multiple large spinners on the same screen",
                  body: 'It overwhelms the user and makes it impossible to tell which area is actually loading. Show one spinner per loading context.',
                },
              ],
            },
            {
              heading: 'Accessibility',
              items: [
                {
                  title: 'Renders role="status" and aria-label="Loading" automatically',
                  body: 'No extra ARIA attributes needed. The spinner is already accessible out of the box.',
                },
                {
                  title: 'Always pair with a visible text label inside buttons',
                  body: 'Users who cannot perceive the spinner must still understand the action in progress via the label — "Saving...", "Loading...", "Deleting...".',
                },
              ],
            },
            {
              heading: 'Advice',
              items: [
                {
                  title: 'Always set disabled on the button while the spinner is showing',
                  body: 'Prevents double submission and gives the button the correct visual disabled state. Never show a spinner in an enabled button.',
                },
                {
                  title: 'Always add a timeout and error fallback',
                  body: 'If the spinner runs longer than ~10 seconds without resolving, surface an error state with a retry button — never leave the user staring at a spinner indefinitely.',
                },
              ],
            },
          ].map(({ heading, items }) => (
            <div key={heading}>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                {heading}
              </p>
              <div className="flex flex-col gap-3">
                {items.map(({ title, body }) => (
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
      </Section>

      {/* API Reference */}
      <Section title="API Reference">
        <SubSection title="Spinner">
          <ApiTable
            rows={[
              [
                'size',
                '"xs" | "sm" | "default" | "lg" | "xl"',
                '"default"',
                'Controls the diameter and border width.',
              ],
              [
                'variant',
                '"default" | "muted" | "white"',
                '"default"',
                'Preset color. default = violet-600, muted = gray-400, white = white.',
              ],
              [
                'className',
                'string',
                '—',
                'Override or extend styles. Use text-* to set a custom color.',
              ],
            ]}
          />
        </SubSection>
      </Section>
    </div>
  ),
}
