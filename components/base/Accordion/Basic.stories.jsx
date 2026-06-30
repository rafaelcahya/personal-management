import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Accordion/Basic',
}

export default meta

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">type="single"</code> allows
        only one item open at a time. All items start closed by default. Add{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">collapsible</code> to allow
        closing the currently open item by clicking its trigger again.
      </p>

      <div className="flex flex-col gap-8 w-full max-w-2xl">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">default</span>
          <Accordion type="single">
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
          <span className="text-xs text-gray-400">collapsible</span>
          <Accordion type="single" collapsible>
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
        <code>{`{/* Default — only one item open, cannot close it */}
<Accordion type="single">
  <AccordionItem value="item-1">
    <AccordionTrigger>Personal Information</AccordionTrigger>
    <AccordionContent>Update your name and email.</AccordionContent>
  </AccordionItem>
</Accordion>

{/* Collapsible — clicking open trigger closes it */}
<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Personal Information</AccordionTrigger>
    <AccordionContent>Update your name and email.</AccordionContent>
  </AccordionItem>
</Accordion>`}</code>
      </pre>
    </div>
  ),
}
