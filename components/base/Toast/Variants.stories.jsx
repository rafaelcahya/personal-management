import { useState } from 'react'
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from './Toast'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Toast/Variants',
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

function VariantDemo({ variant, title, desc, buttonLabel }) {
  const [open, setOpen] = useState(false)
  const show = () => {
    setOpen(false)
    setTimeout(() => setOpen(true), 50)
  }
  return (
    <ToastProvider position="bottom-right">
      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">{variant}</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <button
            type="button"
            onClick={show}
            className="inline-flex items-center justify-center w-full px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
          >
            {buttonLabel}
          </button>
        </div>
      </div>
      {open && (
        <Toast onOpenChange={(o) => !o && setOpen(false)} variant={variant}>
          <div className="flex-1 min-w-0">
            <ToastTitle>{title}</ToastTitle>
            <ToastDescription>{desc}</ToastDescription>
          </div>
          <ToastClose />
        </Toast>
      )}
      <ToastViewport />
    </ToastProvider>
  )
}

export const Default = {
  name: 'Default',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">default</code> variant uses
        a white background with slate borders. Use it for neutral, system-level updates that
        aren&apos;t tied to a specific outcome — like an auto-save notification.
      </p>

      <VariantDemo
        variant="default"
        title="Auto-saved"
        desc="Your draft has been saved automatically."
        buttonLabel="Show default toast"
      />

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use default for neutral, system-level updates',
                body: 'Default is appropriate for background status messages that carry no semantic weight — like "Auto-saved" or "Synced". If the outcome has a clear sentiment, use a semantic variant instead.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use default when the outcome matters",
                body: 'If something succeeded, failed, or needs attention, use success, danger, or warning. Default for a failed upload sends the wrong signal — the neutral styling implies everything is fine.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Keep the message readable in both light and dark contexts',
                body: 'Default uses a white background and slate borders. On dark-themed pages, verify the contrast is still sufficient — the neutral palette gives less visual separation than semantic variants.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'When in doubt, choose a semantic variant over default',
                body: "Default is the fallback — not the go-to. If you're deciding between default and info for a background sync notification, pick info. It gives the user a clearer signal about intent.",
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{open && (
  <Toast onOpenChange={(o) => !o && setOpen(false)} variant="default">
    <div className="flex-1 min-w-0">
      <ToastTitle>Auto-saved</ToastTitle>
      <ToastDescription>Your draft has been saved automatically.</ToastDescription>
    </div>
    <ToastClose />
  </Toast>
)}`}</code>
      </pre>
    </div>
  ),
}

export const Info = {
  name: 'Info',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">info</code> variant (blue)
        is for neutral informational messages that keep the user in the loop without requiring
        action — like announcing that new data is available.
      </p>

      <VariantDemo
        variant="info"
        title="New data available"
        desc="The portfolio has been refreshed with the latest prices."
        buttonLabel="Show info toast"
      />

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use info for updates the user should know about, not act on',
                body: 'Info toasts suit announcements like "New messages available" or "Update downloaded". Reserve info for reads, not decisions — if action is needed, add a ToastAction.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use info for errors or completed user actions",
                body: 'Info implies a neutral status update. Using it for a successful save or a failed upload sends mixed signals — pick success or danger to match the actual outcome.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Keep info messages brief — they auto-dismiss before the user can re-read',
                body: 'Info toasts default to 5 seconds. If the message contains more than one sentence or includes a number to remember, either shorten it or increase the duration so the user has time to read it.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Pair with ToastAction when follow-up is optional',
                body: 'If the info message has an optional next step (e.g., "View changelog"), add a ToastAction so the user can follow up without navigating away.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{open && (
  <Toast onOpenChange={(o) => !o && setOpen(false)} variant="info">
    <div className="flex-1 min-w-0">
      <ToastTitle>New data available</ToastTitle>
      <ToastDescription>The portfolio has been refreshed.</ToastDescription>
    </div>
    <ToastClose />
  </Toast>
)}`}</code>
      </pre>
    </div>
  ),
}

export const Success = {
  name: 'Success',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">success</code> variant
        (emerald green) confirms that a user-triggered action completed successfully — like saving,
        uploading, or submitting a form.
      </p>

      <VariantDemo
        variant="success"
        title="Changes saved"
        desc="Your settings have been updated successfully."
        buttonLabel="Show success toast"
      />

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use success for operations the user explicitly triggered',
                body: 'Success is reserved for deliberate user actions like saving, uploading, or submitting a form. Automatic background syncs should use default or info — not success.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't show success for background syncs or system-initiated events",
                body: 'If the user did not trigger the action, success feels misleading. A background refresh completing is info — not something the user accomplished.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Keep the message past-tense and outcome-focused',
                body: 'Write "Item saved" not "Saving complete". Past tense confirms the action finished; outcome-focused means stating what changed, not what the system did.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Pair success with an Undo ToastAction for reversible operations',
                body: 'After deleting or archiving an item, a success + Undo combination acknowledges the action while giving the user a safety net — without requiring a confirmation dialog upfront.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{open && (
  <Toast onOpenChange={(o) => !o && setOpen(false)} variant="success">
    <div className="flex-1 min-w-0">
      <ToastTitle>Changes saved</ToastTitle>
      <ToastDescription>Your settings have been updated successfully.</ToastDescription>
    </div>
    <ToastClose />
  </Toast>
)}`}</code>
      </pre>
    </div>
  ),
}

export const Warning = {
  name: 'Warning',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">warning</code> variant
        (amber) signals a potential issue that may need attention but doesn&apos;t block the user.
        Use it for recoverable or preventable situations.
      </p>

      <VariantDemo
        variant="warning"
        title="Storage running low"
        desc="You have less than 10% storage remaining. Free up space to keep saving."
        buttonLabel="Show warning toast"
      />

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title:
                  "Use warning for recoverable issues that need attention but don't block the user",
                body: 'Warning means "something is off but you can keep going" — e.g. low storage, a slow connection, or an expiring session. The user can acknowledge and continue.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use warning for blocking errors",
                body: 'If the operation failed and the user cannot proceed, use danger. Warning implies the situation is recoverable — using it for a hard error understates the severity.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Always explain what the user can do',
                body: 'Don\'t just say "Low storage". Say "Low storage — free up space to continue saving files". A warning without a path forward creates anxiety without resolution.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Consider a longer duration for warning toasts',
                body: 'Warning messages often contain more detail than a simple confirmation. Increase the duration to 7–8 seconds so the user has time to read the message and understand what to do.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{open && (
  <Toast onOpenChange={(o) => !o && setOpen(false)} variant="warning">
    <div className="flex-1 min-w-0">
      <ToastTitle>Storage running low</ToastTitle>
      <ToastDescription>You have less than 10% storage remaining.</ToastDescription>
    </div>
    <ToastClose />
  </Toast>
)}`}</code>
      </pre>
    </div>
  ),
}

export const Danger = {
  name: 'Danger',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">danger</code> variant (red)
        signals an error or confirms a destructive action. Use it when something went wrong or when
        the user deleted/removed data.
      </p>

      <VariantDemo
        variant="danger"
        title="Item deleted"
        desc="This action cannot be undone once the toast dismisses."
        buttonLabel="Show danger toast"
      />

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use danger for errors and completed destructive actions',
                body: 'Danger is for things that went wrong (API error, failed upload) or actions that removed data (item deleted). For reversible deletions, pair danger with a ToastAction Undo button.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use danger for warnings or informational messages",
                body: 'Red carries strong emotional weight. Overusing danger for non-critical messages desensitizes the user and reduces the signal value when a real error occurs.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'For reversible deletions, always pair danger with a ToastAction Undo button',
                body: 'When the user deletes something, danger confirms the action. Adding an Undo action gives them a recovery path without requiring a confirmation dialog before the delete.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Be specific about what went wrong',
                body: '"Upload failed: file too large" is more useful than "Upload failed". Specific error messages tell the user what to fix — generic ones leave them guessing.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{open && (
  <Toast onOpenChange={(o) => !o && setOpen(false)} variant="danger">
    <div className="flex-1 min-w-0">
      <ToastTitle>Item deleted</ToastTitle>
      <ToastDescription>This action cannot be undone.</ToastDescription>
    </div>
    <ToastClose />
  </Toast>
)}`}</code>
      </pre>
    </div>
  ),
}
