import { Separator } from './Separator'
import Button from '@/components/base/Button/Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Separator/With Label' }
export default meta

export const WithLabel = {
  name: 'With Label',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-lg">
      <p className="text-sm text-gray-500 leading-relaxed">
        Pass a <code className="font-mono bg-gray-100 px-1 rounded text-xs">label</code> to render
        centered text between two lines. Useful for "or", "and", or section titles. Only supported
        on horizontal orientation.
      </p>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">Short label</span>
          <Separator label="or" />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">Section title</span>
          <Separator label="More options" />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">With variant</span>
          <Separator label="or" variant="dashed" />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-400">Login form — real usage</span>
          <div className="flex flex-col gap-3 p-6 border border-gray-200 rounded-xl w-80">
            <Button className="w-full">Continue with Google</Button>
            <Separator label="or" />
            <Button variant="outline" className="w-full">
              Sign in with email
            </Button>
          </div>
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`<Separator label="or" />
<Separator label="More options" />
<Separator label="or" variant="dashed" />`}</code>
      </pre>
    </div>
  ),
}
