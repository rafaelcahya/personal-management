import { Spinner } from './Spinner'
import Button from '@/components/base/Button/Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Spinner/Inside Button' }
export default meta

export const InsideButton = {
  name: 'Inside Button',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-lg">
      <p className="text-sm text-gray-500 leading-relaxed">
        Place the spinner inside a button alongside a label to indicate an in-progress action.
        Disable the button while loading to prevent double submission.
      </p>

      <div className="flex flex-wrap gap-3">
        <Button disabled>
          <Spinner size="xs" variant="white" />
          Saving...
        </Button>

        <Button variant="outline" disabled>
          <Spinner size="xs" />
          Loading...
        </Button>

        <Button variant="secondary" disabled>
          <Spinner size="xs" variant="muted" />
          Processing
        </Button>

        <Button variant="destructive" disabled>
          <Spinner size="xs" variant="white" />
          Deleting...
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">Icon-only button</span>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon-sm" disabled>
            <Spinner size="xs" />
          </Button>
          <Button variant="outline" size="icon" disabled>
            <Spinner size="sm" />
          </Button>
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
        <code>{`{/* primary button */}
<Button disabled>
  <Spinner size="xs" variant="white" />
  Saving...
</Button>

{/* outline button */}
<Button variant="outline" disabled>
  <Spinner size="xs" />
  Loading...
</Button>`}</code>
      </pre>
    </div>
  ),
}
