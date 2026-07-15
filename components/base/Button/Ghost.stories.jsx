import { Plus } from 'lucide-react'
import Button from './Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Button/Ghost',
}

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

export const Normal = {
  name: 'Normal',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">ghost</code> variant has no
        background or border at rest — it reveals a subtle fill only on hover. The lowest visual
        weight of all variants, designed for toolbars and inline contextual actions.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">all sizes — normal state</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="ghost" size="xs">
            XSmall
          </Button>
          <Button variant="ghost" size="sm">
            Small
          </Button>
          <Button variant="ghost" size="md">
            Medium
          </Button>
          <Button variant="ghost" size="lg">
            Large
          </Button>
          <Button variant="ghost" size="xl">
            XLarge
          </Button>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use ghost for toolbar actions and inline contextual controls',
                body: 'Ghost buttons are ideal where many actions sit side by side — row action menus, toolbar icon groups, or collapsible panel controls — and visual density must stay low.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use ghost as the primary CTA or standalone action",
                body: 'Ghost buttons are nearly invisible at rest. Users may not recognize them as interactive at all. A standalone ghost button without surrounding context will be overlooked.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Ensure ghost buttons have sufficient contrast against their background',
                body: 'Ghost uses primary-colored text (violet) on a transparent background. On non-white surfaces, verify the text contrast meets WCAG 4.5:1. The hover background provides context but does not replace idle contrast.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Ghost is the best default for rows of icon-only toolbar actions',
                body: 'A row of ghost icon buttons is the standard toolbar pattern. The invisible background keeps focus on content; hover reveals interactivity contextually. Switch to outline only when actions must remain visible at rest.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Button variant="ghost">Edit</Button>
<Button variant="ghost">Duplicate</Button>`}</code>
      </pre>
    </div>
  ),
}

export const Disabled = {
  name: 'Disabled',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">disabled</code> to prevent
        interaction. Ghost at 50% opacity is nearly invisible — this state is difficult to perceive
        without additional context.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">all sizes — disabled state</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="ghost" size="xs" disabled>
            XSmall
          </Button>
          <Button variant="ghost" size="sm" disabled>
            Small
          </Button>
          <Button variant="ghost" size="md" disabled>
            Medium
          </Button>
          <Button variant="ghost" size="lg" disabled>
            Large
          </Button>
          <Button variant="ghost" size="xl" disabled>
            XLarge
          </Button>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use disabled ghost when the action is gated on a selection or state',
                body: 'Row actions like Edit or Duplicate in a table toolbar should be disabled when nothing is selected. Keeping them in the layout (but disabled) communicates they will become available after a selection.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title:
                  "Don't disable a ghost button without keeping it visible through layout or surrounding context",
                body: 'A disabled ghost button is nearly invisible. Users may not know the action exists. Only disable ghost when the broader layout makes the action discoverable.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Disabled ghost may be imperceptible to low-vision users',
                body: 'At 50% opacity with no border, disabled ghost text contrast can fall well below WCAG thresholds. If the action must be discoverable in its disabled state, use outline or secondary instead.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Consider hiding rather than disabling ghost toolbar actions when nothing is selected',
                body: 'In a table with no selection, hiding the edit and delete ghost buttons entirely can be cleaner than showing faded disabled ones. Show them only when selection is active.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Button variant="ghost" disabled>Edit</Button>`}</code>
      </pre>
    </div>
  ),
}

export const Loading = {
  name: 'Loading',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">isLoading</code> to show a
        spinner and disable interaction. Ghost loading is subtle — the spinner appears in the icon
        slot against a transparent background.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">all sizes — loading state</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="ghost" size="xs" isLoading>
            XSmall
          </Button>
          <Button variant="ghost" size="sm" isLoading>
            Small
          </Button>
          <Button variant="ghost" size="md" isLoading>
            Medium
          </Button>
          <Button variant="ghost" size="lg" isLoading>
            Large
          </Button>
          <Button variant="ghost" size="xl" isLoading>
            XLarge
          </Button>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use ghost loading for inline row actions that trigger async operations',
                body: 'A ghost button in a table row (Toggle active, Refresh status) benefits from a loading state to signal the action is processing without drawing excessive attention away from the table content.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title:
                  "Don't use ghost loading for primary async operations — users may miss the spinner",
                body: 'The ghost loading spinner is subtle. For important async operations that users need to wait on (Save, Submit, Delete), use the default or destructive variant so the loading state is clearly visible.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'aria-busy is set automatically — screen readers announce the loading state',
                body: 'Even though the visual loading indicator is subtle on ghost, the aria-busy attribute and sr-only loadingText ensure screen reader users are informed.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'For ghost loading in dense tables, consider a row-level loading indicator instead',
                body: 'In a table with many row actions, a ghost spinner can be hard to locate. A row-level skeleton or a status indicator in the row itself may communicate async state more clearly.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Button variant="ghost" isLoading loadingText="Refreshing">
  Refresh
</Button>`}</code>
      </pre>
    </div>
  ),
}

export const LoadingWithIcon = {
  name: 'Loading With Icon',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        When <code className="font-mono bg-gray-100 px-1 rounded text-xs">isLoading</code> and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">useIcon</code> are both set,
        the spinner replaces the icon in its slot. On ghost, both the icon and spinner appear in the
        primary color against a transparent background.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">icon left — loading state</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="ghost" size="xs" useIcon={<Plus />} isLoading>
            XSmall
          </Button>
          <Button variant="ghost" size="sm" useIcon={<Plus />} isLoading>
            Small
          </Button>
          <Button variant="ghost" size="md" useIcon={<Plus />} isLoading>
            Medium
          </Button>
          <Button variant="ghost" size="lg" useIcon={<Plus />} isLoading>
            Large
          </Button>
          <Button variant="ghost" size="xl" useIcon={<Plus />} isLoading>
            XLarge
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">icon right — loading state</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="ghost" size="xs" useIcon={<Plus />} iconPosition="right" isLoading>
            XSmall
          </Button>
          <Button variant="ghost" size="sm" useIcon={<Plus />} iconPosition="right" isLoading>
            Small
          </Button>
          <Button variant="ghost" size="md" useIcon={<Plus />} iconPosition="right" isLoading>
            Medium
          </Button>
          <Button variant="ghost" size="lg" useIcon={<Plus />} iconPosition="right" isLoading>
            Large
          </Button>
          <Button variant="ghost" size="xl" useIcon={<Plus />} iconPosition="right" isLoading>
            XLarge
          </Button>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Spinner replaces icon in the same slot — ghost width stays stable',
                body: 'The automatic swap preserves button width. For ghost buttons in tight toolbars, this prevents layout jumps when the action transitions to loading.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title:
                  "Don't rely on the ghost spinner for operations where users need clear feedback",
                body: 'Ghost loading with no background is the least visually prominent loading state. For operations that meaningfully change data, use a more prominent variant so users notice the in-progress state.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'The spinner is aria-hidden — loading is communicated through aria-busy and loadingText',
                body: 'Visual subtlety does not affect screen reader behavior. aria-busy={true} and the sr-only loadingText span ensure the state is announced regardless of how subtle the spinner looks.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Ghost icon-only buttons are more common than ghost labeled buttons with icons',
                body: 'In practice, ghost labeled buttons rarely need an icon — ghost is already the lowest-prominence variant. Reserve the ghost + icon combination for toolbars where the icon aids quick scanning.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Button variant="ghost" useIcon={<Plus />} isLoading>Add</Button>`}</code>
      </pre>
    </div>
  ),
}

export const IconOnly = {
  name: 'Icon Only',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Ghost icon-only buttons are the standard pattern for toolbar action rows. No border, no fill
        at rest — the icon communicates the action. Always include{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">aria-label</code>.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">all icon sizes — ghost variant</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="ghost" size="icon-xs" useIcon aria-label="Add" />
          <Button variant="ghost" size="icon-sm" useIcon aria-label="Add" />
          <Button variant="ghost" size="icon-md" useIcon aria-label="Add" />
          <Button variant="ghost" size="icon-lg" useIcon aria-label="Add" />
          <Button variant="ghost" size="icon-xl" useIcon aria-label="Add" />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Ghost icon-only is the default choice for toolbar and table row actions',
                body: 'Rows of ghost icon buttons (Edit, Duplicate, Delete) are visually clean and let the content remain the focus. Hover reveals interactivity contextually without crowding the layout.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use ghost icon-only when users may not discover the action exists",
                body: 'Ghost buttons are invisible at rest. If users need to see available actions without hovering — like on touch devices where hover does not exist — use outline icon buttons instead.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'aria-label is required — it is the only label screen readers have',
                body: 'Ghost icon-only buttons carry no visible text. aria-label is the sole source of label information for screen readers. A console error is logged in development when it is missing.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Use size="icon-sm" in table row actions and size="icon-md" in standalone toolbars',
                body: 'icon-sm (28×28px) is appropriately compact for table row actions. icon-md (36×36px) provides a more comfortable touch target for standalone toolbars and card headers.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`import { Pencil, Trash2, Copy } from 'lucide-react'

<div className="flex gap-1">
  <Button variant="ghost" size="icon-sm" useIcon={<Pencil />} aria-label="Edit" />
  <Button variant="ghost" size="icon-sm" useIcon={<Copy />} aria-label="Duplicate" />
  <Button variant="ghost" size="icon-sm" useIcon={<Trash2 />} aria-label="Delete" />
</div>`}</code>
      </pre>
    </div>
  ),
}

export const WithIcon = {
  name: 'With Icon',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">useIcon</code> with a
        React element for a custom icon on a ghost labeled button. Use{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">iconPosition</code> to place it
        left or right.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">icon left (default)</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="ghost" size="xs" useIcon={<Plus />}>
            XSmall
          </Button>
          <Button variant="ghost" size="sm" useIcon={<Plus />}>
            Small
          </Button>
          <Button variant="ghost" size="md" useIcon={<Plus />}>
            Medium
          </Button>
          <Button variant="ghost" size="lg" useIcon={<Plus />}>
            Large
          </Button>
          <Button variant="ghost" size="xl" useIcon={<Plus />}>
            XLarge
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">icon right</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="ghost" size="xs" useIcon={<Plus />} iconPosition="right">
            XSmall
          </Button>
          <Button variant="ghost" size="sm" useIcon={<Plus />} iconPosition="right">
            Small
          </Button>
          <Button variant="ghost" size="md" useIcon={<Plus />} iconPosition="right">
            Medium
          </Button>
          <Button variant="ghost" size="lg" useIcon={<Plus />} iconPosition="right">
            Large
          </Button>
          <Button variant="ghost" size="xl" useIcon={<Plus />} iconPosition="right">
            XLarge
          </Button>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title:
                  'Use ghost labeled with icon for inline navigation or "learn more" type actions',
                body: 'Ghost labeled buttons with a ChevronRight or ExternalLink work well for secondary navigation links that should not draw significant visual attention — View all, Learn more, See details.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use ghost labeled with icon as the primary action on a page",
                body: 'Ghost is the lowest-prominence variant. A ghost button with an icon still lacks the visual weight needed to serve as a primary CTA. Use default or secondary for actions users need to notice.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Icon is aria-hidden — label must be self-explanatory without the icon',
                body: 'Screen readers announce only the label text. Avoid labels that make sense only with the icon (e.g. "→" as the label). The label should work standalone.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Ghost with icon is ideal for "View all" or "See more" links in section footers',
                body: "A ghost button with a trailing ChevronRight in a section footer is visually unobtrusive and clearly communicates secondary navigation without competing with the section's main content.",
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`import { ChevronRight } from 'lucide-react'

<Button variant="ghost" useIcon={<ChevronRight />} iconPosition="right">
  View all
</Button>`}</code>
      </pre>
    </div>
  ),
}

export const FullWidth = {
  name: 'Full Width',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">fullWidth</code> to
        stretch the ghost button to fill its container. Uncommon but useful for full-width
        expandable controls and navigation items.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">full width — w-72 container</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-72 flex flex-col gap-3">
          <Button variant="ghost" fullWidth>
            Ghost
          </Button>
          <Button variant="ghost" fullWidth useIcon={<Plus />}>
            With Icon
          </Button>
          <Button variant="ghost" fullWidth isLoading>
            Loading
          </Button>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title:
                  'Use ghost fullWidth for sidebar navigation items and collapsible section triggers',
                body: 'Sidebar menu items and accordion triggers often use full-width ghost buttons. The full-width hit area improves clickability; the ghost style keeps the UI clean without adding visual noise.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use ghost fullWidth for primary or secondary actions in forms",
                body: 'Ghost fullWidth is nearly invisible at rest on a white background. Primary and secondary form actions need the visual weight of default or secondary variants to be noticed.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'Full-width ghost buttons provide a large hit area for keyboard and touch users',
                body: 'The expanded width improves tab-focus visibility and touch target size without requiring visual design changes. The focus ring is still visible on ghost buttons.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Pair ghost fullWidth with an icon for navigation items that need scanning',
                body: 'Sidebar navigation items typically combine a leading icon with a label in a full-width ghost button. The icon aids quick scanning; the label provides clarity; the ghost style avoids visual clutter.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`import { Settings } from 'lucide-react'

<Button variant="ghost" fullWidth useIcon={<Settings />}>
  Settings
</Button>`}</code>
      </pre>
    </div>
  ),
}
