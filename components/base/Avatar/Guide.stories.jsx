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
          indicator dot, and an <code className="font-mono text-sm">AvatarGroup</code> for stacking
          multiple avatars with overflow count. Built from scratch — no library.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <Preview>
          <Avatar size="default" shape="circle">
            <AvatarFallback>CA</AvatarFallback>
            <AvatarStatus status="online" />
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
      <Section title="Anatomy">
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4">
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wide block mb-3">
            Structure
          </span>
          <div className="relative p-4 border-2 border-dashed border-violet-400 rounded-xl">
            <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-[10px] font-mono font-semibold text-violet-600">
              Avatar
            </span>
            <div className="flex flex-col gap-2 mt-1">
              {[
                ['AvatarImage', 'violet-300', '<img> — loads on top (z-10). Hidden on error.'],
                [
                  'AvatarFallback',
                  'blue-300',
                  '<span> — always rendered (z-0). Shows when image absent or errored.',
                ],
                ['AvatarStatus', 'green-300', '<span> — absolute bottom-right dot. Optional.'],
              ].map(([name, color, desc]) => (
                <div
                  key={name}
                  className={`relative p-2 border border-dashed border-${color} rounded-lg`}
                >
                  <span
                    className={`absolute -top-2 left-2 bg-gray-50 px-0.5 text-[10px] font-mono text-${color.replace('-300', '-500')}`}
                  >
                    {name}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-0.5">{desc}</p>
                </div>
              ))}
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
                  '<span> (Context Root)',
                  'Root. Sets size and shape. Manages image error state via Context.',
                ],
                [
                  'AvatarImage',
                  '<img>',
                  'Profile image. Hides itself on error, revealing AvatarFallback.',
                ],
                [
                  'AvatarFallback',
                  '<span>',
                  'Shown when image is absent or fails to load. Renders initials or icon.',
                ],
                [
                  'AvatarStatus',
                  '<span>',
                  'Colored dot at bottom-right. Indicates online/offline/busy/away.',
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

        <Code>{`<Avatar size="default" shape="circle">
  <AvatarImage src="/avatar.jpg" alt="Cahya" />
  <AvatarFallback>CA</AvatarFallback>
  <AvatarStatus status="online" />
</Avatar>`}</Code>
      </Section>

      {/* Usage */}
      <Section title="Usage">
        <SubSection title="Import">
          <Code>{`import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarStatus,
  AvatarGroup,
} from '@/components/base/Avatar/Avatar'`}</Code>
        </SubSection>

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

        <SubSection title="With status">
          <Code>{`<Avatar size="default">
  <AvatarFallback>CA</AvatarFallback>
  <AvatarStatus status="online" />
</Avatar>

{/* status: "online" | "offline" | "busy" | "away" */}`}</Code>
        </SubSection>

        <SubSection title="Avatar group">
          <Code>{`<AvatarGroup max={3} size="sm">
  <Avatar><AvatarFallback>A</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>B</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>C</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>D</AvatarFallback></Avatar>
  {/* 4 avatars, max=3 → shows 3 + "+1" badge */}
</AvatarGroup>`}</Code>
        </SubSection>
      </Section>

      {/* API Reference */}
      <Section title="API Reference">
        <SubSection
          title="Avatar"
          description="Root component. Manages size, shape, and image error state."
        >
          <div className="overflow-x-auto mb-6">
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
                {[
                  [
                    'size',
                    "'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl'",
                    "'default'",
                    'Avatar dimensions: xs=24px, sm=32px, default=40px, lg=48px, xl=64px, 2xl=80px.',
                  ],
                  [
                    'shape',
                    "'circle' | 'square'",
                    "'circle'",
                    'Border radius. circle=rounded-full, square=rounded-lg.',
                  ],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs">
                      {prop}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500">
                      {type}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400">
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

        <SubSection
          title="AvatarImage"
          description="Profile image. Hides on error, revealing AvatarFallback."
        >
          <div className="overflow-x-auto mb-6">
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
                {[
                  ['src', 'string', '—', 'Image URL.'],
                  ['alt', 'string', "''", 'Alt text for accessibility.'],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs">
                      {prop}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500">
                      {type}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400">
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

        <SubSection title="AvatarStatus" description="Status indicator dot at bottom-right.">
          <div className="overflow-x-auto mb-6">
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
                {[
                  [
                    'status',
                    "'online' | 'offline' | 'busy' | 'away'",
                    "'online'",
                    'online=green, offline=gray, busy=red, away=amber.',
                  ],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs">
                      {prop}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500">
                      {type}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400">
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

        <SubSection
          title="AvatarGroup"
          description="Stacks Avatars with overlap. Shows +N overflow badge."
        >
          <div className="overflow-x-auto mb-6">
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
                {[
                  ['max', 'number', '4', 'Maximum visible avatars. Excess rendered as +N badge.'],
                  [
                    'size',
                    "'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl'",
                    "'default'",
                    'Size forwarded to all child Avatars.',
                  ],
                  [
                    'shape',
                    "'circle' | 'square'",
                    "'circle'",
                    'Shape forwarded to all child Avatars.',
                  ],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop} className="even:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-200 font-mono text-violet-700 text-xs">
                      {prop}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-500">
                      {type}
                    </td>
                    <td className="px-3 py-2 border border-gray-200 font-mono text-xs text-gray-400">
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
      </Section>
    </div>
  ),
}
