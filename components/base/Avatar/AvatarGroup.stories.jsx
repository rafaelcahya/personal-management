import { Avatar, AvatarImage, AvatarFallback, AvatarGroup } from './Avatar'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Avatar/Avatar Group',
}

export default meta

const people = [
  { initials: 'RC', img: 'https://i.pravatar.cc/150?img=1' },
  { initials: 'AB', img: 'https://i.pravatar.cc/150?img=2' },
  { initials: 'CD', img: 'https://i.pravatar.cc/150?img=3' },
  { initials: 'EF', img: 'https://i.pravatar.cc/150?img=4' },
  { initials: 'GH', img: 'https://i.pravatar.cc/150?img=5' },
  { initials: 'IJ', img: 'https://i.pravatar.cc/150?img=6' },
]

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

export const AvatarGroupStory = {
  name: 'Avatar Group',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">AvatarGroup</code> stacks
          avatars with negative-margin overlap. Set{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">max</code> to cap the number
          of visible avatars — excess count renders as a{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">+N</code> badge. The{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">size</code> and{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">shape</code> props are
          forwarded to every child Avatar and the overflow badge automatically.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400 font-mono">
            max=3 — 6 avatars → 3 visible + +3 badge
          </span>
          <div className="p-5 bg-gray-50 border border-gray-200 rounded-lg">
            <AvatarGroup max={3} size="default">
              {people.map(({ initials, img }) => (
                <Avatar key={initials}>
                  <AvatarImage src={img} alt={initials} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              ))}
            </AvatarGroup>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400 font-mono">
            max=5 — 6 avatars → 5 visible + +1 badge
          </span>
          <div className="p-5 bg-gray-50 border border-gray-200 rounded-lg">
            <AvatarGroup max={5} size="default">
              {people.map(({ initials, img }) => (
                <Avatar key={initials}>
                  <AvatarImage src={img} alt={initials} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              ))}
            </AvatarGroup>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400 font-mono">size — sm / default / lg</span>
          <div className="flex flex-col gap-4 p-5 bg-gray-50 border border-gray-200 rounded-lg">
            {['sm', 'default', 'lg'].map((size) => (
              <div key={size} className="flex items-center gap-4">
                <span className="text-[10px] font-mono text-gray-400 w-14 shrink-0">{size}</span>
                <AvatarGroup max={4} size={size}>
                  {people.map(({ initials }) => (
                    <Avatar key={initials}>
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                  ))}
                </AvatarGroup>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400 font-mono">shape="square"</span>
          <div className="p-5 bg-gray-50 border border-gray-200 rounded-lg">
            <AvatarGroup max={4} size="default" shape="square">
              {people.map(({ initials, img }) => (
                <Avatar key={initials}>
                  <AvatarImage src={img} alt={initials} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              ))}
            </AvatarGroup>
          </div>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title:
                  'Use AvatarGroup for compact participant summaries in cards, tables, and headers',
                body: 'Task assignees, PR reviewers, project members — anywhere you need to show "who is involved" in a small footprint. The +N badge communicates the total count without showing every face.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't add AvatarStatus inside avatars in a group",
                body: 'The status dot overlaps with the overlap ring and creates visual clutter. Show status only on standalone avatars where there is no overlap.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Set meaningful alt on each AvatarImage inside the group',
                body: "Use the user's name. Screen readers will announce each avatar's alt in sequence, so the group communicates the full participant list — not just a count.",
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Always set max explicitly and keep it at 3–5',
                body: 'The default of 4 may be too many in compact layouts like card footers or table cells. If max is too high and overflow is always 0, the group adds no summary value over a plain list.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* max=3, 6 children → 3 visible + "+3" badge */}
<AvatarGroup max={3} size="default">
  <Avatar><AvatarFallback>RC</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>AB</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>CD</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>EF</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>GH</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>IJ</AvatarFallback></Avatar>
</AvatarGroup>

{/* With images, mapped from data */}
<AvatarGroup max={4} size="sm">
  {users.map(u => (
    <Avatar key={u.id}>
      <AvatarImage src={u.avatarUrl} alt={u.name} />
      <AvatarFallback>{u.initials}</AvatarFallback>
    </Avatar>
  ))}
</AvatarGroup>`}</code>
      </pre>
    </div>
  ),
}
