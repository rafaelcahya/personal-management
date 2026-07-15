import { useState } from 'react'
import Pagination from './Pagination'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Pagination/Basic' }
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

// ─── Icon + Text ──────────────────────────────────────────────────────────────

export const IconAndText = {
  name: 'Icon + Text',
  render: () => {
    const [page, setPage] = useState(4)
    return (
      <div className="flex flex-col gap-6 w-full">
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
          Default button style — chevron icon paired with a text label (&quot;Prev&quot; /
          &quot;Next&quot;). The page state lives outside the component; pass{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">onPrev</code> and{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">onNext</code> handlers to
          update it.
        </p>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">icon + text — click Prev / Next to navigate</span>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <Pagination
              page={page}
              totalPages={8}
              total={75}
              onPrev={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(8, p + 1))}
            />
          </div>
        </div>

        <BestPractices
          items={[
            {
              heading: 'When to use',
              cards: [
                {
                  title: 'Default for most layouts',
                  body: 'Icon + text is the right default — the "Prev" and "Next" labels make the action immediately clear without requiring users to interpret chevron direction alone.',
                },
              ],
            },
            {
              heading: 'When not to use',
              cards: [
                {
                  title: 'Switch to iconOnly in compact or narrow containers',
                  body: 'When the pagination bar is inside a tight toolbar or a narrow column, the text labels add visual noise. Use iconOnly to keep the bar minimal.',
                },
              ],
            },
            {
              heading: 'Accessibility',
              cards: [
                {
                  title: 'Always render unconditionally',
                  body: 'The component returns null when totalPages <= 1 automatically — no guard wrapper needed. Always rendering is safer and removes an extra conditional to maintain.',
                },
              ],
            },
            {
              heading: 'Advice',
              cards: [
                {
                  title: 'Manage page state externally and always clamp handlers',
                  body: 'Use useState for page state. Always clamp: Math.max(1, p - 1) for Prev, Math.min(totalPages, p + 1) for Next — prevents out-of-range values in parent state.',
                },
              ],
            },
          ]}
        />

        <Code>{`const [page, setPage] = useState(1)

<Pagination
  page={page}
  totalPages={8}
  total={75}
  onPrev={() => setPage((p) => Math.max(1, p - 1))}
  onNext={() => setPage((p) => Math.min(8, p + 1))}
/>`}</Code>
      </div>
    )
  },
}

// ─── Icon Only ────────────────────────────────────────────────────────────────

export const IconOnly = {
  name: 'Icon Only',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Add <code className="font-mono bg-gray-100 px-1 rounded text-xs">iconOnly</code> to hide the
        Prev / Next text labels and show chevron-only buttons. The page info text remains visible.
        See <strong>Variants → Icon Only</strong> for all four layout combinations.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">iconOnly — default full layout</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <Pagination
            page={4}
            totalPages={8}
            total={75}
            iconOnly
            onPrev={() => {}}
            onNext={() => {}}
          />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Compact toolbars or narrow containers',
                body: 'Use iconOnly when the Prev / Next text labels add visual noise without improving usability — tight sidebars, card footers, or toolbars with multiple controls.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Avoid in wide or content-focused layouts',
                body: 'In most standard page layouts, the text labels help orient users. Only switch to icon-only when space is genuinely constrained.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Icon-only buttons keep their aria-label attributes',
                body: 'Hiding the text does not affect screen readers — aria-label="Previous page" and aria-label="Next page" are always present on the buttons.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'pageInfo text is always visible regardless of iconOnly',
                body: 'Only the button labels are hidden — the "Page N of M · X records" count is always rendered. Users always know where they are in the dataset.',
              },
            ],
          },
        ]}
      />

      <Code>{`{/* Default — shows "← Prev" and "Next →" labels */}
<Pagination page={page} totalPages={8} total={75} onPrev={...} onNext={...} />

{/* Icon only — shows chevrons only */}
<Pagination page={page} totalPages={8} total={75} iconOnly onPrev={...} onNext={...} />`}</Code>
    </div>
  ),
}
