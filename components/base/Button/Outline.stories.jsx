import { Plus, ArrowRight } from 'lucide-react'
import Button from './Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Button/Outline',
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
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">outline</code> variant uses
        a violet border and transparent background. It sits between ghost (no border, invisible at
        rest) and secondary (filled) — visible without demanding attention.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">all sizes — normal state</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="outline" size="xs">
            XSmall
          </Button>
          <Button variant="outline" size="sm">
            Small
          </Button>
          <Button variant="outline" size="md">
            Medium
          </Button>
          <Button variant="outline" size="lg">
            Large
          </Button>
          <Button variant="outline" size="xl">
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
                title: 'Use outline for tertiary actions that need more visibility than ghost',
                body: 'Outline is ideal for supplementary CTAs — Export, Preview, View details — where the action matters but should not compete with a filled primary. The border keeps the button visible without the visual weight of a fill.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title:
                  "Don't use outline as the primary CTA when a default or secondary would be more appropriate",
                body: 'Outline lacks the visual weight to carry a primary action. Users scanning for the main action may overlook it in favor of a filled button elsewhere on the page.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'The violet border provides sufficient contrast against white and light gray backgrounds',
                body: 'Outline uses a violet-200 border at rest. On white (bg-white) or light gray (bg-gray-50) backgrounds, this meets WCAG 1.4.11 Non-text Contrast. Avoid placing it on dark or saturated backgrounds where the border may be lost.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Pair outline with default in the same group for primary + tertiary hierarchy',
                body: 'When a primary (default) and a tertiary action exist together, outline communicates the tertiary level clearly without the full suppression of ghost. Example: Save (default) + Preview (outline) + Cancel (ghost).',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Button variant="outline">Preview</Button>
<Button variant="outline">Export</Button>`}</code>
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
        interaction. At 50% opacity, the outline border becomes faint — ensure the unavailable state
        is still understandable from context.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">all sizes — disabled state</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="outline" size="xs" disabled>
            XSmall
          </Button>
          <Button variant="outline" size="sm" disabled>
            Small
          </Button>
          <Button variant="outline" size="md" disabled>
            Medium
          </Button>
          <Button variant="outline" size="lg" disabled>
            Large
          </Button>
          <Button variant="outline" size="xl" disabled>
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
                title: 'Disable when the tertiary action is gated on a precondition',
                body: 'If Preview or Export requires data that is not yet available (e.g. unsaved form, empty selection), disabling the outline button communicates this clearly without removing it from the layout.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't rely on the faded border alone to communicate unavailability",
                body: 'The outline variant at 50% opacity has a very light border that can blend into the background. Pair with a tooltip that explains the condition so users are not left guessing.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'At 50% opacity, the outline border may fail WCAG 1.4.11 contrast',
                body: 'A faded border on a light background may not meet Non-text Contrast requirements. If the disabled state is meaningful to communicate (not just aesthetic), consider an aria-disabled approach with a visible reason instead.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use a tooltip on the disabled outline button to explain why',
                body: 'Wrap the disabled outline button in a Tooltip with a short message: "Select items first" or "Save your changes before exporting." This removes ambiguity without cluttering the UI.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Button variant="outline" disabled>Export</Button>`}</code>
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
        spinner and disable interaction. The outline border remains visible during loading, keeping
        the button visually anchored.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">all sizes — loading state</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="outline" size="xs" isLoading>
            XSmall
          </Button>
          <Button variant="outline" size="sm" isLoading>
            Small
          </Button>
          <Button variant="outline" size="md" isLoading>
            Medium
          </Button>
          <Button variant="outline" size="lg" isLoading>
            Large
          </Button>
          <Button variant="outline" size="xl" isLoading>
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
                  'Use outline loading for tertiary async operations like export or preview generation',
                body: 'Export to CSV, Generate preview, and Refresh data are typical outline-level async actions. The loading state prevents re-triggering while the operation runs.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use outline loading for the primary submit action",
                body: 'Form submits and primary mutations belong on the default variant. If the most important async action on the page is in an outline button, reconsider the variant hierarchy.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'The aria-busy attribute is set automatically during isLoading',
                body: 'The component sets aria-busy={true} while isLoading is active. Assistive technologies use this to indicate the element is updating. The loadingText sr-only span also announces the in-progress state.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Keep the label during outline loading so the layout does not shift',
                body: 'The spinner appears in the icon slot to the left of the label. Keeping the label text visible during loading prevents the button from shrinking and maintains layout stability.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Button variant="outline" isLoading loadingText="Exporting">
  Export
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
        the spinner replaces the icon in its slot. The outline border stays visible throughout.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">icon left — loading state</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="outline" size="xs" useIcon={<Plus />} isLoading>
            XSmall
          </Button>
          <Button variant="outline" size="sm" useIcon={<Plus />} isLoading>
            Small
          </Button>
          <Button variant="outline" size="md" useIcon={<Plus />} isLoading>
            Medium
          </Button>
          <Button variant="outline" size="lg" useIcon={<Plus />} isLoading>
            Large
          </Button>
          <Button variant="outline" size="xl" useIcon={<Plus />} isLoading>
            XLarge
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">icon right — loading state</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="outline" size="xs" useIcon={<Plus />} iconPosition="right" isLoading>
            XSmall
          </Button>
          <Button variant="outline" size="sm" useIcon={<Plus />} iconPosition="right" isLoading>
            Small
          </Button>
          <Button variant="outline" size="md" useIcon={<Plus />} iconPosition="right" isLoading>
            Medium
          </Button>
          <Button variant="outline" size="lg" useIcon={<Plus />} iconPosition="right" isLoading>
            Large
          </Button>
          <Button variant="outline" size="xl" useIcon={<Plus />} iconPosition="right" isLoading>
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
                title: 'Let the component handle the icon-to-spinner swap — no manual logic needed',
                body: 'isLoading replaces the icon automatically. The button width stays stable because the spinner occupies the same slot the icon did.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't add a conditional icon render on top of isLoading",
                body: 'useIcon={!isLoading && <Plus />} is redundant. isLoading already handles the swap. Adding your own condition may produce a slot-less loading state that shifts the button width.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'Spinner and icon share the same aria-hidden attribute — neither is announced',
                body: 'Both the icon and the spinner carry aria-hidden="true". The only loading announcement comes from aria-busy and the sr-only loadingText span.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Export and Download icons work well on outline loading buttons',
                body: 'Outline is common for data-export actions. Using Download, FileDown, or similar icons in the normal state makes the loading swap feel natural — the spinner replaces the icon while the file is generating.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`import { Download } from 'lucide-react'

<Button variant="outline" useIcon={<Download />} isLoading loadingText="Exporting">
  Export CSV
</Button>`}</code>
      </pre>
    </div>
  ),
}

export const IconOnly = {
  name: 'Icon Only',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Use <code className="font-mono bg-gray-100 px-1 rounded text-xs">size="icon-*"</code> with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">useIcon</code> for square
        outline icon-only buttons. The border keeps them visible without a fill. Always include{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">aria-label</code>.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">all icon sizes — outline variant</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="outline" size="icon-xs" useIcon aria-label="Add" />
          <Button variant="outline" size="icon-sm" useIcon aria-label="Add" />
          <Button variant="outline" size="icon-md" useIcon aria-label="Add" />
          <Button variant="outline" size="icon-lg" useIcon aria-label="Add" />
          <Button variant="outline" size="icon-xl" useIcon aria-label="Add" />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title:
                  'Use outline icon-only when the action needs a visible boundary without a fill',
                body: 'Outline icon buttons are ideal for actions that sit near form fields or other bordered elements where a filled icon button would look too heavy.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use outline icon-only in toolbar rows where ghost is sufficient",
                body: 'In dense toolbars, ghost icon buttons reduce visual noise better than outline. Use outline only when the icon action needs to remain visible at rest without hovering.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'aria-label must describe the action, not the icon',
                body: '"Edit item" is correct. "Pencil icon" is not. Screen readers should convey what the button does, not what it looks like.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Outline icon buttons pair naturally with form inputs',
                body: "An outline icon button next to a text field (like a search icon or calendar toggle) visually matches the field's border style, creating a cohesive input group appearance.",
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Button variant="outline" size="icon-md" useIcon aria-label="Edit item" />`}</code>
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
        React element for a custom icon. Use{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">iconPosition</code> to place it
        left or right. Icon sizing is automatic.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">icon left (default)</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="outline" size="xs" useIcon={<Plus />}>
            XSmall
          </Button>
          <Button variant="outline" size="sm" useIcon={<Plus />}>
            Small
          </Button>
          <Button variant="outline" size="md" useIcon={<Plus />}>
            Medium
          </Button>
          <Button variant="outline" size="lg" useIcon={<Plus />}>
            Large
          </Button>
          <Button variant="outline" size="xl" useIcon={<Plus />}>
            XLarge
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">icon right</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="outline" size="xs" useIcon={<Plus />} iconPosition="right">
            XSmall
          </Button>
          <Button variant="outline" size="sm" useIcon={<Plus />} iconPosition="right">
            Small
          </Button>
          <Button variant="outline" size="md" useIcon={<Plus />} iconPosition="right">
            Medium
          </Button>
          <Button variant="outline" size="lg" useIcon={<Plus />} iconPosition="right">
            Large
          </Button>
          <Button variant="outline" size="xl" useIcon={<Plus />} iconPosition="right">
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
                  'Use outline with icon for tertiary actions that benefit from visual scanning',
                body: 'Download, Export, Preview, or Refresh icons help users identify outline actions at a glance in action-dense UIs. The icon adds recognition without the variant becoming visually dominant.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use the same icon on outline and default buttons in the same group",
                body: 'When two adjacent buttons share an icon, users must read the label to distinguish them. Use distinct icons — or omit the icon from the outline button — to make each action instantly identifiable.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Icons in labeled buttons are aria-hidden and not announced',
                body: 'The icon is hidden from screen readers; only the label is announced. Ensure the label text is self-explanatory without the icon.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use outline with icon for actions in card headers and section toolbars',
                body: 'Outline icon buttons in card headers (Edit, Refresh, More) are visually bounded without looking as heavy as a filled button, keeping the card content as the visual focus.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`import { Download, RefreshCw } from 'lucide-react'

<Button variant="outline" useIcon={<Download />}>Export</Button>
<Button variant="outline" useIcon={<RefreshCw />}>Refresh</Button>`}</code>
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
        stretch the outline button to fill its container. The visible border helps it read as a
        distinct button even at full width.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">full width — w-72 container</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-72 flex flex-col gap-3">
          <Button variant="outline" fullWidth>
            Outline
          </Button>
          <Button variant="outline" fullWidth useIcon={<Plus />}>
            With Icon
          </Button>
          <Button variant="outline" fullWidth isLoading>
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
                  'Use outline fullWidth for add-another or expand actions at the bottom of a list',
                body: 'A full-width outline button below a list of items is a common pattern for "+ Add another item" or "Load more". The border makes it clearly interactive without competing with the list content above.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use outline fullWidth as the primary submit in a form footer",
                body: 'Outline lacks the visual weight to serve as the main form submission. Use the default variant for the primary submit action; outline can appear below it as a secondary option.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Full-width buttons meet WCAG touch target requirements easily',
                body: 'Any full-width button in a normal layout exceeds the 44px minimum height at md size (32px) when combined with surrounding padding. Use at least size="md" (36px) for full-width touch targets.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Add a dashed border style via className for "add item" affordance',
                body: 'For list expansion actions, a dashed border communicates a placeholder or additive intent: className="border-dashed". The outline variant\'s transparent background makes this look natural.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Button variant="outline" fullWidth useIcon={<Plus />} className="border-dashed">
  Add another item
</Button>`}</code>
      </pre>
    </div>
  ),
}
