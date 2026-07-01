import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './DropdownMenu'
import Button from '@/components/base/Button/Button'

/** @type {import('@storybook/nextjs').Meta} */
const meta = { title: 'DropdownMenu/Radio Group' }
export default meta

function RadioDemo() {
  const [theme, setTheme] = useState('system')
  const [density, setDensity] = useState('default')

  return (
    <div className="flex flex-wrap gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">Single radio group</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Theme: {theme}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
              <DropdownMenuRadioItem value="light" label="Light" />
              <DropdownMenuRadioItem value="dark" label="Dark" />
              <DropdownMenuRadioItem value="system" label="System" />
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">Multiple radio groups</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Appearance
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup label="Theme">
              <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                <DropdownMenuRadioItem value="light" label="Light" />
                <DropdownMenuRadioItem value="dark" label="Dark" />
                <DropdownMenuRadioItem value="system" label="System" />
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup label="Density">
              <DropdownMenuRadioGroup value={density} onValueChange={setDensity}>
                <DropdownMenuRadioItem value="compact" label="Compact" />
                <DropdownMenuRadioItem value="default" label="Default" />
                <DropdownMenuRadioItem value="comfortable" label="Comfortable" />
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="text-xs text-gray-500 self-center">
        <p>
          Theme: <span className="text-violet-600">{theme}</span>
        </p>
        <p>
          Density: <span className="text-violet-600">{density}</span>
        </p>
      </div>
    </div>
  )
}

export const RadioGroup = {
  name: 'Radio Group',
  render: () => (
    <div className="flex flex-col gap-10 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">DropdownMenuRadioGroup</code>{' '}
        enforces single selection via{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">value</code> +{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">onValueChange</code>. Multiple
        independent radio groups can coexist in the same menu.
      </p>

      <RadioDemo />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`const [theme, setTheme] = useState('system')

<DropdownMenuContent>
  <DropdownMenuGroup label="Theme">
    <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
      <DropdownMenuRadioItem value="light" label="Light" />
      <DropdownMenuRadioItem value="dark" label="Dark" />
      <DropdownMenuRadioItem value="system" label="System" />
    </DropdownMenuRadioGroup>
  </DropdownMenuGroup>
</DropdownMenuContent>`}</code>
      </pre>
    </div>
  ),
}
