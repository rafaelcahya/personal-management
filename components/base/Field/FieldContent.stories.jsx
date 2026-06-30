import FieldContent from './FieldContent'
import FieldControl from './FieldControl'
import FieldLabel from './FieldLabel'
import FieldDescription from './FieldDescription'
import FieldError from './FieldError'
import FieldPrefix from './FieldPrefix'
import FieldSuffix from './FieldSuffix'
import Input from '../Input/Input'
import { Mail, Globe } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Field/FieldContent',
}

export default meta

export const Default = {
  name: 'Default',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> is the root
        field wrapper — it manages context for label, control, description, and error
        sub-components.
      </p>

      <div className="w-80">
        <FieldContent size="base">
          <FieldLabel>Email</FieldLabel>
          <FieldControl>
            <Input placeholder="you@example.com" />
          </FieldControl>
          <FieldDescription>We'll never share your email.</FieldDescription>
        </FieldContent>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent size="base">
  <FieldLabel>Email</FieldLabel>
  <FieldControl><Input placeholder="you@example.com" /></FieldControl>
  <FieldDescription>We'll never share your email.</FieldDescription>
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}

export const Required = {
  name: 'Required',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">required</code> to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> —{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldLabel</code> automatically
        shows a red asterisk.
      </p>

      <div className="w-80">
        <FieldContent size="base" required>
          <FieldLabel>Email</FieldLabel>
          <FieldControl>
            <Input placeholder="you@example.com" />
          </FieldControl>
          <FieldDescription>Required — FieldLabel shows red *</FieldDescription>
        </FieldContent>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent size="base" required>
  <FieldLabel>Email</FieldLabel>
  <FieldControl><Input placeholder="you@example.com" /></FieldControl>
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}

export const ErrorState = {
  name: 'Error State',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">error</code> to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> — Input
        automatically gets a red border and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldError</code> renders the
        message.
      </p>

      <div className="w-80">
        <FieldContent size="base" required error="Enter a valid email address.">
          <FieldLabel>Email</FieldLabel>
          <FieldControl>
            <Input defaultValue="wrong@" />
          </FieldControl>
          <FieldError />
        </FieldContent>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent size="base" required error="Enter a valid email address.">
  <FieldLabel>Email</FieldLabel>
  <FieldControl>
    <Input defaultValue="wrong@" />
  </FieldControl>
  <FieldError />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}

export const Disabled = {
  name: 'Disabled',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">disabled</code> to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> — the input
        and label are visually dimmed and the input is not interactive.
      </p>

      <div className="w-80">
        <FieldContent size="base" disabled>
          <FieldLabel>User ID</FieldLabel>
          <FieldControl>
            <Input defaultValue="usr_abc123" />
          </FieldControl>
          <FieldDescription>Auto-generated. Cannot be changed.</FieldDescription>
        </FieldContent>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent size="base" disabled>
  <FieldLabel>User ID</FieldLabel>
  <FieldControl><Input defaultValue="usr_abc123" /></FieldControl>
  <FieldDescription>Auto-generated. Cannot be changed.</FieldDescription>
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}

export const Orientation = {
  name: 'Orientation',
  render: () => (
    <div className="flex flex-col items-center gap-8 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> supports
        two orientations.{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">vertical</code> stacks label
        above control (default).{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">horizontal</code> puts label
        and description on the left, control on the right — children place themselves automatically
        via named grid areas.
      </p>

      {/* Vertical */}
      <div className="flex flex-col gap-2 w-full max-w-sm">
        <p className="text-xs font-mono text-violet-700">orientation="vertical" (default)</p>
        <div className="flex flex-col gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <FieldContent orientation="vertical" size="base" required>
            <FieldLabel>Email</FieldLabel>
            <FieldControl>
              <Input placeholder="you@example.com" />
            </FieldControl>
            <FieldDescription>We'll never share your email.</FieldDescription>
          </FieldContent>

          <FieldContent orientation="vertical" size="base" disabled>
            <FieldLabel>User ID</FieldLabel>
            <FieldControl>
              <Input defaultValue="usr_abc123" />
            </FieldControl>
            <FieldDescription>Auto-generated. Cannot be changed.</FieldDescription>
          </FieldContent>

          <FieldContent
            orientation="vertical"
            size="base"
            required
            error="Enter a valid email address."
          >
            <FieldLabel>Email</FieldLabel>
            <FieldControl>
              <Input defaultValue="wrong@" />
            </FieldControl>
            <FieldError />
          </FieldContent>
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Vertical (default — orientation prop can be omitted) */}
<FieldContent orientation="vertical" size="base" required>
  <FieldLabel>Email</FieldLabel>
  <FieldControl><Input placeholder="you@example.com" /></FieldControl>
  <FieldDescription>We'll never share your email.</FieldDescription>
</FieldContent>`}</code>
      </pre>

      {/* Horizontal */}
      <div className="flex flex-col gap-2 w-full max-w-sm">
        <p className="text-xs font-mono text-violet-700">orientation="horizontal"</p>
        <div className="flex flex-col gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <FieldContent orientation="horizontal" size="base" required>
            <FieldLabel>Push notifications</FieldLabel>
            <FieldDescription>Receive alerts for new messages and activity.</FieldDescription>
            <FieldControl>
              <Switch defaultChecked />
            </FieldControl>
          </FieldContent>

          <FieldContent orientation="horizontal" size="base" disabled>
            <FieldLabel>SMS alerts</FieldLabel>
            <FieldDescription>Not available in your region.</FieldDescription>
            <FieldControl>
              <Switch disabled />
            </FieldControl>
          </FieldContent>

          <FieldContent
            orientation="horizontal"
            size="base"
            required
            error="You must accept to continue."
          >
            <FieldLabel>Data processing agreement</FieldLabel>
            <FieldDescription>Required to use this service.</FieldDescription>
            <FieldControl>
              <Switch />
            </FieldControl>
            <FieldError />
          </FieldContent>
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent orientation="horizontal" size="base" required>
  <FieldLabel>Push notifications</FieldLabel>
  <FieldDescription>Receive alerts for new messages and activity.</FieldDescription>
  <FieldControl><Switch defaultChecked /></FieldControl>
</FieldContent>

{/* Disabled */}
<FieldContent orientation="horizontal" size="base" disabled>
  <FieldLabel>SMS alerts</FieldLabel>
  <FieldDescription>Not available in your region.</FieldDescription>
  <FieldControl><Switch disabled /></FieldControl>
</FieldContent>

{/* Error */}
<FieldContent orientation="horizontal" size="base" required error="You must accept to continue.">
  <FieldLabel>Data processing agreement</FieldLabel>
  <FieldDescription>Required to use this service.</FieldDescription>
  <FieldControl><Switch /></FieldControl>
  <FieldError />
</FieldContent>`}</code>
      </pre>

      {/* Input Field horizontal */}
      <div className="flex flex-col gap-2 w-full max-w-lg">
        <p className="text-xs font-mono text-violet-700">orientation="horizontal" — Input Field</p>
        <div className="flex flex-col gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <FieldContent orientation="horizontal" size="base" required>
            <FieldLabel>Display name</FieldLabel>
            <FieldDescription>Shown publicly on your profile.</FieldDescription>
            <FieldControl>
              <Input placeholder="Cahya" className="w-48" />
            </FieldControl>
          </FieldContent>

          <FieldContent orientation="horizontal" size="base">
            <FieldLabel>Website</FieldLabel>
            <FieldDescription>Your personal or company site.</FieldDescription>
            <FieldControl>
              <FieldPrefix>
                <Globe className="size-4" />
              </FieldPrefix>
              <Input placeholder="yoursite.com" className="w-48" />
            </FieldControl>
          </FieldContent>

          <FieldContent orientation="horizontal" size="base" disabled>
            <FieldLabel>User ID</FieldLabel>
            <FieldDescription>Auto-generated. Cannot be changed.</FieldDescription>
            <FieldControl>
              <Input defaultValue="usr_abc123" className="w-48" />
            </FieldControl>
          </FieldContent>

          <FieldContent
            orientation="horizontal"
            size="base"
            required
            error="Must be at least 3 characters."
          >
            <FieldLabel>Username</FieldLabel>
            <FieldDescription>Used to log in to your account.</FieldDescription>
            <FieldControl>
              <Input defaultValue="ab" className="w-48" />
            </FieldControl>
            <FieldError />
          </FieldContent>
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent orientation="horizontal" size="base" required>
  <FieldLabel>Display name</FieldLabel>
  <FieldDescription>Shown publicly on your profile.</FieldDescription>
  <FieldControl>
    <Input placeholder="Cahya" className="w-48" />
  </FieldControl>
</FieldContent>

{/* With icon prefix */}
<FieldContent orientation="horizontal" size="base">
  <FieldLabel>Website</FieldLabel>
  <FieldDescription>Your personal or company site.</FieldDescription>
  <FieldControl>
    <FieldPrefix><Globe className="size-4" /></FieldPrefix>
    <Input placeholder="yoursite.com" className="w-48" />
  </FieldControl>
</FieldContent>

{/* Error */}
<FieldContent orientation="horizontal" size="base" required error="Must be at least 3 characters.">
  <FieldLabel>Username</FieldLabel>
  <FieldDescription>Used to log in to your account.</FieldDescription>
  <FieldControl>
    <Input defaultValue="ab" className="w-48" />
  </FieldControl>
  <FieldError />
</FieldContent>`}</code>
      </pre>

      {/* Works with any control */}
      <div className="flex flex-col gap-2 w-full max-w-sm">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Works with any control
        </p>
        <div className="flex flex-col gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <FieldContent orientation="horizontal" size="base" required>
            <FieldLabel>Accept terms</FieldLabel>
            <FieldDescription>I agree to the Terms of Service and Privacy Policy.</FieldDescription>
            <FieldControl>
              <Checkbox />
            </FieldControl>
          </FieldContent>
          <FieldContent orientation="horizontal" size="base">
            <FieldLabel>Dark mode</FieldLabel>
            <FieldDescription>Use a dark background across the app.</FieldDescription>
            <FieldControl>
              <Switch />
            </FieldControl>
          </FieldContent>
        </div>
      </div>

      {/* Settings list pattern */}
      <div className="flex flex-col gap-2 w-full max-w-sm">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Settings list pattern
        </p>
        <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
          {[
            {
              label: 'Push notifications',
              desc: 'Receive alerts for new messages.',
              checked: true,
            },
            { label: 'Email digest', desc: 'Weekly summary of your activity.', checked: true },
            { label: 'Dark mode', desc: 'Use a dark background across the app.', checked: false },
            {
              label: 'SMS alerts',
              desc: 'Not available in your region.',
              checked: false,
              disabled: true,
            },
          ].map(({ label, desc, checked, disabled }) => (
            <div key={label} className="px-4 py-3">
              <FieldContent orientation="horizontal" size="base" disabled={disabled}>
                <FieldLabel className={disabled ? 'cursor-not-allowed' : 'cursor-pointer'}>
                  {label}
                </FieldLabel>
                <FieldDescription>{desc}</FieldDescription>
                <FieldControl>
                  <Switch defaultChecked={checked} disabled={disabled} />
                </FieldControl>
              </FieldContent>
            </div>
          ))}
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
  {settings.map(({ label, desc, checked, disabled }) => (
    <div key={label} className="px-4 py-3">
      <FieldContent orientation="horizontal" size="base" disabled={disabled}>
        <FieldLabel>{label}</FieldLabel>
        <FieldDescription>{desc}</FieldDescription>
        <FieldControl>
          <Switch defaultChecked={checked} disabled={disabled} />
        </FieldControl>
      </FieldContent>
    </div>
  ))}
</div>`}</code>
      </pre>
    </div>
  ),
}

export const Sizes = {
  name: 'Sizes',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">size</code> prop controls
        the height and padding of the input inside{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code>. All child
        components (prefix, suffix, control) scale with it.
      </p>

      <div className="flex flex-col gap-5 max-w-xs w-full">
        {['xs', 'sm', 'base', 'md', 'lg'].map((size) => (
          <FieldContent key={size} size={size}>
            <FieldLabel>size="{size}"</FieldLabel>
            <FieldControl>
              <FieldPrefix>
                <Mail />
              </FieldPrefix>
              <Input placeholder={`size ${size}`} />
              <FieldSuffix>.com</FieldSuffix>
            </FieldControl>
          </FieldContent>
        ))}
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent size="xs">...</FieldContent>
<FieldContent size="sm">...</FieldContent>
<FieldContent size="base">...</FieldContent>
<FieldContent size="md">...</FieldContent>
<FieldContent size="lg">...</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
