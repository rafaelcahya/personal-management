'use client'
import { useState } from 'react'
import PasswordInput from './PasswordInput'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldDescription from '../Field/FieldDescription'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Input/Password Input/Basic' }
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
        A password input with a built-in show/hide toggle. Wrap in{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> to wire up
        the accessible label and description automatically. The toggle is keyboard-accessible via{' '}
        <kbd className="font-mono bg-gray-100 px-1 rounded text-xs">Enter</kbd> and{' '}
        <kbd className="font-mono bg-gray-100 px-1 rounded text-xs">Space</kbd>.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          inside FieldContent — label and description auto-wired
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-72">
          <FieldContent required>
            <FieldLabel>Password</FieldLabel>
            <FieldDescription>Must be at least 8 characters.</FieldDescription>
            <PasswordInput placeholder="Enter password" />
          </FieldContent>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          standalone — no FieldContent (accessible name missing)
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-72">
          <PasswordInput placeholder="Enter password" aria-label="Password" />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use PasswordInput for every field that accepts a password or secret token',
                body: 'The show/hide toggle reduces transcription errors and helps users verify what they typed. It is especially important on mobile where typing accuracy is lower.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use PasswordInput for non-secret fields",
                body: 'A show/hide toggle on an email or username field confuses users — they expect the toggle only on password fields. Use a plain Input for any field that is not a secret.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Always wrap in FieldContent with a FieldLabel for accessible name wiring',
                body: 'FieldContent auto-generates the id and wires it to FieldLabel via htmlFor. Without this, the input has no accessible name and screen readers cannot announce what the field is for.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: "Don't pass type as a prop — PasswordInput manages it internally",
                body: 'PasswordInput toggles between type="password" and type="text" to handle show/hide. Passing a type prop will override this logic and break the toggle behavior.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent required>
  <FieldLabel>Password</FieldLabel>
  <FieldDescription>Must be at least 8 characters.</FieldDescription>
  <PasswordInput placeholder="Enter password" />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}

export const StrengthMeter = {
  name: 'Strength Meter',
  render: () => {
    const BarsDemo = () => {
      const [value, setValue] = useState('')
      return (
        <FieldContent required>
          <FieldLabel>Password</FieldLabel>
          <PasswordInput
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type to see strength"
            strengthMeter
            meterVariant="bars"
          />
          <FieldDescription>
            Use 12+ characters with uppercase, numbers, and symbols.
          </FieldDescription>
        </FieldContent>
      )
    }
    const FullDemo = () => {
      const [value, setValue] = useState('')
      return (
        <FieldContent required>
          <FieldLabel>Password</FieldLabel>
          <PasswordInput
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type to see strength"
            strengthMeter
            meterVariant="full"
          />
          <FieldDescription>
            Use 12+ characters with uppercase, numbers, and symbols.
          </FieldDescription>
        </FieldContent>
      )
    }
    return (
      <div className="flex flex-col gap-6 w-full">
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
          Add <code className="font-mono bg-gray-100 px-1 rounded text-xs">strengthMeter</code> to
          show a live strength indicator as the user types. Use{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">meterVariant</code> to choose
          between 5 discrete bar segments or a single animated progress bar.
        </p>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">
            meterVariant="bars" (default) — 5 discrete segments
          </span>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-72">
            <BarsDemo />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">
            meterVariant="full" — single animated progress bar
          </span>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-72">
            <FullDemo />
          </div>
        </div>

        <BestPractices
          items={[
            {
              heading: 'When to use',
              cards: [
                {
                  title: 'Enable strengthMeter on sign-up and change-password forms',
                  body: 'Real-time feedback motivates users to create stronger passwords. The meter appears only when the field has a value, so empty fields are not cluttered with an empty indicator.',
                },
              ],
            },
            {
              heading: 'When not to use',
              cards: [
                {
                  title: "Don't enable strengthMeter on login forms",
                  body: 'Strength feedback is only meaningful when the user is creating or changing a password. On a login form, the meter is irrelevant and adds visual noise.',
                },
              ],
            },
            {
              heading: 'Accessibility',
              cards: [
                {
                  title:
                    'Pair the strength meter with a FieldDescription for screen reader context',
                  body: 'The strength meter is a visual indicator — screen readers skip it. Add a FieldDescription like "Use 12+ characters with uppercase, numbers, and symbols" so the password requirements are always readable.',
                },
              ],
            },
            {
              heading: 'Advice',
              cards: [
                {
                  title:
                    'Use meterVariant="full" for a more polished look in prominent sign-up flows',
                  body: 'The full animated bar is more visually expressive and pairs well with a larger, hero-style sign-up form. The bars variant is more compact and fits naturally in dense forms or modals.',
                },
              ],
            },
          ]}
        />

        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
          <code>{`{/* bars variant (default) */}
<PasswordInput
  value={value}
  onChange={e => setValue(e.target.value)}
  strengthMeter
/>

{/* full animated bar */}
<PasswordInput
  value={value}
  onChange={e => setValue(e.target.value)}
  strengthMeter
  meterVariant="full"
/>`}</code>
        </pre>
      </div>
    )
  },
}
