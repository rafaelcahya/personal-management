// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [...compat.extends("next/core-web-vitals", "next/typescript"), {
  rules: {
    "@typescript-eslint/no-unused-vars": ["error", {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
      destructuredArrayIgnorePattern: "^_",
    }],
  },
}, {
  files: ["cypress/**/*.cy.js", "cypress/**/*.js"],
  rules: {
    "@typescript-eslint/no-unused-expressions": "off",
    "@typescript-eslint/no-require-imports": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "no-unused-vars": "off",
  },
}, ...storybook.configs["flat/recommended"], {
  files: ["components/base/**/*.jsx"],
  rules: {
    "react/no-unescaped-entities": "off",
    "storybook/no-redundant-story-name": "off",
    "@typescript-eslint/no-unused-vars": "off",
  },
}];

export default eslintConfig;
