/** @type {import('@storybook/nextjs').StorybookConfig} */
const config = {
  stories: ['../components/base/**/*.stories.@(js|jsx)'],
  addons: ['@storybook/addon-themes'],

  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
}

export default config
