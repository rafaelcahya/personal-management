import { ServerCrash, WifiOff } from 'lucide-react'
import State from './State'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'State',
}

export default meta

export const Error = {
  name: 'Error',
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-xl py-6 px-2">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-gray-800">Error variant</h2>
        <p className="text-xs text-gray-500">
          Use when a network or server failure replaces the content area. Always include an action
          when a retry is possible.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-600">With action (recommended)</span>
          <div className="border border-gray-200 rounded-xl">
            <State
              variant="error"
              title="Failed to load valuation data"
              description="BBCA — check your connection and retry."
              action={{ label: 'Try again', onClick: () => {} }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-600">Without action</span>
          <div className="border border-gray-200 rounded-xl">
            <State
              variant="error"
              title="Something went wrong"
              description="Please refresh the page."
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-600">Custom icon</span>
          <div className="border border-gray-200 rounded-xl">
            <State
              variant="error"
              icon={WifiOff}
              title="No internet connection"
              description="Check your network and try again."
              action={{ label: 'Retry', onClick: () => {} }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-600">Server error</span>
          <div className="border border-gray-200 rounded-xl">
            <State
              variant="error"
              icon={ServerCrash}
              title="Server unavailable"
              description="The service is temporarily down. Try again in a few minutes."
              action={{ label: 'Retry', onClick: () => {} }}
            />
          </div>
        </div>
      </div>
    </div>
  ),
}
