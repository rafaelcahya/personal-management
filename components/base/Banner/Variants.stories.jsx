import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { Banner, BannerIcon, BannerContent, BannerTitle, BannerDescription } from './Banner'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'Banner/Variants' }
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

export const InfoVariant = {
  name: 'Info',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant="info"</code> uses a
          blue palette. Use it for neutral system messages — updates, sync status, read-only mode
          notices — that the user should be aware of but don't require immediate action.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-2xl">
        <Banner variant="info">
          <BannerIcon icon={Info} />
          <BannerContent>
            <BannerTitle>Update available</BannerTitle>
            <BannerDescription>
              A new version of the app is ready. Refresh to get the latest features and fixes.
            </BannerDescription>
          </BannerContent>
        </Banner>
        <Banner variant="info">
          <BannerIcon icon={Info} />
          <BannerContent>
            <BannerTitle>Syncing your portfolio…</BannerTitle>
            <BannerDescription>
              This may take a few seconds. Data is read-only until sync completes.
            </BannerDescription>
          </BannerContent>
        </Banner>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use info for neutral, non-urgent system messages',
                body: 'System status, sync progress, read-only mode notices, feature announcements. info has the lowest visual urgency of the four variants — the user should be aware but no action is required.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use info for warnings or errors",
                body: 'Upgrade to warning when attention is needed, or danger when something has already failed. Using info for urgent messages trains users to ignore it.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'Pair with the Info icon to reinforce severity without relying on color alone',
                body: 'Use the Info icon from lucide-react to match the blue palette and give colorblind users a non-color signal that this is an informational message.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Info banners are good candidates for dismissible',
                body: 'Neutral messages like "Sync complete" or "Read-only mode active" rarely need to persist. Add dismissible so users can clear them once read.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`import { Info } from 'lucide-react'

<Banner variant="info">
  <BannerIcon icon={Info} />
  <BannerContent>
    <BannerTitle>Update available</BannerTitle>
    <BannerDescription>Refresh to get the latest features.</BannerDescription>
  </BannerContent>
</Banner>`}</code>
      </pre>
    </div>
  ),
}

export const SuccessVariant = {
  name: 'Success',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant="success"</code> uses
          an emerald palette. Use it to confirm that an operation completed — a trade was filled,
          data was imported, changes were saved.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-2xl">
        <Banner variant="success">
          <BannerIcon icon={CheckCircle} />
          <BannerContent>
            <BannerTitle>Trade executed successfully</BannerTitle>
            <BannerDescription>
              Your order to buy 100 shares of BBCA at Rp 9,250 has been filled.
            </BannerDescription>
          </BannerContent>
        </Banner>
        <Banner variant="success">
          <BannerIcon icon={CheckCircle} />
          <BannerContent>
            <BannerTitle>Import complete</BannerTitle>
            <BannerDescription>48 inventory items were imported successfully.</BannerDescription>
          </BannerContent>
        </Banner>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use success for user-triggered completed actions',
                body: '"Trade executed", "Import complete", "Changes saved" — confirmations of actions the user initiated. "Prices updated in the background" is info, not success.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use success for passive system events",
                body: 'Background updates or auto-sync that the user didn\'t trigger are info-level events. Success implies "you did something and it worked" — reserve it for direct user actions.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'Pair with the CheckCircle icon to reinforce success without relying on color',
                body: 'The emerald palette alone can be ambiguous. CheckCircle is the universal success symbol — it gives colorblind users a non-color signal that an action completed successfully.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Add dismissible or a next-step BannerAction to success banners',
                body: 'Once users read a success message, they rarely need it to stay. Either make it dismissible so they can clear it, or pair it with a BannerAction like "View imported items" to drive the next step.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`import { CheckCircle } from 'lucide-react'

<Banner variant="success">
  <BannerIcon icon={CheckCircle} />
  <BannerContent>
    <BannerTitle>Trade executed successfully</BannerTitle>
    <BannerDescription>Your order has been filled.</BannerDescription>
  </BannerContent>
</Banner>`}</code>
      </pre>
    </div>
  ),
}

export const WarningVariant = {
  name: 'Warning',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant="warning"</code> uses
          an amber palette. Use it for recoverable issues that need user attention — low stock,
          unsaved changes, delayed data — where the problem isn't critical but action is encouraged.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-2xl">
        <Banner variant="warning">
          <BannerIcon icon={AlertTriangle} />
          <BannerContent>
            <BannerTitle>Stock below threshold</BannerTitle>
            <BannerDescription>
              BBCA has only 2 units remaining. Consider restocking before it runs out.
            </BannerDescription>
          </BannerContent>
        </Banner>
        <Banner variant="warning">
          <BannerIcon icon={AlertTriangle} />
          <BannerContent>
            <BannerTitle>Prices delayed by 15 minutes</BannerTitle>
            <BannerDescription>Real-time data requires a premium subscription.</BannerDescription>
          </BannerContent>
        </Banner>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use warning for recoverable issues that need attention',
                body: 'Low stock, unsaved changes, delayed data, threshold violations. warning means "attention needed" — the problem exists but hasn\'t failed yet and the user can act.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use warning for actual failures",
                body: 'Upgrade to danger when data was lost, an operation failed, or a resource is expired. warning is for heads-up, not for breakage.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Pair with AlertTriangle to signal "caution" without relying on amber color',
                body: 'AlertTriangle is the universal caution symbol. It gives colorblind users a non-color cue that the message is a warning, not just an info notice.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Always pair warning with a BannerAction',
                body: "A warning banner with no action is a dead end — it tells the user there's a problem but gives them no path to fix it. Add a Restock, Save, or Upgrade button to resolve the issue inline.",
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`import { AlertTriangle } from 'lucide-react'

<Banner variant="warning">
  <BannerIcon icon={AlertTriangle} />
  <BannerContent>
    <BannerTitle>Stock below threshold</BannerTitle>
    <BannerDescription>BBCA has only 2 units remaining.</BannerDescription>
  </BannerContent>
</Banner>`}</code>
      </pre>
    </div>
  ),
}

export const DangerVariant = {
  name: 'Danger',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2 max-w-2xl">
        <p className="text-sm text-gray-500 leading-relaxed">
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant="danger"</code> uses
          a red palette. Use it for failures, errors, and destructive states — a save failed, a
          payment method expired, a connection was lost.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-2xl">
        <Banner variant="danger">
          <BannerIcon icon={XCircle} />
          <BannerContent>
            <BannerTitle>Failed to save changes</BannerTitle>
            <BannerDescription>
              We could not save your changes. Check your connection and try again.
            </BannerDescription>
          </BannerContent>
        </Banner>
        <Banner variant="danger">
          <BannerIcon icon={XCircle} />
          <BannerContent>
            <BannerTitle>Payment method expired</BannerTitle>
            <BannerDescription>
              Your payment method on file has expired. Update it to continue.
            </BannerDescription>
          </BannerContent>
        </Banner>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use danger for genuine failures — not warnings',
                body: 'Failed operations, expired resources, lost data, lost connections. Danger means something has already gone wrong. Reserve it for real failures — overuse desensitizes users to red.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use danger for recoverable issues that haven't failed yet",
                body: "Low stock, unsaved changes, or delayed data are warning-level — the problem exists but hasn't broken anything. Upgrade to danger only when an operation has actually failed.",
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Pair with XCircle to signal failure without relying on red color',
                body: 'XCircle is the universal failure symbol. It gives colorblind users a non-color cue that this is an error state, not just a high-priority warning.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Always provide a recovery path via BannerAction',
                body: 'A danger banner with no action is a dead end — it tells the user something failed but gives them nothing to do about it. Always add a Retry, Update, or Contact support button.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`import { XCircle } from 'lucide-react'

<Banner variant="danger">
  <BannerIcon icon={XCircle} />
  <BannerContent>
    <BannerTitle>Failed to save changes</BannerTitle>
    <BannerDescription>Check your connection and try again.</BannerDescription>
  </BannerContent>
</Banner>`}</code>
      </pre>
    </div>
  ),
}
