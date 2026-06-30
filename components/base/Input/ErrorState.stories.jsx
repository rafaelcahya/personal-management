import Input from './Input'
import FieldLabel from '../Field/FieldLabel'
import FieldDescription from '../Field/FieldDescription'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Input Field/Error State',
}

export default meta

export const ErrorState = {
  name: 'Error State',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant="error"</code> to
        render the input with a red border. Pair with{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">
          FieldDescription variant="error"
        </code>{' '}
        for the validation message.
      </p>

      <div className="flex flex-col gap-4 w-72">
        <div className="flex flex-col gap-1.5">
          <FieldLabel htmlFor="email-error" required>
            Email
          </FieldLabel>
          <Input id="email-error" size="base" variant="error" defaultValue="wrong@" />
          <FieldDescription variant="error">Enter a valid email address.</FieldDescription>
        </div>
        <div className="flex flex-col gap-1.5">
          <FieldLabel htmlFor="name-error" required>
            Full Name
          </FieldLabel>
          <Input id="name-error" size="base" variant="error" placeholder="Your name" />
          <FieldDescription variant="error">This field is required.</FieldDescription>
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldLabel htmlFor="email" required>Email</FieldLabel>
<Input id="email" size="base" variant="error" defaultValue="wrong@" />
<FieldDescription variant="error">Enter a valid email address.</FieldDescription>`}</code>
      </pre>
    </div>
  ),
}
