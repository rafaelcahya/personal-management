import { Avatar, AvatarImage, AvatarFallback } from './Avatar'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Avatar/Basic',
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

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          Compose <code className="font-mono bg-gray-100 px-1 rounded text-xs">Avatar</code>,{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">AvatarImage</code>, and{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">AvatarFallback</code>{' '}
          together.{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">AvatarFallback</code> is
          always rendered behind the image (z-0) and becomes visible automatically when the image is
          absent or fails to load — no extra state needed.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-8 p-5 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex flex-col items-center gap-2">
          <Avatar size="lg">
            <AvatarImage src="https://i.pravatar.cc/150?img=12" alt="User" />
            <AvatarFallback>RC</AvatarFallback>
          </Avatar>
          <span className="text-[10px] text-gray-400">with image</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Avatar size="lg">
            <AvatarFallback>CA</AvatarFallback>
          </Avatar>
          <span className="text-[10px] text-gray-400">initials only</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Avatar size="lg">
            <AvatarImage src="https://broken.example/avatar.jpg" alt="Broken" />
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <span className="text-[10px] text-gray-400">broken → fallback</span>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use when you need a user identity element with automatic fallback',
                body: 'AvatarFallback renders behind the image (z-0) and becomes visible automatically when the image is absent or fails — no extra state or conditional rendering needed.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't render AvatarImage without AvatarFallback",
                body: 'A broken image with no fallback leaves an empty circle that looks like a layout bug. Always include AvatarFallback so something meaningful is always visible.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Set a meaningful alt on AvatarImage',
                body: 'Use the user\'s name, not "avatar" or "photo". AvatarFallback initials also serve as a text alternative when the image fails — screen readers receive both.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use 1–2 uppercase initials in AvatarFallback',
                body: "Compact, readable at every size, and maintain consistent visual weight. Derive them from the user's display name: first letter of first name + first letter of last name.",
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* With image — fallback shown on error */}
<Avatar size="lg">
  <AvatarImage src="/avatar.jpg" alt="Cahya" />
  <AvatarFallback>CA</AvatarFallback>
</Avatar>

{/* Initials only — no image */}
<Avatar size="lg">
  <AvatarFallback>CA</AvatarFallback>
</Avatar>`}</code>
      </pre>
    </div>
  ),
}
