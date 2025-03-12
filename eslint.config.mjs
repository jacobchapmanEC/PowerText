import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module", // This is required for `import`
      globals: {
        ...globals.browser,
        chrome: "readonly",
        jQuery: "readonly",
        $: "readonly"
      }
    },
    rules: {
      "no-undef": "off", // No more false undefined variable errors
      "no-unused-vars": "warn",
      "no-redeclare": "warn"
    }
  },
  pluginJs.configs.recommended
];
