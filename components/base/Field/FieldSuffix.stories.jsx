import { useState } from 'react'
import FieldContent from './FieldContent'
import FieldControl from './FieldControl'
import FieldLabel from './FieldLabel'
import FieldSuffix from './FieldSuffix'
import Input from '../Input/Input'
import { Eye, EyeOff, Percent } from 'lucide-react'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Field/FieldSuffix',
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

export const Text = {
  name: 'Text',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Use <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldSuffix</code> with
        text strings for domain extensions, unit labels, or currency codes that complete the typed
        value.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">text suffix — domain, unit, currency code</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col gap-3 w-80">
          <FieldContent>
            <FieldControl>
              <Input placeholder="yoursite" />
              <FieldSuffix>.com</FieldSuffix>
            </FieldControl>
          </FieldContent>
          <FieldContent>
            <FieldControl>
              <Input type="number" placeholder="0" />
              <FieldSuffix>%</FieldSuffix>
            </FieldControl>
          </FieldContent>
          <FieldContent>
            <FieldControl>
              <Input type="number" placeholder="0" />
              <FieldSuffix>IDR</FieldSuffix>
            </FieldControl>
          </FieldContent>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use text suffix for units and extensions that complete the typed value',
                body: 'A text suffix like ".com", "%", or "IDR" shows users the invariant part of the output without requiring them to type it. Use it when the unit is always the same and always appended.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use suffix for units that vary — use a separate select input instead",
                body: 'If the unit can change (e.g. USD/EUR/IDR), a static FieldSuffix is misleading. Use a companion select input or a dropdown suffix so users can pick the correct unit.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Include the unit in the label or description for screen reader users',
                body: 'FieldSuffix is not announced by screen readers. If the suffix conveys a meaningful unit (e.g. "%" or "IDR"), include it in the FieldLabel or FieldDescription so screen reader users know what unit to type in.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Keep suffix text to 1–4 characters for best visual balance',
                body: 'Short text suffixes align neatly with the input content. Longer suffix strings push typed content too far left. If the suffix needs to be longer than 4 characters, consider a label annotation instead.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldControl>
  <Input placeholder="yoursite" />
  <FieldSuffix>.com</FieldSuffix>
</FieldControl>`}</code>
      </pre>
    </div>
  ),
}

export const Icon = {
  name: 'Icon',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Pass an icon component to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldSuffix</code> — it will be
        centered and sized automatically. Icons are decorative and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">pointer-events-none</code> by
        default.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">icon suffix — percent symbol</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <FieldContent>
            <FieldLabel>Interest rate</FieldLabel>
            <FieldControl>
              <Input type="number" placeholder="0" />
              <FieldSuffix>
                <Percent />
              </FieldSuffix>
            </FieldControl>
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
                  'Use icon suffix for interactive controls like password toggle or clear button',
                body: 'An icon suffix works best when the icon communicates an action (Eye/EyeOff for password, X for clear) or a recognized symbol (Percent). For password toggles, always add pointer-events-auto to make it clickable.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title:
                  "Don't use decorative icons that users might try to click without adding pointer-events-auto",
                body: 'By default FieldSuffix is pointer-events-none. If users try to interact with a clickable-looking icon, they will click through to the input instead. Always add pointer-events-auto to interactive icon suffixes.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Icon suffixes are aria-hidden — interactive ones need an accessible label',
                body: 'Icon suffixes have no accessible label by default. For interactive suffixes (like a password toggle button), wrap the icon in a <button> with aria-label="Show password" so keyboard users can identify and activate it.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Prefer text suffix for units, icon suffix for actions',
                body: 'A "%" suffix works better as text because it reads as a unit. An Eye icon works better as an icon because it communicates an action. Match the affix type to the nature of the content.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldControl>
  <Input type="number" placeholder="0" />
  <FieldSuffix><Percent /></FieldSuffix>
</FieldControl>`}</code>
      </pre>
    </div>
  ),
}

export const Interactive = {
  name: 'Interactive',
  render: () => {
    const [show, setShow] = useState(false)
    return (
      <div className="flex flex-col gap-6 w-full">
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
          Add{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">pointer-events-auto</code> to
          make <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldSuffix</code>{' '}
          clickable — the standard pattern for a password visibility toggle.
        </p>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">
            interactive suffix — password visibility toggle
          </span>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
            <FieldContent>
              <FieldLabel>Password</FieldLabel>
              <FieldControl>
                <Input type={show ? 'text' : 'password'} placeholder="••••••••" />
                <FieldSuffix
                  className="pointer-events-auto cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? 'Hide password' : 'Show password'}
                >
                  {show ? <EyeOff /> : <Eye />}
                </FieldSuffix>
              </FieldControl>
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
                    'Use interactive suffix for password visibility toggle — the canonical pattern',
                  body: 'A password toggle suffix (Eye/EyeOff) is the most common interactive suffix pattern. Add pointer-events-auto and an onClick handler. This pattern is widely understood and expected in password fields.',
                },
              ],
            },
            {
              heading: 'When not to use',
              cards: [
                {
                  title: "Don't use interactive suffix for complex actions that open dialogs",
                  body: 'An interactive suffix should trigger a simple, reversible state change (show/hide, clear). For actions that open a dialog or trigger a mutation, use a Button outside the input instead.',
                },
              ],
            },
            {
              heading: 'Accessibility',
              cards: [
                {
                  title:
                    'Add aria-label to the interactive suffix so keyboard users can identify it',
                  body: 'The suffix click area is not a button by default. Add aria-label directly to the FieldSuffix so screen readers and keyboard users can understand and activate the toggle.',
                },
              ],
            },
            {
              heading: 'Advice',
              cards: [
                {
                  title:
                    'Use hover:text-foreground transition-colors to signal the suffix is interactive',
                  body: 'Without a visible hover state, users may not realize the suffix is clickable. Add hover:text-foreground and transition-colors to provide visual feedback that it responds to interaction.',
                },
              ],
            },
          ]}
        />

        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
          <code>{`const [show, setShow] = useState(false)

<FieldControl>
  <Input type={show ? 'text' : 'password'} placeholder="••••••••" />
  <FieldSuffix
    className="pointer-events-auto cursor-pointer hover:text-foreground transition-colors"
    onClick={() => setShow(s => !s)}
    aria-label={show ? 'Hide password' : 'Show password'}
  >
    {show ? <EyeOff /> : <Eye />}
  </FieldSuffix>
</FieldControl>`}</code>
        </pre>
      </div>
    )
  },
}
