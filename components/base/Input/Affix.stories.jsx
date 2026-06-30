import Input from './Input'
import { Search, Mail, DollarSign, Percent, Globe, Lock, AtSign } from 'lucide-react'
import FieldContent from '../Field/FieldContent'
import FieldControl from '../Field/FieldControl'
import FieldPrefix from '../Field/FieldPrefix'
import FieldSuffix from '../Field/FieldSuffix'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Input Field/Affix',
}

export default meta

export const Affix = {
  name: 'Affix',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Combine <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldPrefix</code> and{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldSuffix</code> inside{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">FieldControl</code> — Input
        adjusts its padding automatically to avoid overlap.
      </p>

      <div className="flex gap-8 flex-wrap p-2">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-mono text-violet-700 mb-1">Prefix — Text</p>
          {['xs', 'sm', 'base', 'md', 'lg'].map((size) => (
            <FieldContent key={size} size={size}>
              <FieldControl>
                <FieldPrefix>Rp</FieldPrefix>
                <Input placeholder="0" />
              </FieldControl>
            </FieldContent>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-mono text-violet-700 mb-1">Suffix — Text</p>
          {['xs', 'sm', 'base', 'md', 'lg'].map((size) => (
            <FieldContent key={size} size={size}>
              <FieldControl>
                <Input placeholder="0" />
                <FieldSuffix>%</FieldSuffix>
              </FieldControl>
            </FieldContent>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-mono text-violet-700 mb-1">Prefix — Icon</p>
          {['xs', 'sm', 'base', 'md', 'lg'].map((size) => (
            <FieldContent key={size} size={size}>
              <FieldControl>
                <FieldPrefix>
                  <Search />
                </FieldPrefix>
                <Input placeholder="Search..." />
              </FieldControl>
            </FieldContent>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-mono text-violet-700 mb-1">Suffix — Icon</p>
          {['xs', 'sm', 'base', 'md', 'lg'].map((size) => (
            <FieldContent key={size} size={size}>
              <FieldControl>
                <Input placeholder="0" />
                <FieldSuffix>
                  <Percent />
                </FieldSuffix>
              </FieldControl>
            </FieldContent>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-mono text-violet-700 mb-1">Prefix + Suffix</p>
          <FieldContent size="base">
            <FieldControl>
              <FieldPrefix>
                <DollarSign />
              </FieldPrefix>
              <Input placeholder="0.00" />
              <FieldSuffix>USD</FieldSuffix>
            </FieldControl>
          </FieldContent>
          <FieldContent size="base">
            <FieldControl>
              <FieldPrefix>
                <Globe />
              </FieldPrefix>
              <Input placeholder="yoursite" />
              <FieldSuffix>.com</FieldSuffix>
            </FieldControl>
          </FieldContent>
          <FieldContent size="base">
            <FieldControl>
              <FieldPrefix>
                <AtSign />
              </FieldPrefix>
              <Input placeholder="username" />
              <FieldSuffix>
                <Lock />
              </FieldSuffix>
            </FieldControl>
          </FieldContent>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-mono text-violet-700 mb-1">Affix + Variants</p>
          <FieldContent size="base">
            <FieldControl>
              <FieldPrefix>
                <Mail />
              </FieldPrefix>
              <Input placeholder="Normal" />
            </FieldControl>
          </FieldContent>
          <FieldContent size="base" error="Invalid email.">
            <FieldControl>
              <FieldPrefix>
                <Mail />
              </FieldPrefix>
              <Input defaultValue="wrong@" />
            </FieldControl>
          </FieldContent>
          <FieldContent size="base" disabled>
            <FieldControl>
              <FieldPrefix>
                <Mail />
              </FieldPrefix>
              <Input defaultValue="Disabled" />
            </FieldControl>
          </FieldContent>
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Prefix only */}
<FieldControl>
  <FieldPrefix>Rp</FieldPrefix>
  <Input placeholder="0" />
</FieldControl>

{/* Suffix only */}
<FieldControl>
  <Input placeholder="yoursite" />
  <FieldSuffix>.com</FieldSuffix>
</FieldControl>

{/* Prefix + Suffix */}
<FieldControl>
  <FieldPrefix><DollarSign /></FieldPrefix>
  <Input placeholder="0.00" />
  <FieldSuffix>USD</FieldSuffix>
</FieldControl>`}</code>
      </pre>
    </div>
  ),
}
