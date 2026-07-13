import { useState } from 'react'
import { Search, Mail, DollarSign, Percent, Globe, Lock, AtSign, Eye, EyeOff } from 'lucide-react'
import FieldContent from '../Field/FieldContent'
import FieldControl from '../Field/FieldControl'
import FieldLabel from '../Field/FieldLabel'
import FieldPrefix from '../Field/FieldPrefix'
import FieldSuffix from '../Field/FieldSuffix'
import Input from './Input'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Input Field/Affix',
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

export const TextAffix = {
  name: 'Text Affix',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Short strings as prefix or suffix — currency symbols, URL schemes, domain extensions, and
        unit labels. Input adjusts its left or right padding automatically when{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldPrefix</code> or{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldSuffix</code> is detected
        inside <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldControl</code>.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          text prefix (Rp), text suffix (%), prefix + suffix (Rp … IDR)
        </span>
        <div className="flex flex-col gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg w-72">
          <FieldContent>
            <FieldLabel>Price</FieldLabel>
            <FieldControl>
              <FieldPrefix>Rp</FieldPrefix>
              <Input type="number" placeholder="0" />
            </FieldControl>
          </FieldContent>
          <FieldContent>
            <FieldLabel>Interest rate</FieldLabel>
            <FieldControl>
              <Input type="number" placeholder="0" />
              <FieldSuffix>%</FieldSuffix>
            </FieldControl>
          </FieldContent>
          <FieldContent>
            <FieldLabel>Amount</FieldLabel>
            <FieldControl>
              <FieldPrefix>Rp</FieldPrefix>
              <Input type="number" placeholder="0" />
              <FieldSuffix>IDR</FieldSuffix>
            </FieldControl>
          </FieldContent>
          <FieldContent>
            <FieldLabel>Website</FieldLabel>
            <FieldControl>
              <FieldPrefix>https://</FieldPrefix>
              <Input placeholder="yoursite" />
              <FieldSuffix>.com</FieldSuffix>
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
                  'Use text affixes for domain-specific units and URL schemes that are always fixed',
                body: '"Rp", "https://", "%", and ".com" are short, universally understood in context, and make the expected format immediately clear. Text is more legible than an icon for unit-style affixes.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title:
                  "Don't use a fixed text suffix for variable units — use a companion Select instead",
                body: 'If the user might need USD, IDR, or EUR, a static "IDR" suffix misleads them. Put a Select next to the Input so they can choose the currency, and drop the suffix entirely.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'Mention the unit in FieldLabel or FieldDescription — affix text is invisible to screen readers',
                body: 'FieldPrefix and FieldSuffix content is not read by screen readers. For meaningful units like "%" or "Rp", include the unit in the label (e.g. "Interest rate (%)") or in a FieldDescription.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Keep affix text to 1–6 characters for best visual balance',
                body: 'Long affixes push the typed content too far in and make the input look unbalanced. If the prefix or suffix is longer than 6 characters, consider placing it as static text outside the input instead.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Text prefix */}
<FieldControl>
  <FieldPrefix>Rp</FieldPrefix>
  <Input type="number" placeholder="0" />
</FieldControl>

{/* Text suffix */}
<FieldControl>
  <Input type="number" placeholder="0" />
  <FieldSuffix>%</FieldSuffix>
</FieldControl>

{/* Both */}
<FieldControl>
  <FieldPrefix>Rp</FieldPrefix>
  <Input type="number" placeholder="0" />
  <FieldSuffix>IDR</FieldSuffix>
</FieldControl>`}</code>
      </pre>
    </div>
  ),
}

export const IconAffix = {
  name: 'Icon Affix',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Lucide icons as prefix or suffix. Icons are automatically sized to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">size-3.5</code> and vertically
        centered inside the affix. Use icon prefixes for search, email, and lock fields — context
        makes the icon meaning obvious.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">icon prefix — search, email, at sign, dollar</span>
        <div className="flex flex-col gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg w-72">
          <FieldControl>
            <FieldPrefix>
              <Search />
            </FieldPrefix>
            <Input placeholder="Search…" aria-label="Search" />
          </FieldControl>
          <FieldContent>
            <FieldLabel>Email</FieldLabel>
            <FieldControl>
              <FieldPrefix>
                <Mail />
              </FieldPrefix>
              <Input type="email" placeholder="you@example.com" />
            </FieldControl>
          </FieldContent>
          <FieldContent>
            <FieldLabel>Username</FieldLabel>
            <FieldControl>
              <FieldPrefix>
                <AtSign />
              </FieldPrefix>
              <Input placeholder="username" />
            </FieldControl>
          </FieldContent>
          <FieldContent>
            <FieldLabel>Amount</FieldLabel>
            <FieldControl>
              <FieldPrefix>
                <DollarSign />
              </FieldPrefix>
              <Input type="number" placeholder="0.00" />
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
                title: 'Use icon prefixes when the icon is universally understood in its context',
                body: 'A search magnifier, envelope for email, and lock for password are recognised by most users without a text label. Icons save horizontal space and add visual scent — use them when meaning is clear from the field type.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use an icon when users may not recognise it without a text label",
                body: 'Obscure icons (e.g. a custom branded icon) or ambiguous ones (e.g. a star that could mean favourite or required) confuse users. Switch to a short text affix or move the icon to FieldLabel.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'Icon affixes have no alt text — label the field with FieldLabel or aria-label',
                body: 'An icon in FieldPrefix is a decorative visual. Screen readers skip it. The Input must have an accessible name from FieldLabel or aria-label (for standalone usage without FieldContent).',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Mix icon prefix with text suffix (or vice versa) for the best visual balance',
                body: 'A Search icon prefix + standalone input looks clean. A DollarSign prefix + "USD" suffix gives balanced context on both sides. Avoid two text affixes of very different lengths — they create visual asymmetry.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Standalone search bar */}
<FieldControl>
  <FieldPrefix><Search /></FieldPrefix>
  <Input placeholder="Search…" aria-label="Search" />
</FieldControl>

{/* Inside FieldContent */}
<FieldContent>
  <FieldLabel>Email</FieldLabel>
  <FieldControl>
    <FieldPrefix><Mail /></FieldPrefix>
    <Input type="email" placeholder="you@example.com" />
  </FieldControl>
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}

export const InteractiveSuffix = {
  name: 'Interactive Suffix',
  render: () => {
    const Demo = () => {
      const [show, setShow] = useState(false)
      return (
        <FieldContent>
          <FieldLabel>Password</FieldLabel>
          <FieldControl>
            <FieldPrefix>
              <Lock />
            </FieldPrefix>
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
      )
    }
    return (
      <div className="flex flex-col gap-6 w-full">
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
          By default FieldSuffix is{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">pointer-events-none</code>.
          Add{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">pointer-events-auto</code>{' '}
          and an <code className="font-mono bg-gray-100 px-1 rounded text-xs">onClick</code> handler
          to make it interactive — the password visibility toggle is the canonical use case.
        </p>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">
            password toggle — interactive suffix with Eye/EyeOff icon
          </span>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-72">
            <Demo />
          </div>
        </div>

        <BestPractices
          items={[
            {
              heading: 'When to use',
              cards: [
                {
                  title:
                    'Use interactive suffix for single-action controls directly related to the input value',
                  body: 'Password visibility toggle, clear button, and copy-to-clipboard are the main use cases. The action is about the input value itself — not a navigation or a form submission.',
                },
              ],
            },
            {
              heading: 'When not to use',
              cards: [
                {
                  title:
                    "Don't use interactive suffix for complex actions that open modals or navigations",
                  body: 'A suffix feels like a minor, inline action. If clicking it opens a dialog, navigates away, or triggers a significant side effect, use a Button next to the input instead so the affordance matches the weight of the action.',
                },
              ],
            },
            {
              heading: 'Accessibility',
              cards: [
                {
                  title: 'Add aria-label to the suffix span for screen reader announcement',
                  body: 'An Eye icon without a text label is ambiguous. Add aria-label="Show password" or aria-label="Hide password" on the FieldSuffix span so screen reader users know what the toggle does and what its current state is.',
                },
              ],
            },
            {
              heading: 'Advice',
              cards: [
                {
                  title:
                    'Add hover:text-foreground transition-colors for clear clickability feedback',
                  body: 'Interactive suffixes need a hover state to signal they are clickable. The muted icon brightening to foreground on hover is a subtle but universally understood affordance.',
                },
              ],
            },
          ]}
        />

        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
          <code>{`const [show, setShow] = useState(false)

<FieldControl>
  <FieldPrefix><Lock /></FieldPrefix>
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
