import FieldContent from './FieldContent'
import FieldControl from './FieldControl'
import FieldLabel from './FieldLabel'
import FieldDescription from './FieldDescription'
import Input from '../Input/Input'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Field/FieldDescription',
}

export default meta

export const Variants = {
  name: 'Variants',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldDescription</code> has two
        variants: <code className="font-mono bg-gray-100 px-1 rounded text-xs">default</code> for
        hint text and <code className="font-mono bg-gray-100 px-1 rounded text-xs">error</code> for
        validation messages in red.
      </p>

      <div className="flex flex-col gap-2 w-80">
        <FieldDescription variant="default">We'll never share your email.</FieldDescription>
        <FieldDescription variant="error">This field is required.</FieldDescription>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldDescription variant="default">We'll never share your email.</FieldDescription>
<FieldDescription variant="error">This field is required.</FieldDescription>`}</code>
      </pre>
    </div>
  ),
}

export const InContext = {
  name: 'In Context',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Place <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldDescription</code>{' '}
        inside <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> — it
        gets wired to the input via{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">aria-describedby</code>{' '}
        automatically.
      </p>

      <div className="w-80">
        <FieldContent size="base" required>
          <FieldLabel>Email</FieldLabel>
          <FieldControl>
            <Input placeholder="you@example.com" />
          </FieldControl>
          <FieldDescription>Hint text — aria-describedby wired automatically.</FieldDescription>
        </FieldContent>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent size="base" required>
  <FieldLabel>Email</FieldLabel>
  <FieldControl><Input placeholder="you@example.com" /></FieldControl>
  <FieldDescription>Hint text — aria-describedby wired automatically.</FieldDescription>
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}

export const Polymorphic = {
  name: 'Polymorphic',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Use the <code className="font-mono bg-gray-100 px-1 rounded text-xs">as</code> prop to
        change the rendered HTML element. Defaults to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">p</code>.
      </p>

      <div className="flex flex-col gap-2 w-80">
        <FieldDescription as="p">as="p" (default)</FieldDescription>
        <FieldDescription as="span">as="span"</FieldDescription>
        <FieldDescription as="div">as="div"</FieldDescription>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldDescription as="p">as="p" (default)</FieldDescription>
<FieldDescription as="span">as="span"</FieldDescription>
<FieldDescription as="div">as="div"</FieldDescription>`}</code>
      </pre>
    </div>
  ),
}
