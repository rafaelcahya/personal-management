import { Plus, ArrowRight } from 'lucide-react'
import Button from './Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Button/Secondary',
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
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">secondary</code> variant is
        the supporting action button — muted fill, lower visual weight than default. Use it
        alongside a primary action to offer an alternative like Cancel, Back, or Save Draft.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">all sizes — normal state</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="secondary" size="xs">
            XSmall
          </Button>
          <Button variant="secondary" size="sm">
            Small
          </Button>
          <Button variant="secondary" size="md">
            Medium
          </Button>
          <Button variant="secondary" size="lg">
            Large
          </Button>
          <Button variant="secondary" size="xl">
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
                title: 'Use secondary paired with a default button for supporting actions',
                body: 'Secondary is designed to sit next to the primary action — Cancel beside Save, Back beside Continue, or Discard beside Submit. The contrast in visual weight reinforces the hierarchy between primary and supporting actions.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use secondary as the only button when a primary action exists",
                body: 'Secondary alone carries insufficient visual weight to serve as the main CTA. If there is a primary action on the page, it should use the default variant. Secondary should always support a primary, not replace it.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Ensure the secondary button label clearly describes its action',
                body: 'Labels like "Cancel" and "Back" are unambiguous. Avoid generic labels like "No" or "Other" that do not tell users what will happen when they click.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Place secondary to the right of or below the primary button',
                body: 'In horizontal button groups, the primary action goes on the left; secondary on the right. In stacked groups (mobile, modal footer), primary goes on top, secondary below — matching the natural reading and action priority order.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<div className="flex gap-3">
  <Button>Save changes</Button>
  <Button variant="secondary">Cancel</Button>
</div>`}</code>
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
        interaction. The secondary variant at 50% opacity can appear very faint — pair with a
        tooltip or message to explain the unavailability.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">all sizes — disabled state</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="secondary" size="xs" disabled>
            XSmall
          </Button>
          <Button variant="secondary" size="sm" disabled>
            Small
          </Button>
          <Button variant="secondary" size="md" disabled>
            Medium
          </Button>
          <Button variant="secondary" size="lg" disabled>
            Large
          </Button>
          <Button variant="secondary" size="xl" disabled>
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
                  'Disable secondary when the supporting action is also blocked by a precondition',
                body: 'If both primary and secondary actions share a precondition (e.g. you must select an item before either Save or Discard are meaningful), disabling both communicates clearly that neither is available yet.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't disable Cancel or Back — those actions should always be available",
                body: 'Navigation and escape actions (Cancel, Back, Close) should almost never be disabled. Users need a way to exit. Disabling escape routes traps users in a state they cannot leave.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'A disabled secondary at 50% opacity can be hard to distinguish from a ghost button',
                body: 'The faded appearance of a disabled secondary can look similar to a ghost button at rest. Ensure there is sufficient contrast difference or add a tooltip explaining the state.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'If only the primary is blocked, keep the secondary enabled',
                body: "Disabled state should reflect the button's own preconditions, not the state of the primary action. Cancel is always valid even when Save is not.",
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Button variant="secondary" disabled>Save Draft</Button>`}</code>
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
        spinner and disable interaction. Useful for secondary async actions like Save Draft, Send
        for Review, or Export.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">all sizes — loading state</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="secondary" size="xs" isLoading>
            XSmall
          </Button>
          <Button variant="secondary" size="sm" isLoading>
            Small
          </Button>
          <Button variant="secondary" size="md" isLoading>
            Medium
          </Button>
          <Button variant="secondary" size="lg" isLoading>
            Large
          </Button>
          <Button variant="secondary" size="xl" isLoading>
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
                title: 'Use isLoading on secondary async actions like Save Draft or Export',
                body: 'Secondary actions can trigger async work independently of the primary. Save Draft, Export to CSV, or Send for Review are common secondary async patterns that benefit from a loading state.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't keep secondary loading after the primary has already completed",
                body: 'If the primary action succeeds and navigates away, leftover loading state on the secondary creates confusion. Clear all button states together when the operation resolves.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Set loadingText specific to the secondary action',
                body: 'Pass loadingText="Saving draft" on a Save Draft button so screen reader users know it is the draft being saved, not the main submission. Distinguishing concurrent loading states matters.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Disable the primary button while the secondary is loading if they share a resource',
                body: 'If Save Draft and Submit both write to the same record, disable Submit while Save Draft is in progress to prevent conflicting concurrent writes.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Button variant="secondary" isLoading loadingText="Saving draft">
  Save Draft
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
        the spinner replaces the icon in its slot. The secondary variant keeps its muted fill while
        loading.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">icon left — loading state</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="secondary" size="xs" useIcon={<Plus />} isLoading>
            XSmall
          </Button>
          <Button variant="secondary" size="sm" useIcon={<Plus />} isLoading>
            Small
          </Button>
          <Button variant="secondary" size="md" useIcon={<Plus />} isLoading>
            Medium
          </Button>
          <Button variant="secondary" size="lg" useIcon={<Plus />} isLoading>
            Large
          </Button>
          <Button variant="secondary" size="xl" useIcon={<Plus />} isLoading>
            XLarge
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">icon right — loading state</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="secondary" size="xs" useIcon={<Plus />} iconPosition="right" isLoading>
            XSmall
          </Button>
          <Button variant="secondary" size="sm" useIcon={<Plus />} iconPosition="right" isLoading>
            Small
          </Button>
          <Button variant="secondary" size="md" useIcon={<Plus />} iconPosition="right" isLoading>
            Medium
          </Button>
          <Button variant="secondary" size="lg" useIcon={<Plus />} iconPosition="right" isLoading>
            Large
          </Button>
          <Button variant="secondary" size="xl" useIcon={<Plus />} iconPosition="right" isLoading>
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
                title: 'Spinner replaces the icon in-place — no layout shift',
                body: 'The component swaps the icon for the spinner automatically. The button width is preserved because the spinner occupies the same slot the icon did.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't manually handle the icon swap — let isLoading do it",
                body: 'Conditionally hiding the icon alongside isLoading creates duplicate logic. Pass isLoading and the component handles the rest.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Screen reader order is unaffected by icon position',
                body: 'The spinner renders in the same DOM slot as the icon. The label and aria-busy state are announced regardless of whether iconPosition is left or right.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Secondary icons work best with contextual actions — Save, Export, Download',
                body: 'Icons on secondary buttons should reinforce the supporting action. Save, Download, or Export icons communicate the nature of the secondary work at a glance.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Button variant="secondary" useIcon={<Plus />} isLoading>
  Save Draft
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
        icon-only secondary buttons. Always include{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">aria-label</code>.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">all icon sizes — secondary variant</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="secondary" size="icon-xs" useIcon aria-label="Add" />
          <Button variant="secondary" size="icon-sm" useIcon aria-label="Add" />
          <Button variant="secondary" size="icon-md" useIcon aria-label="Add" />
          <Button variant="secondary" size="icon-lg" useIcon aria-label="Add" />
          <Button variant="secondary" size="icon-xl" useIcon aria-label="Add" />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title:
                  'Use secondary icon-only when the action is supportive but needs more prominence than ghost',
                body: 'Secondary icon buttons carry more visual weight than ghost, making them suitable for secondary toolbar actions that should be visible but not compete with the primary icon button.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title:
                  "Don't use secondary icon-only in the same group as a default icon button without clear visual hierarchy",
                body: 'Mixing default and secondary icon-only buttons is fine, but keep the hierarchy clear — one default, the rest secondary or ghost — so users can identify the primary action quickly.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'aria-label is required for every icon-only button regardless of variant',
                body: 'Screen readers cannot infer intent from an icon. Always describe the action: "Duplicate item", "Move up", "Mark as complete" — not the icon shape.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Consider ghost instead when visual density is high',
                body: 'In toolbars with many icon actions, ghost icon buttons reduce visual noise. Reserve secondary for actions that should remain visible even in idle state.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Button variant="secondary" size="icon-md" useIcon aria-label="Duplicate" />`}</code>
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
          <Button variant="secondary" size="xs" useIcon={<Plus />}>
            XSmall
          </Button>
          <Button variant="secondary" size="sm" useIcon={<Plus />}>
            Small
          </Button>
          <Button variant="secondary" size="md" useIcon={<Plus />}>
            Medium
          </Button>
          <Button variant="secondary" size="lg" useIcon={<Plus />}>
            Large
          </Button>
          <Button variant="secondary" size="xl" useIcon={<Plus />}>
            XLarge
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">icon right</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="secondary" size="xs" useIcon={<Plus />} iconPosition="right">
            XSmall
          </Button>
          <Button variant="secondary" size="sm" useIcon={<Plus />} iconPosition="right">
            Small
          </Button>
          <Button variant="secondary" size="md" useIcon={<Plus />} iconPosition="right">
            Medium
          </Button>
          <Button variant="secondary" size="lg" useIcon={<Plus />} iconPosition="right">
            Large
          </Button>
          <Button variant="secondary" size="xl" useIcon={<Plus />} iconPosition="right">
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
                title: 'Use icons on secondary buttons to reinforce a supporting action',
                body: 'Icons like Save, Export, or Back help users scan secondary actions quickly in dense layouts. They are especially useful when secondary buttons appear alongside a primary button with a different icon.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title:
                  "Don't use the same icon on both primary and secondary buttons in the same group",
                body: 'Identical icons on adjacent buttons make it harder to distinguish actions at a glance. Use different icons or omit the icon from the secondary button.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Icons in labeled buttons are hidden from screen readers automatically',
                body: 'The component adds aria-hidden="true" to the icon element. Screen readers announce only the button label, so the icon never creates duplicate or confusing announcements.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use iconPosition="right" with ArrowRight for Back/Continue pairs',
                body: 'When a secondary "Back" button has a left arrow and the primary "Continue" has a right arrow, the icons visually reinforce the direction of movement.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`import { ArrowLeft, ArrowRight } from 'lucide-react'

<Button variant="secondary" useIcon={<ArrowLeft />}>Back</Button>
<Button useIcon={<ArrowRight />} iconPosition="right">Continue</Button>`}</code>
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
        stretch the secondary button to fill its container. Most commonly appears below the primary
        action in stacked mobile or modal layouts.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">stacked action group — w-72 container</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-72 flex flex-col gap-3">
          <Button variant="secondary" fullWidth>
            Secondary
          </Button>
          <Button variant="secondary" fullWidth useIcon={<Plus />}>
            With Icon
          </Button>
          <Button variant="secondary" fullWidth isLoading>
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
                  'Use secondary fullWidth directly below the primary in stacked button groups',
                body: 'In modal footers and mobile layouts, a full-width secondary Cancel or Back below the full-width primary is the standard pattern. It gives equal tap target width while maintaining visual hierarchy through the variant difference.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use a standalone full-width secondary with no accompanying primary",
                body: "Secondary fullWidth without a primary button signals that this is the main action, which contradicts the secondary variant's intent. Add a primary button or switch to the default variant.",
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Stacked full-width buttons maintain logical DOM order — primary first',
                body: 'Screen readers encounter buttons in DOM order. Place the primary action first in the DOM so keyboard users reach it before the secondary, matching visual reading order.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Wrap the button group in a max-width container when inside a wide layout',
                body: 'fullWidth stretches to the container, not the viewport. Wrap both buttons in a constrained div (max-w-sm, w-72) to keep the group appropriately sized on desktop.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<div className="flex flex-col gap-2">
  <Button fullWidth>Confirm</Button>
  <Button variant="secondary" fullWidth onClick={onClose}>
    Cancel
  </Button>
</div>`}</code>
      </pre>
    </div>
  ),
}
