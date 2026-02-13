import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import tsParser from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier";

const nextCoreWebVitals = nextPlugin.configs?.["core-web-vitals"] ?? {};

export default [
  {
    ignores: [".next/**", "node_modules/**"],
  },

  js.configs.recommended,

  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...(nextCoreWebVitals.rules ?? {}),
      quotes: ["error", "double"],
      semi: ["error", "always"],
    },
  },

  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      "no-undef": "off",
    },
  },
     eslintConfigPrettier,
];
