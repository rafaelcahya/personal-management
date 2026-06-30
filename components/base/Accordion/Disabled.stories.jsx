import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Accordion/Disabled',
}

export default meta

export const Disabled = {
  name: 'Disabled',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">disabled</code> on an{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">AccordionItem</code> to prevent
        that item from being opened. The trigger becomes non-interactive and visually dimmed.
      </p>

      <div className="w-full max-w-2xl">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Personal Information</AccordionTrigger>
            <AccordionContent>
              Update your name, email address, and profile photo. Changes are saved automatically.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" disabled>
            <AccordionTrigger>Notification Preferences</AccordionTrigger>
            <AccordionContent>
              Choose which notifications you want to receive — push, email, or in-app alerts.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Security & Privacy</AccordionTrigger>
            <AccordionContent>
              Manage your password, two-factor authentication, and connected devices.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<AccordionItem value="item-2" disabled>
  <AccordionTrigger>Notification Preferences</AccordionTrigger>
  <AccordionContent>...</AccordionContent>
</AccordionItem>`}</code>
      </pre>
    </div>
  ),
}
