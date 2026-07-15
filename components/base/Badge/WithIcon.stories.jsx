import { Star, X, Bell, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { Badge } from './Badge'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Badge/With Icon',
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

export const IconLeft = {
  name: 'Icon Left',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          Place an icon <em>before</em> the label text. The badge base styles automatically apply{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">[&gt;svg]:size-3</code> and{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">gap-1</code> so the icon and
          label align without any extra markup.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 p-5 bg-gray-50 border border-gray-200 rounded-lg">
        <Badge variant="default">
          <CheckCircle2 />
          Active
        </Badge>
        <Badge variant="secondary">
          <Clock />
          Pending
        </Badge>
        <Badge variant="destructive">
          <AlertCircle />
          Failed
        </Badge>
        <Badge variant="outline">
          <Bell />
          Subscribed
        </Badge>
        <Badge variant="default" size="lg">
          <CheckCircle2 />
          Active
        </Badge>
        <Badge variant="secondary" size="xl">
          <Clock />
          Pending
        </Badge>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use icon-left when the icon reinforces the meaning of the label',
                body: 'CheckCircle2 before "Active", AlertCircle before "Error". The icon primes the user for the label — readers scan left-to-right so the icon lands first and identifies the badge type before the text is read.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Don\'t add icons to size="xs" badges',
                body: 'The 12px icon occupies most of the badge width at xs size and crowds the label. Use icon-left only from size="sm" upward where there is enough room for both icon and text.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'The icon should never repeat what the text already says',
                body: 'An icon and label that say the same thing create redundant announcements for screen readers. The icon reinforces; the label describes. Use aria-hidden on purely decorative icons if needed.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Prefer icon-left over icon-right for categorizing or identifying badge type',
                body: 'Icon-left makes badges scannable in lists — users identify the category (error, pending, success) by the icon shape before reading the label text.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Icon renders before label automatically via flex + gap-1 */}
<Badge variant="default">
  <CheckCircle2 />
  Active
</Badge>

<Badge variant="destructive">
  <AlertCircle />
  Failed
</Badge>`}</code>
      </pre>
    </div>
  ),
}

export const IconRight = {
  name: 'Icon Right',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          Place an icon <em>after</em> the label text. Icon-right works best for action indicators —
          a dismiss <code className="font-mono bg-gray-100 px-1 rounded text-xs">X</code>, a toggle,
          or a "saved" star — where the icon represents what happens on interaction.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 p-5 bg-gray-50 border border-gray-200 rounded-lg">
        <Badge variant="default">
          Active
          <CheckCircle2 />
        </Badge>
        <Badge variant="secondary">
          Saved
          <Star />
        </Badge>
        <Badge variant="destructive">
          Remove
          <X />
        </Badge>
        <Badge variant="outline">
          Close
          <X />
        </Badge>
        <Badge variant="secondary" size="lg">
          Dismiss
          <X />
        </Badge>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use icon-right for action affordances',
                body: 'Dismiss (X), toggle, or bookmark (Star). The label names the item; the icon names the action. Icon-right reads as "this badge has something you can do to it".',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use icon-right for purely decorative or categorizing icons",
                body: 'Put categorizing icons on the left where they reinforce meaning before the label is read. Icon-right implies an action — a decorative icon on the right creates false affordance.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'If the icon-right represents a clickable action, use asChild with a button',
                body: 'A span with onClick is not keyboard accessible. Use asChild to render the badge as a button so keyboard and screen reader users can activate it with Enter/Space and receive the correct role announcement.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'The label names the item, the icon names the action',
                body: '"Saved ★" means "this item is saved and you can un-save it". This pattern is more readable than "★ Saved" when the icon represents what happens if you click, not what the item is.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Icon renders after label */}
<Badge variant="secondary">
  Saved
  <Star />
</Badge>

<Badge variant="destructive">
  Remove
  <X />
</Badge>`}</code>
      </pre>
    </div>
  ),
}
