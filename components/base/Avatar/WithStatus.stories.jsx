import { Avatar, AvatarImage, AvatarFallback, AvatarStatus } from './Avatar'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Avatar/With Status',
}

export default meta

const sizes = ['sm', 'default', 'lg', 'xl', '2xl']

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

export const Online = {
  name: 'Online',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">status="online"</code>{' '}
          renders a green dot at bottom-right of the avatar. Signals that the user is currently
          active and reachable. The dot scales with the avatar size automatically.
        </p>
      </div>

      <div className="flex items-end gap-6 p-5 bg-gray-50 border border-gray-200 rounded-lg flex-wrap">
        {sizes.map((size, i) => (
          <div key={size} className="flex flex-col items-center gap-2">
            <Avatar size={size}>
              <AvatarImage src={`https://i.pravatar.cc/150?img=${i + 1}`} alt="User" />
              <AvatarFallback>RC</AvatarFallback>
              <AvatarStatus status="online" />
            </Avatar>
            <span className="text-[10px] font-mono text-gray-400">{size}</span>
          </div>
        ))}
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use status="online" only when backed by real-time presence data',
                body: 'Showing a stale "online" dot misleads users into expecting an immediate response. Only render it when you have a live WebSocket or presence subscription confirming the user is active.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Avoid adding a status dot on xs or sm avatars',
                body: 'The dot overlaps the initials area and is too small to be reliably visible at xs/sm. Use default size or larger when status visibility matters.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Status dot is visual-only — add a text alternative for screen readers',
                body: 'The green dot has no inherent meaning to assistive technology. Add aria-label to the Avatar or a visually-hidden span (e.g. "Online") nearby so status is communicated non-visually.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Pair with ping to make active presence more noticeable',
                body: 'Add the ping prop to AvatarStatus to render an animate-ping ripple behind the dot. Use sparingly — only in real-time collaboration contexts like live chat or "currently editing" indicators.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Avatar size="lg">
  <AvatarImage src="/avatar.jpg" alt="Cahya" />
  <AvatarFallback>CA</AvatarFallback>
  <AvatarStatus status="online" />
</Avatar>`}</code>
      </pre>
    </div>
  ),
}

export const Offline = {
  name: 'Offline',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">status="offline"</code>{' '}
          renders a gray dot. Signals that the user is not currently connected. The muted color
          communicates unavailability without drawing attention.
        </p>
      </div>

      <div className="flex items-end gap-6 p-5 bg-gray-50 border border-gray-200 rounded-lg flex-wrap">
        {sizes.map((size, i) => (
          <div key={size} className="flex flex-col items-center gap-2">
            <Avatar size={size}>
              <AvatarImage src={`https://i.pravatar.cc/150?img=${i + 6}`} alt="User" />
              <AvatarFallback>RC</AvatarFallback>
              <AvatarStatus status="offline" />
            </Avatar>
            <span className="text-[10px] font-mono text-gray-400">{size}</span>
          </div>
        ))}
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Show offline only when you have recent presence data confirming it',
                body: "If you don't know the user's status, omit AvatarStatus entirely rather than defaulting to offline. An absent dot is more honest than a misleading gray one.",
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Don\'t pair ping with status="offline"',
                body: 'A pulsing animation implies active presence, which directly contradicts offline. ping should only be used with status="online".',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'The gray dot is intentionally low-contrast — this is correct',
                body: 'Don\'t try to make it more visible. Its subtlety communicates "not here" without demanding attention. Add a visually-hidden text alternative for screen readers if status must be announced.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Omit AvatarStatus rather than show a stale dot',
                body: 'A stale offline dot is worse than no dot — it implies you checked and found the user absent, when actually you just have old data. Conditional rendering based on data freshness is the correct pattern.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Avatar size="lg">
  <AvatarImage src="/avatar.jpg" alt="Cahya" />
  <AvatarFallback>CA</AvatarFallback>
  <AvatarStatus status="offline" />
</Avatar>`}</code>
      </pre>
    </div>
  ),
}

export const Busy = {
  name: 'Busy',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">status="busy"</code> renders
          a red dot. Signals that the user is online but occupied — in a meeting, on a call, or has
          enabled Do Not Disturb. Messages may be seen later.
        </p>
      </div>

      <div className="flex items-end gap-6 p-5 bg-gray-50 border border-gray-200 rounded-lg flex-wrap">
        {sizes.map((size, i) => (
          <div key={size} className="flex flex-col items-center gap-2">
            <Avatar size={size}>
              <AvatarImage src={`https://i.pravatar.cc/150?img=${i + 11}`} alt="User" />
              <AvatarFallback>RC</AvatarFallback>
              <AvatarStatus status="busy" />
            </Avatar>
            <span className="text-[10px] font-mono text-gray-400">{size}</span>
          </div>
        ))}
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title:
                  'Use when the user has explicitly set a "Do Not Disturb" or "In a meeting" status',
                body: 'Not as a fallback for any unknown state. busy is a meaningful signal — it implies the user is reachable but has indicated they should not be interrupted right now.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Don\'t pair ping with status="busy"',
                body: 'A pulsing animation implies active, real-time presence. Busy means "present but unavailable" — adding ping sends a contradictory signal and should be reserved for status="online" only.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'The red dot has high visual weight — use it intentionally',
                body: 'Reserve it for genuinely urgent "do not interrupt" contexts so it retains its meaning. Add a visually-hidden text alternative ("Busy") for screen readers.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Pair with a tooltip or label for context when space allows',
                body: '"In a meeting until 3pm" is more actionable than a red dot alone. Surface the status message in a popover or tooltip so users can make informed decisions about when to reach out.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Avatar size="lg">
  <AvatarImage src="/avatar.jpg" alt="Cahya" />
  <AvatarFallback>CA</AvatarFallback>
  <AvatarStatus status="busy" />
</Avatar>`}</code>
      </pre>
    </div>
  ),
}

export const Away = {
  name: 'Away',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">status="away"</code> renders
          an amber dot. Signals that the user is logged in but idle or away from their device —
          connected but not actively watching.
        </p>
      </div>

      <div className="flex items-end gap-6 p-5 bg-gray-50 border border-gray-200 rounded-lg flex-wrap">
        {sizes.map((size, i) => (
          <div key={size} className="flex flex-col items-center gap-2">
            <Avatar size={size}>
              <AvatarImage src={`https://i.pravatar.cc/150?img=${i + 16}`} alt="User" />
              <AvatarFallback>RC</AvatarFallback>
              <AvatarStatus status="away" />
            </Avatar>
            <span className="text-[10px] font-mono text-gray-400">{size}</span>
          </div>
        ))}
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Trigger away automatically after a period of inactivity',
                body: "e.g. 10 minutes without interaction. Don't require users to set it manually — automatic away detection is the standard pattern in collaboration tools like Slack and Notion.",
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Don\'t pair ping with status="away"',
                body: 'The animation implies active, real-time presence which contradicts the away state. ping should only be used with status="online" to signal a user who is actively present.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Amber sits between green and gray in urgency',
                body: 'It implies "might respond soon" rather than "will respond now" or "not here at all". Add a visually-hidden text alternative ("Away") for screen readers who cannot perceive color.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Revert to online automatically when activity resumes',
                body: 'Away is a transient state, not a manual setting. As soon as the user interacts with the app again, update the presence signal back to online without requiring any user action.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Avatar size="lg">
  <AvatarImage src="/avatar.jpg" alt="Cahya" />
  <AvatarFallback>CA</AvatarFallback>
  <AvatarStatus status="away" />
</Avatar>`}</code>
      </pre>
    </div>
  ),
}

export const Ping = {
  name: 'Ping',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          Adding <code className="font-mono bg-gray-100 px-1 rounded text-xs">ping</code> to{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">AvatarStatus</code> renders
          an <code className="font-mono bg-gray-100 px-1 rounded text-xs">animate-ping</code> ripple
          layer behind the dot, creating a pulsing animation that draws attention to active
          presence. Best paired with{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">status="online"</code>.
        </p>
      </div>

      <div className="flex items-end gap-8 p-5 bg-gray-50 border border-gray-200 rounded-lg flex-wrap">
        <div className="flex flex-col items-center gap-2">
          <Avatar size="lg">
            <AvatarImage src="https://i.pravatar.cc/150?img=1" alt="User" />
            <AvatarFallback>RC</AvatarFallback>
            <AvatarStatus status="online" />
          </Avatar>
          <span className="text-[10px] text-gray-400">without ping</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Avatar size="lg">
            <AvatarImage src="https://i.pravatar.cc/150?img=2" alt="User" />
            <AvatarFallback>CA</AvatarFallback>
            <AvatarStatus status="online" ping />
          </Avatar>
          <span className="text-[10px] text-gray-400">with ping</span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-gray-400 mb-2 font-mono">all sizes — ping</span>
          <div className="flex items-end gap-5">
            {sizes.map((size) => (
              <Avatar key={size} size={size}>
                <AvatarFallback>RC</AvatarFallback>
                <AvatarStatus status="online" ping />
              </Avatar>
            ))}
          </div>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use ping only in real-time contexts where active presence matters',
                body: 'Live chat, active sessions, or "currently editing" indicators. The pulsing animation signals "this person is here right now" — it should only fire when that is genuinely true.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Only use ping with status="online" — never with offline, busy, or away',
                body: 'A pulsing animation implies active, real-time presence. Pairing it with any other status value sends a contradictory signal that will confuse users.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'The ping animation is visual-only and has no ARIA role',
                body: 'Screen readers do not announce CSS animations. If the animated state carries meaning (e.g. "live session active"), communicate it with a visually-hidden text element as well.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Use sparingly — if every avatar is pinging, the animation loses its meaning',
                body: 'Reserve ping for at most 1–2 avatars on screen at a time. When overused, the animation becomes visual noise that users learn to ignore rather than a meaningful presence signal.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* static dot */}
<Avatar size="lg">
  <AvatarFallback>CA</AvatarFallback>
  <AvatarStatus status="online" />
</Avatar>

{/* with ping ripple animation */}
<Avatar size="lg">
  <AvatarFallback>CA</AvatarFallback>
  <AvatarStatus status="online" ping />
</Avatar>`}</code>
      </pre>
    </div>
  ),
}
