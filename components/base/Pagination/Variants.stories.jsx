import Pagination from './Pagination'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Pagination/Variants' }
export default meta

const Code = ({ children }) => (
  <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
    <code>{children}</code>
  </pre>
)

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

// ─── Full ─────────────────────────────────────────────────────────────────────

export const Full = {
  name: 'Full',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant=&quot;full&quot;</code>{' '}
        is the default layout. Prev sits at the far left, page info is centered, and Next sits at
        the far right — using a 3-column grid so all three parts stay in fixed positions regardless
        of label length.
      </p>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">full — icon + text</span>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <Pagination
              page={4}
              totalPages={8}
              total={75}
              variant="full"
              onPrev={() => {}}
              onNext={() => {}}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">full — icon only</span>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <Pagination
              page={4}
              totalPages={8}
              total={75}
              variant="full"
              iconOnly
              onPrev={() => {}}
              onNext={() => {}}
            />
          </div>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Default for most layouts, especially wide tables',
                body: 'The spread layout mirrors the table edges and gives equal visual weight to Prev and Next while keeping page info prominent in the center.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Avoid for narrow or centered layouts',
                body: 'Full creates too much horizontal whitespace in modals, drawers, or narrow panels. Use center, left, or right instead.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Page info stays perfectly centered regardless of button label lengths',
                body: 'The 3-column grid layout ensures the center column stays fixed — no layout shift when switching between iconOnly and icon + text.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'The default — no need to specify variant="full"',
                body: 'full is the default variant. Only pass it explicitly when you want to be intentional about the choice in code.',
              },
            ],
          },
        ]}
      />

      <Code>{`{/* icon + text */}
<Pagination page={page} totalPages={totalPages} total={total} variant="full" onPrev={handlePrev} onNext={handleNext} />

{/* icon only */}
<Pagination page={page} totalPages={totalPages} total={total} variant="full" iconOnly onPrev={handlePrev} onNext={handleNext} />`}</Code>
    </div>
  ),
}

// ─── Center ───────────────────────────────────────────────────────────────────

export const Center = {
  name: 'Center',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          variant=&quot;center&quot;
        </code>{' '}
        groups all three controls together and centers them horizontally. Use this for
        content-centered layouts like modals, drawers, or narrow panels where a spread layout would
        look too spaced out.
      </p>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">center — icon + text</span>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <Pagination
              page={4}
              totalPages={8}
              total={75}
              variant="center"
              onPrev={() => {}}
              onNext={() => {}}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">center — icon only</span>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <Pagination
              page={4}
              totalPages={8}
              total={75}
              variant="center"
              iconOnly
              onPrev={() => {}}
              onNext={() => {}}
            />
          </div>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Modals, drawers, and content-centered layouts',
                body: 'Center groups all controls together and avoids the wide spread of the full variant — better when the container is narrower than a full-width table.',
              },
              {
                title: 'Card grids',
                body: 'Pagination naturally sits below the card container rather than spanning a full-width table. Center mirrors the card grid alignment.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use on full-width tables",
                body: 'The asymmetric gap between the table edges and the centered controls looks unbalanced. Use full instead to mirror the table width.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Grouped controls are easier to scan in narrow containers',
                body: 'Centering Prev, page info, and Next together reduces the eye travel required to locate all three controls in a compact space.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Combine with iconOnly for the most compact centered bar',
                body: 'variant="center" with iconOnly gives the smallest horizontal footprint — ideal for tight modal footers or card pagination.',
              },
            ],
          },
        ]}
      />

      <Code>{`{/* icon + text */}
<Pagination page={page} totalPages={totalPages} total={total} variant="center" onPrev={handlePrev} onNext={handleNext} />

{/* icon only */}
<Pagination page={page} totalPages={totalPages} total={total} variant="center" iconOnly onPrev={handlePrev} onNext={handleNext} />`}</Code>
    </div>
  ),
}

// ─── Left ─────────────────────────────────────────────────────────────────────

export const Left = {
  name: 'Left',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant=&quot;left&quot;</code>{' '}
        groups all three controls together and anchors them to the left. Use this when the
        pagination sits below left-aligned content or next to a left-anchored table action bar.
      </p>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">left — icon + text</span>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <Pagination
              page={4}
              totalPages={8}
              total={75}
              variant="left"
              onPrev={() => {}}
              onNext={() => {}}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">left — icon only</span>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <Pagination
              page={4}
              totalPages={8}
              total={75}
              variant="left"
              iconOnly
              onPrev={() => {}}
              onNext={() => {}}
            />
          </div>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Below left-aligned content or a left-anchored toolbar',
                body: 'Use left when the pagination sits alongside other left-aligned UI — it anchors to the same edge and feels intentional rather than misplaced.',
              },
              {
                title: 'Split footer layouts',
                body: 'Left and right work together — e.g. pagination on the left, a record count or export button on the right — to fill both sides of a footer row.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use on centered or full-width standalone layouts",
                body: 'Left alignment in a layout with no other left-anchored elements feels like an unintentional misalignment. Use full or center instead.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'All three controls remain adjacent and easy to locate',
                body: 'Grouped alignment keeps Prev, page info, and Next close together — no need to scan across a wide container to find the buttons.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Pair with a right-side action button for balanced footer rows',
                body: 'Left pagination + right action (export, filter) creates a natural two-column footer. Use a flex container with justify-between to space them.',
              },
            ],
          },
        ]}
      />

      <Code>{`{/* icon + text */}
<Pagination page={page} totalPages={totalPages} total={total} variant="left" onPrev={handlePrev} onNext={handleNext} />

{/* icon only */}
<Pagination page={page} totalPages={totalPages} total={total} variant="left" iconOnly onPrev={handlePrev} onNext={handleNext} />`}</Code>
    </div>
  ),
}

// ─── Right ────────────────────────────────────────────────────────────────────

export const Right = {
  name: 'Right',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          variant=&quot;right&quot;
        </code>{' '}
        groups all three controls together and anchors them to the right. Use this for right-aligned
        content areas or when combining the bar with a left-side summary or label.
      </p>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">right — icon + text</span>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <Pagination
              page={4}
              totalPages={8}
              total={75}
              variant="right"
              onPrev={() => {}}
              onNext={() => {}}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">right — icon only</span>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <Pagination
              page={4}
              totalPages={8}
              total={75}
              variant="right"
              iconOnly
              onPrev={() => {}}
              onNext={() => {}}
            />
          </div>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Next to a left-side summary label',
                body: 'The most common use of right is a split footer: "Showing 25 of 75" on the left, Prev/Next on the right — a familiar data table pattern.',
              },
              {
                title: 'Alongside right-anchored UI elements',
                body: 'Right aligns naturally with action buttons or filter chips placed in the same footer row on the right side.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use when there's nothing on the left side",
                body: 'Right alignment in a footer with no left-side content feels unbalanced. Use full or center for standalone pagination bars.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Grouped controls stay together at the right edge',
                body: 'Prev, page info, and Next remain adjacent regardless of alignment — the grouping is the same as left and center.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Common pattern: summary text left + pagination right',
                body: 'Use a flex container with justify-between: the summary label ("Showing 25 of 75") floats left, variant="right" pagination floats right — balanced and readable.',
              },
            ],
          },
        ]}
      />

      <Code>{`{/* icon + text */}
<Pagination page={page} totalPages={totalPages} total={total} variant="right" onPrev={handlePrev} onNext={handleNext} />

{/* icon only */}
<Pagination page={page} totalPages={totalPages} total={total} variant="right" iconOnly onPrev={handlePrev} onNext={handleNext} />`}</Code>
    </div>
  ),
}
