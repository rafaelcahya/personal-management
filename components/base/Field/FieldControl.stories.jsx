import FieldContent from './FieldContent'
import FieldControl from './FieldControl'
import FieldLabel from './FieldLabel'
import FieldPrefix from './FieldPrefix'
import FieldSuffix from './FieldSuffix'
import Input from '../Input/Input'
import { Mail, Search } from 'lucide-react'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Field/FieldControl',
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
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldControl</code> wraps the
        input row as a{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          relative flex items-center
        </code>{' '}
        container. Without a prefix or suffix it is just a transparent wrapper — always use it
        inside <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> so
        the Input receives proper context for aria attributes.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">bare FieldControl — no prefix or suffix</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <FieldContent>
            <FieldLabel>Full name</FieldLabel>
            <FieldControl>
              <Input placeholder="John Doe" />
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
                title: 'Always wrap Input in FieldControl inside FieldContent',
                body: 'FieldControl provides the relative positioning context that FieldPrefix and FieldSuffix need. It also reads orientation from FieldContent context to align correctly in horizontal layouts. Always use it even when there is no prefix or suffix.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't place FieldPrefix or FieldSuffix directly inside FieldContent",
                body: 'FieldPrefix and FieldSuffix are absolutely positioned relative to their parent. They must be inside FieldControl (position: relative) — placing them directly inside FieldContent will break their positioning.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'FieldControl itself has no ARIA role — accessibility comes from Input inside it',
                body: 'FieldControl is a layout element. The accessible name, description, and error linkage all come from the Input and the FieldContent context. FieldControl does not add any accessibility attributes.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Use FieldControl standalone for search bars and filter inputs without labels',
                body: 'FieldControl works without FieldContent for bare input rows like search bars. In that case, add aria-label directly to the Input since there is no FieldLabel to provide the accessible name.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent>
  <FieldLabel>Full name</FieldLabel>
  <FieldControl>
    <Input placeholder="John Doe" />
  </FieldControl>
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}

export const WithPrefix = {
  name: 'With Prefix',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Add a <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldPrefix</code> inside{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldControl</code> — it
        detects the prefix automatically and tells the Input to add left padding so the typed text
        does not overlap it.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          FieldControl detects the prefix and pads the Input left
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <FieldContent>
            <FieldLabel>Email</FieldLabel>
            <FieldControl>
              <FieldPrefix>
                <Mail />
              </FieldPrefix>
              <Input type="email" placeholder="you@example.com" />
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
                title: 'Use FieldControl whenever you add a prefix to an input',
                body: 'FieldControl detects FieldPrefix children by displayName and passes hasPrefix context to Input, which then applies the correct left-padding class. Without FieldControl, the prefix overlaps the typed text.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't manually add left padding to Input — let FieldControl handle it",
                body: 'FieldControl and Input work together to apply the right padding class based on prefix/suffix detection. Adding pl-* manually on Input conflicts with this automatic padding and may break the layout.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'Affix content is not announced by screen readers — include it in the label if meaningful',
                body: 'FieldPrefix and FieldSuffix content (text or icons) is not in the accessibility tree. If the prefix is necessary for understanding the field (e.g. "Rp" for a currency field), mention the unit in FieldDescription so screen reader users see it.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Prefer icon prefix for search inputs and text prefix for unit/scheme inputs',
                body: 'A Search icon is widely understood for search bars. For domain-specific units like "Rp" or "https://", text is more legible and unambiguous than an icon.',
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

export const WithSuffix = {
  name: 'With Suffix',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Add a <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldSuffix</code> inside{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldControl</code> — it
        detects the suffix and tells the Input to add right padding to prevent overlap.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          FieldControl detects the suffix and pads the Input right
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <FieldContent>
            <FieldLabel>Website</FieldLabel>
            <FieldControl>
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
                title: 'Use FieldSuffix inside FieldControl for unit labels and domain extensions',
                body: 'FieldControl detects FieldSuffix children and passes hasSuffix context to Input, which applies the correct right-padding class automatically. Without FieldControl, the suffix overlaps the typed text.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title:
                  "Don't use a suffix for variable units — show a companion select input instead",
                body: 'If the unit can change (e.g. USD vs IDR), a static suffix misleads users. Use a select component next to the input so users can choose the unit.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'Suffix text is not announced — include the unit in FieldLabel or FieldDescription',
                body: 'Screen readers skip FieldSuffix content. If the suffix is a meaningful unit like "%" or "IDR", add it to the FieldLabel (e.g. "Interest rate (%)") or FieldDescription.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Keep suffix text short — 1 to 4 characters for best visual balance',
                body: 'A long suffix pushes typed content too far left and makes the input look unbalanced. For longer labels, consider placing the unit outside the input entirely.',
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

export const WithBoth = {
  name: 'With Both',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldControl</code> supports
        both a prefix and a suffix simultaneously. It detects both children and tells the Input to
        pad on both sides.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          prefix and suffix together — Input padded on both sides
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <FieldContent>
            <FieldLabel>Amount</FieldLabel>
            <FieldControl>
              <FieldPrefix>Rp</FieldPrefix>
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
                title: 'Use both prefix and suffix when the value needs context on both sides',
                body: 'Showing a currency symbol on the left and a currency code on the right, or a scheme on the left and a domain on the right, makes the full format clear at a glance.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't combine prefix and suffix when it makes the input feel crowded",
                body: 'With both affixes the typed content area is reduced. For short inputs or on mobile, using both may leave too little space for the user to see what they are typing. Test on narrow viewports before shipping.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'Include both the prefix and suffix units in FieldDescription for screen readers',
                body: 'When both affixes carry semantic meaning, mention both in FieldDescription or FieldLabel so screen reader users know the full format (e.g. "Enter amount in Rp (IDR)").',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Prefer a short icon on one side and short text on the other for the best balance',
                body: 'Mixing an icon prefix with a text suffix (or vice versa) tends to look more balanced than two text affixes of different lengths. Aim for visual symmetry when both are present.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldControl>
  <FieldPrefix>Rp</FieldPrefix>
  <Input type="number" placeholder="0" />
  <FieldSuffix>IDR</FieldSuffix>
</FieldControl>`}</code>
      </pre>
    </div>
  ),
}
