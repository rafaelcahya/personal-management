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

export const Text = {
  name: 'Text',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Use <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldSuffix</code> with
        text strings for domain extensions, unit labels, or currency codes.
      </p>

      <div className="flex flex-col gap-3 w-80">
        <FieldContent size="base">
          <FieldControl>
            <Input placeholder="yoursite" />
            <FieldSuffix>.com</FieldSuffix>
          </FieldControl>
        </FieldContent>
        <FieldContent size="base">
          <FieldControl>
            <Input type="number" placeholder="0" />
            <FieldSuffix>%</FieldSuffix>
          </FieldControl>
        </FieldContent>
        <FieldContent size="base">
          <FieldControl>
            <Input type="number" placeholder="0" />
            <FieldSuffix>IDR</FieldSuffix>
          </FieldControl>
        </FieldContent>
      </div>

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
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Pass an icon component to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldSuffix</code> — it will be
        centered and sized automatically.
      </p>

      <div className="flex flex-col gap-3 w-80">
        <FieldContent size="base">
          <FieldControl>
            <Input type="number" placeholder="0" />
            <FieldSuffix>
              <Percent />
            </FieldSuffix>
          </FieldControl>
        </FieldContent>
      </div>

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
      <div className="flex flex-col items-center gap-6 w-full">
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
          Add{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">pointer-events-auto</code> to
          make <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldSuffix</code>{' '}
          clickable — useful for password toggle buttons.
        </p>

        <div className="w-80">
          <FieldContent size="base">
            <FieldLabel>Password</FieldLabel>
            <FieldControl>
              <Input type={show ? 'text' : 'password'} placeholder="Password" />
              <FieldSuffix
                className="pointer-events-auto cursor-pointer hover:text-foreground transition-colors"
                onClick={() => setShow((s) => !s)}
              >
                {show ? <EyeOff /> : <Eye />}
              </FieldSuffix>
            </FieldControl>
          </FieldContent>
        </div>

        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
          <code>{`<FieldControl>
  <Input type={show ? 'text' : 'password'} placeholder="Password" />
  <FieldSuffix
    className="pointer-events-auto cursor-pointer hover:text-foreground transition-colors"
    onClick={() => setShow(s => !s)}
  >
    {show ? <EyeOff /> : <Eye />}
  </FieldSuffix>
</FieldControl>`}</code>
        </pre>
      </div>
    )
  },
}

export const Sizes = {
  name: 'Sizes',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldSuffix</code> scales with
        the <code className="font-mono bg-gray-100 px-1 rounded text-xs">size</code> prop inherited
        from <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code>.
      </p>

      <div className="flex flex-col gap-3 max-w-xs w-full">
        {['xs', 'sm', 'base', 'md', 'lg'].map((size) => (
          <FieldContent key={size} size={size}>
            <FieldLabel>size="{size}"</FieldLabel>
            <FieldControl>
              <Input placeholder={`size ${size}`} />
              <FieldSuffix>.com</FieldSuffix>
            </FieldControl>
          </FieldContent>
        ))}
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent size="lg">
  <FieldLabel>Label</FieldLabel>
  <FieldControl>
    <Input placeholder="..." />
    <FieldSuffix>.com</FieldSuffix>
  </FieldControl>
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
