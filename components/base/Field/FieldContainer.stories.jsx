import FieldContainer from './FieldContainer'
import FieldContent from './FieldContent'
import FieldControl from './FieldControl'
import FieldLabel from './FieldLabel'
import Input from '../Input/Input'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Field/FieldContainer',
}

export default meta

export const GapVariants = {
  name: 'Gap Variants',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContainer</code> controls
        vertical spacing between fields via the{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">gap</code> prop. Choose from{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">sm</code>,{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">base</code>,{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">md</code>, or{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">lg</code>.
      </p>

      <div className="flex flex-col gap-12 max-w-sm w-full">
        {['sm', 'base', 'md', 'lg'].map((gap) => (
          <div key={gap}>
            <p className="text-xs font-mono text-violet-700 mb-2">gap="{gap}"</p>
            <FieldContainer gap={gap}>
              <FieldContent size="base">
                <FieldLabel>First Name</FieldLabel>
                <FieldControl>
                  <Input placeholder="John" />
                </FieldControl>
              </FieldContent>
              <FieldContent size="base">
                <FieldLabel>Last Name</FieldLabel>
                <FieldControl>
                  <Input placeholder="Doe" />
                </FieldControl>
              </FieldContent>
              <FieldContent size="base">
                <FieldLabel>Email</FieldLabel>
                <FieldControl>
                  <Input placeholder="john@example.com" />
                </FieldControl>
              </FieldContent>
            </FieldContainer>
          </div>
        ))}
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContainer gap="md">
  <FieldContent size="base">
    <FieldLabel>First Name</FieldLabel>
    <FieldControl><Input placeholder="John" /></FieldControl>
  </FieldContent>
  <FieldContent size="base">
    <FieldLabel>Last Name</FieldLabel>
    <FieldControl><Input placeholder="Doe" /></FieldControl>
  </FieldContent>
</FieldContainer>`}</code>
      </pre>
    </div>
  ),
}

export const Nested = {
  name: 'Nested',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        A <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContainer</code> can be
        nested inside another{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContainer</code>. Use the
        outer one to control spacing between sections, and the inner ones to control spacing within
        each section independently.
      </p>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm w-full max-w-sm">
        <FieldContainer gap="lg">
          <FieldContainer gap="base">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Account</p>
            <FieldContent size="base" required>
              <FieldLabel>Email</FieldLabel>
              <FieldControl>
                <Input placeholder="you@example.com" />
              </FieldControl>
            </FieldContent>
            <FieldContent size="base" required>
              <FieldLabel>Password</FieldLabel>
              <FieldControl>
                <Input type="password" placeholder="••••••••" />
              </FieldControl>
            </FieldContent>
          </FieldContainer>
          <FieldContainer gap="base">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Profile</p>
            <FieldContent size="base">
              <FieldLabel>Display Name</FieldLabel>
              <FieldControl>
                <Input placeholder="Cahya" />
              </FieldControl>
            </FieldContent>
            <FieldContent size="base">
              <FieldLabel>Bio</FieldLabel>
              <FieldControl>
                <Input placeholder="Tell us about yourself" />
              </FieldControl>
            </FieldContent>
          </FieldContainer>
        </FieldContainer>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContainer gap="lg">

  <FieldContainer gap="base">
    <p>Account</p>
    <FieldContent size="base" required>
      <FieldLabel>Email</FieldLabel>
      <FieldControl><Input placeholder="you@example.com" /></FieldControl>
    </FieldContent>
    <FieldContent size="base" required>
      <FieldLabel>Password</FieldLabel>
      <FieldControl><Input type="password" placeholder="••••••••" /></FieldControl>
    </FieldContent>
  </FieldContainer>

  <FieldContainer gap="base">
    <p>Profile</p>
    <FieldContent size="base">
      <FieldLabel>Display Name</FieldLabel>
      <FieldControl><Input placeholder="Cahya" /></FieldControl>
    </FieldContent>
    <FieldContent size="base">
      <FieldLabel>Bio</FieldLabel>
      <FieldControl><Input placeholder="Tell us about yourself" /></FieldControl>
    </FieldContent>
  </FieldContainer>

</FieldContainer>`}</code>
      </pre>
    </div>
  ),
}
