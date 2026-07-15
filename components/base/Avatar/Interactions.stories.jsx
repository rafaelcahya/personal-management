import { useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback, AvatarStatus, AvatarGroup } from './Avatar'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/base/Popover/Popover'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Avatar/Interactions',
}

export default meta

const people = [
  { id: 1, initials: 'RC', img: 'https://i.pravatar.cc/150?img=1', name: 'Rafael C.' },
  { id: 2, initials: 'AB', img: 'https://i.pravatar.cc/150?img=2', name: 'Alice B.' },
  { id: 3, initials: 'CD', img: 'https://i.pravatar.cc/150?img=3', name: 'Charlie D.' },
  { id: 4, initials: 'EF', img: 'https://i.pravatar.cc/150?img=4', name: 'Eva F.' },
]

const profiles = [
  {
    id: 1,
    initials: 'RC',
    img: 'https://i.pravatar.cc/150?img=1',
    name: 'Rafael Cahya',
    role: 'Product Engineer',
    email: 'rafael@example.com',
    status: 'online',
    accent: 'from-violet-500 to-indigo-500',
  },
  {
    id: 2,
    initials: 'AB',
    img: 'https://i.pravatar.cc/150?img=2',
    name: 'Alice Brown',
    role: 'UI Designer',
    email: 'alice@example.com',
    status: 'busy',
    accent: 'from-rose-400 to-pink-500',
  },
  {
    id: 3,
    initials: 'CD',
    img: 'https://i.pravatar.cc/150?img=3',
    name: 'Charlie Davis',
    role: 'Backend Engineer',
    email: 'charlie@example.com',
    status: 'away',
    accent: 'from-amber-400 to-orange-500',
  },
  {
    id: 4,
    initials: 'EF',
    img: 'https://i.pravatar.cc/150?img=4',
    name: 'Eva Foster',
    role: 'Product Manager',
    email: 'eva@example.com',
    status: 'offline',
    accent: 'from-emerald-400 to-teal-500',
  },
]

const statusDotColor = {
  online: 'bg-green-500',
  busy: 'bg-red-500',
  away: 'bg-amber-400',
  offline: 'bg-gray-400',
}

const statusLabel = { online: 'Online', busy: 'Busy', away: 'Away', offline: 'Offline' }

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

function ClickDemo() {
  const [selected, setSelected] = useState(null)
  const [log, setLog] = useState([])

  function handleClick(person) {
    setSelected(person.id)
    setLog((prev) => [`Clicked: ${person.name}`, ...prev].slice(0, 5))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4 p-5 bg-gray-50 border border-gray-200 rounded-lg">
        {people.map((p) => (
          <div key={p.id} className="flex flex-col items-center gap-2">
            <Avatar
              size="lg"
              onClick={() => handleClick(p)}
              className={
                selected === p.id ? 'ring-2 ring-violet-500 ring-offset-2 rounded-full' : ''
              }
            >
              <AvatarImage src={p.img} alt={p.name} />
              <AvatarFallback>{p.initials}</AvatarFallback>
            </Avatar>
            <span className="text-[10px] text-gray-400">{p.name}</span>
          </div>
        ))}
      </div>
      <div className="px-4 py-3 bg-gray-900 rounded-lg min-h-[72px]">
        {log.length === 0 ? (
          <p className="text-xs text-gray-500">Click an avatar above…</p>
        ) : (
          log.map((entry, i) => (
            <p
              key={i}
              className="text-xs font-mono text-green-400"
              style={{ opacity: 1 - i * 0.18 }}
            >
              {entry}
            </p>
          ))
        )}
      </div>
    </div>
  )
}

function SelectionDemo() {
  const [selected, setSelected] = useState([])

  function toggle(id) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4 p-5 bg-gray-50 border border-gray-200 rounded-lg flex-wrap">
        {people.map((p) => {
          const isSelected = selected.includes(p.id)
          return (
            <div key={p.id} className="flex flex-col items-center gap-2">
              <div className="relative">
                <Avatar
                  size="default"
                  onClick={() => toggle(p.id)}
                  className={
                    isSelected ? 'ring-2 ring-violet-500 ring-offset-2 rounded-full' : 'opacity-60'
                  }
                >
                  <AvatarImage src={p.img} alt={p.name} />
                  <AvatarFallback>{p.initials}</AvatarFallback>
                </Avatar>
                {isSelected && (
                  <span className="absolute -top-1 -right-1 size-4 rounded-full bg-violet-500 flex items-center justify-center z-30">
                    <svg
                      viewBox="0 0 10 8"
                      className="size-2.5 text-white fill-none stroke-current stroke-[1.5]"
                    >
                      <path d="M1 4l2.5 2.5L9 1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
              </div>
              <span className="text-[10px] text-gray-400">{p.initials}</span>
            </div>
          )
        })}
      </div>
      <p className="text-xs text-gray-500">
        {selected.length === 0
          ? 'No one selected'
          : `Selected: ${people
              .filter((p) => selected.includes(p.id))
              .map((p) => p.name)
              .join(', ')}`}
      </p>
    </div>
  )
}

export const Clickable = {
  name: 'Clickable',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          Pass an <code className="font-mono bg-gray-100 px-1 rounded text-xs">onClick</code> prop
          to make an <code className="font-mono bg-gray-100 px-1 rounded text-xs">Avatar</code>{' '}
          interactive. It gains{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">role="button"</code>,{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">tabIndex=0</code>, and
          keyboard support (Enter / Space). All avatars also scale to 110% on hover via{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">hover:scale-110</code>.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">single select — click to select</span>
          <ClickDemo />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">multi select — click to toggle</span>
          <SelectionDemo />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use onClick when the avatar triggers an action in the current context',
                body: 'Selecting a user, toggling assignment, or opening a panel in-place. The Avatar gains role="button" and full keyboard support automatically — no extra wiring needed.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use onClick for navigation — wrap with <Link> instead",
                body: 'A button cannot be opened in a new tab or followed by keyboard users the way a link can. Use Next.js Link as the wrapper when the avatar routes to a profile page.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Add aria-label describing the action when using onClick',
                body: 'The avatar gains role="button" automatically but screen readers also need the action label. Use aria-label="View Cahya\'s profile" or aria-label="Select Rafael" rather than relying on the initials alone.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use ring-2 ring-violet-500 ring-offset-2 to communicate selected state',
                body: 'This is the project standard for selection rings. Apply it conditionally via className — the ring appears outside the avatar boundary without distorting the circle shape.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Clickable — gains role="button" + keyboard support */}
<Avatar
  size="lg"
  onClick={() => setSelected(user.id)}
  aria-label={\`View \${user.name}'s profile\`}
  className={isSelected ? 'ring-2 ring-violet-500 ring-offset-2 rounded-full' : ''}
>
  <AvatarImage src={user.avatarUrl} alt={user.name} />
  <AvatarFallback>{user.initials}</AvatarFallback>
</Avatar>`}</code>
      </pre>
    </div>
  ),
}

export const WithPopover = {
  name: 'With Popover',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          Wrap <code className="font-mono bg-gray-100 px-1 rounded text-xs">Avatar</code> with a{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">PopoverTrigger</code> using{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">asChild</code> to open a
          profile card on click. The intermediate{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">
            &lt;span className="inline-flex"&gt;
          </code>{' '}
          wrapper is required because{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">Avatar</code> renders as a{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">&lt;span&gt;</code>, not a
          button.
        </p>
      </div>

      <div className="flex items-center gap-5 p-5 bg-gray-50 border border-gray-200 rounded-lg flex-wrap">
        {profiles.map((p) => (
          <Popover key={p.id}>
            <PopoverTrigger asChild>
              <span className="inline-flex">
                <Avatar size="lg">
                  <AvatarImage src={p.img} alt={p.name} />
                  <AvatarFallback>{p.initials}</AvatarFallback>
                  <AvatarStatus status={p.status} />
                </Avatar>
              </span>
            </PopoverTrigger>
            <PopoverContent
              side="top"
              align="center"
              sideOffset={10}
              className="w-60 p-0 overflow-hidden rounded-xl shadow-lg border-0"
            >
              <div className={`h-14 bg-gradient-to-r ${p.accent}`} />
              <div className="px-4 pb-4">
                <div className="-mt-7 mb-3">
                  <Avatar size="xl" className="ring-[3px] ring-white">
                    <AvatarImage src={p.img} alt={p.name} />
                    <AvatarFallback>{p.initials}</AvatarFallback>
                    <AvatarStatus status={p.status} />
                  </Avatar>
                </div>
                <p className="font-semibold text-sm text-gray-900 leading-tight">{p.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{p.role}</p>
                <p className="text-xs text-gray-400 mt-0.5">{p.email}</p>
                <p className="text-xs text-gray-400 mt-1">
                  <span
                    className={`inline-block size-1.5 rounded-full mr-1 align-middle ${statusDotColor[p.status]}`}
                  />
                  {statusLabel[p.status]}
                </p>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 text-xs py-1.5 rounded-lg bg-violet-500 hover:bg-violet-600 text-white font-medium transition-colors">
                    Message
                  </button>
                  <button className="flex-1 text-xs py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 font-medium transition-colors">
                    Profile
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        ))}
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title:
                  'Use a popover when clicking an avatar should reveal contextual info in-place',
                body: 'Profile cards, quick actions (Message / Profile), and presence details are ideal popover content. The user stays in context without a full navigation.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't put forms or long content in an avatar popover",
                body: 'Keep popover content to name, role, status, and 1–2 action buttons. Use a Sheet or Modal for complex interactions like editing a profile or sending a message with attachments.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'Wrap Avatar in <span className="inline-flex"> before PopoverTrigger asChild',
                body: 'Avatar renders as a <span>, not a button — PopoverTrigger asChild needs an element it can attach focus and keyboard handlers to. The inline-flex span is the correct anchor.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use side="top" with sideOffset={10} for profile popovers',
                body: 'It opens above the avatar where there is typically more vertical space and the card stays close to its trigger. Adjust align to "start" or "end" when the avatar is near a viewport edge.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Popover>
  <PopoverTrigger asChild>
    <span className="inline-flex">
      <Avatar size="lg">
        <AvatarImage src={user.avatarUrl} alt={user.name} />
        <AvatarFallback>{user.initials}</AvatarFallback>
        <AvatarStatus status="online" />
      </Avatar>
    </span>
  </PopoverTrigger>
  <PopoverContent side="top" align="center" sideOffset={10} className="w-60 p-0 overflow-hidden rounded-xl">
    {/* profile card content */}
  </PopoverContent>
</Popover>`}</code>
      </pre>
    </div>
  ),
}
