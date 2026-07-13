import { Badge } from './Badge'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Badge/Variant',
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

export const Default = {
  name: 'Default',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant="default"</code> is
          the primary emphasis style — dark background, white text. Use it for active states,
          success outcomes, or the primary category label.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 p-5 bg-gray-50 border border-gray-200 rounded-lg">
        <Badge variant="default">Active</Badge>
        <Badge variant="default">Published</Badge>
        <Badge variant="default">New</Badge>
        <Badge variant="default">Live</Badge>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use default for positive or active states',
                body: '"Active", "Published", "Live". It draws the most attention of all four variants, so reserve it for the highest-priority status in a list or table.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use default for neutral or low-emphasis labels",
                body: "Use secondary or outline instead. If everything uses default, the high-contrast style loses its meaning and users can no longer scan for what's important.",
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Default has the highest visual contrast — ensure the label is descriptive',
                body: 'The dark background makes the badge stand out, but the label must carry the meaning. Don\'t rely on position alone — "Active" is more scannable than "Yes" or "On".',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Pair with CheckCircle2 to reinforce success or verified states',
                body: 'An icon before the label lets users identify the state by shape before reading the text — especially useful in dense tables where users scan rows quickly.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Badge variant="default">Active</Badge>
<Badge variant="default">Published</Badge>
<Badge variant="default">New</Badge>`}</code>
      </pre>
    </div>
  ),
}

export const Secondary = {
  name: 'Secondary',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant="secondary"</code>{' '}
          uses a muted background with subdued text. It signals low emphasis — neutral states,
          drafts, beta labels, or supplemental metadata.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 p-5 bg-gray-50 border border-gray-200 rounded-lg">
        <Badge variant="secondary">Draft</Badge>
        <Badge variant="secondary">Archived</Badge>
        <Badge variant="secondary">Beta</Badge>
        <Badge variant="secondary">Internal</Badge>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use secondary for neutral or informational labels',
                body: 'Drafts, archived items, supplemental tags — states that exist but don\'t need to grab attention. Secondary is the "quiet" variant that stays out of the way.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Avoid secondary for anything requiring immediate attention',
                body: 'The muted style gets lost in busy UIs. Use default or destructive when the state needs to be noticed. Secondary for a critical warning will be missed.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Secondary has low contrast by design — verify readability',
                body: 'The muted text-on-muted-background combination can fail WCAG AA on some backgrounds. Check contrast in context, especially when the badge sits on a colored card or dark surface.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Pair with Clock or Archive icons to reinforce the inactive context',
                body: 'An icon makes the "pending" or "archived" state recognizable at a glance without needing to read the label — useful when scanning a list of items with mixed statuses.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Badge variant="secondary">Draft</Badge>
<Badge variant="secondary">Archived</Badge>
<Badge variant="secondary">Beta</Badge>`}</code>
      </pre>
    </div>
  ),
}

export const Destructive = {
  name: 'Destructive',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant="destructive"</code>{' '}
          uses a red background to signal danger, failure, or critical warnings. It carries the
          highest visual weight of all four variants.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 p-5 bg-gray-50 border border-gray-200 rounded-lg">
        <Badge variant="destructive">Error</Badge>
        <Badge variant="destructive">Failed</Badge>
        <Badge variant="destructive">Expired</Badge>
        <Badge variant="destructive">Critical</Badge>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use destructive for genuine errors, failures, or expiry states',
                body: 'API errors, failed uploads, expired sessions, critical system warnings. The red background has immediate emotional weight — users stop and read it.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use destructive for warnings or cautions",
                body: "Warnings don't warrant red. Overusing destructive trains users to ignore it, defeating its purpose when a real error appears. Use secondary with an amber icon for mid-level alerts.",
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Never rely on the red color alone to convey the error',
                body: 'Users with color blindness cannot distinguish red from other colors. Always pair destructive with an error label text ("Error", "Failed") and an icon (AlertCircle) for non-visual identification.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Pair with AlertCircle or X icons for instant scannability',
                body: 'An icon makes the error state identifiable by shape before the user reads the label — critical in data-dense tables where users need to spot failures quickly across many rows.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Badge variant="destructive">Error</Badge>
<Badge variant="destructive">Failed</Badge>
<Badge variant="destructive">Expired</Badge>`}</code>
      </pre>
    </div>
  ),
}

export const Outline = {
  name: 'Outline',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant="outline"</code>{' '}
          renders with only a border and no background fill. It has the lowest visual weight — ideal
          for optional labels, pending states, or tags that should not compete with content.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 p-5 bg-gray-50 border border-gray-200 rounded-lg">
        <Badge variant="outline">Pending</Badge>
        <Badge variant="outline">Review</Badge>
        <Badge variant="outline">Optional</Badge>
        <Badge variant="outline">Tag</Badge>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use outline for labels that exist but should not demand attention',
                body: 'Pending reviews, optional tags, supplemental category labels. Outline is the quietest variant — it communicates without competing with the primary content around it.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Avoid outline when the status is important and time-sensitive',
                body: 'Its low contrast can cause users to miss it entirely in a busy layout. Use default or destructive when the badge must be noticed. Outline for an overdue deadline will be overlooked.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Verify outline contrast on non-white backgrounds',
                body: 'The border-only style has minimal visual weight and may disappear on colored or dark card surfaces. Test in context — consider switching to secondary if the outline is hard to see.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Pair with radius="md" or radius="sm" for a tag-chip look',
                body: 'Outline with rounded corners (not full-pill) reads as a filterable tag chip rather than a status badge. This distinction helps users understand that a tag represents a category, not a state.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Badge variant="outline">Pending</Badge>
<Badge variant="outline">Review</Badge>
<Badge variant="outline">Optional</Badge>`}</code>
      </pre>
    </div>
  ),
}
