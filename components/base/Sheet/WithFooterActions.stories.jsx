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
    <div className="flex flex-col gap-8 w-full max-w-xl">
      <p className="text-sm text-gray-500 leading-relaxed">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">SheetFooter</code> pins actions
        to the bottom of the panel.{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">SheetClose asChild</code> lets
        you style the cancel button however you want.
      </p>

      <div className="flex flex-col gap-3">
        <span className="text-xs text-gray-400">save / cancel</span>
        <SettingsSheet />
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs text-gray-400">destructive action — bottom sheet</span>
        <DeleteConfirmSheet />
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
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
