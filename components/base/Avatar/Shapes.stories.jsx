import { Avatar, AvatarImage, AvatarFallback } from './Avatar'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Avatar/Shapes',
}

export default meta

const sizes = ['xs', 'sm', 'default', 'lg', 'xl', '2xl']

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

export const Circle = {
  name: 'Circle',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">shape="circle"</code> is the
          default. It applies{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">rounded-full</code> to the
          image and fallback, producing a fully circular avatar. Best for representing people.
        </p>
      </div>

      <div className="flex items-end gap-6 p-5 bg-gray-50 border border-gray-200 rounded-lg flex-wrap">
        {sizes.map((size, i) => (
          <div key={size} className="flex flex-col items-center gap-2">
            <Avatar size={size} shape="circle">
              <AvatarImage src={`https://i.pravatar.cc/150?img=${i + 1}`} alt={size} />
              <AvatarFallback>RC</AvatarFallback>
            </Avatar>
            <p className="text-[10px] font-mono text-gray-500">{size}</p>
          </div>
        ))}
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use shape="circle" when the avatar represents a person',
                body: 'Circular avatars are the universal convention for human identities. Users instantly recognize a circle as a person, not a resource or entity.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Avoid mixing circles and squares in the same list or group',
                body: 'It implies different entity types and creates visual inconsistency. Keep all avatars in a list the same shape so the convention is clear.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Shape is purely visual — no impact on screen readers or keyboard behavior',
                body: 'Both circle and square render identically to assistive technology. The shape prop only changes the CSS border-radius.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Circle is the default — omit shape unless overriding to square',
                body: 'Not passing shape gives you shape="circle" automatically. Only specify it explicitly when you need to override to square.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* circle is the default — shape prop optional */}
<Avatar size="lg" shape="circle">
  <AvatarImage src="/avatar.jpg" alt="Cahya" />
  <AvatarFallback>CA</AvatarFallback>
</Avatar>`}</code>
      </pre>
    </div>
  ),
}

export const Square = {
  name: 'Square',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">shape="square"</code> applies{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">rounded-lg</code> to the
          image and fallback. Best for representing non-person entities — workspaces, teams, apps,
          or organizations.
        </p>
      </div>

      <div className="flex items-end gap-6 p-5 bg-gray-50 border border-gray-200 rounded-lg flex-wrap">
        {sizes.map((size, i) => (
          <div key={size} className="flex flex-col items-center gap-2">
            <Avatar size={size} shape="square">
              <AvatarImage src={`https://i.pravatar.cc/150?img=${i + 10}`} alt={size} />
              <AvatarFallback>RC</AvatarFallback>
            </Avatar>
            <p className="text-[10px] font-mono text-gray-500">{size}</p>
          </div>
        ))}
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use shape="square" for non-person entities',
                body: 'Workspaces, organizations, integrations, or product logos where a square matches the typical app icon convention and signals a resource, not a human.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: 'Avoid mixing square with people avatars in the same list',
                body: 'It implies a different entity type and creates confusion about what is a person vs. a resource. Keep shape consistent within a list or group.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Shape is purely visual — no impact on screen readers or keyboard behavior',
                body: 'Both circle and square render identically to assistive technology. The shape prop only changes the CSS border-radius.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Pair with AvatarGroup shape="square" when stacking team or workspace avatars',
                body: 'The shape prop is forwarded to all child Avatars and the overflow badge automatically — no need to set it on each individual Avatar inside the group.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Avatar size="lg" shape="square">
  <AvatarImage src="/workspace-logo.jpg" alt="Workspace" />
  <AvatarFallback>WS</AvatarFallback>
</Avatar>`}</code>
      </pre>
    </div>
  ),
}
