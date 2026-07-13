import { Plus, ArrowRight } from 'lucide-react'
import Button from './Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Button/Default',
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
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">default</code> variant is
        the primary filled button — high-contrast background, strongest visual weight. Use it for
        the single most important action on a page. Five text sizes span compact toolbars to hero
        CTAs.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">all sizes — normal state</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="default" size="xs">
            XSmall
          </Button>
          <Button variant="default" size="sm">
            Small
          </Button>
          <Button variant="default" size="md">
            Medium
          </Button>
          <Button variant="default" size="lg">
            Large
          </Button>
          <Button variant="default" size="xl">
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
                title: 'Use default for the single primary CTA per view',
                body: 'The filled background draws the most visual attention on the page. Limit to one default button per form, modal, or page section so users always know the main action.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't place multiple default buttons side by side",
                body: 'Two or more default buttons in the same context compete for attention and dilute the primary action. Pair with secondary or outline for supporting actions.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'The component defaults to type="button" to prevent accidental form submits',
                body: 'Native buttons inside a form default to type="submit". This component overrides that default. For submit buttons, always pass type="submit" explicitly so the intent is clear.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Choose size based on context density, not action importance',
                body: 'Size communicates layout context, not priority. Use md for standard UI, sm or xs for dense tables, lg or xl only for hero or landing page CTAs with meaningful copy.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Button>Save changes</Button>
<Button size="sm">Save</Button>
<Button size="lg">Continue to payment</Button>`}</code>
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
        interaction. The button renders at 50% opacity, removes pointer events, and is excluded from
        the tab order.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">all sizes — disabled state</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="default" size="xs" disabled>
            XSmall
          </Button>
          <Button variant="default" size="sm" disabled>
            Small
          </Button>
          <Button variant="default" size="md" disabled>
            Medium
          </Button>
          <Button variant="default" size="lg" disabled>
            Large
          </Button>
          <Button variant="default" size="xl" disabled>
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
                title: 'Disable when a required precondition is not yet met',
                body: 'Use disabled when the action cannot proceed — a submit button before required fields are filled, or a confirm button before the user acknowledges a warning.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't disable without a visible explanation",
                body: 'A disabled primary button with no tooltip or message leaves users confused about why the main action is unavailable. Pair with a tooltip or inline validation hint that explains the condition.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'Disabled removes focus — consider aria-disabled for discoverable unavailability',
                body: 'Native disabled excludes the button from the tab order entirely. If keyboard users need to discover why the primary action is blocked, use aria-disabled with a custom click handler that shows an explanation instead.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Prefer enabling submit and showing inline errors over permanently disabling',
                body: 'Disabling submit until all fields pass validation can frustrate users who cannot identify what is missing. Consider enabling submit and surfacing inline errors on the first attempt instead.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Button disabled>Submit</Button>`}</code>
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
        spinner and disable interaction. The spinner renders in the icon slot alongside the label —
        button width stays stable throughout.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">all sizes — loading state</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="default" size="xs" isLoading>
            XSmall
          </Button>
          <Button variant="default" size="sm" isLoading>
            Small
          </Button>
          <Button variant="default" size="md" isLoading>
            Medium
          </Button>
          <Button variant="default" size="lg" isLoading>
            Large
          </Button>
          <Button variant="default" size="xl" isLoading>
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
                title: 'Use isLoading on form submits and mutations to prevent double-submits',
                body: 'Async operations like API calls need a loading state so the user sees their action is being processed. The button is automatically disabled during loading to block duplicate requests.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use isLoading for instant synchronous actions",
                body: 'Loading implies async work. For local state changes like toggling a panel or selecting a filter, no spinner is needed — it would flash too briefly to be meaningful and may cause visual jitter.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Customize loadingText to describe the in-progress action',
                body: 'The component renders a visually-hidden span with the loadingText value. Use "Saving" for a save button, "Deleting" for a delete button — not the generic default "Loading" — so screen reader users hear the right announcement.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Keep the button label during loading to maintain width and context',
                body: 'The spinner appears in the icon slot alongside the existing label text. This keeps the button width stable and reminds users which action is in progress without layout shift.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Button isLoading loadingText="Saving">Save changes</Button>`}</code>
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
        the spinner replaces the icon in its slot — left or right depending on{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">iconPosition</code>. Button
        width stays stable.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">icon left — loading state</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="default" size="xs" useIcon={<Plus />} isLoading>
            XSmall
          </Button>
          <Button variant="default" size="sm" useIcon={<Plus />} isLoading>
            Small
          </Button>
          <Button variant="default" size="md" useIcon={<Plus />} isLoading>
            Medium
          </Button>
          <Button variant="default" size="lg" useIcon={<Plus />} isLoading>
            Large
          </Button>
          <Button variant="default" size="xl" useIcon={<Plus />} isLoading>
            XLarge
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">icon right — loading state</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="default" size="xs" useIcon={<Plus />} iconPosition="right" isLoading>
            XSmall
          </Button>
          <Button variant="default" size="sm" useIcon={<Plus />} iconPosition="right" isLoading>
            Small
          </Button>
          <Button variant="default" size="md" useIcon={<Plus />} iconPosition="right" isLoading>
            Medium
          </Button>
          <Button variant="default" size="lg" useIcon={<Plus />} iconPosition="right" isLoading>
            Large
          </Button>
          <Button variant="default" size="xl" useIcon={<Plus />} iconPosition="right" isLoading>
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
                  'Use when the normal state already has an icon — the spinner replaces it automatically',
                body: 'The spinner renders in the same slot as the icon so button width stays stable. No extra logic is needed — isLoading handles the swap.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't manually conditionalize the icon when isLoading is true",
                body: 'Passing isLoading already replaces the icon with a spinner. Conditionally hiding the icon alongside isLoading overrides built-in behavior and may cause layout shifts.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'The spinner follows iconPosition — reading order stays consistent',
                body: 'Whether the icon is left or right, the spinner appears in the same slot. Screen reader announcement order (label then state) is unaffected by icon position.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use iconPosition="right" for forward-motion actions like Continue or Next',
                body: 'Icons like ArrowRight or ChevronRight pair naturally with the right slot. The spinner then replaces that trailing icon during loading, keeping the forward-motion metaphor intact.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* spinner replaces icon on the left */}
<Button useIcon={<Plus />} isLoading>Add item</Button>

{/* spinner replaces icon on the right */}
<Button useIcon={<ArrowRight />} iconPosition="right" isLoading>
  Continue
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
        icon-only buttons. Five sizes mirror the text sizes. Always include{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">aria-label</code>.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">all icon sizes — default variant</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="default" size="icon-xs" useIcon aria-label="Add" />
          <Button variant="default" size="icon-sm" useIcon aria-label="Add" />
          <Button variant="default" size="icon-md" useIcon aria-label="Add" />
          <Button variant="default" size="icon-lg" useIcon aria-label="Add" />
          <Button variant="default" size="icon-xl" useIcon aria-label="Add" />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use default icon-only for the single standout icon action in a group',
                body: 'When one icon action is clearly the primary (e.g. an Add button at the top of a list), the filled default variant draws attention to it. Keep it to one per toolbar group.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use multiple default icon-only buttons in a toolbar row",
                body: 'A row of filled icon buttons is visually noisy and removes hierarchy. Use ghost or outline for the majority of toolbar actions; reserve default for the single primary action if one exists.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'aria-label is mandatory — a dev warning is logged when missing',
                body: 'Without aria-label, screen readers announce nothing useful. The component logs a console error in development for any icon-* size missing an aria-label. The label should describe the action, not the icon.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Match icon-* size to the surrounding text button size',
                body: 'icon-sm pairs with size sm, icon-md with size md. This keeps icon-only buttons visually aligned with adjacent labeled buttons and maintains consistent touch targets.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Button size="icon-md" useIcon aria-label="Add item" />
<Button size="icon-sm" variant="ghost" useIcon aria-label="More options" />`}</code>
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
        React element for a custom icon, or{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">useIcon={`{true}`}</code> for
        the default Plus. Control placement with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">iconPosition</code>. Icon
        sizing is automatic based on the button size.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">icon left (default)</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="default" size="xs" useIcon={<Plus />}>
            XSmall
          </Button>
          <Button variant="default" size="sm" useIcon={<Plus />}>
            Small
          </Button>
          <Button variant="default" size="md" useIcon={<Plus />}>
            Medium
          </Button>
          <Button variant="default" size="lg" useIcon={<Plus />}>
            Large
          </Button>
          <Button variant="default" size="xl" useIcon={<Plus />}>
            XLarge
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">icon right</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="default" size="xs" useIcon={<Plus />} iconPosition="right">
            XSmall
          </Button>
          <Button variant="default" size="sm" useIcon={<Plus />} iconPosition="right">
            Small
          </Button>
          <Button variant="default" size="md" useIcon={<Plus />} iconPosition="right">
            Medium
          </Button>
          <Button variant="default" size="lg" useIcon={<Plus />} iconPosition="right">
            Large
          </Button>
          <Button variant="default" size="xl" useIcon={<Plus />} iconPosition="right">
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
                title: 'Use icon left for action-reinforcing icons like Plus, Save, or Upload',
                body: 'A leading icon reinforces the action described by the label. Users scan the icon first and confirm with the label, speeding up recognition in dense UIs.',
              },
              {
                title: 'Use icon right for directional or forward-motion actions',
                body: 'ArrowRight, ChevronRight, and ExternalLink pair naturally with iconPosition="right" for actions like Continue, Next step, or Open in new tab.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't add a decorative icon that doesn't reinforce the action",
                body: 'If removing the icon does not change how users understand the action, it does not belong. Decorative icons increase visual noise without improving clarity.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Icons in labeled buttons are hidden from screen readers automatically',
                body: 'The component adds aria-hidden="true" to the icon so it is not announced redundantly. Screen readers read only the button label text.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Never pass a size class on the icon element — sizing is automatic',
                body: 'Icon size is computed from the button size prop via an internal size map. Passing size-* on the icon element will be merged via twMerge but may produce unexpected results.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`import { Plus, ArrowRight } from 'lucide-react'

{/* icon left */}
<Button useIcon={<Plus />}>Add item</Button>

{/* icon right */}
<Button useIcon={<ArrowRight />} iconPosition="right">
  Continue
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
        stretch the button to fill its container. Common in modal footers, mobile forms, and stacked
        action groups.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">stacked action group — w-72 container</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-72 flex flex-col gap-3">
          <Button variant="default" fullWidth>
            Save changes
          </Button>
          <Button variant="secondary" fullWidth>
            Cancel
          </Button>
          <Button variant="outline" fullWidth useIcon={<Plus />}>
            Add item
          </Button>
          <Button variant="default" fullWidth isLoading>
            Submitting
          </Button>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use fullWidth in modal footers and mobile forms',
                body: 'A full-width button fills a narrow container naturally and gives users a large touch target. It works well stacked with a secondary action below.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use fullWidth in wide desktop layouts without a container constraint",
                body: 'A button spanning the full desktop viewport looks unbalanced and is hard to scan. Always wrap the button group in a constrained container (max-w-sm, w-72) when using fullWidth.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Full-width buttons exceed the WCAG 44px touch target minimum on mobile',
                body: 'WCAG 2.5.5 recommends a minimum 44×44px touch target. A full-width button in a modal or bottom sheet far exceeds this, improving accessibility for all touch users.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Stack primary above secondary in full-width groups',
                body: 'Place the primary action (default) on top and the secondary or cancel below. This matches natural reading order and ensures the main action is seen first.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<div className="flex flex-col gap-2">
  <Button fullWidth isLoading={isSubmitting}>
    Save changes
  </Button>
  <Button variant="secondary" fullWidth onClick={onCancel}>
    Cancel
  </Button>
</div>`}</code>
      </pre>
    </div>
  ),
}
