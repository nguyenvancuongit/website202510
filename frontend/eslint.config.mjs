import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

const eslintConfig = [
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // Browser globals
        window: "readonly",
        document: "readonly",
        console: "readonly",
        localStorage: "readonly",
        fetch: "readonly",
        URL: "readonly",
        Image: "readonly",
        HTMLElement: "readonly",
        HTMLInputElement: "readonly",
        HTMLVideoElement: "readonly",
        HTMLButtonElement: "readonly",
        HTMLImageElement: "readonly",
        File: "readonly",
        FileList: "readonly",
        FormData: "readonly",
        Blob: "readonly",
        URLSearchParams: "readonly",
        RequestInit: "readonly",
        Response: "readonly",
        React: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        confirm: "readonly",
        KeyboardEvent: "readonly",
        // Node.js globals for config files
        process: "readonly",
        require: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "@next/next": nextPlugin,
      "simple-import-sort": simpleImportSort,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // Import sorting rules
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // External packages (React first, then other libraries)
            ["^react", "^@?\\w"],
            // Internal packages (shadcn/ui components, etc.)
            ["^@/"],
            // Relative imports
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            // Style imports
            ["^.+\\.s?css$"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",

      // General code quality rules
      "prefer-const": "error",
      "no-var": "error",
      "no-console": "warn",
      "no-debugger": "error",
      eqeqeq: ["error", "always"],
      quotes: ["error", "double", { avoidEscape: true }],

      // TypeScript rules
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      // Disable the base no-unused-vars rule in favor of TypeScript version
      "no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "warn",

      // React rules
      "react/jsx-props-no-spreading": "off",
      "react/prop-types": "off",
      "react/require-default-props": "off",
      "react/jsx-uses-react": "off", // Not needed with React 17+ JSX transform
      "react/jsx-uses-vars": "error",
      "react/react-in-jsx-scope": "off", // Not needed with React 17+ JSX transform

      // React Hooks rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Next.js rules
      "@next/next/no-html-link-for-pages": "error",
      "@next/next/no-img-element": "error",
    },
  },
  // Special rules for type definition files
  {
    files: ["**/types/**/*.ts", "**/*.types.ts", "**/constants/**/*.ts"],
    rules: {
      // Allow unused variables in type definition files (enums, constants, types)
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "*.config.{js,ts,mjs}",
      "tailwind.config.{js,ts}",
      ".vscode/**",
      "yarn.lock",
      "package-lock.json",
    ],
  },
];

export default eslintConfig;
