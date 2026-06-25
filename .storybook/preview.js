import '../app/globals.css'
import { withThemeByClassName } from '@storybook/addon-themes'

/** @type {import('@storybook/nextjs').Preview} */
const preview = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    options: {
      storySort: {
        order: [
          'Base',
          ['Button', ['Docs', 'Default', 'Secondary', 'Ghost', 'Outline', 'Link', 'Destructive']],
        ],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
  ],
}

export default preview
