import { useState } from 'react'
import Pagination from './Pagination'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Pagination' }
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
    blue: 'bg-blue-100 text-blue-700',
  }
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-medium ${colors[color]}`}
    >
      {children}
    </span>
  )
}

const ApiTable = ({ rows }) => (
  <div className="overflow-x-auto mb-6">
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
)

// ─── Live demo ────────────────────────────────────────────────────────────────

function PaginationDemo() {
  const [page, setPage] = useState(4)
  return (
    <Pagination
      page={page}
      totalPages={8}
      total={75}
      onPrev={() => setPage((p) => Math.max(1, p - 1))}
      onNext={() => setPage((p) => Math.min(8, p + 1))}
    />
  )
}

// ─── Story ────────────────────────────────────────────────────────────────────

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="p-8 max-w-4xl font-sans text-gray-900">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Pagination</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          A standalone pagination bar — Prev / page info / Next. Use it beneath any list or table
          that paginates server-side. Returns{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">null</code> automatically
          when{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">totalPages &lt;= 1</code>.
        </p>
      </div>

      {/* ── Overview ───────────────────────────────────────────────────────── */}
      <Section title="Overview">
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-3">
          <PaginationDemo />
        </div>
        <p className="text-xs text-gray-400 mb-4">Click Prev / Next to change the page.</p>
        <Code>{`import Pagination from '@/components/base/Pagination/Pagination'

const [page, setPage] = useState(1)

<Pagination
  page={page}
  totalPages={8}
  total={75}
  onPrev={() => setPage((p) => Math.max(1, p - 1))}
  onNext={() => setPage((p) => Math.min(8, p + 1))}
/>`}</Code>
      </Section>

      {/* ── Anatomy ────────────────────────────────────────────────────────── */}
      <Section title="Anatomy">
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4">
          {/* full variant diagram */}
          <div className="flex flex-col gap-2 mb-6">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wide mb-1">
              variant=&quot;full&quot; (default)
            </span>
            <div className="relative p-4 border-2 border-dashed border-violet-400 rounded-xl">
              <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-[10px] font-mono font-semibold text-violet-600">
                Pagination
              </span>
              <div className="grid grid-cols-3 items-center gap-2 mt-1">
                <div className="relative px-3 py-1.5 border border-dashed border-blue-300 rounded text-center">
                  <span className="absolute -top-2 left-1 bg-gray-50 px-0.5 text-[10px] font-mono text-blue-500">
                    prevBtn
                  </span>
                  <span className="text-[10px] text-gray-500 mt-0.5 block">← Prev</span>
                </div>
                <div className="relative px-3 py-1.5 border border-dashed border-slate-300 rounded text-center">
                  <span className="absolute -top-2 left-1 bg-gray-50 px-0.5 text-[10px] font-mono text-slate-400">
                    pageInfo
                  </span>
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    Page 4 of 8 · 75 records
                  </span>
                </div>
                <div className="relative px-3 py-1.5 border border-dashed border-blue-300 rounded text-center">
                  <span className="absolute -top-2 left-1 bg-gray-50 px-0.5 text-[10px] font-mono text-blue-500">
                    nextBtn
                  </span>
                  <span className="text-[10px] text-gray-500 mt-0.5 block">Next →</span>
                </div>
              </div>
            </div>
          </div>

          {/* center/left/right variant diagram */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wide mb-1">
              variant=&quot;center&quot; / &quot;left&quot; / &quot;right&quot;
            </span>
            <div className="relative p-4 border-2 border-dashed border-violet-400 rounded-xl">
              <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-[10px] font-mono font-semibold text-violet-600">
                Pagination
              </span>
              <div className="flex items-center justify-center gap-3 mt-1">
                <div className="relative px-3 py-1.5 border border-dashed border-blue-300 rounded">
                  <span className="absolute -top-2 left-1 bg-gray-50 px-0.5 text-[10px] font-mono text-blue-500">
                    prevBtn
                  </span>
                  <span className="text-[10px] text-gray-500 mt-0.5 block">← Prev</span>
                </div>
                <div className="relative px-3 py-1.5 border border-dashed border-slate-300 rounded">
                  <span className="absolute -top-2 left-1 bg-gray-50 px-0.5 text-[10px] font-mono text-slate-400">
                    pageInfo
                  </span>
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    Page 4 of 8 · 75 records
                  </span>
                </div>
                <div className="relative px-3 py-1.5 border border-dashed border-blue-300 rounded">
                  <span className="absolute -top-2 left-1 bg-gray-50 px-0.5 text-[10px] font-mono text-blue-500">
                    nextBtn
                  </span>
                  <span className="text-[10px] text-gray-500 mt-0.5 block">Next →</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <SubSection title="Parts">
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {['Part', 'Element', 'Role'].map((h) => (
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
                    'prevBtn',
                    '<Button>',
                    'Ghost button with ChevronLeft. Disabled when page <= 1.',
                  ],
                  [
                    'pageInfo',
                    '<span>',
                    'Page N of M · X records. Has aria-live="polite" for screen readers.',
                  ],
                  [
                    'nextBtn',
                    '<Button>',
                    'Ghost button with ChevronRight. Disabled when page >= totalPages.',
                  ],
                ].map(([part, el, role]) => (
                  <tr key={part} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                      {part}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400 whitespace-nowrap">
                      {el}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">
                      {role}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SubSection>
      </Section>

      {/* ── Best Practices ─────────────────────────────────────────────────── */}
      <Section title="Best Practices">
        <div className="flex flex-col gap-8">
          {[
            {
              heading: 'When to use',
              items: [
                {
                  title: 'Beneath any list or table that paginates server-side',
                  body: 'Use Pagination when data is fetched page-by-page from a server. Works for both table and mobile card list layouts.',
                },
                {
                  title: 'Always render unconditionally',
                  body: 'The component returns null automatically when totalPages <= 1. No guard wrapper needed — just render it and let it decide.',
                },
              ],
            },
            {
              heading: 'When not to use',
              items: [
                {
                  title: 'Data already in memory — use DataTable instead',
                  body: "Don't use when all data is already loaded client-side. Use the DataTable component with its built-in pagination prop to avoid managing two separate page states for the same dataset.",
                },
                {
                  title: 'Short lists under ~20 rows',
                  body: "Don't paginate a list small enough to show all items at once — the extra navigation step adds friction without benefit.",
                },
                {
                  title: 'When you need page-number buttons or jump-to-page input',
                  body: 'This component only supports prev/next navigation. If users need to jump to a specific page directly, a different pagination pattern is required.',
                },
              ],
            },
            {
              heading: 'Accessibility',
              items: [
                {
                  title: 'pageInfo has aria-live="polite" for screen readers',
                  body: 'Screen readers announce page changes automatically when the page info text updates. No extra markup needed.',
                },
                {
                  title: 'Prev and Next buttons have aria-label attributes',
                  body: 'The buttons are accessible even with iconOnly — aria-label="Previous page" and aria-label="Next page" are always present.',
                },
              ],
            },
            {
              heading: 'Advice',
              items: [
                {
                  title: 'Place outside any sm:hidden / sm:block responsive wrappers',
                  body: 'Pagination should render on all screen sizes — mobile and desktop share the same bar. Wrapping it in a responsive visibility class will hide it on some viewports.',
                },
                {
                  title: 'Always clamp onPrev and onNext handlers',
                  body: 'Use Math.max(1, p - 1) for Prev and Math.min(totalPages, p + 1) for Next to prevent out-of-range page values in parent state.',
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

      {/* ── API Reference ──────────────────────────────────────────────────── */}
      <Section title="API Reference">
        <ApiTable
          rows={[
            ['page', 'number', '—', 'Current page number (1-based).'],
            ['totalPages', 'number', '—', 'Total number of pages. Returns null when <= 1.'],
            ['total', 'number', '—', 'Total record count shown in the page info label.'],
            ['onPrev', '() => void', '—', 'Called when the Prev button is clicked.'],
            ['onNext', '() => void', '—', 'Called when the Next button is clicked.'],
            [
              'variant',
              '"full" | "center" | "left" | "right"',
              '"full"',
              'Layout of controls. full = Prev far left, page info centered, Next far right. Others = all controls grouped together.',
            ],
            [
              'iconOnly',
              'boolean',
              'false',
              'Show chevron-only buttons — hides the Prev/Next text labels.',
            ],
            ['id', 'string', '—', 'Optional id on the container div.'],
            [
              'prevId',
              'string',
              '—',
              'Optional id on the Prev button — used for Cypress test targeting.',
            ],
            [
              'nextId',
              'string',
              '—',
              'Optional id on the Next button — used for Cypress test targeting.',
            ],
            [
              'infoId',
              'string',
              '—',
              'Optional id on the page info span — used for Cypress test targeting.',
            ],
            ['className', 'string', '—', 'Extra classes merged onto the container div.'],
          ]}
        />
      </Section>
    </div>
  ),
}
