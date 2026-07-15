import FieldContent from './FieldContent'
import FieldControl from './FieldControl'
import FieldLabel from './FieldLabel'
import FieldPrefix from './FieldPrefix'
import FieldError from './FieldError'
import Input from '../Input/Input'
import { Mail } from 'lucide-react'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Field/FieldError',
}

export default meta

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

export const Default = {
  name: 'Default',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        The standard pattern: pass an{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">error</code> string to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> and drop an
        empty{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">&lt;FieldError /&gt;</code>{' '}
        inside — the message is read automatically from context and the Input enters its error
        state.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          error via FieldContent context — field + message in sync
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <FieldContent required error="Enter a valid email address.">
            <FieldLabel>Email</FieldLabel>
            <FieldControl>
              <FieldPrefix>
                <Mail />
              </FieldPrefix>
              <Input type="email" placeholder="you@example.com" defaultValue="not-an-email" />
            </FieldControl>
            <FieldError />
          </FieldContent>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title:
                  'Always use the context pattern — pass error to FieldContent, drop <FieldError /> inside',
                body: "Passing error to FieldContent is the recommended pattern. It wires the error message to FieldError, sets the Input's aria-invalid and aria-errormessage attributes, and triggers the Input's error variant — all automatically.",
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title:
                  "Don't set error on FieldContent when the field has no FieldError child — it won't show",
                body: 'The error prop on FieldContent sets context state and styles the Input, but the message is only displayed when a FieldError component is present. Always include <FieldError /> in the field tree when you pass error.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'FieldError has role="alert" — it announces immediately when it appears',
                body: "When FieldError mounts with a message, screen readers announce it as an alert. This means the user is immediately told what went wrong without needing to re-focus the input. Don't conditionally hide FieldError when there's a message — let it stay in the DOM.",
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Write specific, actionable error messages — not just "Invalid input"',
                body: '"Enter a valid email address" tells the user exactly what is wrong and what to fix. "Invalid input" does not. Always write error messages from the user\'s perspective: what happened and what they should do next.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent required error="Enter a valid email address.">
  <FieldLabel>Email</FieldLabel>
  <FieldControl>
    <Input type="email" placeholder="you@example.com" />
  </FieldControl>
  <FieldError />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}

export const Inline = {
  name: 'Inline',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Pass a message directly as{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">children</code> to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldError</code> to override
        or supplement the context error. The children value takes precedence over the context error
        message.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          FieldError with explicit children — overrides context message
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <FieldContent required error="Context error (overridden)">
            <FieldLabel>Password</FieldLabel>
            <FieldControl>
              <Input type="password" placeholder="••••••••" defaultValue="short" />
            </FieldControl>
            <FieldError>Must be at least 8 characters with one uppercase letter.</FieldError>
          </FieldContent>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title:
                  'Use inline children when the error message needs to be more specific than the context error',
                body: 'Sometimes form validation returns a generic error code while the UI needs a user-friendly message. Pass the user-friendly string directly as FieldError children to display it without changing the context error prop.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title:
                  "Don't use inline children as the only error mechanism — always set error on FieldContent too",
                body: "FieldError children display a message, but the Input's aria-invalid and error variant are driven by the error prop on FieldContent. If you skip that prop, the input looks normal even while FieldError shows a message.",
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'Inline children still render with role="alert" — the announcement behavior is unchanged',
                body: 'Regardless of whether the message comes from context or from children, FieldError always renders with role="alert". The screen reader announcement works the same way.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Prefer context-driven errors in react-hook-form integrations',
                body: 'When using react-hook-form, pass the field error message to FieldContent.error instead of duplicating it in FieldError children. This keeps the error source in one place and makes it easy to clear.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent required error="Required">
  <FieldLabel>Password</FieldLabel>
  <FieldControl>
    <Input type="password" placeholder="••••••••" />
  </FieldControl>
  <FieldError>Must be at least 8 characters with one uppercase letter.</FieldError>
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}

export const NullRender = {
  name: 'Null Render',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldError</code> renders
        nothing when there is no error — neither{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent.error</code> nor
        children produce a message. This means you can always include{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">&lt;FieldError /&gt;</code> in
        the field tree without worrying about it taking up space.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          no error — FieldError renders nothing, field looks normal
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <FieldContent required>
            <FieldLabel>Username</FieldLabel>
            <FieldControl>
              <Input placeholder="your_username" />
            </FieldControl>
            <FieldError />
          </FieldContent>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title:
                  'Always include <FieldError /> in the field tree — it is safe when there is no error',
                body: 'Because FieldError returns null when there is no message, you can always include it. This makes toggling error state easy: just update the error prop on FieldContent and FieldError will appear automatically.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't conditionally render FieldError — let the null guard handle it",
                body: 'Wrapping FieldError in a conditional like {error && <FieldError />} is redundant. FieldError already returns null internally when there is no message. The extra conditional adds noise without any benefit.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'FieldError mounting with a message is what triggers the alert announcement',
                body: 'role="alert" fires when the element appears in the DOM with content. If you conditionally render FieldError only when there is an error, the alert fires correctly on mount. If you always render it but change the content, the announcement may not fire in all browsers — prefer the null guard pattern.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Include FieldError in every FieldContent that will ever show validation errors',
                body: 'Even if a field starts with no error, include <FieldError /> from the beginning so that when validation runs and error is set, the message appears immediately without needing a component tree change.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* FieldError renders nothing — field looks normal */}
<FieldContent required>
  <FieldLabel>Username</FieldLabel>
  <FieldControl>
    <Input placeholder="your_username" />
  </FieldControl>
  <FieldError />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
