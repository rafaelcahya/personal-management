import { FolderOpen, Plus, RefreshCw } from 'lucide-react'
import State from './State'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'State',
}

export default meta

export const Empty = {
  name: 'Empty',
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-xl py-6 px-2">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-gray-800">Empty variant</h2>
        <p className="text-xs text-gray-500">
          Use when a section has zero items to show. Optionally include a CTA action to guide the
          user to the next step.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-600">Default (Inbox icon)</span>
          <div className="border border-gray-200 rounded-xl">
            <State
              variant="empty"
              title="No tickers yet"
              description="Add tickers to your watchlist to start comparing valuations."
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-600">With CTA action</span>
          <div className="border border-gray-200 rounded-xl">
            <State
              variant="empty"
              title="No items yet"
              description="Add your first item to get started."
              action={{ label: 'Add item', onClick: () => {} }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-600">Custom icon</span>
          <div className="border border-gray-200 rounded-xl">
            <State
              variant="empty"
              icon={FolderOpen}
              title="No documents"
              description="Upload a document to get started."
              action={{ label: 'Upload', onClick: () => {} }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-600">Sync prompt</span>
          <div className="border border-gray-200 rounded-xl">
            <State
              variant="empty"
              icon={RefreshCw}
              title="Nothing synced yet"
              description="Connect your account to start syncing activity data."
              action={{ label: 'Connect', onClick: () => {} }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-600">Title only (minimal)</span>
          <div className="border border-gray-200 rounded-xl">
            <State variant="empty" title="No results found" />
          </div>
        </div>
      </div>
    </div>
  ),
}
