import FieldGroup from './FieldGroup'
import FieldContainer from './FieldContainer'
import FieldContent from './FieldContent'
import FieldControl from './FieldControl'
import FieldLabel from './FieldLabel'
import FieldDescription from './FieldDescription'
import FieldPrefix from './FieldPrefix'
import FieldSuffix from './FieldSuffix'
import Input from '../Input/Input'
import { DollarSign } from 'lucide-react'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Field/FieldGroup',
}

export default meta

export const MultipleColumns = {
  name: 'Multiple Columns',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldGroup</code> lays out
        fields in a CSS grid. Pass a number to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">cols</code> for fixed columns.
      </p>

      <div className="flex flex-col gap-8 w-full max-w-2xl">
        {[1, 2, 3, 4].map((n) => (
          <div key={n}>
            <p className="text-xs font-mono text-violet-700 mb-2">cols={n}</p>
            <FieldGroup cols={n}>
              {Array.from({ length: n }).map((_, i) => (
                <FieldContent key={i} size="base">
                  <FieldLabel>Field {i + 1}</FieldLabel>
                  <FieldControl>
                    <Input placeholder={`Field ${i + 1}`} />
                  </FieldControl>
                </FieldContent>
              ))}
            </FieldGroup>
          </div>
        ))}
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldGroup cols={2}>
  <FieldContent size="base">
    <FieldLabel>First Name</FieldLabel>
    <FieldControl><Input placeholder="John" /></FieldControl>
  </FieldContent>
  <FieldContent size="base">
    <FieldLabel>Last Name</FieldLabel>
    <FieldControl><Input placeholder="Doe" /></FieldControl>
  </FieldContent>
</FieldGroup>`}</code>
      </pre>
    </div>
  ),
}

export const Responsive = {
  name: 'Responsive',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Pass a breakpoint object to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">cols</code> for responsive
        column counts. Resize the viewport to see the layout change.
      </p>

      <div className="w-full max-w-2xl">
        <p className="text-xs font-mono text-violet-700 mb-2">{'cols={{ xs: 1, md: 2, lg: 3 }}'}</p>
        <FieldGroup cols={{ xs: 1, md: 2, lg: 3 }}>
          {['First Name', 'Last Name', 'Email', 'Phone', 'City', 'Postal Code'].map((label) => (
            <FieldContent key={label} size="base">
              <FieldLabel>{label}</FieldLabel>
              <FieldControl>
                <Input placeholder={label} />
              </FieldControl>
            </FieldContent>
          ))}
        </FieldGroup>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldGroup cols={{ xs: 1, md: 2, lg: 3 }}>
  <FieldContent size="base">...</FieldContent>
  <FieldContent size="base">...</FieldContent>
  {/* ... */}
</FieldGroup>`}</code>
      </pre>
    </div>
  ),
}

export const MixedLayout = {
  name: 'Mixed Layout',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Combine <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldGroup</code> and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldContainer</code> to build
        forms with mixed single-column and multi-column sections.
      </p>

      <div className="w-full max-w-lg">
        <FieldContainer gap="md">
          <FieldGroup cols={2}>
            <FieldContent size="base" required>
              <FieldLabel>First Name</FieldLabel>
              <FieldControl>
                <Input placeholder="John" />
              </FieldControl>
            </FieldContent>
            <FieldContent size="base" required>
              <FieldLabel>Last Name</FieldLabel>
              <FieldControl>
                <Input placeholder="Doe" />
              </FieldControl>
            </FieldContent>
          </FieldGroup>

          <FieldContent size="base" required>
            <FieldLabel>Email</FieldLabel>
            <FieldControl>
              <Input type="email" placeholder="john@example.com" />
            </FieldControl>
            <FieldDescription>We'll never share your email.</FieldDescription>
          </FieldContent>

          <FieldGroup cols={2}>
            <FieldContent size="base">
              <FieldLabel>Amount</FieldLabel>
              <FieldControl>
                <FieldPrefix>
                  <DollarSign />
                </FieldPrefix>
                <Input type="number" placeholder="0.00" />
                <FieldSuffix>USD</FieldSuffix>
              </FieldControl>
            </FieldContent>
            <FieldContent size="base">
              <FieldLabel>Discount</FieldLabel>
              <FieldControl>
                <Input type="number" placeholder="0" />
                <FieldSuffix>%</FieldSuffix>
              </FieldControl>
            </FieldContent>
          </FieldGroup>
        </FieldContainer>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<FieldContainer gap="md">
  <FieldGroup cols={2}>
    <FieldContent size="base" required>
      <FieldLabel>First Name</FieldLabel>
      <FieldControl><Input placeholder="John" /></FieldControl>
    </FieldContent>
    <FieldContent size="base" required>
      <FieldLabel>Last Name</FieldLabel>
      <FieldControl><Input placeholder="Doe" /></FieldControl>
    </FieldContent>
  </FieldGroup>

  <FieldContent size="base" required>
    <FieldLabel>Email</FieldLabel>
    <FieldControl><Input type="email" placeholder="john@example.com" /></FieldControl>
  </FieldContent>
</FieldContainer>`}</code>
      </pre>
    </div>
  ),
}
