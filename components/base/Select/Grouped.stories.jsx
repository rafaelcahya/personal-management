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

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Select/Grouped',
}

export default meta

export const Grouped = {
  name: 'Grouped',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Use <code className="font-mono bg-gray-100 px-1 rounded text-xs">SelectGroup</code> and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">SelectLabel</code> to organize
        options under named headings. Add{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">SelectSeparator</code> between
        groups for visual separation.
      </p>

      <div className="w-80">
        <Select>
          <SelectTrigger className="w-full">
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
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Select>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Select a timezone" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Asia</SelectLabel>
      <SelectItem value="wib">WIB — Jakarta</SelectItem>
      <SelectItem value="wita">WITA — Makassar</SelectItem>
    </SelectGroup>
    <SelectSeparator />
    <SelectGroup>
      <SelectLabel>Europe</SelectLabel>
      <SelectItem value="gmt">GMT — London</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>`}</code>
      </pre>
    </div>
  ),
}
