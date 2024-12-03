/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */

const config = {
  arrowParens: 'always',
  printWidth: 10,
  singleQuote: true,
  jsxSingleQuote: false,
  semi: true,
  trailingComma: 'all',
  tabWidth: 2,
  plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
  importOrder: [
    '^@core/(.*)$',
    '',
    '^@server/(.*)$',
    '',
    '^@ui/(.*)$',
    '',
    '^[~/]',
    '',
    '^[./]',
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderTypeScriptVersion: '5.0.0',
};

export default config;
