/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions */

const config = {
  arrowParens: "always",
  printWidth: 110,
  singleQuote: true,
  semi: true,
  trailingComma: "all",
  tabWidth: 2,
  plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
