import {
  AlertTriangle,
  DatabaseZap,
  FolderOpen,
  RefreshCw,
  ServerCrash,
  WifiOff,
} from 'lucide-react'
import State from './State'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'State/CustomIcon',
}

export default meta

const BestPractices = ({ items }) => (
  <div className="flex flex-col gap-8 w-full max-w-2xl">
    {items.map(({ heading, cards }) => (
      <div key={heading}>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          {heading}
        </p>
        <div className="flex flex-col gap-3">
          {cards.map(({ title, body }) => (
            <div
              key={title}
              className="flex gap-3 p-4 rounded-lg border border-violet-100 bg-violet-50"
            >
              <span className="mt-0.5 shrink-0 size-4 rounded-full bg-violet-500 flex items-center justify-center text-white text-[10px] font-bold">
                ✓
              </span>
              <div>
                <p className="text-xs font-semibold text-violet-800 mb-0.5">{title}</p>
                <p className="text-xs text-violet-700 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
)

export const CustomIcon = {
  name: 'Custom Icon',
  render: () => (
    <div className="flex flex-col gap-10 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Pass a Lucide icon component via the{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">icon</code> prop to override
        the default. Defaults: <strong>error</strong> → AlertCircle, <strong>empty</strong> → Inbox.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-2xl">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Error — custom icons
        </p>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: WifiOff, title: 'No internet connection', description: 'Check your network.' },
            {
              icon: ServerCrash,
              title: 'Server unavailable',
              description: 'Service is temporarily down.',
            },
            {
              icon: DatabaseZap,
              title: 'Database unreachable',
              description: 'Could not connect to data source.',
            },
            {
              icon: AlertTriangle,
              title: 'Request timed out',
              description: 'The server took too long to respond.',
            },
          ].map(({ icon, title, description }) => (
            <div key={title} className="border border-gray-200 rounded-xl">
              <State
                variant="error"
                icon={icon}
                title={title}
                description={description}
                action={{ label: 'Retry', onClick: () => {} }}
              />
            </div>
          ))}
        </div>

        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-4">
          Empty — custom icons
        </p>
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              icon: FolderOpen,
              title: 'No documents',
              description: 'Upload a document to get started.',
            },
            {
              icon: RefreshCw,
              title: 'Nothing synced yet',
              description: 'Connect your account to sync.',
            },
          ].map(({ icon, title, description }) => (
            <div key={title} className="border border-gray-200 rounded-xl">
              <State
                variant="empty"
                icon={icon}
                title={title}
                description={description}
                action={{ label: 'Connect', onClick: () => {} }}
              />
            </div>
          ))}
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use a custom icon when the context is specific enough to benefit from it',
                body: 'A WifiOff icon is more informative than a generic AlertCircle for a connectivity error. Pick the icon that most clearly communicates the type of failure or empty state.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't override just for variety — the default icons work for most cases",
                body: 'AlertCircle (error) and Inbox (empty) are well-understood defaults. Only override when the context genuinely benefits from a more specific icon.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Pass the component reference, not JSX',
                body: 'icon={WifiOff} ✓ — icon={<WifiOff />} ✗. The component renders the icon at the correct size internally.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`import { WifiOff, FolderOpen } from 'lucide-react'

{/* pass component reference — not JSX */}
<State
  variant="error"
  icon={WifiOff}
  title="No internet connection"
  description="Check your network and try again."
  action={{ label: 'Retry', onClick: handleRetry }}
/>

<State
  variant="empty"
  icon={FolderOpen}
  title="No documents"
  description="Upload a document to get started."
/>`}</code>
      </pre>
    </div>
  ),
}
