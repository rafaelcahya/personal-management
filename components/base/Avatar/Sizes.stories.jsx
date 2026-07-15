import { Avatar, AvatarImage, AvatarFallback } from './Avatar'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Avatar/Sizes',
}

export default meta

const sizes = ['xs', 'sm', 'default', 'lg', 'xl', '2xl']
const pxMap = { xs: '24px', sm: '32px', default: '40px', lg: '48px', xl: '64px', '2xl': '80px' }

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

export const Sizes = {
  name: 'Sizes',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          The <code className="font-mono bg-gray-100 px-1 rounded text-xs">size</code> prop controls
          the avatar dimensions. Six values are available:{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">xs</code> through{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">2xl</code>. Fallback text
          size and status dot size both scale automatically with the avatar.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400 font-mono">initials — all sizes</span>
          <div className="flex items-end gap-6 p-5 bg-gray-50 border border-gray-200 rounded-lg flex-wrap">
            {sizes.map((size) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <Avatar size={size}>
                  <AvatarFallback>RC</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <p className="text-[10px] font-mono text-gray-500">{size}</p>
                  <p className="text-[10px] text-gray-400">{pxMap[size]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400 font-mono">with image — all sizes</span>
          <div className="flex items-end gap-6 p-5 bg-gray-50 border border-gray-200 rounded-lg flex-wrap">
            {sizes.map((size, i) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <Avatar size={size}>
                  <AvatarImage src={`https://i.pravatar.cc/150?img=${i + 1}`} alt={size} />
                  <AvatarFallback>RC</AvatarFallback>
                </Avatar>
                <p className="text-[10px] font-mono text-gray-500">{size}</p>
              </div>
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
                title: 'Match size to the surrounding context',
                body: 'Use xs/sm for dense tables, inline mentions, and notification feeds. Use lg/xl for profile headers and detail panels where the avatar is the focal point.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Avoid AvatarStatus on xs and sm avatars',
                body: 'The status dot overlaps the initials area at small sizes and becomes too small to read or tap reliably. Use default size or larger when status visibility matters.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Fallback text size scales automatically with the avatar',
                body: 'No manual font size adjustments needed. All sizes produce readable initials at their intended density — the scaling is handled by the component.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Set size on AvatarGroup, not on individual children',
                body: 'AvatarGroup forwards the size prop to every child Avatar and the overflow badge automatically. Setting it per-Avatar inside a group creates inconsistent sizing.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* size: "xs" (24px) | "sm" (32px) | "default" (40px) */}
{/* size: "lg" (48px) | "xl" (64px) | "2xl" (80px)  */}

<Avatar size="xs"><AvatarFallback>RC</AvatarFallback></Avatar>
<Avatar size="sm"><AvatarFallback>RC</AvatarFallback></Avatar>
<Avatar size="default"><AvatarFallback>RC</AvatarFallback></Avatar>
<Avatar size="lg"><AvatarFallback>RC</AvatarFallback></Avatar>
<Avatar size="xl"><AvatarFallback>RC</AvatarFallback></Avatar>
<Avatar size="2xl"><AvatarFallback>RC</AvatarFallback></Avatar>`}</code>
      </pre>
    </div>
  ),
}
