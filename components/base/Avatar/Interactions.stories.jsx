import { useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback, AvatarStatus, AvatarGroup } from './Avatar'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'

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

const statusLabel = { online: 'Online', busy: 'Busy', away: 'Away', offline: 'Offline' }

function ProfilePopoverDemo() {
  return (
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
                  className={`inline-block size-1.5 rounded-full mr-1 align-middle ${
                    {
                      online: 'bg-green-500',
                      busy: 'bg-red-500',
                      away: 'bg-amber-400',
                      offline: 'bg-gray-400',
                    }[p.status]
                  }`}
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
  )
}

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

function GroupClickDemo() {
  const [active, setActive] = useState(null)

  return (
    <div className="flex flex-col gap-4">
      <div className="p-5 bg-gray-50 border border-gray-200 rounded-lg">
        <AvatarGroup max={4} size="default">
          {people.map((p) => (
            <Avatar
              key={p.id}
              onClick={() => setActive(p)}
              className={
                active?.id === p.id ? 'ring-2 ring-violet-500 ring-offset-1 rounded-full' : ''
              }
            >
              <AvatarImage src={p.img} alt={p.name} />
              <AvatarFallback>{p.initials}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
      </div>
      <p className="text-xs text-gray-500">
        {active ? `Active: ${active.name}` : 'Click an avatar in the group…'}
      </p>
    </div>
  )
}

export const Interactions = {
  name: 'Interactions',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        Pass an <code className="font-mono bg-gray-100 px-1 rounded text-xs">onClick</code> prop to
        make an <code className="font-mono bg-gray-100 px-1 rounded text-xs">Avatar</code>{' '}
        interactive. It gains{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">role="button"</code>,{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">tabIndex=0</code>, keyboard
        support (Enter / Space), and a pointer cursor. All avatars scale on hover.
      </p>

      <div className="flex flex-col gap-3">
        <span className="text-xs text-gray-400">click to select — single</span>
        <ClickDemo />
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs text-gray-400">click to toggle — multi-select</span>
        <SelectionDemo />
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs text-gray-400">click inside AvatarGroup</span>
        <GroupClickDemo />
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs text-gray-400">
          hover scale — all avatars scale to 110% on hover
        </span>
        <div className="flex items-center gap-4 p-5 bg-gray-50 border border-gray-200 rounded-lg">
          {['xs', 'sm', 'default', 'lg', 'xl'].map((size) => (
            <Avatar key={size} size={size}>
              <AvatarFallback>RC</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs text-gray-400">click to open profile popover</span>
        <ProfilePopoverDemo />
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`{/* Clickable — gains role="button" + keyboard support */}
<Avatar size="lg" onClick={() => setSelected(user.id)}>
  <AvatarImage src={user.avatarUrl} alt={user.name} />
  <AvatarFallback>{user.initials}</AvatarFallback>
</Avatar>

{/* Selected ring via className */}
<Avatar
  size="lg"
  onClick={handleClick}
  className={isSelected ? 'ring-2 ring-violet-500 ring-offset-2 rounded-full' : ''}
>
  <AvatarFallback>RC</AvatarFallback>
</Avatar>

{/* Clickable inside AvatarGroup */}
<AvatarGroup max={4}>
  {users.map(u => (
    <Avatar key={u.id} onClick={() => setActive(u)}>
      <AvatarImage src={u.avatarUrl} alt={u.name} />
      <AvatarFallback>{u.initials}</AvatarFallback>
    </Avatar>
  ))}
</AvatarGroup>

{/* Profile popover — wrap with PopoverTrigger asChild */}
<Popover>
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
