import FieldContent from './FieldContent'
import FieldControl from './FieldControl'
import FieldLabel from './FieldLabel'
import FieldPrefix from './FieldPrefix'
import Input from '../Input/Input'
import { Search, Mail, Globe } from 'lucide-react'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Field/FieldPrefix',
}

export default meta

export const Text = {
  name: 'Text',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Use <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldPrefix</code> with
        text strings for currency symbols, URL schemes, or short units.
      </p>

      <div className="flex flex-col gap-3 w-80">
        <FieldContent size="base">
          <FieldControl>
            <FieldPrefix>Rp</FieldPrefix>
            <Input placeholder="0" />
          </FieldControl>
        </FieldContent>
        <FieldContent size="base">
          <FieldControl>
            <FieldPrefix>$</FieldPrefix>
            <Input placeholder="0.00" />
          </FieldControl>
        </FieldContent>
        <FieldContent size="base">
          <FieldControl>
            <FieldPrefix>https://</FieldPrefix>
            <Input placeholder="yoursite.com" />
          </FieldControl>
        </FieldContent>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldControl>
  <FieldPrefix>Rp</FieldPrefix>
  <Input placeholder="0" />
</FieldControl>`}</code>
      </pre>
    </div>
  ),
}

export const Icon = {
  name: 'Icon',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Pass an icon component to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldPrefix</code> — it will be
        centered and sized automatically.
      </p>

      <div className="flex flex-col gap-3 w-80">
        <FieldContent size="base">
          <FieldControl>
            <FieldPrefix>
              <Search />
            </FieldPrefix>
            <Input placeholder="Search..." />
          </FieldControl>
        </FieldContent>
        <FieldContent size="base">
          <FieldControl>
            <FieldPrefix>
              <Mail />
            </FieldPrefix>
            <Input placeholder="you@example.com" />
          </FieldControl>
        </FieldContent>
        <FieldContent size="base">
          <FieldControl>
            <FieldPrefix>
              <Globe />
            </FieldPrefix>
            <Input placeholder="yoursite.com" />
          </FieldControl>
        </FieldContent>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldControl>
  <FieldPrefix><Search /></FieldPrefix>
  <Input placeholder="Search..." />
</FieldControl>`}</code>
      </pre>
    </div>
  ),
}

export const Sizes = {
  name: 'Sizes',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldPrefix</code> scales with
        the <code className="font-mono bg-gray-100 px-1 rounded text-xs">size</code> prop inherited
        from <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code>.
      </p>

      <div className="flex flex-col gap-3 max-w-xs w-full">
        {['xs', 'sm', 'base', 'md', 'lg'].map((size) => (
          <FieldContent key={size} size={size}>
            <FieldLabel>size="{size}"</FieldLabel>
            <FieldControl>
              <FieldPrefix>
                <Mail />
              </FieldPrefix>
              <Input placeholder={`size ${size}`} />
            </FieldControl>
          </FieldContent>
        ))}
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent size="lg">
  <FieldLabel>Label</FieldLabel>
  <FieldControl>
    <FieldPrefix><Mail /></FieldPrefix>
    <Input placeholder="..." />
  </FieldControl>
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
