import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './Select'
import FieldContent from '../Field/FieldContent'
import FieldLabel from '../Field/FieldLabel'
import FieldError from '../Field/FieldError'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Select/Error State',
}

export default meta

export const ErrorState = {
  name: 'Error State',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">error</code> to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContent</code> —{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">SelectTrigger</code>{' '}
        automatically reads the error state from context and applies the red border, just like{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">Input</code>.
      </p>

      <div className="w-80">
        <FieldContent size="base" required error="Please select a category.">
          <FieldLabel>Category</FieldLabel>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="food">Food</SelectItem>
              <SelectItem value="transport">Transport</SelectItem>
              <SelectItem value="health">Health</SelectItem>
            </SelectContent>
          </Select>
          <FieldError />
        </FieldContent>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContent size="base" required error={errors.category?.message}>
  <FieldLabel>Category</FieldLabel>
  <Select onValueChange={(v) => setValue('category', v)}>
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Select a category" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="food">Food</SelectItem>
      <SelectItem value="transport">Transport</SelectItem>
    </SelectContent>
  </Select>
  <FieldError />
</FieldContent>`}</code>
      </pre>
    </div>
  ),
}
