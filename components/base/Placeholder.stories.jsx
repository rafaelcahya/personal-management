import Placeholder from './Placeholder'

/** @type {import('@storybook/nextjs').Meta<typeof Placeholder>} */
const meta = {
  title: 'Base/Placeholder',
  component: Placeholder,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
  },
}

export default meta

export const Default = {
  args: {
    title: 'Placeholder',
    description: 'A base component demonstrating project CSS variables.',
  },
}

export const DarkMode = {
  args: {
    title: 'Placeholder (Dark)',
    description: 'Same component rendered inside the dark theme class.',
  },
  parameters: {
    themes: {
      themeOverride: 'dark',
    },
  },
}
