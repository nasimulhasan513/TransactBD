const js = require("@eslint/js");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const typescriptParser = require("@typescript-eslint/parser");
const importPlugin = require("eslint-plugin-import");
const prettier = require("eslint-config-prettier");

module.exports = [
  js.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: ["**/node_modules/**", "**/dist/**", "**/coverage/**"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./tsconfig.base.json", "./packages/*/tsconfig.json", "./examples/*/tsconfig.json"],
        tsconfigRootDir: __dirname,
      },
      globals: {
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslint,
      import: importPlugin,
    },
    rules: {
      ...typescriptEslint.configs.recommended.rules,
      "import/order": "off",
      "import/no-unresolved": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-empty": "warn",
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: ["./tsconfig.base.json", "./packages/*/tsconfig.json", "./examples/*/tsconfig.json"],
        },
      },
    },
  },
  prettier,
];
