/** @type {import('@storybook/nextjs').StorybookConfig} */
const config = {
  stories: ['../components/base/**/*.stories.@(js|jsx)'],
  addons: ['@storybook/addon-themes'],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
}

export default config
