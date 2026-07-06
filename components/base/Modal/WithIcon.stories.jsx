import { Settings, AlertTriangle, Info } from 'lucide-react'
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalHeaderContent,
  ModalIcon,
  ModalBody,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalClose,
} from './Modal'
import Button from '@/components/base/Button/Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Modal/WithIcon',
}

export default meta

export const WithIcon = {
  name: 'With Icon',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        ModalHeader with <code className="font-mono bg-gray-100 px-1 rounded">layout="beside"</code>{' '}
        places a ModalIcon on the left and the title+description block on the right.
      </p>

      <div className="flex flex-col gap-5 w-full max-w-2xl">
        {/* Title + Description */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">title + description (default variant)</span>
          <Modal>
            <ModalTrigger asChild>
              <Button variant="outline">Open — title + description</Button>
            </ModalTrigger>
            <ModalContent>
              <ModalHeader layout="beside">
                <ModalIcon icon={Settings} />
                <ModalHeaderContent>
                  <ModalTitle>Settings</ModalTitle>
                  <ModalDescription>Manage your account preferences.</ModalDescription>
                </ModalHeaderContent>
              </ModalHeader>
              <ModalBody>
                <p className="text-sm text-slate-600">Modal body content goes here.</p>
              </ModalBody>
              <ModalFooter>
                <ModalClose asChild>
                  <Button variant="outline">Cancel</Button>
                </ModalClose>
                <Button>Save</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>

        {/* Title only */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">title only</span>
          <Modal>
            <ModalTrigger asChild>
              <Button variant="outline">Open — title only</Button>
            </ModalTrigger>
            <ModalContent>
              <ModalHeader layout="beside">
                <ModalIcon icon={Info} />
                <ModalTitle>Information</ModalTitle>
              </ModalHeader>
              <ModalBody>
                <p className="text-sm text-slate-600">Modal body content goes here.</p>
              </ModalBody>
              <ModalFooter>
                <ModalClose asChild>
                  <Button>Got it</Button>
                </ModalClose>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>

        {/* Description only */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">description only</span>
          <Modal>
            <ModalTrigger asChild>
              <Button variant="outline">Open — description only</Button>
            </ModalTrigger>
            <ModalContent>
              <ModalHeader layout="beside">
                <ModalIcon
                  icon={AlertTriangle}
                  className="bg-amber-50"
                  iconClassName="text-amber-600"
                />
                <ModalDescription>This action cannot be undone.</ModalDescription>
              </ModalHeader>
              <ModalFooter>
                <ModalClose asChild>
                  <Button variant="outline">Cancel</Button>
                </ModalClose>
                <Button variant="destructive">Delete</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>

        {/* Bordered variant */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">
            bordered variant — ModalHeader + ModalBody both use padding={'{{ x: 4 }}'}
          </span>
          <Modal>
            <ModalTrigger asChild>
              <Button variant="outline">Open — bordered variant</Button>
            </ModalTrigger>
            <ModalContent variant="bordered" borderColor="border-slate-200">
              <ModalHeader layout="beside" padding={{ x: 4 }}>
                <ModalIcon icon={Settings} />
                <ModalHeaderContent>
                  <ModalTitle>Settings</ModalTitle>
                  <ModalDescription>Manage your account preferences.</ModalDescription>
                </ModalHeaderContent>
              </ModalHeader>
              <ModalBody padding={{ x: 4 }}>
                <p className="text-sm text-slate-600">
                  Body uses{' '}
                  <code className="bg-gray-100 px-1 rounded text-xs">padding={'{{ x: 4 }}'}</code>{' '}
                  to align with the header's left edge.
                </p>
              </ModalBody>
              <ModalFooter>
                <ModalClose asChild>
                  <Button variant="outline">Cancel</Button>
                </ModalClose>
                <Button>Save</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      </div>
    </div>
  ),
}
