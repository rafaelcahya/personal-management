import { Plus, ArrowRight, ExternalLink } from 'lucide-react'
import Button from './Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Button/Link',
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
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">link</code> variant looks
        like a hyperlink — no background, no border, underline on hover and focus. Use it for inline
        navigation actions that should look like text links but fire a button handler.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">all sizes — normal state</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="link" size="xs">
            XSmall
          </Button>
          <Button variant="link" size="sm">
            Small
          </Button>
          <Button variant="link" size="md">
            Medium
          </Button>
          <Button variant="link" size="lg">
            Large
          </Button>
          <Button variant="link" size="xl">
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
                title: 'Use link for inline navigation that should look like a text hyperlink',
                body: 'In body copy or form help text, a link-variant button blends with surrounding text while remaining focusable and interactive. Use it for "View details", "Learn more", or "Forgot password?" in context.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use link for actions that trigger a mutation",
                body: "Link variant implies navigation. For actions that write data (save, delete, submit), use a filled or outlined variant that communicates consequence. Link's appearance creates no sense of irreversibility.",
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Prefer asChild with Next.js Link for actual route navigation',
                body: 'If the action navigates to a new route, use asChild with Next.js Link to preserve anchor semantics. variant="link" as a plain button works for onClick handlers; for real navigation, <a> semantics matter.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Match the link button size to the surrounding text size',
                body: 'A link variant button inside body copy should match the text size of the surrounding paragraph. Use size="sm" inside small text, size="md" inside normal body text.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Button variant="link">View details</Button>
<Button variant="link" size="sm">Learn more</Button>`}</code>
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
        interaction. A disabled link variant at 50% opacity looks like faded text — always pair with
        surrounding context that explains why the link is unavailable.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">all sizes — disabled state</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="link" size="xs" disabled>
            XSmall
          </Button>
          <Button variant="link" size="sm" disabled>
            Small
          </Button>
          <Button variant="link" size="md" disabled>
            Medium
          </Button>
          <Button variant="link" size="lg" disabled>
            Large
          </Button>
          <Button variant="link" size="xl" disabled>
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
                title: 'Use disabled link when navigation is blocked by a permission or state',
                body: 'A "View report" link that is unavailable because the report has not been generated yet is a valid disabled link use case. The disabled state signals the link will become available once the condition is met.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use disabled link for items that should simply be hidden",
                body: 'If the link is not contextually relevant at all (not just temporarily unavailable), hide it rather than disabling it. A faded link that does nothing is more confusing than no link.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'Disabled link text at 50% opacity may fail WCAG 1.4.3 contrast for active content',
                body: 'WCAG exempts disabled controls from contrast requirements, but users may still try to read faded link text. Provide a tooltip or nearby text that explains why the link is unavailable.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use a tooltip on the disabled link to explain the unavailability',
                body: 'Wrap the disabled link button in a Tooltip: "Report not yet generated" or "Select a date range first". This removes the guesswork without cluttering the layout.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Button variant="link" disabled>View report</Button>`}</code>
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
        React element to add an icon to a link button. Trailing icons like{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">ArrowRight</code> or{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">ExternalLink</code> are most
        common.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">icon left (default)</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="link" size="xs" useIcon={<Plus />}>
            XSmall
          </Button>
          <Button variant="link" size="sm" useIcon={<Plus />}>
            Small
          </Button>
          <Button variant="link" size="md" useIcon={<Plus />}>
            Medium
          </Button>
          <Button variant="link" size="lg" useIcon={<Plus />}>
            Large
          </Button>
          <Button variant="link" size="xl" useIcon={<Plus />}>
            XLarge
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">icon right</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="link" size="xs" useIcon={<Plus />} iconPosition="right">
            XSmall
          </Button>
          <Button variant="link" size="sm" useIcon={<Plus />} iconPosition="right">
            Small
          </Button>
          <Button variant="link" size="md" useIcon={<Plus />} iconPosition="right">
            Medium
          </Button>
          <Button variant="link" size="lg" useIcon={<Plus />} iconPosition="right">
            Large
          </Button>
          <Button variant="link" size="xl" useIcon={<Plus />} iconPosition="right">
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
                title: 'Use ArrowRight or ExternalLink trailing icons to signal navigation intent',
                body: 'A trailing ArrowRight on "View all" or "See details" reinforces that clicking opens a new view. An ExternalLink icon on "Open in new tab" signals that the destination is outside the current app.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use action icons (Plus, Save) on a link variant button",
                body: 'Action icons imply mutation or creation; link variant implies navigation. Pairing a Plus icon with link creates a visual contradiction. Use the default or outline variant for creation actions.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'ExternalLink icon does not replace text indicating the destination opens externally',
                body: 'Screen readers do not announce the ExternalLink icon (it is aria-hidden). If opening in a new tab matters for accessibility context (disorienting for screen reader users), add "(opens in new tab)" to the label or an sr-only span.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Prefer iconPosition="right" for link variant — it mimics hyperlink convention',
                body: 'Web hyperlinks conventionally show trailing icons (arrow, external link). A trailing icon on a link-variant button looks more natural and matches the pattern users expect from text links.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`import { ArrowRight, ExternalLink } from 'lucide-react'

<Button variant="link" useIcon={<ArrowRight />} iconPosition="right">
  View all transactions
</Button>

<Button variant="link" useIcon={<ExternalLink />} iconPosition="right">
  Open docs
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
        stretch the link button to fill its container. Uncommon but useful for navigation items that
        span a full panel width.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">full width — w-72 container</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-72 flex flex-col gap-3">
          <Button variant="link" fullWidth>
            Link
          </Button>
          <Button variant="link" fullWidth useIcon={<Plus />}>
            With Icon
          </Button>
          <Button variant="link" fullWidth disabled>
            Disabled
          </Button>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use fullWidth link for navigation items in narrow panels or drawers',
                body: 'A full-width link button in a side panel or drawer gives users a wide tap target for navigation without the visual noise of a filled or bordered button.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use fullWidth link as a form submit or primary action",
                body: 'A full-width link button looks like a navigation row, not an action button. Users may not perceive it as the primary way to submit or confirm. Use default fullWidth for primary form actions.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'Full-width link buttons benefit from a visible focus ring for keyboard navigation',
                body: 'The link variant shows a focus ring (violet ring via focus-visible). In a list of full-width link buttons, the focused item is clearly identifiable via keyboard navigation.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Ghost fullWidth is often a better choice than link fullWidth for navigation items',
                body: 'Ghost provides a hover background that link does not. For navigation items where the hover state should be visible across the full width, ghost fullWidth feels more interactive than link fullWidth.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Button variant="link" fullWidth>View all items</Button>`}</code>
      </pre>
    </div>
  ),
}
