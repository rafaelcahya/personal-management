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

const BestPractices = ({ items }) => (
  <div className="flex flex-col gap-8 w-full max-w-2xl">
    {items.map(({ heading, cards }) => (
      <div key={heading}>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          {heading}
        </p>
        <div className="flex flex-col gap-3">
          {cards.map(({ title, body }) => (
            <div
              key={title}
              className="flex gap-3 p-4 rounded-lg border border-violet-100 bg-violet-50"
            >
              <span className="mt-0.5 shrink-0 size-4 rounded-full bg-violet-500 flex items-center justify-center text-white text-[10px] font-bold">
                ✓
              </span>
              <div>
                <p className="text-xs font-semibold text-violet-800 mb-0.5">{title}</p>
                <p className="text-xs text-violet-700 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
)

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
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">DropdownMenuRadioGroup</code>{' '}
        enforces single selection via{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">value</code> +{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">onValueChange</code>. Multiple
        independent radio groups can coexist in the same menu — each manages its own selected value.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">
          Single-select options — each group is mutually exclusive
        </span>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <RadioDemo />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use RadioGroup for mutually exclusive options',
                body: 'Theme (Light/Dark/System), sort order (Newest/Oldest), view mode (Grid/List) — options where only one can be active at a time. RadioGroup enforces that constraint automatically.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't use RadioGroup for independent toggles",
                body: 'Use DropdownMenuCheckboxItem instead. If each option can be enabled independently (show sidebar AND show toolbar), radio is wrong — it would force users to choose one.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title: 'Always provide a default value — never leave a RadioGroup unselected',
                body: 'A radio group where nothing is selected looks broken and confuses screen reader users. The initial value should match the actual app state, not an empty placeholder.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title:
                  'Wrap each RadioGroup in DropdownMenuGroup with a label when multiple coexist',
                body: 'When Theme and Density radio groups share one menu, wrap each in a DropdownMenuGroup with a label and separate them with DropdownMenuSeparator — makes clear each group is independent.',
              },
            ],
          },
        ]}
      />

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
