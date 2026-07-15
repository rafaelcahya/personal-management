import { User } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback, AvatarStatus, AvatarGroup } from './Avatar'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Avatar',
}

export default meta

// ─── Primitives ───────────────────────────────────────────────────────────────

const Section = ({ title, description, children }) => (
  <div className="mb-12">
    <h2 className="text-xl font-semibold text-gray-900 mb-1">{title}</h2>
    {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
    <hr className="mb-5 border-gray-200" />
    {children}
  </div>
)

const SubSection = ({ title, description, children }) => (
  <div className="mb-8">
    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">{title}</h3>
    {description && <p className="text-xs text-gray-500 mb-3">{description}</p>}
    {children}
  </div>
)

const Preview = ({ children }) => (
  <div className="flex flex-wrap items-center gap-4 p-5 bg-gray-50 border border-gray-200 rounded-lg mb-3">
    {children}
  </div>
)

const Code = ({ children }) => (
  <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto mb-4 leading-relaxed">
    <code>{children}</code>
  </pre>
)

const Tag = ({ children, color = 'gray' }) => {
  const colors = {
    gray: 'bg-gray-100 text-gray-600',
    violet: 'bg-violet-100 text-violet-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
  }
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-medium ${colors[color]}`}
    >
      {children}
    </span>
  )
}

// ─── Story ────────────────────────────────────────────────────────────────────

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="p-8 max-w-4xl font-sans text-gray-900">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Avatar</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          User profile image component with automatic fallback to initials or icon, optional status
          indicator dot with ping animation, and an{' '}
          <code className="font-mono text-sm">AvatarGroup</code> for stacking multiple avatars with
          overflow count. Built from scratch — no Radix dependency.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <Preview>
          <Avatar size="default" shape="circle">
            <AvatarFallback>CA</AvatarFallback>
            <AvatarStatus status="online" ping />
          </Avatar>
          <Avatar size="default" shape="circle">
            <AvatarImage src="https://i.pravatar.cc/150?img=12" alt="User" />
            <AvatarFallback>AB</AvatarFallback>
            <AvatarStatus status="busy" />
          </Avatar>
          <Avatar size="lg" shape="square">
            <AvatarFallback>
              <User className="size-5" />
            </AvatarFallback>
          </Avatar>
          <AvatarGroup max={3} size="default">
            {['RC', 'AB', 'CD', 'EF', 'GH'].map((initials) => (
              <Avatar key={initials}>
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
        </Preview>
      </Section>

      {/* Anatomy */}
      <Section
        title="Anatomy"
        description="Avatar is composed of four sub-components nested inside a root wrapper."
      >
        {/* Diagram */}
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4">
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wide mb-1">
                With image
              </span>
              <div className="relative p-4 border-2 border-dashed border-violet-400 rounded-xl inline-block">
                <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-[10px] font-mono font-semibold text-violet-600">
                  Avatar
                </span>
                <div className="flex flex-col gap-2 mt-1">
                  <div className="relative p-2 border border-dashed border-blue-300 rounded-lg">
                    <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-blue-500">
                      AvatarImage
                    </span>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      &lt;img&gt; — z-10, hidden on error
                    </p>
                  </div>
                  <div className="relative p-2 border border-dashed border-slate-300 rounded-lg">
                    <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-slate-400">
                      AvatarFallback
                    </span>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      &lt;span&gt; — z-0, always rendered
                    </p>
                  </div>
                  <div className="relative p-2 border border-dashed border-green-300 rounded-lg">
                    <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-green-500">
                      AvatarStatus
                    </span>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      &lt;span&gt; — absolute bottom-right, optional
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wide mb-1">
                Group
              </span>
              <div className="relative p-4 border-2 border-dashed border-violet-400 rounded-xl inline-block">
                <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-[10px] font-mono font-semibold text-violet-600">
                  AvatarGroup
                </span>
                <div className="flex flex-col gap-2 mt-1">
                  <div className="relative p-2 border border-dashed border-slate-300 rounded-lg">
                    <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-slate-400">
                      Avatar (×N)
                    </span>
                    <p className="text-[10px] text-gray-400 mt-0.5">visible up to max</p>
                  </div>
                  <div className="relative p-2 border border-dashed border-green-300 rounded-lg">
                    <span className="absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-green-500">
                      +N badge
                    </span>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      rendered when overflow &gt; 0
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parts table */}
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {['Part', 'Element', 'Description'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700 text-xs uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                [
                  'Avatar',
                  '<span>',
                  'Root wrapper. Sets size and shape. Manages image error state via Context.',
                ],
                [
                  'AvatarImage',
                  '<img>',
                  'Profile image. Hides itself on error, revealing AvatarFallback.',
                ],
                [
                  'AvatarFallback',
                  '<span>',
                  'Shown when image is absent or fails to load. Renders initials or any ReactNode.',
                ],
                [
                  'AvatarStatus',
                  '<span>',
                  'Colored dot at bottom-right. Indicates online/offline/busy/away. Supports ping animation.',
                ],
                [
                  'AvatarGroup',
                  '<div>',
                  'Stacks multiple Avatars with overlap. Shows +N badge for overflow.',
                ],
              ].map(([part, el, desc]) => (
                <tr key={part} className="even:bg-gray-50">
                  <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                    {part}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400 whitespace-nowrap">
                    {el}
                  </td>
                  <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Code>{`import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarStatus,
  AvatarGroup,
} from '@/components/base/Avatar/Avatar'

<Avatar size="default" shape="circle">
  <AvatarImage src="/avatar.jpg" alt="Cahya" />
  <AvatarFallback>CA</AvatarFallback>
  <AvatarStatus status="online" ping />
</Avatar>`}</Code>
      </Section>

      {/* Usage */}
      <Section title="Usage" description="Copy-ready code for common scenarios.">
        <SubSection title="With image + fallback">
          <Code>{`<Avatar size="default">
  <AvatarImage src="/avatar.jpg" alt="Cahya" />
  <AvatarFallback>CA</AvatarFallback>
</Avatar>`}</Code>
        </SubSection>

        <SubSection title="Initials only">
          <Code>{`<Avatar size="default">
  <AvatarFallback>RC</AvatarFallback>
</Avatar>`}</Code>
        </SubSection>

        <SubSection title="Icon fallback">
          <Code>{`import { User } from 'lucide-react'

<Avatar size="default">
  <AvatarFallback><User className="size-5" /></AvatarFallback>
</Avatar>`}</Code>
        </SubSection>

        <SubSection title="With status dot">
          <Code>{`{/* static dot */}
<Avatar>
  <AvatarFallback>CA</AvatarFallback>
  <AvatarStatus status="online" />
</Avatar>

{/* with ping animation */}
<Avatar>
  <AvatarFallback>CA</AvatarFallback>
  <AvatarStatus status="online" ping />
</Avatar>

{/* status values: "online" | "offline" | "busy" | "away" */}`}</Code>
        </SubSection>

        <SubSection title="Clickable avatar">
          <Code>{`<Avatar onClick={() => router.push('/profile')}>
  <AvatarFallback>RC</AvatarFallback>
</Avatar>`}</Code>
        </SubSection>

        <SubSection title="Avatar group">
          <Code>{`<AvatarGroup max={3} size="sm">
  <Avatar><AvatarFallback>A</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>B</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>C</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>D</AvatarFallback></Avatar>
  {/* 4 avatars, max=3 → shows 3 visible + "+1" badge */}
</AvatarGroup>`}</Code>
        </SubSection>
      </Section>

      {/* API Reference */}
      <Section title="API Reference">
        {[
          {
            name: 'Avatar',
            description: 'Root component. Manages size, shape, and image error state via Context.',
            rows: [
              [
                'size',
                "'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl'",
                "'default'",
                'Dimensions: xs=24px, sm=32px, default=40px, lg=48px, xl=64px, 2xl=80px.',
              ],
              [
                'shape',
                "'circle' | 'square'",
                "'circle'",
                'Border radius. circle=rounded-full, square=rounded-lg.',
              ],
              [
                'onClick',
                '() => void',
                '—',
                'Makes the avatar interactive. Adds role="button", tabIndex, and keyboard handler.',
              ],
              ['className', 'string', '—', 'Additional Tailwind classes on the root span.'],
            ],
          },
          {
            name: 'AvatarImage',
            description: 'Profile image. Hides on error, revealing AvatarFallback automatically.',
            rows: [
              ['src', 'string', '—', 'Image URL.'],
              ['alt', 'string', "''", 'Alt text for screen readers.'],
              ['className', 'string', '—', 'Additional Tailwind classes on the img element.'],
            ],
          },
          {
            name: 'AvatarFallback',
            description: 'Shown when image is absent or fails to load.',
            rows: [
              [
                'children',
                'ReactNode',
                '—',
                'Initials string or any ReactNode (e.g. a Lucide icon).',
              ],
              [
                'className',
                'string',
                '—',
                'Additional Tailwind classes. Use to override background or text color.',
              ],
            ],
          },
          {
            name: 'AvatarStatus',
            description: 'Colored dot at bottom-right. Optionally animates with a ping ripple.',
            rows: [
              [
                'status',
                "'online' | 'offline' | 'busy' | 'away'",
                "'online'",
                'online=green, offline=gray, busy=red, away=amber.',
              ],
              [
                'ping',
                'boolean',
                'false',
                'Adds an animate-ping ripple layer behind the dot. Best paired with status="online".',
              ],
              ['className', 'string', '—', 'Additional Tailwind classes on the wrapper span.'],
            ],
          },
          {
            name: 'AvatarGroup',
            description:
              'Stacks Avatars with overlap. Renders +N overflow badge when items exceed max.',
            rows: [
              ['max', 'number', '4', 'Maximum visible avatars. Excess rendered as +N badge.'],
              [
                'size',
                "'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl'",
                "'default'",
                'Forwarded to all child Avatars and the overflow badge.',
              ],
              [
                'shape',
                "'circle' | 'square'",
                "'circle'",
                'Forwarded to all child Avatars and the overflow badge.',
              ],
              ['className', 'string', '—', 'Additional Tailwind classes on the group wrapper div.'],
            ],
          },
        ].map(({ name, description, rows }) => (
          <SubSection key={name} title={name} description={description}>
            <div className="overflow-x-auto mb-2">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    {['Prop', 'Type', 'Default', 'Description'].map((h) => (
                      <th
                        key={h}
                        className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700 text-xs uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map(([prop, type, def, desc]) => (
                    <tr key={prop} className="even:bg-gray-50">
                      <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs whitespace-nowrap">
                        {prop}
                      </td>
                      <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500">
                        {type}
                      </td>
                      <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400 whitespace-nowrap">
                        {def}
                      </td>
                      <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700">
                        {desc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SubSection>
        ))}
      </Section>

      {/* When to Use */}
      <Section title="When to Use">
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {['Use Avatar when…', 'Consider an alternative when…'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700 text-xs uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700 align-top">
                  <ul className="flex flex-col gap-1.5">
                    <li>
                      Representing a person's identity — profile picture, initials, or a generic
                      user icon.
                    </li>
                    <li>
                      Showing a user in a list, comment thread, chat message, or activity feed.
                    </li>
                    <li>
                      Stacking multiple contributors or participants with{' '}
                      <code className="font-mono">AvatarGroup</code>.
                    </li>
                    <li>
                      Displaying a user's presence or availability using{' '}
                      <code className="font-mono">AvatarStatus</code>.
                    </li>
                  </ul>
                </td>
                <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700 align-top">
                  <ul className="flex flex-col gap-1.5">
                    <li>
                      Use <strong>Badge</strong> when showing a status label or count with no
                      identity context (e.g. "3 new", "Active").
                    </li>
                    <li>
                      Use an <strong>Icon button</strong> when the purpose is an action rather than
                      representing a person.
                    </li>
                    <li>
                      Use a plain <strong>icon</strong> when representing a non-person entity such
                      as a team, company, or product.
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Dos & Don'ts */}
      <Section title="Dos & Don'ts">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="size-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                ✓
              </span>
              <span className="text-sm font-semibold text-green-700">Do</span>
            </div>
            <div className="space-y-3">
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <p className="text-xs text-green-800">
                  Always pair{' '}
                  <code className="font-mono bg-green-100 px-1 rounded">AvatarImage</code> with an{' '}
                  <code className="font-mono bg-green-100 px-1 rounded">AvatarFallback</code> so the
                  avatar always shows something meaningful when the image URL fails or is slow to
                  load.
                </p>
              </div>
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <p className="text-xs text-green-800">
                  Use 1–2 uppercase initials in{' '}
                  <code className="font-mono bg-green-100 px-1 rounded">AvatarFallback</code> (e.g.
                  "RC"). They are compact, instantly readable, and maintain consistent visual weight
                  across all sizes.
                </p>
              </div>
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <p className="text-xs text-green-800">
                  Use <code className="font-mono bg-green-100 px-1 rounded">ping</code> only on{' '}
                  <code className="font-mono bg-green-100 px-1 rounded">status="online"</code> —
                  ping signals active presence, which maps naturally to "currently online."
                </p>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="size-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
                ✕
              </span>
              <span className="text-sm font-semibold text-red-700">Don't</span>
            </div>
            <div className="space-y-3">
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <p className="text-xs text-red-800">
                  Don't render{' '}
                  <code className="font-mono bg-red-100 px-1 rounded">AvatarImage</code> alone
                  without a fallback — a broken image leaves an empty circle with no visual
                  feedback, which looks like a layout bug.
                </p>
              </div>
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <p className="text-xs text-red-800">
                  Don't add <code className="font-mono bg-red-100 px-1 rounded">AvatarStatus</code>{' '}
                  on <code className="font-mono bg-red-100 px-1 rounded">xs</code> or{' '}
                  <code className="font-mono bg-red-100 px-1 rounded">sm</code> avatars — the dot
                  overlaps the initials area and becomes too small to read or tap.
                </p>
              </div>
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <p className="text-xs text-red-800">
                  Don't set a very high{' '}
                  <code className="font-mono bg-red-100 px-1 rounded">max</code> in tight layouts.
                  Keep it at 3–5 so the overflow badge stays meaningful and the group does not
                  stretch its container.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Best Practices */}
      <Section title="Best Practices">
        <div className="flex flex-col gap-8">
          {[
            {
              heading: 'When to use',
              items: [
                {
                  title: 'Use in navbars, comment threads, and activity feeds',
                  body: 'Avatars represent the author or actor of an event — they add a human face to content and reduce anonymity in collaborative interfaces.',
                },
                {
                  title: 'Use AvatarGroup to show a compact summary of participants',
                  body: '"3 people are working on this" is more scannable as stacked avatars than as a list of names. Use it in card footers, task rows, and collaboration surfaces.',
                },
                {
                  title: 'Use AvatarStatus with ping when real-time presence matters',
                  body: 'Pair ping with status="online" in chat interfaces where users need to know who is currently active. Static dots are enough for passive presence indicators.',
                },
              ],
            },
            {
              heading: 'When not to use',
              items: [
                {
                  title: "Don't use Avatar to represent non-person entities",
                  body: 'Teams, products, and companies should use a plain icon or logo image. Circular avatars imply a human identity — shape="square" with an icon is more appropriate for resources.',
                },
                {
                  title: "Don't use ping on offline, busy, or away status",
                  body: 'A pulsing animation implies active, real-time presence. Pairing it with offline, busy, or away sends a contradictory signal that confuses users.',
                },
                {
                  title: "Don't use Avatar as an unlabeled clickable action",
                  body: 'If the click intent is "open menu" or "view profile", always add an aria-label describing the action — role="button" is set automatically but screen readers also need the action context.',
                },
              ],
            },
            {
              heading: 'Accessibility',
              items: [
                {
                  title: 'Set a meaningful alt on AvatarImage',
                  body: 'Use the user\'s name, not "avatar" or "photo". If the image is purely decorative and initials already convey identity, pass alt="".',
                },
                {
                  title: 'Add aria-label when using onClick',
                  body: 'The root span automatically receives role="button" and keyboard handling — but screen readers also need the action label, e.g. aria-label="View Cahya\'s profile".',
                },
                {
                  title: 'AvatarFallback is always present in the DOM',
                  body: 'It renders at z-0 behind the image. Screen readers that ignore images still receive the initials text as meaningful content — no extra ARIA needed.',
                },
              ],
            },
            {
              heading: 'Advice',
              items: [
                {
                  title: 'Match size to the surrounding context',
                  body: 'Use xs/sm for dense tables and inline mentions; lg/xl for profile headers and detail pages. Mismatched sizes make avatars feel out of place in the layout.',
                },
                {
                  title: 'Pair shape="square" with resource entities, not people',
                  body: 'Use square for workspaces, integrations, or product logos in card or table row contexts. Mixing square and circle in the same list implies different entity types.',
                },
                {
                  title: 'In AvatarGroup, always set max explicitly',
                  body: 'The default of 4 may show too many avatars in compact layouts like card footers or table cells. Keep max at 3–5 so the +N badge stays meaningful.',
                },
              ],
            },
          ].map(({ heading, items }) => (
            <div key={heading}>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                {heading}
              </p>
              <div className="flex flex-col gap-3">
                {items.map(({ title, body }) => (
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
      </Section>
    </div>
  ),
}
