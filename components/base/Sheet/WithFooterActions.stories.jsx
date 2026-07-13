'use client'
import { useState } from 'react'
import { X, Trash2, AlertTriangle } from 'lucide-react'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from './Sheet'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Sheet/With Footer Actions',
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

function SettingsSheet() {
  const [open, setOpen] = useState(false)
  const [saved, setSaved] = useState(false)

  return (
    <div className="flex flex-col gap-3">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
          >
            Open Settings
          </button>
        </SheetTrigger>
        <SheetContent side="right" size="default">
          <SheetHeader>
            <div className="flex items-start justify-between">
              <div>
                <SheetTitle>Notification Settings</SheetTitle>
                <SheetDescription className="mt-1">
                  Control when and how you receive alerts.
                </SheetDescription>
              </div>
              <SheetClose className="mt-0.5">
                <X className="size-4" />
              </SheetClose>
            </div>
          </SheetHeader>

          <div className="flex-1 px-6 py-4 flex flex-col gap-4">
            {[
              { label: 'Trade executions', desc: 'Alert when a trade is filled' },
              { label: 'Low stock alerts', desc: 'Alert when inventory falls below min' },
              { label: 'Weekly summary', desc: 'P&L digest every Monday' },
              { label: 'Goal reminders', desc: 'Running goal milestone alerts' },
            ].map((item) => (
              <label
                key={item.label}
                className="flex items-center justify-between gap-3 cursor-pointer"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
                <input type="checkbox" defaultChecked className="size-4 accent-violet-600" />
              </label>
            ))}
          </div>

          <SheetFooter>
            <SheetClose asChild>
              <button
                type="button"
                className="flex-1 sm:flex-none px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
              >
                Cancel
              </button>
            </SheetClose>
            <button
              type="button"
              onClick={() => {
                setSaved(true)
                setOpen(false)
              }}
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Save changes
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {saved && <p className="text-xs text-emerald-600">Settings saved.</p>}
    </div>
  )
}

function DeleteConfirmSheet() {
  const [open, setOpen] = useState(false)
  const [deleted, setDeleted] = useState(false)

  return (
    <div className="flex flex-col gap-3">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
          >
            <Trash2 className="size-3.5" />
            Delete Account
          </button>
        </SheetTrigger>
        <SheetContent side="bottom" size="sm">
          <SheetHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-red-500 shrink-0" />
              <SheetTitle>Delete account?</SheetTitle>
            </div>
            <SheetDescription>
              This action is permanent and cannot be undone. All your trades, inventory, and running
              data will be removed.
            </SheetDescription>
          </SheetHeader>

          <SheetFooter className="border-t-0 pt-2">
            <SheetClose asChild>
              <button
                type="button"
                className="flex-1 sm:flex-none px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
              >
                Cancel
              </button>
            </SheetClose>
            <button
              type="button"
              onClick={() => {
                setDeleted(true)
                setOpen(false)
              }}
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Yes, delete
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {deleted && <p className="text-xs text-red-500">Account deleted (demo).</p>}
    </div>
  )
}

export const WithFooterActions = {
  name: 'With Footer Actions',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">SheetFooter</code> pins actions
        to the bottom of the panel.{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">SheetClose asChild</code> lets
        you style the cancel button however you want.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">save / cancel — settings panel</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <SettingsSheet />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">destructive action — bottom sheet</span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <DeleteConfirmSheet />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'SheetFooter for any panel with a primary action',
                body: 'Whenever the user needs to Save, Submit, or Confirm — use SheetFooter. It pins actions to the bottom so they stay visible regardless of how tall the content is.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't put side-effect logic on the Cancel button",
                body: 'Cancel should always be SheetClose asChild — just closes, no side effects. Never use Cancel to also reset state, navigate, or fire an API call.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Use SheetDescription to warn before destructive actions',
                body: 'For delete or irreversible actions, put a clear warning in SheetDescription. Screen readers announce it immediately when the panel opens.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Close the sheet only on success for async actions',
                body: 'Disable the submit button while in-flight and call setOpen(false) only after the async operation completes — use controlled mode (open + onOpenChange) to manage this.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`<SheetContent>
  {/* ... body */}
  <SheetFooter>
    <SheetClose asChild>
      <Button variant="outline">Cancel</Button>
    </SheetClose>
    <Button onClick={handleSave}>Save changes</Button>
  </SheetFooter>
</SheetContent>

{/* Destructive */}
<SheetFooter>
  <SheetClose asChild>
    <Button variant="outline">Cancel</Button>
  </SheetClose>
  <Button variant="destructive" onClick={handleDelete}>
    Yes, delete
  </Button>
</SheetFooter>`}</code>
      </pre>
    </div>
  ),
}
