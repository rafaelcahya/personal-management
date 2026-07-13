import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './Select'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Select/Grouped',
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

export const Grouped = {
  name: 'Grouped',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Use <code className="font-mono bg-gray-100 px-1 rounded text-xs">SelectGroup</code> and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">SelectLabel</code> to organize
        items under named headings. Use{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">SelectSeparator</code> to add a
        visual divider between groups.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">SelectGroup + SelectLabel — two named groups</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Asia</SelectLabel>
                <SelectItem value="wib">WIB — Jakarta</SelectItem>
                <SelectItem value="wita">WITA — Makassar</SelectItem>
                <SelectItem value="wit">WIT — Jayapura</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Europe</SelectLabel>
                <SelectItem value="gmt">GMT — London</SelectItem>
                <SelectItem value="cet">CET — Paris</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          with SelectSeparator — visual divider between groups
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Essentials</SelectLabel>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="health">Health</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Lifestyle</SelectLabel>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="shopping">Shopping</SelectItem>
                <SelectItem value="travel">Travel</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          with FieldContent — label and error wired automatically
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-80">
          <FieldContent required>
            <FieldLabel>Timezone</FieldLabel>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Asia</SelectLabel>
                  <SelectItem value="wib">WIB — Jakarta</SelectItem>
                  <SelectItem value="wita">WITA — Makassar</SelectItem>
                  <SelectItem value="wit">WIT — Jayapura</SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>Europe</SelectLabel>
                  <SelectItem value="gmt">GMT — London</SelectItem>
                  <SelectItem value="cet">CET — Paris</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </FieldContent>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use SelectGroup when options span distinct categories that aid scanning',
                body: 'Asia / Europe / Americas as group labels make a list of 20 timezones scannable. Without groups, users must read every item linearly to find what they need.',
              },
              {
                title: 'Use SelectSeparator to visually separate groups without a label',
                body: 'When two groups of items are conceptually distinct but short enough that labels feel heavy, a separator adds breathing room without the overhead of a full SelectLabel.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title:
                  "Don't add a single SelectGroup with all items — grouping without distinction adds noise",
                body: 'If all your options belong to the same category, skip the group entirely. The label is only useful when it adds context that helps the user narrow their search faster.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'SelectGroup renders with role="group" — announced by screen readers as a group',
                body: 'The group role is exposed to assistive technology automatically. Screen readers announce the group structure before reading the options inside it.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Keep SelectLabel text short and consistent in style',
                body: 'Use noun phrases ("Asia", "Europe") not sentences ("Options from Asia"). Consistent casing and length makes the dropdown feel structured rather than ad hoc.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Select onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select a timezone" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Asia</SelectLabel>
      <SelectItem value="wib">WIB — Jakarta</SelectItem>
      <SelectItem value="wita">WITA — Makassar</SelectItem>
      <SelectItem value="wit">WIT — Jayapura</SelectItem>
    </SelectGroup>
    <SelectSeparator />
    <SelectGroup>
      <SelectLabel>Europe</SelectLabel>
      <SelectItem value="gmt">GMT — London</SelectItem>
      <SelectItem value="cet">CET — Paris</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>`}</code>
      </pre>
    </div>
  ),
}
