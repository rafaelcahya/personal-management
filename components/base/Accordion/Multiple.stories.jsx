import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Accordion/Multiple',
}

export default meta

export const Multiple = {
  name: 'Multiple',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">type="multiple"</code> allows
        any number of items to be open simultaneously. Each item toggles independently.
      </p>

      <div className="w-full max-w-2xl">
        <Accordion type="multiple">
          <AccordionItem value="item-1">
            <AccordionTrigger>Personal Information</AccordionTrigger>
            <AccordionContent>
              Update your name, email address, and profile photo. Changes are saved automatically.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
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
        <code>{`<Accordion type="multiple">
  <AccordionItem value="item-1">
    <AccordionTrigger>Personal Information</AccordionTrigger>
    <AccordionContent>Update your name and email.</AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Notification Preferences</AccordionTrigger>
    <AccordionContent>Choose your notification channels.</AccordionContent>
  </AccordionItem>
</Accordion>`}</code>
      </pre>
    </div>
  ),
}
