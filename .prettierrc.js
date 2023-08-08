/** @type {import('prettier').Config} */
module.exports = {
  arrowParens: "avoid",
  bracketSameLine: false,
  bracketSpacing: true,
  embeddedLanguageFormatting: "auto",
  endOfLine: "lf",
  htmlWhitespaceSensitivity: "css",
  insertPragma: false,
  jsxSingleQuote: false,
  printWidth: 80,
  proseWrap: "always",
  quoteProps: "as-needed",
  requirePragma: false,
  semi: false,
  singleAttributePerLine: false,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "all",
  useTabs: false,
  overrides: [{ files: ["**/*.json"], options: { useTabs: false } }],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrder: [
    "^(react/(.*)$)|^(react$)",
    "^(@remix-run/(.*)$)|^(@remix-run$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "^types$",
    "^~/types",
    "^~/routes",
    "^~/configs",
    "^~/services",
    "^~/libs",
    "^~/helpers",
    "^~/utils",
    "^~/hooks",
    "^~/components",
    "^~/registry",
    "^~/models",
    "^~/data",
    "^~/schemas",
    "^~/styles",
    "",
    "^[./]",
  ],
  plugins: [require("@ianvs/prettier-plugin-sort-imports"), require("prettier-plugin-tailwindcss")],
}
