import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Accordion/Card',
}

export default meta

export const Card = {
  name: 'Card',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">variant="card"</code> renders
        each item as a standalone card with a border and rounded corners, separated by a gap. Works
        with both <code className="font-mono bg-gray-100 px-1 rounded text-xs">type="single"</code>{' '}
        and <code className="font-mono bg-gray-100 px-1 rounded text-xs">type="multiple"</code>.
      </p>

      <div className="flex flex-col gap-8 w-full max-w-2xl">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">single</span>
          <Accordion variant="card" type="single" collapsible>
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

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">multiple</span>
          <Accordion variant="card" type="multiple">
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
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Accordion variant="card" type="single" collapsible>
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
