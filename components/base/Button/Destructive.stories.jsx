import { Trash2 } from 'lucide-react'
import Button from './Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Button/Destructive',
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

export const Normal = {
  name: 'Normal',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        The <code className="font-mono bg-gray-100 px-1 rounded text-xs">destructive</code> variant
        uses a red fill to signal danger. Use it exclusively for irreversible actions — deleting
        data, resetting accounts, or operations that cannot be undone.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">all sizes — normal state</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="destructive" size="xs">
            XSmall
          </Button>
          <Button variant="destructive" size="sm">
            Small
          </Button>
          <Button variant="destructive" size="md">
            Medium
          </Button>
          <Button variant="destructive" size="lg">
            Large
          </Button>
          <Button variant="destructive" size="xl">
            XLarge
          </Button>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use destructive for delete, reset, and other irreversible operations',
                body: 'The red fill is a strong visual signal that this action cannot be undone. Reserve it for operations like Delete account, Remove all data, or Factory reset where the consequence is permanent.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use destructive for reversible or warning-level actions",
                body: 'Archiving, unpublishing, or actions with an undo path do not warrant the destructive variant. Overusing red trains users to ignore it. Use secondary or outline with a warning icon for cautionary but reversible actions.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'Color alone is not sufficient — use a confirmation dialog for destructive actions',
                body: 'Users with color vision deficiencies may not perceive the red as a warning. Always require confirmation via a dialog (AlertDialog) before executing an irreversible action, regardless of the button variant.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Never place a destructive button as the default focused button in a dialog',
                body: 'If a confirmation dialog opens with the destructive button focused by default, users who press Enter out of habit will accidentally confirm the deletion. Focus the cancel action by default.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Button variant="destructive">Delete account</Button>
<Button variant="destructive" useIcon={<Trash2 />}>Delete item</Button>`}</code>
      </pre>
    </div>
  ),
}

export const Disabled = {
  name: 'Disabled',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">disabled</code> to prevent
        interaction. A disabled destructive button at 50% opacity loses the urgency of its red
        signal — context must carry the unavailability message.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">all sizes — disabled state</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="destructive" size="xs" disabled>
            XSmall
          </Button>
          <Button variant="destructive" size="sm" disabled>
            Small
          </Button>
          <Button variant="destructive" size="md" disabled>
            Medium
          </Button>
          <Button variant="destructive" size="lg" disabled>
            Large
          </Button>
          <Button variant="destructive" size="xl" disabled>
            XLarge
          </Button>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title:
                  'Disable when the destructive action requires a prior selection or permission',
                body: 'Disable "Delete selected" when nothing is selected, or "Delete account" when the user has not typed the confirmation phrase. The disabled state prevents execution while the button remains visible.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't rely on disabled alone to prevent accidental destruction",
                body: 'A faded destructive button can still be enabled by the time a user reaches it. For high-stakes irreversible actions, always require a confirmation dialog even when the button is enabled.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Pair disabled destructive with a tooltip that explains the precondition',
                body: 'A disabled red button at 50% opacity may be misread as a warning or pending state. A tooltip — "Select items to delete" or "Confirm your email first" — clarifies why the action is blocked.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Consider requiring typed confirmation instead of (or in addition to) disabling',
                body: 'For high-consequence actions (Delete workspace, Remove all users), requiring the user to type "DELETE" before enabling the button adds a meaningful friction layer beyond just enabled/disabled.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Button variant="destructive" disabled>Delete selected</Button>`}</code>
      </pre>
    </div>
  ),
}

export const Loading = {
  name: 'Loading',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">isLoading</code> to show a
        spinner and disable interaction. The red fill persists during loading to remind users a
        dangerous operation is in progress.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">all sizes — loading state</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="destructive" size="xs" isLoading>
            XSmall
          </Button>
          <Button variant="destructive" size="sm" isLoading>
            Small
          </Button>
          <Button variant="destructive" size="md" isLoading>
            Medium
          </Button>
          <Button variant="destructive" size="lg" isLoading>
            Large
          </Button>
          <Button variant="destructive" size="xl" isLoading>
            XLarge
          </Button>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use isLoading on destructive actions to prevent double-deletion',
                body: 'Delete operations are irreversible. The loading state disables the button and prevents users from clicking again while the deletion is in progress, avoiding double-triggering the API call.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't leave the destructive button loading after the operation completes",
                body: 'If deletion succeeds, navigate away or remove the element immediately. If it fails, re-enable the button and show an error. A loading destructive button left on screen creates anxiety.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Set loadingText="Deleting" so screen reader users know what is happening',
                body: 'The default "Loading" is generic. On a destructive action, "Deleting", "Removing", or "Resetting" gives users clear feedback about what irreversible operation is in progress.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Also disable any cancel or close buttons in the confirmation dialog during loading',
                body: 'While the deletion is loading, the user should not be able to close the dialog or click Cancel — the request is already in flight. Disable or hide those controls until the operation resolves.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Button
  variant="destructive"
  isLoading={isDeleting}
  loadingText="Deleting"
  onClick={handleDelete}
>
  Delete account
</Button>`}</code>
      </pre>
    </div>
  ),
}

export const LoadingWithIcon = {
  name: 'Loading With Icon',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        When <code className="font-mono bg-gray-100 px-1 rounded text-xs">isLoading</code> and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">useIcon</code> are both set,
        the spinner replaces the Trash2 (or custom icon) in its slot. The red fill signals the
        dangerous operation is still running.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">icon left — loading state</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="destructive" size="xs" useIcon={<Trash2 />} isLoading>
            XSmall
          </Button>
          <Button variant="destructive" size="sm" useIcon={<Trash2 />} isLoading>
            Small
          </Button>
          <Button variant="destructive" size="md" useIcon={<Trash2 />} isLoading>
            Medium
          </Button>
          <Button variant="destructive" size="lg" useIcon={<Trash2 />} isLoading>
            Large
          </Button>
          <Button variant="destructive" size="xl" useIcon={<Trash2 />} isLoading>
            XLarge
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">icon right — loading state</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button
            variant="destructive"
            size="xs"
            useIcon={<Trash2 />}
            iconPosition="right"
            isLoading
          >
            XSmall
          </Button>
          <Button
            variant="destructive"
            size="sm"
            useIcon={<Trash2 />}
            iconPosition="right"
            isLoading
          >
            Small
          </Button>
          <Button
            variant="destructive"
            size="md"
            useIcon={<Trash2 />}
            iconPosition="right"
            isLoading
          >
            Medium
          </Button>
          <Button
            variant="destructive"
            size="lg"
            useIcon={<Trash2 />}
            iconPosition="right"
            isLoading
          >
            Large
          </Button>
          <Button
            variant="destructive"
            size="xl"
            useIcon={<Trash2 />}
            iconPosition="right"
            isLoading
          >
            XLarge
          </Button>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Trash2 and other danger icons pair well with destructive loading',
                body: 'Starting from a destructive button with a Trash2 icon, the spinner swap on click gives users immediate feedback while keeping the red color context that signals the operation is dangerous.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use multiple simultaneous destructive loading buttons",
                body: 'If multiple destructive actions can be triggered in parallel, ensure each has a unique loadingText and that the UI clearly differentiates which operation is in progress.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'The icon swap does not change aria-busy or loadingText behavior',
                body: 'The Trash2 icon is aria-hidden in normal state; the spinner is also aria-hidden. All loading feedback for screen readers comes from aria-busy and the sr-only loadingText span.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Keep the label alongside the loading spinner for destructive operations',
                body: 'Unlike some loading patterns where the label hides, keeping "Deleting..." visible alongside the spinner reinforces what dangerous operation is running.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Button
  variant="destructive"
  useIcon={<Trash2 />}
  isLoading={isDeleting}
  loadingText="Deleting"
>
  Delete item
</Button>`}</code>
      </pre>
    </div>
  ),
}

export const IconOnly = {
  name: 'Icon Only',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Use <code className="font-mono bg-gray-100 px-1 rounded text-xs">size="icon-*"</code> for
        compact destructive icon-only buttons. Always include{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">aria-label</code>. Typically
        used with Trash2 or X icons.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">all icon sizes — destructive variant</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="destructive" size="icon-xs" useIcon={<Trash2 />} aria-label="Delete" />
          <Button variant="destructive" size="icon-sm" useIcon={<Trash2 />} aria-label="Delete" />
          <Button variant="destructive" size="icon-md" useIcon={<Trash2 />} aria-label="Delete" />
          <Button variant="destructive" size="icon-lg" useIcon={<Trash2 />} aria-label="Delete" />
          <Button variant="destructive" size="icon-xl" useIcon={<Trash2 />} aria-label="Delete" />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use destructive icon-only for inline row delete buttons in tables',
                body: 'A compact Trash2 icon button in a table row action column communicates delete intent clearly without taking horizontal space. Pair with a confirmation dialog — never delete on first click.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use destructive icon-only without a confirmation step",
                body: 'An icon button that deletes on a single click is a UX trap. The compact format makes it easy to click accidentally. Always require confirmation for irreversible row deletions.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'aria-label must state the specific item being deleted when possible',
                body: '"Delete" is acceptable; "Delete product BBCA stock" is better. Specific labels help screen reader users navigating a table of delete buttons distinguish which row each button targets.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Consider using ghost or outline for the idle icon delete button — switch to destructive only on hover',
                body: 'A table full of red delete buttons is visually aggressive. Starting the idle state as ghost and changing to destructive on hover (via onMouseEnter state) reduces visual noise while preserving the danger signal when it matters.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Button
  variant="destructive"
  size="icon-sm"
  useIcon={<Trash2 />}
  aria-label="Delete item"
  onClick={() => setConfirmOpen(true)}
/>`}</code>
      </pre>
    </div>
  ),
}

export const WithIcon = {
  name: 'With Icon',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">useIcon</code> with a
        React element — typically{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">Trash2</code> — for a labeled
        destructive button with icon. The icon reinforces the danger signal alongside the label.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">icon left (default)</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="destructive" size="xs" useIcon={<Trash2 />}>
            XSmall
          </Button>
          <Button variant="destructive" size="sm" useIcon={<Trash2 />}>
            Small
          </Button>
          <Button variant="destructive" size="md" useIcon={<Trash2 />}>
            Medium
          </Button>
          <Button variant="destructive" size="lg" useIcon={<Trash2 />}>
            Large
          </Button>
          <Button variant="destructive" size="xl" useIcon={<Trash2 />}>
            XLarge
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">icon right</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-wrap gap-3 items-center">
          <Button variant="destructive" size="xs" useIcon={<Trash2 />} iconPosition="right">
            XSmall
          </Button>
          <Button variant="destructive" size="sm" useIcon={<Trash2 />} iconPosition="right">
            Small
          </Button>
          <Button variant="destructive" size="md" useIcon={<Trash2 />} iconPosition="right">
            Medium
          </Button>
          <Button variant="destructive" size="lg" useIcon={<Trash2 />} iconPosition="right">
            Large
          </Button>
          <Button variant="destructive" size="xl" useIcon={<Trash2 />} iconPosition="right">
            XLarge
          </Button>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use Trash2 or AlertTriangle as the icon on destructive labeled buttons',
                body: 'The Trash2 icon on a delete button adds a redundant visual cue alongside the red color and label text. This triple reinforcement helps users at all ability levels recognize the danger.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use a generic icon that does not reinforce the danger",
                body: 'An arrow or chevron icon on a destructive button sends mixed signals — the icon implies navigation while the color implies danger. Use icons that communicate finality: Trash2, X, AlertTriangle.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'The icon is aria-hidden — the label must communicate the action and its consequence',
                body: 'Screen readers announce only the label. "Delete" is sufficient; "Delete and remove all data" is even better for high-stakes destructive actions.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Use iconPosition="left" for destructive labeled buttons — icon anchors the danger signal',
                body: 'The leading Trash2 icon is the first thing users scan. Placing it on the left means the danger signal appears before the label text, giving users a moment to pause before reading the action.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Button
  variant="destructive"
  useIcon={<Trash2 />}
  isLoading={isDeleting}
  onClick={handleDelete}
>
  Delete account
</Button>`}</code>
      </pre>
    </div>
  ),
}

export const FullWidth = {
  name: 'Full Width',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">fullWidth</code> to
        stretch the destructive button across its container. Typically used in confirmation dialogs
        where the danger action fills the bottom of the modal.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">confirmation dialog footer — w-72 container</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg w-72 flex flex-col gap-3">
          <Button variant="destructive" fullWidth>
            Destructive
          </Button>
          <Button variant="destructive" fullWidth useIcon={<Trash2 />}>
            Delete item
          </Button>
          <Button variant="destructive" fullWidth isLoading>
            Deleting
          </Button>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use fullWidth destructive in confirmation dialog footers',
                body: 'A full-width destructive button at the bottom of a confirmation dialog is the standard pattern. The full width makes the danger action prominent and easy to tap; the dialog context provides the confirmation step.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use fullWidth destructive as the only button without a cancel option",
                body: 'Always pair a full-width destructive button with a Cancel or Go Back button. Users must have a way to abort the operation. Stack Cancel above or below the destructive button.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Do not auto-focus the full-width destructive button when a dialog opens',
                body: 'Default focus should land on the Cancel button or the dialog heading — not the destructive action. This prevents accidental confirmation when users press Enter immediately after the dialog opens.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Place Cancel above the destructive button in stacked dialog footers',
                body: 'When Cancel and Destructive are stacked vertically, put Cancel on top. Users who want to escape typically click or tap quickly — the top button is the safer default.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<div className="flex flex-col gap-2">
  <Button variant="secondary" fullWidth onClick={onClose}>
    Cancel
  </Button>
  <Button
    variant="destructive"
    fullWidth
    useIcon={<Trash2 />}
    isLoading={isDeleting}
    loadingText="Deleting"
    onClick={handleDelete}
  >
    Delete account
  </Button>
</div>`}</code>
      </pre>
    </div>
  ),
}
