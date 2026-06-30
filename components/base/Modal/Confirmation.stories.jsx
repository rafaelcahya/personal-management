import { useState } from 'react'
import { TriangleAlert, Trash2, UserPen, Plus } from 'lucide-react'
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalClose,
} from './Modal'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Modal/Example',
}

export default meta

const inputClass =
  'w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground'
const labelClass = 'text-sm font-medium text-foreground'

export const Example = {
  name: 'Example',
  render: () => {
    const [deleteResult, setDeleteResult] = useState(null)
    const [discardResult, setDiscardResult] = useState(null)

    return (
      <div className="flex flex-col items-center gap-6 w-full">
        <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
          Common modal usage examples — confirmation dialogs and forms.
        </p>

        <div className="flex flex-col gap-5 w-full max-w-2xl">
          {/* Delete confirmation */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-gray-400">delete confirmation</span>
            <div className="flex items-center gap-3">
              <Modal>
                <ModalTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive text-white text-sm font-medium hover:bg-destructive/90 transition-colors"
                  >
                    <Trash2 size={14} />
                    Delete Item
                  </button>
                </ModalTrigger>
                <ModalContent size="sm" showCloseButton={false}>
                  <ModalHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/10 shrink-0">
                        <TriangleAlert size={18} className="text-destructive" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <ModalTitle>Delete Item?</ModalTitle>
                        <ModalDescription>
                          This action cannot be undone. The item will be permanently removed.
                        </ModalDescription>
                      </div>
                    </div>
                  </ModalHeader>
                  <ModalFooter>
                    <ModalClose asChild>
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                      >
                        Cancel
                      </button>
                    </ModalClose>
                    <ModalClose asChild>
                      <button
                        type="button"
                        onClick={() => setDeleteResult('deleted')}
                        className="inline-flex items-center px-4 py-2 rounded-lg bg-destructive text-white text-sm font-medium hover:bg-destructive/90 transition-colors"
                      >
                        Delete
                      </button>
                    </ModalClose>
                  </ModalFooter>
                </ModalContent>
              </Modal>
              {deleteResult && (
                <span className="text-xs text-gray-400">result: {deleteResult}</span>
              )}
            </div>
          </div>

          {/* Discard changes */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-gray-400">discard changes</span>
            <div className="flex items-center gap-3">
              <Modal>
                <ModalTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                  >
                    Discard Changes
                  </button>
                </ModalTrigger>
                <ModalContent size="sm" showCloseButton={false}>
                  <ModalHeader>
                    <ModalTitle>Discard Changes?</ModalTitle>
                    <ModalDescription>
                      You have unsaved changes. Leaving now will discard everything you have edited.
                    </ModalDescription>
                  </ModalHeader>
                  <ModalFooter>
                    <ModalClose asChild>
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        Keep Editing
                      </button>
                    </ModalClose>
                    <ModalClose asChild>
                      <button
                        type="button"
                        onClick={() => setDiscardResult('discarded')}
                        className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium text-destructive border-destructive/30 hover:bg-destructive/5 transition-colors"
                      >
                        Discard
                      </button>
                    </ModalClose>
                  </ModalFooter>
                </ModalContent>
              </Modal>
              {discardResult && (
                <span className="text-xs text-gray-400">result: {discardResult}</span>
              )}
            </div>
          </div>

          {/* Edit profile form */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-gray-400">edit profile form</span>
            <div>
              <Modal>
                <ModalTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                  >
                    <UserPen size={14} />
                    Edit Profile
                  </button>
                </ModalTrigger>
                <ModalContent>
                  <ModalHeader>
                    <ModalTitle>Edit Profile</ModalTitle>
                    <ModalDescription>Update your display name, email, and bio.</ModalDescription>
                  </ModalHeader>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}>Display Name</label>
                      <input type="text" defaultValue="Rafael Cahya" className={inputClass} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}>Email</label>
                      <input type="email" defaultValue="cahya@example.com" className={inputClass} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}>Bio</label>
                      <textarea
                        rows={3}
                        defaultValue="Personal finance enthusiast."
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <ModalFooter>
                    <ModalClose asChild>
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                      >
                        Cancel
                      </button>
                    </ModalClose>
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      Save Changes
                    </button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </div>
          </div>

          {/* Add trade form */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-gray-400">add trade form</span>
            <div>
              <Modal>
                <ModalTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    <Plus size={14} />
                    Add Trade
                  </button>
                </ModalTrigger>
                <ModalContent size="lg">
                  <ModalHeader>
                    <ModalTitle>Add New Trade</ModalTitle>
                    <ModalDescription>
                      Record a buy or sell transaction to your portfolio.
                    </ModalDescription>
                  </ModalHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}>Symbol</label>
                      <input type="text" placeholder="e.g. BBCA" className={inputClass} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}>Type</label>
                      <select className={inputClass}>
                        <option>Buy</option>
                        <option>Sell</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}>Lot</label>
                      <input type="number" placeholder="0" className={inputClass} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}>Price per Share</label>
                      <input type="number" placeholder="0" className={inputClass} />
                    </div>
                    <div className="col-span-2 flex flex-col gap-1.5">
                      <label className={labelClass}>Date</label>
                      <input type="date" className={inputClass} />
                    </div>
                    <div className="col-span-2 flex flex-col gap-1.5">
                      <label className={labelClass}>Notes (optional)</label>
                      <textarea rows={2} placeholder="Reason for trade..." className={inputClass} />
                    </div>
                  </div>
                  <ModalFooter>
                    <ModalClose asChild>
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                      >
                        Cancel
                      </button>
                    </ModalClose>
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      Add Trade
                    </button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </div>
          </div>
        </div>

        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
          <code>{`<Modal>
  <ModalTrigger asChild>
    <button type="button">Edit Profile</button>
  </ModalTrigger>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Edit Profile</ModalTitle>
      <ModalDescription>Update your display name and email.</ModalDescription>
    </ModalHeader>
    <div className="flex flex-col gap-4">
      <input type="text" placeholder="Your name" />
      <input type="email" placeholder="you@example.com" />
    </div>
    <ModalFooter>
      <ModalClose asChild>
        <button type="button">Cancel</button>
      </ModalClose>
      <button type="button">Save Changes</button>
    </ModalFooter>
  </ModalContent>
</Modal>`}</code>
        </pre>
      </div>
    )
  },
}
