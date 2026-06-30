import FieldContent from './FieldContent'
import FieldControl from './FieldControl'
import FieldLabel from './FieldLabel'
import FieldPrefix from './FieldPrefix'
import FieldSuffix from './FieldSuffix'
import Input from '../Input/Input'
import { Search, DollarSign } from 'lucide-react'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Field/FieldControl',
}

export default meta

export const PrefixSuffix = {
  name: 'Prefix & Suffix',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Place <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldPrefix</code> or{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldSuffix</code> inside{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldControl</code> — Input
        automatically adjusts its padding to avoid overlap.
      </p>

      <div className="flex flex-col gap-3 w-80">
        <FieldContent size="base">
          <FieldLabel>Search</FieldLabel>
          <FieldControl>
            <FieldPrefix>
              <Search />
            </FieldPrefix>
            <Input placeholder="Search..." />
          </FieldControl>
        </FieldContent>
        <FieldContent size="base">
          <FieldLabel>Website</FieldLabel>
          <FieldControl>
            <Input placeholder="yoursite" />
            <FieldSuffix>.com</FieldSuffix>
          </FieldControl>
        </FieldContent>
        <FieldContent size="base">
          <FieldLabel>Amount</FieldLabel>
          <FieldControl>
            <FieldPrefix>
              <DollarSign />
            </FieldPrefix>
            <Input type="number" placeholder="0.00" />
            <FieldSuffix>USD</FieldSuffix>
          </FieldControl>
        </FieldContent>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Prefix only */}
<FieldControl>
  <FieldPrefix><Search /></FieldPrefix>
  <Input placeholder="Search..." />
</FieldControl>

{/* Suffix only */}
<FieldControl>
  <Input placeholder="yoursite" />
  <FieldSuffix>.com</FieldSuffix>
</FieldControl>

{/* Prefix + Suffix */}
<FieldControl>
  <FieldPrefix><DollarSign /></FieldPrefix>
  <Input type="number" placeholder="0.00" />
  <FieldSuffix>USD</FieldSuffix>
</FieldControl>`}</code>
      </pre>
    </div>
  ),
}

export const Standalone = {
  name: 'Standalone',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldControl</code> works
        without <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> —
        useful for bare input rows like search bars where no label or a11y context is needed.
      </p>

      <div className="flex flex-col gap-3 w-80">
        <FieldControl>
          <FieldPrefix>
            <Search />
          </FieldPrefix>
          <Input placeholder="Search items..." />
        </FieldControl>
        <FieldControl>
          <Input placeholder="Bare input row" />
        </FieldControl>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldControl>
  <FieldPrefix><Search /></FieldPrefix>
  <Input placeholder="Search items..." />
</FieldControl>`}</code>
      </pre>
    </div>
  ),
}
