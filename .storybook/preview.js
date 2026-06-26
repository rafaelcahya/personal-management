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
          ['Colors'],
          'Input',
          ['Button', ['Docs', 'Default', 'Secondary', 'Ghost', 'Outline', 'Link', 'Destructive']],
          'Layout',
          [
            'Section',
            [
              'Docs',
              'Overview',
              [
                'Single Section',
                'Multiple Sections',
                'No Breadcrumbs',
                'No Description',
                'No Page Header',
                'Transparent — Single Section',
                'Transparent — Multiple Sections',
                'Transparent — Mixed with Shell',
                'Loading State',
                'Empty State',
                'Error State',
                'Data State',
              ],
              'SectionCard',
              [
                'Default',
                [
                  'With Button',
                  'Without Button',
                  'No Icon',
                  'Title Only',
                  'Description Only',
                  'Button Only',
                  'No Header',
                  'Header Only',
                ],
                'Transparent',
                [
                  'With Button',
                  'Without Button',
                  'No Icon',
                  'Title Only',
                  'Description Only',
                  'Button Only',
                  'No Header',
                  'Header Only',
                ],
              ],
            ],
          ],
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
