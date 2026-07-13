import { User, Bot, Building2 } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from './Avatar'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Avatar/Fallback',
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

export const Initials = {
  name: 'Initials',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          Pass 1–2 character initials as children to{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">AvatarFallback</code>. The
          text size scales automatically with the avatar{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">size</code> prop. Initials
          are the most common fallback — compact, readable, and visually consistent at every size.
        </p>
      </div>

      <div className="flex items-end gap-6 p-5 bg-gray-50 border border-gray-200 rounded-lg flex-wrap">
        {['R', 'RC', 'CA', 'AB', 'EF'].map((initials, i) => (
          <div key={initials + i} className="flex flex-col items-center gap-2">
            <Avatar size="lg">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="text-[10px] font-mono text-gray-400">"{initials}"</span>
          </div>
        ))}
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use initials when there is a real name to derive them from',
                body: 'First letter of first name + first letter of last name is the standard convention. More personal than a generic icon and immediately recognizable to other users.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't pass a full name or more than 2 characters",
                body: 'It overflows and breaks the layout at smaller sizes. Keep to 1–2 characters — single initial for xs/sm, two initials for default and larger.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'AvatarFallback is always in the DOM behind the image',
                body: 'Screen readers receive the initials text as content even when the image loads successfully — z-0 positioning keeps it behind the image visually but present in the accessibility tree.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Derive initials at render time from the user display name',
                body: 'user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() is the standard approach. Don\'t hardcode initials — they should update when the name changes.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* 1 or 2 uppercase initials */}
<Avatar size="lg">
  <AvatarFallback>RC</AvatarFallback>
</Avatar>

{/* Derived from user name */}
const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
<Avatar size="lg">
  <AvatarFallback>{initials}</AvatarFallback>
</Avatar>`}</code>
      </pre>
    </div>
  ),
}

export const Icon = {
  name: 'Icon',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          Pass any ReactNode — including Lucide icons — as children to{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">AvatarFallback</code>. Use an
          icon when there is no name to derive initials from, or when representing a non-person
          entity like a bot, team, or organization.
        </p>
      </div>

      <div className="flex items-center gap-6 p-5 bg-gray-50 border border-gray-200 rounded-lg flex-wrap">
        <div className="flex flex-col items-center gap-2">
          <Avatar size="lg" shape="circle">
            <AvatarFallback>
              <User className="size-5" />
            </AvatarFallback>
          </Avatar>
          <span className="text-[10px] text-gray-400">User</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Avatar size="lg" shape="circle">
            <AvatarFallback>
              <Bot className="size-5" />
            </AvatarFallback>
          </Avatar>
          <span className="text-[10px] text-gray-400">Bot</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Avatar size="lg" shape="square">
            <AvatarFallback>
              <Building2 className="size-5" />
            </AvatarFallback>
          </Avatar>
          <span className="text-[10px] text-gray-400">Building2</span>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use an icon when there is no name to derive initials from',
                body: 'Or when representing a non-person entity like a bot, team, or organization. The User icon from lucide-react is the standard generic anonymous fallback.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use a generic icon for real users who have a name",
                body: 'Derive initials instead. Icons feel anonymous; initials feel personal and recognizable to others in the same workspace.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Icons inside AvatarFallback are decorative in context',
                body: 'The Avatar root should have a meaningful context label from AvatarImage alt or surrounding text. Add aria-hidden to the icon itself to avoid redundant announcements.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Pair icon fallbacks with shape="square" for non-person entities',
                body: 'Bot and Building2 icons with a square shape visually signal a resource, not a human. Match icon size manually to avatar size — size-5 for lg, size-6 for xl.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`import { User, Bot, Building2 } from 'lucide-react'

{/* Generic user */}
<Avatar size="lg">
  <AvatarFallback><User className="size-5" /></AvatarFallback>
</Avatar>

{/* AI bot */}
<Avatar size="lg">
  <AvatarFallback><Bot className="size-5" /></AvatarFallback>
</Avatar>

{/* Organization — square shape */}
<Avatar size="lg" shape="square">
  <AvatarFallback><Building2 className="size-5" /></AvatarFallback>
</Avatar>`}</code>
      </pre>
    </div>
  ),
}

export const CustomColor = {
  name: 'Custom Color',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          Override the default gray background and text color of{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">AvatarFallback</code> via{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">className</code>. Useful for
          color-coding users, teams, or roles — assign a consistent color per user and it persists
          whether the image loads or not.
        </p>
      </div>

      <div className="flex items-center gap-4 p-5 bg-gray-50 border border-gray-200 rounded-lg flex-wrap">
        {[
          { initials: 'RC', bg: 'bg-violet-100', text: 'text-violet-700', label: 'violet' },
          { initials: 'AB', bg: 'bg-blue-100', text: 'text-blue-700', label: 'blue' },
          { initials: 'CD', bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'emerald' },
          { initials: 'EF', bg: 'bg-amber-100', text: 'text-amber-700', label: 'amber' },
          { initials: 'GH', bg: 'bg-rose-100', text: 'text-rose-700', label: 'rose' },
        ].map(({ initials, bg, text, label }) => (
          <div key={initials} className="flex flex-col items-center gap-2">
            <Avatar size="lg">
              <AvatarFallback className={`${bg} ${text}`}>{initials}</AvatarFallback>
            </Avatar>
            <span className="text-[10px] text-gray-400">{label}</span>
          </div>
        ))}
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use color coding to visually distinguish users in dense interfaces',
                body: 'A consistent color per user makes individual identities recognizable at a glance in activity feeds, comment threads, and task lists.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use color alone to convey status or role",
                body: 'Use AvatarStatus for presence and a label or badge for roles. Color alone is not accessible — users who cannot distinguish colors will miss the meaning.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Use light background + dark text pairs that pass contrast requirements',
                body: 'bg-violet-100 text-violet-700 style pairs work well on both light and dark surfaces. Always verify contrast ratio — initials must remain legible at small sizes.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Derive the color deterministically from the user ID or name',
                body: 'A consistent hash ensures the same user always gets the same color, even across page reloads. Avoid random assignment — it breaks visual recognition when the user reappears.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Override via className — bg + text color */}
<Avatar size="lg">
  <AvatarFallback className="bg-violet-100 text-violet-700">RC</AvatarFallback>
</Avatar>

<Avatar size="lg">
  <AvatarFallback className="bg-emerald-100 text-emerald-700">AB</AvatarFallback>
</Avatar>`}</code>
      </pre>
    </div>
  ),
}
