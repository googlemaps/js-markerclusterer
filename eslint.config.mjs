import { defineConfig, globalIgnores } from "eslint/config";
import jest from "eslint-plugin-jest";
import globals from "globals";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores([
    "**/bazel-*",
    "**/coverage/",
    "**/dist/",
    "**/docs/",
    "**/lib/",
    "**/node_modules/",
    "**/public/",
  ]),
  {
    extends: compat.extends(
      "eslint:recommended",
      "plugin:prettier/recommended"
    ),

    plugins: {
      jest,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...jest.environments.globals.globals,
        google: "readonly",
      },

      ecmaVersion: 12,
      sourceType: "module",

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    rules: {
      "no-var": 2,
      "prefer-arrow-callback": 2,
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    extends: compat.extends("plugin:@typescript-eslint/recommended"),

    plugins: {
      "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
      parser: tsParser,
    },

    rules: {
      "@typescript-eslint/ban-ts-comment": 0,
      "@typescript-eslint/no-empty-function": 1,
      "@typescript-eslint/member-ordering": 1,
      "@typescript-eslint/no-empty-object-type": 1,
      "@typescript-eslint/no-unsafe-function-type": 1,
      "@typescript-eslint/no-wrapper-object-types": 1,

      "@typescript-eslint/explicit-member-accessibility": [
        1,
        {
          accessibility: "explicit",

          overrides: {
            accessors: "explicit",
            constructors: "no-public",
            methods: "explicit",
            properties: "explicit",
            parameterProperties: "explicit",
          },
        },
      ],
    },
  },
]);
