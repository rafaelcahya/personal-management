import FieldContent from './FieldContent'
import FieldControl from './FieldControl'
import FieldLabel from './FieldLabel'
import FieldPrefix from './FieldPrefix'
import Input from '../Input/Input'
import { Mail, Search, Lock } from 'lucide-react'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Field/FieldPrefix',
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
        Use <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldPrefix</code> with
        text strings for currency symbols, URL schemes, or unit labels that prefix the typed value.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">text prefix — scheme, currency, unit</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col gap-3 w-80">
          <FieldContent>
            <FieldLabel>Website</FieldLabel>
            <FieldControl>
              <FieldPrefix>https://</FieldPrefix>
              <Input placeholder="yoursite.com" />
            </FieldControl>
          </FieldContent>
          <FieldContent>
            <FieldLabel>Amount</FieldLabel>
            <FieldControl>
              <FieldPrefix>Rp</FieldPrefix>
              <Input type="number" placeholder="0" />
            </FieldControl>
          </FieldContent>
          <FieldContent>
            <FieldLabel>Username</FieldLabel>
            <FieldControl>
              <FieldPrefix>@</FieldPrefix>
              <Input placeholder="username" />
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
                title: 'Use text prefix for currency symbols, URL schemes, and short units',
                body: 'A text prefix like "https://", "Rp", or "@" shows users the invariant part of the input value without requiring them to type it. The prefix completes the value visually — use it when the prefix is always the same.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use a long text prefix as a substitute for a label",
                body: 'FieldPrefix is not announced by screen readers. If the prefix is the only way to understand what the input is for, add a FieldLabel as well. A prefix complements a label — it does not replace it.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'Include the prefix context in FieldLabel or FieldDescription for screen readers',
                body: 'FieldPrefix is pointer-events-none and not in the accessibility tree. If the prefix carries meaningful context (e.g. "https://"), mention it in the FieldDescription so screen reader users know the expected format.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Keep prefix text to 1–6 characters for best visual balance',
                body: 'Short text prefixes align neatly with the input content. Longer prefix strings push typed content too far right. If the prefix needs to be longer, consider whether a label annotation is a better UX choice.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldControl>
  <FieldPrefix>https://</FieldPrefix>
  <Input placeholder="yoursite.com" />
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
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldPrefix</code> — it will be
        centered and sized automatically. Icons are decorative and do not receive focus.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">icon prefix — mail, search, lock</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col gap-3 w-80">
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
            <FieldLabel>Search</FieldLabel>
            <FieldControl>
              <FieldPrefix>
                <Search />
              </FieldPrefix>
              <Input placeholder="Search..." />
            </FieldControl>
          </FieldContent>
          <FieldContent>
            <FieldLabel>Password</FieldLabel>
            <FieldControl>
              <FieldPrefix>
                <Lock />
              </FieldPrefix>
              <Input type="password" placeholder="••••••••" />
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
                title: 'Use icon prefix for well-known input types — email, search, password, URL',
                body: 'Icon prefixes work best for universally recognized symbols. A Mail icon on an email field or a Lock on a password field reinforces the input type at a glance without adding text.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use obscure icons that users won't immediately recognize",
                body: 'If users need to guess what the icon means, it adds cognitive load instead of reducing it. Prefer text prefix over ambiguous icons.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Icon prefixes are aria-hidden — they are decorative, not informational',
                body: 'Icons inside FieldPrefix are sized via CSS and have no accessible label. They should reinforce information already present in the FieldLabel, not introduce new information that only the sighted user can see.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Prefer icon prefix for search inputs and text prefix for unit/scheme inputs',
                body: 'A Search icon is a widely understood pattern for search bars. For domain-specific units like "Rp" or "https://", text makes the prefix more legible than an icon would.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldControl>
  <FieldPrefix><Mail /></FieldPrefix>
  <Input type="email" placeholder="you@example.com" />
</FieldControl>`}</code>
      </pre>
    </div>
  ),
}

export const Interactive = {
  name: 'Interactive',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldPrefix</code> works
        standalone inside{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldControl</code> without a
        wrapping <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> —
        useful for bare search bars where no label, description, or error is needed.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          search bar — FieldControl standalone, no FieldContent
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <FieldControl>
            <FieldPrefix>
              <Search />
            </FieldPrefix>
            <Input placeholder="Search products..." aria-label="Search products" />
          </FieldControl>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title:
                  'Use FieldControl standalone for search bars and filter inputs with no label',
                body: 'When an input has no label, description, or error and only needs a prefix icon, FieldControl alone is sufficient. Wrapping it in FieldContent would add unnecessary context overhead.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title:
                  "Don't skip FieldContent for inputs that could ever show an error or description",
                body: "If the input needs validation feedback or hint text, use FieldContent. FieldControl standalone has no error context — adding FieldError inside it won't receive the error prop automatically.",
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Always add aria-label to bare inputs without a visible label',
                body: 'When using FieldControl without FieldContent and FieldLabel, the input has no accessible name. Add aria-label directly to the Input so screen readers can identify it.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use the Search icon for all search inputs — it is universally understood',
                body: 'A Search icon prefix is the convention for filter and search inputs across all major design systems. Users immediately recognize the pattern without needing a label, making it ideal for compact UI areas like table toolbars.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldControl>
  <FieldPrefix><Search /></FieldPrefix>
  <Input placeholder="Search products..." aria-label="Search products" />
</FieldControl>`}</code>
      </pre>
    </div>
  ),
}
