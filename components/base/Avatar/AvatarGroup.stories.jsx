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

export const AvatarGroupStory = {
  name: 'Avatar Group',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">AvatarGroup</code> stacks
        avatars with negative-margin overlap. Set{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">max</code> to limit visible
        avatars — excess count is shown as a{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">+N</code> badge. All{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">size</code> and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">shape</code> props are
        forwarded to each Avatar.
      </p>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">max=3 — 6 avatars → shows 3 + +3 badge</span>
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
          <span className="text-xs text-gray-400">max=5 — 6 avatars → shows 5 + +1 badge</span>
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
          <span className="text-xs text-gray-400">no overflow — all avatars visible</span>
          <div className="p-5 bg-gray-50 border border-gray-200 rounded-lg">
            <AvatarGroup max={10} size="default">
              {people.slice(0, 4).map(({ initials, img }) => (
                <Avatar key={initials}>
                  <AvatarImage src={img} alt={initials} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              ))}
            </AvatarGroup>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">sizes — sm / default / lg</span>
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
          <span className="text-xs text-gray-400">square shape</span>
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

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`{/* max=3, 6 children → 3 visible + "+3" badge */}
<AvatarGroup max={3} size="default">
  <Avatar><AvatarFallback>RC</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>AB</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>CD</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>EF</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>GH</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>IJ</AvatarFallback></Avatar>
</AvatarGroup>

{/* With images */}
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
